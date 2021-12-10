let types = {
    error: "[ERROR]",
    warning: "[WARNING]",
    info: "[INFO]"
}

const logTypes = Object.freeze({
    INFO: "[BaldBot - INFO]",
    WARN: "[Bald Bot - WARNING]",
    ERROR: "[Bald Bot - ERROR]"
});

exports.LogTypes = logTypes; 

exports.Log = function(type, log) {
    console.log(`${type} ${log}`);
}