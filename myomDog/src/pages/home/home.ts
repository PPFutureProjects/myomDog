import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ManageService } from '../../providers/manage-service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';


declare var FCMPlugin;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // TESTING AngularFire2 -----------------------
      msgs: FirebaseListObservable<any[]>;
      // msgsObj: FirebaseObjectObservable<any[]>;
      // dogs: FirebaseListObservable<any[]>;
      user: any = null;
      // userDogRef: FirebaseListObservable<any[]>;
      // temp_uid:string = '1111';
      // userDogs:any;
    // ---------------- END OF TESTING AngularFire2
    constructor(public navCtrl: NavController, public authService: AuthService, public manageService: ManageService, private db: AngularFireDatabase) {
        this.msgs = db.list('/checkMsg');
        this.user = authService.fireAuth.currentUser;
        console.log("currnet user in home : " + this.user);
        this.tokenSetup().then((token) => {
          this.registerToken(token);
        })


        // this.userDogRef = db.list('/mockUserData/' + this.temp_uid + '/groups');
        // this.dogs = db.list('/mockDogData');
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad Home');
      FCMPlugin.onNotification(function(data){
        if (data.wasTapped){
          alert(JSON.stringify(data));
        }
        else {
          alert(JSON.stringify(data));
        }
      });

      FCMPlugin.onTokenRefresh(function(token){
        alert(token);
      });
    }
    tokenSetup() {
      var promise = new Promise((resolve, reject) => {
        FCMPlugin.getToken(function(token) {
          resolve(token);
        }, (err) => {
          reject(err);
        });
      })
      return promise;
    }
    registerToken(token){
      this.manageService.registToken(token).then(() => {
        alert('Token registered');
      }).catch(() => {
        alert('Token register error');
      });
    }
}
