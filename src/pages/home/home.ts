import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { AddPage } from '../add/add';
declare var google;
import { AboutPage } from '../about/about';
import { Observable } from 'rxjs';
import { ContactPage } from '../contact/contact';
import { CallNumber } from '@ionic-native/call-number';
import { HelpPage } from '../help/help';
import { InfoPage } from '../info/info';
import * as $ from "jquery";
import { OneSignal } from '@ionic-native/onesignal';
import {  VolunteerPage  } from '../volunteer/volunteer';

import {
  GoogleMap,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';

import { FeedbackPage } from '../feedback/feedback';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map : GoogleMap;
  lat : Number = 0;
  long : Number = 0;
  watch : any;
  list:Observable<any>;

  name;
  addr;
  email;

  constructor(public navCtrl: NavController,
     public platform : Platform,
      public alert : AlertController,
      public auth : AngularFireAuth, public db : AngularFireDatabase,
      public call : CallNumber,
      public oneSignal: OneSignal) {

      this.list = db.list("problems").valueChanges();

      db.list("users", res => res.orderByChild("email").equalTo(auth.auth.currentUser.email)).valueChanges().subscribe( (data)=> {
        this.name = data[0]['name'];
        this.addr = data[0]['address'];
        this.email = auth.auth.currentUser.email;
        $(".loading").hide();
      });
     
      platform.ready().then( ()=> {
        this.loadmap();
  
      });

      this.mynote();

      this.checkNote();

  }

  checkNote(){
    this.oneSignal.getIds().then( id => {
      this.db.list("ids",ref => ref.orderByChild("id").equalTo(id.userId)).valueChanges().subscribe( mdata => {
       if(mdata[0] == undefined){
         this.db.list("ids").push({
           id:id.userId
         })
       }
      });
      });
  }


  mynote(){
    this.oneSignal.startInit('1f9f4147-24d7-46e4-be3d-c5403ac23fac', '938889105700');

this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);


this.oneSignal.endInit();
  }


  callNumber(number){
    this.call.callNumber(number,true);
  }

  
  logout(){
    var alert = this.alert.create({
      subTitle:"تسجيل الخروج من حسابك ؟",
      buttons:['الغاء',{text:'خروج',handler: out=> {
        this.auth.auth.signOut();
        
      }}],
      cssClass:"alertdir"
    });
    alert.present();
  }

  loadmap(){

    var i = 0;
    
    this.db.list("problems").valueChanges().subscribe(mdata => { 

      mdata.forEach(data => {

     var mymap = this.map = new GoogleMap(data['map'],{
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

      i = i++;



    });

  })

  


  }

  add(){
    this.navCtrl.setRoot(AddPage);
    this.navCtrl.goToRoot;
  }

  openMap(){
    this.navCtrl.setRoot(AboutPage);
    this.navCtrl.goToRoot;
  }

  openMyAlarm(){
    this.navCtrl.setRoot(ContactPage);
    this.navCtrl.goToRoot;
  }


  help(checkproblem,voulnteer,map,lat,lng,problem,addr,des,name,date,markname,color){
   this.navCtrl.setRoot(HelpPage,{
     map:map,
     des:des,
     lat:lat,
     lng:lng,
     problem:problem,
     addr:addr,
     name:name,
     date:date,
     markname:markname,
     color:color,
     cproblem:checkproblem,
      voulnteer:voulnteer
   });
   this.navCtrl.goToRoot;
  }

  request(checkproblem,voulnteer,map,lat,lng,problem,addr,des,name,date,markname,color){
    this.navCtrl.setRoot(HelpPage,{
      map:map,
      des:des,
      lat:lat,
      lng:lng,
      problem:problem,
      addr:addr,
      name:name,
      date:date,
      markname:markname,
      color:color,
      cproblem:checkproblem,
      voulnteer:voulnteer
    });
    this.navCtrl.goToRoot;
   }


  myinfo(){
    this.navCtrl.push(InfoPage,{
      name:this.name,
      email:this.email,
      addr:this.addr
    });
  }

  volunteer(){
    this.navCtrl.setRoot(VolunteerPage);
    this.navCtrl.goToRoot;
  }

  feedback(){
    this.navCtrl.push(FeedbackPage);
  }

}
