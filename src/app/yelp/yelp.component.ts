import { Component, OnInit } from '@angular/core';
import { Restaurant } from "../../Restaurant";
import { YelpService } from "../services/yelp-service.service";
declare function require(name:string);
//const config = require( '../../../config/config.js');

@Component({
  selector: 'app-yelp',
  templateUrl: './yelp.component.html',
  styleUrls: ['./yelp.component.css']
})
export class YelpComponent implements OnInit {

  constructor(private yelpService: YelpService) {

  }

  ngOnInit() {
  }
  restaurants: Restaurant[];
  term: string;
  location: string;
  images: string[];

  handleInput(event){
    event.preventDefault();
    this.yelpService.postRestaurants(this.term, this.location).subscribe(res => console.log(res));
    this.yelpService.getRestaurants()
      .subscribe(res => {
      var result = [];
      for (var i=0; i< res.length; i++){
        var restaurant = res[i];
        var temp = {
          title: restaurant.name,
          location: restaurant.location,
          coordinates: restaurant.coordinates,
          url: restaurant.url,
        };
        result.push(temp);
      }
      this.restaurants = result;
      console.log(this.restaurants);
    });
  }

  //getImageJSON(input){
    //const client = new GoogleImages(config.google.cseID, config.google.apiKey);
 // }


}
