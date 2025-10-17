import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import hiringRoutes from "./routes/hiringRoutes.js";
import uploadRoute from "./routes/uploadRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js"
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/hire", hiringRoutes);
app.use("/api/uploads", uploadRoute);
app.use("/api/invoice",invoiceRoutes)
// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend server running (Local & Vercel)");
});

// Export for Vercel
export const handler = serverless(app);

// Localhost only
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("✅ MongoDB connected successfully");
    console.table([
      { Route: "/api/employees" },
      { Route: "/api/hire" },
      { Route: "/api/uploads" },
      {Route:"/api/invoice"}
    ]);
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}

export default app;
