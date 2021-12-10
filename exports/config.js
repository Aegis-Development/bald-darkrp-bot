const fs = require("fs");


exports.Config = {
    FilteredWords: [],
}

fs.readFile('filteredWords.json', (err, data) => {
    if(err) throw err;

    this.Config['FilteredWords'] = JSON.parse(data);
});