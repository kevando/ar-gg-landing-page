---
permalink: /soundboard
layout: default
title: Soundboard
---

<style>
    button {
        font-size: 1.0em;
        padding: 0.7em;
        margin: 0.1em 0.5em;
    }

    body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
}

.container {
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 70%;
    /* display: flex; */
}
.content {
    display: flex;
    justify-content: center;
}

label {
    font-size: 1.2em;
    margin-right: 10px;
}

input[type="range"] {
    width: 300px;
    margin: 20px 0;
}

button {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}

button.music {
    background-color: #9b5ad7;
}
button.sfx {
    background-color: #0ac1e3;
}
button.voice {
    background-color: #20c846;
}

button:hover {
    background-color: #0056b3;
}
</style>



<div class="container">
    <h2>Sound Effects</h2>
    <div class="content">
        <button class="sfx voice" data-resource="james_achallengerhasenteredthewandduelarena.mp3" data-volume="0.9" data-type="voice">Wizard James</button>
        <button class="sfx voice" data-resource="joseph_achallengerhasenteredthewandduelarena.mp3" data-volume="0.9" data-type="voice">Wizard Joe</button>
        <button class="sfx" data-resource="simplelaser.wav" data-volume="0.9" data-type="sfx">Laser</button>
    </div>
</div>

<div class="container">
    <h2>Music Options</h2>
    <div class="content">
        <button class="music" data-type="music" data-resource="tetrinet.mp3" >Tetrinet</button>
        <button class="music" data-type="music" data-resource="floorbabalivingmaximumfantasy_audio_20231128T001137500Z.mp3" >Floor Baba</button>
    </div>
</div>

<div class="container">
    <label for="volumeSlider">Music Volume:</label>
    <input type="range" id="volumeSlider" min="0" max="100" value="50">
    <button id="setVolumeButton">Set Volume to 50%</button>
</div>

<script type="module" src="{{ site.baseurl }}/scripts/sound-board.js?cachedz=2"></script>
