import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { YelpComponent } from './yelp/yelp.component';
import {YelpService} from './services/yelp-service.service';
import { AuthService } from './auth/auth.service';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TripComponent } from './trip/trip.component';
import { TripService} from './services/trip-service.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'yelp',
    component: YelpComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'trip',
    component: TripComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    YelpComponent,
    HomeComponent,
    CallbackComponent,
    ProfileComponent,
    NavbarComponent,
    TripComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ YelpService, AuthService, TripService],
  bootstrap: [AppComponent]
})
export class AppModule { }
