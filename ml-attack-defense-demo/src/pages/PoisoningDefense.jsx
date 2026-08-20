import { useState } from 'react';
import { Play, RotateCcw, ShieldCheck, CheckCircle, AlertTriangle, ArrowRight, Activity, Filter, RefreshCw } from 'lucide-react';
import { PageHeader, SectionCard, WhatHappened, ExpandableCode, StatCard } from '../components/UI';
import { MLP_RESULTS } from '../data/notebookData';

const STEPS = [
  { id: 1, title: 'Step 1: Clean Training Data', desc: '426 clean training observations, baseline MLP accuracy = 97.20%', icon: '🗄️' },
  { id: 2, title: 'Step 2: 10% Feature Outlier Poisoning', desc: '42 training samples corrupted with 4.0σ offsets (P08 attack)', icon: '⚡' },
  { id: 3, title: 'Step 3: Poisoned Model Training', desc: 'MLP trained on corrupted dataset → Accuracy drops to 94.41%', icon: '📉' },
  { id: 4, title: 'Step 4: K-Means Screening', desc: 'Computes distance to cluster centroids: km_dist > percentile_threshold', icon: '🔍' },
  { id: 5, title: 'Step 5: DBSCAN Screening', desc: 'Identifies noise / low-density core samples: db_labels == -1', icon: '📡' },
  { id: 6, title: 'Step 6: Combine Suspicious Flags', desc: 'suspicious = km_flag | db_flag → Flags 54 suspicious samples', icon: '🚨' },
  { id: 7, title: 'Step 7: Remove Suspicious Records', desc: 'keep = ~suspicious → Drops 54 flagged samples from training set', icon: '🧹' },
  { id: 8, title: 'Step 8: Retrain PyTorch MLP', desc: 'Re-runs 150 training epochs on filtered dataset', icon: '⚙️' },
  { id: 9, title: 'Step 9: Performance Recovery', desc: 'Test Accuracy RECOVERED: 94.41% → 97.90% (F1: 98.32%)', icon: '🎉' },
];

export default function PoisoningDefense() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);

  const runFullPipeline = () => {
    setIsExecuting(true);
    setCurrentStep(1);

    let step = 1;
    const timer = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= 9) {
        clearInterval(timer);
        setIsExecuting(false);
      }
    }, 800);
  };

  const resetPipeline = () => {
    setCurrentStep(1);
    setIsExecuting(false);
  };

  return (
    <>
      <PageHeader
        title="Poisoning Defense & Training Data Screening"
        subtitle="Poisoning Attack ➔ Outlier Detection ➔ Removal ➔ Retraining ➔ Performance Recovery"
        breadcrumb="Poisoning Defense"
      />
      <div className="page-content">

        {/* Step-by-Step Interactive Pipeline Animation */}
        <SectionCard title="Interactive Pipeline: Poisoning Attack to Defense Recovery" icon="🔄" style={{ marginBottom: 24 }}>
          <div className="flex" style={{ gap: 12, marginBottom: 20 }}>
            <button
              className="btn btn-primary"
              onClick={runFullPipeline}
              disabled={isExecuting}
            >
              {isExecuting ? <div className="spinner" /> : <Play size={16} />}
              Run Demonstration Pipeline
            </button>
            <button className="btn btn-secondary" onClick={resetPipeline} disabled={isExecuting}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Stepper horizontal bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
            padding: 16,
            borderRadius: 12,
            overflowX: 'auto',
            marginBottom: 20,
            gap: 8
          }}>
            {STEPS.map((s) => {
              const active = currentStep === s.id;
              const done = currentStep > s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => !isExecuting && setCurrentStep(s.id)}
                  style={{
                    flex: 1,
                    minWidth: 80,
                    textAlign: 'center',
                    padding: '8px 4px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: active ? 'var(--accent-glow)' : (done ? 'rgba(34,197,94,0.1)' : 'transparent'),
                    border: active ? '1px solid var(--accent)' : (done ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent'),
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: active ? 'var(--accent-light)' : (done ? 'var(--success)' : 'var(--text-muted)') }}>
                    Step {s.id}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Details Box */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 12,
            padding: 24,
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{STEPS[currentStep - 1].icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent-light)' }}>
                  {STEPS[currentStep - 1].title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {STEPS[currentStep - 1].desc}
                </div>
              </div>
            </div>

            {/* Dynamic visual metric based on active step */}
            {currentStep < 3 && (
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8, flex: 1 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dataset Status</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: currentStep === 1 ? 'var(--success)' : 'var(--danger)' }}>
                    {currentStep === 1 ? '426 Clean Samples' : '42 Poisoned Samples (10%)'}
                  </div>
                </div>
              </div>
            )}

            {currentStep >= 3 && currentStep <= 6 && (
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 8, marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Outlier Screening Logic:</div>
                <div className="code-block" style={{ fontSize: 11 }}>
                  km_flag = km_dist &gt; percentile_threshold<br />
                  db_flag = db_labels_candidate == -1  <span className="cm"># DBSCAN noise samples</span><br />
                  <strong style={{ color: '#ef4444' }}>suspicious = km_flag | db_flag</strong>  <span className="cm"># 54 flagged samples</span><br />
                  keep = ~suspicious
                </div>
              </div>
            )}

            {currentStep >= 7 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
                <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clean MLP</span>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--info)' }}>97.20%</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>10% Poisoned</span>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--danger)' }}>94.41%</div>
                </div>
                <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--success)' }}>Defended MLP (Retrained)</span>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--success)' }}>97.90%</div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Large Before / After Performance Recovery Banner */}
        <SectionCard title="Performance Recovery Summary (Notebook Results)" icon="🏆" style={{ marginBottom: 24 }}>
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>1. Clean MLP</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--info)', margin: '8px 0' }}>97.20%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>F1: 97.75% · 0 Flagged</div>
            </div>

            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--danger)', textTransform: 'uppercase' }}>2. 10% Outlier Poisoned</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--danger)', margin: '8px 0' }}>94.41%</div>
              <div style={{ fontSize: 12, color: 'var(--danger)' }}>F1: 95.65% · Accuracy Drop -2.79%</div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--success)', textTransform: 'uppercase' }}>3. Defended (K-Means + DBSCAN)</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--success)', margin: '8px 0' }}>97.90%</div>
              <div style={{ fontSize: 12, color: 'var(--success)' }}>F1: 98.32% · 54 Suspicious Removed</div>
            </div>
          </div>

          <WhatHappened>
            The conservative screening (K-Means distance threshold AND DBSCAN noise detection) successfully identified and removed
            <strong style={{ color: 'var(--success)' }}> 54 suspicious training samples</strong>. Retraining the PyTorch MLP on the cleaned data
            fully recovered accuracy from <strong style={{ color: 'var(--danger)' }}>94.41%</strong> back up to <strong style={{ color: 'var(--success)' }}>97.90%</strong> (even higher than clean baseline due to noisy sample filtering).
          </WhatHappened>
        </SectionCard>

        {/* Notebook Screening Comparison Table */}
        <SectionCard title="Notebook Screening Strategies Comparison" icon="📋">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Training Condition</th>
                  <th>Test Accuracy</th>
                  <th>F1 Score</th>
                  <th>Samples Flagged &amp; Removed</th>
                  <th>Security Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Clean Data Baseline</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>97.20%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>97.75%</td>
                  <td>0</td>
                  <td><span className="badge info">BASELINE</span></td>
                </tr>
                <tr style={{ background: 'rgba(239,68,68,0.05)' }}>
                  <td style={{ fontWeight: 600, color: 'var(--danger)' }}>10% Outlier Poisoned (P08)</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--danger)', fontWeight: 700 }}>94.41%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>95.65%</td>
                  <td>0</td>
                  <td><span className="badge danger">POISONED</span></td>
                </tr>
                <tr style={{ background: 'rgba(34,197,94,0.05)' }}>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>10% Poisoned + Conservative Screening (K-Means &amp; DBSCAN)</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--success)', fontWeight: 800 }}>97.90%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>98.32%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>54</td>
                  <td><span className="badge success">FULLY RECOVERED</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>10% Poisoned + Aggressive Screening (K-Means OR DBSCAN)</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>95.10%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>96.09%</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>148</td>
                  <td><span className="badge warning">OVER-FILTERED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
