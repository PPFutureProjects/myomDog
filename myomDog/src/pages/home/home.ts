import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ManageService } from '../../providers/manage-service'
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // TESTING AngularFire2 -----------------------
      msgs: FirebaseListObservable<any[]>;
      // msgsObj: FirebaseObjectObservable<any[]>;
      // dogs: FirebaseListObservable<any[]>;
      // user: FirebaseObjectObservable<any[]>;
      // userDogRef: FirebaseListObservable<any[]>;
      // temp_uid:string = '1111';
      // userDogs:any;
    // ---------------- END OF TESTING AngularFire2
    constructor(public manage: ManageService, public navCtrl: NavController, public authService: AuthService, private db: AngularFireDatabase) {
        this.msgs = db.list('/checkMsg');
        // this.user = db.object('/mockUserData/' + this.temp_uid);
        // this.userDogRef = db.list('/mockUserData/' + this.temp_uid + '/groups');
        // this.dogs = db.list('/mockDogData');
    }
}
