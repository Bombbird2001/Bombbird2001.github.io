console.log('hi');
if (typeof(Storage) !== "undefined") {
		} else {
			alert("Sorry, your browser does not support Web Storage. \nYour game will not be saved upon exit.");
		}
		function alertFunction() {
			alert("1 byte per char " + (1024 * 1024 * 5 - escape(encodeURIComponent(JSON.stringify(localStorage))).length) + "\n2 bytes per char: " + (512 * 1024 * 5 - escape(encodeURIComponent(JSON.stringify(localStorage))).length));
		}