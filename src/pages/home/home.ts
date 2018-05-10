import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { AddPhotoPage } from '@pages/add-photo/add-photo';
import { FireAuthProvider } from '@providers/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo';
import { DatabaseProvider } from '@providers/database';
import { User } from '@models/user';
import { Photo } from '@models/photo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photos: Array<Photo>;
  photosSubscription: Subscription;
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private db: DatabaseProvider
  ) {}

  ionViewDidLoad() {
    this.fireAuth.getAuthState().subscribe(user => {
      if (user && user.email && user.uid) {
        this.fireAuth.getUserRefInFirebase(user).subscribe(() => {
          this.user = this.fireAuth.getUserSession();
          this.db.setup(this.user);
          this.db.listFavPhoto().subscribe();
        });
      } else {
        let visitor = {} as User;
        visitor.uid = 'visitor';
        this.db.setup(visitor);
        this.db.listFavPhoto().subscribe();
      }
    });
  }

  ionViewDidEnter() {
    this.firePhoto.listAllFromFirebase();
    this.photosSubscription = this.firePhoto.allPhotosSubject.subscribe(
      (photos: Array<Photo>) => {
        this.photos = photos;
      }
    );
  }

  addPhotoPage(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(AddPhotoPage);
  }
}
