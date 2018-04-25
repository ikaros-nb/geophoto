import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoInfoPage } from '../photo-info/photo-info';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photos: Observable<Photo[]>;
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private camera: Camera
  ) {
    this.photos = this.firePhoto
      .listAllFromFirebase()
      .valueChanges()
      .map(photos => photos.reverse());
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
      .then(picture => this.firePhoto.addPhotoInFirebase(picture))
      .catch(error => console.log('error', error));
  }
}
