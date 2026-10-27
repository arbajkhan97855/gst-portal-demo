import React from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  downloadRegistrationCertificate,
  downloadReturnAcknowledgment,
  downloadChallanReceipt,
  downloadCsv,
  downloadJson
} from '../../utils/downloadHelpers';

export default function Downloads() {
  const { toast } = useNotification();
  const { currentUser } = useAuth();

  const handleDownload = (code, title) => {
    try {
      if (code === 'REG-06') {
        downloadRegistrationCertificate(currentUser);
      } else if (code === 'ARN-GSTR3B') {
        downloadReturnAcknowledgment(
          {
            returnType: 'GSTR-3B',
            arn: 'AA2701250119284',
            taxPeriod: 'January 2025',
            filingDate: '19-Feb-2025',
            totalTax: 1146000
          },
          currentUser
        );
      } else if (code === 'PMT-06') {
        downloadChallanReceipt(
          {
            cpin: '25022700142984',
            cin: 'SBIN25022700142984',
            totalAmount: 936000,
            bank: 'State Bank of India',
            paymentMode: 'Net Banking (NEFT/RTGS)',
            paidDate: '18-Feb-2025'
          },
          currentUser
        );
      } else if (code === 'INV-TMPL') {
        downloadCsv(
          'GST_Tax_Invoice_Sample_Template.csv',
          ['Item Description', 'HSN/SAC', 'Quantity', 'Unit Rate (INR)', 'GST Rate (%)', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Total'],
          [
            ['Enterprise Cloud ERP Consulting', '998314', 1, 350000, 18, 350000, 31500, 31500, 0, 413000],
            ['IT Infrastructure Management Support', '998313', 2, 75000, 18, 150000, 13500, 13500, 0, 177000],
            ['Accounting & Tax Advisory Retainer', '998231', 1, 45000, 18, 45000, 4050, 4050, 0, 53100]
          ]
        );
      } else if (code === 'GSTR-1-SUMM') {
        downloadReturnAcknowledgment(
          {
            returnType: 'GSTR-1',
            arn: 'AA2701250084729',
            taxPeriod: 'January 2025',
            filingDate: '11-Feb-2025',
            totalTax: 856000
          },
          currentUser
        );
      } else if (code === 'RFD-01') {
        downloadJson('Form_GST_RFD_01_Refund_Application.json', {
          form: 'GST RFD-01',
          arn: 'RFD2702250014298',
          taxpayerName: currentUser.businessName,
          gstin: currentUser.gstin,
          refundClaimAmount: 145000,
          period: 'Q3 (Oct-Dec 2024)',
          category: 'Refund of unutilized ITC on account of exports without payment of tax',
          status: 'Sanctioned / Credited to Bank Account',
          disbursedDate: '15-Jan-2025'
        });
      }

      toast.success('Download Completed', `${title} file generated and saved to your device.`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Download Failed', 'Could not generate download file.');
    }
  };

  const docs = [
    {
      title: 'GST Registration Certificate (Form GST REG-06)',
      code: 'REG-06',
      size: '240 KB',
      format: 'HTML / PDF',
      desc: 'Official certificate of registration containing taxpayer legal name, principal place of business, and QR code verification.'
    },
    {
      title: 'GSTR-3B Summary Return Acknowledgment',
      code: 'ARN-GSTR3B',
      size: '185 KB',
      format: 'HTML / PDF',
      desc: 'Filing acknowledgment receipt with system ARN, tax liability paid details, and digital signature hash.'
    },
    {
      title: 'Electronic Cash Challan Receipt (Form PMT-06)',
      code: 'PMT-06',
      size: '120 KB',
      format: 'HTML / PDF',
      desc: 'Bank payment realization receipt with CPIN, CIN, bank branch identifier, and cash ledger credit date.'
    },
    {
      title: 'Standard GST Tax Invoice Format (Rule 46)',
      code: 'INV-TMPL',
      size: '15 KB',
      format: 'CSV / Excel',
      desc: 'Print-ready Excel and CSV spreadsheet formatted for B2B sales with auto-calculating CGST, SGST, and IGST.'
    },
    {
      title: 'GSTR-1 Outward Supplies Summary Form',
      code: 'GSTR-1-SUMM',
      size: '220 KB',
      format: 'HTML / PDF',
      desc: 'Consolidated report of Table 4 (B2B), Table 5 (B2CL), Table 7 (B2CS), and Table 12 (HSN summary).'
    },
    {
      title: 'Application for Refund Document (Form GST RFD-01)',
      code: 'RFD-01',
      size: '18 KB',
      format: 'JSON Schema',
      desc: 'Statutory refund application data schema with statement of invoices and export zero-rated turnover.'
    }
  ];

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Download Center' }]} />
      <PageHeader
        title="Download Center & Statutory Forms"
        subtitle="Download sample certificates, returns acknowledgments, official challans, and standard compliance spreadsheets."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {docs.map((doc, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div className="card-title" style={{ fontSize: '1rem' }}>
                <FileText size={18} className="text-primary" />
                <span>{doc.code}</span>
              </div>
              <span className="badge badge-primary">{doc.format}</span>
            </div>
            <div className="card-body" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                {doc.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {doc.desc}
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Format: <strong>{doc.format}</strong>
              </span>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleDownload(doc.code, doc.title)}
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
