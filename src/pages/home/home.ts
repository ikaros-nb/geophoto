import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { PhotoInfoPage } from '../photo-info/photo-info';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photosRef: AngularFireList<Photo> = this.afDB.list(`photos`, ref =>
    ref.orderByChild('createdAt')
  );
  photos: Observable<Photo[]>;
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private afDB: AngularFireDatabase,
    private camera: Camera
  ) {
    this.photos = this.photosRef.valueChanges().map(photos => photos.reverse());
  }

  ionViewDidLoad() {
    this.fireAuth.getAuthState().subscribe(user => {
      if (user && user.email && user.uid) {
        this.fireAuth
          .getUserRefInFirebase(user)
          .subscribe(() => (this.user = this.fireAuth.getUserSession()));
      }
    });
  }

  goToPhotoInfo(photo) {
    this.navCtrl.push(PhotoInfoPage, { photo });
  }

  takePicture(fab: FabContainer) {
    fab.close();

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
      .then(picture => {
        const currentDate = new Date();
        const selfieRef = firebase
          .storage()
          .ref(`photos/${this.user.uid}/photo-${currentDate.getTime()}.jpg`);
        selfieRef
          .putString(picture, 'base64', { contentType: 'image/jpeg' })
          .then(savedPicture => {
            this.photosRef.push({
              createdAt: currentDate.toJSON(),
              pictureURL: savedPicture.downloadURL,
              user: {
                avatarURL: this.fireAuth.getUserSession().avatarURL,
                pseudo: this.fireAuth.getUserSession().pseudo,
                uid: this.user.uid
              }
            });
          });
      })
      .catch(error => console.log('error', error));
  }
}
