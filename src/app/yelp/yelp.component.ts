import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../Restaurant';
import { YelpService } from '../services/yelp-service.service';
declare function require(name: string);
import { AuthService} from '../auth/auth.service';
import {TripModel} from '../../core/models/trip.model';
import {TripService} from '../services/trip-service.service';

@Component({
  selector: 'app-yelp',
  templateUrl: './yelp.component.html',
  styleUrls: ['./yelp.component.css']
})
export class YelpComponent implements OnInit {
  trips: TripModel[];
  restaurants: Restaurant[];
  term: string;
  location: string;
  user: any;
  selectedValue: object;

  constructor(private yelpService: YelpService, public auth: AuthService, public tripService: TripService) {

  }

  ngOnInit() {
    if (this.auth.userProfile) {
      this.user = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.user = profile.sub;
        this.tripService.getTrips(this.user).subscribe(response => {
          this.trips = response;
          console.log(this.trips);
        });
      });
    }
  }


  // handleInput(event) {
  //   event.preventDefault();
  //   this.yelpService.postRestaurants(this.term, this.location).subscribe(res => console.log(res));
  //   this.yelpService.getRestaurants()
  //     .subscribe(res => {
  //     const result = [];
  //     for (let i = 0; i < res.length; i++) {
  //       const restaurant = res[i];
  //       const temp = {
  //         title: restaurant.name,
  //         location: restaurant.location,
  //         coordinates: restaurant.coordinates,
  //         url: restaurant.url,
  //         image_url: restaurant.imageURLs,
  //         rating: restaurant.rating,
  //         price: restaurant.price
  //       };
  //       result.push(temp);
  //     }
  //     this.restaurants = result;
  //     console.log(this.restaurants);
  //   });
  // }

  handleInput(event) {
    event.preventDefault();
    this.yelpService.new_getRestaurants(this.term, this.location)
      .subscribe(res => {
        const result = [];
        for (let i = 0; i < res.length; i++) {
          const restaurant = res[i];
          const temp = {
            title: restaurant.name,
            location: restaurant.location,
            coordinates: restaurant.coordinates,
            url: restaurant.url,
            image_url: restaurant.imageURLs,
            rating: restaurant.rating,
            price: restaurant.price
          };
          result.push(temp);
        }
        this.restaurants = result;
        console.log(this.restaurants);
      });
  }
  addRestaurant(event, restaurant) {
    event.preventDefault();
    var Restaurant = {
      title: restaurant.title,
      location: restaurant.location,
      coordinates: restaurant.coordinates,
      url: restaurant.url,
      image_url: restaurant.image_url,
      rating: restaurant.rating,
      price: restaurant.price
    };
    this.tripService.postRestToTrip(Restaurant, this.selectedValue).subscribe(res => {console.log(res); });
  }



}
