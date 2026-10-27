/**
 * Utility functions to trigger real file downloads (CSV, JSON, HTML printable receipts, Certificates)
 */

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

export function downloadCsv(filename, headers, rows) {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCsv).join(',');
  const rowLines = rows.map(row => row.map(escapeCsv).join(','));
  const csvContent = [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function downloadJson(filename, data) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

export function printOrDownloadHtml(title, htmlBody, autoPrint = false) {
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 24px; padding: 0; background: #fff; }
    .doc-container { max-width: 800px; margin: 0 auto; border: 2px solid #0b2246; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header-bar { border-bottom: 2px solid #0b2246; padding-bottom: 16px; margin-bottom: 20px; text-align: center; }
    .header-title { font-size: 22px; font-weight: bold; color: #0b2246; margin: 0; text-transform: uppercase; }
    .header-sub { font-size: 13px; color: #475569; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background-color: #0b2246; color: #ffffff; font-weight: 600; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total-row { font-weight: bold; background-color: #f1f5f9; }
    .badge-success { background: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .footer-note { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 12px; text-align: center; }
    @media print {
      body { margin: 0; }
      .doc-container { border: none; box-shadow: none; padding: 0; width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 16px; text-align: right;">
    <button onclick="window.print()" style="background: #0b2246; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <div class="doc-container">
    ${htmlBody}
    <div class="footer-note">
      This is a digitally generated statutory record produced by the Goods and Services Tax Portal for taxpayer compliance & training.
    </div>
  </div>
  ${autoPrint ? '<script>window.onload = function() { window.print(); };</script>' : ''}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  
  if (autoPrint) {
    const printWindow = window.open(URL.createObjectURL(blob), '_blank');
    if (printWindow) {
      printWindow.focus();
      return;
    }
  }

  triggerDownload(blob, `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`);
}

/**
 * Download Official Form GST REG-06 Registration Certificate
 */
export function downloadRegistrationCertificate(user) {
  const gstin = user.gstin || '27AABCS1429B1Z8';
  const name = user.businessName || 'Samyak Infotech Solutions Pvt Ltd';
  const trade = user.tradeName || 'Samyak Tech Enterprises';
  const address = user.address || 'Unit 402, Samyak IT Park, Andheri East, Mumbai, Maharashtra - 400069';

  const html = `
    <div class="header-bar">
      <div style="font-size: 14px; font-weight: bold; color: #0b2246;">GOVERNMENT OF INDIA</div>
      <div style="font-size: 13px; color: #334155;">DEPARTMENT OF REVENUE / GOODS AND SERVICES TAX</div>
      <h1 class="header-title" style="margin-top: 10px;">Form GST REG-06</h1>
      <div class="header-sub">Registration Certificate under Section 25 of the Central Goods and Services Tax Act, 2017</div>
    </div>

    <table>
      <tr>
        <th colspan="2">1. Registration Details</th>
      </tr>
      <tr>
        <td style="width: 35%; font-weight: 600;">Registration Number (GSTIN)</td>
        <td style="font-family: monospace; font-size: 15px; font-weight: bold; color: #0b2246;">${gstin}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Legal Name of Business</td>
        <td><strong>${name}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Trade Name</td>
        <td>${trade}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Constitution of Business</td>
        <td>${user.businessType || 'Private Limited Company'}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Address of Principal Place of Business</td>
        <td>${address}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Date of Liability</td>
        <td>01-Jul-2017</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Period of Validity</td>
        <td>From ${user.registrationDate || '12-Jul-2017'} to <strong>Regular (Perpetual)</strong></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Type of Registration</td>
        <td>Regular Taxpayer</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Jurisdictional Office</td>
        <td>Ward / Circle 3, State Tax Office, Maharashtra</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Digital Signature Verification</td>
        <td><span class="badge-success">Digitally Signed & Verified (DSC-Valid)</span></td>
      </tr>
    </table>

    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 12px; color: #64748b;">Place: Mumbai</div>
        <div style="font-size: 12px; color: #64748b;">Date of Issue: ${user.registrationDate || '12-Jul-2017'}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; font-weight: bold; color: #0b2246;">Designated Officer</div>
        <div style="font-size: 11px; color: #475569;">Central & State Tax Authority</div>
      </div>
    </div>
  `;

  printOrDownloadHtml(`GST_Registration_Certificate_${gstin}`, html);
}

/**
 * Download GSTR-3B / GSTR-1 Acknowledgment Receipt
 */
export function downloadReturnAcknowledgment(returnItem, user) {
  const arn = returnItem.arn || 'AA2701250119284';
  const type = returnItem.returnType || 'GSTR-3B';
  const period = returnItem.taxPeriod || 'January 2025';
  const filingDate = returnItem.filingDate || '19-Feb-2025';
  const totalTax = (returnItem.totalTax || 1146000).toLocaleString('en-IN');

  const html = `
    <div class="header-bar">
      <div style="font-size: 14px; font-weight: bold; color: #0b2246;">GOODS AND SERVICES TAX PORTAL</div>
      <h1 class="header-title" style="margin-top: 6px;">Acknowledgment for Filing of Return (${type})</h1>
      <div class="header-sub">Form ${type} under Section 39 of the Central Goods and Services Tax Act, 2017</div>
    </div>

    <table>
      <tr>
        <th colspan="2">Filing Details</th>
      </tr>
      <tr>
        <td style="width: 40%; font-weight: 600;">Application Reference Number (ARN)</td>
        <td style="font-family: monospace; font-size: 15px; font-weight: bold; color: #0b2246;">${arn}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">GSTIN of Taxpayer</td>
        <td><strong>${user.gstin || '27AABCS1429B1Z8'}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Legal / Trade Name</td>
        <td>${user.businessName || 'Samyak Infotech Solutions Pvt Ltd'}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Tax Period</td>
        <td><strong>${period}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Date of Filing</td>
        <td>${filingDate}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Filing Status</td>
        <td><span class="badge-success">FILED &amp; ACKNOWLEDGED</span></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Mode of Verification</td>
        <td>Electronic Verification Code (EVC) / DSC</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Total Tax Discharged</td>
        <td><strong>₹ ${totalTax}</strong></td>
      </tr>
    </table>
  `;

  printOrDownloadHtml(`Return_Acknowledgment_${type}_${arn}`, html);
}

/**
 * Download PMT-06 Challan Realization Receipt
 */
export function downloadChallanReceipt(challan, user) {
  const cpin = challan.cpin || '25022700142984';
  const cin = challan.cin || 'SBIN25022700142984';
  const total = (challan.totalAmount || 936000).toLocaleString('en-IN');

  const html = `
    <div class="header-bar">
      <div style="font-size: 14px; font-weight: bold; color: #0b2246;">GOODS AND SERVICES TAX PORTAL</div>
      <h1 class="header-title" style="margin-top: 6px;">Form GST PMT-06: Challan Payment Receipt</h1>
      <div class="header-sub">Challan for Payment of Goods and Services Tax</div>
    </div>

    <table>
      <tr>
        <th colspan="2">Payment Realization Information</th>
      </tr>
      <tr>
        <td style="width: 40%; font-weight: 600;">CPIN (Common Portal Identification Number)</td>
        <td style="font-family: monospace; font-size: 15px; font-weight: bold;">${cpin}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">CIN (Challan Identification Number)</td>
        <td style="font-family: monospace; font-size: 15px; font-weight: bold; color: #0b2246;">${cin}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">GSTIN of Taxpayer</td>
        <td><strong>${user.gstin || '27AABCS1429B1Z8'}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Taxpayer Name</td>
        <td>${user.businessName || 'Samyak Infotech Solutions Pvt Ltd'}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Bank &amp; Payment Mode</td>
        <td>${challan.bank || 'State Bank of India'} (${challan.paymentMode || 'Net Banking / NEFT'})</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Date of Realization</td>
        <td>${challan.paidDate || challan.createdDate || '18-Feb-2025'}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Total Amount Credited to Cash Ledger</td>
        <td style="font-size: 16px; font-weight: bold; color: #15803d;">₹ ${total}</td>
      </tr>
      <tr>
        <td style="font-weight: 600;">Status</td>
        <td><span class="badge-success">PAID &amp; CREDITED TO CASH LEDGER</span></td>
      </tr>
    </table>
  `;

  printOrDownloadHtml(`Payment_Receipt_PMT06_${cpin}`, html);
}

/**
 * Download or Print Formal GST Tax Invoice
 */
export function downloadTaxInvoice(invoice, user, autoPrint = false) {
  const invNo = invoice.invoiceNumber || 'INV/24-25/0842';
  const customer = invoice.customerName || 'Tata Consultancy & Infra Works Ltd';
  const customerGstin = invoice.customerGstin || '27AABCT2394K1Z9';
  const date = invoice.date || '14-Feb-2025';
  const items = invoice.items || [
    { name: 'Enterprise Cloud ERP Consulting', hsn: '998314', qty: 1, rate: 350000, taxRate: 18 }
  ];

  let rowsHtml = '';
  let subtotal = 0;
  let totalCgst = invoice.cgst || 0;
  let totalSgst = invoice.sgst || 0;
  let totalIgst = invoice.igst || 0;

  items.forEach((it, idx) => {
    const itemTotal = (it.qty || 1) * (it.rate || 0);
    subtotal += itemTotal;
    rowsHtml += `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td>${it.name}</td>
        <td class="text-center">${it.hsn || '998314'}</td>
        <td class="text-center">${it.qty}</td>
        <td class="text-right">₹ ${(it.rate || 0).toLocaleString('en-IN')}</td>
        <td class="text-center">${it.taxRate || 18}%</td>
        <td class="text-right">₹ ${itemTotal.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  const grandTotal = invoice.totalAmount || (subtotal + totalCgst + totalSgst + totalIgst);

  const html = `
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0b2246; padding-bottom: 12px;">
      <div>
        <h1 style="margin: 0; font-size: 20px; color: #0b2246; text-transform: uppercase;">TAX INVOICE</h1>
        <div style="font-size: 12px; color: #64748b;">(Issued under Rule 46 of CGST Rules, 2017)</div>
        <div style="margin-top: 10px; font-weight: bold; font-size: 15px; color: #0b2246;">${user.businessName || 'Samyak Infotech Solutions Pvt Ltd'}</div>
        <div style="font-size: 12px; color: #334155;">${user.address || 'Unit 402, Samyak IT Park, Andheri East, Mumbai, Maharashtra - 400069'}</div>
        <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">GSTIN: ${user.gstin || '27AABCS1429B1Z8'}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 16px; font-weight: bold; color: #0b2246;">${invNo}</div>
        <div style="font-size: 12px; color: #475569; margin-top: 2px;">Invoice Date: ${date}</div>
        <div style="margin-top: 6px;"><span class="badge-success">STATUS: ${invoice.status || 'PAID'}</span></div>
      </div>
    </div>

    <div style="margin-top: 16px; border: 1px solid #cbd5e1; padding: 10px; border-radius: 4px; background: #f8fafc;">
      <div style="font-weight: bold; font-size: 13px; color: #0b2246;">Billed To (Recipient):</div>
      <div style="font-weight: bold; font-size: 14px; margin-top: 2px;">${customer}</div>
      <div style="font-size: 12px; color: #475569;">${invoice.billingAddress || 'Nariman Point, Marine Drive, Mumbai 400021'}</div>
      <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">Recipient GSTIN: ${customerGstin}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th>Item / Service Description</th>
          <th style="width: 12%;">HSN/SAC</th>
          <th style="width: 8%;">Qty</th>
          <th style="width: 15%;" class="text-right">Unit Rate</th>
          <th style="width: 10%;" class="text-center">GST %</th>
          <th style="width: 18%;" class="text-right">Taxable Value</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="total-row">
          <td colspan="6" class="text-right">Total Taxable Value:</td>
          <td class="text-right">₹ ${subtotal.toLocaleString('en-IN')}</td>
        </tr>
        ${totalCgst > 0 ? `
          <tr>
            <td colspan="6" class="text-right">CGST:</td>
            <td class="text-right">₹ ${totalCgst.toLocaleString('en-IN')}</td>
          </tr>
        ` : ''}
        ${totalSgst > 0 ? `
          <tr>
            <td colspan="6" class="text-right">SGST:</td>
            <td class="text-right">₹ ${totalSgst.toLocaleString('en-IN')}</td>
          </tr>
        ` : ''}
        ${totalIgst > 0 ? `
          <tr>
            <td colspan="6" class="text-right">IGST:</td>
            <td class="text-right">₹ ${totalIgst.toLocaleString('en-IN')}</td>
          </tr>
        ` : ''}
        <tr class="total-row" style="font-size: 15px; color: #0b2246;">
          <td colspan="6" class="text-right">GRAND TOTAL (INCL. TAXES):</td>
          <td class="text-right">₹ ${grandTotal.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="font-size: 12px; color: #64748b;">
        Electronic Reference: ${invoice.id || 'INV-2024-001'}<br>
        Place of Supply: Maharashtra (27)
      </div>
      <div style="text-align: right; border-top: 1px solid #0b2246; padding-top: 4px; width: 220px;">
        <div style="font-size: 12px; font-weight: bold; color: #0b2246;">For ${user.businessName || 'Samyak Infotech Solutions Pvt Ltd'}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 20px;">Authorized Signatory / Digital Signature</div>
      </div>
    </div>
  `;

  printOrDownloadHtml(`Tax_Invoice_${invNo}`, html, autoPrint);
}
