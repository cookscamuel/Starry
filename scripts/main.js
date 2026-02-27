// Function used to fade audio (music) in and out.
// An attempt at making a more smooth transition than simply audio.pause();
function fadeInOut(audio, inOut) {
    if ((audio.volume <= 0.1 && inOut == 2) || audio.volume == inOut == 1) {
        return;
    }

    setTimeout(function () {
        inOut == 2 ? audio.volume -= 0.1 : audio.volume += 0.1;
        fadeInOut(audio, inOut);
    }, 25);
};

// Like an initialize function, but for a click, to allow music to play.
window.onload = function begin() {

    setTimeout(function () {

        // Set background music.
        var music = new Audio("../media/music.mp3");
        music.loop = true;

        // Create 400 stars with random spacing.
        for (var i = 1; i <= 4; i++) {
            var starsDiv = document.getElementById('stars-' + i);
            for (var j = 0; j < 100; j++) {
                var newStar = document.createElement('div');
                newStar.style.width = '1px';
                newStar.style.opacity = '0.35';

                var randNum = Math.floor(Math.random() * 185);
                newStar.textContent = randNum % 2 == 0 ? "*" : ".";

                newStar.className =
                    randNum == 20 ||
                        randNum == 40 ||
                        randNum == 60 ||
                        randNum == 80 ||
                        randNum == 100 ||
                        randNum == 120 ||
                        randNum == 140 ||
                        randNum == 160
                        ? "twinklers" : "shiners";

                newStar.style.marginLeft = randNum.toString() + 'vw';
                newStar.style.zIndex = '0';
                starsDiv.appendChild(newStar);
            }
        }

        // Retrieve all the divs as a collection for later use.
        var allStarsDivs = document.getElementsByClassName('stars');

        // Get the control panel to fill it with options.
        var controlPanel = document.getElementById('control-panel');

        // Add the button to toggle the music playing.
        var toggleAudioButton = document.createElement('a');
        toggleAudioButton.className = 'toggle-btn';
        toggleAudioButton.textContent = "¯";
        toggleAudioButton.style.textDecoration = 'line-through';
        toggleAudioButton.style.transition = 'opacity 1s';
        toggleAudioButton.addEventListener('click', function () {
            if (music.paused) {
                music.play();
                fadeInOut(music, 1);
                setTimeout(function () {
                    nowPlaying.style.transition = 'opacity 2s';
                    nowPlaying.style.opacity = '1';
                }, 500);

            }
            else {
                fadeInOut(music, 2);
                setTimeout(function () {
                    music.pause();
                }, 300);
                
                nowPlaying.style.transition = 'opacity 2s';
                nowPlaying.style.opacity = '0';
            }

            // Not a good fix. Should check based on the paused state, but not like this.
            setTimeout(function () {
                toggleAudioButton.style.textDecoration = music.paused ? 'line-through' : 'none';
            }, 300);

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

        

        // Add the volume control.
        var volumeSlider = document.createElement('a');
        volumeSlider.className = 'toggle-btn';
        
        // Add the hide UI button.
        var toggleUIButton = document.createElement('a');
        toggleUIButton.className = 'toggle-btn';
        toggleUIButton.textContent = 'N';
        toggleUIButton.style.opacity = '1';

        // Toggle UI visibility function.
        toggleUIButton.addEventListener('click', function () {

            nowPlaying.style.opacity = nowPlaying.style.opacity != '0' ? '0' : '0';

            toggleAudioButton.style.opacity = toggleBackgroundButton.style.opacity = 
            toggleUIButton.style.opacity == '1' ? '0' : '1';

            toggleAudioButton.style.pointerEvents = toggleBackgroundButton.style.pointerEvents
            = toggleUIButton.style.opacity == '1' ? 'none' : 'auto';

            toggleUIButton.style.opacity = toggleUIButton.style.opacity == '1' ? '0.2' : '1';

        });

        controlPanel.appendChild(toggleUIButton);
        controlPanel.appendChild(toggleBackgroundButton);
        controlPanel.appendChild(toggleAudioButton);

        // Create the Now Playing text.
        var nowPlaying = document.getElementById('now-playing');
        nowPlaying.innerText = "Now Playing: Holland Patent Public Library - Hello Stephen Hawking";


        // Hide everything by default to allow for a fade-in effect.
        for (var i = 0; i < 4; i++) {
            allStarsDivs[i].style.opacity = '0';
        }
        controlPanel.style.opacity = nowPlaying.style.opacity = '0';

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