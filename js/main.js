if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}


const RADIO_NAME = settings.radio_name;
const RADIO_ID = settings.radio_id;
const URL_STREAMING = settings.url_streaming;
const DEFAULT_COVER_ART = settings.default_cover_art;
const DATE = new Date();

window.addEventListener('DOMContentLoaded', (event) => {
    var page = new Page;
    page.changeTitlePage();
    page.changeRadioName();
    page.changeCopyright();

    var player = new Player();
    player.play();

    getStreamingData();
    // Interval to get streaming data in miliseconds
    setInterval(function () {
        getStreamingData();
    }, 5000);
});

// DOM control
function Page() {
    this.changeTitlePage = function (title = RADIO_NAME) {
        document.title = title;
    };

    this.changeRadioName = function (title = RADIO_NAME) {
        var radioName = document.getElementById("radioName");
        radioName.innerHTML = title;
    }

    this.changeCopyright = function (title = RADIO_NAME) {
        var radioName = document.getElementById("copyrights");
        radioName.innerHTML = "© " + DATE.getFullYear() + " " + title;
    }

    this.refreshCurrentSong = function (song, artist) {
        var currentSong = document.getElementById('title');
        var currentArtist = document.getElementById('album');

        if (song !== currentSong.innerHTML) {
            // Animate transition
            currentSong.className = 'animated fadeIn text-uppercase';
            currentSong.innerHTML = song;

            currentArtist.className = 'animated fadeIn text-capitalize';
            currentArtist.innerHTML = artist;

            // Remove animation classes
            setTimeout(function () {
                currentSong.className = 'text-uppercase';
                currentArtist.className = 'text-capitalize';
            }, 2000);
        }
    }

    this.refreshCover = function (song = '', artist) {
        // Default cover art
        var urlCoverArt = DEFAULT_COVER_ART;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var coverArt = document.getElementById('albumArt');

            // Get cover art URL
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artworkUrl = data.cover ?? urlCoverArt;

                //coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
                document.getElementsByTagName('body')[0].style.background = 'url('+ artworkUrl +') no-repeat center center fixed'
                document.getElementsByTagName('body')[0].style.backgroundSize = "cover";
                coverArt.src = artworkUrl;

                coverArt.className = 'img-fluid rounded mx-auto d-block animated fadeIn';

                setTimeout(function () {
                    coverArt.className = 'img-fluid rounded mx-auto d-block';
                }, 2000);

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song,
                        artist: artist,
                        artwork: [{
                            src: artworkUrl,
                            type: 'image/png'
                        }]
                    });
                }
            }
        }
        xhttp.open('GET', 'http://wrd.spaceworks.ovh:8000/radio', true);
        xhttp.send();
    }
}

var audio = new Audio(URL_STREAMING);

// Player control
function Player() {
    this.play = async function () {
        await audio.play();
    };

    this.pause = function () {
        audio.pause();
    };
}

// On play, change the button to pause
audio.onplay = function () {
    var botao = document.getElementById('playerButton').firstElementChild;

    if (botao.className === 'fa fa-play') {
        botao.className = 'fa fa-stop';
    }
}

// On pause, change the button to play
audio.onpause = function () {
    var botao = document.getElementById('playerButton').firstElementChild;

    if (botao.className === 'fa fa-stop') {
        botao.className = 'fa fa-play';
    }
}

function getStreamingDataIcecast() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var icecastStatus = JSON.parse(this.responseText);

            // Assuming the Icecast server returns a status indicating whether it's streaming or not
            if (icecastStatus && icecastStatus.streamedSeconds > 0) {
                // Icecast is streaming
                var page = new Page();
                page.refreshCover("Default Song", "Default Artist");
                page.refreshCurrentSong("Default Song", "Default Artist");
            } else {
                // Icecast is not streaming
                console.log("Icecast is not streaming");
            }
        }
    };

    xhttp.open('GET', 'http://wrd.spaceworks.ovh:8000/status-json.xsl', true);
    xhttp.send();
}

function getStreamingData() {
    // Replace the function call with the Icecast-specific function
    getStreamingDataIcecast();
}

function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.load();
        audio.play();
    }
}
