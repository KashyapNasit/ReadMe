const $viewer = document.getElementById("viewer");
const $next = document.getElementById("next");
const $prev = document.getElementById("prev");
let currentSection;
let currentSectionIndex = 0;

let currentPlaying = "p0";

const synth = window.speechSynthesis;
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

var book = ePub("hp.epub");

function extractContent(s) {
	let span = document.createElement("span");
	span.appendChild(s);
	return span.textContent || span.innerText;
}

function play(id) {
	let element = document.getElementById(id);
	const text = extractContent(element.cloneNode(true));
	console.log(text);
	speak(text);
}

function onTextClick(event) {
	synth.cancel();
	let id = event.target.id || event.target.parentNode.id;
	currentPlaying = id;
	play(currentPlaying);
}

book.loaded.navigation.then(function (toc) {
	var $select = document.getElementById("toc"),
		docfrag = document.createDocumentFragment();

	toc.forEach(function (chapter) {
		var option = document.createElement("option");
		option.textContent = chapter.label;
		option.ref = chapter.href;

		docfrag.appendChild(option);
	});

	$select.appendChild(docfrag);

	$select.onchange = function () {
		var index = $select.selectedIndex,
			url = $select.options[index].ref;
		display(url);
		return false;
	};

	book.opened.then(function () {
		display(currentSectionIndex);
	});

	$next.addEventListener(
		"click",
		function () {
			var displayed = display(currentSectionIndex + 1);
			if (displayed) currentSectionIndex++;
		},
		false
	);

	$prev.addEventListener(
		"click",
		function () {
			var displayed = display(currentSectionIndex - 1);
			if (displayed) currentSectionIndex--;
		},
		false
	);

	function display(item) {
		var section = book.spine.get(item);
		if (section) {
			currentSection = section;
			section.load(this.book.load.bind(this.book)).then((contents) => {
				$viewer.innerHTML = "";
				$viewer.appendChild(contents.children[1]);
				const listOfP = document.getElementsByTagName("p");
				for (let i = 0; i < listOfP.length; ++i) {
					listOfP[i].onclick = onTextClick;
				}

				const listOfSpan = document.getElementsByTagName("span");
				for (let i = 0; i < listOfSpan.length; ++i) {
					listOfSpan[i].onclick = onTextClick;
				}
			});
		}
		return section;
	}
});

function speak(data) {
	if (synth.speaking) {
		console.error("speechSynthesis.speaking");
		return;
	}
    if (synth.paused) {
		console.error("speechSynthesis.paused");
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
	
		utterThis.onerror = function (event) {
			console.error("SpeechSynthesisUtterance.onerror");
		};

		// utterThis.voice = "en-US";
		// voiceSelect.selectedOptions[0].getAttribute("data-name");
		utterThis.pitch = pitch.value;
		utterThis.rate = rate.value;
		utterThis.onend = () => {
            console.log("SpeechSynthesisUtterance.onend");
            let index = currentPlaying.replace("p","");
            index = +index + 1;
			currentPlaying = "p"+index;
            console.log(currentPlaying);
            if (!synth.paused && !synth.speaking){
			    play(currentPlaying);
            }
		};
		synth.speak(utterThis);
	}
}

function toggleAudio(){
    if (synth.speaking) {
		synth.pause();
	} else if (synth.paused){
        synth.resume();
    }
}

function stopAudio(){
    synth.cancel();
}