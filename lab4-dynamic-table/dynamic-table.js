const red = "#dc143c";
const blue = "#0fffff";

function fillRedCells(value) {
    console.log(value);
}

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
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    let array = generateArray(size);
    generateTableCells(tableBody, array);
    tableDiv.appendChild(table);
}

function generateArray(size) {
    let array = Array();
    for (let i = 0; i < size; i++) {
        let row = Array(size);
        row.fill({
            value: "", color: "transparent"
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

function fillVectors(array, fillVector){
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
        console.log("не число");
        return {
            result: false, message: "Введено не число"
        }
    }
    if (size % 1 !== 0) {
        console.log("не целое");
        return {
            result: false, message: "Введено не целое число"
        }
    }
    return {result: true};
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