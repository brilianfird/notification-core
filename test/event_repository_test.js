// const expect = require("chai").expect;
// const sinon = require("sinon");
// const EventModel=require('../target/model/entity/event_entity');
//
// const eventRepository = require("../target/repository/event_repository")
//
// describe('saveEventEntity method', function () {
//
//   let sandbox = null;
//
//   beforeEach(() => {
//     sandbox = sinon.createSandbox();
//   })
//
//   afterEach(() => {
//     sandbox.restore();
//   })
//
//   it('should save successfully', function(done) {
//     const eventRequest = {name: "eventName", enabled: true};
//
//     sandbox.stub(EventModel.prototype, 'create')
//     .resolves({_id: "id", name: "eventName", enabled: true});
//
//     eventRepository.saveEventEntity(eventRequest)
//     .then(val => {
//       done();
//     })
//   })
// });