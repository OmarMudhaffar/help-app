import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingPage } from '../pages/loading/loading';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AddPage } from '../pages/add/add'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoadingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      platform.ready().then( ()=> {
        if (splashScreen) {
          setTimeout(() => {
            splashScreen.hide();
          }, 100);
      }
      } )
  }
}
