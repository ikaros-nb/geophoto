import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photosRef: firebase.database.Reference = firebase.database().ref(`photos`);
  photos: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private camera: Camera
  ) {}

  ionViewDidLoad() {
    this.photosRef.orderByChild('createdAt').on('value', itemSnapshot => {
      this.photos = [];
      itemSnapshot.forEach(itemSnap => {
        this.photos.push(itemSnap.val());
        return false;
      });
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
    console.log(this.fireAuth.getUserSession().pseudo);

    firebase.auth().onAuthStateChanged(user => {
      this.camera
        .getPicture(options)
        .then(picture => {
          const currentDate = new Date();
          const selfieRef = firebase
            .storage()
            .ref(`photos/${user.uid}/photo-${currentDate.getTime()}.jpg`);
          selfieRef
            .putString(picture, 'base64', { contentType: 'image/jpeg' })
            .then(savedPicture => {
              this.photosRef.push({
                createdAt: currentDate.toJSON(),
                pictureURL: savedPicture.downloadURL,
                user: {
                  pseudo: this.fireAuth.getUserSession().pseudo,
                  userID: user.uid
                }
              });
            });
        })
        .catch(error => console.log('error', error));
    });
  }
}
