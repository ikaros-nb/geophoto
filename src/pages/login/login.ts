import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ToastHelper } from '../../helpers/toast';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastHelper
  ) {}

  login() {
    if (this.user.email && this.user.password) {
      this.afAuth.auth
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(result => {
          //console.log('signInWithEmailAndPassword', result);
          this.navCtrl.setRoot(HomePage);
        })
        .catch(error => {
          //console.log('error', error)
          this.user.password = null;
          this.toast.display(`There is no user corresponding to this credentials. The user may have been deleted.`);
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
