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
import { FireAuthProvider } from '@providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo/fire-photo';
import { ToastHelper } from '@helpers/toast';
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
    private toast: ToastHelper
  ) {}

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.user = this.fireAuth.getUserSession();
    this.checkLocation();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
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
        alert('The following error occurred: ' + JSON.parse(error))
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
        this.metadata.latitude = position.coords.latitude.toString();
        this.metadata.longitude = position.coords.longitude.toString();
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
        this.metadata.location = `${location[0].locality}, ${
          location[0].countryName
        }`;
        this.canTakePicture = true;
      })
      .catch(error => alert('Error getting location ' + error));
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      targetWidth: 1280,
      targetHeight: 720
    };

    if (this.metadata.title && this.metadata.description) {
      this.camera
        .getPicture(options)
        .then(picture => {
          this.firePhoto.addPhotoInFirebase(this.user, picture, this.metadata);
          this.navCtrl.pop();
        })
        .catch(error => console.log('error', error));
    } else {
      this.toast.display(`Title and description must not be empty.`);
    }
  }
}
