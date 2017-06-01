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
    today:any;
    mygroups: FirebaseListObservable<any[]>;
    userKey;
    selectedDog;
    constructor(public navCtrl: NavController, public authService: AuthService, public manageService: ManageService, 
                private db: AngularFireDatabase) 
    {
      this.today = Date.now();
      this.userKey = manageService.userKey;
      this.mygroups = db.list('/userData/'+this.userKey+'/groups');
      this.tokenSetup().then((token) => { // 토큰셋업 처음에만?
        this.registerToken(token);
      })
    }

    isNull(){
      return this.mygroups==null
    }

    ionViewDidEnter(){
      this.userKey = this.manageService.userKey;
      this.mygroups = this.db.list('/userData/'+this.userKey+'/groups');
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

    selectDog(val){
      console.log("button was clicked");
      console.log(val);
      console.log(this.selectedDog);
    }
}
