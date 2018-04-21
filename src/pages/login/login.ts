import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ToastHelper } from '../../helpers/toast';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private toast: ToastHelper
  ) {}

  login() {
    if (this.user.email && this.user.password) {
      this.fireAuth
        .login(this.user)
        .then(user => this.navCtrl.setRoot(HomePage))
        .catch(error => {
          this.user.password = null;
          this.toast.display(
            `There is no user corresponding to this credentials. The user may have been deleted.`
          );
        });
    } else {
      this.user.email = null;
      this.user.password = null;
      this.toast.display(`Email and password must not be empty.`);
    }
  }

  register() {
    this.navCtrl.setRoot(RegisterPage);
  }
}
