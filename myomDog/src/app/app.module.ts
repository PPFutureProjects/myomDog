import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Push, CloudSettings, CloudModule } from '@ionic/cloud-angular'
import { MyApp } from './app.component';
import firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';

import { HomePage } from '../pages/home/home';
import { HealthPage } from '../pages/health/health';
import { WalkPage } from '../pages/walk/walk';
import { SettingPage, AddingDogPage, InvitingPage, ChangeInfoPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';

// SERVICES
import { ManageService } from '../providers/manage-service';
import { AuthService } from '../providers/auth-service';

// PIPES
import { OrderbyPipe } from '../pipes/orderby';
import { KeysPipe } from '../pipes/keys';

// NATIVES
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import {Push, PushObject, PushOptions} from "@ionic-native/push";

export const firebaseConfig = {
  apiKey: "AIzaSyCnY0y-OWPY7mqPIZtQ8Jp_maxGPDSyttA",
  authDomain: "myomdog.firebaseapp.com",
  databaseURL: "https://myomdog.firebaseio.com",
  projectId: "myomdog",
  storageBucket: "myomdog.appspot.com",
  messagingSenderId: "835408454244"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'de7190d8'
  },
  'push': {
    'sender_id': '835408454244',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    ResetpwdPage,

    HomePage,
    HealthPage,
    WalkPage,
    SettingPage,
    AddingDogPage,
    InvitingPage,
    ChangeInfoPage,
    TabsPage,

    OrderbyPipe,
    KeysPipe
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'bottom'}),
    AngularFireModule.initializeApp(firebaseConfig),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    ResetpwdPage,

    HomePage,
    HealthPage,
    WalkPage,
    SettingPage,
    AddingDogPage,
    InvitingPage,
    ChangeInfoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    ManageService,
    AngularFireAuth,
    AngularFireDatabase
  ]
})

export class AppModule {}
