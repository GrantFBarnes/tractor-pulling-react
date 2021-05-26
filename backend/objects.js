const getUUID = require("uuid/v4");

const excel = require("./excel.js");
const persist = require("./persist.js");

var allObjects = {};
var allTypes = {};

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

    display() {
        return "";
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
    }

    display() {
        return this.town + ", " + this.state;
    }
}

class Puller extends Base {
    constructor(json) {
        super(json);
        this.first_name = json.first_name ? json.first_name : "";
        this.last_name = json.last_name ? json.last_name : "";
    }

    display() {
        return this.first_name + " " + this.last_name;
    }
}

class Tractor extends Base {
    constructor(json) {
        super(json);
        this.brand = json.brand ? json.brand : "";
        this.model = json.model ? json.model : "";
    }

    display() {
        return this.brand + " " + this.model;
    }
}

class Season extends Base {
    constructor(json) {
        super(json);
        this.year = json.year ? json.year : "";
    }

    display() {
        return this.year;
    }
}

class Pull extends Base {
    constructor(json) {
        super(json);
        this.season = json.season ? json.season : ""; // parent Season id

        this.location = json.location ? json.location : ""; // reference Location id
        this.date = json.date ? json.date : "";
        this.youtube = json.youtube ? json.youtube : "";
    }

    display() {
        const location = allObjects[this.location];
        return (
            this.date +
            " - " +
            (location.id ? location.display() : "(No Location)")
        );
    }

    getExcelJSON() {
        let json = { name: this.display(), classes: [] };

        let classIDs = [];
        if (allTypes.Class) {
            for (let id of allTypes.Class) {
                const obj = allObjects[id];
                if (obj.pull !== this.id) continue;
                classIDs.push(id);
            }
        }

        classIDs = classIDs.sort(classSort);

        for (let i in classIDs) {
            const obj = allObjects[classIDs[i]];
            json.classes.push(obj.getExcelJSON());
        }

        return json;
    }

    updateReferences(objID, objType, method, fields) {
        if (objID === this.location) {
            if (method === "delete") {
                this.location = "";
            }
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

        return false;
    }
}

class Class extends Base {
    constructor(json) {
        super(json);
        this.pull = json.pull ? json.pull : ""; // parent Pull id

        this.category = json.category ? json.category : ""; // Farm Stock, Antique Modified
        this.weight = json.weight ? json.weight : 0;
        this.speed = json.speed ? json.speed : 3;

        this.hooks = json.hooks ? new Set(json.hooks) : new Set(); // children Hook ids
    }

    display() {
        let name = this.weight + " " + this.category;
        if (this.speed > 4) name += " (" + this.speed + ")";
        return name;
    }

    getExcelJSON() {
        let json = { name: this.display(), hooks: [] };

        const hookIDs = [...this.hooks].sort(hookSort);
        for (let i in hookIDs) {
            const obj = allObjects[hookIDs[i]];
            json.hooks.push(obj.getExcelJSON());
        }

        return json;
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

        if (this.category === "Farm Stock") {
            this.speed = 3;
        } else if (this.category === "Antique Modified") {
            if (this.speed !== 4 && this.speed !== 6) {
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

    getExcelJSON() {
        const puller = allObjects[this.puller];
        const tractor = allObjects[this.tractor];

        return {
            position: this.position,
            puller: puller.id ? puller.display() : "(No Puller)",
            tractor: tractor.id ? tractor.display() : "(No Tractor)",
            distance: this.distance
        };
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

        const parentClass = allObjects[this.class];
        if (parentClass) {
            let position = 1;
            for (let i of parentClass.hooks) {
                if (i === this.id) continue;
                const hook = allObjects[i];
                if (!hook) continue;
                if (hook.distance > this.distance) position++;
            }
            this.position = position;
        }
    }
}

function seasonSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    if (a.year < b.year) return 1;
    if (a.year > b.year) return -1;
    return 0;
}

function pullSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
}

function classSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    if (a.weight < b.weight) return -1;
    if (a.weight > b.weight) return 1;
    if (a.category < b.category) return 1;
    if (a.category > b.category) return -1;
    if (a.speed < b.speed) return -1;
    if (a.speed > b.speed) return 1;
    return 0;
}

function hookSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return 0;
}

function tractorSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    if (a.brand < b.brand) return -1;
    if (a.brand > b.brand) return 1;
    if (a.model < b.model) return -1;
    if (a.model > b.model) return 1;
    return 0;
}

function pullerSort(a, b) {
    a = allObjects[a];
    b = allObjects[b];
    if (a.last_name < b.last_name) return -1;
    if (a.last_name > b.last_name) return 1;
    if (a.first_name < b.first_name) return -1;
    if (a.first_name > b.first_name) return 1;
    return 0;
}

////////////////////////////////////////////////////////////////////////////////

function validateAll() {
    for (let id in allObjects) {
        const obj = allObjects[id];
        obj.validate();
        persist.saveObj(obj);

        let missFields = [];
        let emptyFields = [];
        switch (obj.type) {
            case "Tractor":
                missFields = ["brand", "model"];
                break;
            case "Puller":
                missFields = ["first_name", "last_name"];
                break;
            case "Location":
                missFields = ["town", "state"];
                break;
            case "Season":
                missFields = ["year"];
                break;
            case "Pull":
                missFields = ["date", "location"];
                break;
            case "Class":
                missFields = ["pull", "category", "weight"];
                emptyFields = ["hooks"];
                break;
            case "Hook":
                missFields = ["puller", "tractor", "distance", "position"];
                break;
            default:
                break;
        }

        for (let f of missFields) {
            if (!obj[f]) console.log(f, obj);
        }
        for (let f of emptyFields) {
            if (!obj[f] || !obj[f].size) console.log(f, obj);
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
    if (!allTypes[type]) return { statusCode: 400, data: "type not valid" };
    let objects = {};
    for (let id of allTypes[type]) {
        objects[id] = allObjects[id].toJSON();
    }
    return { statusCode: 200, data: objects };
}

function getAllObjects() {
    return { statusCode: 200, data: allObjects };
}

function getPullExcel(pull_id) {
    return new Promise(resolve => {
        if (!pull_id) {
            resolve({ statusCode: 400, data: "pull_id not provided" });
            return;
        }

        const pull = allObjects[pull_id];
        if (!pull) {
            resolve({ statusCode: 400, data: "pull_id not valid" });
            return;
        }

        excel.createExcel(pull.getExcelJSON()).then(buffer => {
            resolve({ statusCode: 200, data: buffer.toString("base64") });
            return;
        });
    });
}

function readPullExcel(json) {
    if (!json || !json.file_binary) {
        return { statusCode: 400, data: "body not valid" };
    }

    const readResult = excel.readExcel(json.file_binary);
    if (readResult.statusCode !== 200) {
        console.log(readResult);
        return readResult;
    }
    const data = readResult.data;

    const date = new Date(data.date);

    // Tell if season already exists
    let valid = false;
    for (let id of allTypes.Season) {
        const obj = allObjects[id];
        if (obj.year != date.getFullYear()) continue;
        data.season = obj.id;
        valid = true;
        break;
    }
    if (!valid) {
        console.log("Invalid Season (Must be created before)");
        console.log(date);
        return { statusCode: 400, data: "invalid season" };
    }

    // Tell if location already exists
    valid = false;
    for (let id of allTypes.Location) {
        const obj = allObjects[id];
        if (obj.town !== data.town) continue;
        if (obj.state !== data.state) continue;
        data.location = obj.id;
        delete data.town;
        delete data.state;
        valid = true;
        break;
    }
    if (!valid) {
        console.log("Invalid Location (Must be created before)");
        console.log(data.town, data.state);
        return { statusCode: 400, data: "invalid location" };
    }

    // Tell if pull already exists
    valid = false;
    for (let id of allTypes.Pull) {
        const obj = allObjects[id];
        if (obj.season !== data.season) continue;
        if (obj.location !== data.location) continue;
        if (obj.date != data.date) continue;
        data.pull = obj.id;
        valid = true;
        break;
    }
    if (!valid) {
        console.log("Invalid Pull (Must be created before)");
        return { statusCode: 400, data: "invalid pull" };
    }

    let newClasses = {};
    for (let i in data.rows) {
        const hook = data.rows[i];

        // Tell if tractor already exists
        valid = false;
        for (let id of allTypes.Tractor) {
            const obj = allObjects[id];
            if (obj.brand !== hook.brand) continue;
            if (obj.model !== hook.model) continue;
            data.rows[i].tractor = obj.id;
            delete data.rows[i].brand;
            delete data.rows[i].model;
            valid = true;
            break;
        }
        if (!valid) {
            console.log("Invalid Tractor (Must be created before)");
            console.log(hook.brand);
            console.log(hook.model);
            return { statusCode: 400, data: "invalid tractor" };
        }

        // Tell if puller already exists
        valid = false;
        for (let id of allTypes.Puller) {
            const obj = allObjects[id];
            if (obj.first_name !== hook.first_name) continue;
            if (obj.last_name !== hook.last_name) continue;
            data.rows[i].puller = obj.id;
            delete data.rows[i].first_name;
            delete data.rows[i].last_name;
            valid = true;
            break;
        }
        if (!valid) {
            console.log("Invalid Puller (Must be created before)");
            console.log(hook.first_name);
            console.log(hook.last_name);
            return { statusCode: 400, data: "invalid puller" };
        }

        const classKey = hook.weight + hook.category + hook.speed;
        if (!newClasses[classKey]) {
            newClasses[classKey] = {
                id: getUUID(),
                type: "Class",
                pull: data.pull,
                weight: hook.weight,
                category: hook.category,
                speed: hook.speed
            };
        }
    }

    for (let c in newClasses) {
        const newClass = newClasses[c];
        const createResult = createObj(newClass);
        if (createResult.statusCode !== 200) {
            console.log(createResult);
            return createResult;
        }
    }

    for (let i in data.rows) {
        const hook = data.rows[i];
        hook.type = "Hook";
        hook.class = newClasses[hook.weight + hook.category + hook.speed].id;
        delete hook.weight;
        delete hook.category;
        delete hook.speed;
        const createResult = createObj(hook);
        if (createResult.statusCode !== 200) {
            console.log(createResult);
            return createResult;
        }
    }

    return readResult;
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

    if (!allTypes[json.type]) allTypes[json.type] = new Set();
    allTypes[json.type].add(obj.id);
    allObjects[obj.id] = obj;
    return "success";
}

function createObj(json) {
    if (!json.id) json.id = getUUID();

    const result = addNewObject(json);
    if (result !== "success") return { statusCode: 404, data: result };

    const obj = allObjects[json.id];
    obj.validate();
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

    if (!allTypes[obj.type]) allTypes[obj.type] = new Set();
    allTypes[obj.type].delete(id);
    if (!allTypes[obj.type].size) delete allTypes[obj.type];
    delete allObjects[id];
    persist.deleteObj(obj);
    objectEmit(obj.id, obj.type, "delete");
    return { statusCode: 200, data: "success" };
}

module.exports.validateAll = validateAll;

module.exports.getObject = getObject;
module.exports.getObjectsByType = getObjectsByType;
module.exports.getAllObjects = getAllObjects;
module.exports.getPullExcel = getPullExcel;
module.exports.readPullExcel = readPullExcel;

module.exports.addNewObject = addNewObject;
module.exports.createObj = createObj;
module.exports.updateObj = updateObj;
module.exports.deleteObj = deleteObj;

module.exports.allObjects = allObjects;
module.exports.allTypes = allTypes;
