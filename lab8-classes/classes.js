let expressions = [];
function getExpressionById(expressionId) {
    return expressions.find((item) => {
        return item.id == expressionId;
    });
}

let fractions = [];
function getFractionById(fractionId) {
    return fractions.find((item) => {
        return item && item.id == fractionId;
    });
}

let operations = [{
    name: "add", sign: "+"
}, {
    name: "sub", sign: "-"
}, {
    name: "mul", sign: "*"
}, {
    name: "division", sign: "/"
}, {
    name: "assignment", sign: ":="
}];

let defaultNumerator = 1;
let defaultDenominator = 2;

function Expression(firstOperand, operation, secondOperand) {
    this.id = Expression.count++;
    this.firstOperand = firstOperand;
    this.operation = operation;
    this.secondOperand = secondOperand;
    this.result = null;

    this.perform = function () {
        this.result = this.firstOperand[this.operation](this.secondOperand);
    }
}

Expression.count = 0;

function Fraction(numerator, denominator, isPositive) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.isPositive = isPositive;
    this.id = Fraction.count++;

    this.toString = function () {
        this.registerAction("toString", arguments);
        return `${this.isPositive ? "" : " - "} ${this.numerator} / ${this.denominator}`;
    };

    this.getNumerator = function () {
        this.registerAction("getNumerator", arguments);
        return this.numerator;
    };

    this.setNumerator = function (value) {
        this.registerAction("setNumerator", arguments);
        this.numerator = value;
    };

    this.getDenominator = function () {
        this.registerAction("getDenominator", arguments);
        return this.denominator;
    };

    this.setDenominator = function (value) {
        this.registerAction("setDenominator", arguments);
        this.denominator = value;
    };

    this.getSign = function () {
        return this.isPositive ? "positive" : "negative";
    }

    this.setSign = function (value) {
        this.isPositive = value === "positive";
    }

    this.add = function (fraction) {
        this.registerAction("add", fraction);
        let numerator = (this.isPositive ? 1 : -1) * this.numerator * fraction.denominator + (fraction.isPositive ? 1 : -1) * fraction.numerator * this.denominator;
        let denominator = this.denominator * fraction.denominator;

        let isPositive = true;
        if (numerator < 0) {
            isPositive = false;
            numerator *= -1;
        }
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.sub = function (fraction) {
        this.registerAction("sub", fraction);
        let numerator = (this.isPositive ? 1 : -1) * this.numerator * fraction.denominator - (fraction.isPositive ? 1 : -1) * fraction.numerator * this.denominator;
        let denominator = this.denominator * fraction.denominator;

        let isPositive = true;
        if (numerator < 0) {
            isPositive = false;
            numerator *= -1;
        }

        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.mul = function (fraction) {
        this.registerAction("mul", fraction);
        let numerator = this.numerator * fraction.numerator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.division = function (fraction) {
        this.registerAction("division", fraction);
        let numerator = this.numerator * fraction.denominator;
        let denominator = this.denominator * fraction.numerator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.assignment = function (fraction) {
        this.registerAction("assignment", fraction);
        this.numerator = fraction.numerator;
        this.denominator = fraction.denominator;
        this.isPositive = fraction.isPositive;
    };

    this.simplify = function () {
        let gcd = function (...x) {
            let j = Math.min.apply(null, x);
            while (j >= 1) {
                if (x.every((b) => b % j === 0)) {
                    return j;
                } else j--;
            }
        }

        let divider = gcd(this.numerator, this.denominator);
        if (divider) {
            this.numerator /= divider;
            this.denominator /= divider;
        }
    }
}

Fraction.count = 0;

Fraction.prototype = new BaseObject();

function BaseObject(){
    this.registrationActions = [];
    this.registerAction = function (action, ...args) {
        let time = new Date();
        this.registrationActions.push({
            action: action, time: time, args: args
        })
    };
    this.clearRegistrationActions = function () {
        this.registrationActions = [];
        console.log("Список действий очищен!")
    };
    this.outputRegistrationActions = function () {
        console.log(this.registrationActions);
    }
}

function CreateExpression(mode) {
    let expression = null;
    if (mode === "empty") {
        expression = new Expression(null, operations[0].name, null);
    }
    if (mode === "random") {
        expression = getRandomExpression();

    }
    expressions.push(expression);
    return expression;
}

function getRandomExpression() {
    return new Expression(CreateFraction("random"), getRandomOperation(), CreateFraction("random"));
}

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperation() {
    return operations[getRandomValue(0, operations.length - 1)].name;
}

function CreateFraction(mode) {
    let fraction = null;
    if (mode === "default") {
        fraction = getDefaultFraction();
    }
    if (mode === "random") {
        fraction = getRandomFraction();
    }
    fractions.push(fraction);
    return fraction;
}

function getRandomFraction() {
    return new Fraction(getRandomValue(1, 10), getRandomValue(1, 10), getRandomValue(1, 2) === 1);
}


function getDefaultFraction() {
    let numerator = document.getElementById("numerator").value;
    let denominator = document.getElementById("denominator").value;
    let isPositive = document.getElementById("isPositiveSelect").value;
    return new Fraction(numerator, denominator, isPositive === "positive");
}

//Зарегистрированные действия
function showRegistrationInfo() {
    Fraction.prototype.outputRegistrationActions();
}

function clearRegistrationInfo() {
    Fraction.prototype.clearRegistrationActions();
}


// Логика выражений
function addExpression() {
    CreateExpression("empty");
    updateExpressionsView();
}

function changeExpressionOperation(expressionId, value) {
    let expression = getExpressionById(expressionId);
    expression.result = null;
    expression.operation = value;
    updateExpressionsView();
}

function addFirstExpressionOperand(expressionId) {
    let expression = getExpressionById(expressionId);
    expression.firstOperand = CreateFraction("default");
    updateExpressionsView();
}

function addSecondExpressionOperand(expressionId) {
    let expression = getExpressionById(expressionId);
    expression.secondOperand = CreateFraction("default");
    updateExpressionsView();
}

function performExpression(expressionId) {
    let expression = getExpressionById(expressionId);
    expression.perform();
    updateExpressionsView();
}

// Отображение выражений
function updateExpressionsView() {
    let table = document.getElementById("expressionsTable");
    table.innerHTML = "";
    expressions.forEach((expression) => {
        let row = getExpressionView(expression);
        table.append(row);
    })
}

function getExpressionView(expression) {
    let row = document.createElement("tr");

    let cell = getFirstOperandCell(expression);
    cell.className = "expressionCell";
    row.append(cell);

    cell = getOperationCell(expression);
    cell.className = "expressionCell";
    row.append(cell);

    cell = getSecondOperandCell(expression);
    cell.className = "expressionCell";
    row.append(cell);

    if (expression.firstOperand && expression.secondOperand) {
        cell = getPerformExpressionButton(expression);
        cell.className = "expressionCell";
        row.append(cell);
    }

    if (expression.result) {
        cell = getResultCell(expression);
        cell.className = "expressionCell";
        row.append(cell);
    }
    return row;
}

function getFirstOperandCell(expression) {
    let cell = document.createElement("td");
    let expressionId = expression.id;
    if (expression.firstOperand) {
        cell.innerHTML = getFractionView(expression, expression.firstOperand, false);
    } else {
        cell.innerHTML = `<button class="circleButton" onclick='addFirstExpressionOperand(${expressionId})'>+</button>`;
    }
    return cell;
}

function getOperationCell(expression) {
    function getOperationSelect(expression) {
        let startValue = expression.operation;
        let expressionId = expression.id;
        return `<select class="operationSelect" onchange="changeExpressionOperation(${expressionId}, value)">${operations.map((operation => {
            return `<option ${startValue === operation.name ? 'selected' : ''} value=${operation.name}>${operation.sign}</option>`
        })).join("")}</select>`
    }

    let cell = document.createElement("td");
    cell.innerHTML = getOperationSelect(expression);
    return cell;
}

function getSecondOperandCell(expression) {
    let cell = document.createElement("td");
    let expressionId = expression.id;
    if (expression.secondOperand) {
        cell.innerHTML = getFractionView(expression, expression.secondOperand, false);
    } else {
        cell.innerHTML = `<button class="circleButton"  onclick='addSecondExpressionOperand(${expressionId})'>+</button>`;
    }
    return cell;
}

function getPerformExpressionButton(expression) {
    let cell = document.createElement("td");
    let expressionId = expression.id;
    cell.innerHTML = `<button onclick='performExpression(${expressionId})'>=</button>`
    return cell;
}

function getResultCell(expression) {
    let cell = document.createElement("td");
    cell.innerHTML = getFractionView(expression, expression.result, true);
    return cell;
}

// Отображение дроби
function getFractionView(expression, fraction, isReadOnly) {
    let fractionId = fraction.id;
    let expressionId = expression.id;
    return `<table class="fraction">
                <tr>
                    <td rowspan="3" class="sign">
                        <label>
                            <select onchange="changeSign('${expressionId}','${fractionId}', value)">
                                <option value="positive" ${isReadOnly ? "disabled" : ""} ${fraction.getSign() === "positive" ? "selected" : ""}>+</option>
                                <option value="negative" ${isReadOnly ? "disabled" : ""} ${fraction.getSign() === "negative" ? "selected" : ""}>-</option>
                            </select>
                        </label>
                    </td>
                    <td><input ${isReadOnly ? "readonly" : ""} class="parameterInput" type="text" value="${fraction.numerator}" onchange="changeNumerator('${expressionId}', '${fractionId}', value)"></td>
                </tr>
                <tr>
                    <td><hr color="black"/></td>
                </tr>
                <tr>
                    <td>
                        <input ${isReadOnly ? "readonly" : ""} class="parameterInput" id="denominator" type="text" value="${fraction.denominator}" onchange="changeDenominator('${expressionId}', '${fractionId}', value)">
                    </td>
                </tr>
            </table>`;
}

function changeSign(expressionId, fractionId, value) {
    let expression = getExpressionById(expressionId);
    let fraction = getFractionById(fractionId);
    fraction.setSign(value);
    expression.result = null;
    updateExpressionsView();
}

function changeNumerator(expressionId, fractionId, value) {
    if (!isCorrectValue(value, "Числитель")) {
        updateExpressionsView();
        return;
    }

    let expression = getExpressionById(expressionId);
    let fraction = getFractionById(fractionId);
    fraction.setNumerator(value);
    expression.result = null;
    updateExpressionsView();
}

function changeDenominator(expressionId, fractionId, value) {
    if (!isCorrectValue(value, "Знаменатель")) {
        updateExpressionsView();
        return;
    }

    let expression = getExpressionById(expressionId);
    let fraction = getFractionById(fractionId);
    fraction.setDenominator(value);
    expression.result = null;
    updateExpressionsView();
}

// Генерация выражений
function generateExpressions() {
    for (let i = 0; i < 10; i++) {
        let expression = CreateExpression("random");
        expression.perform();
    }
    updateExpressionsView();
}

// Проверка вводимых значений
function checkNumerator() {
    let numerator = document.getElementById("numerator").value;
    if (!isCorrectValue(numerator, "Числитель")) {
        document.getElementById("numerator").value = defaultNumerator;
    }
}

function checkDenominator() {
    let numerator = document.getElementById("denominator").value;
    if (!isCorrectValue(numerator, "Знаменатель")) {
        document.getElementById("denominator").value = defaultDenominator;
    }
}

function isCorrectValue(value, name) {
    if (!isNumeric(value)) {
        alert(`${name} не число!`);
        return false;
    }
    if (!isInteger(value)) {
        alert(`${name} не целое число!`);
        return false;
    }
    if (value < 0) {
        alert(`${name} не положительное число!`);
        return false;
    }
    if (value > 100) {
        alert(`${name} слишком большое число!`);
        return false;
    }
    return true;
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function isInteger(value) {
    return (value % 1 === 0);
}