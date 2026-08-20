import { ArrowRight, Trophy, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageHeader, SectionCard } from '../components/UI';
import { EVASION_ATTACKS, MLP_RESULTS } from '../data/notebookData';

const PIPELINE_FULL = [
  { label: 'DATASET', sub: 'Breast Cancer (569 samples, 30 features)', color: '#3b82f6' },
  { label: 'BASELINE MODELS', sub: 'Logistic Reg. (98.60%), SVM (97.90%)', color: '#8b5cf6' },
  { label: 'DECISION-TIME EVASION', sub: '12 attempts, 10 successful (83.33%)', color: '#ef4444' },
  { label: 'DECISION-TIME DEFENSE', sub: 'Probability & Ensemble Abstention', color: '#f59e0b' },
  { label: 'DATA POISONING', sub: 'PyTorch MLP (30➔32➔16➔1), 10% Outliers', color: '#ef4444' },
  { label: 'POISONING DETECTION', sub: 'K-Means & DBSCAN Screening', color: '#8b5cf6' },
  { label: 'CLEANING & RETRAINING', sub: '54 suspicious samples removed', color: '#22c55e' },
  { label: 'VALIDATION', sub: 'Defended Accuracy: 97.90% (F1: 98.32%)', color: '#22c55e' },
];

export default function Conclusion() {
  return (
    <>
      <PageHeader
        title="Key Security Insights & Summary"
        subtitle="Final technical summary and security guidelines for building robust machine learning systems"
        breadcrumb="Key Takeaways"
      />
      <div className="page-content">

        {/* Complete Security Pipeline Diagram */}
        <SectionCard title="End-to-End ML Security Pipeline" icon="🔄" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {PIPELINE_FULL.map((step, idx) => (
              <div
                key={step.label}
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${step.color}40`,
                  borderRadius: 10,
                  padding: 16,
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: step.color, textTransform: 'uppercase', marginBottom: 4 }}>
                  Step {idx + 1}
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Key Findings Checklist */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <SectionCard title="Key Empirical Results" icon="📌">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
              {[
                ['Clean Logistic Regression Accuracy', '98.60% (Highest clean baseline)'],
                ['Total Evasion Attack Attempts', '12 decision-time attempts'],
                ['Successful Evasion Attacks', '10 / 12 attempts (83.33% success rate)'],
                ['Clean PyTorch MLP Accuracy', '97.20%'],
                ['10% Outlier Poisoned MLP Accuracy', '94.41% (-2.79% degradation)'],
                ['Defended MLP Accuracy', '97.90% (Full performance recovery)'],
                ['Suspicious Training Samples Flagged', '54 samples removed via K-Means & DBSCAN'],
              ].map(([k, v]) => (
                <li key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent-light)' }}>{v}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Primary Security Takeaways" icon="🎓">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: 13, marginBottom: 4 }}>
                  1. High Clean Accuracy ≠ Security
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Models achieving &gt;98% accuracy on clean test data remain highly susceptible to small, constrained inputs shift at decision time (83.33% attack success).
                </div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--warning)', fontSize: 13, marginBottom: 4 }}>
                  2. Protect Both Decision-Time &amp; Training Data
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Attackers can strike at inference time (evasion) or during data collection (poisoning). Comprehensive defense requires dual-phase monitoring.
                </div>
              </div>

              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: 13, marginBottom: 4 }}>
                  3. Defense-in-Depth Provides Maximum Robustness
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Combining soft-probability thresholding, ensemble agreement, and unsupervised outlier screening (K-Means + DBSCAN) creates a resilient ML defense barrier.
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Final Conclusion Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(34,197,94,0.1) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 16,
          padding: 28,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🛡️</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
            "High accuracy on clean data does not guarantee robustness. Decision-time inputs and training data both require protection. Combining multiple detection and defense mechanisms provides a stronger security strategy."
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Machine Learning Security &amp; Defense Platform
          </p>
        </div>
      </div>
    </>
  );
}
