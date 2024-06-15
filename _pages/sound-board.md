---
permalink: /soundboard
layout: soundboard
title: Soundboard
---

<style>

html {
    touch-action: manipulation; /* Disables double-tap zoom */
}
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
    /* height: 98vh; */
    margin: 0;
    background-color: #f0f0f0;
    /* max-height:98vh; */
    /* overflow: hidden; */
}

.container {
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 70%;
    margin: 1em 0;
    /* display: flex; */
}
.content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.content.buttons {
    justify-content: space-between;
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
    margin: 5px 5px;
}

button.music {
    background-color: #9b5ad7;
}
button.music:hover {
    background-color: #753ea7;
}
button.sfx {
    background-color: #0ac1e3;
}
button.sfx:hover {
    background-color: #17a5bf;
}
button.voice {
    background-color: #20c846;
}
button.voice:hover {
    background-color: #1d9f3a;
}
button:hover {
    background-color: #0056b3;
}
li {
    text-align: left;
}

</style>

<div class="container">
    <h2>Sound Effects</h2>
    <div class="content buttons" id="SoundEffectsButtons">
    </div>
</div>

<div class="container">
    <h2>Announcements</h2>
    <div class="content buttons" id="VoiceButtons">
    </div>
</div>

<div class="container">
    <h2>Music Options</h2>
    <div class="content buttons" id="MusicButtons">
    </div>
</div>

<div class="container">
    <h2>Music Volume</h2>
    <div class="content">
        <input type="range" id="volumeSlider" min="0" max="100" value="50">
        <button id="setVolumeButton">Set Volume to 50%</button>
    </div>
</div>

<div class="container">
    <h2>All Sounds</h2>
    <div class="content" id="fileList">
    </div>
</div>


<div class="container">
    <h2>Text To Speech</h2>
    <div class="content">
        <form id="ttsForm">
            <label for="inputText">Input Text:</label>
            <textarea id="inputText" name="inputText" rows="4" cols="50" required>hello</textarea><br><br>
            <label for="voiceName">Voice Name:</label>
            <input type="text" id="voiceName" name="voiceName" required value="Gigi"><br><br>
            <label for="buttonLabel">Button Label:</label>
            <input type="text" id="buttonLabel" name="buttonLabel" required value=""><br><br>
            <button type="submit">Send to Soundbox</button>
        </form>
    </div>
</div>

<div class="container">
    <h2>Sound Upload</h2>
    <div class="content">
    <input type="file" id="fileInput" accept="audio/*">
    <input type="text" id="fileLabel" placeholder="label" style="margin-right: 10px">
    <select id="fileType">
        <option value="sfx">SFX</option>
        <option value="music">Music</option>
        <option value="voice">Voice</option>
    </select>
    <button id="UploadSoundButton">Upload</button>
    </div>
</div>


<script type="module" src="{{ site.baseurl }}/scripts/sound-board.js?cachedz=4"></script>
