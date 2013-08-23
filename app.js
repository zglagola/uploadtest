var youtube = require('youtube');
var request = require('request');

var clientId = '679696381032.apps.googleusercontent.com';
var apiKey = 'AIzaSyDIXBJJaGK8xqgq28lyGR_1Q4gXPPIeEC8';
var scopes = 'https://www.googleapis.com/auth/youtube.upload';

var video = youtube
.createUpload('./video/patrick_bull.mp4')
.user('Zachary Glagola')
.source('Zachary Glagola')
.password('Ebyt-vfem1')
.key('AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w')
.title('Patrick On The Bull')
.description('Ow, just ow')
.category('Education')
.upload(function(err, res){
  if (err) throw err;
  console.log('done');
  console.log(res);
  console.log(res.id);
  console.log(res.url);
  console.log(res.embed());
  console.log(res.embed(320, 320));
  console.log(require('util').inspect(res, false, 15, true));
});