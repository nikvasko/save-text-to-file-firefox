var {Cc,Ci,Cu,components} = require("chrome"),
	preferenceManager = require("./preferenceManager"),
	tabsManager = require("./tabsManager"),
	notificationsManager = require("./notificationsManager"),
	localisationManager = require("./localisationManager");

exports.loadHomeDir = function() {
	
	return Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("Home", Ci.nsIFile);
}

exports.selectDir = function() {
	
	var nsIFilePicker = Ci.nsIFilePicker, 
		fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    
	fp.init(require("sdk/window/utils").getMostRecentBrowserWindow(), 
			localisationManager.loadString("browse_title"), 
			nsIFilePicker.modeGetFolder);

    var ret = fp.show();
    
    if (ret == nsIFilePicker.returnOK || ret == nsIFilePicker.returnReplace) {
    	console.log(fp.file.path);
    }
}

exports.createFileObject = function(saveDirectory, fileName) {
	
	var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	
	file.initWithPath(saveDirectory);
    file.append(fileName);
    
    return file;
}

exports.writeFile = function(file, selectedText){
	
	Cu.import("resource://gre/modules/NetUtil.jsm");
    Cu.import("resource://gre/modules/FileUtils.jsm");
    
    var ostream,
    	string = '\n\n',
    	currentTime = new Date(),
    	date = currentTime.getDate() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getFullYear(),
    	time = currentTime.getHours() + "-" + currentTime.getMinutes() + "-" + currentTime.getSeconds();
	
	try{        
        
    	if (file.exists() === false) {file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 420);}
        
        if (preferenceManager.load('saveMode') == 0){
        	ostream = FileUtils.openSafeFileOutputStream(file, FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE);
        	
        }else{
        	ostream = FileUtils.openFileOutputStream(file, FileUtils.MODE_WRONLY | FileUtils.MODE_APPEND);
        }
        

        var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        
        if (preferenceManager.load('lineSeparator')){
        	string += '----------------------------------------------------------------------\n\n';
        }
        
        if (preferenceManager.load('datestampInLine')){
        	string += date + '\n\n';
        }
        
        if (preferenceManager.load('timestampInLine')){
        	string += time + '\n\n';
        }
        
        if (preferenceManager.load('currentURL')){
        	string += tabsManager.loadURL() + '\n\n';
        }
        
        
        var istream = converter.convertToInputStream(string + selectedText);

        // The last argument (the callback) is optional.
        NetUtil.asyncCopy(istream, ostream, function(status) {
        	
        	if (!components.isSuccessCode(status)) {
        		
        		notificationsManager.sendMsg("saveError_id", file.path);
        		
        	}else{
        		
        		notificationsManager.sendMsg("saveComplete_id", file.path);
        	}
        });
	} catch (e) {
        return false;
    }
}