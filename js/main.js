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
        xhttp.open('GET', 'https://api.radioking.io/widget/radio/' + RADIO_ID + '/track/current', true);
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

function getStreamingData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            if (this.response.length === 0) {
                console.log('%cdebug', 'font-size: 22px')
            }

            var data = JSON.parse(this.responseText);

            var page = new Page();

            var currentSongElement = document.getElementById('title').innerHTML.replace(/&apos;/g, '\'');
            let currentSongEl = currentSongElement.replace(/&amp;/g, '&');

            // Formating characters to UTF-8
            let song = (data.title ?? "").replace(/&apos;/g, '\'');
            let currentSong = song.replace(/&amp;/g, '&');

            let artist = (data.artist ?? "").replace(/&apos;/g, '\'');
            let currentArtist = artist.replace(/&amp;/g, '&');
            currentArtist = currentArtist.replace('  ', ' ');

            // Change the title
            document.title = currentSong + ' - ' + currentArtist + ' | ' + RADIO_NAME;

            if (currentSongEl.trim() !== currentSong.trim()) {
                page.refreshCover(currentSong, currentArtist);
                page.refreshCurrentSong(currentSong, currentArtist);
            }
        }
    };

    //var d = new Date();

    // Requisition with timestamp to prevent cache on mobile devices
    xhttp.open('GET', 'https://api.radioking.io/widget/radio/' + RADIO_ID + '/track/current', true);
    xhttp.send();
}


function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.load();
        audio.play();
    }
}