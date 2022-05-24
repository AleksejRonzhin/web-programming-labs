let actions = [];

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

function BaseObject() {
    this.registrationActions = [];

    this.registrationAction = function (action, ...args) {
        let time = new Date();
        this.registrationActions.push({
            action: action, time: time, args: args
        })
    }

    this.clearRegistrationActions = function () {
        this.registrationActions = [];
        console.log("Список действий очищен!")
    }

    this.outputRegistrationActions = function () {
        console.log(this.registrationActions);
    }
}

function Fraction(numerator, denominator, isPositive) {
    this.prototype = new BaseObject();
    this.numerator = numerator;
    this.denominator = denominator;
    this.isPositive = isPositive;

    this.toString = function () {
        this.prototype.registrationAction("toString", arguments);
        return `${this.isPositive ? "" : " - "} ${this.numerator} / ${this.denominator}`;
    };

    this.getNumerator = function () {
        this.prototype.registrationAction("getNumerator", arguments);
        return this.numerator;
    };

    this.setNumerator = function (value) {
        this.prototype.registrationAction("setNumerator", arguments);
        this.numerator = value;
    };

    this.getDenominator = function () {
        this.prototype.registrationAction("getDenominator", arguments);
        return this.denominator;
    };

    this.setDenominator = function (value) {
        this.prototype.registrationAction("setDenominator", arguments);
        this.denominator = value;
    };

    this.getSign = function () {
        return this.isPositive ? "positive" : "negative";
    }

    this.setSign = function (value) {
        this.isPositive = value === "positive";
    }

    this.add = function (fraction) {
        this.prototype.registrationAction("add", fraction);
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
        this.prototype.registrationAction("sub", fraction);
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
        this.prototype.registrationAction("mul", fraction);
        let numerator = this.numerator * fraction.numerator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.division = function (fraction) {
        this.prototype.registrationAction("division", fraction);
        let numerator = this.numerator * fraction.denominator;
        let denominator = this.denominator * fraction.numerator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        let result = new Fraction(numerator, denominator, isPositive);
        result.simplify();
        return result;
    };

    this.assignment = function (fraction) {
        this.prototype.registrationAction("assignment", fraction);
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

function getDefaultFraction() {
    let numerator = document.getElementById("numerator").value;
    let denominator = document.getElementById("denominator").value;
    let isPositive = document.getElementById("isPositiveSelect").value;
    return new Fraction(numerator, denominator, isPositive === "positive");
}

function addAction() {
    let action = {
        firstOperand: null, operation: operations[0].name, secondOperand: null, result: null
    }
    actions.push(action);
    updateActions();
}

function changeOperation(actionId, value) {
    let action = getAction(actionId);
    action.result = null;
    action.operation = value;
    updateActions();
}

function addFirstOperand(actionId) {
    let action = getAction(actionId);
    action.firstOperand = getDefaultFraction();
    updateActions();
}

function addSecondOperand(actionId) {
    let action = getAction(actionId);
    action.secondOperand = getDefaultFraction();
    updateActions();
}

function performAction(actionId) {
    let action = getAction(actionId);
    action.result = action.firstOperand[action.operation](action.secondOperand);
    updateActions();
}

function getAction(actionId) {
    return actions[actionId];
}

function updateActions() {
    let table = document.getElementById("operationsTable");
    table.innerHTML = "";
    actions.forEach((item, index) => {
        let row = getActionRow(item, index);
        table.append(row);
    })
}

function getActionRow(action, index) {
    let row = document.createElement("tr");

    let cell = getRegistrationActionButtonsCell(index);
    row.append(cell);

    cell = getFirstOperandCell(action, index);
    cell.className = "actionCell";
    row.append(cell);

    cell = getOperationCell(action, index);
    cell.className = "actionCell";
    row.append(cell);

    cell = getSecondOperandCell(action, index);
    cell.className = "actionCell";
    row.append(cell);

    if (action.firstOperand && action.secondOperand) {
        cell = getPerformActionButton(index);
        cell.className = "actionCell";
        row.append(cell);
    }

    if (action.result) {
        cell = getResultCell(action);
        cell.className = "actionCell";
        row.append(cell);
    }
    return row;
}

function getFirstOperandCell(action, index) {
    let cell = document.createElement("td");
    if (action.firstOperand) {
        cell.innerHTML = getFractionView(action.firstOperand, index, "first");
    } else {
        cell.innerHTML = `<button class="circleButton" onclick='addFirstOperand(${index})'>+</button>`;
    }
    return cell;
}

function getOperationCell(action, index) {
    function getOperationSelect(startValue, index) {
        return `<select class="operationSelect" onchange="changeOperation(${index}, value)">${operations.map((operation => {
            return `<option ${startValue === operation.name ? 'selected' : ''} value=${operation.name}>${operation.sign}</option>`
        })).join("")}</select>`
    }

    let cell = document.createElement("td");
    cell.innerHTML = getOperationSelect(action.operation, index);
    return cell;
}

function getSecondOperandCell(action, index) {
    let cell = document.createElement("td");
    if (action.secondOperand) {
        cell.innerHTML = getFractionView(action.secondOperand, index, "second");
    } else {
        cell.innerHTML = `<button class="circleButton"  onclick='addSecondOperand(${index})'>+</button>`;
    }
    return cell;
}

function getPerformActionButton(index) {
    let cell = document.createElement("td");
    cell.innerHTML = `<button onclick='performAction(${index})'>=</button>`
    return cell;
}

function getResultCell(action) {
    let cell;
    cell = document.createElement("td");
    cell.textContent = action.result;
    return cell;
}

function getRegistrationActionButtonsCell(index) {
    let cell = document.createElement("td");
    cell.innerHTML = `<div class="registrationActionButtons">
<button onclick="showRegistrationInfo(${index})">Список действий</button>
<button onclick="clearRegistrationInfo(${index})">Очистить список</button>
</div>`;
    return cell;
}

function showRegistrationInfo(index) {
    let action = getAction(index);
    if (action.firstOperand) {
        action.firstOperand.prototype.outputRegistrationActions();
    }
}

function clearRegistrationInfo(index) {
    let action = getAction(index);
    if (action.firstOperand) {
        action.firstOperand.prototype.clearRegistrationActions();
    }
}

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
    let actionId = str.split(":")[1];
    let action = getAction(actionId);
    if (operandOrder === "first") {
        action.firstOperand.setSign(value);
    }
    if (operandOrder === "second") {
        action.secondOperand.setSign(value);
    }
    action.result = null;
    updateActions();
}

function changeNumerator(str, value) {
    if(!isCorrectValue(value, "Числитель")){
        updateActions();
        return;
    }

    let operandOrder = str.split(":")[0];
    let actionId = str.split(":")[1];
    let action = getAction(actionId);

    if (operandOrder === "first") {
        action.firstOperand.setNumerator(value)
    }
    if (operandOrder === "second") {
        action.secondOperand.setNumerator(value)
    }
    action.result = null;
    updateActions();
}

function changeDenominator(str, value) {
    if(!isCorrectValue(value, "Знаменатель")){
        updateActions();
        return;
    }

    let operandOrder = str.split(":")[0];
    let actionId = str.split(":")[1];
    let action = getAction(actionId);

    if (operandOrder === "first") {
        action.firstOperand.setDenominator(value)
    }
    if (operandOrder === "second") {
        action.secondOperand.setDenominator(value)
    }
    action.result = null;
    updateActions();
}

function generateActions() {
    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFraction() {
        return new Fraction(getRandomValue(1, 10), getRandomValue(1, 10), getRandomValue(1, 2) === 1)
    }

    for (let i = 0; i < 10; i++) {
        let action = {
            firstOperand: getRandomFraction(),
            operation: operations[getRandomValue(0, operations.length - 1)].name,
            secondOperand: getRandomFraction(),
            result: null
        }

        action.result = action.firstOperand[action.operation](action.secondOperand);

        actions.push(action);
    }
    updateActions();
}

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