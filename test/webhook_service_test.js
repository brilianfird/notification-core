const expect = require("chai").expect;
const sinon = require("sinon");

const webhookService = require("../target/service/webhook_service");
const webhookRepository = require("../target/repository/webhook_repository");

describe('webhook service', function () {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should be able to save', function (done) {
    let webhook = {
      enabled: "enabled",
      eventName: "eventName",
      _id: "id",
      merchantId: "merchantId",
      url: "url"
    }

    sandbox.stub(webhookRepository, 'saveWebhookEntity')
    .resolves(webhook)

    webhookService.saveWebhook(webhook)
    .then(res => {
      expect(res.id).to.equal("id");
      expect(webhookRepository.saveWebhookEntity.called).to.be.true;
      done();
    })
  })

  it('should be able to update', function (done) {
    let webhook = {
      enabled: "enabled",
      eventName: "eventName",
      _id: "id",
      merchantId: "merchantId",
      url: "url"
    }

    sandbox.stub(webhookRepository, 'updateWebhookEntity')
    .resolves(webhook)

    webhookService.updateWebhook("id", webhook)
    .then(res => {
      expect(res.id).to.equal("id");
      expect(webhookRepository.updateWebhookEntity.called).to.be.true;
      done();
    })
  })

  it('get webhook by merchantId', function (done) {
    let webhook = {
      enabled: "enabled",
      eventName: "eventName",
      _id: "id",
      merchantId: "merchantId",
      url: "url"
    }

    sandbox.stub(webhookRepository, 'getWebhookEntitiesByMerchantId')
    .resolves([webhook])

    webhookService.getWebhooksByMerchantId("merchantId")
    .then(res => {
      expect(res[0]._id).to.equal("id");
      expect(webhookRepository.getWebhookEntitiesByMerchantId.called).to.be.true;
      done();
    })
  })

  it('get webhook by merchantId and eventName', function (done) {
    let webhook = {
      enabled: "enabled",
      eventName: "eventName",
      _id: "id",
      merchantId: "merchantId",
      url: "url"
    }

    sandbox.stub(webhookRepository, 'getWebhookEntityByEventNameAndMerchantId')
    .resolves(webhook)

    webhookService.getWebhookByMerchantIdAndEventName("merchantId", "eventName")
    .then(res => {
      expect(res._id).to.equal("id");
      expect(webhookRepository.getWebhookEntityByEventNameAndMerchantId.called).to.be.true;
      done();
    })
  })
})