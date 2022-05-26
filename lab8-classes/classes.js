let expressions = [];

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

function Fraction(numerator, denominator, isPositive) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.isPositive = isPositive;

    this.toString = function () {
        this.registrationAction("toString", arguments);
        return `${this.isPositive ? "" : " - "} ${this.numerator} / ${this.denominator}`;
    };

    this.getNumerator = function () {
        this.registrationAction("getNumerator", arguments);
        return this.numerator;
    };

    this.setNumerator = function (value) {
        this.registrationAction("setNumerator", arguments);
        this.numerator = value;
    };

    this.getDenominator = function () {
        this.registrationAction("getDenominator", arguments);
        return this.denominator;
    };

    this.setDenominator = function (value) {
        this.registrationAction("setDenominator", arguments);
        this.denominator = value;
    };

    this.getSign = function () {
        return this.isPositive ? "positive" : "negative";
    }

    this.setSign = function (value) {
        this.isPositive = value === "positive";
    }

    this.add = function (fraction) {
        this.registrationAction("add", fraction);
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
        this.registrationAction("sub", fraction);
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
        this.registrationAction("mul", fraction);
        let numerator = this.numerator * fraction.numerator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.division = function (fraction) {
        this.registrationAction("division", fraction);
        let numerator = this.numerator * fraction.denominator;
        let denominator = this.denominator * fraction.numerator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.assignment = function (fraction) {
        this.registrationAction("assignment", fraction);
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
        if(divider){
            this.numerator /= divider;
            this.denominator /= divider;
        }
    }
}

Fraction.prototype.registrationActions = [];

Fraction.prototype.registrationAction = function (action, ...args) {
    let time = new Date();
    this.registrationActions.push({
        action: action, time: time, args: args
    })
};

Fraction.prototype.clearRegistrationActions = function () {
    this.registrationActions = [];
    console.log("Список действий очищен!")
}

Fraction.prototype.outputRegistrationActions = function () {
    console.log(this.registrationActions);
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
    let expression = {
        firstOperand: null, operation: operations[0].name, secondOperand: null, result: null
    }
    expressions.push(expression);
    updateExpressionsView();
}

function changeExpressionOperation(expressionId, value) {
    let expression = getExpression(expressionId);
    expression.result = null;
    expression.operation = value;
    updateExpressionsView();
}

function addFirstExpressionOperand(expressionId) {
    let expression = getExpression(expressionId);
    expression.firstOperand = getDefaultFraction();
    updateExpressionsView();
}

function addSecondExpressionOperand(expressionId) {
    let action = getExpression(expressionId);
    action.secondOperand = getDefaultFraction();
    updateExpressionsView();
}

function performExpression(expressionId) {
    let expression = getExpression(expressionId);
    expression.result = expression.firstOperand[expression.operation](expression.secondOperand);
    updateExpressionsView();
}

function getExpression(expressionId) {
    return expressions[expressionId];
}

// Отображение выражений
function updateExpressionsView() {
    let table = document.getElementById("expressionsTable");
    table.innerHTML = "";
    expressions.forEach((expression, index) => {
        let row = getExpressionView(expression, index);
        table.append(row);
    })
}

function getExpressionView(expression, index) {
    let row = document.createElement("tr");

    let cell = getFirstOperandCell(expression, index);
    cell.className = "expressionCell";
    row.append(cell);

    cell = getOperationCell(expression, index);
    cell.className = "expressionCell";
    row.append(cell);

    cell = getSecondOperandCell(expression, index);
    cell.className = "expressionCell";
    row.append(cell);

    if (expression.firstOperand && expression.secondOperand) {
        cell = getPerformExpressionButton(index);
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

function getFirstOperandCell(expression, index) {
    let cell = document.createElement("td");
    if (expression.firstOperand) {
        cell.innerHTML = getFractionView(expression.firstOperand, index, "first");
    } else {
        cell.innerHTML = `<button class="circleButton" onclick='addFirstExpressionOperand(${index})'>+</button>`;
    }
    return cell;
}

function getOperationCell(expression, index) {
    function getOperationSelect(startValue, index) {
        return `<select class="operationSelect" onchange="changeExpressionOperation(${index}, value)">${operations.map((operation => {
            return `<option ${startValue === operation.name ? 'selected' : ''} value=${operation.name}>${operation.sign}</option>`
        })).join("")}</select>`
    }

    let cell = document.createElement("td");
    cell.innerHTML = getOperationSelect(expression.operation, index);
    return cell;
}

function getSecondOperandCell(expression, index) {
    let cell = document.createElement("td");
    if (expression.secondOperand) {
        cell.innerHTML = getFractionView(expression.secondOperand, index, "second");
    } else {
        cell.innerHTML = `<button class="circleButton"  onclick='addSecondExpressionOperand(${index})'>+</button>`;
    }
    return cell;
}

function getPerformExpressionButton(index) {
    let cell = document.createElement("td");
    cell.innerHTML = `<button onclick='performExpression(${index})'>=</button>`
    return cell;
}

function getResultCell(action) {
    let cell = document.createElement("td");
    cell.textContent = action.result;
    return cell;
}

// Отображение дроби
function getFractionView(fraction, index, operandOrder) {
    return `<table class="fraction">
                <tr>
                    <td rowspan="3" class="sign">
                        <label>
                            <select onchange="changeSign('${operandOrder}:${index}', value)">
                                <option value="positive" ${fraction.getSign() === "positive" ? "selected" : ""}>+</option>
                                <option value="negative" ${fraction.getSign() === "negative" ? "selected" : ""}>-</option>
                            </select>
                        </label>
                    </td>
                    <td><input class="parameterInput" type="text" value="${fraction.numerator}" onchange="changeNumerator('${operandOrder}:${index}', value)"></td>
                </tr>
                <tr>
                    <td><hr color="black"/></td>
                </tr>
                <tr>
                    <td>
                        <input class="parameterInput" id="denominator" type="text" value="${fraction.denominator}" onchange="changeDenominator('${operandOrder}:${index}', value)">
                    </td>
                </tr>
            </table>`;
}

function changeSign(str, value) {
    let operandOrder = str.split(":")[0];
    let expressionId = str.split(":")[1];
    let expression = getExpression(expressionId);
    if (operandOrder === "first") {
        expression.firstOperand.setSign(value);
    }
    if (operandOrder === "second") {
        expression.secondOperand.setSign(value);
    }
    expression.result = null;
    updateExpressionsView();
}

function changeNumerator(str, value) {
    if(!isCorrectValue(value, "Числитель")){
        updateExpressionsView();
        return;
    }

    let operandOrder = str.split(":")[0];
    let expressionId = str.split(":")[1];
    let expression = getExpression(expressionId);

    if (operandOrder === "first") {
        expression.firstOperand.setNumerator(value)
    }
    if (operandOrder === "second") {
        expression.secondOperand.setNumerator(value)
    }
    expression.result = null;
    updateExpressionsView();
}

function changeDenominator(str, value) {
    if(!isCorrectValue(value, "Знаменатель")){
        updateExpressionsView();
        return;
    }

    let operandOrder = str.split(":")[0];
    let expressionId = str.split(":")[1];
    let expression = getExpression(expressionId);

    if (operandOrder === "first") {
        expression.firstOperand.setDenominator(value)
    }
    if (operandOrder === "second") {
        expression.secondOperand.setDenominator(value)
    }
    expression.result = null;
    updateExpressionsView();
}

// Генерация выражений
function generateExpressions() {
    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFraction() {
        return new Fraction(getRandomValue(1, 10), getRandomValue(1, 10), getRandomValue(1, 2) === 1)
    }

    for (let i = 0; i < 10; i++) {
        let expression = {
            firstOperand: getRandomFraction(),
            operation: operations[getRandomValue(0, operations.length - 1)].name,
            secondOperand: getRandomFraction(),
            result: null
        }

        expression.result = expression.firstOperand[expression.operation](expression.secondOperand);

        expressions.push(expression);
    }
    updateExpressionsView();
}

// Проверка вводимых значений
function checkNumerator(){
    let numerator = document.getElementById("numerator").value;
    if(!isCorrectValue(numerator, "Числитель")){
        document.getElementById("numerator").value = defaultNumerator;
    }
}

function checkDenominator(){
    let numerator = document.getElementById("denominator").value;
    if(!isCorrectValue(numerator, "Знаменатель")){
        document.getElementById("denominator").value = defaultDenominator;
    }
}

function isCorrectValue(value, name){
    if(!isNumeric(value)){
        alert(`${name} не число!`);
        return false;
    }
    if(!isInteger(value)){
        alert(`${name} не целое число!`);
        return false;
    }
    if(value < 0){
        alert(`${name} не положительное число!`);
        return false;
    }
    if(value > 100){
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