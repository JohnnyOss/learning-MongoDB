const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

after(() => {
  mongoose.models = {};
});

describe('Employee', () => {
  it('should throw an error without any of arg', () => {
    const emp = new Employee({});
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it('should throw an error if any of arg is missing', () => {
    const cases = [
      {firstName: 'John', lastName: 'Doe'},
      {firstName: 'John', department: 'Marketing'},
      {lastName: 'Doe', department: 'Marketing'},
      {firstName: 'John'},
      {lastName: 'Doe'},
      {department: 'Marketing'},
    ];
    for(let test of cases) {
      const emp = new Employee({ test });
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });
  it('should throw an error if args are not a string', () => {
    const cases = [
      {firstName: {}, lastName: {}, department: {}},
      {firstName: [], lastName: [], department: []},
    ];
    for(let test of cases) {
      const emp = new Employee({ test });
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });
  it('should not throw an error if all args are okay', () => {
    const cases = [
      {firstName: 'John', lastName: 'Doe', department: 'Marketing'},
      {firstName: 'Amber', lastName: 'Morano', department: 'IT'}
    ];
    for(let test of cases) {
      const emp = new Employee(test);
      emp.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
});
