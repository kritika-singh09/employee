import Employee from "../models/employee.js";

// ✅ CREATE
export async function createEmployee(req, res) {
  try {
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    let newIdNumber = 1;

    if (lastEmployee && lastEmployee.employeeId) {
      const lastId = parseInt(lastEmployee.employeeId.replace("EMP", ""));
      newIdNumber = lastId + 1;
    }

    const formattedId = `EMP${String(newIdNumber).padStart(3, "0")}`;

    const newEmployee = new Employee({
      ...req.body,
      employeeId: formattedId,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ READ ALL
export async function getAllEmployees(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ READ BY ID
export async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ UPDATE
export async function updateEmployee(req, res) {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ DELETE
export async function deleteEmployee(req, res) {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
