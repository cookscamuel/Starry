// Class used to create a tracklist of songs and their data using a standard deque data structure.
export default class musicQueue {

    constructor() {
        this.songs = [];
        this.titles = [];
        this.artists = [];
        this.front = -1;
        this.rear = -1;
    };


    // Add a song to the rear.
    addSongRear(song, artist, title) {
        if (this.front == -1) {
            this.front = 0;
        }
        this.rear++;
        this.songs[this.rear] = song;
        this.artists[this.rear] = artist;
        this.titles[this.rear] = title;
    };

    // Insert a song at the front.
    insertSongFront(song, artist, title) {
        if (this.front == -1) {
            this.front = this.rear = 0;
        }

        this.songs.unshift(song);
        this.artists.unshift(artist)
        this.titles.unshift(title);
        this.rear++
    };

    // Remove a song from the rear.
    removeSongRear() {
        if (this.front != -1 || this.front > this.rear) {
            this.songs.pop();
            this.artists.pop();
            this.titles.pop();
            this.rear--;
        }
    };

    // Remove a song from the front.
    removeSongFront() {
        if (this.front != -1 || this.front > this.rear) {
            for (var i = 0; i < this.rear; i++) {
                this.songs[i] = this.songs[i + 1];
                this.artists[i] = this.artists[i + 1];
                this.titles[i] = this.titles[i + 1];
            }
            this.rear--;
            if (this.rear == -1) { // If the rear becomes less than 0, ensure the list is actually emptied.
                this.front = -1;
            }
        }
    };

    // Adds the front song to the rear and then removes the front song.
    nextSong() {
        this.addSongRear(this.getFrontSong(), this.getFrontArtist(), this.getFrontTitle());
        this.removeSongFront();
    };

    // Adds the rear song to the front and then removes it from the rear.
    previousSong() {
        this.insertSongFront(this.getRearSong(), this.getRearArtist(), this.getRearTitle());
        this.removeSongRear();
    };

    // Return the rear values.
    getRearSong() {
        return this.songs[this.rear];
    };

    getRearArtist() {
        return this.artists[this.rear];
    };

    getRearTitle() {
        return this.titles[this.rear];
    };


    // Return the front values.
    getFrontSong() {
        return this.songs[this.front];
    };

    getFrontArtist() {
        return this.artists[this.front];
    }

    getFrontTitle() {
        return this.titles[this.front];
    };

};