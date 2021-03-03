const expect = require("chai").expect;
const sinon = require("sinon");

const eventService = require("../target/service/event_service")
const webhookService = require('../target/service/webhook_service')
const verificationTokenService = require(
    '../target/service/verification_token_service')
const sendNotificationSender = require(
    '../target/outbound/SendNotificationSender')
const notificationService = require('../target/service/notification_service')
const notificationRepository = require(
    '../target/repository/notification_repository')

describe('processNotify method', function () {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should be success', function (done) {

    sandbox.stub(eventService, 'getEventByName')
    .withArgs("eventName")
    .resolves({_id: "id", name: "eventName", enabled: true});

    sandbox.stub(webhookService, 'getWebhookByMerchantIdAndEventName')
    .withArgs("eventName", "merchantId")
    .resolves({
      merchantId: "merchantId",
      url: "url",
      eventName: "eventName",
      enabled: true
    });

    sandbox.stub(verificationTokenService, 'getVerificationTokenByMerchantId')
    .withArgs("merchantId")
    .resolves({
      merchantId: "merchantId",
      token: "token"
    })

    sandbox.stub(sendNotificationSender, 'publishToSendNotificationQueue')
    .resolves(true);

    sandbox.stub(notificationRepository, 'saveNotificationEntity')
    .resolves(true);

    notificationService.processNotify(
        {merchantId: "merchantId", eventName: "eventName", body: {}})
    .then(response => {
      expect(response).to.be.true;
      expect(eventService.getEventByName.called).to.be.true;
      expect(webhookService.getWebhookByMerchantIdAndEventName.called).to.be.true;
      expect(verificationTokenService.getVerificationTokenByMerchantId.called).to.be.true;
      expect(sendNotificationSender.publishToSendNotificationQueue.called).to.be.true;
      expect(notificationRepository.saveNotificationEntity.called).to.be.true;
      done();
    })
  })

  it('should return error if event is disabled/empty', function (done) {

    sandbox.stub(eventService, 'getEventByName')
    .withArgs("eventName")
    .resolves({_id: "id", name: "eventName", enabled: false});

    notificationService.processNotify(
        {merchantId: "merchantId", eventName: "eventName", body: {}})
    .catch(err => {
      expect(err.message).to.be.equal("Invalid event");
      expect(eventService.getEventByName.called).to.be.true;
      done();
    })
  })

  it('should return error if webhook doesnt exist, function (done)', function(done) {

    sandbox.stub(eventService, 'getEventByName')
    .withArgs("eventName")
    .resolves({_id: "id", name: "eventName", enabled: true});

    sandbox.stub(webhookService, 'getWebhookByMerchantIdAndEventName')
    .withArgs("eventName", "merchantId")
    .resolves(null);


    notificationService.processNotify(
        {merchantId: "merchantId", eventName: "eventName", body: {}})
    .catch(err => {
      expect(eventService.getEventByName.called).to.be.true;
      expect(webhookService.getWebhookByMerchantIdAndEventName.called).to.be.true;
      expect(err.message).to.be.equal("Invalid webhook");
      done();
    })
  })

  it('should return error if verification token doesnt exist', function (done) {

    sandbox.stub(eventService, 'getEventByName')
    .withArgs("eventName")
    .resolves({_id: "id", name: "eventName", enabled: true});

    sandbox.stub(webhookService, 'getWebhookByMerchantIdAndEventName')
    .withArgs("eventName", "merchantId")
    .resolves({
      merchantId: "merchantId",
      url: "url",
      eventName: "eventName",
      enabled: true
    });

    sandbox.stub(verificationTokenService, 'getVerificationTokenByMerchantId')
    .withArgs("merchantId")
    .resolves(null);

    notificationService.processNotify(
        {merchantId: "merchantId", eventName: "eventName", body: {}})
    .catch(err => {
      expect(eventService.getEventByName.called).to.be.true;
      expect(webhookService.getWebhookByMerchantIdAndEventName.called).to.be.true;
      expect(verificationTokenService.getVerificationTokenByMerchantId.called).to.be.true;
      expect(err.message).to.be.equal("Invalid token");
      done();
    })
  })
})

describe('resendNotificationByCallbackId', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return expected response', function(done) {

    let date = new Date();
    const notification = {
      body: {},
      callbackId: "callbackId",
      token: "token",
      timestamp: date,
      url: 'url',
      merchantId: "merchantId"
    }

    sandbox.stub(notificationRepository, 'getNotificationEntityByCallbackId')
      .withArgs("callbackId")
      .resolves(notification);

    sandbox.stub(sendNotificationSender, 'publishToSendNotificationQueue')
      .withArgs(notification)
      .resolves(true);

    notificationService.resendNotificationByCallbackId("callbackId")
      .then(res => {
        expect(res).to.be.true;
        expect(notificationRepository.getNotificationEntityByCallbackId.called).to.be.true;
        expect(sendNotificationSender.publishToSendNotificationQueue.called).to.be.true;
        done()
      })
  })

  it('should throw error if notification is null', function(done) {

    sandbox.stub(notificationRepository, 'getNotificationEntityByCallbackId')
    .withArgs("callbackId")
    .resolves(null);

    notificationService.resendNotificationByCallbackId("callbackId")
    .catch(err => {
      expect(err.message).to.equals("invalid callback id");
      expect(notificationRepository.getNotificationEntityByCallbackId.called).to.be.true;
      done()
    })
  })
})

describe('getNotificationByMerchantId method', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return expected response', function() {
    let date = new Date();
    const notification = {
      body: {},
      callbackId: "callbackId",
      token: "token",
      timestamp: date,
      url: 'url',
      merchantId: "merchantId"
    }

    sandbox.stub(notificationRepository, 'getNotificationEntitiesByMerchantId')
    .withArgs("merchantId")
    .resolves([notification]);

    notificationService.getNotificationByMerchantId('merchantId')
      .then(res => {
        expect(res).to.equals(notification);
        expect(notificationRepository.getNotificationEntitiesByMerchantId.called).to.be.true;
        done();
      })
  })
});