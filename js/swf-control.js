//F. Permadi May 2000
function getFlashMovieObject(movieName) {
	if(window.document[movieName]) {
		return window.document[movieName];
	}
	if(navigator.appName.indexOf("Microsoft Internet")==-1) {
		if(document.embeds && document.embeds[movieName]) return document.embeds[movieName]; 
	}
	else {//if(navigator.appName.indexOf("Microsoft Internet")!=-1)
		return document.getElementById(movieName);
	}
}