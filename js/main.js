$(document).ready(function(){ // For tooltip
	$('[data-toggle="tooltip"]').tooltip();
});

/**
 * Switch every div with the attribute  w3-include-html="pagename" for this page HTML code.
 * Call this function once at document end.
**/	
function w3IncludeHTML() {
	var z, i, a, file, xhttp;
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		if (z[i].getAttribute("w3-include-html")) {
			a = z[i].cloneNode(false);
			file = z[i].getAttribute("w3-include-html");
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					a.removeAttribute("w3-include-html");
					a.innerHTML = xhttp.responseText;
					z[i].parentNode.replaceChild(a, z[i]);
					w3IncludeHTML();
				}
			}      
			xhttp.open("GET", file, true);
			xhttp.send();
			return;
		}
	}
}

/**
 * Play one of four animation types: slide, fade, move from random point and Scale from left top.
**/	
function playAnimation(){
	var CONTAINER_CLASS = ".site-main-box";
	
	function slide(){
		$(CONTAINER_CLASS).slideUp(1).slideDown(2500);
	}
	function fade(){
		$(CONTAINER_CLASS).fadeOut(1).fadeIn(3000);
	}
	function move(direction){
		var animation;
		switch (direction) {
			case 0:	animation = {top: '-3000px'};	break;
			case 1:	animation = {left: '2000px'};	break;
			case 2:	animation = {left: '-2000px'};	break;
			case 3:	animation = {top: '2000px'};	break;
		}
		$(CONTAINER_CLASS).animate(animation, 1).animate({top: '0px', left: '0px'}, 2000);
	}
	function scale(){
		$(CONTAINER_CLASS).animate({
			height: 0.01,
			width: 0.01
		}, 1).animate({
			height: ($(this).height()),
			width: ($(this).width())
		}, 2000);
	}
	
	var randomIndex =  Math.floor(4 * Math.random());
	switch (randomIndex) {
		case 0:	slide();								break;
		case 1:	fade();									break;
		case 2: move(Math.floor(4 * Math.random()));	break;
		case 3: scale();								break;
	}
}