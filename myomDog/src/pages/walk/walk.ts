import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { ManageService } from '../../providers/manage-service';

// import { TimerComponent } from '../../component/timer/timer'

/**
 * Generated class for the Walk page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-walk',
  templateUrl: 'walk.html',
})
export class WalkPage {
  walkedTime: number;
  //checkboxOpen: boolean;
  //dogChecked: boolean;
  dogs: FirebaseObjectObservable<any>;
  selectedDogs;
  walkingDog :FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
            public db: AngularFireDatabase, public manageService: ManageService) {

  }

 outputEvent(time: number){
   let current = new Date();
   this.walkedTime = time;
   console.log("time : "+this.walkedTime);
   console.log("dogs waking with me : "+this.selectedDogs+"type: "+typeof this.selectedDogs);
   console.log("!!!!!!!"+typeof this.selectedDogs+"!!!!!!!!"+this.selectedDogs);
   this.manageService.addHistory("walk", "paw", "산책", current, this.selectedDogs , this.walkedTime);
   //this.dogChecked = false;
   this.selectedDogs = null;
 }
 ionViewDidLoad() {
    console.log('ionViewDidLoad Walk');
  }

  ionViewDidEnter(){
    this.walkingDog = this.db.list('/userData/'+this.manageService.userKey+'/groups');
  }
/*
  ionViewDidEnter(){
    console.log("entered");
    if(!this.selectedDogs){
      let user = this.manageService.userKey;
      this.dogs = this.db.object('userData/'+user+'/groups', {preserveSnapshot: true});

      let alert = this.alertCtrl.create();
      alert.setTitle('누구랑 산책할까 ?');
      this.dogs.subscribe((snapshot)=>{
        snapshot.forEach(snap=>{
          let groupName = snap.val().groupName;
          console.log("groupName: "+groupName);
          let dogs = snap.child('dogs');

          dogs.forEach((dog)=>{
            console.log("dog: "+dog.val().name);
            alert.addInput({
              type: 'checkbox',
              label: dog.val().name,
              value: dog.key,
              checked: false
            });
          })
        });

        alert.addButton('Cancel');
        alert.addButton({
          text: 'Okay',
          handler: data => {
            this.checkboxOpen = false;
            this.selectedDogs = data;
          }
        });
        alert.present().then(() => {
          this.checkboxOpen = true;
        });
      });
    }
  }
*/
}
