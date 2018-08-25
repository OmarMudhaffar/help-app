import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as $ from "jquery";
import { OneSignal } from '@ionic-native/onesignal';

declare var google;
import {
  GoogleMap,
  GoogleMapsEvent,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';

import { HomePage } from '../home/home';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {


  mymaps : GoogleMap;
  min = true;
  lat = 0;
  lng = 0;
  name;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public geolocation : Geolocation,
     public platform : Platform , public db : AngularFireDatabase,
     public load : LoadingController, public auth : AngularFireAuth,
     public oneSignal: OneSignal) {

      
    
 
    platform.ready().then( ()=> {
      this.loadmymap();
    });
   
    db.list("users",ref => ref.orderByChild("email").equalTo(auth.auth.currentUser.email)).valueChanges().forEach( data => {
      this.name = data[0]['name'];
    });

  }



  ionViewDidLoad() {

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
    

   this.geolocation.getCurrentPosition().then( pos => {


    var map = this.mymaps = new GoogleMap("mymaps",{
      camera: {
        target: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
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

    map.on(GoogleMapsEvent.MAP_CLICK).subscribe( (params: any[])=> {
   
      
      this.lat = params[0].lat;
      this.lng = params[0].lng;

      map.clear();

      let latLng = params[0];


      map.addMarker({
      title: "مشكلة",
      icon: 'red',
      animation: 'DROP',
      position: latLng,
      }).then((marker: Marker) => {

      }).catch(err => {
        alert(err.message);
      })

     });

   });
   

  }

  back(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.goToRoot;
  }


  post(problem,description,address,phone){


    var check = true;

    if(phone.length < 10){

      check = false;

      phone = "لا يوجد"

    }

    if(problem.length > 3 && description.length > 3 && address.length > 3 && this.lat != 0 && this.lng != 0){}
 
    var load = this.load.create({
      content:"جاري النشر"
    });

    load.present();

    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand5 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4] + char[rand5];


    var d = new Date();

const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

    this.db.list("problems").push({
     problem:problem,
     des:description,
     addr:address,
     email:this.auth.auth.currentUser.email,
     lat:this.lat,
     lng:this.lng,
     map:rand,
     name:this.name,
     color:"red",
     date: d.getFullYear() + "/" + d.getDate() + "/" + monthNames[d.getMonth()],
     map2:rand + "s",
     phone:phone,
     checkPhone:check,
     voulnteer:false,
     checkproblem:true,
     markname:problem
    }).then( ()=> {
      $("input").val();
      load.dismiss();
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.goToRoot;

      this.db.list("ids").valueChanges().subscribe( ids => {

        ids.forEach(id => {



          this.oneSignal.postNotification({
            app_id:"1f9f4147-24d7-46e4-be3d-c5403ac23fac",
            include_player_ids:[id['id']],
            contents: {
              en: "هناك مشكلة جديدة تطوع الان وساعدنا في حلها"
            },
            headings: {
              en: "مشكلة"
            }
          })
        })

       

      });


    })

  }

}
