
  require("dotenv").config();


//var keys = require("./keys.js");
var Spotify = require('node-spotify-api'); //Using the Spotify api and getting the key from keys.js
//var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
var moment = require('moment'); //Both required to use moment for node
moment().format();

var axios = require('axios'); //To get the information from the APIs for movie and concert-this

var fs = require('fs'); //To read the random.txt file for the do-what-it-says function

var command = process.argv[2]; //For the switch statement
var value = process.argv.slice(3).join(" "); //To send the song/movie/concert to their respective functions

switch (command) {
    case "concert-this":
        concertThis(value);
        break;
    case "spotify-this-song":
        spotifySong(value);
        break;
    case "movie-this":
        movieThis(value);
        break;
    case "do-what-it-says":
        doThis(value);
        break;
};

function concertThis(value) {
    console.log(value);
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function(response) {   
        console.log(response); 
        fs.appendFile('log.txt', "Command:" + process.argv.slice(0).join(" "), function (err) {
            if (err) throw err;
        });
        for (var i = 0; i < response.data.length; i++) {

            var datetime = response.data[i].datetime; //Saves datetime response into a variable
            var dateArr = datetime.split('T'); //Attempting to split the date and time in the response

            var concertResults = 
                    "\nVenue Name: " + response.data[i].venue.name + 
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr[0],"YYYY-MM-DD").format("MM/DD/YYYY") +
                    "\n--------------------------------------------------------------------" +
                     "\n"; //dateArr[0] should be the date separated from the time
       
            //console.log(concertResults);
            fs.appendFile('log.txt', concertResults, function (err) {
                if (err) throw err;
            });
        }
    })
    .catch(function (error) {
        console.log(error);
    });
        

}

function spotifySong(value) {
    if(!value){
        value = "The Sign";
    }
    spotify
    .search({ type: 'track', query: value })
    .then(function(response) {
        console.log(response);
        fs.appendFile('log.txt', "Command:" + process.argv.slice(0).join(" "), function (err) {
            if (err) throw err;
        });
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url +
                    "\n--------------------------------------------------------------------" ;
                    
           // console.log(spotifyResults);
           fs.appendFile('log.txt', spotifyResults, function (err) {
            if (err) throw err;
        });
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function movieThis(value) {
    if(!value){
        value = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        console.log(response);
        fs.appendFile('log.txt',"Command:" + process.argv.slice(0).join(" "), function (err) {
            if (err) throw err;
        });
            var movieResults = 
                    "\nMovie Title: " + response.data.Title + 
                    "\nYear of Release: " + response.data.Year +
                    "\nIMDB Rating: " + response.data.imdbRating +
                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                    "\nCountry Produced: " + response.data.Country +
                    "\nLanguage: " + response.data.Language +
                    "\nPlot: " + response.data.Plot +
                    "\nActors/Actresses: " + response.data.Actors + 
                    "\n--------------------------------------------------------------------" +
                    "\n";
           // console.log(movieResults);
           fs.appendFile('log.txt', movieResults, function (err) {
            if (err) throw err;
        });
    })
    .catch(function (error) {
        console.log(error);
    });
    
}

function doThis(value) {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        spotifySong( dataArr[1]);
    })
}