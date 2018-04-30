import { Component, Input } from '@angular/core';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class YelpService {

  constructor(private http: Http) {
    console.log('Service Initialized...');
  }

  public postRestaurants(term, location) {

    const item = {
      term: term,
      location: location
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4200/api/yelp/search', JSON.stringify(item), { headers: headers })
      .map(res => res.json());
  }

  public getRestaurants() {

    return this.http.get('http://localhost:4200/api/yelp/')
      .map(res => res.json());
  }
  public new_getRestaurants(term, location) {
    return this.http.get('http://localhost:4200/api/yelp/' + term + '/' + location)
      .map(res => res.json());
  }
}
