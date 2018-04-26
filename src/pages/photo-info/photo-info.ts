import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Photo } from '../../models/photo';
import { User } from './../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';

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
    private firePhoto: FirePhotoProvider
  ) {
    this.user = this.fireAuth.getUserSession();
    this.photo = this.navParams.get('photo');
    this.firePhoto
      .getPhotoMetadataInFirebase(this.photo)
      .then(metadata => (this.photo.metadata = metadata.customMetadata));
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  showInput() {
    this.input = true;
  }

  updateMetadata() {
    this.firePhoto
      .updatePhotoMetadataInFirebase(this.photo)
      .then(() => (this.input = false))
      .catch(error => console.log('error', error));
  }
}
