import type { CBCValues, Sex, AnemiaClassification, DiscriminantResult, EvaluationResult } from '../types';

// WHO 2024 Hgb thresholds in g/dL
const WHO_THRESHOLDS: Record<Sex, { normal: number; mild: number; moderate: number; severe: number }> = {
  male:     { normal: 13.0, mild: 11.0, moderate: 8.0, severe: 0 },
  female:   { normal: 12.0, mild: 11.0, moderate: 8.0, severe: 0 },
  child:    { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
  pregnant: { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
};

export function classifyAnemia(hgb: number, mcv: number, sex: Sex): AnemiaClassification {
  const t = WHO_THRESHOLDS[sex];

  let severity: AnemiaClassification['severity'];
  if (hgb >= t.normal) severity = 'None';
  else if (hgb >= t.mild) severity = 'Mild';
  else if (hgb >= t.moderate) severity = 'Moderate';
  else severity = 'Severe';

  let morphology: AnemiaClassification['morphology'] = 'N/A';
  if (!isNaN(mcv)) {
    if (mcv < 80) morphology = 'Microcytic';
    else if (mcv <= 100) morphology = 'Normocytic';
    else morphology = 'Macrocytic';
  }

  return {
    severity,
    morphology,
    hgbThreshold: { mild: t.mild, moderate: t.moderate, severe: t.severe },
  };
}

export function computeDiscriminantIndices(
  hgb: number,
  mcv: number,
  mch: number,
  rbc: number,
  rdw: number
): DiscriminantResult[] {
  const safe = (v: number) => (isFinite(v) ? v : null);

  const mentzer = safe(mcv / rbc);
  const englandFraser = safe(mcv - rbc - 5 * hgb - 3.4);
  const shineLal = safe((mcv * mcv * mch) / 100);
  const greenKing = safe((mcv * mcv * rdw) / (hgb * 100));
  const rdwi = safe((mcv * rdw) / rbc);
  const srivastava = safe(mch / rbc);
  const ricerca = safe(rdw / rbc);
  const dasGupta = safe(1.89 * rbc - 0.33 * rdw - 3.28);
  const bordbar = safe(Math.abs(80 - mcv) * Math.abs(27 - mch));

  const interpret = (
    val: number | null,
    cutoff: number,
    idaIfAbove: boolean
  ): 'IDA' | 'Thalassemia' | 'N/A' => {
    if (val === null) return 'N/A';
    if (idaIfAbove) return val > cutoff ? 'IDA' : 'Thalassemia';
    return val < cutoff ? 'IDA' : 'Thalassemia';
  };

  // Das Gupta: >0 = Thalassemia, <0 = IDA
  const dasGuptaInterp = (): 'IDA' | 'Thalassemia' | 'N/A' => {
    if (dasGupta === null) return 'N/A';
    return dasGupta > 0 ? 'Thalassemia' : 'IDA';
  };

  return [
    {
      name: 'Mentzer Index',
      formula: 'MCV / RBC',
      value: mentzer,
      cutoff: 13,
      interpretation: interpret(mentzer, 13, true),
      direction: '> 13 → IDA  |  ≤ 13 → Thalassemia',
      reference: 'Mentzer WC, 1973',
    },
    {
      name: 'England-Fraser Index',
      formula: 'MCV − RBC − (5 × Hgb) − 3.4',
      value: englandFraser,
      cutoff: 0,
      interpretation: interpret(englandFraser, 0, true),
      direction: '> 0 → IDA  |  ≤ 0 → Thalassemia',
      reference: 'England JM & Fraser PM, 1973',
    },
    {
      name: 'Shine-Lal Index',
      formula: 'MCV² × MCH / 100',
      value: shineLal,
      cutoff: 1530,
      interpretation: interpret(shineLal, 1530, true),
      direction: '> 1530 → IDA  |  ≤ 1530 → Thalassemia',
      reference: 'Shine I & Lal S, 1977',
    },
    {
      name: 'Green-King Index',
      formula: 'MCV² × RDW / (Hgb × 100)',
      value: greenKing,
      cutoff: 65,
      interpretation: interpret(greenKing, 65, true),
      direction: '> 65 → IDA  |  ≤ 65 → Thalassemia',
      reference: 'Green R & King R, 1989',
    },
    {
      name: 'RDW Index (RDWI / Jayabose)',
      formula: 'MCV × RDW / RBC',
      value: rdwi,
      cutoff: 220,
      interpretation: interpret(rdwi, 220, true),
      direction: '> 220 → IDA  |  ≤ 220 → Thalassemia',
      reference: 'Jayabose S et al., 1999',
    },
    {
      name: 'Srivastava Index',
      formula: 'MCH / RBC',
      value: srivastava,
      cutoff: 3.8,
      interpretation: interpret(srivastava, 3.8, true),
      direction: '> 3.8 → IDA  |  ≤ 3.8 → Thalassemia',
      reference: 'Srivastava PC, 1973',
    },
    {
      name: 'Ricerca Index',
      formula: 'RDW / RBC',
      value: ricerca,
      cutoff: 4.4,
      interpretation: interpret(ricerca, 4.4, true),
      direction: '> 4.4 → IDA  |  ≤ 4.4 → Thalassemia',
      reference: 'Ricerca BM et al., 1987',
    },
    {
      name: 'Das Gupta Index',
      formula: '1.89 × RBC − 0.33 × RDW − 3.28',
      value: dasGupta,
      cutoff: 0,
      interpretation: dasGuptaInterp(),
      direction: '< 0 → IDA  |  > 0 → Thalassemia',
      reference: 'Das Gupta A et al., 1994',
    },
    {
      name: 'Bordbar Index',
      formula: '|80 − MCV| × |27 − MCH|',
      value: bordbar,
      cutoff: 44.76,
      interpretation: interpret(bordbar, 44.76, true),
      direction: '> 44.76 → IDA  |  ≤ 44.76 → Thalassemia',
      reference: 'Bordbar E et al., 2010',
    },
  ];
}

function parseNum(s: string): number {
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

export function evaluate(cbc: CBCValues, sex: Sex): EvaluationResult {
  const hgb = parseNum(cbc.hgb);
  const mcv = parseNum(cbc.mcv);
  const mch = parseNum(cbc.mch);
  const rbc = parseNum(cbc.rbc);
  const rdw = parseNum(cbc.rdw);

  const missingFields: string[] = [];
  if (isNaN(hgb)) missingFields.push('Hemoglobin');
  if (isNaN(mcv)) missingFields.push('MCV');
  if (isNaN(mch)) missingFields.push('MCH');
  if (isNaN(rbc)) missingFields.push('RBC');
  if (isNaN(rdw)) missingFields.push('RDW');

  const classification = !isNaN(hgb) && !isNaN(mcv)
    ? classifyAnemia(hgb, mcv, sex)
    : { severity: 'N/A' as AnemiaClassification['severity'], morphology: 'N/A' as AnemiaClassification['morphology'], hgbThreshold: { mild: 0, moderate: 0, severe: 0 } };

  // Only compute discriminant indices for microcytic anemia
  const isMicrocytic = !isNaN(mcv) && mcv < 80;
  const hasAnemia = !isNaN(hgb) && classification.severity !== 'None';

  let discriminantResults: DiscriminantResult[] = [];
  let idaCount = 0;
  let thalCount = 0;
  let consensus: EvaluationResult['consensus'] = 'N/A';

  if (isMicrocytic && hasAnemia) {
    // Compute with whatever parameters are available
    const hasMch = !isNaN(mch);
    const hasRbc = !isNaN(rbc);
    const hasRdw = !isNaN(rdw);
    
    if (hasRbc || hasMch || hasRdw) {
      discriminantResults = computeDiscriminantIndices(hgb, mcv, mch, rbc, rdw);
      idaCount = discriminantResults.filter(r => r.interpretation === 'IDA').length;
      thalCount = discriminantResults.filter(r => r.interpretation === 'Thalassemia').length;
      const total = idaCount + thalCount;
      if (total === 0) {
        consensus = 'N/A';
      } else if (idaCount / total >= 0.6) {
        consensus = 'IDA';
      } else if (thalCount / total >= 0.6) {
        consensus = 'Thalassemia';
      } else {
        consensus = 'Inconclusive';
      }
    }
  }

  return { classification, discriminantResults, idaCount, thalCount, consensus, missingFields };
}
