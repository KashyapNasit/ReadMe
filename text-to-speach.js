// var synth = window.speechSynthesis;

// var pitch = document.querySelector("#pitch");
// var pitchValue = document.querySelector(".pitch-value");
// var rate = document.querySelector("#rate");
// var rateValue = document.querySelector(".rate-value");

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

// function speak(data) {
// 	if (synth.speaking) {
// 		console.error("speechSynthesis.speaking");
// 		return;
// 	}
// 	if (data !== "") {
// 		// if (content !== "") {
// 		var utterThis = new SpeechSynthesisUtterance(data);
// 		// var utterThis = new SpeechSynthesisUtterance(content);
// 		utterThis.onerror = function (event) {
// 			console.log(
// 				"An error has occurred with the speech synthesis: " +
// 					event.error
// 			);
// 		};
// 		utterThis.onend = function (event) {
// 			console.log("SpeechSynthesisUtterance.onend");
// 			playFrom(+_index + 1);
// 		};
// 		utterThis.onerror = function (event) {
// 			console.error("SpeechSynthesisUtterance.onerror");
// 		};
	
// 		utterThis.voice = "en-US";
// 		// voiceSelect.selectedOptions[0].getAttribute("data-name");
// 		utterThis.pitch = pitch.value;
// 		utterThis.rate = rate.value;
// 		synth.speak(utterThis);
// 	}
// }

function pause() {
	if (synth.paused) {
		console.error("speechSynthesis.pasued");
		return;
	}
	synth.pause();
}

pitch.onchange = function () {
	pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
	rateValue.textContent = rate.value;
};
