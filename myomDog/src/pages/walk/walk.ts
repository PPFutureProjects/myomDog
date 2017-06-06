import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, AlertController, Select, ToastController } from 'ionic-angular';
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
  providers: [DatePipe]
})
export class WalkPage {
  @ViewChild('walkDogSelect') walkDogSelect: Select;
  walkedTime: number;
  dogSel: boolean;
  //checkboxOpen: boolean;
  //dogChecked: boolean;
  dogs: FirebaseObjectObservable<any>;
  selectedDogs: [any];
  selectedDogsName: any;
  walkingDog :FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
            public db: AngularFireDatabase, public manageService: ManageService, private toastCtrl: ToastController, public datePipe: DatePipe) {
              this.dogSel = false;

  }
  presentToast(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      showCloseButton: true,
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log("dismissed toast");
    });
    toast.present();
  }

 outputEvent(time: number){
   this.walkedTime = time;
   console.log("time : "+this.walkedTime);
   console.log("dogs waking with me : "+this.selectedDogs+"type: "+typeof this.selectedDogs);
   console.log("!!!!!!!"+typeof this.selectedDogs+"!!!!!!!!"+this.selectedDogs);
   this.manageService.addWalk("walk", "paw", "산책", this.selectedDogs , this.walkedTime);
   this.presentToast("Walk successfully added!");
   //this.dogChecked = false;
   this.selectedDogs = null;
   this.dogSel = false;
 }

 timerStartEvent(event: boolean) {
   if(event){
     this.walkDogSelect.open();
   }
 }

 dogChanged(){
   let selectCheck = this.selectedDogs;
   console.log("selected Dogs : " + selectCheck);
   if (selectCheck !== null) {
     console.log("is checked");
     this.dogSel = true;
   }
 }

 dogSelectCanceled(){
   console.log("select cancel");
   this.selectedDogs = null;
   this.dogSel = false;
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
