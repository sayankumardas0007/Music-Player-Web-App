var songList;
var albums;
var artists;
var asideCurrentSongList;

var currentAudio = new Audio();
var currentTrack = null;

var songsid = null;
var songsiddd = null;

var songInfo = document.querySelector("#song-info");
var sikBarCircle = document.querySelector("#sikbar-circle");
var sikBar = document.querySelector("#sikbar");
var sikBarPlayed = document.querySelector("#sikbar-played");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
var asideHeader = document.querySelector("#aside-header h1");

async function fetchAudioFiles() {
  const response = await fetch("/Resourse/audio/");
  const html = await response.text();
  // console.log(html);
  const div = document.createElement("div");
  div.innerHTML = html;
  const items = div.getElementsByTagName("a");
  // console.log(items);
  let audioFiles = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.href.endsWith(".mp3")) {
      audioFiles.push(item.href);
    }
  }
  // console.log(audioFiles);
  return audioFiles;
}

async function songNames(arr) {
  let songNamesArr = [];

  arr.forEach(element => {
    let name = element.split("/audio/")[1];
    // name = name.replace(/%20/g, " "); // also workes
    name = name.replaceAll("%20", " ")
    name = name.replace(".mp3", "");
    name = name.replace(/\([^)]*\)/g, "");
    // console.log(name);
    songNamesArr.push(name);
  });
  return songNamesArr;
}

async function createPlayList(arr, str) {
  let newArr = [];
  arr.forEach((e) => {
    if (e.includes(str)) {
      newArr.push(e);
    }
  });
  return newArr;
}

let playMusic = (track) => {
  if (currentTrack === track) {
    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }
  } else {
    let songsidd = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-play-pause img`);
    songsidd.forEach((e) => {
      e.src = "Resourse/image/play.svg";
    });
    currentTrack = track;
    currentAudio.src = track;
    songsiddd = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-song-title p`);
    if (songsiddd) {
      songInfo.innerHTML = `<h1>${songsiddd[0].innerText}</h1>`;
    }
    currentAudio.play();
  }
}

async function weekPlayMusic(track) {
  let songsidd = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-play-pause img`);
  songsidd.forEach((e) => {
    e.src = "Resourse/image/play.svg";
  });
  currentTrack = track;
  currentAudio.src = track;
  songsiddd = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-song-title p`);
  if (songsiddd) {
    songInfo.innerHTML = `<h1>${songsiddd[0].innerText}</h1>`;
  }
  currentAudio.play();
}

async function asideSongListing(arr, arr1) {
  let asideSongArea = document.querySelector("#aside-content ul");
  let mainSongArea = document.querySelector("#main-playlist-area ul")
  for (let len = 0; len < arr.length; len++) {
    asideSongArea.innerHTML = asideSongArea.innerHTML + `<li data-track= "${arr1[len]}"><div class="aside-song-list">
                <div class="aside-song-title">
                    <img src="Resourse/image/music-img.svg" alt="music">
                    <p>${arr[len]}</p>
                </div>
                <div class="aside-play-pause">
                    <img src="Resourse/image/play.svg" alt="play">
                </div>
            </div> </li>`;
  }
  for (let len = 0; len < arr.length; len++) {
    mainSongArea.innerHTML = mainSongArea.innerHTML + `<li data-track= "${arr1[len]}"><div class="main-song-list aside-song-list">
                <div class="main-song-title aside-song-title">
                    <img src="Resourse/image/music-img.svg" alt="music">
                    <p>${arr[len]}</p>
                </div>
                <div class="main-play-pause aside-play-pause">
                    <img src="Resourse/image/play.svg" alt="play">
                </div>
            </div> </li>`;
  }
}

async function section1ContaintInsert() {
  let myTerget = document.querySelector("#section1 > div.card-container");

  albums = {
    All: {
      name: "All Songs",
      image: "Resourse/image/albums/All_Songs.jpg",
      songs: songList
    },
    Happy: {
      name: "Happy",
      image: "Resourse/image/albums/Happy.jpeg",
      songs: createPlayList(songList, "Happy")
    },
    Feel_good: {
      name: "Feel Good",
      image: "Resourse/image/albums/Feel_good.jpg",
      songs: createPlayList(songList, "Feel_good")
    },
    Commute: {
      name: "Commute",
      image: "Resourse/image/albums/Commute.jpeg",
      songs: createPlayList(songList, "Commute")
    },
    Romantice: {
      name: "Romantice",
      image: "Resourse/image/albums/Romantice.jpg",
      songs: createPlayList(songList, "Romantice")
    },
    Sad: {
      name: "Sad",
      image: "Resourse/image/albums/Sad.jpeg",
      songs: createPlayList(songList, "Sad")
    },
    Relax: {
      name: "Relax",
      image: "Resourse/image/albums/Relax.jpg",
      songs: createPlayList(songList, "Relax")
    },
  };

  for (const key in albums) {
    let e = albums[key];
    myTerget.innerHTML = myTerget.innerHTML + `<div class="card" data-arr="${key}">
                    <div class="s-img-container">
                        <img src="${e.image}" alt="">
                        <img src="Resourse/image/play.svg" alt="" class="play-button-svg"
                            style="width: 50px; height: 50px;">
                    </div>
                    <h1>${e.name}</h1>
                </div>
            </div>`;
  }

  let mymyTerget = myTerget.querySelectorAll("div.card");

  mymyTerget.forEach((element) => {
    element.addEventListener("click", async () => {
      let k = element.dataset.arr;
      let newArrData = await albums[k].songs;
      let myNewArrData = await songNames(newArrData);
      let asideSongArea = document.querySelector("#aside-content ul");
      let mainSongArea = document.querySelector("#main-playlist-area ul");
      asideSongArea.innerHTML = "";
      mainSongArea.innerHTML = "";
      asideSongListing(myNewArrData, newArrData);
      playSong();
      asideCurrentSongList = newArrData;
      songsid = document.querySelectorAll(`[data-track="${asideCurrentSongList[0]}"] .aside-play-pause img`);
      weekPlayMusic(asideCurrentSongList[0]);
      asideHeader.innerHTML = `${albums[k].name}`;
    });
  });
}

async function section2ContaintInsert() {
  let myTerget = document.querySelector("#section2 > div.card-container");

  artists = {
    Alan_Walker: {
      name: "Alan Walker",
      image: "Resourse/image/artiests/Alan_Walker.jpeg",
      songs: createPlayList(songList, "Alan")
    },
    AURORA: {
      name: "AURORA",
      image: "Resourse/image/artiests/AURORA.jpeg",
      songs: createPlayList(songList, "AURORA")
    },
    Billie_Eilish: {
      name: "Billie Eilish",
      image: "Resourse/image/artiests/Billie_Eilish.jpeg",
      songs: createPlayList(songList, "Billie")
    },
    Coldplay: {
      name: "Coldplay",
      image: "Resourse/image/artiests/Coldplay.jpg",
      songs: createPlayList(songList, "Coldplay")
    },
    Ember_Island: {
      name: "Ember Island",
      image: "Resourse/image/artiests/Ember_Island.jpeg",
      songs: createPlayList(songList, "Ember")
    },
    Natalie_Taylor: {
      name: "Natalie Taylor",
      image: "Resourse/image/artiests/Natalie_Taylor.jpeg",
      songs: createPlayList(songList, "Natalie")
    },
    Taylor_Swift: {
      name: "Taylor Swift",
      image: "Resourse/image/artiests/Taylor_Swift.jpg",
      songs: createPlayList(songList, "Swift")
    }
  };

  for (const key in artists) {
    let e = artists[key];
    myTerget.innerHTML = myTerget.innerHTML + `<div class="card" data-arr="${key}">
                    <div class="s-img-container">
                        <img src="${e.image}" alt="">
                        <img src="Resourse/image/play.svg" alt="" class="play-button-svg"
                            style="width: 50px; height: 50px;">
                    </div>
                    <h1>${e.name}</h1>
                </div>`;
  }

  let mymyTerget = myTerget.querySelectorAll("div.card");
  mymyTerget.forEach((element) => {
    element.addEventListener("click", async () => {
      let k = element.dataset.arr;
      let newArrData = await artists[k].songs;
      let myNewArrData = await songNames(newArrData);
      let asideSongArea = document.querySelector("#aside-content ul");
      let mainSongArea = document.querySelector("#main-playlist-area ul");
      asideSongArea.innerHTML = "";
      mainSongArea.innerHTML = "";
      asideSongListing(myNewArrData, newArrData);
      playSong();
      asideCurrentSongList = newArrData;
      songsid = document.querySelectorAll(`[data-track="${asideCurrentSongList[0]}"] .aside-play-pause img`);
      weekPlayMusic(asideCurrentSongList[0]);
      asideHeader.innerHTML = `${artists[k].name}`;
    });
  });
}

async function section3ContaintInsert(arr, arr1) {
  let section3SongArea = document.querySelector("#section3 div.card-container ul");
  for (let len = 0; len < arr.length; len++) {
    section3SongArea.innerHTML = section3SongArea.innerHTML + `<li data-track= "${arr1[len]}"><div class="aside-song-list">
                <div class="aside-song-title">
                    <img src="Resourse/image/music-img.svg" alt="music">
                    <p>${arr[len]}</p>
                </div>
                <div class="aside-play-pause">
                    <img src="Resourse/image/play.svg" alt="play">
                </div>
            </div> </li>`;
  }
}

async function playSong() {
  let songLst = document.querySelectorAll("#aside-content ul li");
  let mainSongLst = document.querySelectorAll("#main-playlist-area ul li");

  songLst.forEach(element => {
    element.addEventListener("click", () => {
      let track = element.dataset.track;
      songsid = document.querySelectorAll(`[data-track="${track}"] .aside-play-pause img`);
      playMusic(track);
    });
  });
  mainSongLst.forEach(element => {
    element.addEventListener("click", () => {
      let track = element.dataset.track;
      songsid = document.querySelectorAll(`[data-track="${track}"] .aside-play-pause img`);
      playMusic(track);
    });
  });
}

async function section3PlaySong() {
  let songLst = document.querySelectorAll("#section3 ul li");

  songLst.forEach(element => {
    element.addEventListener("click", () => {
      let track = element.dataset.track;
      songsid = document.querySelectorAll(`[data-track="${track}"] .aside-play-pause img`);
      playMusic(track);
    });
  });
}

async function musicPlayer() {
  let playButton = document.querySelector("#play-button");

  currentAudio.addEventListener("play", () => {
    playButton.src = "Resourse/image/pause.svg";
    songsid.forEach((e) => {
      e.src = "Resourse/image/pause.svg";
    });
  });

  currentAudio.addEventListener("pause", () => {
    playButton.src = "Resourse/image/play.svg";
    songsid.forEach((e) => {
      e.src = "Resourse/image/play.svg";
    });
  });

  playButton.addEventListener("click", () => {
    playMusic(currentTrack);
  });
}

function formatSeconds(seconds) {
  const totalSeconds = Math.floor(seconds);

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  const formattedMins = mins.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');

  return `${formattedMins}:${formattedSecs}`;
}

async function timeUpdate() {
  let timer = document.querySelector("#timer");
  currentAudio.load();
  currentAudio.addEventListener('loadedmetadata', () => {
    if (!isNaN(currentAudio.duration)) {
      timer.innerHTML = `${formatSeconds(currentAudio.currentTime)} / ${formatSeconds(currentAudio.duration)}`;
    } else {
      timer.innerHTML = "00:00 / 00:00"
    }
  });
  // console.log(currentAudio.duration != NaN);
  currentAudio.addEventListener("timeupdate", () => {
    if (!isNaN(currentAudio.duration)) {
      timer.innerHTML = `${formatSeconds(currentAudio.currentTime)} / ${formatSeconds(currentAudio.duration)}`;
      let x = (currentAudio.currentTime / currentAudio.duration) * 100;
      sikBarCircle.style.left = x + "%";
      sikBarPlayed.style.width = x + "%";
    } else {
      timer.innerHTML = "00:00 / 00:00"
    }
  });
}

async function sikBarUpdate() {
  sikBar.addEventListener("click", (e) => {
    // let y = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    const rect = sikBar.getBoundingClientRect();
    let y = ((e.clientX - rect.left) / rect.width) * 100;
    y = Math.max(0, Math.min(100, y));

    sikBarCircle.style.left = y + "%";
    sikBarPlayed.style.width = y + "%";

    if (!isNaN(currentAudio.duration)) {
      currentAudio.currentTime = (currentAudio.duration * y) / 100;
    }
  });
}

async function volumeContolor() {
  let volumeIcone = document.querySelector("#volume-icon");
  let volumeSlider = document.querySelector("#volume-slider");
  let currentVolume = 0.5;
  currentAudio.volume = 0.5;

  volumeIcone.addEventListener("click", () => {
    if (volumeIcone.getAttribute("src") === "Resourse/image/volume.svg") {
      volumeIcone.setAttribute("src", "Resourse/image/mute.svg");
      currentAudio.volume = 0;
      volumeSlider.value = 0;
    } else {
      volumeIcone.setAttribute("src", "Resourse/image/volume.svg");
      currentAudio.volume = currentVolume;
      volumeSlider.value = currentVolume * 100;
    }
  });

  volumeSlider.addEventListener("click", () => {
    currentAudio.volume = volumeSlider.value / 100;
    currentVolume = volumeSlider.value / 100;
  });

}

async function previousNext() {
  previous.addEventListener("click", () => {
    let songIndex = asideCurrentSongList.indexOf(currentAudio.src);
    if (songIndex > 0) {
      let track = asideCurrentSongList[songIndex - 1];
      songsid = document.querySelectorAll(`[data-track="${track}"] .aside-play-pause img`);
      playMusic(track);
    }
  });

  next.addEventListener("click", () => {
    let songIndex = asideCurrentSongList.indexOf(currentAudio.src);
    if (songIndex < asideCurrentSongList.length - 1) {
      let track = asideCurrentSongList[songIndex + 1];
      songsid = document.querySelectorAll(`[data-track="${track}"] .aside-play-pause img`);
      playMusic(track);
    }
  });
}

async function arrowBTNControl(params) {
  let mainsonglist = document.querySelector("#main-playlist-area")
  let arrowBtn = document.querySelector("#arrowBtn")
  arrowBtn.addEventListener("click", () => {
    mainsonglist.classList.toggle("down-arrow");
    arrowBtn.classList.toggle("switch");
  })
}

function asideManage() {
  let myAside = document.querySelector("aside");
  let myPlushSVG = document.querySelector("#myPlushSVG");
  let myHambarger = document.querySelector("#hambarger");
  myPlushSVG.addEventListener("click", () => {
    myAside.classList.toggle("hambargershow")
    myPlushSVG.classList.toggle("cross-plush");
  })
  myHambarger.addEventListener("click", () => {
    myAside.classList.toggle("hambargershow")
    myPlushSVG.classList.toggle("cross-plush");
  })
}



async function main() {
  // songList = await fetchAudioFiles();

  songList = ["Resourse/audio/Alan%20Walker%20-%20Alone%20(Sad%20Commute).mp3",
    "Resourse/audio/Alan%20Walker%20-%20Darkside%20(Commute).mp3",
    "Resourse/audio/Alan%20Walker%20-%20Faded%20(Commute).mp3",
    "Resourse/audio/AURORA%20-%20Cure%20For%20Me%20(Relax).mp3",
    "Resourse/audio/AURORA%20-%20Runaway%20(Relax%20Commute%20Feel_good).mp3",
    "Resourse/audio/Billie%20Eilish%20-%20A%20SILENT%20VOICE%20(Sad).mp3",
    "Resourse/audio/Billie%20Eilish%20-%20Ocean%20Eyes%20(Commute%20Feel_good%20Romantice).mp3",
    "Resourse/audio/Coldplay%20-%20Hymn%20For%20The%20Weekend%20(Happy%20Feel_good).mp3",
    "Resourse/audio/Coldplay%20-%20Paradise%20(Commute%20Happy%20Feel_good).mp3",
    "Resourse/audio/Ember%20Island%20-%20Need%20You%20(Romantice).mp3",
    "Resourse/audio/Ember%20Island%20-%20Umbrella%20(Romantice%20Feel_good).mp3",
    "Resourse/audio/Natalie%20Taylor%20-%20Collapsed%20(Sad%20Relax).mp3",
    "Resourse/audio/Natalie%20Taylor%20-%20Surrender%20(Happy%20Relax).mp3",
    "Resourse/audio/Taylor%20Swift%20-%20Blank%20Space%20(Romantice%20Feel_good%20Happy%20Commute).mp3",
    "Resourse/audio/Taylor%20Swift%20-%20Love%20Story%20(Romantice).mp3",
    "Resourse/audio/Taylor%20Swift%20-%20Lover%20(Romantice).mp3"
  ]

  asideCurrentSongList = songList;
  // console.log(songList);
  let mySongList = await songNames(songList);

  asideSongListing(mySongList, songList);
  section1ContaintInsert();
  section2ContaintInsert();
  section3ContaintInsert(mySongList, songList);

  currentTrack = songList[0];
  currentAudio.src = currentTrack;

  songsid = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-play-pause img`);
  // console.log(songsid);

  songsiddd = document.querySelectorAll(`[data-track="${currentTrack}"] .aside-song-title p`);
  // console.log(songsiddd);

  if (songsiddd) {
    songInfo.innerHTML = `<h1>${songsiddd[0].innerText}</h1>`;
  }



  asideManage()
  arrowBTNControl();
  playSong();
  section3PlaySong();
  musicPlayer();
  timeUpdate();
  sikBarUpdate();
  volumeContolor();
  previousNext();
}



main()


