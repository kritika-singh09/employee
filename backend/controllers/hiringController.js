import Applicant from "../models/applicant.js";
import cloudinary from "../config/cloudinary.js";

// CREATE
const createApplicant = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;
    let resumeUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            public_id: `${Date.now()}-${req.file.originalname}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      resumeUrl = uploadResult.secure_url;
    }

    const newApplicant = new Applicant({
      name,
      email,
      phone,
      position,
      resumeUrl,
    });

    await newApplicant.save();
    res.status(201).json({ message: "Applicant created successfully", applicant: newApplicant });
  } catch (error) {
    res.status(500).json({ message: "Error creating applicant", error });
  }
};

// READ ALL
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error });
  }
};

// SEARCH
const searchApplicants = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Applicant.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};

// READ ONE
const getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });
    res.status(200).json(applicant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicant", error });
  }
};

// UPDATE
const updateApplicant = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;
    const updateData = { name, email, phone, position };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            public_id: `${Date.now()}-${req.file.originalname}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.resumeUrl = uploadResult.secure_url;
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedApplicant) return res.status(404).json({ message: "Applicant not found" });
    res.status(200).json({ message: "Applicant updated", applicant: updatedApplicant });
  } catch (error) {
    res.status(500).json({ message: "Error updating applicant", error });
  }
};

// DELETE
const deleteApplicant = async (req, res) => {
  try {
    const deleted = await Applicant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Applicant not found" });
    res.status(200).json({ message: "Applicant deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting applicant", error });
  }
};

// ✅ Named Exports
export {
  createApplicant,
  getAllApplicants,
  searchApplicants,
  getApplicantById,
  updateApplicant,
  deleteApplicant,
};
