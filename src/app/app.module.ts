import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AccountPage } from './../pages/account/account';
import { AccountInfoPage } from '../pages/account-info/account-info';
import { AccountPhotosPage } from '../pages/account-photos/account-photos';

import { ToastHelper } from '../helpers/toast';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AccountPage,
    AccountInfoPage,
    AccountPhotosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AccountPage,
    AccountInfoPage,
    AccountPhotosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToastHelper,
    Camera,
    FireAuthProvider
  ]
})
export class AppModule {}
