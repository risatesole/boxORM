class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getAlcohol() {
    if (this.age >= 21) {
      return `${this.name} (age ${this.age}) can buy alcohol.`;
    } else {
      return `${this.name} (age ${this.age}) is too young to buy alcohol.`;
    }
  }
}

// Create a factory function
function createPerson() {
  return function(name, age) {
    return new Person(name, age);
  };
}

// Create the constructor only once
const personFactory = createPerson();

// Create multiple people
const Alice = personFactory('alice', 24);
const Bob = personFactory('bob', 18);

console.log(Alice.getAlcohol()); // "alice (age 24) can buy alcohol."
console.log(Bob.getAlcohol());   // "bob (age 18) is too young to buy alcohol."