import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoadingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public auth : AngularFireAuth) {

    auth.authState.subscribe( res=> {
   
      if(res == null){
        navCtrl.setRoot(LoginPage);
        navCtrl.goToRoot;
      }
       
      if(res != null){
        if(!res.emailVerified){
          console.log(res.emailVerified);
          navCtrl.setRoot(LoginPage);
        navCtrl.goToRoot;
        }

        if(res.emailVerified){

          navCtrl.setRoot(HomePage);
          navCtrl.goToRoot;
        }

      }

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadingPage');
  }

}
