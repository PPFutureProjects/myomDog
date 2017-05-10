import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import firebase from 'firebase';
import {ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './setting.html'
})
export class SettingPage {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public authService: AuthService) {
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

  constructor(public _viewCtrl: ViewController){
  }
  addingbutton(){
    console.log("dogname :" + this.dogname);
    console.log("dogage :" + this.dogage);
  }
  dismiss(){
    this._viewCtrl.dismiss();
  }

}

@Component({
  templateUrl: './inviting.html'
})
export class InvitingPage {
  inviteduser:string;
  inviteddog:string;
  constructor(public _viewCtrl: ViewController){
  }
  invitebutton(){
    console.log("dogname :" + this.inviteduser );
    console.log("dogage :" + this.inviteddog );
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
