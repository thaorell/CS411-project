Welcome to CS411- group 4's repository. We developed a web application for searching restaurants and creating food journal for your traveling trips. Our members are listed below:

| Member          | Major                | Graduation Year  |
| -------------   |:--------------------:| ----------------:|
|Charles Thao     | Computer Engineering | 2019             |
|Shizhan Qi       | Computer Science     | 2019             |
|Jay Park         | Computer Science     | 2018             |

##Set up environment

To set up our application, you will need API keys for Yelp and Google Custom Search. You can easily register for these APIs https://www.yelp.com/developers for Yelp and https://developers.google.com/custom-search/docs/tutorial/creatingcse for Google Custom Search. For authentication, we used [Auth0](https://auth0.com). 

After getting your API credentials, open a terminal and follow these steps:

#1. Clone the application
```
git clone https://github.com/thaorell/router
```

#2. Set up config
```
cd router
mkdir config
cd config/
touch config.js
```
Use any text editor, edit config using this template:
```
var config = {
  // MongoDB

  db: {
    uri: MY_MONGO_URI,
    collections: ['COLLECTION1', 'COLLECTION2']
  },
  // Yelp Credentials
  yelp: {
    clientID: MY_YELP_CLIENT,
    apiKey: MY_YELP_API_KEY
  },
  // Google Credentials
  google:{
    cseID: MY_CSE_ID,
    apiKey: MY_GOOGLE_API_KEY
  },
  //Twitter Credentials
  twitter: {
    clientID: MY_TWITTER_CLIENT,
    clientSecret: MY_CLIENT_SECRET,
    callbackURL: '/api/auth/twitter/callback'
  },
  auth0: {
    clientID: MY_AUTH0_CLIENT,
    domain: MY_DOMAIN,
    responseType: 'token id_token',
    audience: MY_AUDIENCE,
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  }
};

module.exports= config;
```
Remember to add http://localhost:4200/callback to the list of allowed callback in Auth0 settings.

#3. Install and deploy
```
npm install
npm install nodemon -g
npm start
```
