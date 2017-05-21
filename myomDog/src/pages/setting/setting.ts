import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ManageService } from '../../providers/manage-service';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import {ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './setting.html'
})
export class SettingPage {

  constructor(public modalCtrl: ModalController, 
              public navCtrl: NavController, 
              public authService: AuthService, 
              public manageService: ManageService,
              db: AngularFireDatabase) {
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

  logout() {
    this.authService.doLogout();
  }

}

@Component({
  templateUrl: './addingDog.html'
})
export class AddingDogPage {
  dogname:string;
  groupname: string;
  dogage:number;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService){
  }
  addingbutton(){
    console.log("dogname :" + this.dogname);
    console.log("dogage :" + this.dogage);
    this.manageService.addDog(this.dogname, this.groupname);
  }
  dismiss(){
    this._viewCtrl.dismiss();
  }

}

@Component({
  templateUrl: './inviting.html'
})
export class InvitingPage {
  GroupAndDogs: any; 
  nameOfGroups: any;
  AllDogs: any;
  inviteduser:string;
  inviteddog:string;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService, db: AngularFireDatabase){
    manageService.syncData();
    this.GroupAndDogs = manageService.getAllMyDogsToDict(); //{ groupName : dogs[] pair }
    this.nameOfGroups = Object.keys(this.GroupAndDogs);
    let NumberOfGroups = Object.keys(this.GroupAndDogs).length;
    
    this.AllDogs = manageService.getAllMyDogs();
  }
  invitebutton(){
    console.log("dogname :" + this.inviteduser );
    console.log("dogage :" + this.inviteddog );
    console.log(this.inviteduser);
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
  changeddog:string;
  constructor(public _viewCtrl: ViewController, db: AngularFireDatabase){

  }
  changeinfobutton(){
    console.log("changed dog :" + this.changeddog );
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}

