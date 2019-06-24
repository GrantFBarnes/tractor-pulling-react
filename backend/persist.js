const fs = require("fs");
const obj = require("./objects.js");

const dataDir = __dirname.substring(0, __dirname.length - 7) + "data";

function saveData() {
    var classes = {
        Class: obj.allClasses,
        Hook: obj.allHooks,
        Pull: obj.allPulls,
        Puller: obj.allPullers,
        Tractor: obj.allTractors
    };
    for (let c in classes) {
        for (let id in classes[c]) {
            fs.writeFileSync(dataDir + "/" + c + "/" + id + ".json", JSON.stringify(classes[c][id]));
        }
    }
}

function initData() {
    var folders = fs.readdirSync(dataDir, "utf-8");
    for (let className of folders) {
        var files = fs.readdirSync(dataDir + "/" + className, "utf-8");
        for (let fileName of files) {
            var file = fs.readFileSync(dataDir + "/" + className + "/" + fileName, "utf-8");
            obj.createObject(JSON.parse(file));
        }
    }
}

module.exports.saveData = saveData;
module.exports.initData = initData;
