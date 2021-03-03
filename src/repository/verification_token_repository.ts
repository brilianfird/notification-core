import {VerificationTokenRequest} from "../model/inbound/verification_token_request";
import VerificationTokenModel, {VerificationToken} from "../model/entity/verification_token_entity";
import BusinessException from "../model/BusinessException";
import {EventResponse} from "../model/outbound/event_response";
import EventModel from "../model/entity/event_entity";
import {VerificationTokenResponse} from "../model/outbound/verification_token_response";

export async function saveVerificationTokenEntity(request: VerificationTokenRequest) {
  return new Promise<VerificationToken>(resolve => {
    const verificationToken: VerificationToken = {merchantId: request.merchantId, token: request.token}
    resolve(verificationToken);
  })
  .then(eventEntity => VerificationTokenModel.create(eventEntity))
  .then(eventEntity => eventEntity.toObject());

}

export async function updateVerificationTokenEntity(id: string, request: VerificationTokenRequest) {
    return new Promise<VerificationToken>((resolve, reject) => {
      VerificationTokenModel.findOne({"_id": id}, null, null, (err, doc) => {
        if (doc != null) {
          doc.merchantId = request.merchantId;
          doc.token = request.token;
          doc.save().then(res => resolve(res));
        } else {
          reject(new BusinessException("Document doesn't exist", 400));
        }
      })
    })
}

export async function getVerificationTokenEntityByMerchantId(merchantId: string) {
  return new Promise<VerificationTokenResponse>((resolve, reject) => {
    VerificationTokenModel.findOne({"merchantId": merchantId}, null, null, (err, doc) => {
      if (err != null) {
        reject(err)
      }
      if (doc == null) {
        return null;
      }
      resolve({_id: doc._id, merchantId: doc.merchantId, token: doc.token})
    })
  });
}