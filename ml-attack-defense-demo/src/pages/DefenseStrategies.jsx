import { useState } from 'react';
import { PageHeader, SectionCard } from '../components/UI';
import { DEFENSES } from '../data/notebookData';

export default function DefenseStrategies() {
  const [filterStage, setFilterStage] = useState('ALL');

  const filteredDefenses = filterStage === 'ALL'
    ? DEFENSES
    : DEFENSES.filter(d => d.stage.toUpperCase().includes(filterStage));

  return (
    <>
      <PageHeader
        title="20 Defense Strategies Catalogue"
        subtitle="Complete catalog of 10 Decision-Time Defenses and 10 Data Poisoning Defenses"
        breadcrumb="Defense Strategies"
      />
      <div className="page-content">

        {/* Filter buttons */}
        <div className="flex" style={{ gap: 12, marginBottom: 24 }}>
          {['ALL', 'DECISION-TIME', 'POISONING'].map(stage => (
            <button
              key={stage}
              className={`btn ${filterStage === stage ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStage(stage)}
            >
              {stage === 'ALL' ? 'All 20 Defenses' : (stage === 'DECISION-TIME' ? 'Decision-Time (10)' : 'Poisoning (10)')}
            </button>
          ))}
        </div>

        {/* Defense Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredDefenses.map(d => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-light)' }}>{d.id} — {d.name}</span>
                  <span className={`badge ${d.stage === 'Decision-Time' ? 'info' : 'warning'}`} style={{ fontSize: 10 }}>
                    {d.stage}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  🎯 Purpose: {d.purpose}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                  <strong>Implementation:</strong> {d.implementation}
                </div>
              </div>
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 11,
                color: 'var(--success)',
                fontWeight: 500,
                borderTop: '1px solid var(--border)'
              }}>
                ✅ <strong>Observed Result:</strong> {d.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
