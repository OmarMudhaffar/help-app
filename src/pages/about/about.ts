import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';

import { ContactPage } from '../contact/contact'
import { HomePage } from '../home/home';
import { InfoPage } from '../info/info';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  mymaps : GoogleMap;
  lat : Number = 0;
  long : Number = 0;
  watch : any;

  name;
  addr;
  email;

  constructor(public navCtrl: NavController, public platform : Platform,
  public db : AngularFireDatabase, public geolocation : Geolocation, public auth : AngularFireAuth) {

  
      platform.ready().then( ()=> {
        this.loadmap();
  
      });

      db.list("users", res => res.orderByChild("email").equalTo(auth.auth.currentUser.email)).valueChanges().subscribe( (data)=> {
        this.name = data[0]['name'];
        this.addr = data[0]['address'];
        this.email = auth.auth.currentUser.email
      });

  }


  
  loadmap(){

    this.geolocation.getCurrentPosition().then( pos => {
  
    var map = this.mymaps = new GoogleMap("mymaps",{
          camera: {
            target: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            },
            zoom: 14,
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

        this.db.list("problems").valueChanges().subscribe(mydata => {

          mydata.forEach(data => {
  
            map.addMarker({
          title: data['problem'],
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
  
      });
  
      });

  }

  openMyAlarm(){
    this.navCtrl.setRoot(ContactPage);
    this.navCtrl.goToRoot;
  }

  openHome(){
    this.navCtrl.setRoot(HomePage);
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
