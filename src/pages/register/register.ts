import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth
  ) {}

  async register() {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
}
