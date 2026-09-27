import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  name: string;
  uid: string;
  branch: string;
  division: string;
  phone: string;
  email: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    uid: {
      type: String,
      required: [true, "College UID is required"],
      trim: true,
      unique: true,
      index: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
      enum: ["Div A", "Div B", "Div C", "Div D", "Div E", "Div F", "Div G", "Div H"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "College email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Registration: Model<IRegistration> =
  mongoose.models.AarambhRegistration ||
  mongoose.model<IRegistration>("AarambhRegistration", RegistrationSchema, "Aarambh Registrations");

export default Registration;
