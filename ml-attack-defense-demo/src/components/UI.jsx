import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function Tooltip({ text, children }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip-icon">?</span>
      <span className="tooltip-popup">{text}</span>
    </span>
  );
}

export function ExpandableCode({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="expandable mt-16">
      <div className="expandable-header" onClick={() => setOpen(!open)}>
        <span>📄 {title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      {open && <div className="expandable-body"><div style={{ padding: 16 }}>{children}</div></div>}
    </div>
  );
}

export function WhatHappened({ children }) {
  return (
    <div style={{
      background: 'rgba(124,58,237,0.08)',
      border: '1px solid rgba(124,58,237,0.2)',
      borderRadius: 8,
      padding: '14px 16px',
      marginTop: 16,
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
    }}>
      <span style={{ fontWeight: 700, color: 'var(--accent-light)', marginRight: 6 }}>💡 What happened?</span>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }) {
  return (
    <div className="page-header">
      {breadcrumb && <div className="breadcrumb">🏠 Home / {breadcrumb}</div>}
      <h2>{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
}

export function StatCard({ label, value, sub, color = 'var(--accent-light)' }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function Badge({ type, children }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

export function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-title"><span className="title-icon">{icon}</span>{title}</div>}
      {children}
    </div>
  );
}
