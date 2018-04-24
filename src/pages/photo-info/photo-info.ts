import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Photo } from '../../models/photo';

@Component({
  selector: 'page-photo-info',
  templateUrl: 'photo-info.html'
})
export class PhotoInfoPage {
  photo = {} as Photo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController
  ) {
    this.photo = this.navParams.get('photo');
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }
}
