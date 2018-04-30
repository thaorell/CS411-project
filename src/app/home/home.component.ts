import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { YelpService } from "./../services/yelp-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit() {
  }

}
