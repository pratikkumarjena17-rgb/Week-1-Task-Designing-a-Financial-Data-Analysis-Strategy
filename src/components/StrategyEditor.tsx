import React, { useState } from "react";
import { StrategyReport, FinancialMetric } from "../types";
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  Sparkles, 
  Copy, 
  FileCode,
  Info
} from "lucide-react";

interface StrategyEditorProps {
  report: StrategyReport;
  onUpdateReport: (updated: StrategyReport) => void;
  onTriggerAIReview: () => void;
  isAIReviewing: boolean;
}

export default function StrategyEditor({
  report,
  onUpdateReport,
  onTriggerAIReview,
  isAIReviewing
}: StrategyEditorProps) {
  // Local edit states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  
  // Custom metric modal/form state
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [newMetric, setNewMetric] = useState<FinancialMetric>({
    name: "",
    category: "Profitability",
    formula: "",
    justification: "",
    typicalRange: "",
    pythonCalculations: ""
  });

  const [copied, setCopied] = useState(false);

  // Copy to clipboard
  const copyToClipboard = () => {
    const textToCopy = `
=========================================
FINANCIAL DATA ANALYSIS STRATEGY REPORT
=========================================
Title: ${report.title}
Sector: ${report.selectedSector}
Target Outcome Goal: ${report.targetGoal}

1. EXECUTIVE SUMMARY
${report.executiveSummary}

2. INTRODUCTION & OVERVIEW
${report.introduction}

3. CHOSEN KEY FINANCIAL METRICS
${report.metrics.map((m, i) => `
Metric #${i + 1}: ${m.name} [Category: ${m.category}]
- Formula: ${m.formula}
- Justification: ${m.justification}
- Typical Benchmark: ${m.typicalRange}
- Python Code Snippet: 
${m.pythonCalculations}
`).join("\n")}

4. METHODOLOGY PROPOSAL
${report.methodologySteps}

5. RISK & CONTINGENCY PLANNING
Risks:
${report.risks}

Contingency Solutions:
${report.contingencies}

6. CONCLUSION & ROADMAP
${report.conclusion}

7. COMPLETE SIMULATOR SCRIPT
${report.pythonCode}
    `;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // DOC File Downloader using the MS Word-compliant HTML schema
  const downloadDoc = () => {
    const metricsHtml = report.metrics.map(m => `
      <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
        <h4 style="margin: 0; color: #1e3a8a; font-size: 12pt;">${m.name} (${m.category})</h4>
        <p style="margin: 4px 0 2px; font-weight: bold; font-size: 10pt;">Formula: <code style="font-family: Courier, monospace; background: #f8fafc; padding: 2px 4px;">${m.formula}</code></p>
        <p style="margin: 2px 0; font-size: 10.5pt;"><strong>Justification:</strong> ${m.justification}</p>
        <p style="margin: 2px 0; font-size: 10.5pt;"><strong>Industry Target Range:</strong> ${m.typicalRange}</p>
        <p style="margin: 4px 0 0; font-size: 9.5pt; color: #475569; font-style: italic;">Python vectorized calculation:</p>
        <pre style="margin: 4px 0 0; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; font-family: Courier, monospace; font-size: 9pt;">${m.pythonCalculations}</pre>
      </div>
    `).join("");

    const documentHtml = `
      <h1>${report.title}</h1>
      <p style="font-size: 11pt; color: #475569;"><strong>Sector:</strong> ${report.selectedSector} | <strong>Analysis Goal:</strong> ${report.targetGoal}</p>
      
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />

      <h2>1. Executive Summary</h2>
      <p>${report.executiveSummary.replace(/\n/g, "<br/>")}</p>

      <h2>2. Introduction and Strategic Overview</h2>
      <p>${report.introduction.replace(/\n/g, "<br/>")}</p>

      <h2>3. Financial Metrics Selection & Justification</h2>
      <p>The following metrics have been strategically selected for data modeling based on the structural requirements of the ${report.selectedSector} sector:</p>
      ${metricsHtml}

      <h2>4. Python-Based Methodology & Processing Pipeline</h2>
      <p>${report.methodologySteps.replace(/\n/g, "<br/>")}</p>

      <h2>5. Risk Analysis & Contingency Planning</h2>
      <h3>Identified Data Challenges</h3>
      <p>${report.risks.replace(/\n/g, "<br/>")}</p>
      <h3>Contingency Protocols</h3>
      <p>${report.contingencies.replace(/\n/g, "<br/>")}</p>

      <h2>6. Conclusion and Stakeholder Roadmap</h2>
      <p>${report.conclusion.replace(/\n/g, "<br/>")}</p>

      <h2>7. Reference Python Data Analysis Script</h2>
      <pre style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; font-family: Courier, monospace; font-size: 9.5pt;">${report.pythonCode}</pre>
    `;

    // Microsoft Word XML Header Wrapper
    const docHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${report.title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; padding: 20px; }
          h1 { color: #1e3a8a; font-size: 24pt; border-bottom: 2px solid #3b82f6; padding-bottom: 6px; margin-top: 0; }
          h2 { color: #1e40af; font-size: 18pt; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          h3 { color: #1d4ed8; font-size: 13pt; margin-top: 20px; }
          p { margin-bottom: 12px; font-size: 11pt; text-align: justify; }
          pre { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; font-family: 'Courier New', monospace; font-size: 9.5pt; color: #0f172a; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        ${documentHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.selectedSector.replace(/[^a-zA-Z0-9]/g, "_")}_Financial_Strategy.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleStartEdit = (section: string, initialText: string) => {
    setEditingSection(section);
    setEditText(initialText);
  };

  const handleSaveSection = (sectionKey: keyof StrategyReport) => {
    onUpdateReport({
      ...report,
      [sectionKey]: editText
    });
    setEditingSection(null);
  };

  const handleRemoveMetric = (indexToRemove: number) => {
    const updatedMetrics = report.metrics.filter((_, i) => i !== indexToRemove);
    onUpdateReport({
      ...report,
      metrics: updatedMetrics
    });
  };

  const handleAddMetric = () => {
    if (!newMetric.name.trim() || !newMetric.formula.trim()) return;
    onUpdateReport({
      ...report,
      metrics: [...report.metrics, newMetric]
    });
    setNewMetric({
      name: "",
      category: "Profitability",
      formula: "",
      justification: "",
      typicalRange: "",
      pythonCalculations: ""
    });
    setShowAddMetric(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full" id="strategy-editor-panel">
      {/* Document Control Panel */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="font-mono text-sm font-semibold text-gray-700">STRATEGY_REPORT.doc</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Raw"}
          </button>
          
          <button
            onClick={onTriggerAIReview}
            disabled={isAIReviewing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isAIReviewing ? "CFO Reviewing..." : "Run AI CFO Audit"}
          </button>

          <button
            onClick={downloadDoc}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download .doc
          </button>
        </div>
      </div>

      {/* Actual Strategy Document View */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Document Header Info */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold font-mono text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100 uppercase tracking-wide">
              {report.selectedSector}
            </span>
          </div>
          {editingSection === "title" ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-2xl md:text-3xl font-sans font-bold text-gray-900 tracking-tight border-b-2 border-indigo-500 outline-none w-full py-1"
                placeholder="Enter document title..."
              />
              <button
                onClick={() => handleSaveSection("title")}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                <Check className="h-6 w-6" />
              </button>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="group flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-sans font-bold text-gray-900 tracking-tight leading-tight">
                {report.title}
              </h1>
              <button
                onClick={() => handleStartEdit("title", report.title)}
                className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition p-1"
                title="Edit title"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Goal section */}
          <div className="bg-amber-50/50 border border-amber-100/80 rounded-lg p-3 flex gap-2.5 text-xs text-amber-900">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5 font-mono uppercase tracking-wider text-[10px] text-amber-700">Primary Strategic Goal</span>
              {editingSection === "targetGoal" ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border-b border-amber-500 outline-none w-full bg-transparent text-amber-900 py-0.5"
                  />
                  <button onClick={() => handleSaveSection("targetGoal")} className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingSection(null)} className="p-0.5 text-gray-400 hover:bg-gray-100 rounded"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span>{report.targetGoal}</span>
                  <button onClick={() => handleStartEdit("targetGoal", report.targetGoal)} className="text-amber-600 hover:text-amber-800 p-0.5">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-3 group/section relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
              1. Executive Summary
            </h2>
            {editingSection !== "executiveSummary" && (
              <button
                onClick={() => handleStartEdit("executiveSummary", report.executiveSummary)}
                className="opacity-0 group-hover/section:opacity-100 text-gray-400 hover:text-indigo-600 transition p-1"
                title="Edit Section"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {editingSection === "executiveSummary" ? (
            <div className="space-y-2 mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={4}
                className="w-full text-sm border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveSection("executiveSummary")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {report.executiveSummary}
            </p>
          )}
        </section>

        {/* Section 2: Introduction and Strategic Overview */}
        <section className="space-y-3 group/section relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
              2. Introduction and Strategic Overview
            </h2>
            {editingSection !== "introduction" && (
              <button
                onClick={() => handleStartEdit("introduction", report.introduction)}
                className="opacity-0 group-hover/section:opacity-100 text-gray-400 hover:text-indigo-600 transition p-1"
                title="Edit Section"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>

          {editingSection === "introduction" ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={5}
                className="w-full text-sm border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveSection("introduction")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {report.introduction}
            </p>
          )}
        </section>

        {/* Section 3: Financial Metrics Selection & Justification */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
              3. Key Financial Metrics Matrix
            </h2>
            <button
              onClick={() => setShowAddMetric(!showAddMetric)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <Plus className="h-4 w-4" /> Add Metric
            </button>
          </div>

          {/* New Metric Form */}
          {showAddMetric && (
            <div className="bg-gray-50 border border-indigo-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="font-semibold text-xs text-indigo-800 uppercase tracking-wider font-mono">Create Custom Analysis Metric</span>
                <button onClick={() => setShowAddMetric(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Metric Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Operating Margin"
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Category</label>
                  <select
                    value={newMetric.category}
                    onChange={(e) => setNewMetric({ ...newMetric, category: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="Profitability">Profitability</option>
                    <option value="Liquidity">Liquidity</option>
                    <option value="Efficiency">Efficiency</option>
                    <option value="Growth">Growth</option>
                    <option value="SaaS">SaaS Specific</option>
                  </select>
                </div>
              </div>
              <div className="text-xs">
                <label className="block text-gray-600 mb-1 font-medium">Mathematical Formula</label>
                <input
                  type="text"
                  placeholder="e.g. (Operating Cash Flow / Total Revenue) * 100"
                  value={newMetric.formula}
                  onChange={(e) => setNewMetric({ ...newMetric, formula: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Justification / Rationale</label>
                  <textarea
                    placeholder="Explain why this metric is pivotal for this industry..."
                    value={newMetric.justification}
                    onChange={(e) => setNewMetric({ ...newMetric, justification: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Python Calculation Fragment</label>
                  <textarea
                    placeholder="df['OM'] = (df['OCF'] / df['Rev']) * 100"
                    value={newMetric.pythonCalculations}
                    onChange={(e) => setNewMetric({ ...newMetric, pythonCalculations: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-2 font-mono text-[11px] outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block text-gray-600 mb-1 font-medium">Expected Benchmark Range</label>
                <input
                  type="text"
                  placeholder="e.g. 15% - 22%"
                  value={newMetric.typicalRange}
                  onChange={(e) => setNewMetric({ ...newMetric, typicalRange: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowAddMetric(false)}
                  className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMetric}
                  className="px-4 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Add to Strategy
                </button>
              </div>
            </div>
          )}

          {/* Interactive Metric Cards */}
          <div className="space-y-4">
            {report.metrics.map((metric, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 shadow-3xs space-y-2 group relative hover:border-indigo-100 transition bg-white">
                <button
                  onClick={() => handleRemoveMetric(i)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-600 transition p-1 rounded hover:bg-rose-50"
                  title="Remove Metric"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-sm text-gray-900">{metric.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold font-mono text-gray-500 bg-gray-100 rounded-full">
                    {metric.category}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-700 font-mono text-[10px] uppercase tracking-wider block">Formula:</span>
                    <code className="text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded font-mono font-medium text-[11px]">
                      {metric.formula}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 font-mono text-[10px] uppercase tracking-wider block">Justification:</span>
                    <p className="leading-relaxed">{metric.justification}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 font-mono text-[10px] uppercase tracking-wider block">Typical benchmark:</span>
                    <span className="text-emerald-700 font-medium">{metric.typicalRange || "Not Specified"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Python-Based Methodology & Processing Pipeline */}
        <section className="space-y-3 group/section relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
              4. Methodology Proposal
            </h2>
            {editingSection !== "methodologySteps" && (
              <button
                onClick={() => handleStartEdit("methodologySteps", report.methodologySteps)}
                className="opacity-0 group-hover/section:opacity-100 text-gray-400 hover:text-indigo-600 transition p-1"
                title="Edit Section"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>

          {editingSection === "methodologySteps" ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={10}
                className="w-full text-sm font-mono border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveSection("methodologySteps")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 space-y-4">
              <p className="leading-relaxed">
                The Python methodology utilizes standard libraries: <strong>Pandas</strong> for vectorized mathematical structures, <strong>NumPy</strong> for multi-dimensional statistical calculations, and <strong>Matplotlib/Seaborn</strong> for high-fidelity visualization plots.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {report.methodologySteps}
              </div>
            </div>
          )}
        </section>

        {/* Section 5: Risk and Contingency Planning */}
        <section className="space-y-4">
          <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
            5. Risk and Contingency Planning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Box */}
            <div className="border border-gray-200 rounded-xl p-4 bg-rose-50/20 hover:border-rose-200 transition relative group/risk">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans font-bold text-sm text-rose-900">Data Challenges & Risks</span>
                {editingSection !== "risks" && (
                  <button
                    onClick={() => handleStartEdit("risks", report.risks)}
                    className="opacity-0 group-hover/risk:opacity-100 text-gray-400 hover:text-indigo-600 transition p-0.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {editingSection === "risks" ? (
                <div className="space-y-2 text-xs">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                  />
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => setEditingSection(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    <button onClick={() => handleSaveSection("risks")} className="px-2 py-1 text-white bg-indigo-600 rounded">Save</button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {report.risks}
                </p>
              )}
            </div>

            {/* Contingencies Box */}
            <div className="border border-gray-200 rounded-xl p-4 bg-emerald-50/20 hover:border-emerald-200 transition relative group/cont">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans font-bold text-sm text-emerald-900">Mitigations & Contingencies</span>
                {editingSection !== "contingencies" && (
                  <button
                    onClick={() => handleStartEdit("contingencies", report.contingencies)}
                    className="opacity-0 group-hover/cont:opacity-100 text-gray-400 hover:text-indigo-600 transition p-0.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {editingSection === "contingencies" ? (
                <div className="space-y-2 text-xs">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                  />
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => setEditingSection(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    <button onClick={() => handleSaveSection("contingencies")} className="px-2 py-1 text-white bg-indigo-600 rounded">Save</button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {report.contingencies}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 6: Conclusion and Summary */}
        <section className="space-y-3 group/section relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-bold text-gray-900 tracking-tight">
              6. Conclusion and Summary
            </h2>
            {editingSection !== "conclusion" && (
              <button
                onClick={() => handleStartEdit("conclusion", report.conclusion)}
                className="opacity-0 group-hover/section:opacity-100 text-gray-400 hover:text-indigo-600 transition p-1"
                title="Edit Section"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>

          {editingSection === "conclusion" ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={5}
                className="w-full text-sm border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveSection("conclusion")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {report.conclusion}
            </p>
          )}
        </section>

        {/* Dynamic reference code block footer */}
        <section className="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-indigo-400" />
              <span className="font-mono text-xs font-semibold text-gray-300">strategy_simulator.py</span>
            </div>
          </div>
          <pre className="text-[11px] font-mono text-gray-400 overflow-x-auto max-h-72 whitespace-pre leading-relaxed">
            {report.pythonCode}
          </pre>
        </section>
      </div>
    </div>
  );
}
