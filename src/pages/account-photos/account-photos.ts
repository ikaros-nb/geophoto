import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FireAuthProvider } from '@providers/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo';
import { Photo } from '@models/photo';

@Component({
  selector: 'page-account-photos',
  templateUrl: 'account-photos.html'
})
export class AccountPhotosPage {
  photos: Observable<Photo[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider
  ) {}

  ionViewDidEnter() {
    this.photos = this.firePhoto
      .listbyUserFromFirebase(this.fireAuth.getUserSession())
      .valueChanges()
      .map(photos =>
        photos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
  }
}
