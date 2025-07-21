import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    employee: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Pending",
    },
  },
  {
    timestamps: false,
  }
);

const invoice = mongoose.model("Invoice", invoiceSchema);

export default invoice;
