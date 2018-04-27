import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AccountPage } from '../pages/account/account';
import { AccountLikesPage } from '../pages/account-likes/account-likes';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';
import { ToastHelper } from '../helpers/toast';
import { User } from '../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string; component: any }>;
  user = {} as User;
  isLogged: boolean;
  loading: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private fireAuth: FireAuthProvider,
    private toast: ToastHelper,
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();
    this.presentLoading();
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

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  authState() {
    this.fireAuth.getAuthState().subscribe(user => {
      if (user && user.email && user.uid) {
        this.fireAuth
          .getUserRefInFirebase(user)
          .subscribe(() => (this.user = this.fireAuth.getUserSession()));
        this.isLogged = true;
        this.toast.display(`Welcome to GeoPhoto, ${user.email}`);
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
        { title: 'Register', component: RegisterPage },
        { title: 'My likes', component: AccountLikesPage }
      ];
    } else {
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Account', component: AccountPage }
      ];
    }
    this.loading.dismiss();
  }

  logout() {
    this.fireAuth.logout();
    this.user = {} as User;
    this.isLogged = false;
    this.setPages();
    this.nav.setRoot(HomePage);
  }
}
