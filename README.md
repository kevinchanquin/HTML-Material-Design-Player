# HTML Material Design Player

A free HTML5 music player interface, built with the Material Design Lite library and jQuery.

[See a Demo](https://kevinchanquin.github.io/HTML-Material-Design-Player/)

## Getting Started

Copy all files from the “src” folder in your root directory and include them in your page, like so:

Material Player library:

```
<script src="scripts/script.js"></script>
<link rel="stylesheet" href="styles/style.css">
```

Third party libraries:

```
<!-- material design lite > https://getmdl.io -->
<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.grey-green.min.css" />
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    
<!-- material design icons and font -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

<!-- jquery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<!-- https://github.com/briangonzalez/jquery.adaptive-backgrounds.js/ -->
<script src="scripts/jquery.adaptive-backgrounds.js"></script>
```

Add the player to your page:

```
    <div class="controller-container">
        <div class="layout mdl-layout mdl-js-layout">
            <!-- nav bar -->
            <header class="mdl-layout__header-row">
                <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="closebutton">
                    <i class="material-icons">close</i>
                </button>
            </header>
            <!-- player -->
            <main class="mdl-layout__content">
                <!-- album image and play/pause button -->
                <section id="cover" data-adaptive-background data-ab-css-background>
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored fab" id="statebutton">
                        <i class="material-icons">play_arrow</i>
                    </button>
                </section>
                <!-- title and artist-->
                <section class="mdl-card mdl-shadow--8dp card textbackground" id="mediainfo">
                    <h3 id="title" class="textinfo light">Ready</h3>
                    <h4 id="author" class="textinfo light">to play</h4>
                </section>
                <!-- hidden volume slider -->
                <div class="mdl-card mdl-shadow--16dp mdl-layout__header-row volumecard card hidden" id="volumecard">
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect closebutton" id="volumeoff">
                        <i class="material-icons">volume_off</i>
                    </button>
                    <p class="progresscontainer">
                        <input class="mdl-slider mdl-js-slider" type="range"
          min="0" max="100" value="100" tabindex="0" id="volume" />
                    </p>
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect closebutton" id="volumeup">
                        <i class="material-icons">volume_up</i>
                    </button>
                </div>
                <!-- bottom secction with volume, progress bar and time -->
                <section class="mdl-card mdl-shadow--8dp mdl-layout__header-row card">
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect closebutton" id="volumeopen">
                        <i class="material-icons">volume_up</i>
                    </button>
                    <p class="progresscontainer">
                        <input class="mdl-slider mdl-js-slider" type="range"
          min="0" max="1" value="0" tabindex="0" id="progress" />
                    </p>
                    <h6 id="time">00:00</h6>
                </section>
            </main>
        </div>
    </div>
```

Or use the [index.html](src/index.html) file and modify it as you please.

## How to use

### Send information to the player

Call the function `setMediaInfo(cover, title, author, duration)` like so:

`setMediaInfo("https://some-image.jpg", "Stressed Out", "Twenty One Pilots", 30000)`

### Change the icon of the play/pause button

Call the function `toggleIcon(action)` 
Where action can be either “play” to set the play button or “pause” to set the pause button.

### Update the progress bar

Call the function `updateProgress(value)` 
Where value is the current time of the media being played in milliseconds.

## Events emitted
The player will emit certain events when the user interacts with the player, this interactions can be:

### The user clicks play / pause / stop

The player will call the function `toogleMedia(action)` where action can be either “play”, “pause” or “stop”. Define this function in your script, for example:

```
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
```

### The user slides the progress bar

The player will call the function `seek(value)` where value it’s the current time in milliseconds. Define this function in your script, for example:

```
function seek(value) {
    //conver ml to sec
    value = ((value % 60000) / 1000).toFixed(0);
    value = parseInt(value);
    
    //set the progress time of the audio element
    document.getElementById('audio').currentTime = value;
};
```

### The user slides the volume bar

The player will call the function `changeVolume(value)` where value it’s a number from 0 to 100. Define this function in your script, for example:

```
function changeVolume(value) {
    //convert percentage to decimal
    value = value / 100;
    
    //set the volume time of the audio element
    document.getElementById('audio').volume = value;
};
```
