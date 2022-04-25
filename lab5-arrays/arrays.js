const red = "#dc143c";
const green = "#77bf59";
const empty = "transparent";
let arrayM1 = [];
let arrayM2 = [];
const firstAlphabetSymbol = 'a';
const lastAlphabetSymbol = 'z';

function onChangeM1() {
    let widthM1 = document.getElementById("widthM1").value;
    let heightM1 = document.getElementById("heightM1").value;
    let firstSymbolM1 = document.getElementById("firstSymbolM1").value;
    let lastSymbolM1 = document.getElementById("lastSymbolM1").value;

    arrayM1 = generateArray(widthM1, heightM1, firstSymbolM1, lastSymbolM1);
    checkArrays();
}

function onChangeM2() {
    let widthM2 = document.getElementById("widthM2").value;
    let heightM2 = document.getElementById("heightM2").value;
    let firstSymbolM2 = document.getElementById("firstSymbolM2").value;
    let lastSymbolM2 = document.getElementById("lastSymbolM2").value;

    arrayM2 = generateArray(widthM2, heightM2, firstSymbolM2, lastSymbolM2);
    checkArrays();
}

function generateArray(width, height, firstSymbol, lastSymbol) {
    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    let minValue = firstSymbol.charCodeAt(0);
    let maxValue = lastSymbol.charCodeAt(0);

    let array = [];
    for (let i = 0; i < width; i++) {
        let row = [];
        for (let j = 0; j < height; j++) {
            row.push({
                value: String.fromCharCode(getRandomValue(parseInt(minValue), parseInt(maxValue))), color: empty
            });
        }
        array.push(row);
    }
    return array;
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
    arrayM1.forEach((item) => item.forEach((item) => item.color = empty));
    arrayM2.forEach((item) => item.forEach((item) => item.color = empty));
    showArrays(resultContainer, arrayM1, arrayM2);


    arrayM1.forEach((item) => item.forEach((item) => item.color = green));
    arrayM2.forEach((item) => item.forEach((item) => item.color = green));


    let badVectors = getBadVectors(arrayM1).concat(getBadVectors(arrayM2));
    fillBadRows(badVectors);

    let badElements = badVectors.flat().map((item) => {
        return {value: item.value, color: empty}
    });

    showResults(arrayM1, arrayM2, badElements);
}


function showResults(checkedArrayM1, checkedArrayM2, badElements) {
    let resultContainer = document.getElementById("result");

    showArrays(resultContainer, checkedArrayM1, checkedArrayM2);

    resultContainer.append(convertVectorToArray(badElements));

    badElements.forEach((item) => {
        item.color = red;
    })
    let oddBadElements = badElements.filter((item) => {
        return item.value.charCodeAt(0) % 2 !== firstAlphabetSymbol.charCodeAt(0) % 2;
    });
    oddBadElements.forEach((item) => {
        item.color = green;
    });

    resultContainer.append(convertVectorToArray(badElements));
    resultContainer.append(convertVectorToArray(oddBadElements.map((item) => {
        return {value: item.value, color: empty}
    })));

    let sortedVector = oddBadElements.sort((a, b) => {
        return (a.value.charCodeAt(0) - b.value.charCodeAt(0));
    });
    resultContainer.append(convertVectorToArray(sortedVector.map((item) => {
        return {value: item.value, color: empty}
    })));

}

function showArrays(container, arrayM1, arrayM2){
    let div = document.createElement("div");
    div.className = "panel";
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
    div.append(table);
    container.append(div);
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
