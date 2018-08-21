import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import * as $ from "jquery";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  registerCheck = true;
  loginCheck = false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public auth : AngularFireAuth, public alert : AlertController,
     public toast : ToastController,
     public load : LoadingController,
     public db : AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(email,pass){

    if(this.loginCheck == true){

      var load = this.load.create({
        content:"جاري تسجيل الدخول"
      });

    if(email.length > 4 && pass.length >= 6){
      load.present();
      this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {
        load.dismiss();

       if(this.auth.auth.currentUser.emailVerified == true){
         this.navCtrl.setRoot(HomePage);
         this.navCtrl.goToRoot;
       }

       if(this.auth.auth.currentUser.emailVerified == false){
        var alert = this.alert.create({
          subTitle:"قم بتأكيد البريد الالكتروني",
          buttons:["حسنا",{text:"ارسال التأكيد",handler: ()=> {
            this.auth.auth.currentUser.sendEmailVerification();
          } }],
          cssClass:"alertdire"
        });
        alert.present();
       }
      }).catch( err => {
        load.dismiss();
        console.log(err.message);
        if(err.message == "The password is invalid or the user does not have a password."){
          this.showerror("كلمة مرور غير صحيحة")
        }

        if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
          this.showerror("بريد الكتروني غير موجود")
        }

        if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
          this.showerror("يرجى التحقق من الاتصال بلشبكة")
        }

      });

    }

    }
 
   if(this.registerCheck == true){
    this.registerCheck = false;
    this.loginCheck = true;
    $("#register-view").hide();
    $("#login-view").fadeIn();
   }

  }

  showerror(message){
    var alert = this.alert.create({
      subTitle:message,
      buttons:['حسنا'],
      cssClass:"alertdire"
    });
    alert.present();
  }

  register(name,email,pass,mohafada,address){


    if(this.registerCheck == true){

      var load = this.load.create({
        content:"جاري انشاء الحساب",
      });

      

      if(name.length > 4 && email.length > 4 && pass.length >= 6){

        load.present();

       this.auth.auth.createUserWithEmailAndPassword(email,pass).then( ()=> {
        load.dismiss();
         this.auth.auth.currentUser.sendEmailVerification().then( ()=> {
           $("input").val("");
            var alert = this.alert.create({
              subTitle:"تم ارسال رابط التفعيل الى بريدك الالكتروني",
              buttons:["حسنا"],
              cssClass:"alertdire"
            });

            alert.present();

           this.db.list("users").push({
              name:name,
              email:email,
              mohafada:mohafada,
              address:address
           })

         });

       }).catch( err => {
         load.dismiss();

         if(err.message == "The email address is badly formatted."){
           this.showerror("بريد الكتروني غير صالح")
         }

         if(err.message == "The email address is already in use by another account."){
          this.showerror("بريد الكتروني مستخدم")
         }

         if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
           this.showerror("يرجى التحقق من الاتصال بلشبكة")
         }

         console.log(err.message);
       
       });

      }

    }

    this.loginCheck = false;
    this.registerCheck = true;
    $("#login-view").hide();
    $("#register-view").fadeIn();

     
  }


}
