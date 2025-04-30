document.addEventListener("click", begin);

// Like an initialize function, but for a click, to allow music to play.
function begin() {

    // Prevent multiple clicks and remove the load screen.
    document.removeEventListener("click", begin);

    // Get the loading prompt.
    var clickPrompt = document.getElementById('begin');

    // Handle the fade event.
    clickPrompt.style.transition = 'opacity 1s';
    clickPrompt.style.opacity = '0';
    setTimeout(function () {
        clickPrompt.remove();

        // Set background music.
        var music = new Audio("../media/music.mp3");
        music.play();
        music.loop = true;

        // Create 400 stars with random spacing.
        for (var i = 1; i <= 4; i++) {
            var starsDiv = document.getElementById('stars-' + i);
            for (var j = 0; j < 100; j++) {
                var newStar = document.createElement('div');
                newStar.style.width = '1px';

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
        toggleAudioButton.textContent = "♫";
        toggleAudioButton.addEventListener('click', function () {
            music.paused ? music.play() : music.pause();
            toggleAudioButton.style.textDecoration = music.paused ? 'line-through' : 'none';
            nowPlaying.style.opacity = '0'; // Remove the Now Playing if it's still visible.
        });

        controlPanel.appendChild(toggleAudioButton);

        var toggleBackgroundButton = document.createElement('a');
        toggleBackgroundButton.className = 'toggle-btn';
        toggleBackgroundButton.textContent = "¨";

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

        controlPanel.appendChild(toggleBackgroundButton);

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
            controlPanel.style.transition = nowPlaying.style.transition = 'opacity 2s';
            controlPanel.style.opacity = nowPlaying.style.opacity = '1';
        }, 500);

        // Wait before hiding the Now Playing text.
        setTimeout(function () {
            nowPlaying.style.transition = 'opacity 2s';
            nowPlaying.style.opacity = '0';
        }, 5000);

    }, 1000);
}