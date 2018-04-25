import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Photo } from '../../models/photo';
import { FirePhotoProvider } from '../../providers/fire-photo/fire-photo';

@Component({
  selector: 'page-photo-info',
  templateUrl: 'photo-info.html'
})
export class PhotoInfoPage {
  photo = {} as Photo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private firePhoto: FirePhotoProvider
  ) {
    this.photo = this.navParams.get('photo');
    this.firePhoto.getPhotoMetadataInFirebase(this.photo).then(metadata => console.log(metadata.customMetadata));
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }
}
