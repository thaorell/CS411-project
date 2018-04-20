import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule} from "@angular/http";

import { AppComponent } from './app.component';
import { YelpComponent } from './yelp/yelp.component';
import {YelpService} from "./services/yelp-service.service";


@NgModule({
  declarations: [
    AppComponent,
    YelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ YelpService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
