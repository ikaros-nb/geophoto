import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AngularFireAuth } from "angularfire2/auth";

import { HomePage } from "../pages/home/home";
import { LoginPage } from './../pages/login/login';
import { RegisterPage } from "../pages/register/register";
import { ToastHelper } from "../helpers/toast";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string; component: any }>;
  email: string;
  isLogged: boolean;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
    private toast: ToastHelper
  ) {
    this.initializeApp();
    this.authState();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  authState() {
    this.afAuth.authState.subscribe(data => {
      //console.log('data', data);

      if (data && data.email && data.uid) {
        this.email = data.email;
        this.isLogged = true;
        this.toast.display(`Welcome to GeoPhoto, ${data.email}`);
      } else {
        this.isLogged = false;
        this.toast.display(`Could not find authentication details.`);
      }

      this.setPages();
    });
  }

  setPages() {
    if (!this.isLogged) {
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Login', component: LoginPage },
        { title: 'Register', component: RegisterPage }
      ];
    } else {
      this.pages = [
        { title: 'Home', component: HomePage }
      ];
    }
  }

  logout() {
    this.email = null;
    this.afAuth.auth.signOut();
  }
}
