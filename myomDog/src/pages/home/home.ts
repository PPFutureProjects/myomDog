import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastController, NavParams, ViewController, NavController, AlertController, ModalController } from 'ionic-angular';
import { ManageService } from '../../providers/manage-service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

declare var FCMPlugin;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
    today:any;
    mygroups: FirebaseListObservable<any[]>; //grouplist
    mydata: FirebaseListObservable<any[]>;
    userKey;
    selectedDog;

    testCheckboxOpen: boolean;
    testCheckboxResult;

    constructor(public navCtrl: NavController, public authService: AuthService, public manageService: ManageService,
                private db: AngularFireDatabase, public alertCtrl: AlertController, public modalCtrl: ModalController,
                public toastCtrl: ToastController, public _viewCtrl: ViewController)
    {
      this.today = Date.now();
      this.userKey = manageService.userKey;
      this.mygroups = db.list('/userData/'+this.userKey+'/groups');
      this.mydata = db.list('/userData/'+this.userKey+'/groups', {preserveSnapshot: true})

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
      this.mydata = this.db.list('/userData/'+this.userKey+'/groups', {preserveSnapshot: true})
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

    presentToast(msg: string){
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 1500,
        position: 'middle',
        dismissOnPageChange: true
      });

      toast.onDidDismiss(() => {
        console.log("dismissed toast");
      });
      toast.present();
    }

    givemeal(){
      let alert = this.alertCtrl.create();
      alert.setTitle('어떤 강아지에게 밥 주셨나요?');
      let param = new Promise((resolve,reject)=>{
        this.mydata.subscribe(snaps=>{
          console.log('snaps', snaps);
          snaps.forEach((group)=>{
            console.log('group', group.key)
            let groupName = group.val().groupName;
            let dogs = group.child('dogs');
            dogs.forEach((dog)=>{
              alert.addInput({
                type: 'checkbox',
                label: '['+groupName+'] '+dog.val().name,
                value: dog.key,
                checked: false
              });
            })
            resolve(alert);
          }), err=>{
            reject(err);
          }
        })
      }).then(()=>{
        alert.addButton('취소');
        alert.addButton({
          text: '지금 밥 주셨나요?',
          handler: data => {
            this.testCheckboxOpen = false;
            this.testCheckboxResult = data;
            this.manageService.feedDogs(data); ///간식제외 홈에서 직접 버튼으로 사료 주는 경우
            this.presentToast("맛있다!");
          }
      });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
  })

    // alert.addButton('취소');
    // alert.addButton({
    //   text: '지금 밥 주셨나요?',
    //   handler: data => {
    //     console.log('Checkbox data:', data);
    //     this.testCheckboxOpen = false;
    //     this.testCheckboxResult = data;
    //   }
    // });
    // alert.present().then(() => {
    //   this.testCheckboxOpen = true;
    // });
    }


}

@Component({
  templateUrl: './doginfo.html',
  providers: [DatePipe]
})
export class MoreInfoPage {
  dogname: string;
  dogbirth: string;
  doggender: string;
  doglastmeal: string;
  gendernum: number = 0;
  dogKey;

  myDate: String = new Date().toISOString();
  myDateSec: Number = Date.now();

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public _viewCtrl: ViewController, public params: NavParams, public alertCtrl: AlertController, public manageService: ManageService,
              public datePipe: DatePipe){
    this.dogname = params.get('val').value.name;
    this.dogbirth = params.get('val').value.birth;
    this.doggender = params.get('val').value.gender;
    this.doglastmeal = params.get('val').value.lastmeal;
    if(this.doggender=='maledog'){
      this.gendernum = 1;
      console.log("test:"+this.dogname);
    }

    if(params){
      this.dogKey = params.data.val.key;
      console.log(this.dogKey);
    }

  }

  presentToast(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'middle',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log("dismissed toast");
    });
    toast.present();
  }

  doginfofavorite(){
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: this.dogname+'을 즐겨찾기하시겠습니까?',
     buttons: [
       {
         text: '취소',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: '등록',
         handler: () => {
          this.manageService.changeMainDog(this.dogKey);
          this.presentToast("Favorite dog changed!");
        }
       }
     ]
   });
   confirm.present()
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm');
    //return this.datePipe.transform(date, 'number');
  }


  doginfogivesnack(){
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: this.dogname+'에게 간식을 주시겠습니까?',
     buttons: [
       {
         text: '취소',
         handler: () => {
           //console.log('Disagree');
         }
       },
       {
         text: '간식주기',
         handler: () => {
           this.myDate= new Date().toISOString();
           this.myDateSec= Date.now();
           this.myDate = this.transformDate(this.myDate);
          //this.datePipe.transform(this.myDate, 'YYYY/MM/DD HH:mm');
          // console.log("test time: "+ this.myDate + "sec+" + this.myDateSec);
           //간식주세요
           this.presentToast("Snack is so good!");
         }
       }
     ]
   });
   confirm.present()
  }



  doginfogivemeal(){
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: this.dogname+'에게 밥주셨나요?',
     buttons: [
       {
         text: '취소',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: '밥주기',
         handler: () => {
           this.myDate= new Date().toISOString();
           this.myDateSec= Date.now();
           this.myDate = this.transformDate(this.myDate);
<<<<<<< HEAD
           this.manageService.feedDogs([this.dogKey]);
=======
          this.manageService.feedDogs([this.dogKey]);
          this.presentToast("맛있다!");
>>>>>>> origin/master
         }
       }
     ]
    });
    confirm.present()
    }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}
