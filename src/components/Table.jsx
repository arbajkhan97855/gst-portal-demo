import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileX } from 'lucide-react';

export default function Table({
  columns = [],
  data = [],
  keyField = 'id',
  pageSize = 10,
  emptyMessage = 'No records found in this view',
  actions
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <FileX className="empty-state-icon" />
        <h4 className="empty-state-title">No Data Available</h4>
        <p className="empty-state-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={col.numeric ? 'numeric' : ''} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIdx) => (
              <tr key={row[keyField] || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={col.numeric ? 'numeric' : ''}>
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
                {actions && (
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div>
            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + pageSize, data.length)}</strong> of <strong>{data.length}</strong> entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
