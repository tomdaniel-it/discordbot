var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var oauth2Client;
var http = require("http");
var https = require("https");
var emitter = require('events').EventEmitter;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('content/domain/client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
}

function getJSON(options, onResult)
{

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
};

function isoToString(iso){
    var regex = /((\d+)H)?(\d+)M(\d+)S/;
    if(!regex.test(iso)){
        return "Time undefined";
    }
    var result = "";
    var match = regex.exec(iso);
    if(match[2]!==undefined && match[2]!==null && match[2]!==''){
        result += match[2] + ":";
    }
    result += match[3] + ":" + match[4];
    return result;
}

var optionsSearch = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/search?maxResults=5&part=snippet&q={question}&type=&key=AIzaSyAj-fwlb1KKY-BwXopLEbsE9i3VE2OnubE&order=relevance',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var optionsInfo = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/videos?id={id}&part=contentDetails,snippet&key=AIzaSyAj-fwlb1KKY-BwXopLEbsE9i3VE2OnubE',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports = {
    getSearchResults: function(input){
        var em = new emitter();
        var customoptions = JSON.parse(JSON.stringify(optionsSearch));
        customoptions.path = customoptions.path.replace('{question}', encodeURI(input));
        setTimeout(function(){
            getJSON(customoptions, function(statusCode, result) {
                var ids = [];
                for(var i=0;i<result.items.length;i++){
                    ids.push(result.items[i].id.videoId);
                }
                if(ids.length===0){
                    em.emit('ready', []);
                    return;
                }

                var idstring = ids[0];
                for(var i=1;i<ids.length;i++){
                    idstring += "," + ids[i];
                }

                customoptions = JSON.parse(JSON.stringify(optionsInfo));
                customoptions.path = customoptions.path.replace('{id}', idstring);
                getJSON(customoptions, function(statusCode, result){
                    var res = [];
                    for(var i=0;i<result.items.length;i++){
                        var obj = {};
                        obj.url = "https://www.youtube.com/watch?v="+result.items[i].id;
                        obj.type = "yt";
                        obj.title = result.items[i].snippet.title;
                        obj.duration = isoToString(result.items[i].contentDetails.duration);
                        res.push(obj);
                    }
                    em.emit('ready', res);
                });
            });
        }, 1);
        return em;
    }, 
    getInfo: function(url){
        var em = new emitter();
        setTimeout(function(){
            var regex = /v=([a-zA-Z0-9]+)/;
            if(!regex.test(url)){
                em.emit('ready', null, new Error("Youtube url is incorrect."));
            }
            var match = regex.exec(url);
            module.exports.getInfoById(match[1]).on('ready', (result, err)=>{
                em.emit('ready', result, err);
            });
        }, 1);
        return em;
    },
    getInfoById: function(id){
        var em = new emitter();
        setTimeout(function(){
            var customoptions = JSON.parse(JSON.stringify(optionsInfo));
            customoptions.path = customoptions.path.replace('{id}', id);
            getJSON(customoptions, function(statusCode, result) {
                if(result.items.length === 0){
                    em.emit('ready', null, new Error("Can't find youtube video."));
                    return;
                }
                //[{connection: Connection, serverid:String, playing:boolean; playlist:[{url:String, type:String, title:String, duration:String}] }]
                var res = {};
                res.url = "https://www.youtube.com/watch?v="+id;
                res.type = 'yt';
                res.title = result.items[0].snippet.title;
                res.duration = isoToString(result.items[0].contentDetails.duration);
                em.emit('ready', res);
            });
        }, 1);
        return em;
    }
};