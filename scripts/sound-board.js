// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
	ref,
	child,
	getDatabase,
	push,
	update,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { firebaseConfig } from "./Map/firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));

const eventsRef = child(dbRef, `events/`);
const soundboxRef = child(dbRef, `soundbox/`);

const isLocal = window.location.hostname === "127.0.0.1" ? true : false;

const apiEndpoint = isLocal
	? "http://127.0.0.1:3000/api"
	: "https://smileycap-bot.herokuapp.com/api";

let validUser = false;

document.querySelectorAll("button.sfx").forEach(function (btn) {
	btn.addEventListener("click", function () {
		if (!validUser) return;

		const resource = this.getAttribute("data-resource");
		const volume = this.getAttribute("data-volume");
		const type = this.getAttribute("data-type");

		const obj = {
		    resource: resource,
		    sceneId: "AidansLoft",
		    type: type,
		    volume: parseFloat(volume),
		};
		push(eventsRef, obj);

		console.log("play sound");
		console.log(resource, volume);
	});
});

document.querySelectorAll("button.music").forEach(function (btn) {
	btn.addEventListener("click", function () {
		if (!validUser) return;

		const resource = this.getAttribute("data-resource");
		// const volume = this.getAttribute("data-volume");
		const type = this.getAttribute("data-type");

		const obj = {
		    resource: resource,
		    sceneId: "AidansLoft",
		    type: type,
		    // volume: parseFloat(volume),
		};
		push(eventsRef, obj);

		console.log("change music");

		update(soundboxRef, {
			music_resource: resource,
		});
	});
});

const volumeSlider = document.getElementById("volumeSlider");
const setVolumeButton = document.getElementById("setVolumeButton");

volumeSlider.addEventListener("input", function () {
	const volume = volumeSlider.value;
	setVolumeButton.innerHTML = `Set Volume to ${volume}%`;
});

setVolumeButton.addEventListener("click", function () {
	var volume = volumeSlider.value / 100;
	console.log("Volume set to: " + volume);

	const obj = {
		type: "music_volume",
		volume: parseFloat(volume),
	};

	push(eventsRef, obj);

	update(soundboxRef, {
		music_volume: parseFloat(volume),
	});
});

document.addEventListener("DOMContentLoaded", function () {
	const sign = prompt("Who Are you?");

	if (sign === "smileycap") {
		validUser = true;
	}
});
