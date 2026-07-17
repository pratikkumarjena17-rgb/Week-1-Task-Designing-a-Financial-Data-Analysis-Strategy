import React, { useState, useEffect } from "react";
import { Play, Terminal, Sliders, TrendingUp, Cpu, Info, Check, Calendar, Activity } from "lucide-react";
import { motion } from "motion/react";

interface PythonSimulatorProps {
  sectorId: string;
  metrics: Array<{ name: string; formula: string; category?: string }>;
}

export default function PythonSimulator({ sectorId, metrics }: PythonSimulatorProps) {
  // Scenario values state
  const [growthRate, setGrowthRate] = useState(25); // in %
  const [expenseRatio, setExpenseRatio] = useState(65); // in %
  const [startingCapital, setStartingCapital] = useState(500000); // in USD
  const [activeTab, setActiveTab] = useState<"charts" | "trends" | "terminal">("charts");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simRunCount, setSimRunCount] = useState(1);

  // New state for selected metric in historical trend view
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<string>("Revenue");

  // Generate simulated financial monthly figures based on inputs
  const [monthlyData, setMonthlyData] = useState<Array<any>>([]);

  useEffect(() => {
    simulateData();
  }, [growthRate, expenseRatio, startingCapital, sectorId]);

  const simulateData = () => {
    setIsSimulating(true);
    
    // Add brief timing simulation delay
    const timer = setTimeout(() => {
      const data = [];
      let currentRevenue = startingCapital * 0.15; // Starting monthly revenue
      let currentExpenses = currentRevenue * (expenseRatio / 100);

      for (let i = 1; i <= 12; i++) {
        // Compound growth with some random noise
        const randomNoise = 1 + (Math.sin(i * 0.8) * 0.05) + (Math.random() * 0.03 - 0.015);
        const growthFactor = 1 + (growthRate / 100 / 12) * randomNoise;
        
        currentRevenue = currentRevenue * growthFactor;
        // Expenses fluctuate based on growth and base operational ratio
        currentExpenses = currentRevenue * (expenseRatio / 100) * (0.95 + Math.cos(i * 0.5) * 0.04);
        
        const grossProfit = currentRevenue * 0.82; // SaaS margin baseline
        const netProfit = currentRevenue - currentExpenses;
        const profitMargin = (netProfit / currentRevenue) * 100;

        // Custom simulated metrics depending on selected sector
        let specialtyMetricValue = 0;
        let specialtyMetricName = "Efficiency Index";

        if (sectorId === "tech-saas") {
          specialtyMetricName = "LTV : CAC";
          // LTV:CAC correlates negatively with high expenses, positively with stable growth
          specialtyMetricValue = Math.max(1.2, parseFloat(((growthRate / 8) + (100 - expenseRatio) / 12 + (Math.sin(i) * 0.2)).toFixed(1)));
        } else if (sectorId === "retail-ecommerce") {
          specialtyMetricName = "Inventory Turnover";
          specialtyMetricValue = Math.max(2.1, parseFloat((4.5 + (growthRate / 15) - (expenseRatio / 25) + Math.cos(i) * 0.4).toFixed(1)));
        } else {
          specialtyMetricName = "Runway (Months)";
          specialtyMetricValue = Math.max(1, parseFloat(((startingCapital * 0.8) / Math.max(20000, currentExpenses - currentRevenue) + (Math.sin(i) * 1.5)).toFixed(1)));
        }

        data.push({
          monthNum: i,
          monthName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i - 1],
          revenue: Math.round(currentRevenue),
          expenses: Math.round(currentExpenses),
          netProfit: Math.round(netProfit),
          margin: parseFloat(profitMargin.toFixed(1)),
          specialtyValue: specialtyMetricValue,
          specialtyName: specialtyMetricName
        });
      }
      setMonthlyData(data);
      setIsSimulating(false);
      setSimRunCount(prev => prev + 1);
    }, 450);

    return () => clearTimeout(timer);
  };

  // Helper to draw clean visual lines inside SVGs
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 100000);
  const minNetProfit = Math.min(...monthlyData.map(d => d.netProfit), -50000);
  const maxNetProfit = Math.max(...monthlyData.map(d => d.netProfit), 50000);
  
  const getSvgY = (val: number, max: number, height: number = 140, minVal: number = 0) => {
    const range = max - minVal;
    if (range === 0) return height / 2;
    return height - ((val - minVal) / range) * (height - 20) - 10;
  };

  // Combine standard default metrics with user-selected dynamic metrics
  const trendMetrics = [
    { name: "Revenue", category: "Growth" },
    { name: "Operating Expenses", category: "Efficiency" },
    { name: "Net Profit Margin", category: "Profitability" },
  ];

  metrics.forEach(m => {
    if (m && m.name && !trendMetrics.some(tm => tm.name.toLowerCase() === m.name.toLowerCase())) {
      trendMetrics.push({ name: m.name, category: m.category || "Specialty" });
    }
  });

  // Keep chosen trend selection in sync with metric list updates
  useEffect(() => {
    if (!trendMetrics.some(tm => tm.name === selectedTrendMetric)) {
      setSelectedTrendMetric("Revenue");
    }
  }, [metrics]);

  // Generate historical multi-year trend data based on selected sector and active variables
  const getHistoricalMetricTrend = (metricName: string) => {
    // 12 quarters (3 years)
    const quarters = [
      "23-Q1", "23-Q2", "23-Q3", "23-Q4",
      "24-Q1", "24-Q2", "24-Q3", "24-Q4",
      "25-Q1", "25-Q2", "25-Q3", "25-Q4"
    ];
    
    const name = metricName.toLowerCase();
    const data = [];
    
    // Seed pseudo-random generator with metric name so the line is deterministic but responds to sliders
    let hash = 0;
    for (let i = 0; i < metricName.length; i++) {
      hash = metricName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Determine baseline and direction
    let baseline = 50;
    let multiplier = 1;
    let formatType: "currency" | "percent" | "ratio" | "days" | "number" = "number";

    if (name.includes("revenue")) {
      baseline = startingCapital * 0.06; // lower baseline in the past
      multiplier = 1 + (growthRate / 130);
      formatType = "currency";
    } else if (name.includes("expense")) {
      baseline = startingCapital * 0.06 * (expenseRatio / 100);
      multiplier = 1 + (growthRate / 130) * 0.85; // expenses grow slower than revenue
      formatType = "currency";
    } else if (name.includes("margin")) {
      baseline = 100 - expenseRatio - 6; // lower margin in past
      multiplier = 1.12; 
      formatType = "percent";
    } else if (name.includes("ltv") || name.includes("cac")) {
      baseline = 2.0;
      multiplier = 1.05;
      formatType = "ratio";
    } else if (name.includes("retention") || name.includes("nrr")) {
      baseline = 100;
      multiplier = 1.02;
      formatType = "percent";
    } else if (name.includes("burn") || name.includes("multiple")) {
      baseline = 3.2;
      multiplier = 0.93; // burn multiple improves by dropping
      formatType = "ratio";
    } else if (name.includes("turnover")) {
      baseline = 3.2;
      multiplier = 1.05;
      formatType = "ratio";
    } else if (name.includes("runway")) {
      baseline = 12;
      multiplier = 1.06;
      formatType = "number";
    } else if (name.includes("cycle") || name.includes("ccc")) {
      baseline = 70;
      multiplier = 0.96; // days drop as efficiency improves
      formatType = "days";
    } else if (name.includes("intensity") || name.includes("r&d")) {
      baseline = 60;
      multiplier = 0.97;
      formatType = "percent";
    } else {
      // General default
      baseline = Math.abs(hash % 40) + 15;
      multiplier = 1 + (growthRate / 280);
      formatType = "number";
    }

    for (let i = 0; i < quarters.length; i++) {
      let val = 0;
      // Seasonal waves and noise
      const noise = 1 + (Math.sin(i * 1.5 + (hash % 5)) * 0.05);
      
      if (formatType === "currency") {
        val = baseline * Math.pow(1 + (growthRate / 160), i) * noise;
      } else if (formatType === "percent") {
        val = baseline + (i * multiplier * 0.55) + (Math.sin(i) * 1.8);
        val = Math.min(98, Math.max(2, val));
      } else if (formatType === "ratio") {
        val = baseline + (i * (multiplier - 1) * 0.35) + (Math.sin(i) * 0.12);
        val = Math.max(0.5, val);
      } else if (formatType === "days") {
        val = baseline - (i * 1.4) + (Math.sin(i) * 2.5);
        val = Math.max(5, val);
      } else {
        val = baseline * Math.pow(multiplier, i / 2) * noise;
      }

      // Final rounding based on formatting type
      let formatted = "";
      const roundedVal = formatType === "currency" ? Math.round(val) : parseFloat(val.toFixed(2));

      if (formatType === "currency") {
        formatted = `$${Math.round(roundedVal).toLocaleString()}`;
      } else if (formatType === "percent") {
        formatted = `${roundedVal.toFixed(1)}%`;
      } else if (formatType === "ratio") {
        formatted = `${roundedVal.toFixed(1)}x`;
      } else if (formatType === "days") {
        formatted = `${Math.round(roundedVal)} Days`;
      } else {
        formatted = `${roundedVal}`;
      }

      data.push({
        label: quarters[i],
        value: roundedVal,
        formattedValue: formatted
      });
    }

    return {
      metricName,
      data,
      formatType
    };
  };

  // Helper coordinate converter for the long-term trends SVG
  const getTrendY = (val: number, values: number[], height: number = 130) => {
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal;
    if (range === 0) return height / 2;
    // Keep padding at top and bottom
    return height - ((val - minVal) / range) * (height - 35) - 18;
  };

  // Linear regression line: y = mx + b
  const calculateRegression = (dataPoints: Array<{ value: number }>) => {
    const n = dataPoints.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      const x = i;
      const y = dataPoints[i].value;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return dataPoints.map((_, idx) => {
      return slope * idx + intercept;
    });
  };

  const { data: trendPoints, formatType: trendFormatType } = getHistoricalMetricTrend(selectedTrendMetric);
  const regressionPoints = calculateRegression(trendPoints);

  // Build simulated Pandas console data
  const generatePandasConsole = () => {
    if (monthlyData.length === 0) return "Loading pandas kernel...";
    const avgRev = Math.round(monthlyData.reduce((acc, d) => acc + d.revenue, 0) / 12);
    const avgExp = Math.round(monthlyData.reduce((acc, d) => acc + d.expenses, 0) / 12);
    const avgMargin = (monthlyData.reduce((acc, d) => acc + d.margin, 0) / 12).toFixed(2);
    const specialtyName = monthlyData[0]?.specialtyName || "Metric";
    const avgSpecialty = (monthlyData.reduce((acc, d) => acc + d.specialtyValue, 0) / 12).toFixed(2);

    return `>>> import pandas as pd
>>> import numpy as np
>>> data = pd.read_csv("financial_ledger.csv")
>>> df = pd.DataFrame(data)

>>> # Compute Core Analytical Strategy Parameters
>>> df["Net_Profit"] = df["Revenue"] - df["Expenses"]
>>> df["Net_Profit_Margin"] = (df["Net_Profit"] / df["Revenue"]) * 100
>>> df["${specialtyName}"] = df["Specialty_Value"]

>>> df.describe()
           Revenue      Expenses     Net_Profit    Margin (%)   ${specialtyName}
count    12.000000     12.000000      12.000000     12.000000   12.000000
mean  $${avgRev.toLocaleString()}  $${avgExp.toLocaleString()}   $${(avgRev - avgExp).toLocaleString()}       ${avgMargin}%       ${avgSpecialty}
std    $42,152.12    $18,451.90     $26,381.15         2.45%        0.82
min   $${monthlyData[0]?.revenue.toLocaleString()}  $${monthlyData[0]?.expenses.toLocaleString()}   $${monthlyData[0]?.netProfit.toLocaleString()}       ${monthlyData[0]?.margin}%       ${monthlyData[0]?.specialtyValue}
max   $${monthlyData[11]?.revenue.toLocaleString()}  $${monthlyData[11]?.expenses.toLocaleString()}   $${monthlyData[11]?.netProfit.toLocaleString()}       ${monthlyData[11]?.margin}%       ${monthlyData[11]?.specialtyValue}

>>> # Vectorized correlation check
>>> np.corrcoef(df["Revenue"], df["Expenses"])[0, 1]
0.8942152204 (Strong operational lock)

>>> print("Data analysis complete. Matplotlib canvas is ready.")
Simulation Run #${simRunCount}: STATUS_SUCCESS`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full" id="simulator-panel">
      {/* Simulator Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-indigo-600" />
          <h3 className="font-sans font-bold text-sm text-gray-800">Python Strategy Simulator</h3>
        </div>
        <div className="flex bg-gray-200/60 p-1 rounded-lg gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${activeTab === "charts" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-700"}`}
          >
            Matplotlib Canvas
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${activeTab === "trends" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-700"}`}
          >
            Long-Term Trends
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${activeTab === "terminal" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pandas Output
          </button>
        </div>
      </div>

      {/* Simulator Controls & Workspace */}
      <div className="p-5 flex-1 flex flex-col space-y-6">
        {/* Sliders Panel */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase font-mono tracking-wider">
            <Sliders className="h-4 w-4 text-gray-500" />
            <span>Strategy Input Variables</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slider 1: Growth Rate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Target Growth Rate</span>
                <span className="font-mono font-bold text-indigo-600">{growthRate}% y/y</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={growthRate}
                onChange={(e) => setGrowthRate(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Slider 2: Expense Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Operating Expense Ratio</span>
                <span className="font-mono font-bold text-indigo-600">{expenseRatio}% of Rev</span>
              </div>
              <input
                type="range"
                min="35"
                max="85"
                value={expenseRatio}
                onChange={(e) => setExpenseRatio(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Slider 3: Starting Capital */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Simulation Starting Capital</span>
                <span className="font-mono font-bold text-indigo-600">${(startingCapital / 1000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Display Canvas */}
        <div className="flex-1 min-h-[260px] bg-slate-950 border border-slate-900 rounded-xl relative overflow-hidden flex flex-col font-mono text-xs text-emerald-400">
          {isSimulating && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-3 z-10">
              <Cpu className="h-8 w-8 text-indigo-400 animate-spin" />
              <span className="text-gray-300 font-mono text-xs">Running Pandas Vectorized Equations...</span>
            </div>
          )}

          {activeTab === "terminal" && (
            <div className="p-4 flex-1 overflow-auto whitespace-pre leading-relaxed text-[11px] text-gray-300">
              {generatePandasConsole()}
            </div>
          )}

          {activeTab === "charts" && (
            <div className="p-4 flex-1 flex flex-col justify-between h-full bg-slate-950">
              {/* Graphic Title */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Matplotlib Plotted Figures (Simulated Output)</span>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>Revenue</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>Expenses</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>Net Profit</span>
                </div>
              </div>

              {/* Glowing SVG Charts */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* SVG 1: Revenue vs Expense Line Path */}
                <div className="bg-slate-900/40 rounded-lg border border-slate-900/60 p-2 flex flex-col">
                  <span className="text-[9px] text-slate-400 mb-1 font-semibold">fig_1.plot(Months, Revenue, Expenses)</span>
                  <div className="flex-1 relative min-h-[130px]">
                    <svg className="w-full h-full" viewBox="0 0 300 130">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="65" x2="300" y2="65" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="110" x2="300" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                      
                      {/* Revenue Path */}
                      {monthlyData.length > 0 && (
                        <>
                          <path
                            d={`M ${monthlyData.map((d, idx) => `${(idx / 11) * 280 + 10} ${getSvgY(d.revenue, maxRevenue, 130)}`).join(" L ")}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {/* Points */}
                          {monthlyData.map((d, idx) => (
                            <circle
                              key={idx}
                              cx={(idx / 11) * 280 + 10}
                              cy={getSvgY(d.revenue, maxRevenue, 130)}
                              r="3"
                              fill="#10b981"
                              className="cursor-pointer"
                            />
                          ))}
                        </>
                      )}

                      {/* Expenses Path */}
                      {monthlyData.length > 0 && (
                        <>
                          <path
                            d={`M ${monthlyData.map((d, idx) => `${(idx / 11) * 280 + 10} ${getSvgY(d.expenses, maxRevenue, 130)}`).join(" L ")}`}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="1"
                          />
                          {/* Points */}
                          {monthlyData.map((d, idx) => (
                            <circle
                              key={idx}
                              cx={(idx / 11) * 280 + 10}
                              cy={getSvgY(d.expenses, maxRevenue, 130)}
                              r="2.5"
                              fill="#f43f5e"
                            />
                          ))}
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 px-1 mt-1 font-mono">
                    <span>Jan</span>
                    <span>Apr</span>
                    <span>Jul</span>
                    <span>Oct</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* SVG 2: Specialty Metric Bars or Margin Analysis */}
                <div className="bg-slate-900/40 rounded-lg border border-slate-900/60 p-2 flex flex-col">
                  <span className="text-[9px] text-slate-400 mb-1 font-semibold">fig_2.bar(Months, {monthlyData[0]?.specialtyName || "Metric"})</span>
                  <div className="flex-1 relative min-h-[130px]">
                    <svg className="w-full h-full" viewBox="0 0 300 130">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="65" x2="300" y2="65" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="110" x2="300" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />

                      {/* Bar Charts */}
                      {monthlyData.length > 0 && (
                        <>
                          {monthlyData.map((d, idx) => {
                            const maxVal = Math.max(...monthlyData.map(item => item.specialtyValue), 10);
                            const barHeight = (d.specialtyValue / maxVal) * 90;
                            const x = (idx / 11) * 260 + 15;
                            const y = 110 - barHeight;
                            return (
                              <g key={idx}>
                                <rect
                                  x={x - 5}
                                  y={y}
                                  width="10"
                                  height={barHeight}
                                  fill="#6366f1"
                                  rx="1"
                                  opacity="0.8"
                                />
                                <text
                                  x={x}
                                  y={y - 4}
                                  fill="#a5b4fc"
                                  fontSize="7"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  {d.specialtyValue}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 px-1 mt-1 font-mono">
                    <span>Jan</span>
                    <span>Apr</span>
                    <span>Jul</span>
                    <span>Oct</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Legend Summary Indicators */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-900 text-center">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Total Net Margin</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {monthlyData.length > 0 ? (monthlyData.reduce((acc, d) => acc + d.margin, 0) / 12).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Final Monthly Revenue</span>
                  <span className="text-xs font-bold text-white font-mono">
                    ${monthlyData.length > 0 ? (monthlyData[11].revenue / 1000).toFixed(1) : 0}k
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Simulated Specialty Avg</span>
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    {monthlyData.length > 0 ? (monthlyData.reduce((acc, d) => acc + d.specialtyValue, 0) / 12).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="p-4 flex-1 flex flex-col justify-between h-full bg-slate-950">
              {/* Graphic Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-2 mb-3 gap-2 shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-indigo-400" />
                    Long-Term Historical Trends (3-Year Quarterlies)
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block">Regression Slope fit & Statistical Volatility Bounds</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono self-start md:self-auto">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-indigo-400 inline-block"></span>
                    Historical Performance
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 border-t border-dashed border-slate-500 inline-block"></span>
                    Linear Fit (y = mx + b)
                  </span>
                </div>
              </div>

              {/* Selected Metric Button Selector */}
              <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
                {trendMetrics.map((tm) => {
                  const isSelected = selectedTrendMetric === tm.name;
                  return (
                    <button
                      key={tm.name}
                      onClick={() => setSelectedTrendMetric(tm.name)}
                      className={`px-2 py-0.5 text-[9px] font-mono rounded transition border ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tm.name}
                    </button>
                  );
                })}
              </div>

              {/* Grid content */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch min-h-[140px]">
                {/* SVG Chart Panel */}
                <div className="md:col-span-8 bg-slate-900/30 rounded-lg border border-slate-900/60 p-2.5 flex flex-col justify-between">
                  <span className="text-[9px] text-indigo-400 mb-2 font-mono font-semibold block">
                    plt.plot(Q1_23_to_Q4_25, {selectedTrendMetric}, label="Historical")
                  </span>
                  
                  <div className="flex-1 relative min-h-[130px]">
                    <svg className="w-full h-full" viewBox="0 0 320 130" preserveAspectRatio="none">
                      {/* Definitions for Gradients */}
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="15" x2="320" y2="15" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2" />
                      <line x1="0" y1="50" x2="320" y2="50" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2" />
                      <line x1="0" y1="85" x2="320" y2="85" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2" />
                      <line x1="0" y1="115" x2="320" y2="115" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2" />

                      {/* Area Under Curve */}
                      {trendPoints.length > 0 && (
                        <path
                          d={`M 10 115 
                              L ${trendPoints.map((p, idx) => `${(idx / 11) * 300 + 10} ${getTrendY(p.value, trendPoints.map(t => t.value), 130)}`).join(" L ")} 
                              L ${(11 / 11) * 300 + 10} 115 Z`}
                          fill="url(#trendGradient)"
                          opacity="0.8"
                        />
                      )}

                      {/* Dotted Regression Fit line */}
                      {trendPoints.length > 0 && (
                        <path
                          d={`M ${trendPoints.map((_, idx) => `${(idx / 11) * 300 + 10} ${getTrendY(regressionPoints[idx], trendPoints.map(t => t.value), 130)}`).join(" L ")}`}
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="1.2"
                          strokeDasharray="4"
                        />
                      )}

                      {/* Historical Main Curve Line */}
                      {trendPoints.length > 0 && (
                        <path
                          d={`M ${trendPoints.map((p, idx) => `${(idx / 11) * 300 + 10} ${getTrendY(p.value, trendPoints.map(t => t.value), 130)}`).join(" L ")}`}
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Nodes with hover details */}
                      {trendPoints.map((p, idx) => (
                        <g key={idx}>
                          <circle
                            cx={(idx / 11) * 300 + 10}
                            cy={getTrendY(p.value, trendPoints.map(t => t.value), 130)}
                            r="3"
                            fill="#818cf8"
                            stroke="#1e1b4b"
                            strokeWidth="1"
                            className="cursor-pointer hover:scale-150 transition-all"
                          />
                          {/* Tooltip text shown on hover or statically for some key values */}
                          {(idx === 0 || idx === 11 || idx === 5) && (
                            <text
                              x={(idx / 11) * 300 + 10}
                              y={getTrendY(p.value, trendPoints.map(t => t.value), 130) - 7}
                              fill="#cbd5e1"
                              fontSize="7"
                              textAnchor="middle"
                              fontWeight="semibold"
                            >
                              {p.formattedValue}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>

                  <div className="flex justify-between text-[8px] text-slate-500 px-1 mt-1 font-mono shrink-0">
                    <span>Q1-23</span>
                    <span>Q4-23</span>
                    <span>Q2-24</span>
                    <span>Q4-24</span>
                    <span>Q2-25</span>
                    <span>Q4-25</span>
                  </div>
                </div>

                {/* Statistical Analysis Sidebar */}
                <div className="md:col-span-4 bg-slate-900/60 rounded-lg border border-slate-900/70 p-3 flex flex-col justify-between text-[11px] leading-relaxed text-slate-300">
                  <div className="space-y-2.5">
                    <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider block border-b border-slate-800 pb-1.5 font-sans">
                      Regression Insights
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-semibold">Start (Q1-23)</span>
                        <span className="text-slate-200 font-bold font-mono text-[10px] truncate block">{trendPoints[0]?.formattedValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-semibold">End (Q4-25)</span>
                        <span className="text-slate-200 font-bold font-mono text-[10px] truncate block">{trendPoints[11]?.formattedValue}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-slate-500 block text-[8px] uppercase font-semibold">Long-term Performance Delta</span>
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        {(() => {
                          const startVal = trendPoints[0]?.value || 1;
                          const endVal = trendPoints[11]?.value || 1;
                          const delta = startVal === 0 ? 0 : ((endVal - startVal) / Math.abs(startVal)) * 100;
                          const isPositive = delta >= 0;
                          return (
                            <>
                              <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
                                {isPositive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
                              </span>
                              <span className="text-slate-400 text-[8px] font-normal font-sans">Total Change</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-500 block text-[8px] uppercase font-semibold">Trend Line Slope</span>
                      <span className="text-slate-300 font-mono text-[10px] block truncate">
                        {(() => {
                          const startVal = trendPoints[0]?.value || 1;
                          const endVal = trendPoints[11]?.value || 1;
                          const diff = endVal - startVal;
                          if (diff > 0) return "Compounding Positive Growth";
                          if (diff < 0) return "Consistent Drop Pattern";
                          return "Stable Flat-line Baseline";
                        })()}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-500 block text-[8px] uppercase font-semibold">Statistical Volatility</span>
                      <span className="text-slate-300 font-mono text-[10px] block truncate">
                        {(() => {
                          const name = selectedTrendMetric.toLowerCase();
                          if (name.includes("revenue") || name.includes("expense")) {
                            return "Low dispersion (Std Dev: 3.4%)";
                          }
                          if (name.includes("margin") || name.includes("ltv")) {
                            return "Moderate Seasonal Dispersion";
                          }
                          return "Predictable linear progression";
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-indigo-950/40 border border-indigo-900/40 rounded p-1.5 text-[9px] text-indigo-300 leading-normal font-sans mt-2 shrink-0">
                    <strong>Model Analyst:</strong> {(() => {
                      const name = selectedTrendMetric.toLowerCase();
                      if (name.includes("revenue")) {
                        return "Strong systemic scaling model. High predictability index.";
                      }
                      if (name.includes("expense")) {
                        return "Expenses are controlled. Gradual margins scaling achieved.";
                      }
                      if (name.includes("margin")) {
                        return "Margins stable above 15% threshold; showing operational leverage.";
                      }
                      return "Key strategic performance indicator exhibiting favorable vector trajectory.";
                    })()}
                  </div>
                </div>
              </div>

              {/* Summary Bottom Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-900 text-center shrink-0">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">3-Year Average</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono truncate">
                    {(() => {
                      const avg = trendPoints.reduce((acc, p) => acc + p.value, 0) / trendPoints.length;
                      if (trendFormatType === "currency") return `$${Math.round(avg).toLocaleString()}`;
                      if (trendFormatType === "percent") return `${avg.toFixed(1)}%`;
                      if (trendFormatType === "ratio") return `${avg.toFixed(1)}x`;
                      if (trendFormatType === "days") return `${Math.round(avg)} Days`;
                      return `${avg.toFixed(1)}`;
                    })()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Regression R² Fit</span>
                  <span className="text-xs font-bold text-white font-mono">
                    0.942
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Trend Confidence</span>
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    HIGH (95%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-sans">
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4 text-gray-400" />
            <span>Interactive mathematical vector updates in real-time.</span>
          </div>
          <button
            onClick={simulateData}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition rounded-lg animate-fade-in"
          >
            <Play className="h-3 w-3" />
            Re-run Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
