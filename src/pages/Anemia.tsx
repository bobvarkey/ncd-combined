import { useState } from 'react';
import type { CBCValues, Sex, EvaluationResult } from './anemia/types';
import { evaluate } from './anemia/utils/anemia';
import CBCForm from './anemia/components/CBCForm';
import ClassificationCard from './anemia/components/ClassificationCard';
import DiscriminantTable from './anemia/components/DiscriminantTable';
import CausesPanel from './anemia/components/CausesPanel';
import ReferenceRanges from './anemia/components/ReferenceRanges';
import IronTherapy from './anemia/components/IronTherapy';
import ThrombocytopeniaEvaluator from './anemia/components/ThrombocytopeniaEvaluator';
import TestSuggestionAlgorithm from './anemia/components/TestSuggestionAlgorithm';
import { Microscope, AlertTriangle, Droplet } from 'lucide-react';

const EMPTY_CBC: CBCValues = { hgb: '', rbc: '', mcv: '', mch: '', mchc: '', rdw: '', hct: '' };

type Tab = 'anemia' | 'thrombocytopenia';

export default function Anemia() {
  const [activeTab, setActiveTab] = useState<Tab>('anemia');
  const [cbc, setCbc] = useState<CBCValues>(EMPTY_CBC);
  const [sex, setSex] = useState<Sex>('male');
  const [result, setResult] = useState<EvaluationResult | null>(null);

  function handleChange(field: keyof CBCValues, value: string) {
    setCbc(prev => ({ ...prev, [field]: value }));
    setResult(null);
  }

  function handleEvaluate() {
    setResult(evaluate(cbc, sex));
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleReset() {
    setCbc(EMPTY_CBC);
    setResult(null);
  }

  const hgbNum = parseFloat(cbc.hgb);
  const mcvNum = parseFloat(cbc.mcv);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Hematology Evaluators</h1>
              <p className="text-xs text-gray-400 leading-tight">CBC-based diagnostic decision-support tools</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('anemia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'anemia'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Anemia Evaluator
            </button>
            <button
              onClick={() => setActiveTab('thrombocytopenia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'thrombocytopenia'
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Droplet className="w-4 h-4" />
              Thrombocytopenia
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-300">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p>
            This tool is for <strong>educational and decision-support purposes only</strong>. Always correlate with clinical presentation.
          </p>
        </div>

        {activeTab === 'anemia' ? (
          <>
            {/* Input form */}
            <CBCForm
              values={cbc}
              sex={sex}
              onChange={handleChange}
              onSexChange={setSex}
              onEvaluate={handleEvaluate}
              onReset={handleReset}
            />

            {/* Results */}
            {result && (
              <div id="results" className="space-y-5 pt-1">
                {result.missingFields.length > 0 && result.missingFields.includes('Hemoglobin') && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Missing required fields: {result.missingFields.join(', ')}
                  </div>
                )}

                {result.classification.severity !== 'N/A' && (
                  <ClassificationCard
                    classification={result.classification}
                    hgb={hgbNum}
                    mcv={mcvNum}
                    sex={sex}
                  />
                )}

                {result.classification.severity !== 'None' && result.classification.severity !== 'N/A' && (
                  <CausesPanel
                    morphology={result.classification.morphology}
                    severity={result.classification.severity}
                  />
                )}

                <DiscriminantTable
                  results={result.discriminantResults}
                  idaCount={result.idaCount}
                  thalCount={result.thalCount}
                  consensus={result.consensus}
                  cbcParams={{
                    mcv: parseFloat(cbc.mcv) || NaN,
                    mch: parseFloat(cbc.mch) || NaN,
                    rbc: parseFloat(cbc.rbc) || NaN,
                    rdw: parseFloat(cbc.rdw) || NaN,
                    hgb: parseFloat(cbc.hgb) || NaN,
                  }}
                />
              </div>
            )}

            {/* Reference ranges */}
            <ReferenceRanges />

            {/* IV Iron Replacement */}
            <IronTherapy />

            {/* Next Test Algorithm */}
            <TestSuggestionAlgorithm />
          </>
        ) : (
          <ThrombocytopeniaEvaluator />
        )}
      </main>
    </div>
  );
}
