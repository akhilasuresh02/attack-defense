import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { PageHeader, SectionCard, WhatHappened, StatCard } from '../components/UI';
import { CLASSIFIERS, ATTACK_SUCCESS_BY_MODEL, MLP_RESULTS } from '../data/notebookData';

const evasionData = ATTACK_SUCCESS_BY_MODEL.map(m => ({
  name: m.model,
  Attempts: m.attempts,
  Successful: m.successful,
  rate: `${(m.rate * 100).toFixed(0)}%`,
}));

const poisoningData = [
  { name: 'Clean MLP', accuracy: 97.20, f1: 97.75, fill: '#3b82f6' },
  { name: '10% Poisoned', accuracy: 94.41, f1: 95.65, fill: '#ef4444' },
  { name: 'Defended MLP', accuracy: 97.90, f1: 98.32, fill: '#22c55e' },
];

export default function AttackVsDefense() {
  return (
    <>
      <PageHeader
        title="Attack vs Defense Comprehensive Results"
        subtitle="Full experimental comparison across clean baseline, decision-time evasion, and data poisoning defense"
        breadcrumb="Attack vs Defense Results"
      />
      <div className="page-content">

        {/* Section 1: Clean Model Performance */}
        <SectionCard title="Section 1: Clean Model Baseline Performance" icon="📊" style={{ marginBottom: 24 }}>
          <div className="grid-4">
            {CLASSIFIERS.map(c => (
              <div key={c.name} style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.name}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: c.color, margin: '4px 0' }}>{(c.accuracy * 100).toFixed(2)}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Precision: {(c.precision * 100).toFixed(1)}% · Recall: {(c.recall * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 2: Decision-Time Evasion Attack Results */}
        <SectionCard title="Section 2: Decision-Time Evasion Attack Results" icon="⚡" style={{ marginBottom: 24 }}>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Evasion Attempts</span>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--info)', marginTop: 4 }}>12</div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: 16, borderRadius: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--danger)' }}>Successful Evasions</span>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)', marginTop: 4 }}>10 (83.33%)</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                10 out of 12 constrained evasion attempts successfully flipped predictions. Linear models (Logistic Regression) and Kernel SVM were 100% vulnerable, whereas tree ensemble models demonstrated slight resilience.
              </p>
            </div>

            {/* Model-wise Evasion Success Bar Chart */}
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={evasionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis domain={[0, 3]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="Successful" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Data Poisoning & Recovery Results */}
        <SectionCard title="Section 3: Data Poisoning & Defense Performance Recovery" icon="🛡️">
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ background: 'var(--bg-elevated)', padding: 20, borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Clean PyTorch MLP Accuracy</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--info)' }}>97.20%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>10% Poisoned Accuracy (P08)</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--danger)' }}>94.41%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>Defended MLP Accuracy (K-Means + DBSCAN)</span>
                  <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--success)' }}>97.90%</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 10,
                padding: 14,
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <strong style={{ color: 'var(--success)' }}>Performance Recovery Indicator:</strong><br />
                Attack impact dropped accuracy from 97.20% ➔ 94.41%.<br />
                Outlier screening &amp; retraining recovered accuracy from 94.41% ➔ <strong style={{ color: 'var(--success)' }}>97.90%</strong>.
              </div>
            </div>

            <div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={poisoningData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="accuracy" radius={[6,6,0,0]}>
                    {poisoningData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <WhatHappened>
            Different defenses serve different purposes and have varying effectiveness. Decision-time abstention prevents unsafe predictions
            on suspicious inputs, while training-time outlier screening cleans the dataset to allow full performance recovery upon retraining.
          </WhatHappened>
        </SectionCard>
      </div>
    </>
  );
}
