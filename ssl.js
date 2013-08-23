var express = require('./node_modules/express')
  , fs = require('fs')
var tls = require("tls");
var https = require("https");


var app = express(); 

var client_id = '679696381032-qog5ao279ebalevfss3pe1n84tkef2i1.apps.googleusercontent.com'
, client_secret = 'cki-2xHKWYt9uz34BlXiIp7V'
, developer_key = 'AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w'
, scope = 'https://www.googleapis.com/auth/youtube.upload'
, redirect_uri = 'localhost:3000/oauth2callback';

var url = 'https://accounts.google.com/o/oauth2/auth?scope=' + scope 
+ '&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=code'
+ '&access_type=online&approval_prompt=auto';

// MAGIC HAPPENS HERE!
var opts = {
  key: fs.readFileSync('ssl/zach-key.pem'),
  passphrase : 'dcqj9mgth',
  cert: fs.readFileSync('ssl/zach-cert.pem')
};


// This is the password used when generating the server's key
// that was used to create the server's certificate.
// And no, I do not use "password" as a password.
passphrase: "dcqj9mgth"; 

// var app = module.exports = express.createServer(opts);

// Configuration 
var server = tls.createServer(opts, app);// var app = express();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler(
    { dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res)
  {
    console.log('sending authorization request...');
    var oauth_req = https.request(url, function(response)
        {
            console.log('RESPONSE', response);
            res.send('hi mom');
        }
    );
  }
);

app.post('/oauth2callback', function(req, res)
    {
        console.log('req', req);
        console.log('res', res);
    }
);

app.listen(8443);

console.log(
   "Express server listening on port %d in %s mode", 
    8443, 
    app.settings.env);