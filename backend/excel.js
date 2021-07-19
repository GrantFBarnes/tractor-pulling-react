const excel4node = require("excel4node");
const xlsx = require("xlsx");

////////////////////////////////////////////////////////////////////////////////
// Read xlsx

function checkTractor(tractor, brand) {
    if (tractor.includes(brand)) {
        let model = tractor.replace(brand, "").trim();
        if (!model) return null;

        switch (brand) {
            case "Allis Chalmers":
            case "Allis":
            case "AC":
                brand = "Allis Chalmers";
                if (model === "WD45") {
                    model = "WD 45";
                }
                break;

            case "Farmall":
                if (model === "SC") {
                    model = "Super C";
                } else if (model === "SH") {
                    model = "Super H";
                } else if (model === "SM") {
                    model = "Super M";
                } else if (model === "SMTA") {
                    model = "Super MTA";
                }
                break;

            case "John Deere":
            case "JD":
                brand = "John Deere";
                if (model === "3010D" || model === "3010 D") {
                    model = "3010";
                }
                break;

            case "MF":
            case "MH":
                brand = "Massey";
                break;

            case "MM":
                brand = "Minneapolis Moline";
                break;

            case "Oliver":
                if (model === "S88 Diesel") {
                    model = "Super 88 Diesel";
                } else if (model === "NSSS88D") {
                    model = "Super 88 Diesel";
                } else if (model === "88 (Diesel)") {
                    model = "88 Diesel";
                } else if (model === "S88") {
                    model = "Super 88";
                } else if (model === "S77") {
                    model = "Super 77";
                } else if (model === "70 Standard") {
                    model = "70";
                }
                break;

            default:
                break;
        }

        return { brand: brand, model: model };
    }
    return null;
}

function getTractor(tractor) {
    if (tractor === "WD" || tractor === "WD 45") {
        tractor = "Allis " + tractor;
    }
    for (let brand of [
        "Allis Chalmers",
        "Allis",
        "AC",
        "Case",
        "Cockshutt",
        "Coop",
        "Duetz",
        "Farmall",
        "Ford",
        "John Deere",
        "JD",
        "Massey",
        "MF",
        "MH",
        "Minneapolis Moline",
        "MM",
        "Oliver",
        "Rumley",
        "SAME",
        "Wards",
        "White"
    ]) {
        const json = checkTractor(tractor, brand);
        if (json) return json;
    }
    return null;
}

function getPuller(puller) {
    const p_split = puller.split(" ");
    if (p_split.length !== 2) return null;

    let json = {
        first_name: p_split[0],
        last_name: p_split[1]
    };

    switch (json.first_name) {
        case "Wally":
            if (json.last_name === "R") {
                json.last_name = "Reierson";
            }
            break;

        default:
            break;
    }

    switch (json.last_name) {
        case "Clifton":
        case "Cliffton":
            json.last_name = "Cliffton";
            if (json.first_name === "Dawn") {
                json.first_name = "Don";
            }
            break;

        case "Coener":
            json.last_name = "Coenen";
            break;

        case "Eggleston":
            json.last_name = "Eggleston";
            if (json.first_name === "Matt") {
                json.first_name = "Matthew";
            }
            break;

        case "Ganshert":
        case "Ganchert":
        case "Granshert":
        case "Granchert":
            json.last_name = "Ganshert";
            break;

        case "Guthrie":
        case "Gurhrie":
        case "Guthire":
            json.last_name = "Guthrie";
            break;

        case "Granberg":
            json.last_name = "Granberg";
            if (json.first_name === "Luke") {
                json.first_name = "Lucas";
            }
            break;

        case "Goelbel":
            json.last_name = "Goebel";
            break;

        case "Humphry":
        case "Humphfry":
        case "Humphery":
            json.last_name = "Humphrey";
            break;

        case "Jenamann":
            json.last_name = "Jenamann";
            if (json.first_name === "Jeremey") {
                json.first_name = "Jeremy";
            }
            break;

        case "Kerl":
        case "Kerrl":
            json.last_name = "Kerl";
            if (json.first_name === "Ruber") {
                json.first_name = "Rubert";
            }
            break;

        case "Loeffelholz":
        case "Loffelholz":
            json.last_name = "Loeffelholz";
            if (json.first_name === "Charles") {
                json.first_name = "Charlie";
            }
            break;

        case "Mahony":
            json.last_name = "Mahoney";
            break;

        case "Maggesmen":
        case "Maggsmen":
        case "Maggsman":
        case "Magsamen":
        case "Magsaman":
        case "Magsmen":
            json.last_name = "Maggesmen";
            break;

        case "Olin":
            if (json.first_name === "Elizabeth") {
                json.first_name = "Beth";
            }
            break;

        case "Sindlar":
        case "Sindelar":
            json.last_name = "Sindlar";
            if (json.first_name === "Jeffrey") {
                json.first_name = "Jeff";
            }
            break;

        case "Seefeilt":
        case "Scoofield":
            json.last_name = "Seefeldt";
            break;

        case "Skogan":
        case "Skogen":
            json.last_name = "Skogan";
            if (json.first_name === "Kodie" || json.first_name === "Kody") {
                json.first_name = "Cody";
            }
            break;

        case "Tireney":
        case "Tierney":
            json.last_name = "Tierney";
            if (json.first_name === "Pat") {
                json.first_name = "Patrick";
            }
            break;

        case "Thilgin":
            json.last_name = "Thilgen";
            break;

        case "Tschudy":
        case "Tshudy":
        case "Tsudy":
            json.last_name = "Tschudy";
            break;

        case "Urban":
        case "Urben":
            json.last_name = "Urban";
            break;

        case "Webber":
        case "Weber":
            json.last_name = "Webber";
            break;

        case "Werner":
        case "Werren":
            json.last_name = "Werner";
            break;

        case "Weinger":
        case "Wehinger":
        case "Wehenger":
            json.last_name = "Weinger";
            if (json.first_name === "Richard") {
                json.first_name = "Dick";
            }
            break;

        case "Wikener":
        case "Wikner":
            json.last_name = "Wikener";
            break;

        case "Zoelick":
            json.last_name = "Zoellick";
            break;

        default:
            break;
    }

    return json;
}

function cleanUpRows(rows) {
    let newRows = [];
    let lastClass = { category: "", weight: 0, speed: 3 };
    for (let i in rows) {
        const row = rows[i];
        if (!row["Puller"]) {
            console.log("Missing Puller:");
            console.log(row);
            return null;
        }

        if (row["Class"]) {
            const c_split = row["Class"].split(" ");
            lastClass.weight = parseInt(c_split[0]);
            if (isNaN(lastClass.weight)) {
                console.log("Invalid Weight:");
                console.log(row);
                return null;
            }
            row["Class"] = row["Class"].replace(c_split[0], "").toLowerCase();

            if (row["Class"].includes("farm")) {
                lastClass.category = "Farm Stock";
                lastClass.speed = 3;
            } else if (row["Class"].includes("antique")) {
                lastClass.category = "Antique Modified";
                lastClass.speed = 4;
            } else {
                console.log("Invalid Class:");
                console.log(row);
                return null;
            }

            if (row["Class"].includes("6")) {
                lastClass.speed = 6;
            }
        }
        delete row["Class"];
        delete row["Pos"];

        let newRow = JSON.parse(JSON.stringify(lastClass));

        const puller = getPuller(row["Puller"]);
        if (!puller) {
            console.log("Invalid Puller:");
            console.log(row);
            return null;
        }
        newRow = { ...newRow, ...puller };

        const d_split = row.Distance.toString().split(".");
        const feet = parseInt(d_split[0]);
        const inches = d_split[1] ? parseInt(d_split[1]) : 0;
        newRow["distance"] = parseFloat((feet + inches / 12).toFixed(2));
        if (isNaN(newRow["distance"])) {
            console.log("Invalid Distance:");
            console.log(row);
            return null;
        }

        const tractor = getTractor(row["Tractor"]);
        if (!tractor) {
            console.log("Invalid Tractor:");
            console.log(row);
            return null;
        }
        newRow = { ...newRow, ...tractor };

        newRows.push(newRow);
    }

    return newRows;
}

function readColumns(cell_json) {
    // Get columns in sheet
    let columns = {};
    const header_regex = new RegExp("^[A-Z]+[2]$");
    for (let cell in cell_json) {
        if (!header_regex.test(cell)) continue;
        columns[cell.split(2)[0]] = cell_json[cell];
    }

    // create object with each row as key, and then each column in each row
    let json = {};
    for (let cell in cell_json) {
        const col = cell.split(/[0-9]/)[0];
        if (!columns[col]) continue;

        const row = cell.split(/[A-Z]+/)[1];
        if (parseInt(row) <= 2) continue;

        if (typeof cell_json[cell] === "string") {
            cell_json[cell] = cell_json[cell].trim();
        }

        if (!json[row]) json[row] = {};
        json[row][columns[col]] = cell_json[cell];
    }
    return Object.values(json);
}

function readExcel(binary) {
    let workbook = {};
    try {
        workbook = xlsx.read(binary, { type: "binary" });
    } catch (err) {
        return { statusCode: 400, data: "invalid file" };
    }

    let json = {};
    const date_regex = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
    for (let s in workbook.SheetNames) {
        const worksheet = workbook.Sheets[workbook.SheetNames[s]];

        let sheet = {};
        for (cell in worksheet) {
            if (cell[0] === "!") continue;
            if (worksheet[cell].v) sheet[cell] = worksheet[cell].v;
        }

        const a1 = sheet["A1"].split(" - ");
        if (a1.length !== 2) {
            return { statusCode: 400, data: "invalid title" };
        }
        json.date = a1[0];
        if (!date_regex.test(json.date)) {
            return { statusCode: 400, data: "invalid date" };
        }

        const location = a1[1].split(", ");
        if (location.length !== 2) {
            return { statusCode: 400, data: "invalid location" };
        }
        json.town = location[0];
        json.state = location[1];

        json.rows = cleanUpRows(readColumns(sheet));
        if (!json.rows) {
            return { statusCode: 400, data: "invalid rows" };
        }
        break;
    }

    return { statusCode: 200, data: json };
}

////////////////////////////////////////////////////////////////////////////////
// Create xlsx

function normalizeValue(value) {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (!value) return "-";
    if (Array.isArray(value)) return value.toString();
    if (typeof value !== "string") return JSON.stringify(value);
    return value;
}

function populateCell(wb, sheet, value, row, col, color, row2, col2) {
    value = normalizeValue(value);

    if (row2 && col2) {
        sheet.cell(row, col, row2, col2, true).string(value);
    } else {
        sheet.cell(row, col).string(value);
    }

    const styleJSON = { alignment: { horizontal: "center" } };
    if (color) {
        styleJSON.fill = {
            type: "pattern",
            patternType: "solid",
            fgColor: color
        };
    }
    sheet.cell(row, col).style(wb.createStyle(styleJSON));
}

function createClassSection(wb, sheet, data, startingRow) {
    let row = startingRow;
    populateCell(wb, sheet, data.name, row, 1, "#67e3e1");
    for (let c in data.hooks) {
        const hook = data.hooks[c];
        populateCell(wb, sheet, hook.position, row, 2);
        populateCell(wb, sheet, hook.puller, row, 3);
        populateCell(wb, sheet, hook.tractor, row, 4);
        populateCell(wb, sheet, hook.distance, row, 5);
        row++;
    }
    return row + 1;
}

function createExcel(json) {
    let wb = new excel4node.Workbook();
    let sheet = wb.addWorksheet(json.name);

    let row = 1;
    let col = 1;
    const headers = { Class: 22, Pos: 5, Puller: 20, Tractor: 20, Distance: 8 };
    const headerCount = Object.keys(headers).length;
    populateCell(wb, sheet, json.name, row, col, "#67e3e1", row, headerCount);
    row++;

    for (let header in headers) {
        populateCell(wb, sheet, header, row, col, "#b8b8b8");
        sheet.column(col).setWidth(headers[header]);
        col++;
    }
    row++;

    for (let c in json.classes) {
        row = createClassSection(wb, sheet, json.classes[c], row);
    }

    // writeToBuffer is a promise, caller must wait
    return wb.writeToBuffer();
}

////////////////////////////////////////////////////////////////////////////////

module.exports.readExcel = readExcel;
module.exports.createExcel = createExcel;
