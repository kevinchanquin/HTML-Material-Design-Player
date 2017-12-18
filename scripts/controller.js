/*
Events Emitted
    toogleMedia(action); //(play, pause, stop) when the user clicks fav button
    
    seek(value); //(milliseconds) when user slides the progress bar
    
    changeVolume(value); //(0-100) when user slides the volume bar
    
Funtions
    updateProgress(value); //(milliseconds) to update progress bar as media plays
    
    toggleIcon(action); //(play, pause) to change the fav button icon
    
    setMediaInfo(cover, title, author, duration); //(url, string, string, num (milliseconds)) to set all the info of the playing media
*/

$(function(){
//buttons handlers
    //when user clics the fav button
    $('#statebutton').on('click',function(){
        var mediaState = $('#statebutton > i').html();
        var action;
        if (mediaState == 'play_arrow') {
            mediaState = 'pause';
            action = 'play';
        }
        else if (mediaState == 'pause') {
            mediaState = 'play';
            action = 'pause';
        }
        
        toggleIcon(mediaState);
        toggleMedia(action);
    });
    
    //when user clicks stop button
    $('#closebutton').on('click',function(){
        toggleMedia('stop');
        toggleIcon('play');
    });
    
    //user is seeking
    $('#progress').on('input', function(event){
        $('#time').html(convertToTime(event.target.value));
        seek(event.target.value);
    });
    
    //user is changing volume
    $('#volume').on('input', function(event) {
        changeVolume(event.target.value);
    });
    
    //---VOLUME----
    //volume - expand voume slider on click        
    $('#volumeopen').on('click',function(){
        $('#volumecard').removeClass('hidden');
        setTimeout(function(){
            $('#volumecard').addClass('hidden');
        }, 8000);
    });
    //volume mute
    $('#volumeoff').on('click',function(){
        //input won't update with jquery
        document.getElementById('volume').value = 0;
        changeVolume(0);
    });
    //volume max
    $('#volumeup').on('click',function(){
        //input won't update with jquery
        document.getElementById('volume').value = 100;
        changeVolume(100);
    });    
});

//change fav button when media state changes
function toggleIcon(action) {
    if (action == 'pause'){
        $('#statebutton').html('<i class="material-icons">pause</i>');
    }
    else if (action == 'play'){
        $('#statebutton').html('<i class="material-icons">play_arrow</i>');
    }
}

//convert miliseconds to minutes and seconds
function convertToTime(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes+1) + ":00" : (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
};

//update progress bar as media plays
function updateProgress(value) {
    //input won't update with jquery
    document.getElementById('progress').value = value;
    $('#time').html(convertToTime(value));
}

//find whether the rgb color is dark or light 
function isDark(rgb) {
    //regex to separate rgb colors from rgb(n,n,n)
    rgb = rgb.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    var r = rgb[1], g = rgb[2], b = rgb[3];
    
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness < 175
};

//set all the info from the media
function setMediaInfo(cover, title, author, duration) {
    $('#title').html(title);
    $('#author').html(author);
    
    //duration value of the media
    $('#progress').attr('max', duration);
    
    //set the cover image url
    $('#cover').css('background-image', 'url(' + cover + ')');
    
    //get dominant color of the image
    $.adaptiveBackground.run();
    
    //on dominant color found set color to info container
    $('#cover').on('ab-color-found', function(ev,payload){
        $('#mediainfo').css('background-color', payload.color);
        var rgb = payload.color;
        
        //detect if it's a dark or light color and change text respectively
        if(isDark(payload.color)) {
            $('.textinfo').removeClass('dark').addClass('light');
        } 
        else {
            $('.textinfo').removeClass('light').addClass('dark');
        };        
    });
};