var fs = require('fs');
const FILE_EXTENSION = "log";

function logFileExists(serverid){
    if(serverid === undefined || serverid === "undefined") serverid = "pms";
    var path = "content/storage/logs/" + serverid + "." + FILE_EXTENSION;
    return fs.existsSync(path);
}

function errorLogFileExists(){
    var path = "content/storage/logs/errors." + FILE_EXTENSION;
    return fs.existsSync(path);
}

function createLogFile(serverid){
    if(serverid === undefined || serverid === "undefined") serverid = "pms";
    var path = "content/storage/logs/" + serverid + "." + FILE_EXTENSION;
    fs.writeFileSync(path, "");
    return;
}

function createErrorLogFile(){
    var path = "content/storage/logs/errors." + FILE_EXTENSION;
    fs.writeFileSync(path, "");
    return;
}

function writeLog(serverid, author, content){
    if(serverid === undefined || serverid === "undefined") serverid = "pms";
    var path = "content/storage/logs/" + serverid + "." + FILE_EXTENSION;
    var content = "(" + getDate() + ") " + author + ": " + content + "\n";
    fs.appendFileSync(path, content);
}

function writeErrorLog(serverid, author, command, error){
    if(serverid === undefined || serverid === "undefined") serverid = "pms";
    var path = "content/storage/logs/errors." + FILE_EXTENSION;
    var content = "(" + getDate() + ") " + author + " (" + serverid + "), error caused by message: '" + command + "', error: " + error + "\n"
    fs.appendFileSync(path, content);
}

function writeFatalErrorLog(content){
    var path = "content/storage/logs/errors." + FILE_EXTENSION;
    var content = "(" + getDate() + ") Fatal error: " + content + "\n";
    fs.appendFileSync(path, content);
}

function getDate(){
    var date = new Date();
    var timestamp = "";
    timestamp += date.getFullYear();
    timestamp += "-";
    var month = date.getMonth() + 1;
    timestamp += (month.toString().length === 1 ? "0" + month : month);
    timestamp += "-";
    timestamp += (date.getDate().toString().length === 1 ? "0" + date.getDate() : date.getDate());
    timestamp += " ";
    timestamp += (date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours());
    timestamp += ":";
    timestamp += (date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes());
    timestamp += ":";
    timestamp += (date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds());
    return timestamp;
}

module.exports = {
    logMessage: function(serverid, author, content){
        serverid = serverid.toString();
        if(!logFileExists(serverid)){
            createLogFile(serverid);
        }
        writeLog(serverid, author, content);
    },
    logError: function(serverid, author, command, error){
        serverid = serverid.toString();
        if(!errorLogFileExists()){
            createErrorLogFile();
        }
        writeErrorLog(serverid, author, command, error);
    },
    logDirectError: function(content){
        if(!errorLogFileExists()){
            createErrorLogFile();
        }
        writeFatalErrorLog(content);
    }
};