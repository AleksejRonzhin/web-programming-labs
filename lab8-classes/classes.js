let operations = [];

function BaseObject(){
    this.registrationActions = [];

    this.registrationAction = function(action, ...args){
        let time = new Date();
        this.registrationActions.push({
            action: action,
            time: time,
            args: args
        })
    }

    this.clearRegistrationActions = function (){
        this.registrationActions = [];
    }

    this.outputRegistrationActions = function(){
        console.log(this.registrationActions);
    }
}

function Fraction(numerator, denominator, isPositive){
    this.prototype = new BaseObject();
    this.numerator = numerator;
    this.denominator = denominator;
    this.isPositive = isPositive;

    this.toString = function(){
        this.prototype.registrationAction("toString", arguments);
        return `${this.isPositive? "": " - "} ${this.numerator} / ${this.denominator}`;
    };

    this.getNumerator = function() {
        this.prototype.registrationAction("getNumerator", arguments);
        return this.numerator;
    };

    this.setNumerator = function(value){
        this.prototype.registrationAction("setNumerator", arguments);
        this.numerator = value;
    };

    this.getDenominator = function(){
        this.prototype.registrationAction("getDenominator", arguments);
        return this.denominator;
    };

    this.setDenominator = function(value){
        this.prototype.registrationAction("setDenominator", arguments);
        this.denominator = value;
    };

    this.add = function(fraction){
        this.prototype.registrationAction("add", arguments);
        let numerator = (this.isPositive? 1: -1) * this.numerator * fraction.denominator
            + (fraction.isPositive? 1: -1) * fraction.numerator * this.denominator;
        let denominator = this.denominator * fraction.denominator;

        let isPositive = true;
        if (numerator < 0){
            isPositive = false;
            numerator *= -1;
        }
        return new Fraction(numerator, denominator, isPositive);
    };

    this.sub = function (fraction){
        this.prototype.registrationAction("sub", arguments);
        let addend = new Fraction(fraction.numerator, fraction.denominator, !fraction.isPositive);
        return this.add(addend);
    };

    this.mul = function (fraction){
        this.prototype.registrationAction("mul", arguments);
        let numerator = this.numerator * fraction.numerator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive * fraction.isPositive || !this.isPositive * !fraction.isPositive;
        return new Fraction(numerator, denominator, isPositive);
    };

    this.division = function (fraction){
        this.prototype.registrationAction("division", arguments);
        let inverseFraction = new Fraction(fraction.denominator, fraction.numerator, fraction.isPositive);
        return this.mul(inverseFraction);
    };

    this.assignment = function (fraction){
        this.prototype.registrationAction("assignment", fraction);
        this.numerator = fraction.numerator;
        this.denominator = fraction.denominator;
        this.isPositive = fraction.isPositive;
    };
}

function main(){
    let f3 = new Fraction(1, 2, true);
    let f4 = new Fraction(1, 2, false);
    console.log(f3.toString());
    console.log(f4.toString());
    f3.getNumerator();
    f3.setNumerator(12);
    let f5 = f3.add(f4);
    let f6 = f3.sub(f4);
    let f7 = f3.mul(f4);
    let f8 = f3.division(f4);
    console.log(f5.toString());
    console.log(f6.toString());
    console.log(f7.toString());
    console.log(f8.toString());
    f3.assignment(f4);
    let f9 = f3.division(f4);
    console.log(f9.toString());
    console.log(f9);
}

function getFraction(){
    let numerator = document.getElementById("numerator").value;
    let denominator = document.getElementById("denominator").value;

    return new Fraction(numerator, denominator, true);
}

function addOperation(){
    let operation = {
        firstOperand: null,
        operation: null,
        secondOperand: null,
        result: null
    }
    operations.push(operation);
    updateOperations();

}

function updateOperations(){
    let table = document.getElementById("operationsTable");
    table.innerHTML = "";
    operations.forEach((item, index) => {
        let row = document.createElement("tr");

        let cell = document.createElement("td");
        row.append(cell);
        if(item.firstOperand){
            cell.textContent = item.firstOperand;
        } else {
            cell.innerHTML = `<button onclick='addFirstOperand(${index})'>Создать объект</button>`;
        }
        cell = document.createElement("td");
        row.append(cell);
        cell.innerHTML = `<select id='operation${index}'><option value="add">+</option><option selected="selected" value="sub">-</option></select>`

        cell = document.createElement("td");
        row.append(cell);
        if(item.secondOperand){
            cell.textContent = item.secondOperand;
        } else {
            cell.innerHTML = `<button onclick='addSecondOperand(${index})'>Создать объект</button>`;
        }

        if(item.firstOperand && item.secondOperand){
            cell = document.createElement("td");
            row.append(cell);
            cell.innerHTML = `<button onclick='performOperation(${index})'>=</button>`
        }

        if(item.result){
            cell = document.createElement("td");
            row.append(cell);
            cell.textContent = item.result;
        }


        table.append(row);
    })
    //
    // let fraction = getFraction();
    // console.log(fraction);
}

function addFirstOperand(operationId){
    let operation = operations[operationId];
    operation.firstOperand = getFraction();
    updateOperations();
}

function addSecondOperand(operationId){
    let operation = operations[operationId];
    operation.secondOperand = getFraction();
    updateOperations();
}

function performOperation(operationId){
    let operation = operations[operationId];

    let action = document.getElementById(`operation${operationId}`).value;
    console.log(action);
    if (action === "add"){
        operation.result = operation.firstOperand.add(operation.secondOperand);
    }
    if(action === "sub"){
        operation.result = operation.firstOperand.sub(operation.secondOperand);
    }

    updateOperations();
}