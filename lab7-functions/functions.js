let variantF;
let isMemoize;
let isDebug;
let isSaveCallsCount;

function f1(x) {
    return (Math.pow(Math.cos(x - 5), 5) - Math.log(x)) / (x + 5 * Math.sin(x));
}

function f2(x) {
    return (Math.log(x - 5) - Math.pow(Math.log(x - 2), 3)) / (x + 5 * Math.sin(x));
}

function f3(x) {
    return (Math.pow(Math.E, 3) + x) / 6 + (Math.pow(x, 3) + 2 * x) / (4 * Math.sin(4 * x));
}

function memoize(f) {
    let cache = {}
    
    const getKey = (arguments) => {
        return `${arguments.length}:${[].join.call([].map.call(arguments, (item) => item.toFixed(3)), " ")}`;
    }


    function memF() {
        let key = getKey(arguments);
        if (key in cache) {
            return cache[key];
        } else {
            return cache[key] = f.apply(this, arguments);
        }
    }


    memF.getPrecalculatedValue = function () {
        let key = getKey(arguments);

        if (key in cache) {
            return cache[key]
        }
        return null;
    }

    memF.getCacheSize = function () {
        return Object.keys(cache).length;
    }

    moveFunctions(f, memF);

    return memF;
}

function getFromCache(value) {
    if(!isNumeric(value)){
        alert("Введенное значение не число!")
        return;
    }
    let cacheValue = variantF.getPrecalculatedValue(parseFloat(value));
    alert(cacheValue ? `Значение функции в ${value} равно ${cacheValue} ` : "Значение не найдено");
}

function getCacheSize(){
    let cacheSize = variantF.getCacheSize();
    alert(`Размер кэша - ${cacheSize}`);
}

function debug(f) {
    function debugF() {
        let start = new Date().getTime();
        let result = f.apply(this, arguments);
        let end = new Date().getTime();
        let time = end - start;
        console.log(`Аргумент: ${arguments[0].toFixed(3)}. Значение: ${result.toFixed(3)}. Время выполнения: ${time}`)
        return result;
    }

    moveFunctions(f, debugF);

    return debugF;
}

function saveCallsCount(f) {
    let callsCount = 0;

    function saveCallsF() {
        callsCount++;
        return f.apply(this, arguments);
    }

    saveCallsF.getCallsCount = function () {
        return callsCount;
    }

    saveCallsF.resetCallsCount = function () {
        callsCount = 0;
    }

    moveFunctions(f, saveCallsF);

    return saveCallsF;
}

function getCallsCount(){
    let callCount = variantF.getCallsCount();
    alert(`Количество вызовов функции - ${callCount}`);
}

function resetCallsCount(){
    variantF.resetCallsCount();
}

function moveFunctions(source, recipient) {
    for (let func in source) {
        recipient[func] = source[func];
    }
}

function defineCharacteristics(characteristics, a, b, h) {
    let array = [];
    for (let x = a; x < b + h / 2; x += h) {
        array.push({x: x, y: variantF(x)});
    }
    return characteristics.map((characteristic) => characteristic(array));
}

function start() {
    isMemoize = false;
    isDebug = false;
    isSaveCallsCount = false;

    let a = document.getElementById("a").value;
    let b = document.getElementById("b").value;
    let h = document.getElementById("h").value;

    if(!checkRange(a, b, h)){
        return;
    }

    let f = getFunction(document.getElementById("function").radio.value);
    let characteristics = getCharacteristics();
    variantF = getVariantF(f);
    let result = defineCharacteristics(characteristics, parseFloat(a), parseFloat(b), parseFloat(h));
    printResult(result);

    document.getElementById("memoizeContainer").hidden = !isMemoize;
    document.getElementById("saveCallCountContainer").hidden = !isSaveCallsCount;
    let resultRow = document.getElementById("resultRow");
    resultRow.hidden = false;
}

function checkRange(a, b, h){
    if (!isNumeric(a)) {
        window.alert("Начало интервала не число!");
        return false;
    }
    if (!isNumeric(b)) {
        window.alert("Конец интервала не число!");
        return false;
    }
    if (!isNumeric(h)) {
        window.alert("Шаг интервала не число!");
        return false;
    }
    if(parseFloat(h) <= 0){
        window.alert("Шаг интервала не положительное число!")
        return false;
    }
    if(parseFloat(b) < parseFloat(a)){
        window.alert("Конец интервала меньше начала интервала!");
        return false;
    }
    if(parseFloat(h) > parseFloat(b) - parseFloat(a)){
        window.alert("Шаг интервала больше самого интервала!");
        return false;
    }
    return true;
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function printResult(result) {
    let resultContainer = document.getElementById("result");
    resultContainer.innerText = "";
    result.forEach((item) => {
        let div = document.createElement("div");
        div.className = "panel";
        div.append(resultItemToString(item));
        resultContainer.append(div);
    });
}

function resultItemToString(item) {
    let name = item.name;
    if (name === "max") {
        let point = item.value;
        return `Максимальное значение в (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
    }
    if (name === "negativeCount") {
        return `Количество отрицательных значений: ${item.value}`
    }
    if (name === "monotonicDecreasing") {
        return `Функция ${item.value ? "" : "не"} монотонно-убывающая`
    }
}

function getVariantF(f) {
    let variantF = f;
    isMemoize = document.getElementById("memoize").checked;
    isDebug = document.getElementById("debug").checked;
    isSaveCallsCount = document.getElementById("saveCallsCount").checked;
    if (isMemoize) {
        variantF = memoize(variantF);
    }
    if (isDebug) {
        variantF = debug(variantF);
    }
    if (isSaveCallsCount) {
        variantF = saveCallsCount(variantF);
    }
    return variantF;
}

function getCharacteristics() {
    let characteristics = [];

    let withMax = document.getElementById("max").checked;
    let withNegativeCount = document.getElementById("negativeCount").checked;
    let withMonotonicDecreasing = document.getElementById("isMonotonicDecreasing").checked;
    if (withMax) {
        characteristics.push(getMaxValue);
    }
    if (withNegativeCount) {
        characteristics.push(getNegativeCount);
    }
    if (withMonotonicDecreasing) {
        characteristics.push(isMonotonicDecreasing)
    }
    return characteristics;
}

function getFunction(name) {
    if (name === "f1") {
        return f1;
    }
    if (name === "f2") {
        return f2;
    }
    if (name === "f3") {
        return f3;
    }
}

function getMaxValue(f) {
    let maxValue = f[0];
    f.forEach((value) => {
        if (maxValue.y < value.y) {
            maxValue = value;
        }
    })
    return {name: "max", value: maxValue};
}

function getNegativeCount(f) {
    return {name: "negativeCount", value: f.filter((value) => value.y < 0).length};
}

function isMonotonicDecreasing(f) {
    return {
        name: "monotonicDecreasing",
        value: f.every(((value, index, array) => index === 0 || array[index - 1].y >= array[index].y))
    }
}

function changeParameters(){
    let resultRow = document.getElementById("resultRow");
    resultRow.hidden = true;
}