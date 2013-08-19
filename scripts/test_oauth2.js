var OAuth = require('OAuth');

var OAuth2 = OAuth.OAuth2;    
var twitterConsumerKey = 'pEdDoXEgEpSbkAzN';
var twitterConsumerSecret = 'unpYdLS16rlS7ITa1vVOD7hwJ8ZRzTkV';
var oauth2 = new OAuth2(
	twitterConsumerKey,
	twitterConsumerSecret,
	'http://localhost:3000/',
	null,
	'oauth/token',
	null);

oauth2.getOAuthAccessToken(
	'',
	{ 'grant_type': 'client_credentials' },
	function (e, access_token, refresh_token, results){
		console.log('bearer: ', access_token);
	}
);
