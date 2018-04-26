import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Photo } from '../../models/photo';
import { PhotoInfoPage } from '../photo-info/photo-info';

@Component({
  selector: 'page-account-likes',
  templateUrl: 'account-likes.html'
})
export class AccountLikesPage {
  photos: Array<Photo>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DatabaseProvider
  ) {}

  ionViewDidEnter() {
    this.db.listFavPhoto().subscribe(likes => {
      this.photos = [];
      likes.forEach(like => {
        this.photos.push(like.doc.photo);
      });
      this.photos.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  goToPhotoInfo(photo) {
    this.navCtrl.push(PhotoInfoPage, { photo });
  }
}
