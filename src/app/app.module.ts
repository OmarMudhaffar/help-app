import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { OneSignal } from '@ionic-native/onesignal';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';

import { CallNumber } from '@ionic-native/call-number';

import { ReversePipe } from '../pipes/reverse/reverse'; 

import { AddPage } from '../pages/add/add';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireDatabaseModule } from 'angularfire2/database'

import { EditPage } from '../pages/edit/edit';

import { HelpPage } from '../pages/help/help';
import { InfoPage } from '../pages/info/info';
import { VolunteerPage } from '../pages/volunteer/volunteer';
import { FeedbackPage } from '../pages/feedback/feedback';

const firebase = { 
  apiKey: "AIzaSyCb6RdOSAJZrQC3vvhiVq318HCRXIlUD20",
  authDomain: "help-18ed4.firebaseapp.com",
  databaseURL: "https://help-18ed4.firebaseio.com",
  projectId: "help-18ed4",
  storageBucket: "help-18ed4.appspot.com",
  messagingSenderId: "938889105700"
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    LoadingPage,
    AddPage,
    EditPage,
    HelpPage,
    InfoPage,
    ReversePipe,
    VolunteerPage,
    FeedbackPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule, 
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    LoadingPage,
    AddPage,
    EditPage,
    HelpPage,
    InfoPage,
    VolunteerPage,
    FeedbackPage 
  ],
  providers: [
    StatusBar,
    Geolocation,
    CallNumber,
    SplashScreen,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
