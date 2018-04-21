import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import firebase from 'firebase';
import { HomePage } from '../home/home';
import { ToastHelper } from '../../helpers/toast';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  user = {} as User;
  usersRef: firebase.database.Reference = firebase.database().ref(`users`);

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private toast: ToastHelper
  ) {}

  register() {
    if (this.user.pseudo && this.user.email && this.user.password) {
      this.fireAuth
        .register(this.user)
        .then(user => {
          this.user.uid = user.uid;
          this.fireAuth.addUserRefInFirebase(this.user);
          this.fireAuth
            .login(this.user)
            .then(user => this.navCtrl.setRoot(HomePage))
            .catch(error => {
              this.user.password = null;
              this.toast.display(
                `There is no user corresponding to this credentials. The user may have been deleted.`
              );
            });
        })
        .catch(error => {
          this.user.password = null;
          this.toast.display(error.message);
        });
    } else {
      this.user.pseudo = null;
      this.user.email = null;
      this.user.password = null;
      this.toast.display(`Pseudo, email and password must not be empty.`);
    }
  }
}
