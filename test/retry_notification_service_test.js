const expect = require("chai").expect;
const sinon = require("sinon");

const retryNotificationService = require('../target/service/retry_notification_service')
const retryNotificationRepository = require('../target/repository/retry_notification_repository')
const notificationService = require('../target/service/notification_service')

describe('saveRetryNotification', function () {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return expected response', function(done) {
    let date = new Date();
    let retryNotification = {callbackId: "callbackId", nextRetry: date};
    sandbox.stub(retryNotificationRepository, 'saveRetryNotificationEntity')
    .resolves(retryNotification)

    retryNotificationService.saveRetryNotification({callbackId: "callbackId"})
    .then(res => {
      expect(res).to.equals(retryNotification);
      expect(retryNotificationRepository.saveRetryNotificationEntity.called).to.be.true;
      done();
    })

  })
})

describe('runRetryNotification', function() {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should return true', function(done) {
    sandbox.stub(retryNotificationRepository, 'getAndRemoveAllNotificationEntitiesWithNextRetryLeastThanNow')
    .resolves([{"callbackId":"callbackId"}]);

    sandbox.stub(notificationService, 'resendNotificationByCallbackId')
    .withArgs("callbackId")
    .resolves(true);

    retryNotificationService.runRetryNotifications()
      .then(res => {
        expect(res).to.be.true;
        expect(retryNotificationRepository.getAndRemoveAllNotificationEntitiesWithNextRetryLeastThanNow.called).to.be.true;
        expect(notificationService.resendNotificationByCallbackId.called).to.be.true;
        done();
      })
  })
})

