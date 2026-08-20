import { useState } from 'react';
import { Play, RotateCcw, Zap, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { PageHeader, SectionCard, WhatHappened, ExpandableCode, Tooltip } from '../components/UI';
import { EVASION_ATTACKS, ATTACK_FEATURE_DEMO, ATTACK_SUCCESS_BY_MODEL } from '../data/notebookData';

export default function EvasionAttack({ onNav }) {
  const [selectedAttackId, setSelectedAttackId] = useState('E01');
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoState, setDemoState] = useState('idle'); // idle | running | done

  const currentAttack = EVASION_ATTACKS.find(a => a.id === selectedAttackId) || EVASION_ATTACKS[0];
  const featureDemo = ATTACK_FEATURE_DEMO[selectedAttackId] || ATTACK_FEATURE_DEMO['E01'];

  const runAttack = () => {
    setIsAnimating(true);
    setDemoState('running');
    setTimeout(() => {
      setIsAnimating(false);
      setDemoState('done');
    }, 1500);
  };

  const resetAttack = () => {
    setDemoState('idle');
    setIsAnimating(false);
  };

  return (
    <>
      <PageHeader
        title="Decision-Time Evasion Attack"
        subtitle="Modifying test-sample feature values at inference time without retraining the classifier"
        breadcrumb="Evasion Attack"
      />
      <div className="page-content">

        {/* Conceptual explanation card */}
        <SectionCard title="Concept: Decision-Time Evasion" icon="💡" style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            At decision time, the model has already been trained and deployed. The attacker cannot change model weights;
            instead, they modify the <strong style={{ color: 'var(--accent-light)' }}>input test sample</strong> before sending it to the model.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
            padding: '20px 24px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            gap: 12,
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Stage 1</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#3b82f6', marginTop: 4 }}>Original Test Sample</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clean patient features</div>
            </div>
            <ArrowRight size={20} color="var(--text-muted)" />
            <div style={{ textAlign: 'center', flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Stage 2</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ef4444', marginTop: 4 }}>Feature Modification</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Constrained directional shifts</div>
            </div>
            <ArrowRight size={20} color="var(--text-muted)" />
            <div style={{ textAlign: 'center', flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Stage 3</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#f59e0b', marginTop: 4 }}>Adversarial Test Sample</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fools classifier prediction</div>
            </div>
          </div>
        </SectionCard>

        {/* Main interactive demo area */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Controls & summary */}
          <SectionCard title="Attack Selector & Setup" icon="⚙️">
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Attack Instance (12 total):</label>
              <select
                value={selectedAttackId}
                onChange={e => { setSelectedAttackId(e.target.value); setDemoState('idle'); }}
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: 'inherit'
                }}
              >
                {EVASION_ATTACKS.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.id} — {a.model} (Test #{a.testIndex}, Budget: {a.budget}, {a.successful ? 'Flipped' : 'Resisted'})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target Classifier</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-light)', marginTop: 2 }}>{currentAttack.model}</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Perturbation Budget</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--warning)', marginTop: 2 }}>{currentAttack.budget}</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Features Modified</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--info)', marginTop: 2 }}>{currentAttack.featureCount} features</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>L2 Norm Change</span>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#ec4899', marginTop: 2 }}>{currentAttack.l2Change.toFixed(2)}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex" style={{ gap: 12 }}>
              <button
                className="btn btn-primary"
                onClick={runAttack}
                disabled={isAnimating}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isAnimating ? <div className="spinner" /> : <Play size={16} />}
                Run Demonstration
              </button>
              <button className="btn btn-secondary" onClick={resetAttack} disabled={isAnimating}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </SectionCard>

          {/* Prediction transformation box */}
          <SectionCard title="Attack Outcome & Prediction Shift" icon="🎯">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'var(--bg-elevated)',
                borderRadius: 10,
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Original Prediction</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: currentAttack.predBefore === 0 ? '#ef4444' : '#22c55e' }}>
                    Class {currentAttack.predBefore} ({currentAttack.predBefore === 0 ? 'Malignant' : 'Benign'})
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    P(Benign) = {(currentAttack.p1Before * 100).toFixed(2)}%
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, transition: 'all 0.5s' }}>
                    {demoState === 'running' ? '⚡' : (demoState === 'done' ? '💥' : '➡️')}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {demoState === 'running' ? 'Attacking...' : 'Inference'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Adversarial Prediction</div>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: demoState === 'done'
                      ? (currentAttack.predAfter === 0 ? '#ef4444' : '#22c55e')
                      : 'var(--text-muted)'
                  }}>
                    {demoState === 'done'
                      ? `Class ${currentAttack.predAfter} (${currentAttack.predAfter === 0 ? 'Malignant' : 'Benign'})`
                      : 'Pending Run'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {demoState === 'done' ? `P(Benign) = ${(currentAttack.p1After * 100).toFixed(2)}%` : '—'}
                  </div>
                </div>
              </div>

              {/* Status banner */}
              <div style={{
                padding: '14px 18px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: currentAttack.successful
                  ? (demoState === 'done' ? 'rgba(239,68,68,0.12)' : 'var(--bg-elevated)')
                  : 'rgba(34,197,94,0.12)',
                border: currentAttack.successful
                  ? (demoState === 'done' ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)')
                  : '1px solid rgba(34,197,94,0.3)',
              }}>
                {currentAttack.successful ? (
                  <AlertTriangle size={24} color="#ef4444" />
                ) : (
                  <CheckCircle size={24} color="#22c55e" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {currentAttack.successful
                      ? (demoState === 'done' ? 'Attack SUCCESSFUL — Prediction Flipped!' : 'Attack Scenario Configured')
                      : 'Attack FAILED — Model Resisted Manipulation'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {currentAttack.successful
                      ? `Class prediction changed from ${currentAttack.predBefore === 0 ? 'Malignant' : 'Benign'} to ${currentAttack.predAfter === 0 ? 'Malignant' : 'Benign'}.`
                      : 'The model maintained its correct prediction despite input perturbations.'}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Feature Modification Table */}
        <SectionCard title={`Feature Values: Original vs Attacked Sample (${selectedAttackId})`} icon="🔍" style={{ marginBottom: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Feature Name</th>
                  <th>Original Value</th>
                  <th>Attacked Value</th>
                  <th>Absolute Change</th>
                  <th>Modification Status</th>
                </tr>
              </thead>
              <tbody>
                {featureDemo.features.map(f => {
                  const delta = (f.attacked - f.original).toFixed(4);
                  return (
                    <tr key={f.name} className={f.changed ? 'feature-row changed' : ''}>
                      <td style={{ fontWeight: f.changed ? 600 : 400 }}>{f.name}</td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{f.original}</td>
                      <td style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: f.changed ? 700 : 400,
                        color: f.changed ? 'var(--danger)' : 'var(--text-secondary)'
                      }}>
                        {f.attacked}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        <span className={`delta-pill ${f.changed ? 'neg' : 'zero'}`}>
                          {f.changed ? `${delta > 0 ? '+' : ''}${delta}` : '0.0000'}
                        </span>
                      </td>
                      <td>
                        {f.changed ? (
                          <span className="badge danger">MODIFIED</span>
                        ) : (
                          <span className="badge info" style={{ opacity: 0.6 }}>UNCHANGED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Code panel & explanation */}
        <div className="grid-2">
          <SectionCard title="Implementation Snippet (Notebook Attack Logic)" icon="💻">
            <div className="code-block" style={{ fontSize: 12 }}>
              <span className="cm"># Evasion attack iterative step logic from notebook:</span><br />
              <span className="kw">for</span> step <span className="kw">in</span> <span className="fn">range</span>(steps):<br />
              &nbsp;&nbsp;candidate = x.copy()<br />
              &nbsp;&nbsp;<span className="kw">for</span> j <span className="kw">in</span> feature_indices:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="cm"># Shift sample feature in perturbation direction:</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<strong style={{ color: '#f59e0b' }}>candidate[j] += direction * max_change[j] / steps</strong><br />
              &nbsp;&nbsp;<span className="kw">if</span> model.predict([candidate])[0] != orig_pred:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> candidate  <span className="cm"># Attack successful!</span>
            </div>
          </SectionCard>

          <SectionCard title="Model Attack Resilience Summary" icon="📊">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Target Model</th>
                  <th>Attempts</th>
                  <th>Successful</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {ATTACK_SUCCESS_BY_MODEL.map(m => (
                  <tr key={m.model}>
                    <td style={{ fontWeight: 600 }}>{m.model}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.attempts}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--danger)', fontWeight: 700 }}>{m.successful}</td>
                    <td>
                      <span className={`badge ${m.rate === 1.0 ? 'danger' : 'warning'}`}>
                        {(m.rate * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <WhatHappened>
              10 out of 12 (83.33%) decision-time evasion attempts successfully flipped the classifier predictions.
              Logistic Regression and SVM were 100% vulnerable (3/3 each), while Random Forest and Decision Tree
              resisted 1 attack each.
            </WhatHappened>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
