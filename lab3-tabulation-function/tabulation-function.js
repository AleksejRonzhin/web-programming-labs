function tryTabulation(xParameters, yParameters, functionParameters) {
    let resultDiv = document.getElementById("result");

    let checkResult = isNumericParameters(xParameters, yParameters, functionParameters);
    if (!checkResult.result) {
        resultDiv.innerHTML = "<h2 class='error'>" + checkResult.message + "</h2>"
        return;
    }

    if (!isCorrectRange(xParameters)) {
        resultDiv.innerHTML = "<h2 class='error'>Диапазон x задан не верно!</h2>";
        return;
    }
    if (!isCorrectRange(yParameters)) {
        resultDiv.innerHTML = "<h2 class='error'>Диапазон y задан не верно!</h2>";
        return;
    }

    let correctParametersResult = isCorrectFunctionParameters(functionParameters);
    if (!correctParametersResult.result) {
        resultDiv.innerHTML = "<h2 class='error'>" + correctParametersResult.message + "</h2>";
        return;
    }
    resultDiv.innerHTML = tabulation(xParameters, yParameters, functionParameters, resultDiv);
}

function isNumericParameters(xParameters, yParameters, functionParameters) {
    let message = "";
    let result = true;
    if (!isNumeric(xParameters.begin)) {
        message += "Начало диапазона х введено некорректно<br>"
        result = false;
    }
    if (!isNumeric(xParameters.end)) {
        message += "Конец диапазона х введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(xParameters.step)) {
        message += "Шаг диапазона х введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(yParameters.begin)) {
        message += "Начало диапазона y введено некорректно<br>"
        result = false;
    }
    if (!isNumeric(yParameters.end)) {
        message += "Конец диапазона y введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(yParameters.step)) {
        message += "Шаг диапазона y введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(functionParameters.a)) {
        message += "Параметр а введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(functionParameters.nm1)) {
        message += "Параметр nm1 введен некорректно<br>"
        result = false;
    }
    if (!isNumeric(functionParameters.nm2)) {
        message += "Параметр nm2 введен некорректно<br>"
        result = false;
    }

    return {
        message: message, result: result
    }
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}


function isCorrectRange(parameters) {
    return (parameters.begin > parameters.end && parameters.step < 0)
        || (parameters.begin < parameters.end && parameters.step > 0);
}

function isCorrectFunctionParameters(parameters) {
    let result = true;
    let message = "";
    if (parameters.nm1 < 2 || parameters.nm1 > 6) {
        message += "Значение переменной nm1 не лежит в диапазоне [2, 6]!<br>";
        result = false;
    }
    if (parameters.nm2 < 2 || parameters.nm2 > 6) {
        message += "Значение переменной nm2 не лежит в диапазоне [2, 6]!<br>";
        result = false;
    }
    return {
        result: result,
        message: message
    }
}

function tabulation(xParameters, yParameters, functionParameters) {
    let x0 = xParameters.begin;
    let xn = xParameters.end;
    let sx = xParameters.step;
    let y0 = yParameters.begin;
    let yn = yParameters.end;
    let sy = yParameters.step;

    let s = "<h2>Результаты табулирования</h2>"
    s += "<table border='2px'>";
    s += "<tr><th>x</th><th>y</th><th>f</th></tr>";
    let minF = tabFunction(x0, y0, functionParameters);
    let maxF = minF;
    let minFx = x0;
    let minFy = y0;
    let maxFx = x0;
    let maxFy = x0;
    for (let x = x0; (x0 < xn) ? x < xn + 0.5 * sx : x > xn + 0.5 * sx; x += sx) {
        for (let y = y0; (y0 < yn) ? y < yn + 0.5 * sy : y > yn + 0.5 * sy; y += sy) {
            let f = tabFunction(x, y, functionParameters);

            if (!isFinite(f)){
                s += "<tr><td>" + x.toFixed(3) + "</td><td>" + y.toFixed(3) + "</td><td> Не существует </td></tr>";
                continue;
            }
            if (!isFinite(minF)) {
                maxF = minF = f;
                minFx = maxFx = x;
                minFy = minFy = y;
            }
            if (f > maxF) {
                maxF = f;
                maxFx = x;
                maxFy = y;
            }
            if (f < minF) {
                minF = f;
                minFx = x;
                minFy = y;
            }
            s += "<tr><td>" + x.toFixed(3) + "</td><td>" + y.toFixed(3) + "</td><td>" + f.toFixed(3) + "</td></tr>";
        }
    }
    s += "</table>";
    s += "Минимальное значение f = " + minF.toFixed(3) + " при х = " + minFx.toFixed(3) + ", y = " + minFy.toFixed(3) + "<br>";
    s += "Максимальное значение f = " + maxF.toFixed(3) + " при х = " + maxFx.toFixed(3) + ", y = " + maxFy.toFixed(3) + "<br>";

    return s;
}

function tabFunction(x, y, functionParameters) {
    let sum;
    let a = functionParameters.a;
    if (a < x + y) {
        sum = getFirstSum(x, y, functionParameters);
        return a * sum / 3;
    } else {
        sum = getSecondSum(x, y, functionParameters);
        return sum * (a + 1) / a;
    }
}

function getFirstSum(x, y, functionParameters) {
    let sum = 0;
    let factorialN = 1;
    for (let n = 1; n <= functionParameters.nm1; factorialN *= ++n) {
        sum += ((Math.pow(x, n) - y * factorialN) / (4 * functionParameters.a - x));
    }
    return sum;
}

function getSecondSum(x, y, functionParameters) {
    let sum = 0;
    for (let n = 1; n <= functionParameters.nm2; n++) {
        sum += (1 + Math.pow(functionParameters.a * y - 1, n) / (x * n));
    }
    return sum;
}