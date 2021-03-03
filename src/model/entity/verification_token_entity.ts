import {Model, model, Schema, Document} from "mongoose";

const verificationTokenSchema = new Schema<VerificationTokenDocument, VerificationTokenModel>({
  merchantId: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  }
});

export interface VerificationToken {
  merchantId: string,
  token: string
}

interface VerificationTokenDocument extends VerificationToken, Document {
  merchantId: string,
  token: string
}

export interface VerificationTokenModel extends Model<VerificationTokenDocument> {

}


export default model<VerificationTokenDocument, VerificationTokenModel>("VerificationToken", verificationTokenSchema)