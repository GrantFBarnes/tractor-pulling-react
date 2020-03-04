const fs = require("fs");
const objects = require("./objects.js");

const dataDir = __dirname.substring(0, __dirname.length - 7) + "data";

function deleteObj(obj) {
    if (!obj.type) return;
    if (!obj.id) return;
    fs.unlinkSync(dataDir + "/" + obj.type + "/" + obj.id + ".json");
}

function saveObj(obj) {
    if (!obj.type) return;
    if (!obj.id) return;
    fs.writeFileSync(
        dataDir + "/" + obj.type + "/" + obj.id + ".json",
        JSON.stringify(obj.toJSON())
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
            objects.createObj(JSON.parse(file));
        }
    }
}

module.exports.deleteObj = deleteObj;
module.exports.saveObj = saveObj;
module.exports.initData = initData;
