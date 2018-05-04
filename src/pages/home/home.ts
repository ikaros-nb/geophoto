import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { PhotoInfoPage } from '@pages/photo-info/photo-info';
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
  photos: Observable<Photo[]>;
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private db: DatabaseProvider
  ) {
    this.photos = this.firePhoto
      .listAllFromFirebase()
      .valueChanges()
      .map(photos => photos.reverse());
  }

  ionViewDidLoad() {
    this.fireAuth.getAuthState().subscribe(user => {
      if (user && user.email && user.uid) {
        this.fireAuth.getUserRefInFirebase(user).subscribe(() => {
          this.user = this.fireAuth.getUserSession();
          this.db.setup(this.user);
        });
      } else {
        let visitor = {} as User;
        visitor.uid = 'visitor';
        this.db.setup(visitor);
      }
    });
  }

  goToPhotoInfo(photo) {
    this.navCtrl.push(PhotoInfoPage, { photo });
  }

  addPhotoPage(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(AddPhotoPage);
  }
}
