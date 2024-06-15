// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
	ref,
	child,
	set,
	get,
	getDatabase,
	onValue,
	push,
	update,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import {
	getStorage,
	listAll,
	uploadBytesResumable,
	getDownloadURL,
	ref as ref_storage,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

import { firebaseConfig } from "./Map/firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const storage = getStorage(firebaseApp);

const eventsRef = child(dbRef, `events/`);
const soundboxRef = child(dbRef, `devices/soundbox/`);
const soundboxFilesRef = child(dbRef, `devices/soundbox/audioFiles/`);

const isLocal = window.location.hostname === "127.0.0.1" ? true : false;

const apiEndpoint = isLocal
	? "http://127.0.0.1:3000/api"
	: "https://smileycap-bot.herokuapp.com/api";

let validUser = false;

function addButtonListeners() {
	// ----- SFX -----
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
	// ----- VOICE -----
	document.querySelectorAll("button.voice").forEach(function (btn) {
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

	// ----- MUSIC -----
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
}

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
});

document.addEventListener("DOMContentLoaded", function () {
	// const sign = prompt("Who Are you?");

	// if (sign === "smileycap") {
	// 	validUser = true;
	// }
	validUser = true;
});

document.addEventListener("gesturestart", function (e) {
	e.preventDefault();
});

async function listAllAudioFiles() {
	const fileListElement = document.getElementById("fileList");

	console.log("get audio files");

	try {
		onValue(soundboxFilesRef, (snapshot) => {
			console.log("data?");
			fileListElement.innerHTML = "";
			snapshot.forEach((childSnapshot) => {
				const key = childSnapshot.key;
				const childData = childSnapshot.val();
				console.log(childData);

				const buttonItem = document.createElement("button");
				buttonItem.textContent = childData.label || childData.filename;

				buttonItem.setAttribute("data-resource", childData.filename);
				buttonItem.setAttribute("data-volume", 1.0);
				buttonItem.setAttribute("data-type", childData.type);
				buttonItem.classList.add(childData.type);

				fileListElement.appendChild(buttonItem);
			});

			console.log("add button listeners");
			addButtonListeners();
		});
	} catch (error) {
		console.error("Error listing files:", error);
	}
}

listAllAudioFiles();

// ------- SOUND UPLOADER -------

function uploadFile() {
	const fileInput = document.getElementById("fileInput");
	const fileType = document.getElementById("fileType").value;
	const fileLabel = document.getElementById("fileLabel").value;
	const file = fileInput.files[0];

	if (file) {
		const validFileTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
		if (!validFileTypes.includes(file.type)) {
			alert("Invalid file type. Please upload an audio file.");
			return;
		}

		const storageRef = ref_storage(storage, "audio/" + file.name);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
			},
			(error) => {
				// Handle unsuccessful uploads
				console.error("Upload failed:", error);
			},
			() => {
				// Handle successful uploads on complete
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);

					const key = file.name.split(".")[0];

					const soundfileObj = {
						filename: file.name,
						label: fileLabel || key,
						type: fileType,
					};

					const soundboxFileRef = child(dbRef, `devices/soundbox/audioFiles/${key}`);
					set(soundboxFileRef, soundfileObj)
						.then(() => {
							alert("File uploaded and database entry created successfully.");
						})
						.catch((error) => {
							console.error("Error creating database entry:", error);
						});
				});
			}
		);
	} else {
		alert("Please select a file to upload.");
	}
}

document.getElementById("UploadSoundButton").addEventListener("click", uploadFile);

// ----- TTS -----

document.getElementById("ttsForm").addEventListener("submit", async (event) => {
	event.preventDefault();

	const inputText = document.getElementById("inputText").value;
	const voiceName = document.getElementById("voiceName").value;
	const buttonLabel = document.getElementById("buttonLabel").value;

	const response = await fetch(`${apiEndpoint}/generate-tts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ inputText, voiceName, volume: 0.8, buttonLabel }),
	});

	if (response.ok) {
		console.log("Request sent successfully!");
	} else {
		console.log("Failed to send request");
	}
});
