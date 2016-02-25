// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	'twitterAuth': {
		'consumerKey': 'JOIq5wgN3IlYP5cGJ5rbeLDNG',
		'consumerSecret': 'XtiWAWzJCwCrlNZocDnaOxLjPnZDkWmYi88A9YUdcyWH7zh99r',
		'callbackURL': 'http://localhost:3400/auth/twitter/callback'
	},
	'facebookAuth': {
		'clientID': '906699676060237',
		'clientSecret': '442b1185d31fb953d6059dd2dc703421',
		'callbackURL': 'http://localhost:3400/auth/facebook/callback'
	}
};