import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { PageHeader, SectionCard, WhatHappened, ExpandableCode, Tooltip as CustomTooltip } from '../components/UI';
import { POISONING_SCENARIOS } from '../data/notebookData';

const barData = POISONING_SCENARIOS.map(p => ({
  name: p.id,
  method: p.method,
  rate: `${(p.poisonRate * 100).toFixed(0)}%`,
  Accuracy: (p.accuracy * 100).toFixed(2),
  Drop: (p.accuracyDrop * 100).toFixed(2),
  fill: p.id === 'P08' ? '#ef4444' : '#8b5cf6',
}));

export default function DataPoisoning() {
  const [selectedScenario, setSelectedScenario] = useState('P08');
  const scenario = POISONING_SCENARIOS.find(s => s.id === selectedScenario) || POISONING_SCENARIOS[7];

  return (
    <>
      <PageHeader
        title="Data Poisoning Attack"
        subtitle="Contaminating the training dataset prior to model training to degrade overall performance"
        breadcrumb="Data Poisoning"
      />
      <div className="page-content">

        {/* Conceptual visual */}
        <SectionCard title="Concept: Training-Time Data Poisoning" icon="💡" style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Unlike evasion attacks (which modify test inputs at decision time), data poisoning modifies the
            <strong style={{ color: 'var(--accent-light)' }}> training data</strong> before the model learns.
            The attacker injects noise, flips labels, or introduces feature outliers into the training set.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            background: 'var(--bg-elevated)',
            padding: '20px 24px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 1</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#3b82f6', marginTop: 4 }}>Clean Training Data</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>426 clean samples</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>➔</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 2</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#ef4444', marginTop: 4 }}>Data Poisoning</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Inject noise / flips</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>➔</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 3</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f59e0b', marginTop: 4 }}>Poisoned Training Data</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Corrupted patterns</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>➔</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 4</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#8b5cf6', marginTop: 4 }}>PyTorch MLP Training</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>30 → 32 → 16 → 1</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>➔</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 5</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#ef4444', marginTop: 4 }}>Performance Drop</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lower test accuracy</div>
            </div>
          </div>
        </SectionCard>

        {/* Deep Learning Architecture & Scenario Highlight */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* PyTorch MLP Architecture */}
          <SectionCard title="Target Deep Learning Architecture" icon="🧠">
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                PyTorch Multi-Layer Perceptron (MLP) binary classifier:
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                background: 'var(--bg-elevated)',
                padding: 16,
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--info)' }}>30</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Input Features</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>➔</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent-light)' }}>32</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Linear + ReLU</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>➔</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent-light)' }}>16</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Linear + ReLU</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>➔</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--success)' }}>1</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Sigmoid Output</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ⚙️ Loss Function: Binary Cross-Entropy (BCELoss)<br />
              ⚙️ Optimizer: Adam (lr=0.005, weight_decay=1e-4)<br />
              ⚙️ Training Epochs: 150
            </div>
          </SectionCard>

          {/* Highlight Scenario P08 */}
          <SectionCard title="Highlighted Scenario: P08 (10% Feature Outlier Injection)" icon="🎯">
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--danger)', marginBottom: 6 }}>
                P08 — 10% Feature Outlier Injection
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The attacker selects 10% of the training samples (42 samples) and adds large feature offsets (+4.0 or -4.0 standard deviations) to all 30 features.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Clean MLP Accuracy</span>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--success)', marginTop: 2 }}>97.20%</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>P08 Poisoned Accuracy</span>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--danger)', marginTop: 2 }}>94.41%</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Accuracy Drop</span>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--warning)', marginTop: 2 }}>-2.79%</div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Poisoning Scenarios Bar Chart */}
        <SectionCard title="Poisoning Attack Results Across 8 Scenarios" icon="📊" style={{ marginBottom: 24 }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v, name) => [`${v}%`, name]}
              />
              <Bar dataKey="Accuracy" radius={[6,6,0,0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* All 8 Scenarios Table */}
        <SectionCard title="Full 8 Poisoning Attack Scenarios Table" icon="📋">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Attack ID</th>
                  <th>Poisoning Method</th>
                  <th>Poison Rate</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                  <th>Accuracy Drop</th>
                </tr>
              </thead>
              <tbody>
                {POISONING_SCENARIOS.map(p => (
                  <tr key={p.id} style={{ background: p.id === 'P08' ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                    <td style={{ fontWeight: 700, color: p.id === 'P08' ? 'var(--danger)' : 'var(--accent-light)' }}>{p.id}</td>
                    <td>{p.method}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(p.poisonRate * 100).toFixed(0)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{(p.accuracy * 100).toFixed(2)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(p.precision * 100).toFixed(2)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(p.recall * 100).toFixed(2)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(p.f1 * 100).toFixed(2)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      <span className={`delta-pill ${p.accuracyDrop > 0 ? 'neg' : (p.accuracyDrop < 0 ? 'pos' : 'zero')}`}>
                        {p.accuracyDrop > 0 ? `-${(p.accuracyDrop * 100).toFixed(2)}%` : `+${(Math.abs(p.accuracyDrop) * 100).toFixed(2)}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <WhatHappened>
            Not every poisoning attack decreases accuracy equally. P06 (Boundary-targeted label flip at 10%) and P07/P08 (Feature outlier injection)
            caused the largest accuracy drops down to 94.41%. Target selection, attack strategy, and neural network stochasticity influence the resulting degradation.
          </WhatHappened>
        </SectionCard>

        {/* Code Snippets */}
        <div className="grid-2 mt-24">
          <ExpandableCode title="Notebook Implementation: Feature Outlier Poisoning">
            <div className="code-block">
              <span className="cm"># Feature Outlier Poisoning logic from notebook (P07, P08):</span><br />
              ids = rng.choice(<span className="fn">len</span>(Xp), n, replace=<span className="kw">False</span>) <span className="cm"># randomly select training samples</span><br />
              signs = rng.choice([-1, 1], size=(n, Xp.shape[1])) <span className="cm"># positive/negative directions</span><br />
              <strong style={{ color: '#f59e0b' }}>Xp[ids] += 4.0 * signs</strong> <span className="cm"># modify training feature values</span>
            </div>
          </ExpandableCode>

          <ExpandableCode title="Notebook Implementation: Label Flip Poisoning">
            <div className="code-block">
              <span className="cm"># Label Flip Poisoning logic from notebook (P01-P06):</span><br />
              ids = rng.choice(<span className="fn">len</span>(Xp), n, replace=<span className="kw">False</span>) <span className="cm"># select target samples</span><br />
              <strong style={{ color: '#ef4444' }}>yp[ids] = 1 - yp[ids]</strong> <span className="cm"># invert training target labels</span>
            </div>
          </ExpandableCode>
        </div>
      </div>
    </>
  );
}
