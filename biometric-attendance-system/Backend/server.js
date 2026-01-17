require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   CONFIG
================================ */

const E_TIME_API_CONFIG = {
  baseURL: "https://api.etimeoffice.com/api",
  corporateId: process.env.E_TIME_CORPORATE_ID,
  username: process.env.E_TIME_USERNAME,
  password: process.env.E_TIME_PASSWORD
};

/* ================================
   HELPERS
================================ */

function formatDate(date, time = "00:00") {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year} ${time}`;
}

async function makeEtimeRequest(params = {}) {
  try {
    const authString = `${E_TIME_API_CONFIG.corporateId}:${E_TIME_API_CONFIG.username}:${E_TIME_API_CONFIG.password}:true`;

    const auth = Buffer.from(authString).toString("base64");

    const response = await axios.get(
      `${E_TIME_API_CONFIG.baseURL}/DownloadPunchData`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        },
        params
      }
    );

    return {
      success: true,
      data: response.data.PunchData || []
    };
  } catch (error) {
    console.error("E-Time API Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

/* ================================
   ROUTES
================================ */

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running successfully" });
});

// Today's attendance
app.get("/api/attendance/today", async (req, res) => {
  const today = new Date();

  const result = await makeEtimeRequest({
    Empcode: "ALL",
    FromDate: formatDate(today, "00:00"),
    ToDate: formatDate(today, "23:59")
  });

  res.json(result);
});

// Attendance by date range
app.get("/api/attendance/range", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      success: false,
      message: "Start and end date required"
    });
  }

  const result = await makeEtimeRequest({
    Empcode: "ALL",
    FromDate: `${start} 00:00`,
    ToDate: `${end} 23:59`
  });

  res.json(result);
});

// Attendance of single employee
app.get("/api/attendance/employee/:id", async (req, res) => {
  const empId = req.params.id;

  const today = new Date();

  const result = await makeEtimeRequest({
    Empcode: empId,
    FromDate: formatDate(today, "00:00"),
    ToDate: formatDate(today, "23:59")
  });

  res.json(result);
});

// Dashboard summary
app.get("/api/dashboard/stats", async (req, res) => {
  const today = new Date();

  const result = await makeEtimeRequest({
    Empcode: "ALL",
    FromDate: formatDate(today, "00:00"),
    ToDate: formatDate(today, "23:59")
  });

  if (!result.success) return res.json(result);

  const data = result.data;

  const present = data.filter(d => d.Status === "P").length;
  const absent = data.filter(d => d.Status === "A").length;

  res.json({
    success: true,
    total: data.length,
    present,
    absent
  });
});

/* ================================
   SERVER START
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});
