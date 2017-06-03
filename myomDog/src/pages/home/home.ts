import { Component } from '@angular/core';
import { NavParams, ViewController, NavController, AlertController, ModalController } from 'ionic-angular';
import { ManageService } from '../../providers/manage-service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

declare var FCMPlugin;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    today:any;
    mygroups: FirebaseListObservable<any[]>; //grouplist
    userKey;
    selectedDog;

    testCheckboxOpen: boolean;
    testCheckboxResult;

/////
  groupobject: FirebaseObjectObservable<any>;
  GroupAndDogs: any;
  nameOfGroups: any;
  AllDogs: any;
  inviteduser:string;
  inviteddog:string;

//

    constructor(public navCtrl: NavController, public authService: AuthService, public manageService: ManageService,
                private db: AngularFireDatabase, public alertCtrl: AlertController, public modalCtrl: ModalController, public _viewCtrl: ViewController)
    {
      this.today = Date.now();
      this.userKey = manageService.userKey;
      this.mygroups = db.list('/userData/'+this.userKey+'/groups');
      this.groupobject = db.object('/userData/'+this.userKey+'/groups');


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
      // console.log("button was clicked");
      // console.log(val.value.name);
      // console.log(this.selectedDog);
      let moreinfo = this.modalCtrl.create(MoreInfoPage, {val: val});
      moreinfo.present();

    }

    givemeal(){
      let alert = this.alertCtrl.create();
      alert.setTitle('어떤 강아지에게 밥 주셨나요?');

      alert.addInput({
        type: 'checkbox',
        label: '',
        value: 'value1',
      });


    alert.addButton('취소');
    alert.addButton({
      text: '지금 밥 주셨나요?',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
    }


}

@Component({
  templateUrl: './doginfo.html'
})
export class MoreInfoPage {
  dogname: string;

  constructor(public _viewCtrl: ViewController, public params: NavParams){
    this.dogname = params.get('val').value.name;
    console.log("bang test:", this.dogname);
  }
  dismiss(){
    this._viewCtrl.dismiss();
  }
}
