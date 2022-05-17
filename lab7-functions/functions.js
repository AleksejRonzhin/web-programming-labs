function f1(x) {
    return (Math.pow(Math.cos(x - 5), 5) - Math.log(x))/(x + 5*Math.sin(x));
}

function f2(x) {
    return (Math.log(x - 5) - Math.pow(Math.log(x - 2), 3)) / (x + 5 * Math.sin(x));
}

function f3(x) {
    return (Math.pow(Math.E, 3) + x) / 6 + (Math.pow(x, 3) + 2 * x) / (4 * Math.sin(4 * x));
}

function getMaxValue(f) {
    let maxValue = f[0];
    f.forEach((value) => {
        if (maxValue.y < value.y) {
            maxValue = value;
        }
    })
    return maxValue;
}

function getNegativeCount(f) {
    return f.filter((value) => value.y < 0).length;
}

function isMonotonicDecreasing(f) {
    return f.every(((value, index, array) => index === 0 || array[index - 1].y >= array[index].y))
}

function defineCharacteristics(characteristics, a, b, h, f) {
    let array = [];
    for (let x = a; x < b + h / 2; x += h) {
        array.push({x: x, y: f(x)});
    }
    return characteristics.map((characteristic) => characteristic(array));
}