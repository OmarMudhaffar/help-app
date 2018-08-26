import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as $ from "jquery";


/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams
     ,public load : LoadingController,
     public toast : ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  sendfed(name,email,msg){

    var toast = this.toast.create({
      message:"تم ارسال الرسالة",
      cssClass:"alertdire",
      duration:2000
    });


    var load = this.load.create({
      content:"جاري ارسال الرسالة"
    });

    if(name.length > 2 && email.length > 5 && msg.length > 5 && email.indexOf("@") != -1){
      load.present();
      var message = `{الاسم : ${name}} \n {الايميل : ${email}} \n {الرسالة : ${msg}}`
      $.get(`https://api.telegram.org/bot641005166:AAF-GraCFcw3BSxCjZ_doDpQt5CJP19OsdE/sendMessage?chat_id=-1001352207032&text=${message}`,function(data){
       
      if(data.ok == true){
        load.dismiss();
        toast.present();
        $("input,textarea").val("");
      }
       
      });
    }
   
  }

}
