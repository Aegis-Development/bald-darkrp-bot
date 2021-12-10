let types = {
    error: "[ERROR]",
    warning: "[WARNING]",
    info: "[INFO]"
}

exports.Log = function(type, log) {
    if(!types[type]) {
        console.log(`${types['info']} ${log}`);
    } else {
        console.log(`${types[type]} ${log}`);
    }
}