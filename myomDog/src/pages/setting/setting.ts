import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ManageService } from '../../providers/manage-service';
// import firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalController, ViewController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  templateUrl: './setting.html'
})
export class SettingPage {
  userKey: string;
  grouplist: FirebaseListObservable<any[]>;
  groupobject: FirebaseObjectObservable<any>;
  GroupAndDogs: any;
  nameOfGroups: any;
  AllDogs: any;
  favorite: string;
  pushboolean: boolean = true;
  // inviteRef: any;
  numOfInvites: number;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public authService: AuthService, public _viewCtrl: ViewController, public manageService: ManageService, db: AngularFireDatabase, public events:Events) {
    this.userKey = manageService.userKey;
    console.log(this.userKey);
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.groupobject = db.object('/userData/'+this.userKey+'/groups');
    console.log(this.grouplist);
    this.pushboolean = true;
    events.publish('invite:badge', this.numOfInvites);
    // this.inviteRef = db.list('/userData/'+this.userKey+'/invitation');
  }
  countInvitation(){
    firebase.database().ref('/userData/'+this.userKey+'/invitation').once('value').then((snapshot) => {
      if (snapshot.val()!==null) {
        this.numOfInvites = snapshot.numChildren();
      }else{
        this.numOfInvites = null;
      }
    });
    // this.events.publish('invite:badge', this.numOfInvites);
  }
  ionViewWillEnter(){
    this.countInvitation();
  }
  pushcheck(pushboolean){
    this.pushboolean = pushboolean;
    console.log("puchcheck: "+this.pushboolean);
  }

  addingDogModal(){
    let dogModal = this.modalCtrl.create(AddingDogPage);
    dogModal.present();
  }
  invitingModal(){
    let inviteModal = this.modalCtrl.create(InvitingPage);
    inviteModal.present();
  }
  inviteinfoModal(){
    let inviteinfoModal = this.modalCtrl.create(InviteInfoPage, {
      userKey: this.userKey,
    });
    inviteinfoModal.present();
  }
  changeinfoModal(){
    let changeModal = this.modalCtrl.create(ChangeInfoPage);
    changeModal.present();
  }
  deleteModal(){
    let deletedogModal = this.modalCtrl.create(GoodByePage);
    deletedogModal.present();
  }

  deleteGroupModal(){
    let deletegroupModal = this.modalCtrl.create(DeleteGroupPage);
    deletegroupModal.present();
  }

  savefavorite(SelectedValue){
    console.log("Favorite: ", SelectedValue);
    this.manageService.changeMainDog(SelectedValue);
  }

  logout() {
    this.authService.doLogout();
  }

}

@Component({
  templateUrl: './deleteGroup.html'
})
export class DeleteGroupPage {
  userKey: string;

  grouplist: FirebaseListObservable<any[]>;
  selectedGroup: string;
  editGroup: string;
  changegroupname: string;


  constructor(public alertCtrl: AlertController, public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  deleteButton(){
    firebase.database().ref('/userData/'+this.userKey+'/groups/'+this.selectedGroup+'/dogs').once('value').then((snapshot)=>{
        console.log(typeof snapshot);
        console.log(snapshot.val());
        if(snapshot.val()!==null){
          let alertOK = this.alertCtrl.create({
            title: '삭제 실패',
            subTitle: '해당 그룹에 반려견이 존재합니다.',
            buttons: ['확인']
          });
        alertOK.present();
        }
        else{ //삭제할 수 있음
          let confirm = this.alertCtrl.create({
            title: '확인창',
            message: '해당 그룹을 정말로 삭제할까요?',
            buttons: [
            {
              text: '취소',
              cssClass: 'buttoncss',
              handler: () => {}
            },
            {
              text: 'Agree',
              cssClass: 'buttoncss',
              handler: () => {
                this.manageService.removeGroup(this.selectedGroup);
                let alertOK = this.alertCtrl.create({
                    title: '삭제완료',
                    subTitle: '해당 그룹을 삭제했습니다.',
                    buttons: ['확인']
                });
              }
            }
            ]
          });
        confirm.present()
      }
    });
  }

  editButton(){
    let confirm = this.alertCtrl.create({
      title: '확인창',
      message: '해당 그룹을 수정할까요?',
      buttons: [
        {
          text: '취소',
          cssClass: 'buttoncss',
          handler: () => {
          }
        },
        {
          text: '수정',
          cssClass: 'buttoncss',
          handler: () => {
            this.manageService.editGroupName(this.editGroup, this.changegroupname);
          }
        }
      ]
    });
    confirm.present()
   }
}

@Component({
  templateUrl: './addingDog.html'
})
export class AddingDogPage {
  userKey: string;

  dogname:string ;
  groupname: string;
  birth:Date;
  gender: string;

  dogage:number;
  grouplist: FirebaseListObservable<any[]>;
  alreadygroup;
  mealtime: string[];

  constructor(public alertCtrl: AlertController, public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.alreadygroup = null;
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  addingbutton(){
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: '추가할거야?',
     buttons: [
       {
         text: 'Disagree',
         cssClass: 'buttoncss',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: 'Agree',
         cssClass: 'buttoncss',
         handler: () => {
           console.log('Agree');
           console.log("^^alreadygroup: "+this.alreadygroup);
           console.log("dogname :" + this.dogname);
           console.log("birth :" + this.birth);
           console.log("sex : "+ this.gender);
           console.log("mealtime: "+ this.mealtime);
           if(this.alreadygroup && this.alreadygroup!='moo_exception'){
             console.log("alreadygroup: "+this.alreadygroup);
             if((!this.dogname || this.dogname=='')||(!this.birth)||(!this.gender || this.gender=='')){
                let alertOK = this.alertCtrl.create({
                  title: '알림',
                  subTitle: '모든 항목을 입력해주세요.',
                  buttons: ['확인']
                });
             }else{
              this.manageService.addDogToGroup(this.alreadygroup, this.dogname, this.gender ,this.birth, this.mealtime);
             }
           }  else {
                console.log("newAdd");
                if((!this.dogname || this.dogname=='')||(!this.birth)||(!this.gender || this.gender=='')){
                  let alertOK = this.alertCtrl.create({
                    title: '알림',
                    subTitle: '모든 항목을 입력해주세요.',
                    buttons: ['확인']
                  });
                } else{
                  this.manageService.addDog(this.dogname, this.groupname, this.gender, this.birth, this.mealtime);
                }
           }
           let alertOK = this.alertCtrl.create({
            title: '강아지 등록',
            subTitle: '등록되었습니다.',
            buttons: ['확인']
          });
           this._viewCtrl.dismiss();
         }
       }
     ]
   });
   confirm.present();
  }
  addalreadygroupname(SelectedGroup){
    console.log("Selected Group: " + SelectedGroup);
  }

}

@Component({
  templateUrl: './inviting.html'
})
export class InvitingPage {
  userKey: string;
  grouplist: FirebaseListObservable<any[]>;
  groupobject: FirebaseObjectObservable<any>;
  GroupAndDogs: any;
  nameOfGroups: any;
  AllDogs: any;
  inviteduser:string;
  inviteddog:string;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService, db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    console.log(this.userKey);
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.groupobject = db.object('/userData/'+this.userKey+'/groups');
    console.log(this.grouplist);
    /*
    manageService.syncData();
    this.GroupAndDogs = manageService.getAllMyDogsToDict(); //{ groupName : dogs[] pair }
    this.nameOfGroups = Object.keys(this.GroupAndDogs);
    let NumberOfGroups = Object.keys(this.GroupAndDogs).length;

    this.AllDogs = manageService.getAllMyDogs();
    */

  }
  invitebutton(){

    console.log("invited dog :" + this.inviteddog );
    this.manageService.invite(this.inviteduser, this.inviteddog);
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
  <ion-toolbar>
      <ion-title>수신 초대 목록</ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="main" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list *ngFor="let item of invitations | async">
    <button ion-item (click)="select(item)">
      {{item.dog_name}}
    </button>
  </ion-list>
</ion-content>

  `
})
export class InviteInfoPage {
  userKey: string;
  invitations: FirebaseListObservable<any[]>;
  selected;
  groups;

  constructor(public navParam: NavParams, public viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase, public alertCtrl: AlertController){
    this.userKey = navParam.data.userKey;
    this.groups = this.db.list('/userData/'+this.userKey+'/groups', {preserveSnapshot: true});
  }

  ionViewDidEnter(){
    if(this.userKey){
      this.invitations = this.db.list('/userData/'+this.userKey+'/invitation');

    }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  select(item){
    console.log(item.$key)
  let alert = this.alertCtrl.create();
  alert.setTitle('초대를 수락하시겠습니까?');
  alert.addInput({
    type:'radio',
    label: '새 그룹에 추가',
    value: null,
    checked: true
  })
  this.groups.subscribe((snapshot)=>{
        snapshot.forEach(snap=>{
          let groupName = snap.val().groupName;
          let grouopKey = snap.key;
          alert.addInput({
            type: 'radio',
            label: snap.val().groupName,
            value: snap.key,
            checked: false
          });
        })
      });

        alert.addButton({
          text: '거절',
          handler: data=>{
            this.manageService.rejectInvitation(item);
          }
        });
        alert.addButton({
          text: '수락',
          handler: data => {
            console.log("z:"+JSON.stringify(data));
            if(data==""){
              console.log("-")
              let prompt = this.alertCtrl.create({
                title: '새 그룹에 추가',
                message: "추가할 그룹명을 입력하세요",
                inputs: [
                  {
                    name: 'groupname',
                    placeholder: '그룹명'
                  },
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    handler: data => {
                    }
                  },
                  {
                    text: 'Save',
                    handler: data => {
                      this.manageService.receiveInvitation(data, item);
                    }
                  }
                ]
              });
              prompt.present();
            }else{
              console.log("+")
              this.manageService.receiveInvitationOnExists(data, item);
            }
          }
        });
        alert.present().then(() => {

        });
      }

}


@Component({
  templateUrl : './changeinfo.html'
})
export class ChangeInfoPage {
  userKey: string;
  grouplist: FirebaseListObservable<any[]>;
  AllDogs: any;
  changeddog: string = '';

  //editdoggroup: string;
  editdogname: string = '';
  editdogsex: string = '';
  editdogbirth: Date = null;

  moveanothergroup: string;

  constructor(public _viewCtrl: ViewController, public alertCtrl: AlertController, public manageService: ManageService, public db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
  }
  changeinfobutton(){ //해야해
    if(this.changeddog=='' || this.editdogname=='' || this.editdogsex=='' || this.editdogbirth===null){
      console.log('에외처리..모든필드입력요청');
      //this.alertCtrl.
      let confirm = this.alertCtrl.create({
        title: '알림',
        message: '모든 항목을 입력해주세요',
        buttons: [
          {
            text: '확인',
            cssClass: 'buttoncss',
            handler: () => {
            }
          }
        ]
      });
      confirm.present()
    }else{
      this.manageService.changeInfo(this.changeddog, this.editdogname, this.editdogsex, this.editdogbirth)//name, gender, birth, meal?
    }
  }
  editdog(SelectedDog){
    console.log("changed dog: "+ SelectedDog);
    let dog = this.db.object('dogData/'+SelectedDog, {preserveSnapshot: true});

    dog.subscribe(snap=>{
      this.editdogname = snap.val().name;
      this.editdogsex = snap.val().gender;
      this.editdogbirth = snap.val().birth;
      console.log("name==>"+name);
    })
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}
@Component({
  templateUrl: './saygoodbye.html'
})
export class GoodByePage {
  userKey: string;
  grouplist: FirebaseListObservable<any[]>;
  groupobject: FirebaseObjectObservable<any>;
  // GroupAndDogs: any;
  // nameOfGroups: any;
  // AllDogs: any;
  // inviteduser:string;
  goodbyedog:string;
  OKboolean: boolean = false;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase, public alertCtrl: AlertController, public toastCtrl: ToastController){
    this.userKey = manageService.userKey;

    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.groupobject = db.object('/userData/'+this.userKey+'/groups');
    console.log(this.grouplist);

  }
  deletebutton(){

    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: '이별하시겠습니까?',
     buttons: [
       {
         text: '아직은안돼요',
         cssClass: 'buttoncss',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: '그래요',
         cssClass: 'buttoncss',
         handler: () => {
           console.log("del dog"+this.goodbyedog);
           //this.manageService.addDog(this.dogname, this.groupname, this.gender, this.birth);
           //삭제 메소드 goodbyedog변수에 삭제할 강아지key값 가지고 있음.
           this.manageService.goodbyeDog(this.goodbyedog);
           let alertOK = this.alertCtrl.create({
            title: '이별완료',
            subTitle: '이별하였습니다.',
            buttons: ['확인']
          });
    alertOK.present();
         }
       }
     ]
   });
   confirm.present()
  //  if(this.OKboolean){
  //    let toast = this.toastCtrl.create({
  //       message: 'User was added successfully',
  //       duration: 3000
  //     });
  //     toast.present();
  //  }

  }

   dismiss(){
     this._viewCtrl.dismiss();
   }
}
