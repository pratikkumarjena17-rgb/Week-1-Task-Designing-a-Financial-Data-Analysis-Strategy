import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to get Gemini client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API endpoint: Analyze Strategy & Metrics using Gemini
app.post("/api/analyze", async (req, res) => {
  try {
    const { sector, metrics, planText, targetGoal } = req.body;
    
    if (!sector) {
      res.status(400).json({ error: "Sector is required" });
      return;
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an expert Chief Financial Officer (CFO) and Lead Financial Data Scientist. Your objective is to critique, optimize, and enhance a financial data analysis strategy report. Return your critique in a structured JSON format containing actionable recommendations, additional specific metrics, potential risks, and highly customized Python code blocks using Pandas, NumPy, and Matplotlib/Seaborn.`;

    const userPrompt = `
      Sector: ${sector}
      Primary Analysis Goal: ${targetGoal || "Comprehensive financial health and strategy formulation"}
      Selected Key Metrics to Analyze: ${metrics ? metrics.join(", ") : "Standard financial metrics"}
      Current Strategy Details:
      ${planText || "Draft outline only."}
      
      Please analyze this strategy and provide a thorough critique.
      Your response MUST be in valid JSON. Use the following schema:
      {
        "executiveSummary": "A concise, highly professional 2-3 sentence overview of your strategic verdict.",
        "metricsCritique": "Detailed critique of the selected metrics. Why they fit or what is missing for this sector.",
        "suggestedMetrics": [
          {
            "name": "Metric Name",
            "reason": "Why this specific metric is critical for the sector",
            "typicalRange": "Typical industry standard range or benchmark"
          }
        ],
        "methodologyEnhancements": "A step-by-step description of how to clean, process, and analyze this data in Python.",
        "riskCritique": "Industry-specific data risk evaluation (e.g. data sparsity, volatility, look-ahead bias).",
        "contingencyPlan": "Actionable solutions to mitigate the risks identified.",
        "pythonCode": "A complete, production-ready, self-contained Python script using pandas and matplotlib/seaborn to simulate and visualize these metrics. Include dummy data generation so it runs out-of-the-box."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to perform Gemini analysis. Make sure your GEMINI_API_KEY is configured." 
    });
  }
});

// API endpoint: Generate Initial Sector Template
app.post("/api/generate-template", async (req, res) => {
  try {
    const { sector } = req.body;
    if (!sector) {
      res.status(400).json({ error: "Sector is required" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `
      Generate a customized financial data strategy blueprint template for the sector: "${sector}".
      Return a valid JSON response strictly in this format:
      {
        "introduction": "Brief background on why data-driven financial analysis is transforming the ${sector} industry.",
        "defaultMetrics": [
          { "name": "Metric Name 1", "justification": "Why it matters", "formula": "Mathematical representation or calculation rule" },
          { "name": "Metric Name 2", "justification": "Why it matters", "formula": "Mathematical representation or calculation rule" }
        ],
        "methodology": "Overview of data processing, cleansing, and outlier handling specific to ${sector}.",
        "risks": "Top data challenges and bias issues specific to this sector."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Template generation error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate initial template. Make sure your GEMINI_API_KEY is set." 
    });
  }
});

// Vite middleware for development or Static assets serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
