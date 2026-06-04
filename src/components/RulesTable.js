import React, { useState, useMemo } from 'react';
import '../styles/rules-table.css';

const ACTION_FILTERS = ['All', 'ALLOW', 'BLOCK', 'DENY', 'PERMIT', 'OTHER'];

const BADGE_COLUMN_TYPES = {
  action: 'action',
  status: 'status',
  state: 'status',
  risk: 'risk',
  level: 'risk',
  severity: 'risk',
  protocol: 'protocol',
  port: 'port',
};

function getBadgeColumnType(column) {
  const normalized = String(column || '').toLowerCase();
  return BADGE_COLUMN_TYPES[normalized] || null;
}

function getBadgeTone(type, value) {
  const v = String(value || '').toUpperCase();

  if (type === 'action' || type === 'status') {
    if (['ALLOW', 'PERMIT', 'ACCEPT', 'OPEN', 'SUCCESS'].includes(v)) return 'good';
    if (['BLOCK', 'DENY', 'DROP', 'REJECT', 'FAILED', 'FAIL', 'CLOSED'].includes(v)) return 'danger';
    if (['PENDING', 'WARN', 'WARNING'].includes(v)) return 'warn';
    return 'neutral';
  }

  if (type === 'risk') {
    if (['CRITICAL', 'HIGH', 'SEVERE'].includes(v)) return 'danger';
    if (['MEDIUM', 'MODERATE'].includes(v)) return 'warn';
    if (['LOW', 'INFO', 'SAFE'].includes(v)) return 'good';
    return 'neutral';
  }

  if (type === 'protocol') {
    if (['TCP'].includes(v)) return 'info';
    if (['UDP'].includes(v)) return 'good';
    if (['ICMP'].includes(v)) return 'warn';
    return 'neutral';
  }

  if (type === 'port') {
    const port = Number(v);
    if (!Number.isNaN(port)) {
      if ([22, 23, 3389].includes(port)) return 'danger';
      if ([80, 443, 53].includes(port)) return 'info';
    }
    return 'neutral';
  }

  return 'neutral';
}

function renderCellContent(column, value) {
  const badgeType = getBadgeColumnType(column);

  if (!badgeType) return value;

  const tone = getBadgeTone(badgeType, value);
  const label = value == null || value === '' ? 'N/A' : String(value);

  return (
    <span className={`rt-badge rt-badge-${tone}`} title={`${String(column)}: ${label}`}>
      {label}
    </span>
  );
}

function getActionCategory(action) {
  const a = String(action || '').toUpperCase();
  if (a === 'ALLOW' || a === 'PERMIT') return 'allow';
  if (a === 'BLOCK' || a === 'DENY') return 'block';
  return 'other';
}

function RulesTable({ entries = [] }) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const columns = useMemo(
    () => (entries.length > 0 ? Object.keys(entries[0]) : []),
    [entries]
  );

  const handleSort = (col) => {
    if (sortKey === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = entries;

    if (actionFilter !== 'All') {
      if (actionFilter === 'OTHER') {
        rows = rows.filter(
          (r) =>
            getActionCategory(r.action || r.Action) === 'other'
        );
      } else {
        rows = rows.filter(
          (r) =>
            String(r.action || r.Action || '').toUpperCase() === actionFilter
        );
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) =>
        columns.some((c) => String(r[c] || '').toLowerCase().includes(q))
      );
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = String(a[sortKey] || '').toLowerCase();
        const bv = String(b[sortKey] || '').toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [entries, actionFilter, search, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleActionFilter = (f) => {
    setActionFilter(f);
    setPage(1);
  };

  if (entries.length === 0) {
    return <p className="rt-empty">No rules to display.</p>;
  }

  return (
    <div className="rt-container">
      {/* Toolbar */}
      <div className="rt-toolbar">
        <input
          className="rt-search"
          type="text"
          placeholder="Search rules…"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search rules"
        />

        <div className="rt-filters" role="group" aria-label="Filter by action">
          {ACTION_FILTERS.map((f) => (
            <button
              key={f}
              className={`rt-filter-btn rt-filter-${f.toLowerCase()} ${actionFilter === f ? 'active' : ''}`}
              onClick={() => handleActionFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <span className="rt-count">
          {filtered.length} rule{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rt-table-wrapper">
        <table className="rt-table">
          <thead>
            <tr>
              <th className="rt-th-index">#</th>
              {columns.map((col) => (
                <th
                  key={col}
                  className={`rt-th-sortable ${sortKey === col ? 'rt-th-active' : ''}`}
                  onClick={() => handleSort(col)}
                  title={`Sort by ${col}`}
                >
                  {col}
                  <span className="rt-sort-icon">
                    {sortKey === col ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="rt-no-results">
                  No matching rules found.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const category = getActionCategory(row.action || row.Action);
                return (
                  <tr key={i} className={`rt-row rt-row-${category}`}>
                    <td className="rt-td-index">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    {columns.map((col) => (
                      <td key={col} className={col === 'action' || col === 'Action' ? `rt-action-cell rt-action-${category}` : ''}>
                        {renderCellContent(col, row[col])}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rt-pagination" role="navigation" aria-label="Pagination">
          <button
            className="rt-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
            )
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === '…' ? (
                <span key={`ellipsis-${idx}`} className="rt-page-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={`rt-page-btn ${page === item ? 'active' : ''}`}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              )
            )}

          <button
            className="rt-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next ›
          </button>

          <span className="rt-page-info">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

export default RulesTable;
