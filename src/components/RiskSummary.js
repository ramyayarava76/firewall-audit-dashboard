import React from 'react';
import '../styles/risk-summary.css';

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getRiskLevel(riskCount, total) {
  if (total <= 0 || riskCount <= 0) return { label: 'Low', tone: 'safe' };
  const ratio = riskCount / total;
  if (ratio >= 0.5) return { label: 'Critical', tone: 'critical' };
  if (ratio >= 0.25) return { label: 'High', tone: 'high' };
  if (ratio >= 0.1) return { label: 'Moderate', tone: 'medium' };
  return { label: 'Low', tone: 'safe' };
}

function RiskSummary({ summary = {} }) {
  const total = toNumber(summary.total);
  const blocked = toNumber(summary.blocked);
  const allowed = toNumber(summary.allowed);
  const riskCount = toNumber(summary.riskCount);

  const blockRate = total > 0 ? Math.round((blocked / total) * 100) : 0;
  const riskRate = total > 0 ? Math.round((riskCount / total) * 100) : 0;
  const exposureCount = Math.max(0, allowed - blocked);
  const level = getRiskLevel(riskCount, total);

  const cards = [
    {
      key: 'risk-level',
      title: 'Risk Level',
      value: level.label,
      hint: `${riskRate}% of entries flagged`,
      tone: level.tone,
    },
    {
      key: 'risk-count',
      title: 'Risk Count',
      value: riskCount,
      hint: `${total} total entries scanned`,
      tone: 'high',
    },
    {
      key: 'block-rate',
      title: 'Block Rate',
      value: `${blockRate}%`,
      hint: `${blocked} blocked or denied`,
      tone: 'medium',
    },
    {
      key: 'exposure',
      title: 'Exposure Signals',
      value: exposureCount,
      hint: 'Approx. allows minus blocks',
      tone: 'safe',
    },
  ];

  return (
    <section className="risk-summary" aria-label="Risk summary">
      <div className="risk-summary-head">
        <h3 className="risk-summary-title">Risk Overview</h3>
        <p className="risk-summary-subtitle">Quick security posture indicators from current audit results.</p>
      </div>

      <div className="risk-cards-grid">
        {cards.map((card) => (
          <article key={card.key} className={`risk-card risk-card-${card.tone}`}>
            <span className="risk-card-title">{card.title}</span>
            <strong className="risk-card-value">{card.value}</strong>
            <span className="risk-card-hint">{card.hint}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RiskSummary;
