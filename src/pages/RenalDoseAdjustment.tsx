import { useState } from "react";
import { Pill, FlaskConical, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

type DoseEntry = {
  drug: string;
  drugClass: string;
  normalDose: string;
  eGFR60_89: string;
  eGFR45_59: string;
  eGFR30_44: string;
  eGFR15_29: string;
  eGFRBelow15: string;
  notes: string;
};

const RENAL_DATA: DoseEntry[] = [
  {
    drug: "Metformin",
    drugClass: "Biguanide",
    normalDose: "500–2000 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Max 1000 mg/day",
    eGFR15_29: "Contraindicated",
    eGFRBelow15: "Contraindicated",
    notes: "Do not initiate if eGFR <30. Reassess if <45.",
  },
  {
    drug: "Empagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "10–25 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Do not initiate; may continue if already on",
    eGFRBelow15: "Contraindicated",
    notes: "CV/renal benefit persists at lower eGFR. Glycemic efficacy reduced below 45.",
  },
  {
    drug: "Dapagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "5–10 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Do not initiate; may continue if already on",
    eGFRBelow15: "Contraindicated",
    notes: "Approved for CKD and HF benefit regardless of diabetes.",
  },
  {
    drug: "Canagliflozin",
    drugClass: "SGLT2 Inhibitor",
    normalDose: "100–300 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "Max 100 mg/day",
    eGFR30_44: "Max 100 mg/day",
    eGFR15_29: "Contraindicated",
    eGFRBelow15: "Contraindicated",
    notes: "Monitor for amputation risk in peripheral vascular disease.",
  },
  {
    drug: "Semaglutide (oral)",
    drugClass: "GLP-1 RA",
    normalDose: "3–14 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "GI side effects may worsen dehydration in CKD.",
  },
  {
    drug: "Semaglutide (SC)",
    drugClass: "GLP-1 RA",
    normalDose: "0.25–2 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Proven CV benefit (SUSTAIN-6, SELECT).",
  },
  {
    drug: "Liraglutide",
    drugClass: "GLP-1 RA",
    normalDose: "0.6–1.8 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "CV benefit proven (LEADER trial).",
  },
  {
    drug: "Dulaglutide",
    drugClass: "GLP-1 RA",
    normalDose: "0.75–4.5 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Renal composite benefit shown in REWIND.",
  },
  {
    drug: "Tirzepatide",
    drugClass: "GIP/GLP-1 RA",
    normalDose: "2.5–15 mg/week",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Use with caution",
    eGFRBelow15: "Limited data",
    notes: "Superior HbA1c and weight reduction (SURPASS trials).",
  },
  {
    drug: "Sitagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "100 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "50 mg/day",
    eGFR30_44: "50 mg/day",
    eGFR15_29: "25 mg/day",
    eGFRBelow15: "25 mg/day",
    notes: "Can be used across all stages of CKD with dose adjustment.",
  },
  {
    drug: "Saxagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "5 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "2.5 mg/day",
    eGFR30_44: "2.5 mg/day",
    eGFR15_29: "2.5 mg/day",
    eGFRBelow15: "2.5 mg/day",
    notes: "Caution: associated with HF hospitalization (SAVOR-TIMI 53).",
  },
  {
    drug: "Linagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "5 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "No renal dose adjustment needed — hepatic elimination.",
  },
  {
    drug: "Vildagliptin",
    drugClass: "DPP-4 Inhibitor",
    normalDose: "50 mg BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "50 mg OD",
    eGFR30_44: "50 mg OD",
    eGFR15_29: "50 mg OD",
    eGFRBelow15: "50 mg OD",
    notes: "Widely used in India. Monitor LFTs.",
  },
  {
    drug: "Pioglitazone",
    drugClass: "Thiazolidinedione",
    normalDose: "15–45 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "Avoid in HF (NYHA III–IV). Risk of fluid retention.",
  },
  {
    drug: "Glimepiride",
    drugClass: "Sulfonylurea",
    normalDose: "1–4 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "Start at 1 mg",
    eGFR30_44: "Start at 1 mg",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "High hypo risk in CKD — active metabolites accumulate.",
  },
  {
    drug: "Gliclazide",
    drugClass: "Sulfonylurea",
    normalDose: "40–320 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Use with caution",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "Preferred SU in CKD (hepatic metabolism). Still carries hypo risk.",
  },
  {
    drug: "Glipizide",
    drugClass: "Sulfonylurea",
    normalDose: "2.5–20 mg/day",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Start low",
    eGFR15_29: "Avoid",
    eGFRBelow15: "Avoid",
    notes: "Short-acting, hepatic metabolism. Preferred SU if CKD stage 3.",
  },
  {
    drug: "Insulin Glargine",
    drugClass: "Basal Insulin",
    normalDose: "Individualized",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Reduce dose 25%",
    eGFR15_29: "Reduce dose 50%",
    eGFRBelow15: "Reduce dose 50%+",
    notes: "Insulin clearance is reduced in CKD — high hypo risk.",
  },
  {
    drug: "Insulin Degludec",
    drugClass: "Basal Insulin",
    normalDose: "Individualized",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Reduce dose 25%",
    eGFR15_29: "Reduce dose 50%",
    eGFRBelow15: "Reduce dose 50%+",
    notes: "Ultra-long acting — lower hypo risk vs glargine in CKD.",
  },
  {
    drug: "Finerenone",
    drugClass: "MRA (non-steroidal)",
    normalDose: "10–20 mg/day",
    eGFR60_89: "20 mg/day",
    eGFR45_59: "20 mg/day",
    eGFR30_44: "10 mg/day",
    eGFR15_29: "10 mg/day",
    eGFRBelow15: "Avoid",
    notes: "Indicated for CKD + T2DM. Monitor K+ closely. Do not start if K >5.0.",
  },

  // ═══════ Antibiotics — Cephalosporins ═══════
  {
    drug: "Cephalexin",
    drugClass: "Cephalosporin (1st gen)",
    normalDose: "250–500 mg Q6h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "500 mg Q6–8h",
    eGFR15_29: "500 mg Q8–12h",
    eGFRBelow15: "500 mg Q12h",
    notes: "Primarily renal excretion. Reduce dose in severe impairment.",
  },
  {
    drug: "Cefuroxime",
    drugClass: "Cephalosporin (2nd gen)",
    normalDose: "250–500 mg BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Standard dose, interval q12h",
    eGFR15_29: "250–500 mg Q24h",
    eGFRBelow15: "250–500 mg Q24h",
    notes: "Renal elimination. Interval doubling in advanced CKD.",
  },
  {
    drug: "Cefixime",
    drugClass: "Cephalosporin (3rd gen)",
    normalDose: "200–400 mg OD/BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "Max 200 mg OD",
    eGFRBelow15: "Max 200 mg OD",
    notes: "Dual excretion (hepatic + renal). Less adjustment needed vs other cephalosporins.",
  },
  {
    drug: "Ceftriaxone",
    drugClass: "Cephalosporin (3rd gen)",
    normalDose: "1–2 g OD/BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment (max 2 g/day)",
    notes: "Biliary excretion — no dose adjustment needed in renal impairment. Preferred cephalosporin in CKD.",
  },
  {
    drug: "Cefotaxime",
    drugClass: "Cephalosporin (3rd gen)",
    normalDose: "1–2 g Q8h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "1–2 g Q8–12h",
    eGFR15_29: "1–2 g Q12h",
    eGFRBelow15: "1 g Q12–24h",
    notes: "Hepatic metabolism with active metabolite partially renally cleared.",
  },
  {
    drug: "Ceftazidime",
    drugClass: "Cephalosporin (3rd gen)",
    normalDose: "1–2 g Q8h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "1–2 g Q12h",
    eGFR15_29: "1–2 g Q24h",
    eGFRBelow15: "500 mg Q24h",
    notes: "Pure renal elimination — significant accumulation in CKD. Good anti-pseudomonal coverage.",
  },
  {
    drug: "Cefepime",
    drugClass: "Cephalosporin (4th gen)",
    normalDose: "1–2 g Q8–12h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "1–2 g Q12h",
    eGFR15_29: "1–2 g Q24h",
    eGFRBelow15: "500 mg–1 g Q24h",
    notes: "Risk of neurotoxicity (seizures) if not dose-reduced in CKD. Monitor closely.",
  },
  // ═══════ Other Key Antibiotics ═══════
  {
    drug: "Amoxicillin",
    drugClass: "Penicillin",
    normalDose: "250–500 mg Q8h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "500 mg Q12h",
    eGFRBelow15: "500 mg Q24h",
    notes: "Renal elimination. Risk of seizure at high doses in CKD.",
  },
  {
    drug: "Amoxicillin-Clavulanate",
    drugClass: "Penicillin + β-lactamase inh.",
    normalDose: "625 mg TID / 1 g BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "625 mg Q12h",
    eGFR15_29: "625 mg Q24h",
    eGFRBelow15: "625 mg Q24h",
    notes: "Clavulanate accumulates in CKD. Can cause diarrhea and hepatic issues.",
  },
  {
    drug: "Piperacillin-Tazobactam",
    drugClass: "Penicillin + β-lactamase inh.",
    normalDose: "4.5 g Q6h",
    eGFR60_89: "4.5 g Q6h",
    eGFR45_59: "4.5 g Q6h",
    eGFR30_44: "4.5 g Q8h",
    eGFR15_29: "4.5 g Q12h",
    eGFRBelow15: "4.5 g Q12h",
    notes: "Extends interval in CKD. Covers pseudomonas, anaerobes. Neurotoxicity risk at high doses.",
  },
  {
    drug: "Ciprofloxacin",
    drugClass: "Fluoroquinolone",
    normalDose: "250–750 mg BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "50–75% of standard dose",
    eGFR15_29: "50% of standard dose",
    eGFRBelow15: "50% of standard dose",
    notes: "Renal + hepatic elimination. Reduce dose in advanced CKD. Tendon rupture risk.",
  },
  {
    drug: "Levofloxacin",
    drugClass: "Fluoroquinolone",
    normalDose: "250–750 mg OD",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "750 mg Q48h or 500 mg OD",
    eGFR15_29: "750 mg loading then 500 mg Q48h",
    eGFRBelow15: "750 mg loading then 500 mg Q48h",
    notes: "Primarily renal excretion. Significant accumulation in CKD. Adjust accordingly.",
  },
  {
    drug: "Azithromycin",
    drugClass: "Macrolide",
    normalDose: "250–500 mg OD",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "Biliary/fecal excretion — no renal adjustment needed. Preferred macrolide in CKD.",
  },
  {
    drug: "Vancomycin",
    drugClass: "Glycopeptide",
    normalDose: "15–20 mg/kg Q8–12h",
    eGFR60_89: "15–20 mg/kg Q12h",
    eGFR45_59: "15–20 mg/kg Q12–24h",
    eGFR30_44: "15–20 mg/kg Q24–48h",
    eGFR15_29: "15–20 mg/kg Q48–96h",
    eGFRBelow15: "TDM-guided; avoid if possible",
    notes: "Nephrotoxic + ototoxic. Trough monitoring mandatory. CRITICAL: dose by AUC/MIC.",
  },
  {
    drug: "Gentamicin",
    drugClass: "Aminoglycoside",
    normalDose: "5–7 mg/kg Q24h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "5–7 mg/kg Q24h",
    eGFR30_44: "5–7 mg/kg Q36–48h",
    eGFR15_29: "5–7 mg/kg Q48–72h",
    eGFRBelow15: "5–7 mg/kg with TDM",
    notes: "Nephrotoxic + ototoxic. Avoid in CKD if alternatives available. Extended interval dosing preferred. Monitor levels.",
  },
  {
    drug: "Metronidazole",
    drugClass: "Nitroimidazole",
    normalDose: "400–500 mg Q8h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment (reduce dose in hepatic impairment)",
    notes: "Hepatic metabolism — no renal adjustment needed. Use with caution in liver disease.",
  },
  {
    drug: "Clindamycin",
    drugClass: "Lincosamide",
    normalDose: "300–600 mg Q6–8h",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "Hepatic metabolism with biliary excretion. Safe in CKD. Risk of C. difficile colitis.",
  },
  {
    drug: "Doxycycline",
    drugClass: "Tetracycline",
    normalDose: "100 mg BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "GI excretion — safe in CKD. Avoid tetracycline (not doxycycline) in CKD as it accumulates.",
  },
  {
    drug: "Linezolid",
    drugClass: "Oxazolidinone",
    normalDose: "600 mg BID",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "No adjustment",
    eGFR15_29: "No adjustment",
    eGFRBelow15: "No adjustment",
    notes: "Excellent bioavailability. No renal dose adjustment. Monitor for thrombocytopenia (myelosuppression).",
  },
  {
    drug: "Nitrofurantoin",
    drugClass: "Nitrofuran",
    normalDose: "100 mg Q6h (UTI)",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "Avoid",
    eGFR15_29: "Contraindicated",
    eGFRBelow15: "Contraindicated",
    notes: "Accumulates in CKD → peripheral neuropathy, pulmonary fibrosis. Contraindicated if eGFR <30.",
  },
  {
    drug: "Trimethoprim-Sulfamethoxazole",
    drugClass: "Sulfonamide combo",
    normalDose: "800/160 mg BID (DS)",
    eGFR60_89: "No adjustment",
    eGFR45_59: "No adjustment",
    eGFR30_44: "400/80 mg Q12h (SS)",
    eGFR15_29: "400/80 mg Q24h",
    eGFRBelow15: "Avoid unless dialysis",
    notes: "Both components renally excreted. Reduces Cr secretion → false Cr rise. K+ elevation. Avoid in G6PD.",
  },
];

const eGFRColumns = [
  { key: "eGFR60_89" as const, label: "60–89" },
  { key: "eGFR45_59" as const, label: "45–59" },
  { key: "eGFR30_44" as const, label: "30–44" },
  { key: "eGFR15_29" as const, label: "15–29" },
  { key: "eGFRBelow15" as const, label: "<15" },
];

const cellStyle = (val: string) => {
  const v = val.toLowerCase();
  if (v.includes("contraindicated") || v === "avoid")
    return "bg-destructive/10 text-destructive font-medium";
  if (v.includes("caution") || v.includes("reduce") || v.includes("start low") || v.includes("start at") || v.includes("max") || v.includes("do not initiate"))
    return "bg-warning/10 text-warning font-medium";
  if (v.includes("limited"))
    return "bg-muted text-muted-foreground";
  return "";
};

const RenalDoseAdjustment = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const classes = [...new Set(RENAL_DATA.map(d => d.drugClass))];

  const filtered = RENAL_DATA.filter(d => {
    const matchSearch = !search || d.drug.toLowerCase().includes(search.toLowerCase()) || d.drugClass.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || d.drugClass === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-5 animate-slide-in">
      <div>
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Renal Dose Adjustment
        </h1>
        <p className="text-sm text-muted-foreground">eGFR-based dose modifications for NCD medications + antibiotics (ADA 2026 + KDIGO)</p>
      </div>

      {/* Legend */}
      <div className="clinical-card p-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" /> Contraindicated / Avoid</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning/20 border border-warning/30" /> Dose adjustment required</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted border border-border" /> Limited data</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-background border border-border" /> No adjustment</span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Quick filter tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setClassFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setClassFilter('SGLT2i')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'SGLT2i' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            💊 SGLT2i
          </button>
          <button
            onClick={() => setClassFilter('GLP-1 RA')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'GLP-1 RA' 
                ? 'bg-violet-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            💉 GLP-1
          </button>
          <button
            onClick={() => setClassFilter('Cephalosporin')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'Cephalosporin' 
                ? 'bg-blue-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🔴 Cephalosporins
          </button>
          <button
            onClick={() => setClassFilter('Penicillin')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'Penicillin' 
                ? 'bg-amber-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🔴 Penicillins
          </button>
          <button
            onClick={() => setClassFilter('Fluoroquinolone')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'Fluoroquinolone' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🔴 Fluoroquinolones
          </button>
          <button
            onClick={() => setClassFilter('Macrolide')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'Macrolide' 
                ? 'bg-pink-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🔴 Macrolides
          </button>
          <button
            onClick={() => setClassFilter('Glycopeptide')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              classFilter === 'Glycopeptide' 
                ? 'bg-rose-600 text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🔴 Vancomycin
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search drug or class..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="clinical-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[140px] sticky left-0 bg-muted/50 z-10">Drug</TableHead>
                <TableHead className="min-w-[100px]">Class</TableHead>
                <TableHead className="min-w-[120px]">Normal Dose</TableHead>
                {eGFRColumns.map(col => (
                  <TableHead key={col.key} className="min-w-[110px] text-center">
                    <div className="text-[10px] text-muted-foreground">eGFR</div>
                    <div>{col.label}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-primary shrink-0" />
                      {d.drug}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.drugClass}</TableCell>
                  <TableCell className="text-xs">{d.normalDose}</TableCell>
                  {eGFRColumns.map(col => (
                    <TableCell key={col.key} className={`text-xs text-center ${cellStyle(d[col.key])}`}>
                      {d[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No medications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="clinical-card">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h3 className="section-title">Clinical Notes</h3>
        </div>
        <div className="space-y-2">
          {filtered.filter(d => d.notes).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="font-medium text-primary min-w-[100px]">{d.drug}:</span>
              <span className="text-muted-foreground">{d.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RenalDoseAdjustment;
