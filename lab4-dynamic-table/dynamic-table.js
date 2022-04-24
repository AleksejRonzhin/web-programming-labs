const red = "#dc143c";
const blue = "#0fffff";
const empty = "transparent";
let array;

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
    constructTable();
    array = generateArray(size);
    updateTableBody();
}

function report(message) {
    let tableDiv = document.getElementById("tableDiv");
    let error = document.createElement("h2");
    error.textContent = message;
    error.className = "error";
    tableDiv.appendChild(error);
}

function constructTable() {
    let tableDiv = document.getElementById("tableDiv");
    let table = document.createElement("table");
    table.id = "table";
    let tableBody = document.createElement("tbody");
    tableBody.id = "tableBody";
    table.appendChild(tableBody);
    tableDiv.appendChild(table);
}

// Создания массива специально вида
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

// Проверка значений
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

function isInteger(value) {
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
    generateTableCells(tableBody, array);
    applyEffects();
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

function applyEffects() {
    tryRemoveRowsColor();
    tryFillRedCells();
}

function tryRemoveRowsColor() {
    let input = document.getElementById("removeRowsColorInput");
    let rows = getSelectedRows(input.value);
    let checkResult = checkRows(rows);
    if(!checkResult.result){
        removeRowsColorReport(checkResult.message);
    } else {
        let error = document.getElementById("removeRowsColorError");
        error.textContent = "";
        removeRowsColor(rows);
    }
}

function removeRowsColorReport(message){
    let error = document.getElementById("removeRowsColorError");
    error.textContent = message;
    error.className = "error";
}

function getSelectedRows(value) {
    return value.split(",");
}

function checkRows(rows) {
    let tableSizeInput = document.getElementById("tableSize");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i].trim();
        if (row.split(" ").length !== 1) {
            return {
                result: false, message: "Значения нужно вводить через запятую"
            }
        }
        if (!isInteger(row)) {
            return {
                result: false, message: "Значения строк должны быть целочисленными"
            }
        }
        if (row < 0){
            return {
                result: false, message: "Значения строк должны быть неотрицательными"
            }
        }
        if(row >= tableSizeInput.value){
            return {
                result: false, message: "Значение строки слишком большое"
            }
        }
    }
    return {result: true}
}

function removeRowsColor(removeColorRows) {
    let rows = document.getElementById("tableDiv").getElementsByTagName("tr");
    removeColorRows = removeColorRows.map(num => parseFloat(num));
    removeColorRows = removeColorRows.filter(isInteger);
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

function tryFillRedCells() {
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
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let cell = array[i][j];
            if (cell.color !== empty) {
                sum += cell.value;
            }
        }
    }
    return sum;
}

function getCount() {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let cell = array[i][j];
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

function rotateArray() {
    let newArray = Array();
    for (let i = 0; i < array.length; i++) {
        let row = Array();
        for (let j = 0; j < array[i].length; j++) {
            row.push(array[array[i].length - j - 1][i]);
        }
        newArray.push(row);
    }
    array = newArray;
    updateTableBody();
}

function rotateArray2(){
    let tableBody = document.getElementById("tableBody");
    let rows = tableBody.getElementsByTagName("tr");
    let newArray = Array();
    for(let i = 0; i < rows.length; i++){
        let arrayRow = Array();
        let row = rows[i];
        let values = row.getElementsByTagName("td");
        for(let i = 0; i < values.length; i++){
            arrayRow.push(values[i]);
        }
        newArray.push(arrayRow);
    }
    console.log(newArray);

    let newArray2 = Array();
    for (let i = 0; i < newArray.length; i++) {
        let row = Array();
        for (let j = 0; j < newArray[i].length; j++) {
            row.push(newArray[newArray[i].length - j - 1][i]);
        }
        newArray2.push(row);
    }

    tableBody.innerHTML = "";
    for (let i = 0; i < newArray2.length; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < array[i].length; j++) {
            row.appendChild(newArray2[i][j]);
        }
        tableBody.appendChild(row);
    }
}