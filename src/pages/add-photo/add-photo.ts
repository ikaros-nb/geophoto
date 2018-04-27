import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';
import { ToastHelper } from '../../helpers/toast';
import { User } from '../../models/user';
import { Metadata } from './../../models/metadata';

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
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private toast: ToastHelper
  ) {}

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.user = this.fireAuth.getUserSession();
    this.getPosition();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
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
