import { Component, OnInit } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {AuthService} from '../auth/auth.service';
import { TripModel } from '../../core/models/trip.model';
import {Restaurant} from '../../Restaurant';
import {TripService} from '../services/trip-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  Trips: TripModel[];
  restaurants: Restaurant[];
  tripName: string;
  user: any;

  constructor( public auth: AuthService, private tripService: TripService, private router: Router) {
  }

  ngOnInit() {
    if (this.auth.userProfile) {
      this.user = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.user = profile.sub;
        this.tripService.getTrips(this.user).subscribe(response => {
          this.Trips = response;
          console.log(this.Trips);
        });
      });
    }

  }
  // creating new Trip
  public createNew(event) {
    if (this.tripName !== undefined) {
      event.preventDefault();
      this.router.navigate(['/trip']);
      this.tripService.createNewTrip(this.user, this.tripName).subscribe(response => console.log(response));
      window.location.reload();
    }

  }
  // delete a Trip
  public deleteTrip(event, trip) {
    event.preventDefault();
    this.tripService.deleteTrip(trip._id).subscribe(response => console.log(response));
    window.location.reload();
  }

  public deleteRestaurant(event, restaurant, trip) {
    event.preventDefault();
    let Restaurants = trip.restaurants;
    const index = Restaurants.indexOf(restaurant);
    if (index > -1) {
      Restaurants.splice(index, 1);
    }
    // Restaurants = Restaurants.filter(Boolean);
    // console.log(Restaurants);
    const newTrip = trip;
    // var newRests = Restaurant[];
    // for (var i = 0 ; i< Restaurants.length -1 ; i++){
    //   newRests[i] = Restaurants[i];
    // }
    newTrip.restaurants = Restaurants;
    this.tripService.deleteRestFromTrip(newTrip).subscribe(res => {console.log(res); });
  }
}
