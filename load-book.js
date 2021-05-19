var $viewer = document.getElementById("viewer");
var $next = document.getElementById("next");
var $prev = document.getElementById("prev");
var currentSection;
var currentSectionIndex = 6;

var book = ePub(
	"hp.epub"
);

function extractContent(s) {
	// console.log("Extracted called");
	let span = document.createElement("span");
	span.appendChild(s);
	return span.textContent || span.innerText;
}

function onTextClick(event){
    let id = event.target.id || event.target.parentNode.id;
    let element = document.getElementById(id);
    console.log(extractContent(element.cloneNode(true)));
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
                for(let i=0;i< listOfP.length;++i){
                    listOfP[i].onclick = onTextClick;
                }

                const listOfSpan = document.getElementsByTagName("span");
                for(let i=0;i< listOfSpan.length;++i){
                    listOfSpan[i].onclick = onTextClick;
                }
            });
		}
		return section;
	}
});
