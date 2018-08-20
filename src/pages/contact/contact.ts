import { Component } from '@angular/core';
import { NavController,Platform,AlertController } from 'ionic-angular';
declare var google;

import { Observable } from 'rxjs';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import * as $ from "jquery";

import { EditPage } from '../edit/edit';
import { InfoPage } from '../info/info';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  map : GoogleMap;
  lat : Number = 0;
  long : Number = 0;
  watch : any;
  list:Observable<any>;

  name;
  addr;
  email;

  constructor(public navCtrl: NavController, public platform : Platform,
    public alert : AlertController,
    public auth : AngularFireAuth, public db : AngularFireDatabase) {

      this.list = db.list("problems",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges();
    
      db.list("problems",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe( (data)=> {
         if(data[0] != undefined){
           $(".noitem").hide();
         }
      });
           
      platform.ready().then( ()=> {
        this.loadmap();
  
      });

      db.list("users", res => res.orderByChild("email").equalTo(auth.auth.currentUser.email)).valueChanges().subscribe( (data)=> {
        this.name = data[0]['name'];
        this.addr = data[0]['address'];
        this.email = auth.auth.currentUser.email
      });

  }


  delete(key){

    var alert = this.alert.create({
      subTitle:"هل تريد حذف المشكلة ؟",
      buttons:[{text:"نعم",handler: ()=> {
    this.db.list("problems").remove(key);
      } },"كلا"],
      cssClass:"alertdire"
    });

    alert.present();

  }


  edit(problem,des,addr,key,map,phone,lat,lng,mark){

    this.navCtrl.setRoot(EditPage,{
      problem:problem,
      des:des,
      addr:addr,
      key:key,
      map:map,
      phone:phone,
      lat:lat,
      lng:lng
    });
    this.navCtrl.goToRoot;

  }

  aprove(key){
   var alert = this.alert.create({
     title:"تم حل المشكلة",
     subTitle:"بلضغط على تأكيد بهذا انت تأكد ان المشكلة تم حلها",
     buttons:[{text:"تأكيد",handler : ()=> {
       this.db.list("problems").update(key,{
         color:"green",
         markname:"تم حلها"
       });
     }
     
    },"الغاء"],
    cssClass:"alertdire"

   });

   alert.present();

  }

  loadmap(){
    
    this.db.list("problems",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).valueChanges().subscribe(mdata => { 

      mdata.forEach(data => {

     var mymap = this.map = new GoogleMap(data['map2'],{
        camera: {
          target: {
            lat: data['lat'],
            lng: data['lng']
          },
          zoom: 18,
          tilt: 30
        },
        controls: {
         compass:true,
         zoom:true,
         myLocationButton:true,
         myLocation:true,
         mapToolbar:true,
         indoorPicker:true,
        },
        gestures : {
          scroll:true,
          tilt:true,
          zoom:true,
          rotate:true
        }
        
      });

      mymap.addMarker({
        title: data['markname'],
      icon: data['color'],
      animation: 'DROP',
      position: {
        lat: data['lat'],
        lng: data['lng']
      }
      }).then((marker: Marker) => {

      }).catch(err => {
        alert(err.message);
      });



    });

  })

  

  }

  openHome(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.goToRoot;
  }

  openMap(){
    this.navCtrl.setRoot(AboutPage);
    this.navCtrl.goToRoot;
  }

  myinfo(){
    this.navCtrl.push(InfoPage,{
      name:this.name,
      email:this.email,
      addr:this.addr
    });
  }

}
