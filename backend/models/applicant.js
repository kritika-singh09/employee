// import { Schema, model } from "mongoose";

// const applicantSchema = new Schema({
//   name: String,
//   email: String,
//   phone: String,
//   position: String,
//   resumeUrl: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default model("Applicant", applicantSchema);
import { Schema, model } from "mongoose";

const applicantSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  position: String,
  resumeUrl: String,
}, { timestamps: true }); // ✅ Automatically handles createdAt & updatedAt

export default model("Applicant", applicantSchema);
