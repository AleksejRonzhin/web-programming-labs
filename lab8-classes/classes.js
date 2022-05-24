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
}]

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

    this.add = function (fraction) {
        this.prototype.registrationAction("add", arguments);
        let numerator = (this.isPositive ? 1 : -1) * this.numerator * fraction.denominator + (fraction.isPositive ? 1 : -1) * fraction.numerator * this.denominator;
        let denominator = this.denominator * fraction.denominator;

        let isPositive = true;
        if (numerator < 0) {
            isPositive = false;
            numerator *= -1;
        }
        return new Fraction(numerator, denominator, isPositive);
    };

    this.sub = function (fraction) {
        this.prototype.registrationAction("sub", arguments);
        let addend = new Fraction(fraction.numerator, fraction.denominator, !fraction.isPositive);
        return this.add(addend);
    };

    this.mul = function (fraction) {
        this.prototype.registrationAction("mul", arguments);
        let numerator = this.numerator * fraction.numerator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        return new Fraction(numerator, denominator, isPositive);
    };

    this.division = function (fraction) {
        this.prototype.registrationAction("division", arguments);
        let inverseFraction = new Fraction(fraction.denominator, fraction.numerator, fraction.isPositive);
        return this.mul(inverseFraction);
    };

    this.assignment = function (fraction) {
        this.prototype.registrationAction("assignment", fraction);
        this.numerator = fraction.numerator;
        this.denominator = fraction.denominator;
        this.isPositive = fraction.isPositive;
    };
}

function getFraction() {
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
    action.firstOperand = getFraction();
    updateActions();
}

function addSecondOperand(actionId) {
    let action = getAction(actionId);
    action.secondOperand = getFraction();
    updateActions();
}

function performAction(actionId) {
    let action = getAction(actionId);
    action.result = action.firstOperand[action.operation](action.secondOperand);
    updateActions();
}

function getAction(actionId){
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

function getActionRow(action, index){
    let row = document.createElement("tr");
    row.className = "actionRow";

    let cell = getFirstOperandCell(action, index);
    row.append(cell);

    cell = getOperationCell(action, index);
    row.append(cell);

    cell = getSecondOperandCell(action, index);
    row.append(cell);

    if (action.firstOperand && action.secondOperand) {
        cell = getPerformActionButton(index);
        row.append(cell);
    }

    if (action.result) {
        cell = getResultCell(action);
        row.append(cell);
    }

    return row;
}

function getFirstOperandCell(action, index){
    let cell = document.createElement("td");
    if (action.firstOperand) {
        cell.textContent = action.firstOperand;
        cell.innerHTML = getFractionView(action.firstOperand, index, "first");
    } else {
        cell.innerHTML = `<button class="circleButton" onclick='addFirstOperand(${index})'>+</button>`;
    }
    return cell;
}

function getOperationCell(action, index){
    function getOperationSelect(startValue, index) {
        return `<select onchange="changeOperation(${index}, value)">${operations.map((operation => {
            return `<option ${startValue === operation.name ? 'selected' : ''} value=${operation.name}>${operation.sign}</option>`
        })).join("")}</select>`
    }

    let cell = document.createElement("td");
    cell.innerHTML = getOperationSelect(action.operation, index);
    cell.className = "operationCell";
    return cell;
}

function getSecondOperandCell(action, index){
    let cell = document.createElement("td");
    if (action.secondOperand) {
        cell.textContent = action.secondOperand;
        cell.innerHTML = getFractionView(action.secondOperand, index, "second");
    } else {
        cell.innerHTML = `<button class="circleButton"  onclick='addSecondOperand(${index})'>+</button>`;
    }
    return cell;
}

function getPerformActionButton(index){
    let cell = document.createElement("td");
    cell.innerHTML = `<button onclick='performAction(${index})'>=</button>`
    return cell;
}

function getResultCell(action){
    let cell;
    cell = document.createElement("td");
    cell.textContent = action.result;
    return cell;
}

function getFractionView(fraction, index, operandOrder){
    return `<table class="fraction">
                <tr>
                    <td rowspan="3" class="sign">
                        <label>
                            <select>
                                <option value="positive">+</option>
                                <option value="negative">-</option>
                            </select>
                        </label>
                    </td>
                    <td><input class="parameterInput" type="text" value="${fraction.numerator}" oninput="changeNumerator('${operandOrder}:${index}', value)"></td>
                </tr>
                <tr>
                    <td><hr color="black"/></td>
                </tr>
                <tr>
                    <td>
                        <input class="parameterInput" id="denominator" type="text" value="${fraction.denominator}" oninput="changeDenominator('${operandOrder}:${index}', value)">
                    </td>
                </tr>
            </table>`;
}

function changeNumerator(str, value){
    let operandOrder = str.split(":")[0];
    let actionId = str.split(":")[1];
    let action = getAction(actionId);
    if(operandOrder === "first"){
        action.firstOperand.setNumerator(value)
    }
    if(operandOrder === "second"){
        action.secondOperand.setNumerator(value)
    }
    updateActions();
}

function changeDenominator(str, value){
    let operandOrder = str.split(":")[0];
    let actionId = str.split(":")[1];
    let action = getAction(actionId);
    if(operandOrder === "first"){
        action.firstOperand.setDenominator(value)
    }
    if(operandOrder === "second"){
        action.secondOperand.setDenominator(value)
    }
    updateActions();
}