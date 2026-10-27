import React, { useState } from 'react';
import { Scale, IndianRupee, RefreshCw, Calculator, HelpCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';

export default function Calculators() {
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);
  const [supplyType, setSupplyType] = useState('intra'); // intra (CGST+SGST) vs inter (IGST)

  const numAmount = parseFloat(amount) || 0;
  let baseAmount = 0;
  let totalTax = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let grandTotal = 0;

  if (isInclusive) {
    baseAmount = (numAmount * 100) / (100 + rate);
    totalTax = numAmount - baseAmount;
    grandTotal = numAmount;
  } else {
    baseAmount = numAmount;
    totalTax = (numAmount * rate) / 100;
    grandTotal = numAmount + totalTax;
  }

  if (supplyType === 'intra') {
    cgst = totalTax / 2;
    sgst = totalTax / 2;
    igst = 0;
  } else {
    cgst = 0;
    sgst = 0;
    igst = totalTax;
  }

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'GST Tax Calculators' }]} />
      <PageHeader
        title="GST Tax & Rate Calculator"
        subtitle="Simulate and compute base taxable values, GST percentages, and split between Central (CGST), State (SGST), and Integrated Tax (IGST)."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Input Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Calculator size={18} className="text-primary" />
              <span>Input Tax Parameters</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => { setAmount('100000'); setRate(18); setIsInclusive(false); }}
              title="Reset"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label className="form-label">
                Invoice / Transaction Amount (₹)
              </label>
              <div className="input-affix-wrapper">
                <span className="input-prefix" style={{ fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  className="form-control has-prefix mono"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount..."
                  min="0"
                  step="any"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Calculation Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${!isInclusive ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsInclusive(false)}
                >
                  GST Exclusive (Add GST)
                </button>
                <button
                  type="button"
                  className={`btn ${isInclusive ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsInclusive(true)}
                >
                  GST Inclusive (Extract GST)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Standard GST Slab Rate</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[0, 5, 12, 18, 28].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`btn ${rate === r ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setRate(r)}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Supply Jurisdiction</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label className="form-check">
                  <input
                    type="radio"
                    name="supply"
                    checked={supplyType === 'intra'}
                    onChange={() => setSupplyType('intra')}
                  />
                  <span className="form-check-label">
                    Intra-State (CGST {rate / 2}% + SGST {rate / 2}%)
                  </span>
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    name="supply"
                    checked={supplyType === 'inter'}
                    onChange={() => setSupplyType('inter')}
                  />
                  <span className="form-check-label">
                    Inter-State (IGST {rate}%)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="calc-result-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Tax Breakdown Result</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {isInclusive ? 'Inclusive Extraction' : 'Exclusive Addition'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div className="calc-row">
              <span>Base Taxable Value:</span>
              <span className="mono" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                ₹{baseAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            {supplyType === 'intra' ? (
              <>
                <div className="calc-row">
                  <span>Central GST (CGST @ {rate / 2}%):</span>
                  <span className="mono" style={{ fontWeight: 600 }}>
                    ₹{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="calc-row">
                  <span>State GST (SGST @ {rate / 2}%):</span>
                  <span className="mono" style={{ fontWeight: 600 }}>
                    ₹{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            ) : (
              <div className="calc-row">
                <span>Integrated GST (IGST @ {rate}%):</span>
                <span className="mono" style={{ fontWeight: 600 }}>
                  ₹{igst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="calc-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '10px' }}>
              <span>Total Tax Component:</span>
              <span className="mono" style={{ fontWeight: 700, color: '#fde047' }}>
                ₹{totalTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="calc-row highlight">
              <span>Invoice Grand Total:</span>
              <span className="mono">
                ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: '#cbd5e1',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            <strong>Compliance Note:</strong> Intra-state supplies within the same state require equal distribution between Central and State GST accounts. Inter-state sales across state borders are booked entirely to Integrated GST.
          </div>
        </div>
      </div>
    </div>
  );
}
