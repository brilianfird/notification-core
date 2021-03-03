const expect = require("chai").expect;
const sinon = require("sinon");

const verificationTokenService = require("../target/service/verification_token_service");
const verificationTokenRepository = require("../target/repository/verification_token_repository");

describe('save verificationToken', function() {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should be able to save', function(done) {
    let verificationToken = {merchantId:"merchantId", token: "token"};

    let verificationTokenEntity = {_id: "id", merchantId:"merchantId", token: "token"};
    sandbox.stub(verificationTokenRepository, 'saveVerificationTokenEntity')
    .withArgs(verificationToken)
    .resolves(verificationTokenEntity);

    verificationTokenService.saveVerificationToken(verificationToken)
      .then(res => {
        expect(res._id).to.equal(verificationTokenEntity._id);
        expect(res.name).to.equal(verificationTokenEntity.name);
        expect(res.merchantId).to.equal(verificationTokenEntity.merchantId);
        expect(verificationTokenRepository.saveVerificationTokenEntity.called).to.be.true;
        done();
      })
  })
})

describe('update verificationToken', function() {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should be able to update', function(done) {
    let verificationToken = {merchantId:"merchantId", token: "token"};

    let verificationTokenEntity = {_id: "id", merchantId:"merchantId", token: "token"};
    sandbox.stub(verificationTokenRepository, 'updateVerificationTokenEntity')
    .withArgs("id", verificationToken)
    .resolves(verificationTokenEntity);

    verificationTokenService.updateVerificationToken("id", verificationToken)
    .then(res => {
      expect(res._id).to.equal(verificationTokenEntity._id);
      expect(res.name).to.equal(verificationTokenEntity.name);
      expect(res.merchantId).to.equal(verificationTokenEntity.merchantId);
      expect(verificationTokenRepository.updateVerificationTokenEntity.called).to.be.true;
      done();
    })
  })
})

describe('get verificationToken by merchantId', function() {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should be able to get', function(done) {
    let verificationTokenEntity = {_id: "id", merchantId:"merchantId", token: "token"};
    sandbox.stub(verificationTokenRepository, 'getVerificationTokenEntityByMerchantId')
    .withArgs("merchantId")
    .resolves(verificationTokenEntity);

    verificationTokenService.getVerificationTokenByMerchantId("merchantId")
    .then(res => {
      expect(res._id).to.equal(verificationTokenEntity._id);
      expect(res.name).to.equal(verificationTokenEntity.name);
      expect(res.merchantId).to.equal(verificationTokenEntity.merchantId);
      expect(verificationTokenRepository.getVerificationTokenEntityByMerchantId.called).to.be.true;
      done();
    })
  })
})