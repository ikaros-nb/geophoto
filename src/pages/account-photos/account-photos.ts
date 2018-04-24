import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';
import { Observable } from 'rxjs/Observable';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { PhotoInfoPage } from './../photo-info/photo-info';

@Component({
  selector: 'page-account-photos',
  templateUrl: 'account-photos.html'
})
export class AccountPhotosPage {
  user = {} as User;
  photosRef: AngularFireList<Photo> = this.afDB.list(`photos`, ref =>
    ref.orderByChild('createdAt')
  );
  photos: Observable<Photo[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private afDB: AngularFireDatabase
  ) {
    this.user = this.fireAuth.getUserSession();
    this.photos = this.photosRef
      .valueChanges()
      .map(photos =>
        photos.reverse().filter(photo => photo.user.uid == this.user.uid)
      );
  }

  goToPhotoInfo(photo) {
    this.navCtrl.push(PhotoInfoPage, { photo });
  }
}
