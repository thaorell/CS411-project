import { Component, Input } from '@angular/core';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Restaurant} from '../../Restaurant';

@Injectable()
export class TripService {

  constructor(private http: Http) {
    console.log('Service Initialized...');
  }

  public createNewTrip(UserId, Name: string) {
    const Restaurants = [];
    const item = {
      userId: UserId,
      name: Name,
      restaurants: Restaurants,
      isComplete: false
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4200/api/trip/all/', JSON.stringify(item), { headers: headers })
      .map(res => res.json());
  }

  public getTrips(userId) {
    return this.http.get('http://localhost:4200/api/trip/' + userId)
      .map(res => res.json());
  }

  public postRestToTrip(restaurant, trip) {
    var newTrip = trip;
    var newRests = trip.restaurants;
    // console.log(newRests);
    newRests.push(restaurant);
    newTrip.restaurants = newRests;

    const item = {
      userId: trip.userId,
      name: trip.name,
      restaurants: newRests,
      isComplete: false
    };
    return this.http.put('http://localhost:4200/api/trip/all/' + trip._id , newTrip).map(res => res.json());
  }

  public deleteTrip(tripId){
    return this.http.delete('http://localhost:4200/api/trip/all/' + tripId).map(res => res.json());
  }

  public deleteRestFromTrip(trip) {
    return this.http.put('http://localhost:4200/api/trip/all/' + trip._id , trip).map(res => res.json());
  }
}
