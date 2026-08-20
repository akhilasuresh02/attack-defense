import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { PageHeader, SectionCard, WhatHappened, ExpandableCode, Tooltip } from '../components/UI';
import { EVASION_ATTACKS, ENSEMBLE_DATA, PROB_DEFENSE_EXAMPLE } from '../data/notebookData';

export default function EvasionDefense() {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [customProb, setCustomProb] = useState(0.4544);

  const sample = ENSEMBLE_DATA[selectedSampleIndex] || ENSEMBLE_DATA[0];

  // Calculate probability decision
  const getProbDecision = (p) => {
    if (p >= 0.80) return { action: 'ACCEPT', label: 'ACCEPT (High confidence benign)', color: '#22c55e' };
    if (p <= 0.20) return { action: 'ACCEPT', label: 'ACCEPT (High confidence malignant)', color: '#22c55e' };
    return { action: 'ABSTAIN / REVIEW', label: 'ABSTAIN: Uncertain prediction in range (0.20 – 0.80)', color: '#f59e0b' };
  };

  const probDec = getProbDecision(customProb);

  return (
    <>
      <PageHeader
        title="Decision-Time Defense Mechanisms"
        subtitle="Detecting and filtering suspicious/uncertain inputs before automated decision acceptance"
        breadcrumb="Evasion Defense"
      />
      <div className="page-content">

        {/* Overview cards of key decision-time defenses */}
        <div className="grid-3" style={{ marginBottom: 24 }}>
          <SectionCard title="1. Probability Thresholding" icon="📊">
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Requires strong prediction confidence before accepting an automated decision. If P is near 0.50 (uncertain zone), the system abstains.
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--accent-light)', fontWeight: 600 }}>Rule: P ≥ 0.80 or P ≤ 0.20 → ACCEPT</div>
          </SectionCard>

          <SectionCard title="2. Novelty Detection (K-Means / DBSCAN)" icon="🔍">
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Flags inputs that lie far from learned cluster centroids or outside dense core regions (noise points in DBSCAN).
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--accent-light)', fontWeight: 600 }}>Rule: Distance &gt; threshold → NOVELTY FLAGGED</div>
          </SectionCard>

          <SectionCard title="3. Ensemble Agreement" icon="👥">
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Evaluates test sample across 4 independent classifiers (Logistic Regression, Decision Tree, Random Forest, SVM).
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--accent-light)', fontWeight: 600 }}>Rule: Disagreement → ABSTAIN / HUMAN REVIEW</div>
          </SectionCard>
        </div>

        {/* Interactive Defense Check Panel */}
        <SectionCard title="Interactive Defense Verification Panel" icon="🛡️" style={{ marginBottom: 24 }}>
          <div className="grid-2">
            {/* Left: Sample Selection & Gauge */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Test Sample / Attack Instance:</label>
                <select
                  value={selectedSampleIndex}
                  onChange={e => {
                    const idx = Number(e.target.value);
                    setSelectedSampleIndex(idx);
                    // set custom prob based on notebook sample
                    const s = ENSEMBLE_DATA[idx];
                    setCustomProb(s.allAgree ? 0.95 : 0.4544);
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontFamily: 'inherit'
                  }}
                >
                  {ENSEMBLE_DATA.map((s, i) => (
                    <option key={s.testIndex} value={i}>
                      Sample #{s.testIndex} — True Label: {s.trueLabel === 0 ? 'Malignant' : 'Benign'} ({s.allAgree ? 'Ensemble Agreed' : 'Model Disagreement'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider for custom probability gauge */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Prediction Probability P(Benign):</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent-light)' }}>
                    {customProb.toFixed(4)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={customProb}
                  onChange={e => setCustomProb(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />

                {/* Interactive probability gauge */}
                <div className="prob-gauge" style={{ marginTop: 16 }}>
                  <div className="prob-gauge-track">
                    <div className="prob-zone accept" style={{ width: '20%' }}>ACCEPT (≤ 0.20)</div>
                    <div className="prob-zone abstain" style={{ width: '60%' }}>ABSTAIN / REVIEW (0.20 – 0.80)</div>
                    <div className="prob-zone accept" style={{ width: '20%' }}>ACCEPT (≥ 0.80)</div>
                  </div>
                  <div className="prob-marker" style={{ left: `${customProb * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Right: Defense status evaluation */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Automated Security Evaluation</div>
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 10 }}>
                <div className="defense-check-row">
                  <span className="defense-check-label">Probability Threshold Check</span>
                  <span className="badge" style={{ background: `${probDec.color}20`, color: probDec.color }}>
                    {probDec.action}
                  </span>
                </div>
                <div className="defense-check-row">
                  <span className="defense-check-label">K-Means Novelty Check</span>
                  <span className="badge success">NORMAL (Dist &lt; threshold)</span>
                </div>
                <div className="defense-check-row">
                  <span className="defense-check-label">DBSCAN Density Check</span>
                  <span className="badge success">CORE SAMPLE (In-distribution)</span>
                </div>
                <div className="defense-check-row">
                  <span className="defense-check-label">Ensemble Agreement</span>
                  <span className={`badge ${sample.allAgree ? 'success' : 'warning'}`}>
                    {sample.allAgree ? 'ALL AGREE (4/4)' : 'DISAGREEMENT (Abstain)'}
                  </span>
                </div>
                <div className="defense-check-row" style={{ paddingTop: 16, marginTop: 8, borderTop: '1px dashed var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>FINAL SECURITY DECISION</span>
                  <span className={`badge ${sample.allAgree && probDec.action === 'ACCEPT' ? 'success' : 'warning'}`} style={{ fontSize: 12, padding: '4px 12px' }}>
                    {sample.allAgree && probDec.action === 'ACCEPT' ? 'ACCEPT PREDICTION' : 'ABSTAIN / ESCALATE TO HUMAN'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Notebook Ensemble Output Table */}
        <SectionCard title="Ensemble Agreement Data from Notebook (10 Test Samples)" icon="👥" style={{ marginBottom: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Test Index</th>
                  <th>True Label</th>
                  <th>Logistic Reg.</th>
                  <th>Decision Tree</th>
                  <th>Random Forest</th>
                  <th>SVM</th>
                  <th>All Agree?</th>
                  <th>Security Decision</th>
                </tr>
              </thead>
              <tbody>
                {ENSEMBLE_DATA.map(s => (
                  <tr key={s.testIndex}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>#{s.testIndex}</td>
                    <td>
                      <span className={`badge ${s.trueLabel === 0 ? 'danger' : 'success'}`}>
                        {s.trueLabel === 0 ? 'Malignant' : 'Benign'}
                      </span>
                    </td>
                    <td>{s.logistic}</td>
                    <td>{s.tree}</td>
                    <td>{s.forest}</td>
                    <td>{s.svm}</td>
                    <td>
                      <span className={`badge ${s.allAgree ? 'success' : 'warning'}`}>
                        {s.allAgree ? 'True' : 'False'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: s.allAgree ? 'var(--success)' : 'var(--warning)' }}>
                      {s.decision}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <WhatHappened>
            In sample #291 and #385, model predictions diverged across classifiers (e.g. Decision Tree / Random Forest predicted class 1 while Logistic Regression predicted class 0).
            The ensemble agreement defense detects this disagreement and produces an <strong style={{ color: 'var(--warning)' }}>ABSTAIN: model disagreement</strong> decision.
          </WhatHappened>
        </SectionCard>

        {/* Notebook code snippet */}
        <ExpandableCode title="Notebook Implementation: Ensemble Agreement & Abstention Logic">
          <div className="code-block">
            <span className="kw">def</span> <span className="fn">ensemble_predict</span>(x):<br />
            &nbsp;&nbsp;preds = &#123;name: int(model.predict([x])[0]) <span className="kw">for</span> name, model <span className="kw">in</span> models.items()&#125;<br />
            &nbsp;&nbsp;final = <span className="fn">int</span>(np.mean(<span className="fn">list</span>(preds.values())) &gt;= 0.5)<br />
            &nbsp;&nbsp;agreement = <span className="fn">len</span>(<span className="fn">set</span>(preds.values())) == 1<br />
            &nbsp;&nbsp;security_decision = <span className="st">f"ACCEPT: class &#123;final&#125;"</span> <span className="kw">if</span> agreement <span className="kw">else</span> <span className="st">"ABSTAIN: model disagreement"</span><br />
            &nbsp;&nbsp;<span className="kw">return</span> preds, final, agreement, security_decision
          </div>
        </ExpandableCode>
      </div>
    </>
  );
}
