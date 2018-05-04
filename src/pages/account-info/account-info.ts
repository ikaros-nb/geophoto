import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '@models/user';
import { FireAuthProvider } from '@providers/fire-auth';

@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html'
})
export class AccountInfoPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider
  ) {
    this.user = this.fireAuth.getUserSession();
  }
}
