import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import firebase from 'firebase';
import { PhotoInfoPage } from './../photo-info/photo-info';

@Component({
  selector: 'page-account-photos',
  templateUrl: 'account-photos.html'
})
export class AccountPhotosPage {
  user = {} as User;
  photosRef: firebase.database.Reference = firebase.database().ref(`photos`);
  photos: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider
  ) {
    this.user = this.fireAuth.getUserSession();
  }

  ionViewDidLoad() {
    this.photosRef.orderByChild('createdAt').on('value', itemSnapshot => {
      this.photos = [];
      itemSnapshot.forEach(itemSnap => {
        if (itemSnap.val().user.userID == this.user.uid) {
          this.photos.push(itemSnap.val());
        }
        return false;
      });
    });
  }

  goToPhotoInfo(photo) {
    this.navCtrl.push(PhotoInfoPage, { photo });
  }
}
