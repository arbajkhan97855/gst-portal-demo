import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { FAQ_LIST } from '../../data/portalData';

export default function FAQ() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = ['All', 'Registration', 'Returns', 'Payments', 'ITC', 'Invoices'];

  const filtered = FAQ_LIST.filter(item => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) ||
                          item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Frequently Asked Questions' }]} />
      <PageHeader
        title="Frequently Asked Questions (FAQ)"
        subtitle="Quick answers to common questions about GST legislation, filing procedures, and platform usage."
      />

      {/* Search and Category Filter */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div className="input-affix-wrapper" style={{ flex: 1, minWidth: '240px' }}>
              <span className="input-prefix">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control has-prefix"
                placeholder="Search FAQ keywords (e.g. ARN, GSTR-1, ITC, CIN, refund)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>
                Clear
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${selectedCat === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filtered.length > 0 ? (
        <div className="accordion">
          {filtered.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="accordion-item">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{ width: '100%', border: 'none', background: 'var(--surface)', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{faq.question}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-neutral">{faq.category}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="accordion-content">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <HelpCircle className="empty-state-icon" />
          <h4 className="empty-state-title">No Answers Found</h4>
          <p className="empty-state-text">
            No questions matched your search criteria "{search}". Please try another keyword or choose "All".
          </p>
        </div>
      )}
    </div>
  );
}
