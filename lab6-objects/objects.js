let employees = [];

const lastNames = ["Иванов", "Петров", "Соколов", "Сидоров", "Мухин", "Антонов", "Волков", "Медведев"];
const firstNames = ["Иван", "Алексей", "Максим", "Павел", "Андрей", "Тимур", "Дмитрий", "Никита"];
const secondNames = ["Иванович", "Алексеевич", "Максимович", "Павлович", "Андреевич", "Тимурович"];
const organizations = ["EPAM", "Сбертех", "Тинькофф", "Провавтоматика", "Программный регион"];
const positions = ["Стажер", "Разработчик", "Тестировщик", "Аналитик", "Руководитель проекта"];
const mobileOperators = [{name: "Билайн", code: "905"}, {name: "МТС", code: "915"}, {
    name: "Мегафон", code: "920"
}, {name: "Tele2", code: "900"}];


function generateEmployees(n) {
    employees = [];
    for (let i = 0; i < n; i++) {
        let employee = generateEmployee();
        employees.push(employee);
    }
    updateTable(employees);
}

function generateEmployee() {
    function arrayRandElement(arr) {
        let rand = Math.floor(Math.random() * arr.length);
        return arr[rand];
    }

    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomPhone() {
        return `7 (${arrayRandElement(mobileOperators).code}) ${getRandomValue(100, 999)} ${getRandomValue(10, 99)} ${getRandomValue(10, 99)}`
    }

    return {
        fullName: {
            firstName: arrayRandElement(firstNames),
            secondName: arrayRandElement(secondNames),
            lastName: arrayRandElement(lastNames)
        }, birthDate: {
            day: getRandomValue(0, 28), month: getRandomValue(1, 12), year: getRandomValue(1980, 2001)
        }, phoneNumber: getRandomPhone(), workPlace: {
            organizationName: arrayRandElement(organizations),
            position: arrayRandElement(positions),
            experience: getRandomValue(1, 10)
        }
    }
}

function updateTable(employees) {
    let table = document.getElementById("employeesTable");
    printTable(table, employees);
    if (n.value > 0) {
        document.getElementById("findEmployees").hidden = false;
        document.getElementById("findEmployeesTable").innerText = "";
    }
}

function printTable(container, employees) {
    container.innerText = "";
    let tableBody = document.createElement("tbody");

    let employeesHasOperators = employees.some((employee) => employee.hasOwnProperty("operator"));
    tableBody.append(getHeadRow(employeesHasOperators));
    tableBody.append(getDetailedHeadRow());
    employees.forEach(employee => {
        tableBody.append(getRow(employee, employeesHasOperators))
    })
    container.append(tableBody);
}

function getHeadRow(employeesHasOperators) {
    function appendFullName(row) {
        let cell = document.createElement("th");
        cell.colSpan = 3;
        cell.textContent = "ФИО";
        row.append(cell);
    }

    function appendBirthDate(row) {
        let cell = document.createElement("th");
        cell.rowSpan = 2;
        cell.textContent = "Дата рождения";
        row.append(cell);
    }

    function appendPhoneNumber(row) {
        let cell = document.createElement("th");
        cell.rowSpan = 2;
        cell.textContent = "Номер телефона";
        row.append(cell);
    }

    function appendOperator(row) {
        let cell = document.createElement("th");
        cell.rowSpan = 2;
        cell.textContent = "Оператор";
        row.append(cell);
    }

    function appendWorkPlace(row) {
        let cell = document.createElement("th");
        cell.colSpan = 3;
        cell.textContent = "Место работы";
        row.append(cell);
    }

    let row = document.createElement("tr");
    appendFullName(row);
    appendBirthDate(row);
    appendPhoneNumber(row);
    if (employeesHasOperators) {
        appendOperator(row);
    }
    appendWorkPlace(row);
    return row;
}

function getDetailedHeadRow() {
    function appendFullName(row) {
        let cell = document.createElement("th");
        cell.textContent = "Фамилия"
        row.append(cell);
        cell = document.createElement("th");
        cell.textContent = "Имя"
        row.append(cell);
        cell = document.createElement("th");
        cell.textContent = "Отчество"
        row.append(cell);
    }

    function appendWorkPlace(row) {
        let cell = document.createElement("th");
        cell.textContent = "Организация";
        row.append(cell);
        cell = document.createElement("th");
        cell.textContent = "Должность";
        row.append(cell);
        cell = document.createElement("th");
        cell.textContent = "Стаж";
        row.append(cell);
    }

    let row = document.createElement("tr");
    appendFullName(row);
    appendWorkPlace(row);
    return row;
}

function getRow(employee, employeesHasOperators) {
    function appendFullName(row, fullName) {
        let cell = document.createElement("td");
        cell.textContent = fullName.lastName;
        row.append(cell);
        cell = document.createElement("td");
        cell.textContent = fullName.firstName;
        row.append(cell);
        cell = document.createElement("td");
        cell.textContent = fullName.secondName;
        row.append(cell);
    }

    function appendBirthDate(row, birthDate) {
        let cell = document.createElement("td");
        if (birthDate) {
            cell.textContent = `${birthDate.day}.${birthDate.month}.${birthDate.year}`
        }
        row.append(cell);
    }

    function appendPhoneNumber(row, phoneNumber) {
        let cell = document.createElement("td");
        cell.textContent = phoneNumber;
        row.append(cell);
    }

    function appendOperator(row, operator) {
        let cell = document.createElement("td");
        cell.textContent = operator;
        row.append(cell);
    }

    function appendWorkPlace(row, workPlace) {
        let cell = document.createElement("td");
        cell.textContent = workPlace.organizationName;
        row.append(cell);
        cell = document.createElement("td");
        cell.textContent = workPlace.position;
        row.append(cell);
        cell = document.createElement("td");
        cell.textContent = workPlace.experience;
        row.append(cell);
    }

    let row = document.createElement("tr");
    appendFullName(row, employee.fullName);
    appendBirthDate(row, employee.birthDate);
    appendPhoneNumber(row, employee.phoneNumber);
    if (employeesHasOperators) {
        appendOperator(row, employee.operator);
    }
    appendWorkPlace(row, employee.workPlace);
    return row;
}

function findEmployees() {
    let orgName = document.getElementById("orgName").value;
    let position = document.getElementById("position").value;
    let minExperience = document.getElementById("minExperience").value;
    let maxExperience = document.getElementById("maxExperience").value;

    // Проверка значений

    let filterEmployees = employees;
    if (orgName) {
        filterEmployees = filterEmployees.filter((value => {
            return value.workPlace.organizationName === orgName;
        }))
    }

    if (position) {
        filterEmployees = filterEmployees.filter((value => {
            return value.workPlace.position === position;
        }))
    }

    if (minExperience || maxExperience) {
        filterEmployees = filterEmployees.filter((value => {
            return value.workPlace.experience >= minExperience && value.workPlace.experience <= maxExperience;
        }))
    }


    let table = document.getElementById("findEmployeesTable");
    printTable(table, filterEmployees);
}

function removeBirthDateInfo(minExperience) {
    employees.forEach((employee => {
        if (employee.workPlace.experience < minExperience) {
            delete employee.birthDate;
        }
    }))
    updateTable(employees);
}

function addOperator() {
    mobileOperators.forEach(mobileOperator => {
        employees.forEach(employee => {
            if (employee.phoneNumber.includes(`(${mobileOperator.code})`)) {
                employee.operator = mobileOperator.name;
            }
        })
    })
    updateTable(employees);
}

// let properties = getProperties(employeeSample);
// let headRow = getHeadRow(properties)
// tableBody.append(headRow);
//
// employees.forEach(employee => {
//     let row = getRow(employee, properties);
//     tableBody.append(row);
// });
// let employeeSample = {
//     fullName: {
//         firstName: "Имя", secondName: "Отчество", lastName: "Фамилия",
//     }, birthDate: {
//         day: "День", month: "Месяц", year: "Год",
//     }, phoneNumber: "Номер телефона", workPlace: {
//         organizationName: "Организация", position: "Должность", experience: "Опыт работы"
//     }
// }
// function getHeadRow(properties) {
//     let row = document.createElement("tr");
//     properties.forEach((value) => {
//         let head = document.createElement("th");
//         head.textContent = getValueByPropertyName(employeeSample, value);
//         row.append(head);
//     })
//     return row;
// }
//
// function getRow(employee, properties){
//     let row = document.createElement("tr");
//     properties.forEach((propertyName => {
//         let cell = document.createElement("td");
//         cell.textContent = getValueByPropertyName(employee, propertyName);
//         row.append(cell);
//     }))
//     return row;
// }
//
// function getValueByPropertyName(object, propertyName){
//     for(let property in object){
//         if(property === propertyName){
//             return object[property];
//         }
//         if(isObject(object[property])){
//             let value = getValueByPropertyName(object[property], propertyName);
//             if(value){
//                 return value;
//             }
//         }
//     }
//     return null;
// }
//
// function getProperties(object){
//     let properties = [];
//     for(let property in object){
//         if(isObject(object[property])){
//             let innerProperties = getProperties(object[property]);
//             properties = properties.concat(innerProperties);
//             continue;
//         }
//         properties.push(property);
//     }
//     return properties;
// }
//
// function isObject(val) {
//     return val instanceof Object;
// }

function uploadJSON() {
    navigator.clipboard.writeText(JSON.stringify(employees, null, 4))
        .then(() => window.alert("JSON скопирован в буфер обмена"));
}

function loadJSON(str) {
    let oldEmployees = employees;
    try {
        employees = JSON.parse(str);
        try {
            updateTable(employees);
            n.value = employees.length;
        } catch (e) {
            window.alert("JSON не соответствует программе")
            employees = oldEmployees;
            updateTable(employees);
        }
    } catch (e) {
        window.alert("Во время десериализации произошла ошибка")
    }
}