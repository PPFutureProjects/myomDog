import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Push, PushObject, PushOptions} from "@ionic-native/push";

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth-service';
import { ManageService } from '../providers/manage-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  currentUser: any;
  rootPage:any;

  constructor(platform: Platform,
    af: AngularFireAuth,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public authService: AuthService,
    public manageService: ManageService,
    public alertCtrl: AlertController,
    public push: Push) {

      this.authService.fireAuth.onAuthStateChanged( function (user) {
        if(user) {
          console.log("User "+ user.email +" Logged in.");
          // this.authService.email = user.email;
          // this.rootPage = TabsPage;
        }
        else {
          console.log("User Logged out.");
          // this.rootPage = LoginPage;
        }
      });
      if(this.authService.authenticated) {
        console.log("Successfully Logged in.");
        // this.authService.email = this.currentUser.email;
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = LoginPage;
      }

      // this.authService.fireAuth.subscribe(
      //   (auth) => {
      //     if(auth == null) {
      //       console.log("Not Logged in.");
      //       this.rootPage = TabsPage;
      //     }
      //     else {
      //       console.log("Successfully Logged in.");
      //       this.authService.email = auth.auth.email;
      //       this.rootPage = LoginPage;
      //     }
      //   }
      // );

      // this.push.register().then((t: PushToken) => {
      //   return this.push.saveToken(t);
      // }).then((t: PushToken) => {
      //   console.log('Token saved:', t.token);
      // });
      this.push.hasPermission()
       .then((res: any) => {

         if (res.isEnabled) {
           console.log('We have permission to send push notifications');
         } else {
           console.log('We do not have permission to send push notifications');
         }

       });

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
        this.pushSetup();
      });
  }

  pushSetup() {
    //for test
    console.log("pushSetup");
    const options: PushOptions = {
      android: {
          senderID: '835408454244'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      if (notification.additionalData.foreground){
        console.log('Push notification (foreground) : ' + notification.message);
        let pushAlert = this.alertCtrl.create({
          title: '알림',
          message: notification.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        pushAlert.present();
      }
      else {
        console.log('Push notification (background) : ' + notification.message);
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      alert('Device registered '+ registration.registrationId);
      this.manageService.registToken(registration.registrationId);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
