const excel4node = require("excel4node");
const xlsx = require("xlsx");

////////////////////////////////////////////////////////////////////////////////
// Read xlsx

function checkTractor(tractor, brand) {
    if (tractor.includes(brand)) {
        const model = tractor.replace(brand, "").trim();
        if (!model) return null;
        return { brand: brand, model: model };
    }
    return null;
}

function getTractor(tractor) {
    for (let brand of [
        "Allis Chalmers",
        "Case",
        "Cockshutt",
        "Coop",
        "Duetz",
        "Farmall",
        "Ford",
        "John Deere",
        "Massey",
        "Minneapolis Moline",
        "Oliver",
        "Rumley",
        "SAME",
        "Wards"
    ]) {
        const json = checkTractor(tractor, brand);
        if (json) return json;
    }
    return null;
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
            row["Class"].replace(c_split[0], "");

            if (row["Class"].includes("Farm")) {
                lastClass.category = "Farm Stock";
                lastClass.speed = 3;
            } else if (row["Class"].includes("Antique")) {
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
        const p_split = row.Puller.split(" ");
        if (p_split.length !== 2) {
            console.log("Invalid Person:");
            console.log(row);
            return null;
        }
        newRow.first_name = p_split[0];
        newRow.last_name = p_split[1];

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
