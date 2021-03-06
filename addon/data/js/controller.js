var text;

window.addEventListener('click', function (event) {

	if (event.target.id.indexOf('pathToFile') === 0) {
		SaveTextToFile_Panel.selectDir();

	} else if (event.target.id.indexOf('saveButton') === 0) {
		SaveTextToFile_Panel.save();

	} else if (event.target.id.indexOf('cancelButton') === 0) {
		SaveTextToFile_Panel.cancel();
	}

	if (document.getElementById("saveMode").selectedIndex > 0) {
		document.getElementById("timestamp").disabled = true;
	} else {
		document.getElementById("timestamp").disabled = false;
	}

	document.getElementById("lineSeparatorText").disabled =
		(document.getElementById("lineSeparator").checked ? false : true);

	document.getElementById("previewArea").value =
		(document.getElementById("html").checked ? JSON.parse(text).html : JSON.parse(text).plain);

	document.getElementById("previewArea").style.visibility =
		(document.getElementById("preview").checked ? "visible" : "hidden");

}, false);

document.getElementById('hotkeyPref').onkeyup = function (event) {
	self.port.emit("updateHotkey", this.value);
};


// functions available to Panel
var SaveTextToFile_Panel = {

	selectDir: function () {
		self.port.emit("selectDir", '');
	},

	save: function () {

		// send path to file and file name back to addon code
		var selectedPrefs = JSON.stringify({
			fileName: document.getElementById("fileName").value,
			pathToFile: document.getElementById("pathToFile").value,
			format: document.getElementById("format").value,
			datestamp: document.getElementById("datestamp").checked,
			timestamp: document.getElementById("timestamp").checked,
			datestampInLine: document.getElementById("datestampInLine").checked,
			timestampInLine: document.getElementById("timestampInLine").checked,
			dateFormat: document.getElementById("dateFormat").value,
			lineSeparator: document.getElementById("lineSeparator").checked,
			lineSeparatorText: document.getElementById("lineSeparatorText").value,
			currentURL: document.getElementById("currentURL").checked,
			pagenameForFilename: document.getElementById("pagenameForFilename").checked,
			saveMode: document.getElementById("saveMode").value,
			confirmPanel: document.getElementById("confirmPanel").checked,
			html: document.getElementById("html").checked,
			showWidget: document.getElementById("showWidget").checked,
			showNotifications: document.getElementById("showNotifications").checked,
			preview: document.getElementById("preview").checked,
			text: document.getElementById("previewArea").value
		});

		self.port.emit("save", selectedPrefs);
	},

	cancel: function () {
		self.port.emit("cancel", '');
	}
};

// listen for preferences message from addon code and set values of Panel UI
self.port.on("prefs", function (prefs) {
	var parsedPrefs = JSON.parse(prefs);

	document.getElementById("fileName").value = parsedPrefs.fileName;
	document.getElementById("pathToFile").value = parsedPrefs.pathToFile;
	document.getElementById("format").value = parsedPrefs.format;
	document.getElementById("datestamp").checked = parsedPrefs.datestamp;
	document.getElementById("timestamp").checked = parsedPrefs.timestamp;
	document.getElementById("datestampInLine").checked = parsedPrefs.datestampInLine;
	document.getElementById("timestampInLine").checked = parsedPrefs.timestampInLine;
	document.getElementById("dateFormat").value = parsedPrefs.dateFormat;
	document.getElementById("lineSeparator").checked = parsedPrefs.lineSeparator;
	document.getElementById("lineSeparatorText").value = parsedPrefs.lineSeparatorText;
	document.getElementById("currentURL").checked = parsedPrefs.currentURL;
	document.getElementById("pagenameForFilename").checked = parsedPrefs.pagenameForFilename;
	document.getElementById("saveMode").value = parsedPrefs.saveMode;
	document.getElementById("confirmPanel").checked = parsedPrefs.confirmPanel;
	document.getElementById("html").checked = parsedPrefs.html;
	document.getElementById("showWidget").checked = parsedPrefs.showWidget;
	document.getElementById("showNotifications").checked = parsedPrefs.showNotifications;
	document.getElementById("preview").checked = parsedPrefs.preview;
	document.getElementById("hotkeyPref").value = parsedPrefs.hotkey;
	text = parsedPrefs.text;

	if (parsedPrefs.saveMode > 0) {
		document.getElementById("timestamp").disabled = true;
	} else {
		document.getElementById("timestamp").disabled = false;
	}

	document.getElementById("lineSeparatorText").disabled =
		(document.getElementById("lineSeparator").checked ? false : true);

	document.getElementById("previewArea").value =
		(parsedPrefs.html ? JSON.parse(text).html : JSON.parse(text).plain);

	document.getElementById("previewArea").style.visibility =
		(document.getElementById("preview").checked ? "visible" : "hidden");
});

self.port.on('hotkeyStatus', function (value) {
	if (value === true) {
		document.getElementById('hotkeyPref').className = 'green';
	} else {
		document.getElementById('hotkeyPref').className = 'red';
	}
});
