const red = "#dc143c";
const blue = "#0fffff";
const empty = "transparent";
let lastArray;
let currentRotate = 0;

function generateTableDiv() {
    let tableDiv = document.createElement("div");
    tableDiv.id = "tableDiv";
    document.body.appendChild(tableDiv);

    let tableSizeInput = document.getElementById("tableSize");
    tryConstructTable(tableSizeInput.value);
}

function tryConstructTable(size) {
    let tableDiv = document.getElementById("tableDiv");
    tableDiv.innerHTML = "";

    let isIntegerCheckResult = isIntegerSize(size);
    if (!isIntegerCheckResult.result) {
        report(isIntegerCheckResult.message);
        return;
    }
    size = parseInt(size);

    let isCorrectCheckResult = isCorrectSize(size);
    if (!isCorrectCheckResult.result) {
        report(isCorrectCheckResult.message);
        return;
    }
    constructTable(size);
    updateTableBody();
}

function report(message) {
    let tableDiv = document.getElementById("tableDiv");
    let error = document.createElement("h2");
    error.textContent = message;
    error.className = "error";
    tableDiv.appendChild(error);
}

function constructTable(size) {
    let tableDiv = document.getElementById("tableDiv");
    let table = document.createElement("table");
    table.id = "table";
    let tableBody = document.createElement("tbody");
    tableBody.id = "tableBody";
    table.appendChild(tableBody);
    let array = generateArray(size);
    lastArray = array.slice();
    generateTableCells(tableBody, array);
    tableDiv.appendChild(table);
    lastArray = array;
}

function generateArray(size) {
    let array = Array();
    for (let i = 0; i < size; i++) {
        let row = Array(size);
        row.fill({
            value: "", color: empty
        })
        array.unshift(row);
    }
    fillArray(array);
    return array;
}

function fillArray(array) {
    fillRows(array);
    fillColumns(array);
}

function fillRows(array) {
    fillVectors(array, fillRow);
}

function fillColumns(array) {
    fillVectors(array, fillColumn);
}

function fillVectors(array, fillVector) {
    let size = array.length;
    let values = Array(size);
    for (let i = 0; i < size; i++) {
        values[i] = i + 1;
    }
    let firstMiddleIndex = Math.ceil(size / 2) - 1;
    let isEvenSize = size % 2 === 0;
    fillVector(array, firstMiddleIndex, values);
    if (isEvenSize) {
        let secondMiddleIndex = firstMiddleIndex + 1;
        fillVector(array, secondMiddleIndex, values.reverse());
    }
}

function fillRow(array, rowIndex, values) {
    for (let i = 0; i < array.length; i++) {
        array[rowIndex][i] = {
            value: values[i], color: blue
        };
    }
}

function fillColumn(array, columnIndex, values) {
    for (let i = 0; i < array.length; i++) {
        array[i][columnIndex] = {
            value: values[i], color: red
        };
    }
}

function generateTableCells(tableBody, array) {
    for (let i = 0; i < array.length; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < array[i].length; j++) {
            let cell = document.createElement("td");
            cell.textContent = array[i][j].value;
            cell.className = "cell";
            cell.bgColor = array[i][j].color;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
}

function isIntegerSize(size) {
    if (!isNumeric(size)) {
        return {
            result: false, message: "Введено не число"
        }
    }
    if (!isInteger(size)) {
        return {
            result: false, message: "Введено не целое число"
        }
    }
    return {result: true};
}

function isInteger(value){
    return (value % 1 === 0);
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function isCorrectSize(size) {
    if (size < 1) {
        return {
            result: false, message: "Размер меньше 1 не допустим"
        }
    }
    if (size > 50) {
        return {
            result: false, message: "Размер больше 50 не допустим"
        }
    }
    return {result: true};
}

// Наложение эффектов
function updateTableBody() {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    generateTableCells(tableBody, lastArray);
    applyEffects();
}

function applyEffects(){
    tryRemoveRowsColor();
    tryFillRedCells();
}

function tryRemoveRowsColor(){
    let input = document.getElementById("removeRowsColorInput");
    let rows = getSelectedRows(input.value);
    removeRowsColor(rows);
}

function getSelectedRows(value) {
    let rows = value.split(",");
    rows = rows.map(num => parseFloat(num));
    rows = rows.filter(isInteger);
    return rows;
}

function removeRowsColor(removeColorRows) {
    let rows = document.getElementById("tableDiv").getElementsByTagName("tr");
    for (let r = 0; r < removeColorRows.length; r++) {
        for (let i = 0; i < rows.length; ++i) {
            if (i === removeColorRows[r]) {
                let cells = rows[i].getElementsByTagName("td");
                for (let j = 0; j < cells.length; ++j) {
                    cells[j].bgColor = empty;
                }
            }
        }
    }
}

function tryFillRedCells(){
    let form = document.getElementById("fillRedCellsForm");
    if (form.radio.value !== "") {
        fillRedCells(form.radio.value);
    }
}

function fillRedCells(aggregate) {
    let cells = document.getElementById("tableDiv").getElementsByTagName("td");
    let value = getValue(aggregate);
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].bgColor === red) {
            cells[i].textContent = value;
        }
    }
}

function getValue(aggregate) {
    if (aggregate === "sum") {
        return getSum();
    }
    return getAvg();
}

function getSum() {
    let sum = 0;
    for (let i = 0; i < lastArray.length; i++) {
        for (let j = 0; j < lastArray[i].length; j++) {
            let cell = lastArray[i][j];
            if (cell.color !== empty) {
                sum += cell.value;
            }
        }
    }
    return sum;
}

function getCount() {
    let count = 0;
    for (let i = 0; i < lastArray.length; i++) {
        for (let j = 0; j < lastArray[i].length; j++) {
            let cell = lastArray[i][j];
            if (cell.color !== empty) {
                count += 1;
            }
        }
    }
    return count;
}

function getAvg() {
    let sum = getSum();
    let count = getCount();
    return sum / count;
}

function resetRedCells() {
    let form = document.getElementById("fillRedCellsForm");
    form.reset();
    updateTableBody();
}

function rotate(){
    let table = document.getElementById("table");
    currentRotate += 90;
    currentRotate %= 360;
    table.style.transform = "rotate(" + currentRotate + "deg)";
}
