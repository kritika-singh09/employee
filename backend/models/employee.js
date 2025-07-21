import mongoose from "mongoose";  // ✅ ESM import

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: String,
  department: String,
  salary: Number,
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;  // ✅ ESM export
