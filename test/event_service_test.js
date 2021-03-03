const expect = require("chai").expect;
const sinon = require("sinon");

const eventService = require("../target/service/event_service")
const eventRepository = require("../target/repository/event_repository")

describe("saveEvent method", function () {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it("should return success", function (done) {
    const eventRequest = {name: "eventName", enabled: true}

    sandbox.stub(eventRepository, 'saveEventEntity')
      .withArgs(eventRequest)
      .resolves({_id: "id", name: "eventName", enabled: true});

    eventService.saveEvent(eventRequest)
      .then(response => {
        expect(response._id).to.equal("id")
        expect(response.name).to.equal("eventName")
        expect(response.enabled).to.equal(true)
        expect(eventRepository.saveEventEntity.called).to.be.true;
        done();
      })
  });

  it("should returns throw error", function (done) {
    const eventRequest = {name: "eventName", enabled: true}

    sandbox.stub(eventRepository, 'saveEventEntity')
    .withArgs(eventRequest)
      .rejects("error mongo");

    eventService.saveEvent(eventRequest)
      .catch(err => {
        expect(eventRepository.saveEventEntity.called).to.be.true;
        done();
      });
  });
})

describe('updateEventEntity method', function () {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should returns success', function (done) {
    const eventRequest = {name: "eventName", enabled: true}

    sandbox.stub(eventRepository, 'updateEventEntity')
    .withArgs("id", eventRequest)
      .resolves({_id: "id", name: "eventName", enabled: true})

    eventService.updateEvent("id", eventRequest)
      .then(response => {
        expect(response._id).to.equal("id")
        expect(response.name).to.equal("eventName")
        expect(response.enabled).to.equal(true)
        expect(eventRepository.updateEventEntity.called).to.be.true;
        done();
      })
  });

  it('should throw error', function (done) {
    const eventRequest = {name: "eventName", enabled: true}

    sandbox.stub(eventRepository, 'updateEventEntity')
    .withArgs("id", eventRequest)
    .rejects("error")

    eventService.updateEvent("id", eventRequest)
    .catch(err => {
      expect(eventRepository.updateEventEntity.called).to.be.true;
      done();
    })
  });
});

describe('getAllEventsMethod', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return success', function(done) {
    sandbox.stub(eventRepository, 'getAllEventEntities')
      .resolves([{_id: "id", name: "eventName", enabled: true}])

    eventService.getAllEvents()
      .then(res => {
        let response = res[0];
        expect(response._id).to.equal("id")
        expect(response.name).to.equal("eventName")
        expect(response.enabled).to.equal(true)
        expect(eventRepository.getAllEventEntities.called).to.be.true;
        done();
      })
  })
})

describe('getEventById', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return success', function(done) {
    sandbox.stub(eventRepository, 'getEventEntity')
      .resolves({_id: "id", name: "eventName", enabled: true})

    eventService.getEventById("merchantId")
      .then(response => {
        expect(response._id).to.equal("id")
        expect(response.name).to.equal("eventName")
        expect(response.enabled).to.equal(true)
        expect(eventRepository.getEventEntity.called).to.be.true;
        done();
      })
  })

  it('should return null', function(done) {
    sandbox.stub(eventRepository, 'getEventEntity')
    .resolves(null)

    eventService.getEventById("merchantId")
    .then(response => {
      expect(response).to.equal(null);
      expect(eventRepository.getEventEntity.called).to.be.true;
      done();
    })
  })
})

describe('getEventByName', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return success', function(done) {
    sandbox.stub(eventRepository, 'getEventEntityByName')
    .resolves({_id: "id", name: "eventName", enabled: true})

    eventService.getEventByName("eventName")
    .then(response => {
      expect(response._id).to.equal("id")
      expect(response.name).to.equal("eventName")
      expect(response.enabled).to.equal(true)
      expect(eventRepository.getEventEntityByName.called).to.be.true;
      done();
    })
  })

  it('should return null', function(done) {
    sandbox.stub(eventRepository, 'getEventEntityByName')
    .resolves(null)

    eventService.getEventByName("eventName")
    .then(response => {
      expect(response).to.equal(null);
      expect(eventRepository.getEventEntityByName.called).to.be.true;
      done();
    })
  })
})
