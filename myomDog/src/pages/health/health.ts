import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the Health page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-health',
  templateUrl: 'health.html'
})
export class HealthPage {

  graph: string = "week"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  history: string = "everything"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  isAndroid: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Health');
  }

}

@Component({
  selector: 'edit-remove-slide-options',
  template: `<button ion-button color="primary" icon-left>
      <ion-icon name="create"></ion-icon>
      편집
    </button>
    <button ion-button color="danger" icon-left>
      <ion-icon name="trash"></ion-icon>
      삭제
    </button>`
})
export class SlideOptions {
  constructor(){
  }
}
