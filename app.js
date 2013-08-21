// var youtube = require('youtube');
// 
// var video = youtube
// .createUpload('./video/patrick_bull.mp4')
// .user('Zachary Glagola')
// .source('DareDvl')
// // .password('Ebyt-vfem1')
// .key('AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w')
// // .title('Testing')
// // .description('Some test stuff')
// .category('Education')
// .upload(function(err, res){
//   if (err) throw err;
//   console.log('done');
//   console.log(res.id);
//   console.log(res.url);
//   console.log(res.embed());
//   console.log(res.embed(320, 320));
//   console.log(require('util').inspect(res, false, 15, true));
// });

// var title = "Jog On"; 
// var description = "about the dancing bull dancing it's way around the world"
// var category = "fat"; 
// var keywords = "N/A"
// var file_reader = fs.createReadStream(file_path, {encoding: 'binary'});
// var file_contents = '';
// 
// 
// file_reader.on('data', function(data)
// {
//     file_contents += data;
// });
// file_reader.on('end', function()
// {
//     var xml =
//         '<?xml version="1.0"?>' +
//         '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">' +
//         '   <media:group>' + 
//         '       <media:title type="plain">' + title + '</media:title>' +
//         '       <media:description type="plain">' + description + '</media:description>' +
//         '       <media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '</media:category>' +
//         '       <media:keywords>' + keywords + '</media:keywords>' + 
//         '   </media:group>' + 
//         '</entry>';
// 
//     var boundary = Math.random();
//     var post_data = [];
//     var part = '';
// 
//     part = "--" + boundary + "\r\nContent-Type: application/atom+xml; charset=UTF-8\r\n\r\n" + xml + "\r\n";
//     post_data.push(new Buffer(part, "utf8"));
// 
//     part = "--" + boundary + "\r\nContent-Type: video/mp4\r\nContent-Transfer-Encoding: binary\r\n\r\n";
//     post_data.push(new Buffer(part, 'ascii'));
//     post_data.push(new Buffer(file_contents, 'binary'));
//     post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
// 
//     var post_length = 0;
//     for(var i = 0; i < post_data.length; i++)
//     {
//         post_length += post_data[i].length;
//     }
//     
//     var auth_key = "AIzaSyDIXBJJaGK8xqgq28lyGR_1Q4gXPPIeEC8"; 
//     exports.developer_key = "AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w"; 
//     var post_length = "1:00"; 
//     var boundary = ""; 
//     
//     var options = {
//       host: 'uploads.gdata.youtube.com',
//       port: 80,
//       path: '/feeds/api/users/default/uploads?alt=json',
//       method: 'POST',
//         headers: {
//             'Authorization': 'GoogleLogin auth=' + auth_key,
//             'GData-Version': '2',
//             'X-GData-Key': 'key=' + exports.developer_key,
//             'Slug': 'video.mp4',
//             'Content-Type': 'multipart/related; boundary="' + boundary + '"',
//             'Content-Length': post_length,
//             'Connection': 'close'
//         }
//     }
// 
//     var req = http.request(options, function(res)
//     {
//         res.setEncoding('utf8');
// 
//         var response = '';
//         res.on('data', function(chunk)
//         {
//             response += chunk;
//         });
//         res.on('end', function()
//         {
//             console.log(response);
//             response = JSON.parse(response);
// 
//             callback(response);
//         });
//     });
// 
//     for (var i = 0; i < post_data.length; i++)
//     {
//         req.write(post_data[i]);
//     }
// 
//     req.on('error', function(e) {
//       console.error(e);
//     });
// 
//     req.end();
// });



var myDeveloperKey = "AI39si4zUNKlX1T8GORRbZu6EN-h4k73LT3ea7HOkPe9-vFMe_RxSk_rUSTHFZWwh_GLwL6F4BTLzTBp-2EvtbOFhmST0A5K0w";
var qs = require('querystring'),
https = require('https'),
fs = require('fs');

var p_data = qs.stringify({
grant_type: 'refresh_token'
});

var p_options = {
host: 'accounts.google.com',
port: '443',
method: 'POST',
path: '/o/oauth2/token',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': p_data.length,
    'X-GData-Key': "key="+myDeveloperKey
}
};

var file_path = process.argv[2] || "./video/patrick_bull.mp4";

var json = "";

var p_req = https.request(p_options, function(resp){
resp.setEncoding( 'utf8' );
resp.on('data', function( chunk ){
    json += chunk;
});
resp.on("end", function(){
    debugger;
    var access_token = JSON.parse(json).access_token;
    var title="test upload1",
        description="Second attempt at an API video upload",
        keywords="",
        category="Comedy";
    var file_reader = fs.createReadStream(file_path, {encoding: 'binary'});
    var file_contents = '';
    file_reader.on('data', function(data)
    {
        file_contents += data;
    });
    file_reader.on('end', function()
    {
        var xml =
            '<?xml version="1.0"?>' +
            '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">' +
            '   <media:group>' + 
            '       <media:title type="plain">' + title + '</media:title>' +
            '       <media:description type="plain">' + description + '</media:description>' +
            '       <media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '</media:category>' +
            '       <media:keywords>' + keywords + '</media:keywords>' + 
            '   </media:group>' + 
            '</entry>';

        var boundary = Math.random();
        var post_data = [];
        var part = '';

        part = "--" + boundary + "\r\nContent-Type: application/atom+xml; charset=UTF-8\r\n\r\n" + xml + "\r\n";
        post_data.push(new Buffer(part, "utf8"));

        part = "--" + boundary + "\r\nContent-Type: video/mp4\r\nContent-Transfer-Encoding: binary\r\n\r\n";
        post_data.push(new Buffer(part, 'utf8'));
        post_data.push(new Buffer(file_contents, 'binary'));
        post_data.push(new Buffer("\r\n--" + boundary + "--\r\n\r\n", 'utf8'));

        var post_length = 0;
        for(var i = 0; i < post_data.length; i++)
        {
            post_length += post_data[i].length;
        }
        var options = {
          host: 'uploads.gdata.youtube.com',
          port: 443,
          path: '/feeds/api/users/default/uploads',
          method: 'POST',
          headers: {
            'Authorization': 'GoogleLogin auth=' + access_token,
            'X-GData-Key': "key="+myDeveloperKey,
            'Slug': 'video.mp4',
            'Content-Type': 'multipart/related; boundary="' + boundary + '"',
            'Content-Length': post_length,
            'Connection': 'close'
          }
        }

        var req = https.request(options, function(res)
        {
            res.setEncoding('utf8');
            console.dir(res.statusCode);
            console.dir(res.headers);

            var response = '';
            res.on('data', function(chunk)
            {
                response += chunk;
            });
            res.on('end', function()
            {
                console.log( "We got response: " );
                console.log(response);

            });
        });

        for (var i = 0; i < post_data.length; i++)
        {
            req.write(post_data[i]);
        }

        req.on('error', function(e) {
          console.error(e);
        });

        req.end();
    });
});
});

p_req.write(p_data);
p_req.end();