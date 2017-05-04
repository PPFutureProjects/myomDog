import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
/**
 * Generated class for the Setting page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Setting');
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
