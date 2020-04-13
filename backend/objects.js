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
            json[f] = this.get(f);
        }
        return json;
    }

    get(field) {
        if (this[field] === undefined) return null;
        if (this[field] instanceof Set) return [...this[field]];
        return JSON.parse(JSON.stringify(this[field]));
    }

    set(field, value) {
        if (this[field] === undefined) return null;
        if (this[field] instanceof Set) {
            if (Array.isArray(value)) {
                value = new Set(value);
            }
        }
        this[field] = value;
        return "success";
    }

    updateRef(method, field, ref_id, ref_field) {
        let thisRefType = "set";
        if (typeof this[field] === "string") {
            thisRefType = "string";
        }

        const refObj = allObjects[ref_id];
        if (method === "delete" || !refObj.id) {
            if (thisRefType === "string") {
                if (this[field] === ref_id) {
                    this[field] = "";
                }
            } else {
                this[field].delete(ref_id);
            }
        } else {
            let found = false;
            if (typeof refObj[ref_field] === "string") {
                found = refObj[ref_field] === this.id;
            } else {
                found = refObj[ref_field].has(this.id);
            }

            if (thisRefType === "string") {
                if (!this[field] && found) {
                    this[field] = ref_id;
                } else if (this[field] === ref_id && !found) {
                    this[field] = "";
                }
            } else if (found) {
                this[field].add(ref_id);
            } else {
                this[field].delete(ref_id);
            }
        }
    }

    changeMatters(objID, objType, method, fields) {
        return false;
    }

    updateReferences(objID, objType, method, fields) {}

    objectChange(objID, objType, method, fields) {
        if (this.changeMatters(objID, objType, method, fields)) {
            const startingJSON = this.toJSON();
            this.updateReferences(objID, objType, method, fields);
            this.validate();
            this.wasChanged(startingJSON);
        }
    }

    wasChanged(startingJSON) {
        const thisJSON = this.toJSON();

        let changes = {};
        for (let field in startingJSON) {
            let val1 = startingJSON[field];
            if (typeof startingJSON[field] !== "string") {
                val1 = JSON.stringify(val1);
            }
            let val2 = thisJSON[field];
            if (typeof thisJSON[field] !== "string") {
                val2 = JSON.stringify(val2);
            }
            if (val1 !== val2) {
                changes[field] = {
                    before: startingJSON[field],
                    after: thisJSON[field]
                };
            }
        }
        if (Object.keys(changes).length) {
            objectEmit(
                this.id,
                this.type,
                "update",
                new Set(Object.keys(changes))
            );
            persist.saveObj(this);
        }
    }

    validate() {}

    update(newJSON) {
        const startingJSON = this.toJSON();

        let result = "success";
        for (let field in newJSON) {
            const setRes = this.set(field, newJSON[field]);
            if (setRes !== "success") {
                result = setRes;
            }
        }
        this.validate();
        this.wasChanged(startingJSON);
        return result;
    }
}

class Location extends Base {
    constructor(json) {
        super(json);
        this.town = json.town ? json.town : "";
        this.state = json.state ? json.state : "";
        this.pulls = json.pulls ? new Set(json.pulls) : new Set(); // reference children Pull ids
    }

    updateReferences(objID, objType, method, fields) {
        let obj = {};
        switch (objType) {
            case "Pull":
                this.updateRef(method, "pulls", objID, "location");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        switch (objType) {
            case "Pull":
                if (!fields.size || fields.has("location")) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }
}

class Puller extends Base {
    constructor(json) {
        super(json);
        this.first_name = json.first_name ? json.first_name : "";
        this.last_name = json.last_name ? json.last_name : "";
        this.hooks = json.hooks ? new Set(json.hooks) : new Set(); // reference children Hook ids
    }

    updateReferences(objID, objType, method, fields) {
        let obj = {};
        switch (objType) {
            case "Hook":
                this.updateRef(method, "hooks", objID, "puller");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        switch (objType) {
            case "Hook":
                if (!fields.size || fields.has("puller")) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }
}

class Tractor extends Base {
    constructor(json) {
        super(json);
        this.brand = json.brand ? json.brand : "";
        this.model = json.model ? json.model : "";
        this.hooks = json.hooks ? new Set(json.hooks) : new Set(); // reference children Hook ids
    }

    updateReferences(objID, objType, method, fields) {
        let obj = {};
        switch (objType) {
            case "Hook":
                this.updateRef(method, "hooks", objID, "tractor");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        switch (objType) {
            case "Hook":
                if (!fields.size || fields.has("tractor")) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }
}

class Season extends Base {
    constructor(json) {
        super(json);
        this.year = json.year ? json.year : "";

        this.pulls = json.pulls ? new Set(json.pulls) : new Set(); // children Pull ids
    }

    updateReferences(objID, objType, method, fields) {
        let obj = {};
        switch (objType) {
            case "Pull":
                this.updateRef(method, "pulls", objID, "season");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        switch (objType) {
            case "Pull":
                if (!fields.size) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }
}

class Pull extends Base {
    constructor(json) {
        super(json);
        this.season = json.season ? json.season : ""; // parent Season id

        this.location = json.location ? json.location : ""; // reference Location id
        this.date = json.date ? json.date : "";

        this.classes = json.classes ? new Set(json.classes) : new Set(); // children Class ids
    }

    updateReferences(objID, objType, method, fields) {
        if (objID === this.location) {
            if (method === "delete") {
                this.location = "";
            }
        }

        let obj = {};
        switch (objType) {
            case "Class":
                this.updateRef(method, "classes", objID, "pull");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        if (objID === this.season) {
            if (method === "delete") {
                deleteObj(this.id);
                return false;
            }
        }

        if (objID === this.location) {
            if (method === "delete") {
                return true;
            }
        }

        switch (objType) {
            case "Class":
                if (!fields.size) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }
}

class Class extends Base {
    constructor(json) {
        super(json);
        this.pull = json.pull ? json.pull : ""; // parent Pull id

        this.category = json.category ? json.category : ""; // farm, antique
        this.weight = json.weight ? json.weight : 0;
        this.speed = json.speed ? json.speed : 3;

        this.hooks = json.hooks ? new Set(json.hooks) : new Set(); // children Hook ids
    }

    updateReferences(objID, objType, method, fields) {
        let obj = {};
        switch (objType) {
            case "Hook":
                this.updateRef(method, "hooks", objID, "class");
                break;

            default:
                break;
        }
    }

    changeMatters(objID, objType, method, fields) {
        if (objID === this.pull) {
            if (method === "delete") {
                deleteObj(this.id);
                return false;
            }
        }
        switch (objType) {
            case "Hook":
                if (!fields.size) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }

    validate() {
        this.weight = parseInt(this.weight);
        this.speed = parseInt(this.speed);

        if (this.category === "farm") {
            this.speed = 3;
        } else if (this.category === "antique") {
            if (this.speed === 3) {
                this.speed = 4;
            }
        }
    }
}

class Hook extends Base {
    constructor(json) {
        super(json);
        this.class = json.class ? json.class : ""; // parent Class id

        this.puller = json.puller ? json.puller : ""; // reference Puller id
        this.tractor = json.tractor ? json.tractor : ""; // reference Tractor id
        this.distance = json.distance ? json.distance : 0.0;
        this.position = json.position ? json.position : 0;
    }

    updateReferences(objID, objType, method, fields) {
        if (objID === this.puller) {
            if (method === "delete") {
                this.puller = "";
            }
        } else if (objID === this.tractor) {
            if (method === "delete") {
                this.tractor = "";
            }
        }
    }

    changeMatters(objID, objType, method, fields) {
        if (objID === this.class) {
            if (method === "delete") {
                deleteObj(this.id);
                return false;
            }
        }

        if (objID === this.puller || objID === this.tractor) {
            if (method === "delete") {
                return true;
            }
        }

        switch (objType) {
            case "Hook":
                if (!fields.size || fields.has("distance")) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }

    validate() {
        this.distance = parseFloat(this.distance);

        const parent = allObjects[this.class];
        if (parent) {
            let position = 1;
            for (let i of parent.hooks) {
                if (i === this.id) continue;
                const hook = allObjects[i];
                if (!hook) continue;
                if (hook.distance > this.distance) position++;
            }
            this.position = position;
        }
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

function objectEmit(objID, objType, method, fields) {
    if (!fields) fields = new Set();
    for (let id in allObjects) {
        allObjects[id].objectChange(objID, objType, method, fields);
    }
}

////////////////////////////////////////////////////////////////////////////////
function addNewObject(json) {
    let obj = {};
    switch (json.type) {
        case "Class":
            obj = new Class(json);
            break;

        case "Hook":
            obj = new Hook(json);
            break;

        case "Location":
            obj = new Location(json);
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
            return "type not valid";
    }

    if (!allClasses[json.type]) allClasses[json.type] = new Set();
    allClasses[json.type].add(obj.id);
    allObjects[obj.id] = obj;
    return "success";
}

function createObj(json) {
    if (!json.id) json.id = getUUID();

    const result = addNewObject(json);
    if (result !== "success") return { statusCode: 404, data: result };

    const obj = allObjects[json.id];
    persist.saveObj(obj);
    objectEmit(json.id, json.type, "create");
    return { statusCode: 200, data: obj };
}

function updateObj(json) {
    if (!json.id) return { statusCode: 400, data: "id not defined" };
    const obj = allObjects[json.id];
    if (!obj) return { statusCode: 400, data: "obj not found" };

    const result = obj.update(json);
    if (result !== "success") return { statusCode: 400, data: result };
    return { statusCode: 200, data: obj.toJSON() };
}

function deleteObj(id) {
    if (!id) return { statusCode: 400, data: "id not defined" };
    const obj = allObjects[id];
    if (!obj) return { statusCode: 400, data: "obj not found" };

    if (!allClasses[obj.type]) allClasses[obj.type] = new Set();
    allClasses[obj.type].delete(id);
    if (!allClasses[obj.type].size) delete allClasses[obj.type];
    delete allObjects[id];
    persist.deleteObj(obj);
    objectEmit(obj.id, obj.type, "delete");
    return { statusCode: 200, data: "success" };
}

module.exports.getObject = getObject;
module.exports.getObjectsByType = getObjectsByType;
module.exports.getAllObjects = getAllObjects;

module.exports.addNewObject = addNewObject;
module.exports.createObj = createObj;
module.exports.updateObj = updateObj;
module.exports.deleteObj = deleteObj;

module.exports.allObjects = allObjects;
module.exports.allClasses = allClasses;
