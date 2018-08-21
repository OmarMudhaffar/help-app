import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import * as $ from "jquery";
import { HomePage } from '../home/home';
import { Observable } from 'rxjs';
declare var google;
import {
  GoogleMap,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  moon : GoogleMap;
  mapname;
  problem;
  lat;
  lng;
  addr;
  des;
  name;
  date;
  loca;
  markname;
  color;
  list:Observable<any>;
  mohafada;
  check = false;
  checkadd = true;
  key;



  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public db : AngularFireDatabase,
      public auth : AngularFireAuth, public platform : Platform,
     public alert : AlertController) {
        

    this.mapname = navParams.get("map");
    this.problem = navParams.get("problem");
    this.lat = navParams.get("lat");
    this.lng = navParams.get("lng");
    this.addr = navParams.get("addr");
    this.des = navParams.get("des");
    this.name = navParams.get("name");
    this.date = navParams.get("date");
    this.markname = navParams.get("markname");
    this.color = navParams.get("color"); 

  

    this.list = db.list("helpers/" + this.mapname,res => res.orderByChild("map").equalTo(this.mapname)).valueChanges();
    
    db.list("users",res => res.orderByChild("email").equalTo(auth.auth.currentUser.email)).valueChanges().subscribe( data => {
      this.mohafada = data[0]['mohafada'];
      this.loca = data[0]['address'];
    });

    db.list("helpers/" + this.mapname,res => res.orderByChild("email").equalTo(auth.auth.currentUser.email)).snapshotChanges().subscribe( (datacheck)=> {
     
      if(datacheck[0] != undefined){
     this.check = datacheck[0].payload.val()['check'];
     this.checkadd = datacheck[0].payload.val()['checkadd'];
     this.key = datacheck[0].key;
      }

    });

    platform.ready().then( ()=> {
      this.loadmymap();
    });
   

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }


  remhelper(){

    var alert = this.alert.create({
      subTitle:"هل تريد الخروج من التطوع ؟",
      buttons:[{text:"نعم",handler: ()=> {

        this.check = false;
        this.checkadd = true;
       this.db.list("helpers/" + this.mapname).remove(this.key);
      } },"الغاء"],
      cssClass:"alertdir"
    });

    alert.present();

  }
  
  back(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.goToRoot;
  }


  mini(){

 
    $("#mymaps").animate({
      height:"400"
    },100);

    $("#big").hide();
    $("#small").show();

}

miniSmall(){
  $("#mymaps").animate({
    height:"200"
  },100);

  $("#small").hide();
  $("#big").show();
}



loadmymap(){
    


   var map = this.moon = new GoogleMap(this.mapname,{
     camera: {
       target: {
         lat: this.lat,
         lng: this.lng
       },
       zoom: 18,
       tilt: 30
     },
     controls: {
      zoom:true,
      myLocationButton:true,
      myLocation:true,
     },
     gestures : {
       scroll:true,
       tilt:true,
       zoom:true,
       rotate:true
     }
     
   });

   map.addMarker({
    title: this.markname,
  icon: this.color,
  animation: 'DROP',
  position: {
    lat: this.lat,
    lng: this.lng
  }
  }).then((marker: Marker) => {

  }).catch(err => {
    alert(err.message);
  });


 }

 addhelper(){

  var alert = this.alert.create({
  subTitle:"هل تريد التسجيل كمتطوع ؟",
  buttons:[{text:"نعم",handler : ()=> {
    this.db.list("helpers/" + this.mapname).push({
      email:this.auth.auth.currentUser.email,
      map:this.mapname,
      name:this.name,
      addr:this.loca,
      mohafada:this.mohafada,
      check:true,
      checkadd:false
    });
  } },"الغاء"],
  cssClass:"alertdir"
  });

  alert.present();

 }

}
