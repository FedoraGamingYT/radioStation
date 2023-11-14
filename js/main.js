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

function updateCoverArtUsingLastfm(song, artist) {
    // Default cover art
    var urlCoverArt = DEFAULT_COVER_ART;

    // Use Last.fm API to get album art
    var lastFmApiKey = '11e52cd83406ff9c727142e9606a0132'; // Replace with your Last.fm API key
    var lastFmApiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFmApiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(song)}&format=json`;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);

            if (data.track && data.track.album && data.track.album.image) {
                // Use the largest available image from Last.fm
                var artworkUrl = data.track.album.image.find(img => img.size === 'extralarge')['#text'];
                updateCoverArt(artworkUrl);
            } else {
                // Use default cover art if no information is available
                updateCoverArt(urlCoverArt);
            }
        }
    };

    xhttp.open('GET', lastFmApiUrl, true);
    xhttp.send();

    function updateCoverArt(artworkUrl) {
        var coverArt = document.getElementById('albumArt');
        document.getElementsByTagName('body')[0].style.background = 'url(' + artworkUrl + ') no-repeat center center fixed';
        document.getElementsByTagName('body')[0].style.backgroundSize = 'cover';
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

function getStreamingDataIcecast() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var icecastStatus = JSON.parse(this.responseText);

            // Assuming the Icecast server provides information about the current playing track
            var currentTrack = icecastStatus.icestats.source.title;

            var page = new Page();

            // Assuming the Icecast server response includes the current playing track information
            var [song, artist] = parseIcecastTrackInfo(currentTrack);

            // Change the title
            document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

            // Update cover art using Last.fm API
            updateCoverArtUsingLastfm(song, artist);

            page.refreshCurrentSong(song, artist);
        }
    };

    xhttp.open('GET', 'http://wrd.spaceworks.ovh:8000/status-json.xsl', true);
    xhttp.send();
}

// Function to parse the Icecast track information
function parseIcecastTrackInfo(trackInfo) {
    // Assuming the track information is formatted as "Artist - Song"
    var [artist, song] = trackInfo.split(' - ');
    return [song, artist];
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
