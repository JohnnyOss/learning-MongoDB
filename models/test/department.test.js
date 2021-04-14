const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

after(() => {
  mongoose.models = {};
});

describe('Department', () => {
  it('should throw an error without "name" arg', () => {
    const dep = new Department({});
    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });
  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for(let name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should throw an error when "name" arg lenght is not between 5-20 letters', () => {
    const cases = ['abc', 'abcd', 'Lorem Ipsum, Lorem Ip'];
    for(let name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should not throw an error if "name" arg is okay', () => {
    const cases = ['Lorem', 'Management', 'Lorem Ipsum, Lorem I'];
    for(let name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
});