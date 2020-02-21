const getUUID = require("uuid/v4");

const persist = require("./persist.js");

var allObjects = {};
var allClasses = {};

class Base {
    constructor(json) {
        this.type = this.constructor.name;
        this.id = json.id;
    }

    toJSON() {
        let json = {};
        for (let f in this) {
            json[f] = this[f];
        }
        return json;
    }

    get(field) {
        if (this[field] === undefined) return null;
        return JSON.parse(JSON.stringify(this[field]));
    }

    set(field, value) {
        if (this[field] === undefined) return null;
        this[field] = value;
        return "success";
    }

    update(newJSON) {
        let result = "success";
        for (let field in newJSON) {
            const setRes = this.set(field, newJSON[field]);
            if (setRes !== "success") {
                result = setRes;
            }
        }
        return result;
    }
}

class Class extends Base {
    constructor(json) {
        super(json);
        this.pull = json.pull ? json.pull : ""; // Pull id
        this.category = json.category ? json.category : ""; // farm, antique
        this.weight = json.weight ? json.weight : 0;
        this.speed = json.speed ? json.speed : 0;
        this.hooks = json.hooks ? json.hooks : []; // Hook ids
    }
}

class Hook extends Base {
    constructor(json) {
        super(json);
        this.class = json.class ? json.class : ""; // Class id
        this.puller = json.puller ? json.puller : ""; // Puller id
        this.tractor = json.tractor ? json.tractor : ""; // Tractor id
        this.distance = json.distance ? json.distance : 0;
        this.position = json.position ? json.position : 0;
    }
}

class Pull extends Base {
    constructor(json) {
        super(json);
        this.season = json.season ? json.season : ""; // Season id
        this.location = json.location ? json.location : "";
        this.date = json.date ? json.date : "";
        this.hour = json.hour ? json.hour : "";
        this.minute = json.minute ? json.minute : "";
        this.meridiem = json.meridiem ? json.meridiem : "";
        this.notes = json.notes ? json.notes : "";
        this.blacktop = json.blacktop ? json.blacktop : false;
        this.classes = json.classes ? json.classes : []; // Class ids
    }
}

class Puller extends Base {
    constructor(json) {
        super(json);
        this.first_name = json.first_name ? json.first_name : "";
        this.last_name = json.last_name ? json.last_name : "";
        this.position = json.position ? json.position : ""; // president, secretary, etc
        this.member = json.member ? json.member : false;
    }
}

class Season extends Base {
    constructor(json) {
        super(json);
        this.year = json.year ? json.year : "";
        this.pulls = json.pulls ? json.pulls : []; // Pull ids
    }
}

class Tractor extends Base {
    constructor(json) {
        super(json);
        this.brand = json.brand ? json.brand : "";
        this.model = json.model ? json.model : "";
        this.name = json.name ? json.name : "";
    }
}

////////////////////////////////////////////////////////////////////////////////

function getObject(id) {
    if (!id) return { statusCode: 400, data: "id not defined" };
    const obj = allObjects[id];
    if (!obj) return { statusCode: 400, data: "obj not found" };
    return { statusCode: 200, data: obj.toJSON() };
}

function getObjectsByType(type) {
    if (!allClasses[type]) return { statusCode: 400, data: "type not valid" };
    let objects = {};
    for (let i in allClasses[type]) {
        objects[i] = allObjects[i].toJSON();
    }
    return { statusCode: 200, data: objects };
}

function getAllObjects() {
    return { statusCode: 200, data: allObjects };
}

////////////////////////////////////////////////////////////////////////////////

function createObject(json) {
    if (!json.id) json.id = getUUID();

    let obj = {};
    switch (json.type) {
        case "Class":
            obj = new Class(json);
            break;

        case "Hook":
            obj = new Hook(json);
            break;

        case "Pull":
            obj = new Pull(json);
            break;

        case "Puller":
            obj = new Puller(json);
            break;

        case "Season":
            obj = new Season(json);
            break;

        case "Tractor":
            obj = new Tractor(json);
            break;

        default:
            return { statusCode: 400, data: "object type not found" };
    }

    if (!allClasses[json.type]) allClasses[json.type] = new Set();
    allClasses[json.type].add(obj.id);
    allObjects[obj.id] = obj.type;
    persist.saveObject(obj);
    return { statusCode: 200, data: obj };
}

function updateObj(json) {
    if (!json.id) return { statusCode: 400, data: "id not defined" };
    const obj = allObjects[json.id];
    if (!obj) return { statusCode: 400, data: "obj not found" };

    const result = obj.update(json);
    if (result !== "success") return { statusCode: 400, data: result };
    persist.saveObject(obj);
    return { statusCode: 200, data: obj.toJSON() };
}

function deleteObject(id) {
    if (!id) return { statusCode: 400, data: "id not defined" };
    const obj = allObjects[id];
    if (!obj) return { statusCode: 400, data: "obj not found" };

    if (!allClasses[json.type]) allClasses[json.type] = new Set();
    allClasses[json.type].delete(id);
    if (!allClasses[json.type].size) delete allClasses[json.type];
    delete allObjects[id];
    persist.deleteObj(obj);
    return { statusCode: 200, data: "success" };
}

module.exports.getObject = getObject;
module.exports.getObjectsByType = getObjectsByType;
module.exports.getAllObjects = getAllObjects;

module.exports.createObject = createObject;
module.exports.updateObj = updateObj;
module.exports.deleteObject = deleteObject;

module.exports.allObjects = allObjects;
module.exports.allClasses = allClasses;
