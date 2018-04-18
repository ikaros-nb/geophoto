import { Component } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { LoginPage } from "../login/login";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController
  ) {}

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      console.log(data);
      if (data && data.email && data.uid) {
        this.toast
          .create({
            message: `Welcome to GeoPhoto, ${data.email}`,
            duration: 3000
          })
          .present();
      } else {
        this.toast
          .create({
            message: `Could not find authentication details.`,
            duration: 3000
          })
          .present();
      }
    });
  }

  navigateToLoginPage() {
    this.navCtrl.push(LoginPage);
  }
}
