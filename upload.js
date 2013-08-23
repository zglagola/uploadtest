var qs = require('querystring'),
https = require('https'),
express = require('express'),
fs = require('fs'),
app = express();

var client_id = '679696381032-qog5ao279ebalevfss3pe1n84tkef2i1.apps.googleusercontent.com'
, client_secret = 'cki-2xHKWYt9uz34BlXiIp7V'
, developer_key = 'AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w'
, scope = 'https://www.googleapis.com/auth/youtube.upload'
, redirect_uri = 'localhost:3000/oauth2callback';

var url = 'https://accounts.google.com/o/oauth2/auth?scope=' + scope 
+ '&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=code'
+ '&access_type=online&approval_prompt=auto';

var other_url = 'https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=%2Fprofile&redirect_uri=https%3A%2F%2Foauth2-login-demo.appspot.com%2Fcode&response_type=code&client_id=812741506391.apps.googleusercontent.com&approval_prompt=force';

console.log('URL:\n' + url);

var oauth_data = qs.stringify(
    {
        response_type : 'code',
        client_id : client_id,
        redirect_uri : redirect_uri,
        scope : 'https://www.googleapis.com/auth/youtube.upload',
        state : 'get_access_and_refresh_token',
        access_type : 'online',
        approval_prompt : 'auto'
    }
);

var oauth_options = qs.stringify(
    {
        host: 'accounts.google.com',
        port: '443',
        method: 'POST',
        path: '/o/oauth2/auth',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': oauth_data.length,
                    'X-GData-Key': developer_key
                }
    }
);

app.get('/', function(req, res)
    {
        console.log('sending authorization request...');
        var oauth_req = https.request(other_url, function(response)
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

app.listen(3000);

// var p_data = qs.stringify(
//     {
//         client_id: myClientID,
//         client_secret: myClientSecret,
//         refresh_token: refreshTokenForAccount,
//         grant_type: 'refresh_token'
//     }
// );

// var p_options = {
// host: 'accounts.google.com',
// port: '443',
// method: 'POST',
// path: '/o/oauth2/token',
// headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': p_data.length,
//     'X-GData-Key': myDeveloperKey
// }
// };

// var file_path = process.argv[1] || "video.mp4";

// var json = "";

// var p_req = https.request(p_options, function(resp){
// resp.setEncoding( 'utf8' );
// resp.on('data', function( chunk ){
//     json += chunk;
// });
// resp.on("end", function(){
//     debugger;
//     var access_token = JSON.parse(json).access_token;
//     var title="test upload1",
//         description="Second attempt at an API video upload",
//         keywords="",
//         category="Comedy";
//     var file_reader = fs.createReadStream(file_path, {encoding: 'binary'});
//     var file_contents = '';
//     file_reader.on('data', function(data)
//     {
//         file_contents += data;
//     });
//     file_reader.on('end', function()
//     {
//         var xml =
//             '<?xml version="1.0"?>' +
//             '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">' +
//             '   <media:group>' + 
//             '       <media:title type="plain">' + title + '</media:title>' +
//             '       <media:description type="plain">' + description + '</media:description>' +
//             '       <media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '</media:category>' +
//             '       <media:keywords>' + keywords + '</media:keywords>' + 
//             '   </media:group>' + 
//             '</entry>';

//         var boundary = Math.random();
//         var post_data = [];
//         var part = '';

//         part = "--" + boundary + "\r\nContent-Type: application/atom+xml; charset=UTF-8\r\n\r\n" + xml + "\r\n";
//         post_data.push(new Buffer(part, "utf8"));

//         part = "--" + boundary + "\r\nContent-Type: video/mp4\r\nContent-Transfer-Encoding: binary\r\n\r\n";
//         post_data.push(new Buffer(part, 'utf8'));
//         post_data.push(new Buffer(file_contents, 'binary'));
//         post_data.push(new Buffer("\r\n--" + boundary + "--\r\n\r\n", 'utf8'));

//         var post_length = 0;
//         for(var i = 0; i < post_data.length; i++)
//         {
//             post_length += post_data[i].length;
//         }
//         var options = {
//           host: 'uploads.gdata.youtube.com',
//           port: 443,
//           path: '/feeds/api/users/default/uploads',
//           method: 'POST',
//           headers: {
//             'Authorization': 'Bearer ' + access_token,
//             'X-GData-Key': myDeveloperKey,
//             'Slug': 'video.mp4',
//             'Content-Type': 'multipart/related; boundary="' + boundary + '"',
//             'Content-Length': post_length,
//             'Connection': 'close'
//           }
//         }

//         var req = https.request(options, function(res)
//         {
//             res.setEncoding('utf8');
//             console.dir(res.statusCode);
//             console.dir(res.headers);

//             var response = '';
//             res.on('data', function(chunk)
//             {
//                 response += chunk;
//             });
//             res.on('end', function()
//             {
//                 console.log( "We got response: " );
//                 console.log(response);

//             });
//         });

//         for (var i = 0; i < post_data.length; i++)
//         {
//             req.write(post_data[i]);
//         }

//         req.on('error', function(e) {
//           console.error(e);
//         });

//         req.end();
//     });
// });
// });

// p_req.write(p_data);
// p_req.end();