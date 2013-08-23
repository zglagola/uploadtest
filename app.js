var passport = require('passport')
 , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
 , https = require('https')
 , fs = require('fs')
 , querystring = require('querystring')
 , youtube = require('youtube')
 , express = require('express')
 , app = express();

var client_id = '679696381032-qog5ao279ebalevfss3pe1n84tkef2i1.apps.googleusercontent.com'
, client_secret =  'cki-2xHKWYt9uz34BlXiIp7V'
, scope = 'https://www.googleapis.com/auth/youtube.upload';

var options = {
	key : fs.readFileSync('./ssl/zach-key.pem'),
	cert : fs.readFileSync('./ssl/zach-cert.pem')
}
var code;

passport.use(new GoogleStrategy(
		{
		    clientID : client_id,
		    clientSecret : client_secret,
		    callbackURL : 'https://localhost:3000/auth/google/callback',
		    scope : scope
	 	},

		function(accessToken, refreshToken, profile, done) 
		{
	  		console.log('response fool:', accessToken, refreshToken, profile, done);
		    User.updateOrCreate({googleId: profile.id }, 
		        function(err, user) 
		        {
		        	if(err) {throw err;}
		            done(null, user);
		        }
		    );
		    done(null, user);
	    }
	)
);

passport.serializeUser(function(user)
	{
		console.log('serializing user...');
		done(null, user.id);
	}
);

passport.deserializeUser(function(id, done)
	{
		console.log('deserializing user...');
		User.findOne({googleId : id})
		.exec(function(err, user)
			{
				done(err, user);
			}
		);
	}
);

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', function(req, res)
	{
		var code = req.url.split('=')[1];
		res.redirect('/upload');
	}
);
app.get('/upload', function(req, res)
	{
		youtube.setCode(code);
		var video = youtube.createUpload('./video/patrick_bull.mp4')
			.user('Zachary Glagola')
			.source('Mom\'s House')
			.password('Ebyt-vfem1')
			.key('AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w')
			.title('Patrick Getting Hurt')
			.description('Mostly his pride, but it isnt much different now is it')
			.category('Comedy')
			.upload(function(err, res){
			  if (err) throw err;
			  console.log('done');
			  console.log(res.id);
			  console.log(res.url);
			  console.log(res.embed());
			  console.log(res.embed(320, 320));
			  console.log(require('util').inspect(res, false, 15, true));
			});
		res.send('sending code: ' + code);
	}
);

https.createServer(options, app).listen(3000, function()
	{
	  console.log("Express server listening on port 3000");
	}
);