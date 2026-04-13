// Issues:
// Tracklist still scrolling when space is pressed after selecting a song.
// Volume slider not responding as desired to zooming.

// Standard deque data structure for practice and also making a tracklist.
import musicQueue from "./queue.js";

// Array of artists and song titles featured in this project.
const SONG_INFO = [
    ["Holland Patent Public Library", "Hello Stephen Hawking"],
    ["Pyotr Ilyich Tchaikovsky", "The Nutcracker Pas de Deux (Slowed)"],
    ["Minecraft 1.0.16.05 OST", "Moon 2 (Fjord)"],
    ["Al Bowlly, Ray Noble & His Orchestra", "Midnight, The Stars and You"],
    ["Nordic Light Trio", "Stars Above"],
    ["Kyle Dixon & Michael Stein", "You're a Fighter"]
];

// Recursive function used to fade audio in or out based on the input.
// My attempt at making a more smooth transition than simply audio.pause();
function fadeInOut(audio, inOut, vol) {
    if ((audio.volume <= 0.1 && inOut == 2) || audio.volume == vol && inOut == 1) {
        return;
    }

    setTimeout(function () {
        inOut == 2 ? audio.volume -= 0.1 : audio.volume += 0.1;
        fadeInOut(audio, inOut, vol);
    }, 25);
};

// Function used to toggle the visibility and accessibility of specific elements when accessing the music player.
function toggleModalMusicMenu(panel, modal) {
    // Toggle the modal popup.
    modal.style.opacity = modal.style.opacity == '0' ? '1' : '0';

    modal.style.pointerEvents = modal.style.opacity == '0' ? 'none' : 'auto';

    // Toggle all other controls.
    panel.style.transition =
        modal.style.opacity == '1' ? 'opacity 1s' : 'opacity 2s';

    panel.style.opacity =
        modal.style.opacity == '1' ? '0.3' : '1';

    panel.style.pointerEvents = panel.childNodes[0].style.pointerEvents =
        modal.style.opacity == '1' ? 'none' : 'auto';
};

// Function to update the music player after a song ends.
function updatePlayerAtSongEnd(song, songlist, title, artist, vol, modal) {
    song.src = songlist.getFrontSong();
    title.textContent = songlist.getFrontTitle();
    artist.textContent = songlist.getFrontArtist();
    song.volume = vol;
    song.play();
    handleAutoScrollingTitle(title, modal);
};

// A function used to update the player when a song starts or stops for any reason.
function startStopCurrentSong(song, songlist, button, title, artist, vol, modal) {
    if (song.paused) {
        button.textContent = ";";
        song.play();
        fadeInOut(song, 1, vol);
        button.style.pointerEvents = 'none';
        title.textContent = songlist.getFrontTitle();
        artist.textContent = songlist.getFrontArtist();
        handleAutoScrollingTitle(title, modal);

        // Cooldown to tentatively prevent the audio fade function from breaking due to spam.
        setTimeout(function () {
            button.style.pointerEvents = 'auto';
        }, 250);
    }
    else {
        fadeInOut(song, 2, vol);
        button.style.pointerEvents = 'none';
        button.textContent = "4";
        setTimeout(function () {
            song.pause();
            title.textContent = "nothing";
            artist.textContent = ". . .";
            button.style.pointerEvents = 'auto';
            title.style.animation = 'none';
        }, 250);
    }
}

// Function used to appropriately set the auto scrolling animation for the title if it is needed.
function handleAutoScrollingTitle(title, modal) {
    title.style.animation = 'none';
    if (title.getBoundingClientRect().width >= modal.getBoundingClientRect().width - 40) {
        title.style.animation = visualViewport.width <= 1024 ?
            'titleAutoScrollMobile 8s infinite linear' : 'titleAutoScrollReg 8s infinite linear';
        title.style.animationTimingFunction = 'ease';
    }
}

// "Main"
window.onload = function begin() {

    setTimeout(function () {

        // Create 400 stars with random spacing.
        for (var i = 1; i <= 4; i++) {
            var starsDiv = document.getElementById('stars-' + i);
            for (var j = 0; j < 100; j++) {
                var newStar = document.createElement('div');
                newStar.style.width = '1px';
                newStar.style.opacity = '0.35';

                var randNum = Math.floor(Math.random() * 185);
                newStar.textContent = randNum % 2 == 0 ? "*" : ".";

                // Smarter way of assigning twinklers, also more twinklers than before.
                newStar.className = randNum % 10 == 0 ? "twinklers" : "shiners";

                newStar.style.marginLeft = randNum.toString() + 'vw';
                newStar.style.zIndex = '0';
                starsDiv.appendChild(newStar);
            }
        }

        // Retrieve all the divs as a collection for later use.
        var allStarsDivs = document.getElementsByClassName('stars');

        // Get the control panel to fill it with options.
        var controlPanel = document.getElementById('control-panel');
        controlPanel.style.opacity = '0';

        // Handle Music.
        const allSongs = new musicQueue();

        // Populate the queue with all the songs from the files and titles from the array.
        for (var i = 0; i <= SONG_INFO.length - 1; i++) {
            allSongs.addSongRear("../media/music-" + i + ".mp3", SONG_INFO[i][0], SONG_INFO[i][1]);
        }

        // Add the button to toggle the music playing.
        var openModalMusicMenuButton = document.createElement('a');
        openModalMusicMenuButton.className = 'toggle-btn';
        openModalMusicMenuButton.textContent = "¯";
        openModalMusicMenuButton.style.transition = 'opacity 1s';

        var modalMusicMenu = document.getElementById('music-menu');
        modalMusicMenu.style.opacity = '0';
        modalMusicMenu.style.transition = 'opacity 1s';

        var closeModalMusicMenuButton = document.getElementById('music-exit');

        // Open and close modal popup music player when clicked.
        openModalMusicMenuButton.addEventListener('click', function () {
            toggleModalMusicMenu(controlPanel, modalMusicMenu);
        });

        closeModalMusicMenuButton.addEventListener('click', function () {
            toggleModalMusicMenu(controlPanel, modalMusicMenu);
        });

        // Dynamically populate music player.
        var currentSong = new Audio();
        var currentVolume = 0.7;
        var preservedMutedVolume = 0.7;
        currentSong.src = allSongs.getFrontSong();
        currentSong.volume = currentVolume;

        var nowPlayingTitle = document.getElementById('song-title');
        var nowPlayingArtist = document.getElementById('song-artist');

        var tracklist = document.getElementById('music-list');
        for (var i = 0; i < SONG_INFO.length; i++) {
            var track = document.createElement('li');
            var title = document.createElement('div');
            var artist = document.createElement('div');
            track.id = "music-" + i;
            track.className = "tracks";
            title.className = "track-titles";
            artist.className = "track-artists";
            title.textContent = SONG_INFO[i][1];
            artist.textContent = SONG_INFO[i][0];
            tracklist.appendChild(track);
            track.appendChild(title);
            track.appendChild(artist);
        }

        var playPause = document.getElementById('music-play-pause');
        var prev = document.getElementById('music-prev');
        var next = document.getElementById('music-next');

        var mute = document.getElementById('music-mute');
        var isMuted = false;

        var volumeSlider = document.getElementById('music-volume');
        volumeSlider.value = currentVolume;

        var repeat = document.getElementById('music-repeat');
        var isRepeating = false;

        // Handle play/pause button behaviour.
        playPause.addEventListener('click', function () {
            startStopCurrentSong(currentSong, allSongs, playPause, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
        });

        // Handle autoplay when a song finishes playing.
        currentSong.addEventListener('ended', function () {
            if (isRepeating) {
                currentSong.play();
                return;
            }
            allSongs.nextSong();
            updatePlayerAtSongEnd(currentSong, allSongs, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
        });

        prev.addEventListener('click', function () {
            allSongs.previousSong();
            updatePlayerAtSongEnd(currentSong, allSongs, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
            playPause.textContent = ";";
        });

        next.addEventListener('click', function () {
            allSongs.nextSong();
            updatePlayerAtSongEnd(currentSong, allSongs, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
            playPause.textContent = ";";
        });

        // Handle repeating one track indefinitely.
        repeat.addEventListener('click', function () {
            isRepeating = !isRepeating;
            repeat.style.color = isRepeating ? 'ghostwhite' : 'rgb(153, 153, 153)';
        });

        // Handle clicking a song in the tracklist.
        for (var i = 0; i < tracklist.children.length; i++) {
            tracklist.children[i].style.cursor = 'pointer';
            tracklist.children[i].addEventListener('click', function () {
                while (allSongs.getFrontSong() != "../media/" + this.id + ".mp3") {
                    allSongs.nextSong();
                }
                updatePlayerAtSongEnd(currentSong, allSongs, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
                playPause.textContent = ";";
            });
        }

        // Handle volume slider.
        volumeSlider.addEventListener('input', function () {
            currentSong.volume = currentVolume = preservedMutedVolume = volumeSlider.value;
            mute.textContent = currentVolume != 0 ? "Xð" : "X";
            isMuted = currentVolume != 0 ? false : true;
        });

        // Handle mute button.
        mute.addEventListener('click', function () {
            preservedMutedVolume = preservedMutedVolume == 0 ? 0.5 : preservedMutedVolume;
            currentSong.volume = currentVolume = volumeSlider.value = isMuted ? preservedMutedVolume : 0;
            mute.textContent = isMuted ? "Xð" : "X";
            isMuted = !isMuted;
        });



        // Add the button to toggle the background color.
        var toggleBackgroundButton = document.createElement('a');
        toggleBackgroundButton.className = 'toggle-btn';
        toggleBackgroundButton.textContent = "1";
        toggleBackgroundButton.style.transition = 'opacity 1s';

        var sky = document.getElementById('body');
        sky.style.transition = 'all .7s';
        var skyColors = [
            "rgb(4, 0, 26)",
            "#343E47",
            "rgb(16, 0, 107)",
            "rgb(38, 23, 58)",
            "rgb(49, 31, 31)",
            "rgb(20, 13, 19)",
            "black"
        ];
        var skyNum = 0;

        toggleBackgroundButton.addEventListener('click', function () {
            sky.style.background = skyColors[skyNum];
            skyNum++;
            skyNum = skyNum == skyColors.length ? 0 : skyNum;
        });

        // Add the hide UI button.
        var toggleUIButton = document.createElement('a');
        toggleUIButton.className = 'toggle-btn';
        toggleUIButton.textContent = 'N';
        toggleUIButton.style.opacity = '1';
        toggleUIButton.style.pointerEvents = 'auto';

        // Toggle UI visibility function.
        toggleUIButton.addEventListener('click', function () {

            openModalMusicMenuButton.style.opacity = toggleBackgroundButton.style.opacity =
                toggleUIButton.style.opacity == '1' ? '0' : '1';

            controlPanel.style.pointerEvents = toggleUIButton.style.opacity == '1' ? 'none' : 'auto';

            toggleUIButton.style.opacity = toggleUIButton.style.opacity == '1' ? '0.15' : '1';

        });

        controlPanel.appendChild(toggleUIButton);
        controlPanel.appendChild(toggleBackgroundButton);
        controlPanel.appendChild(openModalMusicMenuButton);


        // Spacebar cooldown variable.
        var isSpacePressed = false;

        // ???
        var safe = true;
        var spell = ["D", "A", "N", "N", "Y"];
        var harbinger = 0;

        // Keypress logic.
        document.addEventListener('keyup', function (event) {

            // Spacebar
            if (event.key === " " && !isSpacePressed) {
                isSpacePressed = true;
                startStopCurrentSong(currentSong, allSongs, playPause, nowPlayingTitle, nowPlayingArtist, currentVolume, modalMusicMenu);
                setTimeout(function () {
                    isSpacePressed = false;
                }, 250);
            }

            // Escape Key
            if (event.key === "Escape" && modalMusicMenu.style.opacity == '1') {
                toggleModalMusicMenu(controlPanel, modalMusicMenu);
            }

            // Massive Scope Creep (Easter Eggs)
            if (safe) {
                if (event.key === spell[harbinger]) {
                    harbinger++;
                    if (harbinger == spell.length) {
                        var shinnies = document.getElementsByClassName('shiners');
                        var twinkies = document.getElementsByClassName('twinklers');
                        sky.style.background = 'rgb(145, 31, 31)';
                        for (var i = 0; i < shinnies.length; i++) {
                            shinnies[i].style.color = 'red';
                            shinnies[i].style.animation = 'none';
                        }
                        for (var i = 0; i < twinkies.length; i++) {
                            twinkies[i].style.color = 'rgb(240, 45, 45)';
                        }
                        controlPanel.style.opacity = modalMusicMenu.style.opacity = '0';
                        controlPanel.style.pointerEvents =
                            toggleUIButton.style.pointerEvents =
                            modalMusicMenu.style.pointerEvents = 'none';
                        var gookin = document.createElement('img');
                        gookin.src = '../media/joy.png';
                        gookin.id = 'egg-1';

                        var omen = document.createElement('a');
                        omen.textContent = "[ PASS STOGIE ]";
                        omen.id = "egg-2";
                        omen.href = 'https://www.wambooli.com/blog/wp-content/uploads/2014/01/20140512200844.dan-stogie.jpg';

                        fadeInOut(currentSong, 2, currentVolume);
                        document.body.appendChild(omen);
                        document.body.appendChild(gookin);
                        setTimeout(function () {
                            gookin.style.opacity = '0.7';
                            gookin.style.width = '30em';
                            currentSong.pause();
                            var divinity = new Audio('../media/hark.mp3');
                            divinity.loop = true;
                            divinity.play();
                        }, 500);
                        setTimeout(function () {
                            omen.style.opacity = '1';
                            omen.style.pointerEvents = 'auto';
                        }, 10000);
                        safe = false;
                    }
                }
                else {
                    harbinger = 0;
                }
            }
        });

        // Event listener for scrolling.
        document.addEventListener('wheel', function (event) {
            if (volumeSlider.matches(':hover')) {
                // Scrolling up is a negative deltaY, scrolling down is positive.
                volumeSlider.value = event.deltaY < 0 ? Number(volumeSlider.value) + 0.1 : Number(volumeSlider.value) - 0.1;
                currentSong.volume = currentVolume = preservedMutedVolume = volumeSlider.value;
                mute.textContent = currentVolume != 0 ? "Xð" : "X";
                isMuted = currentVolume != 0 ? false : true;
            }
        })

        // Hide everything by default to allow for a fade-in effect.
        for (var i = 0; i < 4; i++) {
            allStarsDivs[i].style.opacity = '0';
        }

        // Wait to allow for a transition.
        setTimeout(function () {
            // Set the transition to take 2 seconds to reveal the content.
            for (var i = 0; i < 4; i++) {
                allStarsDivs[i].style.transition = 'opacity 2s';
                allStarsDivs[i].style.opacity = '1';
            }
            controlPanel.style.transition = 'opacity 2s';
            controlPanel.style.opacity = '1';
        }, 500);

    }, 1000);

}