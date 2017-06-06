import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import firebase from 'firebase';

import { LoginPage } from '../login/login';

import { HomePage } from '../home/home';
import { HealthPage } from '../health/health';
import { WalkPage } from '../walk/walk';
import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  currentUser: any;
  inviteBadge: number;
  tab1Root = HomePage;
  tab2Root = HealthPage;
  tab3Root = WalkPage;
  tab4Root = SettingPage;

  constructor(public navCtrl: NavController, public authService: AuthService, public events:Events) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        navCtrl.setRoot(LoginPage);
      }
    });
    events.subscribe('invite:badge', (numInv) => {
      if (numInv == 0 || numInv == null) {
        this.inviteBadge = null;
      }else{
        this.inviteBadge = numInv;
      }
    })

  }

}
