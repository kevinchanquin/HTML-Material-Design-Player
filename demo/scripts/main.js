var tracksDisplay = [];

$(function(){
    $('form').on('submit', function(event) {
        event.preventDefault(); //prevent page from reloading
        var val = $('#inputText').val(); //get the text from the input
        
        $('#searchResults').removeClass('hidden');//show results div
        
        //search tracks with spotify
        searchWithSpotify(val, function(data){
            //display results, maximum 5, in div with "resultsGrid" id
            displayResults(data, 5, 'resultsGrid');
            
            //clear search bar
            $('#inputText').val('');
        });
    });
    
    //fetch featured tracks from spotify
    fetchFeaturedTracks(function(data) {
        //display results, maximum 5, in div with "newGrid" id
        displayResults(data, 5, 'newGrid'); 
    });
});

//emitted events

function toggleMedia(action) {
    //when play button is pressed play the audio element
    if (action == 'play') {
        document.getElementById('audio').play();
    }
    
    //when pause button is pressed play the audio element
    else if (action == 'pause') {
        document.getElementById('audio').pause();
    }
    
    //when stop button is pressed play the audio element
    else if (action == 'stop') {
        document.getElementById('audio').pause();
        document.getElementById('audio').currentTime = 0;
    }
};

function seek(value) {
    //conver ml to sec
    value = ((value % 60000) / 1000).toFixed(0);
    value = parseInt(value);
    
    //set the progress time of the audio element
    document.getElementById('audio').currentTime = value;
};

function changeVolume(value) {
    //convert percentage to decimal
    value = value / 100;
    
    //set the volume time of the audio element
    document.getElementById('audio').volume = value;
};

//emitted events end

function fetchSpotifyToken(callback) {
    var url = 'https://script.google.com/macros/s/AKfycbyP2Bj6CatiqmAVm02e2iEizeLM6-hNrKv6sLeaRfvBGPFwD5Wd/exec';
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function searchWithSpotify(q, callback) {
    //fetch token and set a callback
    fetchSpotifyToken(function(token) {
        var spotifyToken = token;
        
        //start the spotify api
        var spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(spotifyToken);
        
        //search for tracks with a query, and set a callback
        spotifyApi.searchTracks(q, function(err, data) {
            if (err) {
                //set as not found if there's an erro
                callback([{name: 'Not Found', artists: 'Not Found', cover: 'images/artwork-not-found.png', duration: 1, preview: null, id: '101'}]);
            }
            else {
                var dataItems = data.tracks.items; //path to items
                var result = []; // set the array for the results
                
                //search only if there are results
                if (dataItems.length > 0) {
                    for (var i in dataItems) {
                        var previewUrl = dataItems[i].preview_url;
                        var name = dataItems[i].name;
                        var cover = dataItems[i].album.images[0].url;
                        var duration = dataItems[i].duration_ms;
                        var artistArray = dataItems[i].artists;
                        var id = dataItems[i].id;
                        var artists = "";
                        for (var key in artistArray) {
                            artists += artistArray[key].name+', ';
                        }
                        artists = artists.substring(0, artists.length - 2); //chop off last ', '
                        //only push if there is a preview url
                        if (previewUrl) {
                            result.push({name: name, artists: artists, cover: cover, duration: duration, preview: previewUrl, id: id});
                        }
                    }
                    //send the results back if any
                    if (result.length > 0){
                        callback(result);
                    }
                    //otherwise set as not found
                    else {
                        //set as not found
                        callback([{name: 'Not Found', artists: 'Not Found', cover: 'images/artwork-not-found.png', duration: 1, preview: null, id: '101'}]);
                    }
                } 
                //if there's no results set as not found
                else {
                    //set as not found
                    callback([{name: 'Not Found', artists: 'Not Found', cover: 'images/artwork-not-found.png', duration: 1, preview: null, id: '101'}]);
                }
            }
        });
    });
};

function fetchFeaturedTracks (callback) {
    //fetch token and set a callback
    fetchSpotifyToken(function(token) {
        var spotifyToken = token;
    
        //start the spotify api
        var spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(spotifyToken);

        //fetch featured playlist from spotify and set a callback
        spotifyApi.getFeaturedPlaylists(function(err, data) {
            if (err) {}
            else {
                var owner = data.playlists.items[0].owner.id; //owner of the first playlist
                var playlist = data.playlists.items[0].id; //id of the first playlist
                
                //search for the tracks of the first playlist and set a callback
                spotifyApi.getPlaylistTracks(owner, playlist, function(err, data){
                    var dataItems = data.items; //path to items
                    var result = [];
                    
                    //search only if there are results
                    if (dataItems.length > 0) {
                        for (var i in dataItems) {
                            var previewUrl = dataItems[i].track.preview_url;
                            var name = dataItems[i].track.name;
                            var cover = dataItems[i].track.album.images[0].url;
                            var duration = dataItems[i].track.duration_ms;
                            var artistArray = dataItems[i].track.artists;
                            var id = dataItems[i].track.id;
                            var artists = "";
                            for (var key in artistArray) {
                                artists += artistArray[key].name+', ';
                            }
                            artists = artists.substring(0, artists.length - 2); //chop off last ', '

                            //only push if there is a preview url
                            if (previewUrl) {
                                result.push({name: name, artists: artists, cover: cover, duration: duration, preview: previewUrl, id: id});
                            }
                        }
                        //send the results back if any
                        if (result.length > 0){
                            callback(result);
                        }
                        //otherwise set as not found
                        else {
                            //set as not found
                            callback([{name: 'Not Found', artists: 'Not Found', cover: 'images/artwork-not-found.png', duration: 1, preview: null}]);
                        }
                    } 
                    //if there's no results set as not found
                    else {
                        //set as not found
                        callback([{name: 'Not Found', artists: 'Not Found', cover: 'images/artwork-not-found.png', duration: 1, preview: null}]);
                    }
                });
            }
        });
    });
}

function playTrack(track){
    //invoke the built-in function to set info of the track on the player
    setMediaInfo(track.cover, track.name, track.artists, 30000);
    
    //set the background of the page as the cover image
    $('#background').css('background-image', 'url(' + track.cover + ')');
    
    //set the audio source
    $('#audio').attr("src", track.preview);
    
    //set event listeners on the audio element
    $('#audio').on('playing', function(){toggleIcon('pause')});//on playing change fav icon
    $('#audio').on('pause', function(){toggleIcon('play')});//on playing change fav icon
    //set the progress bar of the player as media plays
    $('#audio').on('timeupdate', function(){
        var value = document.getElementById('audio').currentTime;
        value = ((value % 60000) * 1000).toFixed(0);
        updateProgress(value); //invoke the built-in function to update the progress bar
    });
};

function displayResults(data, max, toId) {
    $('#'+toId).html(""); //empty the display grid
    
    //inser results until max amount is reached
    var current = 0;
    for (var i in data) {
        if (current >= max) break;
        
        insertResult(data[i], toId);
        current++
    }
};

function insertResult(obj, toId) {
    //build the card object containing the cover, track title, and artists
    var item = "<div id='" + obj.id + "' class='card-image mdl-card mdl-shadow--2dp grid-item button' style='background-image: url(" + obj.cover + ")'><div class='mdl-card__title mdl-card--expand'></div><div class='mdl-card__supporting-text'><span>"+ obj.name +"</span><br>" + obj.artists + "</div></div>";
    
    //insert the card
    $('#'+toId).append(item);
    
    //set an event ilstener for when the user clicks the card
    $('#'+obj.id).click(function() {
        playTrack(obj);//play the track
    });
};