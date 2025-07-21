import express from "express";
import {
  createApplicant,
  getAllApplicants,
  searchApplicants,
  getApplicantById,
  updateApplicant,
  deleteApplicant,
} from "../controllers/hiringController.js";

const router = express.Router();

// Define routes
router.post("/", createApplicant);
router.get("/all", getAllApplicants); // ✅ This should match '/api/hire/all'
router.get("/search", searchApplicants);
router.get("/:id", getApplicantById);
router.put("/:id", updateApplicant);
router.delete("/:id", deleteApplicant);

export default router;
