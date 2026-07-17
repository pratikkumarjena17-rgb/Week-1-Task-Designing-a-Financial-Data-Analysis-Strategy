import { SectorTemplate } from "../types";

export const SECTOR_TEMPLATES: SectorTemplate[] = [
  {
    id: "tech-saas",
    name: "Technology & SaaS",
    description: "Subscription-based software models characterized by high gross margins, customer acquisition cost metrics, and recurring revenue expansion.",
    defaultGoal: "Optimize Net Revenue Retention (NRR) and evaluate cash burn efficiency for venture capital expansion.",
    introduction: "In today's digital economy, Software-as-a-Service (SaaS) businesses require a distinct analytical paradigm. Standard GAAP metrics like net income often fail to capture the true economic health of subscription businesses. This strategy details a Python-driven financial analysis framework aimed at modeling annual recurring revenue, customer health, and capital efficiency.",
    defaultMetrics: [
      {
        name: "LTV : CAC Ratio",
        category: "SaaS",
        formula: "Customer Lifetime Value (LTV) / Customer Acquisition Cost (CAC)",
        justification: "Measures the ROI of marketing and sales spend. A healthy LTV:CAC ensures that the unit economics of customer acquisition support long-term profitability.",
        typicalRange: "3.0x to 5.0x+",
        pythonCalculations: "df['LTV'] = (df['ARPU'] * df['Gross_Margin']) / df['Churn_Rate']\ndf['LTV_CAC'] = df['LTV'] / df['CAC']"
      },
      {
        name: "Net Revenue Retention (NRR)",
        category: "Growth",
        formula: "((Beginning ARR + Expansion ARR - Churned ARR) / Beginning ARR) * 100",
        justification: "Indicates the change in recurring revenue from the existing customer base over a period, demonstrating product-market fit and customer expansion potential.",
        typicalRange: "105% to 125%+",
        pythonCalculations: "df['NRR'] = ((df['Starting_ARR'] + df['Expansion_ARR'] - df['Churned_ARR']) / df['Starting_ARR']) * 100"
      },
      {
        name: "Burn Multiple",
        category: "Growth",
        formula: "Net Burn / Net New ARR",
        justification: "Evaluates how much cash a startup consumes to generate $1 of ARR. Lower numbers indicate highly efficient, self-sustaining growth engines.",
        typicalRange: "1.0x (Amazing) to 2.5x (Heavily burnt)",
        pythonCalculations: "df['Burn_Multiple'] = df['Net_Burn'] / df['Net_New_ARR']"
      },
      {
        name: "Gross Profit Margin",
        category: "Profitability",
        formula: "(Gross Profit / Total Revenue) * 100",
        justification: "Highlights the core scalability of the software delivery model. High margins leave ample capital to reinvest in research & development.",
        typicalRange: "75% to 85%",
        pythonCalculations: "df['Gross_Margin'] = ((df['Revenue'] - df['COGS']) / df['Revenue']) * 100"
      }
    ],
    methodology: `### Step 1: Data Acquisition and Setup
Utilize Python with the Pandas library to load multi-year transaction data from public database dumps or billing API exports. Set indexing on monthly dates and sanitize missing records.

### Step 2: Exploratory Data Analysis & Outlier Treatment
Filter extreme noise like multi-year prepayments or legacy server migration fees. Apply NumPy's log-transformations to handle highly skewed cohort values.
\`\`\`python
import pandas as pd
import numpy as np

# Load raw transaction cohorts
df = pd.read_csv("saas_billing_ledger.csv")
# Handle missing or null expansion values
df['Expansion_ARR'] = df['Expansion_ARR'].fillna(0)
\`\`\`

### Step 3: Statistical Aggregation and Core Calculations
Build vectorized equations for customer acquisition periods and churn probability matrices using SciPy and custom Pandas rolling window calculations.`,
    risks: "SaaS datasets frequently face issues with deferred revenue recognition errors, double-counting expanded contracts, look-ahead bias in customer cohort tracking, and sample size limitations for high-value enterprise accounts.",
    contingencies: "1. Adopt standard ASC 606 revenue compliance practices prior to modeling.\n2. Use cohort stratification algorithms in Python to separate low-touch SMB contracts from multi-year enterprise accounts.\n3. Apply Monte Carlo simulation matrices in Python to estimate the distribution of Customer Lifetime Values under fluctuating churn conditions.",
    conclusion: "By executing this Python-based financial strategy, the technology organization can systematically evaluate whether their client-acquisition spending yields high-compounding capital. This serves as a vital strategic compass for board-level scaling plans."
  },
  {
    id: "retail-ecommerce",
    name: "Retail & E-Commerce",
    description: "Physical and digital inventory businesses characterized by supply-chain cycles, variable working capital demands, and customer conversion funnels.",
    defaultGoal: "Improve working capital velocity and inventory turnover efficiency to maximize cash conversion cycles.",
    introduction: "In the retail and e-commerce domains, profitability is heavily governed by supply chain dynamics, pricing elasticity, and advertising efficiency. This strategy introduces a robust analytical framework in Python to synchronize inventory levels with customer demand forecast models.",
    defaultMetrics: [
      {
        name: "Inventory Turnover Ratio",
        category: "Efficiency",
        formula: "Cost of Goods Sold (COGS) / Average Inventory",
        justification: "Measures how many times inventory is sold and replaced over a year. Higher values reflect sales velocity and efficient working capital allocation.",
        typicalRange: "4.0x to 8.0x",
        pythonCalculations: "df['Inventory_Turnover'] = df['COGS'] / df['Average_Inventory']"
      },
      {
        name: "Customer Acquisition Cost (CAC)",
        category: "Efficiency",
        formula: "Total Marketing Expenses / New Customers Acquired",
        justification: "Assesses digital marketing efficiency across acquisition channels like Google Ads and social media.",
        typicalRange: "$15.00 to $60.00",
        pythonCalculations: "df['CAC'] = df['Marketing_Spend'] / df['New_Customers']"
      },
      {
        name: "Cash Conversion Cycle (CCC)",
        category: "Liquidity",
        formula: "Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)",
        justification: "Calculates the time (in days) it takes for a company to convert its investments in inventory back into cash from sales.",
        typicalRange: "30 to 60 Days",
        pythonCalculations: "df['CCC'] = df['DIO'] + df['DSO'] - df['DPO']"
      },
      {
        name: "Operating Cash Flow to Sales",
        category: "Liquidity",
        formula: "(Operating Cash Flow / Total Revenue) * 100",
        justification: "Ensures that high top-line growth is translating directly into actual operating liquidity.",
        typicalRange: "10% to 18%",
        pythonCalculations: "df['OCF_to_Sales'] = (df['Operating_Cash_Flow'] / df['Revenue']) * 100"
      }
    ],
    methodology: `### Step 1: Supply Chain Data Harmonization
Consolidate e-commerce Shopify logs with warehousing ERP systems using Pandas. Align date timestamps and calculate rolling average inventory on-hand daily.

### Step 2: Seasonal De-trending
Implement seasonal decomposition models via statsmodels in Python to isolate Christmas or Black Friday surges from base consumer transaction frequencies.
\`\`\`python
from statsmodels.tsa.seasonal import seasonal_decompose
import pandas as pd

# Analyze monthly sales trend and isolate seasonality
result = seasonal_decompose(df['Revenue'], model='multiplicative', period=12)
df['Trend_Revenue'] = result.trend
\`\`\`

### Step 3: Performance Modeling
Formulate correlation coefficients between marketing spend and inventory shortages using NumPy's covariance calculators to prevent customer checkout drops.`,
    risks: "E-commerce data challenges include inventory record discrepancy (shrinkage), holiday supply chain delays, and attribution tracking breakdowns across ad networks.",
    contingencies: "1. Build real-time anomaly detection triggers in Python to flag storage mismatches.\n2. Incorporate rolling average lead-time buffers directly inside purchase-order simulation scripts.\n3. Utilize multi-touch attribution models to allocate marketing budgets scientifically.",
    conclusion: "Synchronizing storage assets with marketing velocity ensures high cash liquidity. This Python analysis strategy acts as a critical playbook to maintain a lean, highly profitable direct-to-consumer enterprise."
  },
  {
    id: "biotech-healthcare",
    name: "Biotech & Healthcare",
    description: "Capital-intensive organizations focused on long-term clinical trial pipelines, heavy R&D intensity, and regulatory milestones.",
    defaultGoal: "Assess R&D capitalization rates and model drug development pipeline risk under various regulatory probability scenarios.",
    introduction: "Biomedical and health ventures operate under massive capital expenditures and prolonged, high-risk research cycles before achieving revenue. This strategy proposes a customized Python pipeline to evaluate research allocation efficiency and burn runway calculations.",
    defaultMetrics: [
      {
        name: "R&D Intensity Ratio",
        category: "Efficiency",
        formula: "(R&D Expenditures / Total Operating Expenses) * 100",
        justification: "Reveals the firm's level of investment in scientific innovations, which serves as the core driver for future patent assets.",
        typicalRange: "40% to 70%+",
        pythonCalculations: "df['RD_Intensity'] = (df['RD_Spend'] / df['Operating_Expenses']) * 100"
      },
      {
        name: "Capital Runway (Months)",
        category: "Liquidity",
        formula: "Cash & Liquid Assets / Monthly Net Burn",
        justification: "Vital metric to monitor survival time before additional venture financing, clinical milestones, or public listings are required.",
        typicalRange: "18 to 24 Months",
        pythonCalculations: "df['Runway_Months'] = df['Liquid_Assets'] / df['Monthly_Net_Burn']"
      },
      {
        name: "Risk-Adjusted Net Present Value (rNPV)",
        category: "Valuation",
        formula: "Sum of (Probability of Success * Discounted Cash Flows)",
        justification: "Models the true economic valuation of ongoing clinical pipelines, discounting each milestone by FDA trial success rates.",
        typicalRange: "Varies by clinical phase",
        pythonCalculations: "df['rNPV'] = df['Expected_DCF'] * df['FDA_Success_Probability']"
      }
    ],
    methodology: `### Step 1: Trial Pipeline Expense Allocation
Trace general ledger cash flows directly back to preclinical and clinical phase codes (Phase I, II, III). Apply strict cost-accounting parsing in Pandas.

### Step 2: Milestone Probability Weighting
Incorporate static clinical phase FDA clearance percentages into dynamic NumPy probability arrays. Compute Monte Carlo trials to determine liquid assets distributions.
\`\`\`python
import numpy as np

# Simulate cash depletion under various drug development trial outcomes
simulated_trials = 10000
burn_scenarios = np.random.normal(loc=1.2, scale=0.3, size=simulated_trials) # in $M
\`\`\`

### Step 3: Interactive Cash Depletion Models
Generate dynamic plot graphs showing worst-case, median-case, and best-case cash runaways under prolonged trial extensions.`,
    risks: "Biotechnology studies face extreme milestone-driven data volatility, highly irregular expense timing, and rapid capital exhaustion if phase success criteria are missed.",
    contingencies: "1. Formulate robust conditional logic branches in Python modeling scenarios to evaluate alternative royalty agreements.\n2. Implement a strict contingency burn trigger that automatically cuts administrative R&D overhead if Phase trials are delayed.\n3. Integrate external clinical benchmarks databases to continuously update probability factors.",
    conclusion: "In a sector defined by regulatory hurdles and scientific complexity, this data strategy provides biotech executives with clear mathematical guardrails, ensuring that physical labs remain funded through critical development milestones."
  }
];

export const PYTHON_PSEUDO_CODE_TEMPLATE = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set seed for reproducible financial simulation
np.random.seed(42)

# 1. GENERATE SYNTHETIC HISTORIC DATA
months = pd.date_range(start="2025-01-01", periods=12, freq="MS")
data = {
    "Month": months,
    "Revenue": np.random.normal(loc=250000, scale=35000, size=12).cumsum(),
    "Expenses": np.random.normal(loc=180000, scale=12000, size=12).cumsum(),
    "Inventory_Value": np.random.uniform(low=80000, high=120000, size=12),
    "Marketing_Spend": np.random.uniform(low=15000, high=25000, size=12)
}
df = pd.DataFrame(data)

# 2. DATA PROCESSING & METRICS FORMULATION
# Calculate monthly Net Profit Margin and Cumulative Net Burn
df["Net_Profit"] = df["Revenue"] - df["Expenses"]
df["Net_Profit_Margin"] = (df["Net_Profit"] / df["Revenue"]) * 100
df["Gross_Margin"] = 78.5 # Static assumption for software

# Calculate Inventory Turnover (simulated COGS)
df["COGS"] = df["Expenses"] * 0.45
df["Inventory_Turnover"] = df["COGS"] / df["Inventory_Value"]

# Print Pandas Summary Dataframe
print("--- FINANCIAL METRIC CONSOLIDATED TABLE ---")
print(df[["Month", "Revenue", "Expenses", "Net_Profit", "Net_Profit_Margin", "Inventory_Turnover"]].round(2))

# 3. ADVANCED ANALYSIS
mean_margin = df["Net_Profit_Margin"].mean()
print(f"\\nAverage Monthly Net Margin: {mean_margin:.2f}%")

# 4. MATPLOTLIB VISUALIZATION SCHEME
plt.style.use("seaborn-v0_8-whitegrid")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Plot 1: Revenue vs Expense Progression
ax1.plot(df["Month"], df["Revenue"], label="Gross Revenue", color="#10b981", marker="o", linewidth=2)
ax1.plot(df["Month"], df["Expenses"], label="Operating Expenses", color="#f43f5e", marker="s", linewidth=2)
ax1.fill_between(df["Month"], df["Revenue"], df["Expenses"], where=(df["Revenue"] >= df["Expenses"]), color="#34d399", alpha=0.15)
ax1.set_title("Revenue & Expense Cumulative Growth Trajectory", fontsize=12, fontweight="bold", color="#1e293b")
ax1.set_xlabel("Timeline")
ax1.set_ylabel("Capital Amount ($)")
ax1.legend()

# Plot 2: Monthly Profit Margin Curve
ax2.bar(df["Month"], df["Net_Profit_Margin"], color="#3b82f6", alpha=0.75, width=20, label="Net Margin %")
ax2.axhline(mean_margin, color="#ef4444", linestyle="--", label=f"Mean Margin ({mean_margin:.1f}%)")
ax2.set_title("Operational Margin & Target Benchmark Comparison", fontsize=12, fontweight="bold", color="#1e293b")
ax2.set_xlabel("Timeline")
ax2.set_ylabel("Margin Percentage (%)")
ax2.legend()

plt.tight_layout()
plt.show()
`;
