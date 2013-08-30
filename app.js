/*
	This bit of code allows the server to upload a single local video to a given user account
	You will need to install two node_modules to make this work
		npm install passport
		npm install passport-google-oauth
	Both of these module are tools for passing through the google oauth 2.0 service
*/
var passport = require('passport')
 , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
 , https = require('https')
 , fs = require('fs')
 , https = require('https')
 , http = require('http')
 , querystring = require('querystring')
 , express = require('express')
 , app = express();

var client_id = //client_id here
, client_secret =  //client_secret here
, scope = 'https://www.googleapis.com/auth/youtube.upload'
, developer_key = //developer_key here

/*
	google oauth 2.0 requires a redirect back to an https link, we will have to create an SSL certificate
	and add it to our http server. this code will serve as an example for that
*/
var ssl_options = {
	key : fs.readFileSync('path/to/your.key')
	, cert : fs.readFileSync('path/to/your/cert.pem')
};

//the xml encoding for the video, currently uses the metadata variable, but for more options use the xml variavble
var title = 'title of video'
, description = 'description of video'
, category = 'category of video (i.e. Comedy, People etc)'
, keywords = 'keywords for video (i.e. Daredvl, daredvl, etc)'
, xml = '<?xml version="1.0"?>\
  <entry xmlns="http://www.w3.org/2005/Atom"\
    xmlns:media="http://search.yahoo.com/mrss/"\
    xmlns:yt="http://gdata.youtube.com/schemas/2007">\
    <media:group>\
      <media:title type="plain">' + title + '</media:title>\
      <media:description type="plain">' + description + '</media:description>\
      <media:category\
        scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '\
      </media:category>\
      <media:category\
        scheme="http://gdata.youtube.com/schemas/2007/developertags.cat">LearnBoost\
      </media:category>\
      <media:keywords>' + keywords + '</media:keywords>\
    </media:group>\
    <yt:accessControl action="list" permission="' + 'allowed' + '"/>\
    <yt:accessControl action="rate" permission="' + 'allowed' + '"/>\
    <yt:accessControl action="comment" permission="' + 'allowed' + '"/>\
    <yt:accessControl action="commentVote" permission="' + 'allowed' + '"/>\
    <yt:accessControl action="embed" permission="' + 'allowed' + '"/>\
    <yt:accessControl action="syndicate" permission="' + 'allowed' + '"/>\
  </entry>';

var metadata =
            '<?xml version="1.0"?>' +
            '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">' +
            '   <media:group>' + 
            '       <media:title type="plain">' + title + '</media:title>' +
            '       <media:description type="plain">' + description + '</media:description>' +
            '       <media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '</media:category>' +
            '       <media:keywords>' + keywords + '</media:keywords>' + 
            '   </media:group>' + 
            '</entry>';

//this is the passport function that runs the google authentication to get the authorization code
passport.use(new GoogleStrategy(
		{
		    clientID : client_id,
		    clientSecret : client_secret,
		    callbackURL : 'https://localhost:3000/auth/google/callback',
		    passReqToCallback : true,
		    scope : scope
	 	},

		function(accessToken, refreshToken, profile, done) 
		{
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

//more passport authentication... you shouldn't need to know how this works
passport.serializeUser(function(user)
	{
		done(null, user.id);
	}
);

//more passport authentication... you shouldn't need to know how this works
passport.deserializeUser(function(id, done)
	{
		User.findOne({googleId : id})
		.exec(function(err, user)
			{
				done(err, user);
			}
		);
	}
);

//the endpoint to hit when you want to begin the authorization process
app.get('/auth/google', passport.authenticate('google', {accessType : 'offline', approvalPrompt : 'force'}));

//the endpoint that google will redirect you back to after its call
app.get('/auth/google/callback', function(req, res)
	{
			res.redirect('/get_tokens/' + req.url.split('=')[1]);
	}
);

//the endpoint that runs after the authorization code is retrieved to get the access token and the refresh token
app.get('/get_tokens/:code(*)', function(req, res)
	{
		console.log('got the code: ', req.params.code);

		var token_data = querystring.stringify(
			{
				code : req.params.code,
				client_id : client_id,
				client_secret : client_secret,
				redirect_uri : 'https://localhost:3000/auth/google/callback',
				grant_type : 'authorization_code'
			}
		);

		var token_options = {
			host : 'accounts.google.com',
			path: '/o/oauth2/token',
			port : 443,
			method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : token_data.length
			}
		};

		console.log('making https reqest with:', token_options, token_data);

		var post_req = https.request(token_options, function(response)
			{
				response.setEncoding('utf8');
      			response.on('data', function (chunk) 
      				{
         		 		console.log('Response: ' + chunk);
         		 		var chunk_json = JSON.parse(chunk);
         		 		console.log('redirecting url to:', '/upload/' + chunk_json.access_token + '/'
         		 			+ chunk_json.refresh_token);
         		 		res.redirect('/upload/' + chunk_json.access_token + '/'
         		 			+ chunk_json.refresh_token);
    			  	}
			  	);
			}
		);

		// post the data
		post_req.write(token_data);
		post_req.end();
	}
);

//the endpoint that takes the access token and refresh token and uploads the video
app.get('/upload/:access_token/:refresh_token(*)', function(req, res)
	{
		var user = 'the username of the youtube account (in the case of DareDvl this is probably DareDvl Arena)'

		var upload_options = {
			method : 'POST'
			, port : 443
			, host : 'uploads.gdata.youtube.com'
			, path : '/feeds/api/users/' + user + '/uploads'

		};

		var access_token = req.params.access_token
		, refresh_token =req.params.refresh_token
		, body = []
		, body_segment = ''
		, video_data = ''
		, content_length = 0
		, boundary = 'getgotgurl'
		, path = './video/patrick_bull.mp4'
		, video_stream = fs.createReadStream(path, {encoding : 'binary'});

		video_stream.on('data', function(data)
			{
				video_data += data;
			}
		);

		video_stream.on('end', function()
			{
				//add xml
				body_segment = "--" + boundary + "\r\nContent-Type: application/atom+xml; charset=UTF-8\r\n\r\n" + metadata + "\r\n";
        		body.push(new Buffer(body_segment, "utf8"));

        		//add video
        		body_segment = "--" + boundary + "\r\nContent-Type: video/mp4\r\nContent-Transfer-Encoding: binary\r\n\r\n";
		        body.push(new Buffer(body_segment, 'utf8'));
		        body.push(new Buffer(video_data, 'binary'));
		        body.push(new Buffer("\r\n--" + boundary + "--\r\n\r\n", 'utf8'));

		        //get length
		        for(var i = 0; i < body.length; i++)
		        {
		            content_length += body[i].length;
		            console.log('content length:', content_length);
		        }

		        // header
			    upload_options.headers = {
			        'Authorization': 'Bearer ' + access_token
			      , 'GData-Version': '2'
			      , 'X-GData-Key': 'key=' + developer_key
			      , 'Accept': 'text/plain'
			      , 'Content-Type': 'multipart/related; boundary=' + boundary
			      , 'Content-Length': content_length
			      , 'Slug': path
			    };

			    console.log('options we are sending:', upload_options);

			    var request = http.request(upload_options, function(response)
			        {
			            response.setEncoding('utf8');
			            console.log('STATUS CODE:', response.statusCode);

			            var answer = '';
			            response.on('data', function(chunk)
				            {
				                answer += chunk;
				            }
			            );
			            response.on('end', function()
				            {
				            	console.log('we got a good response');
				            	console.log(answer);
				            }
			            );
			        }
		        );

		        for (var i = 0; i < body.length; i++)
		        {
		            request.write(body[i]);
		        }

		        request.on('error', function(e)
		        	{
		        		console.log('ERROR YALL');
		          		console.error(e);
		        	}
	        	);

		        request.end();
		    }
	    );
	}
);

//host the server with our SSL certificates, NOTE that we will not be able to use self signed certificates for DareDvl
//we will have to target a provider to get a trusted certificate
https.createServer(ssl_options, app).listen(3000, function()
	{
	  console.log("Express server listening on port 3000");
	}
);