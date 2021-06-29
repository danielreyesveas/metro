import "./index.scss";
import Tone from "./tone";

const tempoDisplay = document.getElementById("tempo");
const beatsList = document.getElementById("beats-list");

const decreaseBpmBtn = document.getElementById("decrease-bpm");
const increaseBpmBtn = document.getElementById("increase-bpm");

const bpmSlider = document.getElementById("bpm-slider");
const beatsSlider = document.getElementById("beats-slider");

const decreaseBeats = document.getElementById("decrease-beats");
const increaseBeats = document.getElementById("increase-beats");
const beats = document.getElementById("beats");

const startStopBtn = document.getElementById("start-stop");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

let bpm = 100;

let beatsPerMeasure = 4;
let count = 1;
let isPlaying = false;

Tone.Transport.bpm.value = bpm;
Tone.Transport.timeSignature = "4/4";
const synth = new Tone.Synth();
const gain = new Tone.Gain(0.2);
gain.toMaster();
synth.connect(gain);

Tone.Transport.scheduleRepeat(function (time) {
	const note = count === 1 ? "G6" : "C6";
	updateBeats();
	synth.triggerAttackRelease(note, "64n");
}, "4n");

function updateBeats() {
	const beatActive = beatsList.querySelector(".beat-active");
	beatActive && beatActive.classList.remove("beat-active");
	const beatCount = beatsList.querySelector(`li[data-beat="${count}"]`);
	beatCount && beatCount.classList.add("beat-active");

	if (count === beatsPerMeasure) {
		count = 1;
	} else {
		count++;
	}
}

decreaseBpmBtn.addEventListener("click", () => {
	if (bpm <= 20) return;
	bpm--;
	updateMetronome();
});

increaseBpmBtn.addEventListener("click", () => {
	if (bpm >= 280) return;
	bpm++;
	updateMetronome();
});

bpmSlider.addEventListener("change", ({ target: { value } }) => {
	bpm = Number(value);
	updateMetronome();
});

beatsSlider.addEventListener("change", ({ target: { value } }) => {
	beatsPerMeasure = Number(value);
	printBeats();
});

decreaseBeats.addEventListener("click", () => {
	if (beatsPerMeasure <= 2) return;
	beatsPerMeasure--;
	printBeats();
});

increaseBeats.addEventListener("click", () => {
	if (beatsPerMeasure >= 12) return;
	beatsPerMeasure++;
	printBeats();
});

function updateMetronome() {
	tempoDisplay.textContent = `${bpm} BPM`;
	bpmSlider.value = bpm;
	Tone.Transport.bpm.value = bpm;
}

startStopBtn.addEventListener("click", () => {
	count = 1;
	if (isPlaying) {
		Tone.Transport.pause();
		isPlaying = false;
		playIcon.style.display = "none";
		pauseIcon.style.display = "block";
	} else {
		Tone.Transport.start();
		isPlaying = true;
		playIcon.style.display = "block";
		pauseIcon.style.display = "none";
	}
});

function printBeats() {
	const currentBeats = beatsList.children.length;
	const beatsToAdd = beatsPerMeasure - currentBeats;

	if (beatsToAdd > 0) {
		const beatsMarkup = Array.from({ length: beatsToAdd }, (_, v) => {
			const current = v + 1;
			const beatNumber =
				beatsPerMeasure === beatsToAdd
					? current
					: currentBeats + current;

			return `<li data-beat="${beatNumber}"><span></span></li>`;
		}).join("");

		beatsList.insertAdjacentHTML("beforeend", beatsMarkup);
	} else {
		setTimeout(() => {
			for (let i of Array.from({ length: beatsToAdd * -1 })) {
				beatsList.lastElementChild.remove();
			}
		}, 100);
	}

	setTimeout(() => {
		beatsList.querySelectorAll("li").forEach((element, i) => {
			element.setAttribute(
				"style",
				`transform: rotateZ(${(360 / beatsPerMeasure) * i}deg)`
			);
		});
		beats.textContent = beatsPerMeasure;
		beatsSlider.value = beatsPerMeasure;
		count = 1;
	}, 100);
}

printBeats();
