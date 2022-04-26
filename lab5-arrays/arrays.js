const red = "#dc143c";
const green = "#77bf59";
const empty = "transparent";
let arrayM1 = [];
let arrayM2 = [];
const firstAlphabetSymbol = 'a';
const lastAlphabetSymbol = 'z';

function onChangeM1() {
    let rowCountM1 = document.getElementById("rowCountM1").value;
    let colCountM1 = document.getElementById("colCountM1").value;
    let firstSymbolM1 = document.getElementById("firstSymbolM1").value;
    let lastSymbolM1 = document.getElementById("lastSymbolM1").value;

    arrayM1 = generateArray(rowCountM1, colCountM1, firstSymbolM1, lastSymbolM1);
    checkArrays();
}

function onChangeM2() {
    let rowCountM2 = document.getElementById("rowCountM2").value;
    let colCountM2 = document.getElementById("colCountM2").value;
    let firstSymbolM2 = document.getElementById("firstSymbolM2").value;
    let lastSymbolM2 = document.getElementById("lastSymbolM2").value;

    arrayM2 = generateArray(rowCountM2, colCountM2, firstSymbolM2, lastSymbolM2);
    checkArrays();
}

function generateArray(rowCount, colCount, firstSymbol, lastSymbol) {
    let minValue = firstSymbol.charCodeAt(0);
    let maxValue = lastSymbol.charCodeAt(0);
    let array = [];
    for (let i = 0; i < rowCount; i++) {
        array.push(generateRow(minValue, maxValue, colCount));
    }
    return array;
}

function generateRow(minValue, maxValue, colCount) {
    if (Math.random() < 0.5) {
        return getGoodRow(minValue, maxValue, colCount);
    }
    let row = [];
    for (let j = 0; j < colCount; j++) {
        row.push({
            value: String.fromCharCode(getRandomValue(minValue, maxValue)), color: empty
        });
    }
    return row;
}

function getGoodRow(minValue, maxValue, size) {
    let min = minValue;
    let max = maxValue;
    let row = [];
    while (row.length < size) {
        let value = getRandomValue(min, max);
        row.push({value: String.fromCharCode(value), color: empty})
        min = value;
    }
    return row;
}

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function showArray(array, container) {
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
    let resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";

    if(arrayM1.length === 0 && arrayM2.length === 0){
        return;
    }
    showText(resultContainer, "Исходные массивы:");
    showArrays(resultContainer, arrayM1, arrayM2);

    let checkedArrayM1 = arrayClone(arrayM1);
    let checkedArrayM2 = arrayClone(arrayM2);
    let badVectors = getBadVectors(checkedArrayM1).concat(getBadVectors(checkedArrayM2));
    colorizeArrays(checkedArrayM1, checkedArrayM2, badVectors);
    showText(resultContainer, "Анализ строк на упорядоченность:");
    showArrays(resultContainer, checkedArrayM1, checkedArrayM2);

    let badElements = badVectors.flat();
    if(badElements.length === 0){
        return;
    }
    removeColorVector(badElements);
    showText(resultContainer, "Вектор элементов неупорядочных строк:");
    showElements(resultContainer, badElements);

    let oddBadElements = getOddBadElements(badElements);
    colorizeVector(badElements, oddBadElements);
    showText(resultContainer, "Анализ элементов на четность позиции в алфавите:");
    showElements(resultContainer, badElements);

    if(oddBadElements.length === 0){
        return;
    }
    removeColorVector(oddBadElements);
    showText(resultContainer, "Вектор элементов четной позиции в алфавите:");
    showElements(resultContainer, oddBadElements);

    let sortedVector = getSortedVector(oddBadElements);
    showText(resultContainer, "Отсортированный вектор:");
    showElements(resultContainer, sortedVector);
}

function getBadVectors(array) {
    return array.filter(isNotSortedVector);
}

function isNotSortedVector(vector) {
    return !vector.every((item, index, array) => {
        return index + 1 === array.length || item.value <= array[index + 1].value;
    });
}

function getSortedVector(vector) {
    return vector.sort((a, b) => {
        return (a.value.charCodeAt(0) - b.value.charCodeAt(0));
    });
}

function colorizeVector(elements, oddElements) {
    elements.forEach((item) => {
        item.color = red;
    });
    oddElements.forEach((item) => {
        item.color = green;
    });
}

function getOddBadElements(badElements) {
    return badElements.filter((item) => {
        return item.value.charCodeAt(0) % 2 !== firstAlphabetSymbol.charCodeAt(0) % 2;
    });
}

function showElements(container, elements) {
    container.append(convertVectorToArray(elements));
}

function removeColorVector(vector) {
    vector.forEach((item) => item.color = empty);
}

function colorizeArrays(checkedArrayM1, checkedArrayM2, badVectors) {
    checkedArrayM1.forEach((item) => item.forEach((item) => item.color = green));
    checkedArrayM2.forEach((item) => item.forEach((item) => item.color = green));
    fillBadRows(badVectors);
}

function fillBadRows(badVectors) {
    badVectors.forEach((item) => (item.forEach((item) => {
        item.color = red
    })));
}

function arrayClone(source) {
    let clone = [];
    source.forEach((item) => {
        let row = [];
        item.forEach((item) => {
            row.push({value: item.value, color: item.color});
        })
        clone.push(row);
    })
    return clone;
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

function showArrays(container, arrayM1, arrayM2) {
    let table = document.createElement("table");
    table.className = "mainTable";
    let row = document.createElement("tr");
    row.id = "checkedArrays";
    let cell = document.createElement("td");
    showArray(arrayM1, cell);
    row.append(cell);
    cell = document.createElement("td");
    showArray(arrayM2, cell);
    row.append(cell);
    table.append(row);
    container.append(table);
}

function showText(container, text) {
    container.append(getTextDiv(text));
}

function getTextDiv(text) {
    let div = document.createElement("div");
    div.append(text);
    div.className = "textDiv";
    return div;
}