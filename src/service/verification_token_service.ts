import {VerificationTokenRequest} from "../model/inbound/verification_token_request";
import {
  getVerificationTokenEntityByMerchantId,
  saveVerificationTokenEntity,
  updateVerificationTokenEntity
} from "../repository/verification_token_repository";
import {v4 as uuidv4} from 'uuid';

export async function saveVerificationToken(request: VerificationTokenRequest) {
  if(request.token == null) {
    request.token = uuidv4();
  }

  return saveVerificationTokenEntity(request)
  .then(obj => {
    return {_id: obj._id, merchantId: obj.merchantId, token: obj.token}
  })
}

export async function updateVerificationToken(id: string, request: VerificationTokenRequest) {
  return updateVerificationTokenEntity(id, request)
    .then(res => {
      return {_id: id, merchantId: res.merchantId, token: res.token}
    })
}

export async function getVerificationTokenByMerchantId(merchantId: string) {
  return getVerificationTokenEntityByMerchantId(merchantId);
}