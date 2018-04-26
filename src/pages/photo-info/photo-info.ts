import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Photo } from '../../models/photo';
import { User } from './../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-photo-info',
  templateUrl: 'photo-info.html'
})
export class PhotoInfoPage {
  photo = {} as Photo;
  user = {} as User;
  input: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private db: DatabaseProvider
  ) {
    this.photo = this.navParams.get('photo');
    this.firePhoto
      .getPhotoMetadataInFirebase(this.photo)
      .then(metadata => (this.photo.metadata = metadata.customMetadata));
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.user = this.fireAuth.getUserSession();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  showInput() {
    this.input = true;
  }

  deletePhoto() {
    this.firePhoto
      .deletePhotoInStorage(this.photo)
      .then(() =>
        this.firePhoto
          .deletePhotoInFirebase(this.photo)
          .then(() => {
            alert('Photo deleted!');
            this.navCtrl.pop();
          })
          .catch(error => console.log('error', error))
      )
      .catch(error => console.log('error', error));
  }

  updateMetadata() {
    this.firePhoto
      .updatePhotoMetadataInFirebase(this.photo)
      .then(() => (this.input = false))
      .catch(error => console.log('error', error));
  }
}
