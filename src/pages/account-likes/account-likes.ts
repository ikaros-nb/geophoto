import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '@providers/database';
import { Photo } from '@models/photo';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-account-likes',
  templateUrl: 'account-likes.html'
})
export class AccountLikesPage {
  photos: Array<Photo>;
  photosSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DatabaseProvider
  ) {}

  ionViewDidEnter() {
    this.db.listFavPhoto().subscribe();
    this.photosSubscription = this.db.photosSubject.subscribe(
      (photos: Array<Photo>) => {
        console.log('init accountlikes', photos);
        this.photos = photos;
      }
    );
  }

  ionViewDidLeave() {
    this.photosSubscription.unsubscribe();
  }
}
