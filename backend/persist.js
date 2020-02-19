const fs = require("fs");
const objects = require("./objects.js");

const dataDir = __dirname.substring(0, __dirname.length - 7) + "data";

function deleteObject(obj) {
    if (!obj.type) return;
    if (!obj.id) return;
    fs.unlinkSync(dataDir + "/" + obj.type + "/" + obj.id + ".json");
}

function saveObject(obj) {
    if (!obj.type) return;
    if (!obj.id) return;
    fs.writeFileSync(
        dataDir + "/" + obj.type + "/" + obj.id + ".json",
        JSON.stringify(obj)
    );
}

function initData() {
    const folders = fs.readdirSync(dataDir, "utf-8");
    for (let className of folders) {
        const files = fs.readdirSync(dataDir + "/" + className, "utf-8");
        for (let fileName of files) {
            const file = fs.readFileSync(
                dataDir + "/" + className + "/" + fileName,
                "utf-8"
            );
            objects.createObject(JSON.parse(file));
        }
    }
}

module.exports.deleteObject = deleteObject;
module.exports.saveObject = saveObject;
module.exports.initData = initData;
