import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, LoadingController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import * as $ from "jquery";

declare var google;
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { ContactPage } from '../contact/contact';

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  mymaps : GoogleMap;
  min = true;
  lat = 0;
  lng = 0;
  name;

  problem;
  des;
  addr;
  phone;
  key;
  mapname;
  mlat;
  mlng;
  mark;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public geolocation : Geolocation,
    public platform : Platform , public db : AngularFireDatabase,
    public load : LoadingController, public auth : AngularFireAuth) {
  this.problem = navParams.get("problem");
  this.des = navParams.get("des");
  this.addr = navParams.get("addr");
  this.phone = navParams.get("phone");
  this.key = navParams.get("key");
  this.mapname = navParams.get("map");

  this.mlat = navParams.get("lat");
  this.mlng = navParams.get("lng");

  this.mark = navParams.get("mark");

  platform.ready().then( ()=> {
    this.loadmymap();
  });
 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
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
    


   var map = this.mymaps = new GoogleMap("mymaps",{
     camera: {
       target: {
         lat: this.mlat,
         lng: this.mlng
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
    title: this.mark,
    icon: 'red',
    animation: 'DROP',
    position: {
      lat:this.mlat,
      lng:this.mlng
    },
    }).then((marker: Marker) => {

    }).catch(err => {
      alert(err.message);
    });

   map.on(GoogleMapsEvent.MAP_CLICK).subscribe( (params: any[])=> {
  
     
     this.lat = params[0].lat;
     this.lng = params[0].lng;

     map.clear();

     let latLng = params[0];


     map.addMarker({
     title: this.mark,
     icon: 'red',
     animation: 'DROP',
     position: latLng,
     }).then((marker: Marker) => {

     }).catch(err => {
       alert(err.message);
     });

  });


 }

 back(){
  this.navCtrl.setRoot(ContactPage);
  this.navCtrl.goToRoot;
}

 edit(problem,description,address,phone){


  var check = true;

  if(phone.length < 10){

    check = false;

    phone = "لا يوجد"

  }



  if(problem.length > 3 && description.length > 3 && address.length > 3 && this.lat != 0 && this.lng != 0){}

  var load = this.load.create({
    content:"جاري التعديل"
  });

  load.present();

  var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
  var rand1 = Math.floor(Math.random() * char.length);
  var rand2 = Math.floor(Math.random() * char.length);
  var rand3 = Math.floor(Math.random() * char.length);
  var rand4 = Math.floor(Math.random() * char.length);
  var rand5 = Math.floor(Math.random() * char.length);
  var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4] + char[rand5];


  this.db.list("problems").update(this.key,{
   problem:problem,
   des:description,
   addr:address,
   lat:this.lat,
   lng:this.lng,
   color:"red",
   phone:phone,
   checkPhone:check,
   markname:problem
  }).then( ()=> {
    $("input").val();
    load.dismiss();
    this.navCtrl.setRoot(ContactPage);
    this.navCtrl.goToRoot;
  })

}

}
