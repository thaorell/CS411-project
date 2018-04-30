// import * as auth0 from "@types/auth0-js/index";

/**
 * This is the configuration file as specified in the project specifications,
 * all constants are stored here
 */
// var fs = require('fs');
// var path = require('path');

var config = {
  // MongoDB

  db: {
    uri: "mongodb://charles:charles@ds149309.mlab.com:49309/router_users",
    collections: ['users','input','trips']
  },
  // Yelp Credentials
  yelp: {
    clientID: 'z9r79IG5Wv8_2ZSIKY1_BQ',
    apiKey: 'tN43MAdiIT-vMPzwZutU_isrUoER91-JPfBiBOtu4-s_Jx9VeG2bwFR0Cp8YlyfdJugsrhSp3e6NqpH15cOJJ2MN3sKj2nbhZjLNOA-SxqMtS8pNiZkdzCA0KIa6WnYx'
  },
  // Google Credentials
  google:{
    cseID: "009652964909322378393:rbkryuwrqj4",
    apiKey: "AIzaSyDbFVpM5Qqj2NastBSyiLlTbUgwuO0m3oE"
  },
  //Twitter Credentials
  twitter: {
    clientID: process.env.TWITTER_KEY || 'AloBEOP54stQzLjgu9bk43WPb',
    clientSecret: process.env.TWITTER_SECRET || 's7adCF1qsmjcpf3vO6FMogdvxfqCYg2NQY4Fql3KaMY7DQq3kN',
    callbackURL: '/api/auth/twitter/callback'
  },
  auth0: {
    clientID: 'Sy1WHN006vF1rL6Iojxa8fDv50M3Fh45',
    domain: 'encapsulate.auth0.com',
    responseType: 'token id_token',
    audience: 'https://encapsulate.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  }
};

module.exports= config;

