import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule, AngularFireDatabase } from "angularfire2/database";
import { Camera } from "@ionic-native/camera";
import { Geolocation } from "@ionic-native/geolocation";
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MyApp } from "@app/app.component";
import { FIREBASE_CONFIG } from "@app/app.firebase.config";
import { HomePage } from "@pages/home/home";
import { LoginPage } from "@pages/login/login";
import { RegisterPage } from "@pages/register/register";
import { AccountPage } from "@pages/account/account";
import { AccountInfoPage } from "@pages/account-info/account-info";
import { AccountPhotosPage } from "@pages/account-photos/account-photos";
import { AccountLikesPage } from "@pages/account-likes/account-likes";
import { PhotoInfoPage } from "@pages/photo-info/photo-info";
import { AddPhotoPage } from "@pages/add-photo/add-photo";

import { ToastHelper } from "@helpers/toast";
import { FireAuthProvider } from "@providers/fire-auth";
import { FirePhotoProvider } from '@providers/fire-photo';
import { DatabaseProvider } from '@providers/database';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AccountPage,
    AccountInfoPage,
    AccountPhotosPage,
    AccountLikesPage,
    PhotoInfoPage,
    AddPhotoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { tabsHideOnSubPages: true }),
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
    AccountPhotosPage,
    AccountLikesPage,
    PhotoInfoPage,
    AddPhotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ToastHelper,
    Camera,
    Diagnostic,
    LocationAccuracy,
    Geolocation,
    NativeGeocoder,
    AngularFireDatabase,
    FireAuthProvider,
    FirePhotoProvider,
    DatabaseProvider
  ]
})
export class AppModule {}
