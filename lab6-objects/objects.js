let employees = [];

let employeeSample = {
    fullName: {
        firstName: "Имя",
        secondName: "Отчество",
        lastName: "Фамилия"
    },
    birthDate: {
        day: "День",
        month: "Месяц",
        year: "Год"
    },
    phoneNumber: "Номер телефона",
    operator: "Оператор",
    workPlace: {
        organizationName: "Организация",
        position: "Должность",
        experience: "Опыт работы"
    }
}

function generateEmployees(n){
    let employee = {
        fullName: {
            firstName: "Алексей",
            secondName: "Владимирович",
            lastName: "Ронжин"
        },
        birthDate: {
            day: 10,
            month: 1,
            year: 2001
        },
        phoneNumber: "79006034911",
        workPlace: {
            organizationName: "Организация",
            position: "Должность",
            experience: 1
        }
    }
    employees.push(employee);
    updateTable();
}

function uploadJSON(){
    navigator.clipboard.writeText(JSON.stringify(employees)).then(r => window.alert("Успешно"));
}

function loadJSON(str){
    employees = JSON.parse(str);
    updateTable();
}

function updateTable(){
    let table = document.getElementById("employeesTable");
    table.innerText = "";
    let tableBody = document.createElement("tbody");

    let properties = getProperties(employeeSample);
    let headRow = getHeadRow(properties)
    tableBody.append(headRow);

    employees.forEach(employee => {
        let row = getRow(employee, properties);
        tableBody.append(row);
    });

    table.append(tableBody);
}

function getHeadRow(properties) {
    let row = document.createElement("tr");
    properties.forEach((value) => {
        let head = document.createElement("th");
        head.textContent = getValueByPropertyName(employeeSample, value);
        row.append(head);
    })
    return row;
}

function getRow(employee, properties){
    let row = document.createElement("tr");
    properties.forEach((propertyName => {
        let cell = document.createElement("td");
        cell.textContent = getValueByPropertyName(employee, propertyName);
        row.append(cell);
    }))
    return row;
}

function getValueByPropertyName(object, propertyName){
    for(let property in object){
        if(property === propertyName){
            return object[property];
        }
        if(isObject(object[property])){
            let value = getValueByPropertyName(object[property], propertyName);
            if(value){
                return value;
            }
        }
    }
    return null;
}

function getProperties(object){
    let properties = [];
    for(let property in object){
        if(isObject(object[property])){
            let innerProperties = getProperties(object[property]);
            properties = properties.concat(innerProperties);
            continue;
        }
        properties.push(property);
    }
    return properties;
}

function isObject(val) {
    return val instanceof Object;
}