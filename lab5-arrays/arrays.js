const red = "#dc143c";
const green = "#77bf59";
const empty = "transparent";
let arrayM1 = [];
let arrayM2 = [];

function onChangeM1() {
    let widthM1 = document.getElementById("widthM1").value;
    let heightM1 = document.getElementById("heightM1").value;
    let minValueM1 = document.getElementById("minValueM1").value;
    let maxValueM1 = document.getElementById("maxValueM1").value;

    arrayM1 = generateArray(widthM1, heightM1, minValueM1, maxValueM1);
    checkArrays();
}

function onChangeM2() {
    let widthM2 = document.getElementById("widthM2").value;
    let heightM2 = document.getElementById("heightM2").value;
    let minValueM2 = document.getElementById("minValueM2").value;
    let maxValueM2 = document.getElementById("maxValueM2").value;

    arrayM2 = generateArray(widthM2, heightM2, minValueM2, maxValueM2);
    checkArrays();
}

function generateArray(width, height, minValue, maxValue) {
    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    let array = [];
    for (let i = 0; i < width; i++) {
        let row = [];
        for (let j = 0; j < height; j++) {
            row.push({value: getRandomValue(parseInt(minValue), parseInt(maxValue)), color: green});
        }
        array.push(row);
    }
    return array;
}

function updateArrayM1() {
    let arrayM1Container = document.getElementById("arrayM1Container");
    showArray(arrayM1, arrayM1Container);
}

function updateArrayM2() {
    let arrayM2Container = document.getElementById("arrayM2Container");
    showArray(arrayM2, arrayM2Container);
}

function showArray(array, container) {
    container.innerHTML = "";
    container.append(convertArrayToMatrix(array));
}

function convertArrayToMatrix(array) {
    let tableDiv = document.createElement("tableDiv");
    tableDiv.className = "arrayDiv";
    let table = document.createElement("table");
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    tableDiv.appendChild(table);

    array.forEach((item) => {
        tableBody.append(convertVectorToRow(item));
    })
    return tableDiv;
}

function convertVectorToRow(vector) {
    let tableRow = document.createElement("tr");
    vector.forEach((item) => {
        let cell = document.createElement("td");
        cell.textContent = item.value;
        cell.className = "cell";
        cell.bgColor = item.color;
        tableRow.append(cell);
    })
    return tableRow;
}

function checkArrays() {
    let badVectors = getBadVectors(arrayM1).concat(getBadVectors(arrayM2));
    fillBadRows(badVectors);
    updateArrayM1();
    updateArrayM2();

    let badElements = badVectors.flat();
    let resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
    resultContainer.append(convertVectorToArray(badElements.map((item) => {
        return {value: item.value, color: empty}
    })));
}

function convertVectorToArray(vector) {
    let tableDiv = document.createElement("tableDiv");
    tableDiv.className = "arrayDiv";
    let table = document.createElement("table");
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    tableDiv.appendChild(table);
    let row = convertVectorToRow(vector);
    table.append(row);
    return tableDiv;
}

function getBadVectors(array) {
    return array.filter(isNotSortedVector);
}

function isNotSortedVector(vector) {
    return !vector.every((item, index, array) => {
        return index + 1 === array.length || item.value <= array[index + 1].value;
    });
}

function fillBadRows(badVectors) {
    badVectors.forEach((item) => (item.forEach((item) => {
        item.color = red
    })));
}
