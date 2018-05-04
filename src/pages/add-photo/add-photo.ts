import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';
import { FireAuthProvider } from '@providers/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo';
import { ToastHelper } from '@helpers/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user';
import { Metadata } from '@models/metadata';

@Component({
  selector: 'page-add-photo',
  templateUrl: 'add-photo.html'
})
export class AddPhotoPage {
  user = {} as User;
  metadata = {} as Metadata;
  canTakePicture: boolean;
  photoForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private camera: Camera,
    private diagnostic: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private toast: ToastHelper,
    private formBuilder: FormBuilder
  ) {
    this.initPhotoForm();
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.user = this.fireAuth.getUserSession();
    this.checkLocation();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  initPhotoForm() {
    this.photoForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      latitude: ['', Validators.compose([Validators.required])],
      longitude: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])]
    });
  }

  checkLocation() {
    this.diagnostic
      .isGpsLocationEnabled()
      .then(enabled => {
        this.toast.display(
          `GPS location is ${enabled ? 'enabled' : 'disabled'}`
        );
        if (enabled) this.getPosition();
        else this.requestLocation();
      })
      .catch(error =>
        alert('The following error occurred: ' + JSON.stringify(error))
      );
  }

  requestLocation() {
    this.locationAccuracy.canRequest().then(canRequest => {
      if (canRequest) {
        this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(() => this.getPosition())
          .catch(error => {
            if (
              confirm(
                `Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?`
              )
            ) {
              this.diagnostic.switchToLocationSettings();
            } else {
              this.toast.display(`You must enable GPS location to continue.`);
            }
          });
      }
    });
  }

  getPosition() {
    const options = { enableHighAccuracy: true };
    this.geolocation
      .getCurrentPosition(options)
      .then((position: Geoposition) => {
        this.photoForm.controls.latitude.setValue(
          position.coords.latitude.toString()
        );
        this.photoForm.controls.longitude.setValue(
          position.coords.longitude.toString()
        );
        this.getLocation(position);
      })
      .catch(error => {
        alert('Error getting position ' + error);
      });
  }

  getLocation(position: Geoposition) {
    this.nativeGeocoder
      .reverseGeocode(position.coords.latitude, position.coords.longitude)
      .then((location: NativeGeocoderReverseResult) => {
        //alert(JSON.stringify(location));
        this.photoForm.controls.location.setValue(
          `${location[0].locality}, ${location[0].countryName}`
        );
        this.canTakePicture = true;
      })
      .catch(error => alert('Error getting location ' + error));
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1280,
      targetHeight: 720,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false
    };

    let formValue = this.photoForm.value;
    if (this.photoForm.valid) {
      this.camera
        .getPicture(options)
        .then(picture => {
          this.metadata.title = formValue.title;
          this.metadata.latitude = formValue.latitude;
          this.metadata.longitude = formValue.longitude;
          this.metadata.location = formValue.location;
          this.metadata.description = formValue.description;

          this.firePhoto.addPhotoInFirebase(this.user, picture, this.metadata);
          this.navCtrl.pop();
        })
        .catch(error => console.log('error', error));
    } else {
      if (!formValue.title || !formValue.description) {
        this.toast.display(`Title and description must not be empty.`);
      }
    }
  }
}
