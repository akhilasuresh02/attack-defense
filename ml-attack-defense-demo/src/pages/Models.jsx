import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { PageHeader, StatCard, SectionCard, WhatHappened, ExpandableCode } from '../components/UI';
import { CLASSIFIERS } from '../data/notebookData';

const METRICS = ['Accuracy', 'Precision', 'Recall', 'F1', 'ROC-AUC'];

const barData = CLASSIFIERS.map(c => ({
  name: c.name.replace('Logistic Regression', 'Log. Reg.').replace('Random Forest', 'Rand. Forest'),
  Accuracy: (c.accuracy * 100).toFixed(2),
  Precision: (c.precision * 100).toFixed(2),
  Recall: (c.recall * 100).toFixed(2),
  F1: (c.f1 * 100).toFixed(2),
  'ROC-AUC': (c.rocAuc * 100).toFixed(2),
  fill: c.color,
}));

const MODEL_TYPE_LABELS = {
  'Logistic Regression': '✦ Required linear model',
  'SVM': 'Kernel-based classifier',
  'Random Forest': 'Ensemble method',
  'Decision Tree': 'Tree-based classifier',
};

export default function Models() {
  return (
    <>
      <PageHeader
        title="Baseline Classifiers"
        subtitle="Four ML models trained on clean data — reference performance for evaluating attacks"
        breadcrumb="Models"
      />
      <div className="page-content">

        {/* Top accuracy cards */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {CLASSIFIERS.map(c => (
            <div key={c.name} className="stat-card">
              <div className="stat-label">{c.name}</div>
              <div className="stat-value" style={{ color: c.color }}>{(c.accuracy * 100).toFixed(2)}%</div>
              <div className="stat-sub">F1: {(c.f1 * 100).toFixed(2)}%</div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>{MODEL_TYPE_LABELS[c.name]}</div>
            </div>
          ))}
        </div>

        {/* Accuracy comparison bar chart */}
        <SectionCard title="Clean-Data Accuracy Comparison" icon="📊" style={{ marginBottom: 24 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Accuracy']}
              />
              <Bar dataKey="Accuracy" radius={[6,6,0,0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={CLASSIFIERS[index].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <WhatHappened>
            These are the baseline (clean data) accuracies. Logistic Regression leads at 98.60%, followed by SVM at
            97.90%, Random Forest at 95.80%, and Decision Tree at 93.71%. These values are used as the reference point
            for measuring the impact of attacks.
          </WhatHappened>
        </SectionCard>

        {/* Full metrics table */}
        <SectionCard title="Full Performance Metrics (Clean Test Data)" icon="📋">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Type</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                  <th>ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {CLASSIFIERS.map(c => (
                  <tr key={c.name}>
                    <td style={{ fontWeight: 600, color: c.color }}>{c.name}</td>
                    <td>
                      <span className="badge purple" style={{ fontSize: 10 }}>{c.type}</span>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {(c.accuracy * 100).toFixed(4)}%
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(c.precision * 100).toFixed(4)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(c.recall * 100).toFixed(4)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(c.f1 * 100).toFixed(4)}%</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{(c.rocAuc * 100).toFixed(4)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Model architectures */}
        <div className="grid-2 mt-24">
          <SectionCard title="Model Architectures" icon="🏗️">
            {[
              { name: 'Logistic Regression', code: 'LogisticRegression(max_iter=2000, random_state=42)', note: 'Inside Pipeline with StandardScaler' },
              { name: 'Decision Tree', code: 'DecisionTreeClassifier(max_depth=5, random_state=42)', note: 'Direct (no scaling)' },
              { name: 'Random Forest', code: 'RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)', note: 'Direct (no scaling)' },
              { name: 'SVM', code: "SVC(kernel='rbf', probability=True, random_state=42)", note: 'Inside Pipeline with StandardScaler' },
            ].map(m => (
              <div key={m.name} style={{ marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{m.name}</div>
                <div className="code-block" style={{ padding: '8px 12px', fontSize: 11 }}>{m.code}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>⚙️ {m.note}</div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Key Note" icon="⚠️">
            <div style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}>
              <strong style={{ color: 'var(--accent-light)' }}>Logistic Regression</strong> is the required
              linear model in this project. All four classifiers use probability=True so that soft-probability
              thresholding can be applied as a defense.
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Important:</strong> High accuracy on clean data
              does NOT guarantee robustness against adversarial attacks. The following pages demonstrate exactly
              how these high-performing models can be fooled.
            </div>
            <div style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              {[
                ['Training Set', '426 samples (stratified)'],
                ['Test Set', '143 samples'],
                ['Evaluation Metric', 'Accuracy, F1, ROC-AUC'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
