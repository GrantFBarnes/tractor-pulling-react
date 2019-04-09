const getUUID = require("uuid/v4");

const constants = require("./constants.js");

var allClasses = {};
var allHooks = {};
var allPulls = {};
var allPullers = {};
var allTractors = {};

class Base {
    constructor(json) {
        this.type = this.constructor.name;
        this.id = json.id;
    }

    toJSON() {
        var json = {};
        for (var f in this) {
            json[f] = this[f];
        }
        return json;
    }

    get(field) {
        if (Object.keys(this).indexOf(field) >= 0) {
            return JSON.parse(JSON.stringify(this[field]));
        }
        return null;
    }

    set(field, value) {
        if (Object.keys(this).indexOf(field) >= 0) {
            this[field] = value;
        }
    }
}

class Class extends Base {
    constructor(json) {
        super(json);
        this.pull = json.pull ? json.pull : ""; // Pull id
        this.group = json.group ? json.group : ""; // farm, antique
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
        this.cost = json.cost ? json.cost : 0;
        this.place = json.place ? json.place : 0;
        this.prize = json.prize ? json.prize : 0;
    }
}

class Pull extends Base {
    constructor(json) {
        super(json);
        this.location = json.location ? json.location : "";
        this.date_time = json.date_time ? json.date_time : "";
        this.notes = json.notes ? json.notes : "";
        this.blacktop = json.blacktop ? json.blacktop : false;
        this.classes = json.classes ? json.classes : []; // Class ids

        this.getDateInfo();
    }

    getDateInfo() {
        var date = new Date(this.date_time);
        this.day = constants.days[date.getDay()];
        this.month = constants.months[date.getMonth()];
        this.year = date.getFullYear();
        this.date = date.getDate();
        this.time = date.toLocaleTimeString();
    }
}

class Puller extends Base {
    constructor(json) {
        super(json);
        this.first_name = json.first_name ? json.first_name : "";
        this.last_name = json.last_name ? json.last_name : "";
        this.role = json.role ? json.role : ""; // participant, president, etc
        this.member = json.member ? json.member : false;
    }
}

class Tractor extends Base {
    constructor(json) {
        super(json);
        this.name = json.name ? json.name : "";
        this.brand = json.brand ? json.brand : "";
        this.model = json.model ? json.model : "";
    }
}

function createObject(json) {
    if (!json.id) {
        json.id = getUUID();
    }

    if (json.type == "Class") {
        allClasses[json.id] = new Class(json);
    } else if (json.type == "Hook") {
        allHooks[json.id] = new Hook(json);
    } else if (json.type == "Pull") {
        allPulls[json.id] = new Pull(json);
    } else if (json.type == "Puller") {
        allPullers[json.id] = new Puller(json);
    } else if (json.type == "Tractor") {
        allTractors[json.id] = new Tractor(json);
    }
}

module.exports.createObject = createObject;

module.exports.allClasses = allClasses;
module.exports.allHooks = allHooks;
module.exports.allPulls = allPulls;
module.exports.allPullers = allPullers;
module.exports.allTractors = allTractors;
