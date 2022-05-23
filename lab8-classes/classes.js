class BaseObject{
    constructor() {
        this.registrationActions = [];
    }

    registrationAction(){

    }
    clearRegistrationActions(){
        this.registrationActions = [];
    }
    outputRegistrationActions(){
        console.log("output");
    }
}

function Fraction(numerator, denominator, isPositive){
    this.numerator = numerator;
    this.denominator = denominator;
    this.isPositive = isPositive;
    this.prototype = BaseObject.prototype;
    this.toString = () => {
        return `${this.isPositive? "": " - "} ${this.numerator} / ${this.denominator}`;
    }
    this.getNumerator = () => {
        return this.numerator;
    }
    this.setNumerator = (value) => {
        this.numerator = value;
    }
    this.getDenominator = () => {
        return this.denominator;
    }
    this.setDenominator = (value) => {
        this.denominator = value;
    }
    this.add = (fraction) => {
        let numerator = this.numerator * fraction.denominator + fraction.numerator * this.denominator;
        let denominator = this.denominator * fraction.denominator;
        let isPositive = this.isPositive && fraction.isPositive || !this.isPositive && !fraction.isPositive;

        return new Fraction(numerator, denominator, isPositive);
    }
    this.sub = (fraction) => {

    }
    this.mul = (fraction) => {

    }
    this.division = (fraction) => {

    }
    this.assignment = (fraction) => {
        this.numerator = fraction.numerator;
        this.denominator = fraction.denominator;
        this.isPositive = fraction.isPositive;
    }
}

Object.setPrototypeOf(Fraction, BaseObject.prototype)

function main(){
    let f3 = new Fraction(2, 3, true);
    let f4 = new Fraction(3, 5, false);
    let f5 = f3.add(f4);
    console.log(f5.toString());
}