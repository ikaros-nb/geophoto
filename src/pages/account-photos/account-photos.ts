import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { FireAuthProvider } from '@providers/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo';
import { User } from '@models/user';
import { Photo } from '@models/photo';

@Component({
  selector: 'page-account-photos',
  templateUrl: 'account-photos.html'
})
export class AccountPhotosPage {
  photos: Array<Photo>;
  photosSubscription: Subscription;
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider
  ) {}

  ionViewDidEnter() {
    this.user = this.fireAuth.getUserSession();
    this.firePhoto.listbyUserFromFirebase(this.user);
    this.photosSubscription = this.firePhoto.byUserPhotosSubject.subscribe(
      (photos: Array<Photo>) => {
        this.photos = photos;
      }
    );
  }
}
