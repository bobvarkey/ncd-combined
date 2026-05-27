import { useState } from 'react';
import type { DiscriminantResult, EvaluationResult } from '../types';
import { FlaskConical, ChevronDown, ChevronUp, Info, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  results: DiscriminantResult[];
  idaCount: number;
  thalCount: number;
  consensus: EvaluationResult['consensus'];
  cbcParams: { mcv: number; mch: number; rbc: number; rdw: number; hgb: number };
}

// Interpretation explanations
const INTERPRETATION_EXPLANATIONS: Record<string, { ida: string; thal: string }> = {
  'Mentzer Index': { ida: 'MCV/RBC >13 → higher ratio suggests IDA', thal: '≤13 suggests thalassemia trait' },
  'England-Fraser Index': { ida: 'Positive → favors IDA', thal: 'Negative → favors thalassemia' },
  'Shine-Lal Index': { ida: '>1530 suggests IDA', thal: '≤1530 suggests thalassemia' },
  'Green-King Index': { ida: '>65 suggests IDA', thal: '≤65 suggests thalassemia' },
  'RDW Index (RDWI / Jayabose)': { ida: '>220 suggests IDA', thal: '≤220 suggests thalassemia' },
  'Srivastava Index': { ida: '>3.8 suggests IDA', thal: '≤3.8 suggests thalassemia' },
  'Ricerca Index': { ida: '>4.4 suggests IDA', thal: '≤4.4 suggests thalassemia' },
  'Das Gupta Index': { ida: 'Negative → IDA', thal: 'Positive → thalassemia' },
  'Bordbar Index': { ida: 'Higher = more IDA-like', thal: 'Lower = more thalassemia-like' },
};

// Required parameters for each index
const INDEX_PARAMS: Record<string, string[]> = {
  'Mentzer Index': ['MCV', 'RBC'],
  'England-Fraser Index': ['MCV', 'RBC', 'Hgb'],
  'Shine-Lal Index': ['MCV', 'MCH'],
  'Green-King Index': ['MCV', 'RDW', 'Hgb'],
  'RDW Index (RDWI / Jayabose)': ['MCV', 'RDW', 'RBC'],
  'Srivastava Index': ['MCH', 'RBC'],
  'Ricerca Index': ['RDW', 'RBC'],
  'Das Gupta Index': ['RBC', 'RDW'],
  'Bordbar Index': ['MCV', 'MCH'],
};

const consensusConfig = {
  IDA:          { bg: 'bg-rose-900/30',    border: 'border-rose-800',    text: 'text-rose-400',    label: 'Iron Deficiency Anemia (IDA) likely' },
  Thalassemia:  { bg: 'bg-sky-900/30',     border: 'border-sky-800',     text: 'text-sky-400',     label: 'Thalassemia trait likely' },
  Inconclusive: { bg: 'bg-amber-900/30',   border: 'border-amber-800',   text: 'text-amber-400',   label: 'Inconclusive — further workup needed' },
  'N/A':        { bg: 'bg-gray-900/30',    border: 'border-gray-800',    text: 'text-gray-500',    label: 'Not applicable' },
};

export default function DiscriminantTable({ results, idaCount, thalCount, consensus, cbcParams }: Props) {
  const [expanded, setExpanded] = useState(true);
  const total = idaCount + thalCount;
  const cc = consensusConfig[consensus];

  // Check which params are provided
  const providedParams = [
    ...(cbcParams.hgb ? ['Hgb'] : []),
    ...(cbcParams.mcv ? ['MCV'] : []),
    ...(cbcParams.mch ? ['MCH'] : []),
    ...(cbcParams.rbc ? ['RBC'] : []),
    ...(cbcParams.rdw ? ['RDW'] : []),
  ];

  // Check for each index if required params exist
  const getMissingParams = (indexName: string): string[] => {
    const required = INDEX_PARAMS[indexName] || [];
    return required.filter(p => !providedParams.includes(p));
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Discriminant Indices</h2>
          <span className="text-xs bg-sky-900/30 text-sky-400 px-2 py-0.5 rounded-full font-medium border border-sky-800">
            IDA vs Thalassemia
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {results.length === 0 ? (
            <div className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400 border border-gray-700">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                Discriminant indices apply to <strong className="text-gray-300">microcytic anemia (MCV &lt; 80 fL)</strong>.
                Provide Hemoglobin, RBC, MCV, MCH, and RDW to enable this analysis.
              </div>
            </div>
          ) : (
            <>
              {/* Consensus banner */}
              <div className={`rounded-xl p-4 border mb-5 ${cc.bg} ${cc.border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className={`font-semibold text-sm ${cc.text}`}>Consensus: {consensus}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{cc.label}</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-rose-400">{idaCount}</div>
                      <div className="text-xs text-gray-500">IDA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-sky-400">{thalCount}</div>
                      <div className="text-xs text-gray-500">Thal.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-500">{total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-gray-700 overflow-hidden flex">
                      <div
                        className="h-full bg-rose-500 transition-all"
                        style={{ width: `${(idaCount / total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-sky-500 transition-all"
                        style={{ width: `${(thalCount / total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>IDA ({Math.round((idaCount / total) * 100)}%)</span>
                      <span>Thalassemia ({Math.round((thalCount / total) * 100)}%)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Results table */}
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide">Index</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide hidden md:table-cell">Formula</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide">Value</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide">Cutoff</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide">Result</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide hidden lg:table-cell">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr
                        key={r.name}
                        className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900'}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-white text-xs leading-tight">{r.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 md:hidden">{r.formula}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.direction}</div>
                          {r.value === null && getMissingParams(r.name).length > 0 && (
                            <div className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Missing: {getMissingParams(r.name).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-xs hidden md:table-cell">{r.formula}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                          {r.value !== null ? r.value.toFixed(2) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-500">{r.cutoff}</td>
                        <td className="py-3 px-4 text-center">
                          {r.interpretation === 'N/A' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-500 border border-gray-700">—</span>
                          ) : r.interpretation === 'IDA' ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-900/30 text-rose-400 border border-rose-800">IDA</span>
                              <span className="text-[10px] text-rose-400/70">{INTERPRETATION_EXPLANATIONS[r.name]?.ida.split(' → ')[0] || 'Iron def.'}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-900/30 text-sky-400 border border-sky-800">Thalassemia</span>
                              <span className="text-[10px] text-sky-400/70">{INTERPRETATION_EXPLANATIONS[r.name]?.thal.split(' → ')[0] || 'Trait'}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 hidden lg:table-cell">{r.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-gray-400 bg-amber-900/20 border border-amber-800/50 rounded-lg px-3 py-2">
                <strong className="text-amber-400">Clinical note:</strong> These indices differentiate iron deficiency anemia from thalassemia trait in microcytic anemia. Confirmatory testing (serum ferritin, hemoglobin electrophoresis, genetic testing) is required for definitive diagnosis.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
