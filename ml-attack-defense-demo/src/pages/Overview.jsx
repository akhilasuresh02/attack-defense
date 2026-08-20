import { Zap, FlaskConical, Shield, ArrowRight } from 'lucide-react';
import { PageHeader, StatCard } from '../components/UI';
import { DATASET, CLASSIFIERS, EVASION_ATTACKS, POISONING_SCENARIOS, MLP_RESULTS } from '../data/notebookData';

const totalAttacks = EVASION_ATTACKS.length + POISONING_SCENARIOS.length;
const successfulEvasions = EVASION_ATTACKS.filter(a => a.successful).length;

const PIPELINE_STEPS = [
  { label: 'CLEAN DATA', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { label: 'MODEL TRAINING', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { label: 'ATTACK', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'BEHAVIOR', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { label: 'DEFENSE', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  { label: 'RECOVERY', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
];

export default function Overview({ onNav }) {
  return (
    <>
      <PageHeader
        title="Machine Learning Security & Defense Platform"
        subtitle="Interactive exploration of Decision-Time Evasion and Data Poisoning using the Breast Cancer Wisconsin Diagnostic Dataset"
        breadcrumb="Overview"
      />
      <div className="page-content">

        {/* Hero banner */}
        <div className="overview-hero animate-in">
          <h2>ML Security &amp; Defense Lab</h2>
          <p>
            An interactive platform to explore 20 distinct attack instances — 12 decision-time evasion attacks and
            8 data poisoning scenarios — along with 20 defense strategies tested on real diagnostic data.
          </p>
          <div className="flex" style={{ gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNav('evasion')}>
              <Zap size={16} />
              Demonstrate Evasion Attack
            </button>
            <button className="btn btn-secondary" onClick={() => onNav('poisoning_defense')}>
              <Shield size={16} />
              Demonstrate Poisoning Defense
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <StatCard
            label="Dataset"
            value={`${DATASET.totalSamples}`}
            sub={`${DATASET.features} features · ${DATASET.classes} classes`}
            color="var(--info)"
          />
          <StatCard
            label="Classifiers"
            value={CLASSIFIERS.length}
            sub="Logistic Regression, SVM, RF, DT"
            color="#8b5cf6"
          />
          <StatCard
            label="Evasion Attacks"
            value={`${successfulEvasions}/${EVASION_ATTACKS.length}`}
            sub={`${((successfulEvasions / EVASION_ATTACKS.length) * 100).toFixed(2)}% success rate`}
            color="var(--danger)"
          />
          <StatCard
            label="Poisoning Scenarios"
            value={POISONING_SCENARIOS.length}
            sub="Random, Boundary & Outlier methods"
            color="var(--warning)"
          />
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Additional stats */}
          <div className="card">
            <div className="card-title">📊 Platform Summary</div>
            <div className="data-table" style={{ fontSize: 13 }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  {[
                    ['Total Attack Scenarios', totalAttacks],
                    ['Defense Strategies', 20],
                    ['Best Classifier Accuracy', '98.60% (Logistic Regression)'],
                    ['Clean MLP Accuracy', `${(MLP_RESULTS.clean.accuracy * 100).toFixed(2)}%`],
                    ['Poisoned MLP Accuracy', `${(MLP_RESULTS.poisoned.accuracy * 100).toFixed(2)}%`],
                    ['Defended MLP Accuracy', `${(MLP_RESULTS.conservativeDefense.accuracy * 100).toFixed(2)}%`],
                    ['Suspicious Samples Flagged', MLP_RESULTS.conservativeDefense.flagged],
                  ].map(([k, v]) => (
                    <tr key={k} className="data-table">
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{k}</td>
                      <td style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attack pipeline */}
          <div className="card">
            <div className="card-title">🔄 Security Experiment Pipeline</div>
            <div className="attack-pipeline">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div className="pipeline-item">
                    <div className="pipeline-circle" style={{ background: step.bg, border: `1px solid ${step.color}40` }}>
                      <span style={{ fontSize: 16 }}>
                        {['🗄️','🤖','⚡','📊','🛡️','✅'][i]}
                      </span>
                    </div>
                    <div className="pipeline-text" style={{ color: step.color }}>{step.label}</div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-muted)', fontSize: 18 }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="card">
          <div className="card-title">🗺️ Interactive Platform Guide</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { step: 1, label: 'Dataset Explorer', page: 'dataset', desc: 'Explore the 569-sample breast cancer dataset', color: 'var(--info)' },
              { step: 2, label: 'Model Benchmarks', page: 'models', desc: 'Clean accuracy of all 4 classifiers', color: '#8b5cf6' },
              { step: 3, label: 'Evasion Attack Simulator', page: 'evasion', desc: 'See how test inputs are modified live', color: 'var(--danger)' },
              { step: 4, label: 'Evasion Defense Check', page: 'evasion_defense', desc: 'Probability & novelty-based defense', color: '#f59e0b' },
              { step: 5, label: 'Data Poisoning Scenarios', page: 'poisoning', desc: 'Training data contamination', color: 'var(--danger)' },
              { step: 6, label: 'Poisoning Defense Pipeline', page: 'poisoning_defense', desc: 'K-Means + DBSCAN screening', color: 'var(--success)' },
              { step: 7, label: 'Attack vs Defense Results', page: 'results', desc: 'Complete result comparison', color: 'var(--info)' },
              { step: 8, label: 'Key Takeaways', page: 'conclusion', desc: 'Key findings & takeaways', color: 'var(--accent-light)' },
            ].map(({ step, label, page, desc, color }) => (
              <div
                key={page}
                className="stat-card"
                style={{ cursor: 'pointer', padding: '16px' }}
                onClick={() => onNav(page)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `${color}20`, color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>{step}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
