

function processText(text) {
	console.log(text);
	let content = text.split("\n");
	let final = [];
	for (let i = 0; i < content.length; ++i) {
		const s = content[i].trim();
		if (s.length > 0) {
			final.push(s);
		}
	}
	return final.join("<br>");
}

let content = "";
let chapters = []
let _index = 0;
function load() {
	content = "";
	let HTMLpages = [];
	this.book.loaded.spine
		.then((spine) => {
			spine.each((item) => {

				item.load(this.book.load.bind(this.book)).then((contents) => {
					HTMLpages.push(contents);
					const text = processText(extractContent(contents));
					content = content + "\n" + text;
				});
			});
		})
		.then(() => {
			// speechSynthesis.speak(new SpeechSynthesisUtterance("content"));
			// var inputTxt = document.querySelector(".txt");
			// inputTxt.innerHTML = content;
			const sentences = content.split(".");
			let i = 0;
			while (!synth.speaking && i < sentences.length) {
				const body = document.getElementById("book");
				const node = document.createElement("div");
				node.innerHTML = sentences[i];
				node.id = i;
				node.onclick = playFrom;
				body.appendChild(node);
				i++;
			}
			console.log(content);
		});
}
// function play() {
// 	speechSynthesis.play();
// }

var synth = window.speechSynthesis;

var inputForm = document.querySelector("form");
var inputTxt = document.querySelector(".txt");
var voiceSelect = document.querySelector("select");

var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");

var voices = [];

// function populateVoiceList() {
// 	voices = synth.getVoices().sort(function (a, b) {
// 		const aname = a.name.toUpperCase();
// 		const bname = b.name.toUpperCase();
// 		if (aname < bname) return -1;
// 		else if (aname == bname) return 0;
// 		else return +1;
// 	});
// 	var selectedIndex =
// 		voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
// 	voiceSelect.innerHTML = "";
// 	for (let i = 0; i < voices.length; i++) {
// 		var option = document.createElement("option");
// 		option.textContent = voices[i].name + " (" + voices[i].lang + ")";

// 		if (voices[i].default) {
// 			option.textContent += " -- DEFAULT";
// 		}

// 		option.setAttribute("data-lang", voices[i].lang);
// 		option.setAttribute("data-name", voices[i].name);
// 		voiceSelect.appendChild(option);
// 	}
// 	voiceSelect.selectedIndex = selectedIndex;
// }

// populateVoiceList();
// if (
// 	speechSynthesis.onvoiceschanged !== null ||
// 	speechSynthesis.onvoiceschanged !== undefined
// ) {
// 	speechSynthesis.onvoiceschanged = populateVoiceList;
// }

function play() {
	const sentences = content.split(".");
	let i = 0;
	while (!synth.speaking && i < sentences.length) {
		speak(sentences[i]);
		i++;
	}
}

function playFrom(event) {
	const index = event.target? event.target.id : event;
	console.log("Play form " + index);
	if (synth.speaking) {
		synth.cancel();
	}
	const sentences = content.split(".");
	let i = index;
	while (!synth.speaking && i < sentences.length) {
		_index = index;
		speak(sentences[i]);
		i++;
	}
}

function speak(data) {
	if (synth.speaking) {
		console.error("speechSynthesis.speaking");
		return;
	}
	if (data !== "") {
		// if (content !== "") {
		var utterThis = new SpeechSynthesisUtterance(data);
		// var utterThis = new SpeechSynthesisUtterance(content);
		utterThis.onerror = function (event) {
			console.log(
				"An error has occurred with the speech synthesis: " +
					event.error
			);
		};
		utterThis.onend = function (event) {
			console.log("SpeechSynthesisUtterance.onend");
			playFrom(+_index + 1);
		};
		utterThis.onerror = function (event) {
			console.error("SpeechSynthesisUtterance.onerror");
		};
		var selectedOption = "en-US";
		// voiceSelect.selectedOptions[0].getAttribute("data-name");
		for (let i = 0; i < voices.length; i++) {
			if (voices[i].name === selectedOption) {
				utterThis.voice = voices[i];
				break;
			}
		}
		utterThis.pitch = pitch.value;
		utterThis.rate = rate.value;
		synth.speak(utterThis);
	}
}

function pause() {
	if (synth.paused) {
		console.error("speechSynthesis.pasued");
		return;
	}
	synth.pause();
}

inputForm.onsubmit = function (event) {
	event.preventDefault();

	speak();

	inputTxt.blur();
};

pitch.onchange = function () {
	pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
	rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
	speak();
};
