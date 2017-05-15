import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ManageService } from '../../providers/manage-service';
import firebase from 'firebase';
import {ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './setting.html'
})
export class SettingPage {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public authService: AuthService, public manageService: ManageService) {
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
  dogage:number;

  constructor(public _viewCtrl: ViewController, public manageService: ManageService){
  }
  addingbutton(){
    console.log("dogname :" + this.dogname);
    console.log("dogage :" + this.dogage);
    this.manageService.addDog(this.dogname);
  }
  dismiss(){
    this._viewCtrl.dismiss();
  }

}

@Component({
  templateUrl: './inviting.html'
})
export class InvitingPage {
  myDogsGroups: any;
  inviteduser:string;
  inviteddog:string;
  constructor(public _viewCtrl: ViewController, public manageService: ManageService){
    this.myDogsGroups = this.manageService.getMyGroups(); //All my dog Groups 
    console.log(this.myDogsGroups);
  }
  invitebutton(){
    console.log("dogname :" + this.inviteduser );
    console.log("dogage :" + this.inviteddog );
    this.manageService.invite(this.inviteduser, this.inviteddog);
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
  constructor(public _viewCtrl: ViewController){

  }
  changeinfobutton(){
    console.log("changed dog :" + this.changeddog );
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}
