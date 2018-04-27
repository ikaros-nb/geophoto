import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';
import { Metadata } from './../../models/metadata';

@Component({
  selector: 'page-add-photo',
  templateUrl: 'add-photo.html'
})
export class AddPhotoPage {
  metadata = {} as Metadata;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private geolocation: Geolocation,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider
  ) {}

  ionViewDidLoad() {
    this.metadata.location = 'Paris, FR';
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.metadata.latitude = resp.coords.latitude.toString();
        this.metadata.longitude = resp.coords.longitude.toString();
      })
      .catch(error => {
        console.log('Error getting location', error);
      });
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

    this.camera
      .getPicture(options)
      .then(picture =>
        this.firePhoto.addPhotoInFirebase(
          this.fireAuth.getUserSession(),
          picture,
          this.metadata
        )
      )
      .catch(error => console.log('error', error));
  }
}
