import {
  LayoutDashboard, Database, Brain, Zap, Shield,
  FlaskConical, ShieldCheck, BarChart3, Lock, Trophy,
  Activity
} from 'lucide-react';

const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { id: 'overview', label: 'Platform Home', icon: LayoutDashboard },
      { id: 'dataset', label: 'Dataset Explorer', icon: Database, badge: '569', badgeType: 'info' },
      { id: 'models', label: 'Model Benchmarks', icon: Brain, badge: '4', badgeType: 'info' },
    ],
  },
  {
    section: 'Decision-Time Attacks',
    items: [
      { id: 'evasion', label: 'Evasion Attack', icon: Zap, badge: 'Attack', badgeType: 'danger' },
      { id: 'evasion_defense', label: 'Evasion Defense', icon: Shield, badge: 'Defend', badgeType: 'success' },
    ],
  },
  {
    section: 'Data Poisoning',
    items: [
      { id: 'poisoning', label: 'Poisoning Attack', icon: FlaskConical, badge: 'Attack', badgeType: 'danger' },
      { id: 'poisoning_defense', label: 'Poisoning Defense', icon: ShieldCheck, badge: 'Defend', badgeType: 'success' },
    ],
  },
  {
    section: 'Security Insights',
    items: [
      { id: 'results', label: 'Attack vs Defense', icon: BarChart3 },
      { id: 'defenses', label: '20 Defenses Hub', icon: Lock },
      { id: 'conclusion', label: 'Key Takeaways', icon: Trophy },
    ],
  },
];

export default function Sidebar({ activePage, onNav }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Activity size={12} />
          Interactive Security Lab
        </div>
        <h1>ML Security &amp;<br />Defense Hub</h1>
        <p>Real-time Security Simulator</p>
      </div>

      {NAV_ITEMS.map((section) => (
        <div key={section.section} className="nav-section">
          <div className="nav-section-label">{section.section}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                <Icon size={15} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="sidebar-footer">
        <div style={{ marginBottom: 4, fontWeight: 600, color: 'var(--text-secondary)' }}>
          ML Security Platform
        </div>
        <div>Interactive Evasion &amp; Poisoning Lab</div>
      </div>
    </aside>
  );
}
