import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ManageService } from '../../providers/manage-service';
// import firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalController, ViewController } from 'ionic-angular';

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

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public authService: AuthService, public _viewCtrl: ViewController, public manageService: ManageService, db: AngularFireDatabase) {
    this.userKey = manageService.userKey;
    console.log(this.userKey);
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.groupobject = db.object('/userData/'+this.userKey+'/groups');
    console.log(this.grouplist);
    this.pushboolean = true;
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
  selectedGroup: string

  constructor(public alertCtrl: AlertController, public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  deleteButton(){
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: '해당 그룹을 정말로 삭제할까요?',
     buttons: [
       {
         text: 'Disagree',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: 'Agree',
         handler: () => {
           this.manageService.removeGroup(this.selectedGroup);
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

  dogname:string;
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
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: 'Agree',
         handler: () => {
           console.log('Agree');
           console.log("^^alreadygroup: "+this.alreadygroup);
           console.log("dogname :" + this.dogname);
           console.log("birth :" + this.birth);
           console.log("sex : "+ this.gender);
           console.log("mealtime: "+ this.mealtime);
           if(this.alreadygroup){
             console.log("alreadygroup: "+this.alreadygroup);
            this.manageService.addDogToGroup(this.alreadygroup, this.dogname, this.gender ,this.birth);
           }  else {
                console.log("newAdd");
                this.manageService.addDog(this.dogname, this.groupname, this.gender, this.birth);
           }
         }
       }
     ]
   });
   confirm.present()
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
    this.manageService.invite(this.inviteduser, this.inviteddog.toString());
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}

@Component({
  templateUrl : './changeinfo.html'
})
export class ChangeInfoPage {
  userKey: string;
  grouplist: FirebaseListObservable<any[]>;
  groupobject: FirebaseObjectObservable<any>;
  GroupAndDogs: any;
  nameOfGroups: any;
  AllDogs: any;
  changeddog: string;

  //editdoggroup: string;
  editdogname: string;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase){
    this.userKey = manageService.userKey;
    console.log(this.userKey);
    this.grouplist = db.list('/userData/'+this.userKey+'/groups');
    this.groupobject = db.object('/userData/'+this.userKey+'/groups');
    console.log(this.grouplist);
  }
  changeinfobutton(){
    console.log("changed dog :"+ this.changeddog );
  }
  editdog(SelectedDog){
    console.log("changed dog: "+ SelectedDog);
    let dog = this.db.object('dogData/'+SelectedDog, {preserveSnapshot: true});

    dog.subscribe(snap=>{
      this.editdogname = snap.val().name;
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

  constructor(public _viewCtrl: ViewController, public manageService: ManageService, public db: AngularFireDatabase, public alertCtrl: AlertController){
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
         text: 'Disagree',
         handler: () => {
           console.log('Disagree');
         }
       },
       {
         text: 'Agree',
         handler: () => {
           console.log("del dog"+this.goodbyedog);
           //this.manageService.addDog(this.dogname, this.groupname, this.gender, this.birth);
           //삭제 메소드 goodbyedog변수에 삭제할 강아지key값 가지고 있음.
           this.manageService.goodbyeDog(this.goodbyedog);
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
