import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { ToastHelper } from '../../helpers/toast';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastHelper
  ) {}

  register() {
    if (this.user.email && this.user.password) {
      this.afAuth.auth
        .createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(result => {
          //console.log('createUserWithEmailAndPassword', result);
          this.afAuth.auth
            .signInWithEmailAndPassword(this.user.email, this.user.password)
            .then(result => {
              //console.log('signInWithEmailAndPassword', result);
              this.navCtrl.setRoot(HomePage);
            })
            .catch(error => this.toast.display(`A network error has occurred.`));
        })
        .catch(error => {
          //console.log('error', error);
          this.user.password = null;
          this.toast.display(error.message);
        });
    } else {
      this.user.email = null;
      this.user.password = null;
      this.toast.display(`Email and password must not be empty.`);
    }
  }
}
