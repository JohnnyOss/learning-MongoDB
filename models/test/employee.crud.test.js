const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  after(() => {
    mongoose.models = {};
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Marian', lastName: 'Paździoch', department: 'Bazar' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Kopeć', department: 'Szczęka' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee1 = await Employee.findOne({ firstName: 'Helena' });
      const employee2 = await Employee.findOne({ lastName: 'Paździoch' });
      const employee3 = await Employee.findOne({ department: 'Bazar' });
      const expectedFirstName = 'Helena';
      const expectedLastName = 'Paździoch';
      const expectedDepartment = 'Bazar';
      expect(employee1.firstName).to.be.equal(expectedFirstName);
      expect(employee2.lastName).to.be.equal(expectedLastName);
      expect(employee3.department).to.be.equal(expectedDepartment);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Marian', lastName: 'Paździoch', department: 'Bazar' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Marian', lastName: 'Paździoch', department: 'Bazar' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Kopeć', department: 'Szczęka' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Marian' }, { $set: { firstName: '=Marian=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=Marian=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Marian' });
      employee.firstName = '=Marian='
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: '=Marian=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(2);
    });
  
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Marian', lastName: 'Paździoch', department: 'Bazar' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Kopeć', department: 'Szczęka' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Marian' });
      const deletedEmployee = await Employee.findOne({ firstName: 'Marian' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Marian' });
      await employee.remove();
    
      const deletedEmployee = await Employee.findOne({ firstName: 'Marian' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});