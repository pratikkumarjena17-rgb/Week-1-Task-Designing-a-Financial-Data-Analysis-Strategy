import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, FileCheck, Code } from "lucide-react";

interface AISuggestedMetric {
  name: string;
  reason: string;
  typicalRange: string;
}

interface AIReviewData {
  executiveSummary: string;
  metricsCritique: string;
  suggestedMetrics: AISuggestedMetric[];
  methodologyEnhancements: string;
  riskCritique: string;
  contingencyPlan: string;
  pythonCode: string;
}

interface AIReviewerProps {
  reviewData: AIReviewData | null;
  isLoading: boolean;
  onApplyFeedback: (data: AIReviewData) => void;
  error: string | null;
}

export default function AIReviewer({
  reviewData,
  isLoading,
  onApplyFeedback,
  error
}: AIReviewerProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-3xs flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]" id="ai-reviewer-loading">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-indigo-400 opacity-75"></div>
          <Sparkles className="h-8 w-8 text-indigo-600 animate-spin relative" />
        </div>
        <div className="space-y-1">
          <h4 className="font-sans font-bold text-sm text-gray-800">CFO Audit In Progress</h4>
          <p className="text-xs text-gray-500 max-w-sm">
            Gemini is acting as your Lead CFO & Financial Data Scientist. Evaluating chosen metrics, outlining Python pipeline enhancements, and vetting data risks...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-900 text-xs space-y-3" id="ai-reviewer-error">
        <div className="flex items-center gap-2 font-bold font-mono">
          <ShieldCheck className="h-4 w-4 text-rose-600" />
          <span>STRATEGIC REVIEW ERROR</span>
        </div>
        <p className="leading-relaxed">{error}</p>
        <div className="text-[10px] text-rose-700 bg-rose-100/50 p-2.5 rounded font-mono">
          Tip: Verify your GEMINI_API_KEY is active in the Secrets tab (or check if dev server needs a restart).
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-gray-50 border border-indigo-100 rounded-xl p-6 shadow-3xs flex flex-col justify-between min-h-[220px]" id="ai-reviewer-empty">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <h4 className="font-sans font-bold text-sm text-gray-900">AI CFO Review Console</h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ready to audit your data-driven strategic roadmap? Run a professional audit to analyze potential blind spots, double-check expected statistical deviations, and inject dynamic risk controls directly into your plan.
          </p>
        </div>
        
        <div className="pt-4 border-t border-indigo-100/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span className="flex items-center gap-1"><FileCheck className="h-3.5 w-3.5 text-indigo-500" /> Powered by Gemini-3.5-Flash</span>
          <span>CFO Engine Online</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full" id="ai-reviewer-results">
      {/* Review Header */}
      <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs font-mono uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>CFO Audit Analysis Outcome</span>
        </div>
        <button
          onClick={() => onApplyFeedback(reviewData)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          Inject AI CFO Feedback <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Review Content */}
      <div className="p-5 space-y-6 overflow-y-auto max-h-[500px] text-xs">
        {/* Executive Verdict */}
        <div className="space-y-1.5">
          <h5 className="font-sans font-bold text-gray-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            CFO Strategic Verdict
          </h5>
          <p className="text-gray-600 leading-relaxed bg-indigo-50/20 border border-indigo-100/50 p-3 rounded-lg text-justify italic">
            "{reviewData.executiveSummary}"
          </p>
        </div>

        {/* Metrics Critique */}
        <div className="space-y-2">
          <h5 className="font-sans font-bold text-gray-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            Selected Metrics Critique
          </h5>
          <p className="text-gray-600 leading-relaxed text-justify">
            {reviewData.metricsCritique}
          </p>

          {/* Suggested Metrics Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mt-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  <th className="p-2.5 font-semibold">Recommended Metric</th>
                  <th className="p-2.5 font-semibold">Strategic Value / Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviewData.suggestedMetrics?.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="p-2.5 font-semibold text-gray-800">{m.name}</td>
                    <td className="p-2.5 text-gray-600">
                      <p>{m.reason}</p>
                      <span className="text-[10px] text-emerald-600 font-mono font-medium block mt-1">Benchmark Target: {m.typicalRange}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Python pipeline critique */}
        <div className="space-y-1.5">
          <h5 className="font-sans font-bold text-gray-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            Vectorized Pipeline Enhancements
          </h5>
          <p className="text-gray-600 leading-relaxed text-justify">
            {reviewData.methodologyEnhancements}
          </p>
        </div>

        {/* Data Risks & Contingency Planning Critique */}
        <div className="space-y-2">
          <h5 className="font-sans font-bold text-gray-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            Risk Critique & Guardrails
          </h5>
          <p className="text-gray-600 leading-relaxed text-justify">
            {reviewData.riskCritique}
          </p>
          <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-lg text-emerald-900 space-y-1">
            <span className="font-semibold block font-mono uppercase tracking-wider text-[9px] text-emerald-700">Contingency Recommendation</span>
            <p className="text-gray-600 leading-relaxed">{reviewData.contingencyPlan}</p>
          </div>
        </div>

        {/* Refined Python Code block */}
        <div className="space-y-2">
          <h5 className="font-sans font-bold text-gray-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            AI Recommended Python Script
          </h5>
          <div className="bg-gray-950 text-gray-300 font-mono text-[11px] rounded-lg p-3 border border-slate-900 overflow-x-auto whitespace-pre max-h-52 leading-relaxed">
            {reviewData.pythonCode}
          </div>
        </div>
      </div>
    </div>
  );
}
