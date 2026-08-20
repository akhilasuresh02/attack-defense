import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader, StatCard, SectionCard, WhatHappened, ExpandableCode } from '../components/UI';
import { DATASET, SAMPLE_ROWS, FEATURE_STATS } from '../data/notebookData';

const CLASS_DIST_DATA = [
  { name: 'Malignant\n(0)', count: DATASET.classDistribution.malignant, fill: '#ef4444' },
  { name: 'Benign\n(1)', count: DATASET.classDistribution.benign, fill: '#22c55e' },
];

export default function Dataset() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const feat = FEATURE_STATS[selectedFeature];

  // Simulated distribution bars (representative, not actual histogram)
  const distData = (() => {
    const { min, max, mean, std } = feat;
    const range = max - min;
    const steps = 8;
    return Array.from({ length: steps }, (_, i) => {
      const x = min + (range / steps) * i;
      const center = mean;
      const sigma = std || 1;
      const gauss = Math.exp(-0.5 * Math.pow((x - center) / sigma, 2));
      return { x: x.toFixed(3), count: Math.round(gauss * 80) };
    });
  })();

  return (
    <>
      <PageHeader
        title="Dataset"
        subtitle="Breast Cancer Wisconsin (Diagnostic) — Source of truth for all experiments"
        breadcrumb="Dataset"
      />
      <div className="page-content">

        {/* Dataset overview cards */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <StatCard label="Total Samples" value={DATASET.totalSamples} sub="All observations" color="var(--info)" />
          <StatCard label="Features" value={DATASET.features} sub="Numerical measurements" color="#8b5cf6" />
          <StatCard label="Training Set" value={DATASET.trainSize} sub="75% stratified split" color="var(--success)" />
          <StatCard label="Test Set" value={DATASET.testSize} sub="25% stratified split" color="var(--warning)" />
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Class distribution */}
          <SectionCard title="Class Distribution" icon="🎯">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{DATASET.classDistribution.malignant}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Malignant (Class 0)</div>
                <div style={{ fontSize: 11, color: '#ef4444' }}>{((DATASET.classDistribution.malignant / DATASET.totalSamples) * 100).toFixed(1)}%</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>{DATASET.classDistribution.benign}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Benign (Class 1)</div>
                <div style={{ fontSize: 11, color: '#22c55e' }}>{((DATASET.classDistribution.benign / DATASET.totalSamples) * 100).toFixed(1)}%</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={CLASS_DIST_DATA} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <RechartTooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* Dataset info */}
          <SectionCard title="Dataset Information" icon="ℹ️">
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              {DATASET.description}
            </p>
            <table className="data-table" style={{ width: '100%' }}>
              <tbody>
                {[
                  ['Source', 'scikit-learn (load_breast_cancer)'],
                  ['Random Seed', 'SEED = 42'],
                  ['Split Strategy', 'Stratified (train_test_split)'],
                  ['Test Size', '25% (test_size=0.25)'],
                  ['Feature Scale', 'StandardScaler (for LR, SVM)'],
                  ['Target 0', 'Malignant'],
                  ['Target 1', 'Benign'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{k}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* Feature Explorer */}
        <SectionCard title="Feature Explorer" icon="🔍" className="mt-16" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Select feature:</label>
            <select
              value={selectedFeature}
              onChange={e => setSelectedFeature(Number(e.target.value))}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                color: 'var(--text-primary)', borderRadius: 6, padding: '6px 12px',
                fontSize: 13, fontFamily: 'inherit'
              }}
            >
              {FEATURE_STATS.map((f, i) => (
                <option key={f.feature} value={i}>{f.feature}</option>
              ))}
            </select>
            <div className="flex" style={{ gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
              {[['Min', feat.min.toFixed(4)], ['Mean', feat.mean.toFixed(4)], ['Std', feat.std.toFixed(4)], ['Max', feat.max.toFixed(4)]].map(([k, v]) => (
                <div key={k}>
                  <span style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>{k}</span>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--accent-light)', fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={distData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <RechartTooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }}
                formatter={(v) => [v, 'Count']}
              />
              <Bar dataKey="count" fill="var(--accent-light)" radius={[3,3,0,0]} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
            ⚠️ Distribution shape is approximated from feature statistics for illustration. Actual histogram may differ.
          </div>
        </SectionCard>

        {/* Sample data preview */}
        <SectionCard title="Dataset Preview (First 5 Rows)" icon="📋">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Mean Radius</th>
                  <th>Mean Texture</th>
                  <th>Mean Perimeter</th>
                  <th>Mean Area</th>
                  <th>Mean Smoothness</th>
                  <th>Worst Radius</th>
                  <th>Worst Perimeter</th>
                  <th>Worst Area</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map(row => (
                  <tr key={row.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{row.id}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.meanRadius}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.meanTexture}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.meanPerimeter}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.meanArea}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.meanSmoothness}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.worstRadius}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.worstPerimeter}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.worstArea}</td>
                    <td>
                      <span className={`badge ${row.target === 0 ? 'danger' : 'success'}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <WhatHappened>
            The dataset has 30 numerical features per sample. Each value is a measurement derived from cell nucleus images.
            Target 0 = Malignant (cancer present), Target 1 = Benign (no cancer). All 569 samples were loaded from
            scikit-learn's built-in dataset with a fixed seed=42 for reproducibility.
          </WhatHappened>
        </SectionCard>
      </div>
    </>
  );
}
