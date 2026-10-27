import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { getReturnDueDates } from './ReturnsOverview';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCw,
  ArrowLeft,
  Trash2,
  Calendar,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Info,
  X,
  HelpCircle,
  Plus
} from 'lucide-react';

export default function GSTR1Filing() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { fileReturnRecord } = usePortalData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fy = searchParams.get('fy') || '2026-27';
  const taxPeriod = searchParams.get('period') || 'October';
  const { gstr1DueDate } = getReturnDueDates(taxPeriod, fy);

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  // Navigation Screens:
  // 'main' (Tiles)
  // 'b2b-summary' | 'b2b-add'
  // 'b2cl-summary' | 'b2cl-add'
  // 'exp-summary' (Image 1) | 'exp-add' (Image 2, 3, 4)
  const [screen, setScreen] = useState('main');

  const [returnStatus, setReturnStatus] = useState('Not Filed');
  const [arnNumber, setArnNumber] = useState(null);
  const [isNilFiling, setIsNilFiling] = useState(false);

  // Accordion states
  const [addDetailsOpen, setAddDetailsOpen] = useState(true);
  const [amendDetailsOpen, setAmendDetailsOpen] = useState(true);

  // Invoices Data starts COMPLETELY EMPTY as requested
  const [b2bInvoices, setB2bInvoices] = useState([]);
  const [b2clInvoices, setB2clInvoices] = useState([]);
  const [exportsInvoices, setExportsInvoices] = useState([]);
  const [b2csInvoices, setB2csInvoices] = useState([]);
  const [cdnrInvoices, setCdnrInvoices] = useState([]);
  const [cdnurInvoices, setCdnurInvoices] = useState([]);
  const [atInvoices, setAtInvoices] = useState([]); // 11A(1), 11A(2) - Tax Liability (Advances Received)
  const [adjAdvInvoices, setAdjAdvInvoices] = useState([]); // 11B(1), 11B(2) - Adjustment of Advances

  // 12. HSN-wise summary
  const [hsnTab, setHsnTab] = useState('b2b'); // 'b2b' | 'b2c'
  const [hsnB2bRecords, setHsnB2bRecords] = useState([]);
  const [hsnB2cRecords, setHsnB2cRecords] = useState([]);

  // 13. Documents Issued
  const initialDocCategories = [
    { id: 1, name: '1. Invoices for outward supply', docs: [] },
    { id: 2, name: '2. Invoices for inward supply from unregistered person', docs: [] },
    { id: 3, name: '3. Revised Invoice', docs: [] },
    { id: 4, name: '4. Debit Note', docs: [] },
    { id: 5, name: '5. Credit Note', docs: [] },
    { id: 6, name: '6. Receipt voucher', docs: [] },
    { id: 7, name: '7. Payment Voucher', docs: [] },
    { id: 8, name: '8. Refund voucher', docs: [] },
    { id: 9, name: '9. Delivery Challan for job work', docs: [] },
    { id: 10, name: '10. Delivery Challan for supply on approval', docs: [] },
    { id: 11, name: '11. Delivery Challan in case of liquid gas', docs: [] },
    { id: 12, name: '12. Delivery Challan in cases other than by way of supply (excluding at S no. 9 to 11)', docs: [] }
  ];
  const [docCategories, setDocCategories] = useState(initialDocCategories);

  // 14. Supplies made through ECO
  const [ecoTab, setEcoTab] = useState('u52'); // 'u52' | 'u95'
  const [ecoRecordsU52, setEcoRecordsU52] = useState([]);
  const [ecoRecordsU95, setEcoRecordsU95] = useState([]);

  // 15. Supplies U/s 9(5)
  const [sup15Tab, setSup15Tab] = useState('r2r'); // 'r2r' | 'r2u' | 'u2r' | 'u2u'
  const [sup15R2R, setSup15R2R] = useState([]);
  const [sup15R2U, setSup15R2U] = useState([]);
  const [sup15U2R, setSup15U2R] = useState([]);
  const [sup15U2U, setSup15U2U] = useState([]);

  // ==============================================================
  // AMEND RECORD DETAILS STATES (9A, 9C, 10, 11A, 11B, 14A, 15A)
  // ==============================================================
  const [amendB2bRecords, setAmendB2bRecords] = useState([]);
  const [amendB2clRecords, setAmendB2clRecords] = useState([]);
  const [amendExpRecords, setAmendExpRecords] = useState([]);
  const [amendCdnrRecords, setAmendCdnrRecords] = useState([]);
  const [amendCdnurRecords, setAmendCdnurRecords] = useState([]);
  const [amendB2csRecords, setAmendB2csRecords] = useState([]);
  const [amendAtRecords, setAmendAtRecords] = useState([]);
  const [amendAdjRecords, setAmendAdjRecords] = useState([]);
  const [amendEcoRecords, setAmendEcoRecords] = useState([]);
  const [amendSup15Records, setAmendSup15Records] = useState([]);

  // Amend Search & Active Form States
  const [amendSearchB2b, setAmendSearchB2b] = useState({ fy: '2026-27', invoiceNo: '' });
  const [activeAmendB2b, setActiveAmendB2b] = useState(null);

  const [amendSearchB2cl, setAmendSearchB2cl] = useState({ fy: '2026-27', invoiceNo: '' });
  const [activeAmendB2cl, setActiveAmendB2cl] = useState(null);

  const [amendSearchExp, setAmendSearchExp] = useState({ fy: '2025-26', invoiceNo: '' });
  const [activeAmendExp, setActiveAmendExp] = useState(null);

  const [amendSearchCdnr, setAmendSearchCdnr] = useState({ fy: '2026-27', noteNo: '' });
  const [activeAmendCdnr, setActiveAmendCdnr] = useState(null);

  const [amendSearchCdnur, setAmendSearchCdnur] = useState({ fy: '2026-27', noteNo: '' });
  const [activeAmendCdnur, setActiveAmendCdnur] = useState(null);

  const [amendSearchB2cs, setAmendSearchB2cs] = useState({ year: '2026-27', month: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
  const [activeAmendB2cs, setActiveAmendB2cs] = useState(null);

  const [amendSearchAt, setAmendSearchAt] = useState({ fy: '2026-27', period: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
  const [activeAmendAt, setActiveAmendAt] = useState(null);

  const [amendSearchAdj, setAmendSearchAdj] = useState({ fy: '2026-27', period: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
  const [activeAmendAdj, setActiveAmendAdj] = useState(null);

  const [amendEcoTab, setAmendEcoTab] = useState('u52');
  const [amendSearchEco, setAmendSearchEco] = useState({ fy: '2026-27', period: 'September', ecoGstin: '' });
  const [activeAmendEco, setActiveAmendEco] = useState(null);

  const [amendSup15Tab, setAmendSup15Tab] = useState('r2r');
  const [amendSearchSup15, setAmendSearchSup15] = useState({ fy: '2026-27', docNo: '' });
  const [activeAmendSup15, setActiveAmendSup15] = useState(null);

  // Common tax rates definition
  const ratesList = [
    { label: '0%', rate: 0 },
    { label: '0.1%', rate: 0.1 },
    { label: '0.25%', rate: 0.25 },
    { label: '1%', rate: 1 },
    { label: '1.5%', rate: 1.5 },
    { label: '3%', rate: 3 },
    { label: '5%', rate: 5 },
    { label: '6%', rate: 6 },
    { label: '7.5%', rate: 7.5 },
    { label: '12%', rate: 12 },
    { label: '18%', rate: 18 },
    { label: '28%', rate: 28 },
    { label: '40%', rate: 40 }
  ];

  const buildInitialRates = () => {
    const res = {};
    ratesList.forEach((r) => {
      res[r.label] = { taxable: '', igst: 0, cess: '' };
    });
    return res;
  };

  // ==============================================================
  // 1. FORM STATE FOR B2B INVOICES
  // ==============================================================
  const [addForm, setAddForm] = useState({
    deemedExports: false,
    sezWithPayment: false,
    sezWithoutPayment: false,
    reverseCharge: false,
    intraStateIgst: false,
    diffPercentage: false,
    recipientGstin: '',
    recipientName: '',
    nameAsInMaster: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalInvoiceValue: '',
    pos: '08-Rajasthan',
    supplyType: 'Intra-State',
    source: 'Manual',
    irn: '',
    irnDate: '',
    rate: '18',
    taxableValue: ''
  });

  // ==============================================================
  // 2. FORM STATE FOR B2C (LARGE) INVOICES
  // ==============================================================
  const [b2clForm, setB2clForm] = useState({
    diffPercentage: false,
    pos: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    supplyType: 'Inter-State',
    totalInvoiceValue: '',
    ratesData: buildInitialRates()
  });

  // ==============================================================
  // 3. FORM STATE FOR 6A - EXPORTS INVOICES (Image 2, 3, 4)
  // ==============================================================
  const [exportForm, setExportForm] = useState({
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    portCode: '',
    shippingBillNo: '',
    shippingBillDate: '',
    totalInvoiceValue: '',
    supplyType: 'Inter-State',
    gstPayment: 'With Payment of Tax',
    source: 'Manual',
    irn: '',
    irnDate: '',
    ratesData: buildInitialRates()
  });

  // ==============================================================
  // 4. FORM STATE FOR 7 - B2C (OTHERS) (B2CS)
  // ==============================================================
  const [b2csForm, setB2csForm] = useState({
    diffPercentage: false,
    applicableRatePercent: '65',
    pos: '08-Rajasthan',
    supplyType: 'Intra-State',
    taxableValue: '',
    rate: '18',
    cess: '',
    type: 'OE',
    ecoGstin: ''
  });

  // ==============================================================
  // 5. STATE FOR 8A, 8B, 8C, 8D - NIL RATED SUPPLIES (Direct Screen)
  // ==============================================================
  const initialNilRated = {
    interRegNil: '',
    interRegExempt: '',
    interRegNonGst: '',
    intraRegNil: '',
    intraRegExempt: '',
    intraRegNonGst: '',
    interUnregNil: '',
    interUnregExempt: '',
    interUnregNonGst: '',
    intraUnregNil: '',
    intraUnregExempt: '',
    intraUnregNonGst: '',
    isSaved: false
  };
  const [nilRatedData, setNilRatedData] = useState(initialNilRated);

  // ==============================================================
  // 6. FORM STATE FOR 9B - CREDIT / DEBIT NOTES (REGISTERED) (CDNR)
  // ==============================================================
  const initialCdnrForm = {
    diffPercentage: false,
    applicableRatePercent: '65',
    recipientGstin: '',
    recipientName: '',
    pos: '08-Rajasthan',
    noteType: 'C', // 'C' (Credit Note), 'D' (Debit Note), 'R' (Refund Voucher)
    noteNum: '',
    noteDate: new Date().toISOString().split('T')[0],
    origInvoiceNum: '',
    origInvoiceDate: '',
    noteValue: '',
    supplyType: 'Intra-State',
    reverseCharge: 'N',
    rate: '18',
    taxableValue: '',
    cess: ''
  };
  const [cdnrForm, setCdnrForm] = useState(initialCdnrForm);

  // ==============================================================
  // 7. FORM STATE FOR 9B - CREDIT / DEBIT NOTES (UNREGISTERED) (CDNUR)
  // ==============================================================
  const initialCdnurForm = {
    diffPercentage: false,
    applicableRatePercent: '65',
    type: 'B2CL', // 'B2CL' (B2C Large), 'EXPWP' (Exports with payment), 'EXPWOP' (Exports without payment)
    noteNum: '',
    noteDate: '',
    noteType: '', // '' (Select), 'C' (Credit), 'D' (Debit), 'R' (Refund)
    noteValue: '0.00',
    pos: '',
    supplyType: 'Inter-State',
    source: '',
    irn: '',
    irnDate: '',
    ratesData: buildInitialRates()
  };
  const [cdnurForm, setCdnurForm] = useState(initialCdnurForm);

  // ==============================================================
  // 8. FORM STATE FOR 11A(1), 11A(2) - TAX LIABILITY (ADVANCES RECEIVED)
  // ==============================================================
  const buildInitialAtRates = () => {
    const res = {};
    ratesList.forEach((r) => {
      res[r.label] = { grossAdvance: '', igst: 0, cgst: 0, sgst: 0, cess: '' };
    });
    return res;
  };

  const initialAtForm = {
    pos: '',
    supplyType: '',
    diffPercentage: false,
    applicableRatePercent: '65',
    ratesData: buildInitialAtRates()
  };
  const [atForm, setAtForm] = useState(initialAtForm);

  // ==============================================================
  // 9. FORM STATE FOR 11B(1), 11B(2) - ADJUSTMENT OF ADVANCES
  // ==============================================================
  const buildInitialAdjRates = () => {
    const res = {};
    ratesList.forEach((r) => {
      res[r.label] = { grossAdjusted: '', igst: 0, cgst: 0, sgst: 0, cess: '' };
    });
    return res;
  };

  const initialAdjForm = {
    pos: '',
    supplyType: '',
    diffPercentage: false,
    applicableRatePercent: '65',
    ratesData: buildInitialAdjRates()
  };
  const [adjForm, setAdjForm] = useState(initialAdjForm);

  // 12. HSN Form
  const initialHsnForm = {
    hsn: '',
    description: '',
    productNameMaster: '',
    descAsPerHsn: '',
    uqc: '',
    totalQuantity: '',
    taxableValue: '',
    rate: '',
    igst: '',
    cgst: '',
    sgst: '',
    cess: ''
  };
  const [hsnForm, setHsnForm] = useState(initialHsnForm);

  // 14. ECO Form
  const initialEcoForm = {
    ecoGstin: '',
    tradeName: '',
    netValue: '',
    igst: '',
    cgst: '',
    sgst: '',
    cess: ''
  };
  const [ecoForm, setEcoForm] = useState(initialEcoForm);

  // 15. Supplies U/s 9(5) Form
  const initialSup15Form = {
    ecoGstin: '',
    tradeName: '',
    supplierGstin: '',
    recipientGstin: '',
    netValue: '',
    igst: '',
    cgst: '',
    sgst: '',
    cess: ''
  };
  const [sup15Form, setSup15Form] = useState(initialSup15Form);

  // Modals
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ==============================================================
  // B2B HANDLERS
  // ==============================================================
  const handleGstinChange = (e) => {
    const val = e.target.value.toUpperCase();
    let name = addForm.recipientName;
    if (val.length === 15) {
      if (val.startsWith('08')) {
        name = 'SURAJ TRADERS & DISTRIBUTORS';
      } else if (val.startsWith('27')) {
        name = 'MAHARASHTRA LOGISTICS PVT LTD';
      } else if (val.startsWith('07')) {
        name = 'CAPITAL TEXTILES DELHI';
      } else {
        name = 'REGISTERED DEALER';
      }
    }
    setAddForm({
      ...addForm,
      recipientGstin: val,
      recipientName: name,
      nameAsInMaster: name
    });
  };

  const handlePosChange = (e) => {
    const selectedPos = e.target.value;
    const isIntra = selectedPos.startsWith('08');
    setAddForm({
      ...addForm,
      pos: selectedPos,
      supplyType: isIntra ? 'Intra-State' : 'Inter-State'
    });
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!addForm.recipientGstin || !addForm.invoiceNo || !addForm.totalInvoiceValue || !addForm.taxableValue) {
      toast.error('Validation Error', 'Please fill all mandatory fields (GSTIN, Invoice No, Total Value, Taxable Value).');
      return;
    }

    const taxableVal = parseFloat(addForm.taxableValue) || 0;
    const totalVal = parseFloat(addForm.totalInvoiceValue) || 0;
    const rateNum = parseFloat(addForm.rate) || 18;
    const totalTax = (taxableVal * rateNum) / 100;
    const isInter = addForm.supplyType === 'Inter-State';

    const newInvoice = {
      id: Date.now(),
      recipientGstin: addForm.recipientGstin,
      recipientName: addForm.recipientName || 'REGISTERED BUYER',
      invoiceNo: addForm.invoiceNo,
      invoiceDate: addForm.invoiceDate,
      totalInvoiceValue: totalVal,
      pos: addForm.pos,
      supplyType: addForm.supplyType,
      rate: rateNum,
      taxableValue: taxableVal,
      cgst: isInter ? 0 : totalTax / 2,
      sgst: isInter ? 0 : totalTax / 2,
      igst: isInter ? totalTax : 0,
      totalTax: totalTax
    };

    setB2bInvoices([...b2bInvoices, newInvoice]);
    toast.success('Invoice Saved', `Invoice ${addForm.invoiceNo} has been saved successfully.`);

    setAddForm({
      deemedExports: false,
      sezWithPayment: false,
      sezWithoutPayment: false,
      reverseCharge: false,
      intraStateIgst: false,
      diffPercentage: false,
      recipientGstin: '',
      recipientName: '',
      nameAsInMaster: '',
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      totalInvoiceValue: '',
      pos: '08-Rajasthan',
      supplyType: 'Intra-State',
      source: 'Manual',
      irn: '',
      irnDate: '',
      rate: '18',
      taxableValue: ''
    });

    setScreen('b2b-summary');
  };

  const handleDeleteInvoice = (id) => {
    setB2bInvoices(b2bInvoices.filter((inv) => inv.id !== id));
    toast.info('Deleted', 'Invoice record removed from GSTR-1 draft.');
  };

  // ==============================================================
  // B2C (LARGE) HANDLERS
  // ==============================================================
  const handleB2clRateTaxableChange = (label, numericRate, value) => {
    const taxableNum = parseFloat(value) || 0;
    const computedIgst = (taxableNum * numericRate) / 100;

    setB2clForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          taxable: value,
          igst: computedIgst
        }
      }
    }));
  };

  const handleB2clRateCessChange = (label, value) => {
    setB2clForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          cess: value
        }
      }
    }));
  };

  const handleSaveB2clInvoice = (e) => {
    e.preventDefault();
    if (!b2clForm.pos) {
      toast.error('Validation Error', 'Please select Place of Supply (POS).');
      return;
    }
    if (!b2clForm.invoiceNo) {
      toast.error('Validation Error', 'Please enter Invoice Number.');
      return;
    }
    if (!b2clForm.totalInvoiceValue) {
      toast.error('Validation Error', 'Please enter Total Invoice Value.');
      return;
    }

    let totalTaxable = 0;
    let totalIgst = 0;
    let totalCess = 0;
    const ratesSummary = [];

    Object.keys(b2clForm.ratesData).forEach((lbl) => {
      const item = b2clForm.ratesData[lbl];
      const tVal = parseFloat(item.taxable) || 0;
      const cVal = parseFloat(item.cess) || 0;
      if (tVal > 0) {
        totalTaxable += tVal;
        totalIgst += item.igst;
        totalCess += cVal;
        ratesSummary.push({ rateLabel: lbl, taxable: tVal, igst: item.igst, cess: cVal });
      }
    });

    if (totalTaxable <= 0) {
      toast.error('Validation Error', 'Please enter Taxable value for at least one tax rate in Item details.');
      return;
    }

    const newB2clInvoice = {
      id: Date.now(),
      pos: b2clForm.pos,
      invoiceNo: b2clForm.invoiceNo,
      invoiceDate: b2clForm.invoiceDate,
      supplyType: b2clForm.supplyType,
      totalInvoiceValue: parseFloat(b2clForm.totalInvoiceValue) || 0,
      taxableValue: totalTaxable,
      igst: totalIgst,
      cess: totalCess,
      ratesSummary: ratesSummary
    };

    setB2clInvoices([...b2clInvoices, newB2clInvoice]);
    toast.success('B2CL Invoice Saved', `B2C (Large) invoice ${b2clForm.invoiceNo} saved successfully.`);

    setB2clForm({
      diffPercentage: false,
      pos: '',
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      supplyType: 'Inter-State',
      totalInvoiceValue: '',
      ratesData: buildInitialRates()
    });

    setScreen('b2cl-summary');
  };

  const handleDeleteB2clInvoice = (id) => {
    setB2clInvoices(b2clInvoices.filter((inv) => inv.id !== id));
    toast.info('Deleted', 'B2C (Large) invoice record removed.');
  };

  // ==============================================================
  // 6A - EXPORTS HANDLERS (Image 2, 3, 4)
  // ==============================================================
  const handleExportRateTaxableChange = (label, numericRate, value) => {
    const taxableNum = parseFloat(value) || 0;
    const isWithPayment = exportForm.gstPayment === 'With Payment of Tax';
    const computedIgst = isWithPayment ? (taxableNum * numericRate) / 100 : 0;

    setExportForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          taxable: value,
          igst: computedIgst
        }
      }
    }));
  };

  const handleExportRateCessChange = (label, value) => {
    setExportForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          cess: value
        }
      }
    }));
  };

  const handleExportGstPaymentChange = (val) => {
    const isWithPayment = val === 'With Payment of Tax';
    const updatedRates = {};
    Object.keys(exportForm.ratesData).forEach((lbl) => {
      const item = exportForm.ratesData[lbl];
      const match = ratesList.find((r) => r.label === lbl);
      const numRate = match ? match.rate : 0;
      const tVal = parseFloat(item.taxable) || 0;
      updatedRates[lbl] = {
        ...item,
        igst: isWithPayment ? (tVal * numRate) / 100 : 0
      };
    });

    setExportForm({
      ...exportForm,
      gstPayment: val,
      ratesData: updatedRates
    });
  };

  const handleSaveExportInvoice = (e) => {
    e.preventDefault();
    if (!exportForm.invoiceNo) {
      toast.error('Validation Error', 'Please enter Invoice Number.');
      return;
    }
    if (!exportForm.totalInvoiceValue) {
      toast.error('Validation Error', 'Please enter Total Invoice Value.');
      return;
    }

    let totalTaxable = 0;
    let totalIgst = 0;
    let totalCess = 0;
    const ratesSummary = [];

    Object.keys(exportForm.ratesData).forEach((lbl) => {
      const item = exportForm.ratesData[lbl];
      const tVal = parseFloat(item.taxable) || 0;
      const cVal = parseFloat(item.cess) || 0;
      if (tVal > 0) {
        totalTaxable += tVal;
        totalIgst += item.igst;
        totalCess += cVal;
        ratesSummary.push({ rateLabel: lbl, taxable: tVal, igst: item.igst, cess: cVal });
      }
    });

    if (totalTaxable <= 0) {
      toast.error('Validation Error', 'Please enter Taxable value for at least one rate in Item details.');
      return;
    }

    const newExportInvoice = {
      id: Date.now(),
      invoiceNo: exportForm.invoiceNo,
      invoiceDate: exportForm.invoiceDate,
      portCode: exportForm.portCode,
      shippingBillNo: exportForm.shippingBillNo,
      shippingBillDate: exportForm.shippingBillDate,
      totalInvoiceValue: parseFloat(exportForm.totalInvoiceValue) || 0,
      supplyType: exportForm.supplyType,
      gstPayment: exportForm.gstPayment,
      taxableValue: totalTaxable,
      igst: totalIgst,
      cess: totalCess,
      ratesSummary: ratesSummary
    };

    setExportsInvoices([...exportsInvoices, newExportInvoice]);
    toast.success('Export Invoice Saved', `Export invoice ${exportForm.invoiceNo} saved successfully.`);

    setExportForm({
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      portCode: '',
      shippingBillNo: '',
      shippingBillDate: '',
      totalInvoiceValue: '',
      supplyType: 'Inter-State',
      gstPayment: 'With Payment of Tax',
      source: 'Manual',
      irn: '',
      irnDate: '',
      ratesData: buildInitialRates()
    });

    setScreen('exp-summary');
  };

  const handleDeleteExportInvoice = (id) => {
    setExportsInvoices(exportsInvoices.filter((inv) => inv.id !== id));
    toast.info('Deleted', 'Export invoice record removed.');
  };

  // ==============================================================
  // 4. B2CS (B2C OTHERS) HANDLERS & HELPERS
  // ==============================================================
  const handleB2csPosChange = (posVal) => {
    const isInter = posVal !== '08-Rajasthan';
    setB2csForm((prev) => ({
      ...prev,
      pos: posVal,
      supplyType: isInter ? 'Inter-State' : 'Intra-State'
    }));
  };

  const handleSaveB2csInvoice = (e) => {
    e.preventDefault();
    const tVal = parseFloat(b2csForm.taxableValue);
    if (!tVal || tVal <= 0) {
      toast.error('Validation Error', 'Please enter a valid Taxable Value.');
      return;
    }
    if (!b2csForm.pos) {
      toast.error('Validation Error', 'Please select Place of Supply (POS).');
      return;
    }

    const rVal = parseFloat(b2csForm.rate) || 18;
    const isInter = b2csForm.pos !== '08-Rajasthan';
    const factor = b2csForm.diffPercentage ? (parseFloat(b2csForm.applicableRatePercent) || 65) / 100 : 1;
    const taxCalc = tVal * (rVal / 100) * factor;
    const cessVal = parseFloat(b2csForm.cess) || 0;

    const newRecord = {
      id: Date.now(),
      pos: b2csForm.pos,
      supplyType: isInter ? 'Inter-State' : 'Intra-State',
      taxableValue: tVal,
      rate: rVal,
      diffPercentage: b2csForm.diffPercentage,
      applicableRatePercent: b2csForm.applicableRatePercent,
      igst: isInter ? taxCalc : 0,
      cgst: !isInter ? taxCalc / 2 : 0,
      sgst: !isInter ? taxCalc / 2 : 0,
      cess: cessVal,
      totalTax: taxCalc + cessVal,
      type: b2csForm.type,
      ecoGstin: b2csForm.ecoGstin
    };

    setB2csInvoices((prev) => [...prev, newRecord]);
    toast.success('B2CS Record Saved', `B2C (Others) record for ${b2csForm.pos} saved successfully.`);

    setB2csForm({
      diffPercentage: false,
      applicableRatePercent: '65',
      pos: '08-Rajasthan',
      supplyType: 'Intra-State',
      taxableValue: '',
      rate: '18',
      cess: '',
      type: 'OE',
      ecoGstin: ''
    });

    setScreen('b2cs-summary');
  };

  const handleDeleteB2csInvoice = (id) => {
    setB2csInvoices((prev) => prev.filter((inv) => inv.id !== id));
    toast.info('Deleted', 'B2C (Others) record removed.');
  };

  // ==============================================================
  // 5. HANDLERS FOR 8A, 8B, 8C, 8D - NIL RATED SUPPLIES (Direct Screen)
  // ==============================================================
  const handleNilRatedChange = (field, val) => {
    setNilRatedData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveNilRated = (e) => {
    e.preventDefault();
    setNilRatedData((prev) => ({ ...prev, isSaved: true }));
    toast.success('Nil Rated Supplies Saved', 'Nil Rated, Exempted & Non-GST supplies recorded.');
    setScreen('main');
  };

  const handleResetNilRated = () => {
    setNilRatedData(initialNilRated);
    toast.info('Nil Rated Cleared', 'Nil rated data has been reset.');
  };

  // Nil Rated Totals
  const totalNilSupplies =
    (parseFloat(nilRatedData.interRegNil) || 0) +
    (parseFloat(nilRatedData.intraRegNil) || 0) +
    (parseFloat(nilRatedData.interUnregNil) || 0) +
    (parseFloat(nilRatedData.intraUnregNil) || 0);

  const totalExemptSupplies =
    (parseFloat(nilRatedData.interRegExempt) || 0) +
    (parseFloat(nilRatedData.intraRegExempt) || 0) +
    (parseFloat(nilRatedData.interUnregExempt) || 0) +
    (parseFloat(nilRatedData.intraUnregExempt) || 0);

  const totalNonGstSupplies =
    (parseFloat(nilRatedData.interRegNonGst) || 0) +
    (parseFloat(nilRatedData.intraRegNonGst) || 0) +
    (parseFloat(nilRatedData.interUnregNonGst) || 0) +
    (parseFloat(nilRatedData.intraUnregNonGst) || 0);

  const grandNilRatedTotal = totalNilSupplies + totalExemptSupplies + totalNonGstSupplies;

  // ==============================================================
  // 6. HANDLERS FOR 9B - CREDIT / DEBIT NOTES (REGISTERED) (CDNR)
  // ==============================================================
  const handleCdnrGstinChange = (val) => {
    const uppercaseGstin = val.toUpperCase();
    let name = cdnrForm.recipientName;
    let pos = cdnrForm.pos;
    let supplyType = cdnrForm.supplyType;

    if (uppercaseGstin.startsWith('08')) {
      name = 'SHARMA TRADING & CO.';
      pos = '08-Rajasthan';
      supplyType = 'Intra-State';
    } else if (uppercaseGstin.startsWith('27')) {
      name = 'MAHARASHTRA RETAIL CORP';
      pos = '27-Maharashtra';
      supplyType = 'Inter-State';
    } else if (uppercaseGstin.startsWith('07')) {
      name = 'DELHI WHOLESALE MART';
      pos = '07-Delhi';
      supplyType = 'Inter-State';
    } else if (uppercaseGstin.startsWith('24')) {
      name = 'GUJARAT INDUSTRIAL SUPPLIES';
      pos = '24-Gujarat';
      supplyType = 'Inter-State';
    } else if (uppercaseGstin.startsWith('29')) {
      name = 'BANGALORE TECH SOLUTIONS';
      pos = '29-Karnataka';
      supplyType = 'Inter-State';
    } else if (uppercaseGstin.length >= 2) {
      const stateCode = uppercaseGstin.slice(0, 2);
      if (stateCode === '08') {
        pos = '08-Rajasthan';
        supplyType = 'Intra-State';
      } else {
        supplyType = 'Inter-State';
      }
    }

    setCdnrForm((prev) => ({
      ...prev,
      recipientGstin: uppercaseGstin,
      recipientName: name,
      pos,
      supplyType
    }));
  };

  const handleCdnrPosChange = (pos) => {
    const isInter = !pos.startsWith('08');
    setCdnrForm((prev) => ({
      ...prev,
      pos,
      supplyType: isInter ? 'Inter-State' : 'Intra-State'
    }));
  };

  const handleSaveCdnrInvoice = (e) => {
    e.preventDefault();
    if (!cdnrForm.recipientGstin || !cdnrForm.noteNum || !cdnrForm.taxableValue) {
      toast.error('Required Fields Missing', 'Please enter Recipient GSTIN, Note No., and Taxable Value.');
      return;
    }

    const tVal = parseFloat(cdnrForm.taxableValue) || 0;
    const rVal = parseFloat(cdnrForm.rate) || 18;
    const mult = cdnrForm.diffPercentage ? (parseFloat(cdnrForm.applicableRatePercent) / 100 || 0.65) : 1;
    const taxCalc = (tVal * rVal * mult) / 100;
    const isInter = cdnrForm.supplyType === 'Inter-State';
    const cessVal = parseFloat(cdnrForm.cess) || 0;
    const nVal = parseFloat(cdnrForm.noteValue) || (tVal + taxCalc + cessVal);

    const noteTypeLabel = cdnrForm.noteType === 'C' ? 'Credit Note' : cdnrForm.noteType === 'D' ? 'Debit Note' : 'Refund Voucher';

    const newNote = {
      id: Date.now(),
      recipientGstin: cdnrForm.recipientGstin,
      recipientName: cdnrForm.recipientName || 'REGISTERED BUYER',
      noteNum: cdnrForm.noteNum,
      noteDate: cdnrForm.noteDate,
      origInvoiceNum: cdnrForm.origInvoiceNum || '-',
      origInvoiceDate: cdnrForm.origInvoiceDate || '-',
      noteType: cdnrForm.noteType,
      noteTypeLabel,
      noteValue: nVal,
      pos: cdnrForm.pos,
      supplyType: cdnrForm.supplyType,
      reverseCharge: cdnrForm.reverseCharge,
      taxableValue: tVal,
      rate: rVal,
      diffPercentage: cdnrForm.diffPercentage,
      applicableRatePercent: cdnrForm.applicableRatePercent,
      igst: isInter ? taxCalc : 0,
      cgst: !isInter ? taxCalc / 2 : 0,
      sgst: !isInter ? taxCalc / 2 : 0,
      cess: cessVal,
      totalTax: taxCalc + cessVal
    };

    setCdnrInvoices((prev) => [...prev, newNote]);
    toast.success('Record Saved', `Credit / Debit Note ${cdnrForm.noteNum} saved successfully.`);

    setCdnrForm(initialCdnrForm);
    setScreen('cdnr-summary');
  };

  const handleDeleteCdnrInvoice = (id) => {
    setCdnrInvoices((prev) => prev.filter((item) => item.id !== id));
    toast.info('Deleted', 'Credit / Debit note removed.');
  };

  // ==============================================================
  // 7. HANDLERS FOR 9B - CREDIT / DEBIT NOTES (UNREGISTERED) (CDNUR)
  // ==============================================================
  // 7. CDNUR HANDLERS (9B - Credit/Debit Notes Unregistered)
  // ==============================================================
  const handleCdnurTypeChange = (newType) => {
    let newPos = cdnurForm.pos;
    if (newType === 'EXPWP' || newType === 'EXPWOP') {
      newPos = '96-Foreign Country';
    } else if (newPos === '96-Foreign Country') {
      newPos = '';
    }

    const updatedRates = {};
    const isWithPayment = newType !== 'EXPWOP';
    const mult = cdnurForm.diffPercentage ? (parseFloat(cdnurForm.applicableRatePercent) / 100 || 0.65) : 1;

    Object.keys(cdnurForm.ratesData).forEach((lbl) => {
      const item = cdnurForm.ratesData[lbl];
      const match = ratesList.find((r) => r.label === lbl);
      const numRate = match ? match.rate : 0;
      const tVal = parseFloat(item.taxable) || 0;
      updatedRates[lbl] = {
        ...item,
        igst: isWithPayment ? (tVal * numRate * mult) / 100 : 0
      };
    });

    setCdnurForm((prev) => ({
      ...prev,
      type: newType,
      pos: newPos,
      ratesData: updatedRates
    }));
  };

  const handleCdnurPosChange = (selectedPos) => {
    const isIntra = selectedPos && selectedPos.startsWith('08');
    setCdnurForm((prev) => ({
      ...prev,
      pos: selectedPos,
      supplyType: isIntra ? 'Intra-State' : 'Inter-State'
    }));
  };

  const handleCdnurDiffPercentageChange = (checked, applicableRate = cdnurForm.applicableRatePercent) => {
    const isWithPayment = cdnurForm.type !== 'EXPWOP';
    const mult = checked ? (parseFloat(applicableRate) / 100 || 0.65) : 1;
    const updatedRates = {};

    Object.keys(cdnurForm.ratesData).forEach((lbl) => {
      const item = cdnurForm.ratesData[lbl];
      const match = ratesList.find((r) => r.label === lbl);
      const numRate = match ? match.rate : 0;
      const tVal = parseFloat(item.taxable) || 0;
      updatedRates[lbl] = {
        ...item,
        igst: isWithPayment ? (tVal * numRate * mult) / 100 : 0
      };
    });

    setCdnurForm((prev) => ({
      ...prev,
      diffPercentage: checked,
      applicableRatePercent: applicableRate,
      ratesData: updatedRates
    }));
  };

  const handleCdnurRateTaxableChange = (label, numericRate, value) => {
    const taxableNum = parseFloat(value) || 0;
    const isWithPayment = cdnurForm.type !== 'EXPWOP';
    const mult = cdnurForm.diffPercentage ? (parseFloat(cdnurForm.applicableRatePercent) / 100 || 0.65) : 1;
    const computedIgst = isWithPayment ? (taxableNum * numericRate * mult) / 100 : 0;

    setCdnurForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          taxable: value,
          igst: computedIgst
        }
      }
    }));
  };

  const handleCdnurRateCessChange = (label, value) => {
    setCdnurForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [label]: {
          ...prev.ratesData[label],
          cess: value
        }
      }
    }));
  };

  const handleSaveCdnurInvoice = (e) => {
    e.preventDefault();
    if (!cdnurForm.noteNum) {
      toast.error('Validation Error', 'Please enter Debit / Credit Note No.');
      return;
    }
    if (!cdnurForm.noteDate) {
      toast.error('Validation Error', 'Please enter Debit / Credit Note Date.');
      return;
    }
    if (!cdnurForm.noteType) {
      toast.error('Validation Error', 'Please select Note Type.');
      return;
    }
    if (!cdnurForm.pos) {
      toast.error('Validation Error', 'Please select Place of Supply (POS).');
      return;
    }

    let totalTaxable = 0;
    let totalIgst = 0;
    let totalCess = 0;
    const ratesSummary = [];

    Object.keys(cdnurForm.ratesData).forEach((lbl) => {
      const item = cdnurForm.ratesData[lbl];
      const tVal = parseFloat(item.taxable) || 0;
      const cVal = parseFloat(item.cess) || 0;
      if (tVal > 0 || item.igst > 0 || cVal > 0) {
        totalTaxable += tVal;
        totalIgst += item.igst;
        totalCess += cVal;
        ratesSummary.push({ rateLabel: lbl, taxable: tVal, igst: item.igst, cess: cVal });
      }
    });

    if (totalTaxable <= 0 && ratesSummary.length === 0) {
      toast.error('Validation Error', 'Please enter Taxable value for at least one rate in Item details.');
      return;
    }

    const noteTypeLabel = cdnurForm.noteType === 'C' ? 'Credit' : cdnurForm.noteType === 'D' ? 'Debit' : cdnurForm.noteType === 'R' ? 'Refund' : 'Credit';

    const newNote = {
      id: Date.now(),
      type: cdnurForm.type,
      typeLabel: cdnurForm.type,
      noteNum: cdnurForm.noteNum,
      noteDate: cdnurForm.noteDate,
      noteType: cdnurForm.noteType,
      noteTypeLabel,
      noteValue: parseFloat(cdnurForm.noteValue) || (totalTaxable + totalIgst + totalCess),
      pos: cdnurForm.pos,
      supplyType: cdnurForm.supplyType,
      source: cdnurForm.source || '-',
      irn: cdnurForm.irn || '-',
      irnDate: cdnurForm.irnDate || '-',
      taxableValue: totalTaxable,
      diffPercentage: cdnurForm.diffPercentage,
      applicableRatePercent: cdnurForm.applicableRatePercent,
      igst: totalIgst,
      cgst: 0,
      sgst: 0,
      cess: totalCess,
      totalTax: totalIgst + totalCess,
      ratesSummary: ratesSummary
    };

    setCdnurInvoices((prev) => [...prev, newNote]);
    toast.success('Record Saved', `Credit / Debit Note ${cdnurForm.noteNum} saved successfully.`);

    setCdnurForm(initialCdnurForm);
    setScreen('cdnur-summary');
  };

  const handleDeleteCdnurInvoice = (id) => {
    setCdnurInvoices((prev) => prev.filter((item) => item.id !== id));
    toast.info('Deleted', 'Credit / Debit note removed.');
  };

  // ==============================================================
  // 8. 11A(1), 11A(2) - TAX LIABILITY (ADVANCES RECEIVED) HANDLERS
  // ==============================================================
  const handleAtPosChange = (newPos) => {
    let sType = '';
    if (newPos) {
      sType = newPos.startsWith('08') ? 'Intra-State' : 'Inter-State';
    }

    const updatedRates = { ...atForm.ratesData };
    const diffFactor = atForm.diffPercentage ? (parseFloat(atForm.applicableRatePercent) / 100) : 1;

    ratesList.forEach((r) => {
      const gross = parseFloat(updatedRates[r.label]?.grossAdvance) || 0;
      if (gross > 0) {
        const fullTax = gross * (r.rate / 100) * diffFactor;
        if (sType === 'Intra-State') {
          updatedRates[r.label].igst = 0;
          updatedRates[r.label].cgst = parseFloat((fullTax / 2).toFixed(2));
          updatedRates[r.label].sgst = parseFloat((fullTax / 2).toFixed(2));
        } else {
          updatedRates[r.label].igst = parseFloat(fullTax.toFixed(2));
          updatedRates[r.label].cgst = 0;
          updatedRates[r.label].sgst = 0;
        }
      }
    });

    setAtForm({
      ...atForm,
      pos: newPos,
      supplyType: sType,
      ratesData: updatedRates
    });
  };

  const handleAtDiffChange = (checked) => {
    const diffFactor = checked ? (parseFloat(atForm.applicableRatePercent) / 100) : 1;
    const updatedRates = { ...atForm.ratesData };

    ratesList.forEach((r) => {
      const gross = parseFloat(updatedRates[r.label]?.grossAdvance) || 0;
      if (gross > 0) {
        const fullTax = gross * (r.rate / 100) * diffFactor;
        if (atForm.supplyType === 'Intra-State') {
          updatedRates[r.label].igst = 0;
          updatedRates[r.label].cgst = parseFloat((fullTax / 2).toFixed(2));
          updatedRates[r.label].sgst = parseFloat((fullTax / 2).toFixed(2));
        } else {
          updatedRates[r.label].igst = parseFloat(fullTax.toFixed(2));
          updatedRates[r.label].cgst = 0;
          updatedRates[r.label].sgst = 0;
        }
      }
    });

    setAtForm({
      ...atForm,
      diffPercentage: checked,
      ratesData: updatedRates
    });
  };

  const handleAtRateAdvanceChange = (rateLabel, val) => {
    const numericRate = ratesList.find((r) => r.label === rateLabel)?.rate || 0;
    const gross = parseFloat(val) || 0;
    const diffFactor = atForm.diffPercentage ? (parseFloat(atForm.applicableRatePercent) / 100) : 1;
    const fullTax = gross * (numericRate / 100) * diffFactor;

    setAtForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [rateLabel]: {
          ...prev.ratesData[rateLabel],
          grossAdvance: val,
          igst: prev.supplyType === 'Intra-State' ? 0 : parseFloat(fullTax.toFixed(2)),
          cgst: prev.supplyType === 'Intra-State' ? parseFloat((fullTax / 2).toFixed(2)) : 0,
          sgst: prev.supplyType === 'Intra-State' ? parseFloat((fullTax / 2).toFixed(2)) : 0
        }
      }
    }));
  };

  const handleAtCessChange = (rateLabel, val) => {
    setAtForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [rateLabel]: {
          ...prev.ratesData[rateLabel],
          cess: val
        }
      }
    }));
  };

  const handleSaveAtInvoice = (e) => {
    e.preventDefault();
    if (!atForm.pos) {
      toast.error('Validation Error', 'Please select Place of Supply (POS).');
      return;
    }

    let totalGross = 0;
    let totalIgst = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalCess = 0;

    Object.entries(atForm.ratesData).forEach(([rateLabel, row]) => {
      const gross = parseFloat(row.grossAdvance) || 0;
      if (gross > 0) {
        totalGross += gross;
        totalIgst += parseFloat(row.igst) || 0;
        totalCgst += parseFloat(row.cgst) || 0;
        totalSgst += parseFloat(row.sgst) || 0;
        totalCess += parseFloat(row.cess) || 0;
      }
    });

    if (totalGross <= 0) {
      toast.error('Validation Error', 'Please enter Gross Advance Received for at least one tax rate.');
      return;
    }

    const newRecord = {
      id: `AT-${Date.now()}`,
      pos: atForm.pos,
      supplyType: atForm.supplyType,
      diffPercentage: atForm.diffPercentage,
      applicableRatePercent: atForm.applicableRatePercent,
      grossAdvance: totalGross,
      igst: totalIgst,
      cgst: totalCgst,
      sgst: totalSgst,
      cess: totalCess,
      totalTax: totalIgst + totalCgst + totalSgst + totalCess,
      ratesData: { ...atForm.ratesData }
    };

    setAtInvoices((prev) => [...prev, newRecord]);
    toast.success('Record Saved', `Tax liability on advance for ${atForm.pos} saved successfully.`);
    setAtForm({ ...initialAtForm, ratesData: buildInitialAtRates() });
    setScreen('at-summary');
  };

  const handleDeleteAtInvoice = (id) => {
    setAtInvoices((prev) => prev.filter((item) => item.id !== id));
    toast.info('Deleted', 'Tax liability on advance record removed.');
  };

  // ==============================================================
  // 9. 11B(1), 11B(2) - ADJUSTMENT OF ADVANCES HANDLERS
  // ==============================================================
  const handleAdjPosChange = (newPos) => {
    let sType = '';
    if (newPos) {
      sType = newPos.startsWith('08') ? 'Intra-State' : 'Inter-State';
    }

    const updatedRates = { ...adjForm.ratesData };
    const diffFactor = adjForm.diffPercentage ? (parseFloat(adjForm.applicableRatePercent) / 100) : 1;

    ratesList.forEach((r) => {
      const gross = parseFloat(updatedRates[r.label]?.grossAdjusted) || 0;
      if (gross > 0) {
        const fullTax = gross * (r.rate / 100) * diffFactor;
        if (sType === 'Intra-State') {
          updatedRates[r.label].igst = 0;
          updatedRates[r.label].cgst = parseFloat((fullTax / 2).toFixed(2));
          updatedRates[r.label].sgst = parseFloat((fullTax / 2).toFixed(2));
        } else {
          updatedRates[r.label].igst = parseFloat(fullTax.toFixed(2));
          updatedRates[r.label].cgst = 0;
          updatedRates[r.label].sgst = 0;
        }
      }
    });

    setAdjForm({
      ...adjForm,
      pos: newPos,
      supplyType: sType,
      ratesData: updatedRates
    });
  };

  const handleAdjDiffChange = (checked) => {
    const diffFactor = checked ? (parseFloat(adjForm.applicableRatePercent) / 100) : 1;
    const updatedRates = { ...adjForm.ratesData };

    ratesList.forEach((r) => {
      const gross = parseFloat(updatedRates[r.label]?.grossAdjusted) || 0;
      if (gross > 0) {
        const fullTax = gross * (r.rate / 100) * diffFactor;
        if (adjForm.supplyType === 'Intra-State') {
          updatedRates[r.label].igst = 0;
          updatedRates[r.label].cgst = parseFloat((fullTax / 2).toFixed(2));
          updatedRates[r.label].sgst = parseFloat((fullTax / 2).toFixed(2));
        } else {
          updatedRates[r.label].igst = parseFloat(fullTax.toFixed(2));
          updatedRates[r.label].cgst = 0;
          updatedRates[r.label].sgst = 0;
        }
      }
    });

    setAdjForm({
      ...adjForm,
      diffPercentage: checked,
      ratesData: updatedRates
    });
  };

  const handleAdjRateAdvanceChange = (rateLabel, val) => {
    const numericRate = ratesList.find((r) => r.label === rateLabel)?.rate || 0;
    const gross = parseFloat(val) || 0;
    const diffFactor = adjForm.diffPercentage ? (parseFloat(adjForm.applicableRatePercent) / 100) : 1;
    const fullTax = gross * (numericRate / 100) * diffFactor;

    setAdjForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [rateLabel]: {
          ...prev.ratesData[rateLabel],
          grossAdjusted: val,
          igst: prev.supplyType === 'Intra-State' ? 0 : parseFloat(fullTax.toFixed(2)),
          cgst: prev.supplyType === 'Intra-State' ? parseFloat((fullTax / 2).toFixed(2)) : 0,
          sgst: prev.supplyType === 'Intra-State' ? parseFloat((fullTax / 2).toFixed(2)) : 0
        }
      }
    }));
  };

  const handleAdjCessChange = (rateLabel, val) => {
    setAdjForm((prev) => ({
      ...prev,
      ratesData: {
        ...prev.ratesData,
        [rateLabel]: {
          ...prev.ratesData[rateLabel],
          cess: val
        }
      }
    }));
  };

  const handleSaveAdjInvoice = (e) => {
    e.preventDefault();
    if (!adjForm.pos) {
      toast.error('Validation Error', 'Please select Place of Supply (POS).');
      return;
    }

    let totalGross = 0;
    let totalIgst = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalCess = 0;

    Object.entries(adjForm.ratesData).forEach(([rateLabel, row]) => {
      const gross = parseFloat(row.grossAdjusted) || 0;
      if (gross > 0) {
        totalGross += gross;
        totalIgst += parseFloat(row.igst) || 0;
        totalCgst += parseFloat(row.cgst) || 0;
        totalSgst += parseFloat(row.sgst) || 0;
        totalCess += parseFloat(row.cess) || 0;
      }
    });

    if (totalGross <= 0) {
      toast.error('Validation Error', 'Please enter Gross Advance Adjusted for at least one tax rate.');
      return;
    }

    const newRecord = {
      id: `ADJ-${Date.now()}`,
      pos: adjForm.pos,
      supplyType: adjForm.supplyType,
      diffPercentage: adjForm.diffPercentage,
      applicableRatePercent: adjForm.applicableRatePercent,
      grossAdjusted: totalGross,
      igst: totalIgst,
      cgst: totalCgst,
      sgst: totalSgst,
      cess: totalCess,
      totalTax: totalIgst + totalCgst + totalSgst + totalCess,
      ratesData: { ...adjForm.ratesData }
    };

    setAdjAdvInvoices((prev) => [...prev, newRecord]);
    toast.success('Record Saved', `Adjustment of advance for ${adjForm.pos} saved successfully.`);
    setAdjForm({ ...initialAdjForm, ratesData: buildInitialAdjRates() });
    setScreen('adj-summary');
  };

  const handleDeleteAdjInvoice = (id) => {
    setAdjAdvInvoices((prev) => prev.filter((item) => item.id !== id));
    toast.info('Deleted', 'Adjustment of advance record removed.');
  };

  // ==============================================================
  // 12. HSN-WISE SUMMARY HANDLERS
  // ==============================================================
  const uqcOptions = [
    'BAG-BAGS', 'BAL-BALE', 'BDL-BUNDLES', 'BOX-BOX', 'BTL-BOTTLES',
    'CAN-CANS', 'CTN-CARTONS', 'DOZ-DOZEN', 'DRM-DRUMS', 'GGK-GREAT GROSS',
    'GMS-GRAMMES', 'GRS-GROSS', 'GYD-GROSS YARDS', 'KGS-KILOGRAMS', 'KLR-KILOLITRE',
    'KME-KILOMETRE', 'LTR-LITRES', 'MLT-MILLILITRE', 'MTR-METERS', 'MTS-METRIC TON',
    'NOS-NUMBERS', 'PAC-PACKETS', 'PCS-PIECES', 'PRS-PAIRS', 'QTL-QUINTAL',
    'ROL-ROLLS', 'SET-SETS', 'SQF-SQUARE FEET', 'SQM-SQUARE METERS', 'SQY-SQUARE YARDS',
    'TBS-TABLETS', 'TGM-TEN GROSS', 'THD-THOUSANDS', 'TON-TONNES', 'TUB-TUBES',
    'UGS-US GALLONS', 'UNT-UNITS', 'YDS-YARDS', 'OTH-OTHERS'
  ];

  const handleHsnCodeChange = (val) => {
    let desc = '';
    const code = val.trim();
    if (code.startsWith('6109')) {
      desc = 'T-SHIRTS, SINGLETS AND OTHER VESTS, KNITTED OR CROCHETED';
    } else if (code.startsWith('6203')) {
      desc = "MEN'S OR BOYS' SUITS, ENSEMBLES, JACKETS, BLAZERS, TROUSERS";
    } else if (code.startsWith('8471')) {
      desc = 'AUTOMATIC DATA PROCESSING MACHINES AND UNITS THEREOF';
    } else if (code.startsWith('8517')) {
      desc = 'TELEPHONE SETS, SMARTPHONES AND OTHER APPARATUS FOR TRANSMISSION';
    } else if (code.startsWith('1006')) {
      desc = 'RICE IN HUSK OR HUSKED';
    } else if (code.startsWith('9983')) {
      desc = 'OTHER PROFESSIONAL, TECHNICAL AND BUSINESS SERVICES';
    } else if (code.startsWith('9984')) {
      desc = 'TELECOMMUNICATIONS, BROADCASTING AND INFORMATION SERVICES';
    } else if (code.length >= 2) {
      desc = `GOODS / SERVICES CLASSIFIED UNDER CHAPTER ${code.slice(0, 2)}`;
    }
    setHsnForm((prev) => ({
      ...prev,
      hsn: val,
      descAsPerHsn: desc,
      description: prev.description || desc
    }));
  };

  const handleHsnRateOrTaxableChange = (field, val) => {
    setHsnForm((prev) => {
      const updated = { ...prev, [field]: val };
      const taxable = parseFloat(field === 'taxableValue' ? val : updated.taxableValue) || 0;
      const rateVal = parseFloat(field === 'rate' ? val : updated.rate) || 0;
      if (taxable > 0 && rateVal > 0) {
        const fullTax = (taxable * rateVal) / 100;
        const half = parseFloat((fullTax / 2).toFixed(2));
        updated.cgst = half.toString();
        updated.sgst = half.toString();
        updated.igst = '0.00';
      }
      return updated;
    });
  };

  const handleAddHsnRecord = (e) => {
    e?.preventDefault();
    if (!hsnForm.hsn) {
      toast.error('Validation Error', 'Please enter HSN code.');
      return;
    }
    if (!hsnForm.uqc) {
      toast.error('Validation Error', 'Please select UQC.');
      return;
    }
    if (!hsnForm.taxableValue) {
      toast.error('Validation Error', 'Please enter Total Taxable Value.');
      return;
    }
    if (!hsnForm.rate) {
      toast.error('Validation Error', 'Please select Rate (%).');
      return;
    }

    const newRecord = {
      id: `HSN-${Date.now()}`,
      ...hsnForm,
      totalQuantity: parseFloat(hsnForm.totalQuantity) || 0,
      taxableValue: parseFloat(hsnForm.taxableValue) || 0,
      igst: parseFloat(hsnForm.igst) || 0,
      cgst: parseFloat(hsnForm.cgst) || 0,
      sgst: parseFloat(hsnForm.sgst) || 0,
      cess: parseFloat(hsnForm.cess) || 0
    };

    if (hsnTab === 'b2b') {
      setHsnB2bRecords((prev) => [...prev, newRecord]);
    } else {
      setHsnB2cRecords((prev) => [...prev, newRecord]);
    }

    setHsnForm(initialHsnForm);
    toast.success('Record Added', `HSN ${newRecord.hsn} details added to ${hsnTab.toUpperCase()} supplies.`);
  };

  const handleDeleteHsnRecord = (id, tab) => {
    if (tab === 'b2b') {
      setHsnB2bRecords((prev) => prev.filter((r) => r.id !== id));
    } else {
      setHsnB2cRecords((prev) => prev.filter((r) => r.id !== id));
    }
    toast.info('Deleted', 'HSN record removed.');
  };

  // ==============================================================
  // 13. DOCUMENTS ISSUED HANDLERS
  // ==============================================================
  const handleAddDocRow = (catId) => {
    setDocCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          const nextIndex = cat.docs.length + 1;
          const newRow = {
            id: Date.now() + Math.random(),
            no: nextIndex,
            from: `001`,
            to: `010`,
            totalNum: '10',
            cancelled: '0',
            netIssued: '10'
          };
          return { ...cat, docs: [...cat.docs, newRow] };
        }
        return cat;
      })
    );
  };

  const handleUpdateDocRow = (catId, rowId, field, val) => {
    setDocCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            docs: cat.docs.map((row) => {
              if (row.id === rowId) {
                const updated = { ...row, [field]: val };
                if (field === 'from' || field === 'to' || field === 'cancelled') {
                  const numFrom = parseInt(updated.from) || 0;
                  const numTo = parseInt(updated.to) || 0;
                  let tot = parseInt(updated.totalNum) || 0;
                  if (numTo >= numFrom && numFrom > 0) {
                    tot = numTo - numFrom + 1;
                    updated.totalNum = tot.toString();
                  }
                  const canc = parseInt(updated.cancelled) || 0;
                  updated.netIssued = Math.max(0, tot - canc).toString();
                }
                return updated;
              }
              return row;
            })
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteDocRow = (catId, rowId) => {
    setDocCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return { ...cat, docs: cat.docs.filter((r) => r.id !== rowId) };
        }
        return cat;
      })
    );
    toast.info('Deleted', 'Document range removed.');
  };

  const totalDocsCount = docCategories.reduce((acc, cat) => acc + cat.docs.length, 0);

  // ==============================================================
  // 14. SUPPLIES MADE THROUGH ECO HANDLERS
  // ==============================================================
  const handleEcoGstinChange = (val) => {
    const gstinVal = val.toUpperCase();
    let name = '';
    if (gstinVal.startsWith('08AAACE')) {
      name = 'AMAZON SELLER SERVICES PRIVATE LIMITED';
    } else if (gstinVal.startsWith('29AABCF')) {
      name = 'FLIPKART INTERNET PRIVATE LIMITED';
    } else if (gstinVal.startsWith('07AABCM')) {
      name = 'MEESHO PAYMENTS PRIVATE LIMITED';
    } else if (gstinVal.length === 15) {
      name = 'ECO OPERATOR LOGISTICS PRIVATE LIMITED';
    }
    setEcoForm((prev) => ({
      ...prev,
      ecoGstin: gstinVal,
      tradeName: name
    }));
  };

  const handleSaveEcoRecord = (e) => {
    e?.preventDefault();
    if (!ecoForm.ecoGstin) {
      toast.error('Validation Error', 'Please enter GSTIN of e-commerce operator.');
      return;
    }
    if (!ecoForm.netValue) {
      toast.error('Validation Error', 'Please enter Net value of supplies.');
      return;
    }

    const newRecord = {
      id: `ECO-${Date.now()}`,
      ...ecoForm,
      netValue: parseFloat(ecoForm.netValue) || 0,
      igst: parseFloat(ecoForm.igst) || 0,
      cgst: parseFloat(ecoForm.cgst) || 0,
      sgst: parseFloat(ecoForm.sgst) || 0,
      cess: parseFloat(ecoForm.cess) || 0
    };

    if (ecoTab === 'u52') {
      setEcoRecordsU52((prev) => [...prev, newRecord]);
    } else {
      setEcoRecordsU95((prev) => [...prev, newRecord]);
    }

    setEcoForm(initialEcoForm);
    toast.success('Record Saved', `Supplies through ${newRecord.tradeName || newRecord.ecoGstin} saved.`);
    setScreen('eco-summary');
  };

  const handleDeleteEcoRecord = (id, tab) => {
    if (tab === 'u52') {
      setEcoRecordsU52((prev) => prev.filter((r) => r.id !== id));
    } else {
      setEcoRecordsU95((prev) => prev.filter((r) => r.id !== id));
    }
    toast.info('Deleted', 'ECO record removed.');
  };

  // ==============================================================
  // 15. SUPPLIES U/S 9(5) HANDLERS
  // ==============================================================
  const handleSup15EcoGstinChange = (val) => {
    const gstinVal = val.toUpperCase();
    let name = '';
    if (gstinVal.startsWith('08AAACE')) {
      name = 'AMAZON SELLER SERVICES PRIVATE LIMITED';
    } else if (gstinVal.startsWith('29AABCF')) {
      name = 'FLIPKART INTERNET PRIVATE LIMITED';
    } else if (gstinVal.startsWith('07AABCM')) {
      name = 'MEESHO PAYMENTS PRIVATE LIMITED';
    } else if (gstinVal.startsWith('08AABCT')) {
      name = 'TATA 1MG HEALTHCARE SOLUTIONS';
    } else if (gstinVal.length === 15) {
      name = 'ECO OPERATOR LOGISTICS PRIVATE LIMITED';
    }
    setSup15Form((prev) => ({
      ...prev,
      ecoGstin: gstinVal,
      tradeName: name
    }));
  };

  const handleSaveSup15Record = (e) => {
    e?.preventDefault();
    if (!sup15Form.ecoGstin) {
      toast.error('Validation Error', 'Please enter GSTIN of e-commerce operator.');
      return;
    }
    if (!sup15Form.netValue) {
      toast.error('Validation Error', 'Please enter Value of Supplies.');
      return;
    }

    const newRecord = {
      id: `SUP15-${Date.now()}`,
      ...sup15Form,
      netValue: parseFloat(sup15Form.netValue) || 0,
      igst: parseFloat(sup15Form.igst) || 0,
      cgst: parseFloat(sup15Form.cgst) || 0,
      sgst: parseFloat(sup15Form.sgst) || 0,
      cess: parseFloat(sup15Form.cess) || 0
    };

    if (sup15Tab === 'r2r') {
      setSup15R2R((prev) => [...prev, newRecord]);
    } else if (sup15Tab === 'r2u') {
      setSup15R2U((prev) => [...prev, newRecord]);
    } else if (sup15Tab === 'u2r') {
      setSup15U2R((prev) => [...prev, newRecord]);
    } else {
      setSup15U2U((prev) => [...prev, newRecord]);
    }

    setSup15Form(initialSup15Form);
    toast.success('Record Saved', `Supplies u/s 9(5) saved successfully.`);
    setScreen('sup15-summary');
  };

  const handleDeleteSup15Record = (id, tab) => {
    if (tab === 'r2r') setSup15R2R((prev) => prev.filter((r) => r.id !== id));
    else if (tab === 'r2u') setSup15R2U((prev) => prev.filter((r) => r.id !== id));
    else if (tab === 'u2r') setSup15U2R((prev) => prev.filter((r) => r.id !== id));
    else setSup15U2U((prev) => prev.filter((r) => r.id !== id));
    toast.info('Deleted', 'Record removed.');
  };

  // ==============================================================
  // AMENDMENT HANDLERS (9A, 9C, 10, 11A, 11B, 14A, 15A)
  // ==============================================================
  const stateOptions = [
    '01-Jammu & Kashmir',
    '02-Himachal Pradesh',
    '03-Punjab',
    '04-Chandigarh',
    '05-Uttarakhand',
    '06-Haryana',
    '07-Delhi',
    '08-Rajasthan',
    '09-Uttar Pradesh',
    '10-Bihar',
    '19-West Bengal',
    '24-Gujarat',
    '27-Maharashtra',
    '29-Karnataka',
    '32-Kerala',
    '33-Tamil Nadu',
    '36-Telangana'
  ];
  const monthsList = [
    'April', 'May', 'June', 'July', 'August', 'September', 
    'October', 'November', 'December', 'January', 'February', 'March'
  ];
  const fyList = ['2026-27', '2025-26', '2024-25', '2023-24'];

  const handleSearchAmendB2b = () => {
    if (!amendSearchB2b.invoiceNo?.trim()) {
      toast.error('Validation Error', 'Please enter Invoice no.');
      return;
    }
    const invNo = amendSearchB2b.invoiceNo.trim();
    const existing = amendB2bRecords.find(r => r.origInvoiceNo?.toLowerCase() === invNo.toLowerCase());
    if (existing) {
      toast.info('Record Exists', `Invoice ${invNo} is already displayed in the amendment table below.`);
      return;
    }
    const match = b2bInvoices.find(r => r.invoiceNumber?.toLowerCase() === invNo.toLowerCase());
    const newRecord = {
      id: `AMEND-B2B-${Date.now()}`,
      financialYear: amendSearchB2b.fy || '2026-27',
      origInvoiceNo: invNo,
      revisedInvoiceNo: match ? match.invoiceNumber : `${invNo}-REV`,
      invoiceDate: match ? match.invoiceDate : '2026-09-15',
      receiverGstin: match ? match.receiverGstin : '08AABCT1332L1Z1',
      receiverName: match ? match.receiverName : 'SHREE SHYAM ENTERPRISES',
      pos: match ? match.pos : '08-Rajasthan',
      invoiceValue: match ? match.invoiceValue : 118000,
      taxableValue: match ? match.taxableValue : 100000,
      rate: match ? match.rate : 18,
      igst: match ? match.igst : 0,
      cgst: match ? match.cgst : 9000,
      sgst: match ? match.sgst : 9000,
      cess: match ? match.cess : 0
    };
    setAmendB2bRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Invoice ${invNo} loaded in table below for amendment.`);
  };

  const handleSearchAmendB2cl = () => {
    if (!amendSearchB2cl.invoiceNo?.trim()) {
      toast.error('Validation Error', 'Please enter Invoice no.');
      return;
    }
    const invNo = amendSearchB2cl.invoiceNo.trim();
    const existing = amendB2clRecords.find(r => r.origInvoiceNo?.toLowerCase() === invNo.toLowerCase());
    if (existing) {
      toast.info('Record Exists', `Invoice ${invNo} is already displayed in the amendment table below.`);
      return;
    }
    const match = b2clInvoices.find(r => r.invoiceNumber?.toLowerCase() === invNo.toLowerCase());
    const newRecord = {
      id: `AMEND-B2CL-${Date.now()}`,
      financialYear: amendSearchB2cl.fy || '2026-27',
      origInvoiceNo: invNo,
      revisedInvoiceNo: match ? match.invoiceNumber : `${invNo}-REV`,
      invoiceDate: match ? match.invoiceDate : '2026-09-12',
      pos: match ? match.pos : '07-Delhi',
      applicablePercent: '65',
      invoiceValue: match ? match.invoiceValue : 306800,
      taxableValue: match ? match.taxableValue : 260000,
      rate: match ? match.rate : 18,
      igst: match ? match.igst : 46800,
      cess: match ? match.cess : 0
    };
    setAmendB2clRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Invoice ${invNo} loaded in table below for amendment.`);
  };

  const handleSearchAmendExp = () => {
    if (!amendSearchExp.invoiceNo?.trim()) {
      toast.error('Validation Error', 'Please enter Invoice no.');
      return;
    }
    const invNo = amendSearchExp.invoiceNo.trim();
    const existing = amendExpRecords.find(r => r.origInvoiceNo?.toLowerCase() === invNo.toLowerCase());
    if (existing) {
      toast.info('Record Exists', `Invoice ${invNo} is already displayed in the amendment table below.`);
      return;
    }
    const match = exportsInvoices.find(r => r.invoiceNumber?.toLowerCase() === invNo.toLowerCase());
    const newRecord = {
      id: `AMEND-EXP-${Date.now()}`,
      financialYear: amendSearchExp.fy || '2025-26',
      origInvoiceNo: invNo,
      revisedInvoiceNo: match ? match.invoiceNumber : `${invNo}-REV`,
      invoiceDate: match ? match.invoiceDate : '2026-09-10',
      exportType: match ? match.exportType : 'WPAY',
      shippingBillNo: match ? match.shippingBillNo : 'SB-987654',
      shippingBillDate: match ? match.shippingBillDate : '2026-09-14',
      portCode: match ? match.portCode : 'INNSA1',
      invoiceValue: match ? match.invoiceValue : 590000,
      taxableValue: match ? match.taxableValue : 500000,
      rate: match ? match.rate : 18,
      igst: match ? match.igst : 90000
    };
    setAmendExpRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Invoice ${invNo} loaded in table below for amendment.`);
  };

  const handleSearchAmendCdnr = () => {
    if (!amendSearchCdnr.noteNo?.trim()) {
      toast.error('Validation Error', 'Please enter Credit/Debit Note No.');
      return;
    }
    const nNo = amendSearchCdnr.noteNo.trim();
    const existing = amendCdnrRecords.find(r => r.origNoteNo?.toLowerCase() === nNo.toLowerCase());
    if (existing) {
      toast.info('Record Exists', `Note ${nNo} is already displayed in the amendment table below.`);
      return;
    }
    const match = cdnrInvoices.find(r => r.noteNumber?.toLowerCase() === nNo.toLowerCase());
    const newRecord = {
      id: `AMEND-CDNR-${Date.now()}`,
      financialYear: amendSearchCdnr.fy || '2026-27',
      origNoteNo: nNo,
      revisedNoteNo: match ? match.noteNumber : `${nNo}-REV`,
      noteDate: match ? match.noteDate : '2026-09-18',
      noteType: match ? match.noteType : 'Credit',
      receiverGstin: match ? match.receiverGstin : '08AABCT1332L1Z1',
      receiverName: match ? match.receiverName : 'SHREE SHYAM ENTERPRISES',
      origInvoiceNo: match ? match.originalInvoiceNumber : 'INV-2026-001',
      pos: match ? match.pos : '08-Rajasthan',
      noteValue: match ? match.noteValue : 23600,
      taxableValue: match ? match.taxableValue : 20000,
      rate: match ? match.rate : 18,
      igst: match ? match.igst : 0,
      cgst: match ? match.cgst : 1800,
      sgst: match ? match.sgst : 1800,
      cess: match ? match.cess : 0
    };
    setAmendCdnrRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Credit/Debit Note ${nNo} loaded in table below for amendment.`);
  };

  const handleSearchAmendCdnur = () => {
    if (!amendSearchCdnur.noteNo?.trim()) {
      toast.error('Validation Error', 'Please enter Credit/Debit Note No.');
      return;
    }
    const nNo = amendSearchCdnur.noteNo.trim();
    const existing = amendCdnurRecords.find(r => r.origNoteNo?.toLowerCase() === nNo.toLowerCase());
    if (existing) {
      toast.info('Record Exists', `Note ${nNo} is already displayed in the amendment table below.`);
      return;
    }
    const match = cdnurInvoices.find(r => r.noteNumber?.toLowerCase() === nNo.toLowerCase());
    const newRecord = {
      id: `AMEND-CDNUR-${Date.now()}`,
      financialYear: amendSearchCdnur.fy || '2026-27',
      origNoteNo: nNo,
      revisedNoteNo: match ? match.noteNumber : `${nNo}-REV`,
      noteDate: match ? match.noteDate : '2026-09-20',
      noteType: match ? match.noteType : 'Credit',
      urType: match ? match.urType : 'B2CL',
      pos: match ? match.pos : '07-Delhi',
      noteValue: match ? match.noteValue : 17700,
      taxableValue: match ? match.taxableValue : 15000,
      rate: match ? match.rate : 18,
      igst: match ? match.igst : 2700,
      cess: match ? match.cess : 0
    };
    setAmendCdnurRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Credit/Debit Note ${nNo} loaded in table below for amendment.`);
  };

  const handleSearchAmendB2cs = () => {
    if (!amendSearchB2cs.pos) {
      toast.error('Validation Error', 'Please select Original POS.');
      return;
    }
    const pos = amendSearchB2cs.pos;
    const existing = amendB2csRecords.find(r => r.origPos === pos && r.year === amendSearchB2cs.year && r.month === amendSearchB2cs.month);
    if (existing) {
      toast.info('Record Exists', `POS ${pos} is already displayed in the amendment table below.`);
      return;
    }
    const isInter = !pos.startsWith('08');
    const newRecord = {
      id: `AMEND-B2CS-${Date.now()}`,
      year: amendSearchB2cs.year || '2026-27',
      month: amendSearchB2cs.month || 'September',
      origPos: pos,
      revisedPos: pos,
      supplyType: isInter ? 'Inter-State' : 'Intra-State',
      rate: 18,
      taxableValue: 45000,
      igst: isInter ? 8100 : 0,
      cgst: isInter ? 0 : 4050,
      sgst: isInter ? 0 : 4050,
      cess: 0,
      diffPercentage: amendSearchB2cs.diffPercentage
    };
    setAmendB2csRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `B2C (Others) for POS ${pos} loaded in table below for amendment.`);
  };

  const handleSearchAmendAt = () => {
    if (!amendSearchAt.pos) {
      toast.error('Validation Error', 'Please select POS.');
      return;
    }
    const pos = amendSearchAt.pos;
    const existing = amendAtRecords.find(r => r.origPos === pos && r.financialYear === amendSearchAt.fy && r.period === amendSearchAt.period);
    if (existing) {
      toast.info('Record Exists', `Record for ${pos} is already displayed in the amendment table below.`);
      return;
    }
    const isInter = !pos.startsWith('08');
    const newRecord = {
      id: `AMEND-AT-${Date.now()}`,
      financialYear: amendSearchAt.fy || '2026-27',
      period: amendSearchAt.period || 'September',
      origPos: pos,
      revisedPos: pos,
      grossAdvance: 50000,
      rate: 18,
      igst: isInter ? 9000 : 0,
      cgst: isInter ? 0 : 4500,
      sgst: isInter ? 0 : 4500,
      cess: 0,
      diffPercentage: amendSearchAt.diffPercentage
    };
    setAmendAtRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Advance Tax record for ${pos} loaded in table below for amendment.`);
  };

  const handleSearchAmendAdj = () => {
    if (!amendSearchAdj.pos) {
      toast.error('Validation Error', 'Please select POS.');
      return;
    }
    const pos = amendSearchAdj.pos;
    const existing = amendAdjRecords.find(r => r.origPos === pos && r.financialYear === amendSearchAdj.fy && r.period === amendSearchAdj.period);
    if (existing) {
      toast.info('Record Exists', `Record for ${pos} is already displayed in the amendment table below.`);
      return;
    }
    const isInter = !pos.startsWith('08');
    const newRecord = {
      id: `AMEND-ADJ-${Date.now()}`,
      financialYear: amendSearchAdj.fy || '2026-27',
      period: amendSearchAdj.period || 'September',
      origPos: pos,
      revisedPos: pos,
      grossAdjusted: 30000,
      rate: 18,
      igst: isInter ? 5400 : 0,
      cgst: isInter ? 0 : 2700,
      sgst: isInter ? 0 : 2700,
      cess: 0,
      diffPercentage: amendSearchAdj.diffPercentage
    };
    setAmendAdjRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Adjustment of Advance record for ${pos} loaded in table below for amendment.`);
  };

  const handleSearchAmendEco = () => {
    if (!amendSearchEco.ecoGstin?.trim()) {
      toast.error('Validation Error', 'Please enter GSTIN of e-commerce operator.');
      return;
    }
    const gstinVal = amendSearchEco.ecoGstin.trim().toUpperCase();
    let name = 'ECO OPERATOR LOGISTICS PRIVATE LIMITED';
    if (gstinVal.startsWith('08AAACE')) name = 'AMAZON SELLER SERVICES PRIVATE LIMITED';
    else if (gstinVal.startsWith('29AABCF')) name = 'FLIPKART INTERNET PRIVATE LIMITED';
    else if (gstinVal.startsWith('07AABCM')) name = 'MEESHO PAYMENTS PRIVATE LIMITED';

    const existing = amendEcoRecords.find(r => r.ecoGstin === gstinVal && r.ecoTab === amendEcoTab);
    if (existing) {
      toast.info('Record Exists', `ECO GSTIN ${gstinVal} is already displayed in the amendment table below.`);
      return;
    }
    const newRecord = {
      id: `AMEND-ECO-${Date.now()}`,
      financialYear: amendSearchEco.fy || '2026-27',
      period: amendSearchEco.period || 'September',
      ecoTab: amendEcoTab,
      ecoGstin: gstinVal,
      tradeName: name,
      grossValue: 120000,
      returnedValue: 10000,
      netValue: 110000,
      rate: 18,
      igst: 19800,
      cgst: 0,
      sgst: 0,
      cess: 0
    };
    setAmendEcoRecords(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `ECO record for ${gstinVal} loaded in table below for amendment.`);
  };

  const handleSearchAmendSup15 = () => {
    if (!amendSearchSup15.docNo?.trim()) {
      toast.error('Validation Error', 'Please enter Document No.');
      return;
    }
    const docNo = amendSearchSup15.docNo.trim();
    const existing = amendSup15Records.find(r => r.docNo === docNo && r.tab === amendSup15Tab);
    if (existing) {
      toast.info('Record Exists', `Document ${docNo} is already displayed in the amendment table below.`);
      return;
    }
    const newRecord = {
      id: `AMEND-SUP15-${Date.now()}`,
      financialYear: amendSearchSup15.fy || '2026-27',
      docNo: docNo,
      tab: amendSup15Tab,
      ecoGstin: '08AAACE9988D1Z2',
      tradeName: 'AMAZON SELLER SERVICES PRIVATE LIMITED',
      netValue: 75000,
      rate: 18,
      igst: 13500,
      cgst: 0,
      sgst: 0,
      cess: 0
    };
    setAmendSup15Records(prev => [...prev, newRecord]);
    toast.success('Record Retrieved', `Document ${docNo} loaded in table below for amendment.`);
  };

  const handleDeleteAmend = (section, id) => {
    if (section === 'b2b') setAmendB2bRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'b2cl') setAmendB2clRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'exp') setAmendExpRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'cdnr') setAmendCdnrRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'cdnur') setAmendCdnurRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'b2cs') setAmendB2csRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'at') setAmendAtRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'adj') setAmendAdjRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'eco') setAmendEcoRecords(prev => prev.filter(r => r.id !== id));
    else if (section === 'sup15') setAmendSup15Records(prev => prev.filter(r => r.id !== id));
    toast.info('Record Deleted', 'Amended record removed.');
  };

  // Editing state for inline amend records
  const [editingAmendId, setEditingAmendId] = useState(null);
  const [editingAmendForm, setEditingAmendForm] = useState({});

  const startEditAmendRecord = (rec) => {
    setEditingAmendId(rec.id);
    setEditingAmendForm({ ...rec });
  };

  const saveEditAmendRecord = (section) => {
    const updater = (prev) => prev.map(r => r.id === editingAmendId ? { ...editingAmendForm } : r);
    if (section === 'b2b') setAmendB2bRecords(updater);
    else if (section === 'b2cl') setAmendB2clRecords(updater);
    else if (section === 'exp') setAmendExpRecords(updater);
    else if (section === 'cdnr') setAmendCdnrRecords(updater);
    else if (section === 'cdnur') setAmendCdnurRecords(updater);
    else if (section === 'b2cs') setAmendB2csRecords(updater);
    else if (section === 'at') setAmendAtRecords(updater);
    else if (section === 'adj') setAmendAdjRecords(updater);
    else if (section === 'eco') setAmendEcoRecords(updater);
    else if (section === 'sup15') setAmendSup15Records(updater);
    setEditingAmendId(null);
    setEditingAmendForm({});
    toast.success('Amendment Updated', 'Record changes saved successfully.');
  };

  // ==============================================================
  // TOTALS CONSOLIDATION
  // ==============================================================
  const totalB2bTaxable = b2bInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalB2bTax = b2bInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);

  const totalB2clTaxable = b2clInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalB2clIgst = b2clInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalExpTaxable = exportsInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalExpIgst = exportsInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalB2csTaxable = b2csInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalB2csTax = b2csInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);
  const totalB2csCgst = b2csInvoices.reduce((acc, cur) => acc + cur.cgst, 0);
  const totalB2csSgst = b2csInvoices.reduce((acc, cur) => acc + cur.sgst, 0);
  const totalB2csIgst = b2csInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalCdnrTaxable = cdnrInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalCdnrTax = cdnrInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);
  const totalCdnrCgst = cdnrInvoices.reduce((acc, cur) => acc + cur.cgst, 0);
  const totalCdnrSgst = cdnrInvoices.reduce((acc, cur) => acc + cur.sgst, 0);
  const totalCdnrIgst = cdnrInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalCdnurTaxable = cdnurInvoices.reduce((acc, cur) => acc + cur.taxableValue, 0);
  const totalCdnurTax = cdnurInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);
  const totalCdnurIgst = cdnurInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalAtTaxable = atInvoices.reduce((acc, cur) => acc + cur.grossAdvance, 0);
  const totalAtTax = atInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);
  const totalAtCgst = atInvoices.reduce((acc, cur) => acc + cur.cgst, 0);
  const totalAtSgst = atInvoices.reduce((acc, cur) => acc + cur.sgst, 0);
  const totalAtIgst = atInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const totalAdjTaxable = adjAdvInvoices.reduce((acc, cur) => acc + cur.grossAdjusted, 0);
  const totalAdjTax = adjAdvInvoices.reduce((acc, cur) => acc + cur.totalTax, 0);
  const totalAdjCgst = adjAdvInvoices.reduce((acc, cur) => acc + cur.cgst, 0);
  const totalAdjSgst = adjAdvInvoices.reduce((acc, cur) => acc + cur.sgst, 0);
  const totalAdjIgst = adjAdvInvoices.reduce((acc, cur) => acc + cur.igst, 0);

  const grandTaxable = totalB2bTaxable + totalB2clTaxable + totalExpTaxable + totalB2csTaxable + totalCdnrTaxable + totalCdnurTaxable + totalAtTaxable;
  const grandTax = totalB2bTax + totalB2clIgst + totalExpIgst + totalB2csTax + totalCdnrTax + totalCdnurTax + totalAtTax;

  // Submit & File Return
  const handleConfirmFiling = async () => {
    setSubmitting(true);
    const newArn = `AA08${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}00${Math.floor(10000 + Math.random() * 90000)}`;

    await fileReturnRecord({
      returnType: 'GSTR-1',
      taxPeriod: `${taxPeriod} ${fy}`,
      dueDate: gstr1DueDate,
      filingDate: new Date().toLocaleDateString('en-GB'),
      status: 'Filed',
      arn: newArn,
      taxableValue: isNilFiling ? 0 : grandTaxable,
      cgst: isNilFiling ? 0 : (totalB2bTax / 2) + totalB2csCgst + totalCdnrCgst + totalAtCgst,
      sgst: isNilFiling ? 0 : (totalB2bTax / 2) + totalB2csSgst + totalCdnrSgst + totalAtSgst,
      igst: isNilFiling ? 0 : totalB2clIgst + totalExpIgst + totalB2csIgst + totalCdnrIgst + totalCdnurIgst + totalAtIgst,
      totalTax: isNilFiling ? 0 : grandTax,
      mode: 'Electronic Verification Code (EVC)'
    });

    setArnNumber(newArn);
    setReturnStatus('Filed');
    setSubmitting(false);
    setFileModalOpen(false);
    toast.success('Return Filed Successfully', `Form GSTR-1 filed with ARN: ${newArn}`);
  };

  // Add Record Tiles definition
  const addRecordTiles = [
    { id: '4A', title: '4A, 4B, 6B, 6C - B2B, SEZ, DE Invoices', count: b2bInvoices.length },
    { id: '5', title: '5 - B2C (Large) Invoices', count: b2clInvoices.length },
    { id: '6A', title: '6A - Exports Invoices', count: exportsInvoices.length },
    { id: '7', title: '7 - B2C (Others)', count: b2csInvoices.length },
    { id: '8A', title: '8A, 8B, 8C, 8D - Nil Rated Supplies', count: nilRatedData.isSaved ? 1 : 0 },
    { id: '9B_reg', title: '9B - Credit / Debit Notes (Registered)', count: cdnrInvoices.length },
    { id: '9B_unreg', title: '9B - Credit / Debit Notes (Unregistered)', count: cdnurInvoices.length, tooltip: 'Details of Credit/Debit Notes for unregistered user' },
    { id: '11A', title: '11A(1), 11A(2) - Tax Liability (Advances Received)', count: atInvoices.length, tooltip: 'Tax Liability (Advances Received)' },
    { id: '11B', title: '11B(1), 11B(2) - Adjustment of Advances', count: adjAdvInvoices.length, tooltip: 'Adjustment of Advances' },
    { id: '12', title: '12 - HSN-wise summary of outward supplies', count: hsnB2bRecords.length + hsnB2cRecords.length, tooltip: 'HSN-wise summary of outward supplies' },
    { id: '13', title: '13 - Documents Issued', count: totalDocsCount, tooltip: 'Documents Issued' },
    { id: '14', title: '14 - Supplies made through ECO', count: ecoRecordsU52.length + ecoRecordsU95.length, tooltip: 'Supplies made through ECO' },
    { id: '15', title: '15 - Supplies U/s 9(5)', count: sup15R2R.length + sup15R2U.length + sup15U2R.length + sup15U2U.length, tooltip: 'Supplies U/s 9(5)' }
  ];

  // Amend Record Tiles definition
  const amendRecordTiles = [
    { id: '9A_b2b', title: '9A - Amended B2B Invoices', count: amendB2bRecords.length },
    { id: '9A_b2c', title: '9A - Amended B2C (Large) Invoices', count: amendB2clRecords.length },
    { id: '9A_exp', title: '9A - Amended Exports Invoices', count: amendExpRecords.length },
    { id: '9C_reg', title: '9C - Amended Credit/Debit Notes (Registered)', count: amendCdnrRecords.length },
    { id: '9C_unreg', title: '9C - Amended Credit/Debit Notes (Unregistered)', count: amendCdnurRecords.length },
    { id: '10_b2c', title: '10 - Amended B2C(Others)', count: amendB2csRecords.length },
    { id: '11A_amend', title: '11A - Amended Tax Liability (Advances Received)', count: amendAtRecords.length },
    { id: '11B_amend', title: '11B - Amendment of Adjustment of Advances', count: amendAdjRecords.length },
    { id: '14A_eco', title: '14A - Amended Supplies made through ECO', count: amendEcoRecords.length },
    { id: '15A_eco', title: '15A - Amended Supplies U/s 9(5)', count: amendSup15Records.length }
  ];

  const currentB2bTaxable = parseFloat(addForm.taxableValue) || 0;
  const currentB2bRate = parseFloat(addForm.rate) || 18;
  const currentB2bTax = (currentB2bTaxable * currentB2bRate) / 100;
  const isInterstateB2b = addForm.supplyType === 'Inter-State';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* ============================================================== */}
      {/* SCREEN 1: GSTR-1 MAIN TILES SCREEN                             */}
      {/* ============================================================== */}
      {screen === 'main' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <div className="gstr1-header-title">
                GSTR-1 - Details of outward supplies of goods or services
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Advisory', 'E-Invoicing rules are active under Rule 48(4).')}
                  className="gstr1-header-btn"
                >
                  E-INVOICE ADVISORY
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Help', 'Click on any tile below to view summary or add records.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'Records synced with GST portal.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div className="gstr1-taxpayer-strip">
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div style={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>● Indicates Mandatory Fields</div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>
                Status -{' '}
                <strong style={{ color: returnStatus === 'Filed' ? '#16a34a' : '#dc2626' }}>
                  {returnStatus}
                </strong>
                {arnNumber && <span style={{ marginLeft: '6px', fontSize: '11px', color: '#2563eb' }}>({arnNumber})</span>}
              </div>
              <div style={{ textAlign: 'right' }}>Due Date - <strong>{gstr1DueDate}</strong></div>
            </div>

            <div style={{ padding: '0 20px 24px 20px' }}>
              <div className="gstr1-nil-checkbox-row">
                <input
                  type="checkbox"
                  id="nilGstr1"
                  checked={isNilFiling}
                  onChange={(e) => setIsNilFiling(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="nilGstr1" style={{ cursor: 'pointer' }}>
                  File Nil GSTR-1
                </label>
              </div>

              {/* SECTION 1: ADD RECORD DETAILS */}
              <div>
                <div className="gstr1-section-bar" onClick={() => setAddDetailsOpen(!addDetailsOpen)}>
                  <span>ADD RECORD DETAILS</span>
                  <span>{addDetailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                </div>

                {addDetailsOpen && (
                  <div className="gstr1-tiles-grid">
                    {addRecordTiles.map((tile) => (
                      <div
                        key={tile.id}
                        className="gstr1-tile"
                        title={tile.tooltip || tile.title}
                        onClick={() => {
                          if (tile.id === '4A') {
                            setScreen('b2b-summary');
                          } else if (tile.id === '5') {
                            setScreen('b2cl-summary');
                          } else if (tile.id === '6A') {
                            setScreen('exp-summary');
                          } else if (tile.id === '7') {
                            setScreen('b2cs-summary');
                          } else if (tile.id === '8A') {
                            setScreen('nil-supplies');
                          } else if (tile.id === '9B_reg') {
                            setScreen('cdnr-summary');
                          } else if (tile.id === '9B_unreg') {
                            setScreen('cdnur-summary');
                          } else if (tile.id === '11A') {
                            setScreen('at-summary');
                          } else if (tile.id === '11B') {
                            setScreen('adj-summary');
                          } else if (tile.id === '12') {
                            setScreen('hsn-summary');
                          } else if (tile.id === '13') {
                            setScreen('doc-summary');
                          } else if (tile.id === '14') {
                            setScreen('eco-summary');
                          } else if (tile.id === '15') {
                            setScreen('sup15-summary');
                          } else {
                            toast.info(tile.title, 'Section is active.');
                          }
                        }}
                      >
                        <div className="gstr1-tile-header">{tile.title}</div>
                        <div className="gstr1-tile-body">
                          <CheckCircle2 size={16} color="#16a34a" />
                          <span>{tile.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: AMEND RECORD DETAILS */}
              <div>
                <div className="gstr1-section-bar" onClick={() => setAmendDetailsOpen(!amendDetailsOpen)}>
                  <span>AMEND RECORD DETAILS</span>
                  <span>{amendDetailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                </div>

                {amendDetailsOpen && (
                  <div className="gstr1-tiles-grid">
                    {amendRecordTiles.map((tile) => (
                      <div
                        key={tile.id}
                        className="gstr1-tile"
                        onClick={() => {
                          if (tile.id === '9A_b2b') setScreen('amend-b2b');
                          else if (tile.id === '9A_b2c') setScreen('amend-b2cl');
                          else if (tile.id === '9A_exp') setScreen('amend-exp');
                          else if (tile.id === '9C_reg') setScreen('amend-cdnr');
                          else if (tile.id === '9C_unreg') setScreen('amend-cdnur');
                          else if (tile.id === '10_b2c') setScreen('amend-b2cs');
                          else if (tile.id === '11A_amend') setScreen('amend-at');
                          else if (tile.id === '11B_amend') setScreen('amend-adj');
                          else if (tile.id === '14A_eco') setScreen('amend-eco');
                          else if (tile.id === '15A_eco') setScreen('amend-sup15');
                          else toast.info(tile.title, 'Section is active.');
                        }}
                      >
                        <div className="gstr1-tile-header">{tile.title}</div>
                        <div className="gstr1-tile-body">
                          <CheckCircle2 size={16} color="#16a34a" />
                          <span>{tile.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="gstr1-advisory-note">
                <strong>ℹ</strong> The taxpayers for whom e-invoicing is not applicable may ignore the sections/options related to e-invoice download. The downloaded file would be blank in case taxpayer is not e-invoicing or when e-invoices reported to IRP are yet to be processed by GST system.
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => toast.success('Summary Generated', 'Summary calculated and validated.')}
                  className="gst-return-action-btn"
                  style={{ backgroundColor: '#173059', padding: '10px 20px', fontSize: '13px' }}
                >
                  GENERATE SUMMARY
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setB2bInvoices([]);
                    setB2clInvoices([]);
                    setExportsInvoices([]);
                    setB2csInvoices([]);
                    setNilRatedData(initialNilRated);
                    setCdnrInvoices([]);
                    setCdnurInvoices([]);
                    toast.info('Reset Done', 'All draft values have been cleared.');
                  }}
                  className="gst-return-action-btn"
                  style={{ backgroundColor: '#64748b', padding: '10px 20px', fontSize: '13px' }}
                >
                  RESET
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="gst-return-action-btn"
                  style={{ backgroundColor: '#0284c7', padding: '10px 20px', fontSize: '13px' }}
                >
                  PREVIEW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (returnStatus === 'Filed') {
                      toast.info('Already Filed', 'This return has already been filed.');
                      return;
                    }
                    setFileModalOpen(true);
                  }}
                  disabled={returnStatus === 'Filed'}
                  className="gst-return-action-btn"
                  style={{
                    backgroundColor: returnStatus === 'Filed' ? '#16a34a' : '#15803d',
                    padding: '10px 24px',
                    fontSize: '13px'
                  }}
                >
                  {returnStatus === 'Filed' ? 'RETURN FILED' : 'FILE RETURN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: B2B SUMMARY SCREEN                                   */}
      {/* ============================================================== */}
      {screen === 'b2b-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2B' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                4A, 4B, 6B, 6C - B2B, SEZ, DE Invoices
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', 'View processed B2B recipient summaries or click ADD RECORD to add invoices.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'B2B summaries synced.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div className="gstr1-subnav-bar">
              <button type="button" className="gstr1-subnav-tab">
                Recipient wise count
              </button>
            </div>

            <div style={{ padding: '20px 24px 28px 24px' }}>
              {b2bInvoices.length === 0 ? (
                <div className="gstr1-empty-alert">
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Recipient GSTIN</th>
                        <th>Recipient Name</th>
                        <th style={{ textAlign: 'center' }}>Invoice Count</th>
                        <th style={{ textAlign: 'right' }}>Total Taxable (₹)</th>
                        <th style={{ textAlign: 'right' }}>Total Tax (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b2bInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{inv.recipientGstin}</td>
                          <td>{inv.recipientName} ({inv.invoiceNo})</td>
                          <td style={{ textAlign: 'center' }}>1</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Invoice"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('b2b-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('EWB Data', 'No pending E-Way bill outward invoices found for import.')}
                  className="gstr1-btn-navy"
                >
                  IMPORT EWB DATA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 3: B2B ADD INVOICE SCREEN                               */}
      {/* ============================================================== */}
      {screen === 'b2b-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2B', onClick: () => setScreen('b2b-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('b2b-summary')}
                  className="gstr1-back-circle-btn"
                  title="Back to B2B Summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">B2B, SEZ, DE - Add Invoice</span>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
                ● Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              <div className="gstr1-checkbox-strip">
                <label className="gstr1-checkbox-item">
                  <input
                    type="checkbox"
                    checked={addForm.deemedExports}
                    onChange={(e) => setAddForm({ ...addForm, deemedExports: e.target.checked })}
                  />
                  <span>Deemed Exports</span>
                </label>

                <label className="gstr1-checkbox-item">
                  <input
                    type="checkbox"
                    checked={addForm.sezWithPayment}
                    onChange={(e) => setAddForm({ ...addForm, sezWithPayment: e.target.checked })}
                  />
                  <span>SEZ Supplies with payment</span>
                </label>

                <label className="gstr1-checkbox-item">
                  <input
                    type="checkbox"
                    checked={addForm.sezWithoutPayment}
                    onChange={(e) => setAddForm({ ...addForm, sezWithoutPayment: e.target.checked })}
                  />
                  <span>SEZ Supplies without payment</span>
                </label>

                <label className="gstr1-checkbox-item">
                  <input
                    type="checkbox"
                    checked={addForm.reverseCharge}
                    onChange={(e) => setAddForm({ ...addForm, reverseCharge: e.target.checked })}
                  />
                  <span>Supply attract reverse charge</span>
                </label>

                <label className="gstr1-checkbox-item">
                  <input
                    type="checkbox"
                    checked={addForm.intraStateIgst}
                    onChange={(e) => setAddForm({ ...addForm, intraStateIgst: e.target.checked })}
                  />
                  <span>Intra-State Supplies attracting IGST</span>
                </label>
              </div>

              <div style={{ margin: '14px 0 20px 0' }}>
                <label className="gstr1-checkbox-item" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={addForm.diffPercentage}
                    onChange={(e) => setAddForm({ ...addForm, diffPercentage: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <span>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>
              </div>

              <div className="gstr1-form-grid-3col">
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Recipient GSTIN/UIN <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by recipient name as in master or er"
                    value={addForm.recipientGstin}
                    onChange={handleGstinChange}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Recipient Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.recipientName}
                    onChange={(e) => setAddForm({ ...addForm, recipientName: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Name as in Master</label>
                  <input
                    type="text"
                    value={addForm.nameAsInMaster}
                    onChange={(e) => setAddForm({ ...addForm, nameAsInMaster: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice no. <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV/26-27/001"
                    value={addForm.invoiceNo}
                    onChange={(e) => setAddForm({ ...addForm, invoiceNo: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice date <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={addForm.invoiceDate}
                    onChange={(e) => setAddForm({ ...addForm, invoiceDate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Total invoice value (₹) <span>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total invoice value in ₹"
                    value={addForm.totalInvoiceValue}
                    onChange={(e) => setAddForm({ ...addForm, totalInvoiceValue: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    POS 🛈 <span>*</span>
                  </label>
                  <select
                    value={addForm.pos}
                    onChange={handlePosChange}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="08-Rajasthan">08-Rajasthan</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={addForm.supplyType}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Source</label>
                  <input
                    type="text"
                    value={addForm.source}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN</label>
                  <input
                    type="text"
                    placeholder="Invoice Reference Number (Optional)"
                    value={addForm.irn}
                    onChange={(e) => setAddForm({ ...addForm, irn: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN date</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={addForm.irnDate}
                    onChange={(e) => setAddForm({ ...addForm, irnDate: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', margin: '0 0 10px 0' }}>
                  Item Details & Applicable Tax Rate
                </h4>
                <table className="gstr1-tax-table">
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Rate (%)</th>
                      <th style={{ width: '22%' }}>Taxable Value (₹) *</th>
                      <th style={{ width: '20%' }}>Integrated Tax (₹)</th>
                      <th style={{ width: '20%' }}>Central Tax (₹)</th>
                      <th style={{ width: '20%' }}>State/UT Tax (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          value={addForm.rate}
                          onChange={(e) => setAddForm({ ...addForm, rate: e.target.value })}
                          style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', width: '100%' }}
                        >
                          <option value="5">5.0%</option>
                          <option value="12">12.0%</option>
                          <option value="18">18.0%</option>
                          <option value="28">28.0%</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={addForm.taxableValue}
                          onChange={(e) => setAddForm({ ...addForm, taxableValue: e.target.value })}
                          style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', width: '100%', textAlign: 'right' }}
                          required
                        />
                      </td>
                      <td>{isInterstateB2b ? `₹ ${currentB2bTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ 0.00'}</td>
                      <td>{!isInterstateB2b ? `₹ ${(currentB2bTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ 0.00'}</td>
                      <td>{!isInterstateB2b ? `₹ ${(currentB2bTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ 0.00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('b2b-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 4: B2C (LARGE) SUMMARY SCREEN                           */}
      {/* ============================================================== */}
      {screen === 'b2cl-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CL' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                5 - B2C (Large) Invoices
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', 'B2C Large invoices are inter-state supplies with invoice value > ₹2.5 Lakhs to unregistered persons.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'B2CL summaries synced.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div className="gstr1-subnav-bar">
              <button type="button" className="gstr1-subnav-tab">
                POS wise count
              </button>
            </div>

            <div style={{ padding: '20px 24px 28px 24px' }}>
              {b2clInvoices.length === 0 ? (
                <div className="gstr1-empty-alert">
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Place of Supply (POS)</th>
                        <th>Invoice No</th>
                        <th>Invoice Date</th>
                        <th style={{ textAlign: 'right' }}>Total Invoice Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b2clInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700 }}>{inv.pos}</td>
                          <td>{inv.invoiceNo}</td>
                          <td>{inv.invoiceDate}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.totalInvoiceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteB2clInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('b2cl-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 5: B2C (LARGE) ADD INVOICE SCREEN                       */}
      {/* ============================================================== */}
      {screen === 'b2cl-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CL', onClick: () => setScreen('b2cl-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('b2cl-summary')}
                  className="gstr1-back-circle-btn"
                  title="Back to B2CL Summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">B2C(Large) Invoices- Details</span>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
                ● Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveB2clInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              <div style={{ margin: '8px 0 18px 0' }}>
                <label className="gstr1-checkbox-item" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={b2clForm.diffPercentage}
                    onChange={(e) => setB2clForm({ ...b2clForm, diffPercentage: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#1e293b' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '20px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    POS 🛈 <span>*</span>
                  </label>
                  <select
                    value={b2clForm.pos}
                    onChange={(e) => setB2clForm({ ...b2clForm, pos: e.target.value })}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice no. <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Invoice number"
                    value={b2clForm.invoiceNo}
                    onChange={(e) => setB2clForm({ ...b2clForm, invoiceNo: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice date <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={b2clForm.invoiceDate}
                    onChange={(e) => setB2clForm({ ...b2clForm, invoiceDate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={b2clForm.supplyType}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Total invoice value (₹) <span>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total invoice value in ₹"
                    value={b2clForm.totalInvoiceValue}
                    onChange={(e) => setB2clForm({ ...b2clForm, totalInvoiceValue: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 10px 0' }}>
                  Item details
                </h4>

                <table className="gstr1-b2cl-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ width: '18%' }}>Rate (%)</th>
                      <th rowSpan={2} style={{ width: '30%' }}>Taxable value (₹) *</th>
                      <th colSpan={2} style={{ width: '52%' }}>Amount of Tax</th>
                    </tr>
                    <tr>
                      <th style={{ width: '26%' }}>Integrated tax (₹) *</th>
                      <th style={{ width: '26%' }}>Cess (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesList.map((r) => {
                      const data = b2clForm.ratesData[r.label] || { taxable: '', igst: 0, cess: '' };
                      return (
                        <tr key={r.label}>
                          <td>{r.label}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.taxable}
                              onChange={(e) => handleB2clRateTaxableChange(r.label, r.rate, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={data.taxable ? data.igst.toFixed(2) : ''}
                              readOnly
                              disabled
                              placeholder="0.00"
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.cess}
                              onChange={(e) => handleB2clRateCessChange(r.label, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('b2cl-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 6: 6A - EXPORTS SUMMARY SCREEN (Screenshot image.png 1) */}
      {/* URL: return.gst.gov.in/returns/auth/gstr1/export/summary      */}
      {/* ============================================================== */}
      {screen === 'exp-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'EXP' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                6A - Exports Invoices
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', 'View processed Export invoices or click ADD RECORD to add shipping bills.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'Export summaries synced.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px 24px 28px 24px' }}>
              {exportsInvoices.length === 0 ? (
                <div className="gstr1-empty-alert">
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Invoice No</th>
                        <th>Invoice Date</th>
                        <th>Port Code</th>
                        <th>Shipping Bill No</th>
                        <th>GST Payment</th>
                        <th style={{ textAlign: 'right' }}>Total Invoice Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exportsInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700 }}>{inv.invoiceNo}</td>
                          <td>{inv.invoiceDate}</td>
                          <td>{inv.portCode || '-'}</td>
                          <td>{inv.shippingBillNo || '-'}</td>
                          <td>{inv.gstPayment}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.totalInvoiceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteExportInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Export Invoice"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('exp-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('EWB Data', 'No pending E-Way bill export records found for import.')}
                  className="gstr1-btn-navy"
                >
                  IMPORT EWB DATA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 7: 6A - EXPORTS ADD INVOICE SCREEN (Image 2, 3, 4)      */}
      {/* URL: return.gst.gov.in/returns/auth/gstr1/export/invoice/add   */}
      {/* ============================================================== */}
      {screen === 'exp-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'EXP', onClick: () => setScreen('exp-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Teal Header matching Image 2 */}
            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('exp-summary')}
                  className="gstr1-back-circle-btn"
                  title="Back to Exports Summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">Exports - Add Details</span>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
                ● Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveExportInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              {/* Form Grid matching Image 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '20px' }}>
                {/* Row 1 */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice no. <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Invoice number"
                    value={exportForm.invoiceNo}
                    onChange={(e) => setExportForm({ ...exportForm, invoiceNo: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Invoice date <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={exportForm.invoiceDate}
                    onChange={(e) => setExportForm({ ...exportForm, invoiceDate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Port Code</label>
                  <input
                    type="text"
                    placeholder="e.g. INNSA1"
                    value={exportForm.portCode}
                    onChange={(e) => setExportForm({ ...exportForm, portCode: e.target.value.toUpperCase() })}
                    className="gstr1-field-input"
                  />
                </div>

                {/* Row 2 */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Shipping Bill No./Bill of Export No.</label>
                  <input
                    type="text"
                    placeholder="Shipping Bill No."
                    value={exportForm.shippingBillNo}
                    onChange={(e) => setExportForm({ ...exportForm, shippingBillNo: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Shipping Bill Date/Bill of Export Date</label>
                  <input
                    type="date"
                    value={exportForm.shippingBillDate}
                    onChange={(e) => setExportForm({ ...exportForm, shippingBillDate: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Total invoice value (₹) <span>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total invoice value in ₹"
                    value={exportForm.totalInvoiceValue}
                    onChange={(e) => setExportForm({ ...exportForm, totalInvoiceValue: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* Row 3 */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={exportForm.supplyType}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    GST Payment <span>*</span>
                  </label>
                  <select
                    value={exportForm.gstPayment}
                    onChange={(e) => handleExportGstPaymentChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="With Payment of Tax">With Payment of Tax</option>
                    <option value="Without Payment of Tax">Without Payment of Tax</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Source</label>
                  <input
                    type="text"
                    value={exportForm.source}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                {/* Row 4 */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN</label>
                  <input
                    type="text"
                    placeholder="IRN (Optional)"
                    value={exportForm.irn}
                    onChange={(e) => setExportForm({ ...exportForm, irn: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN date</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={exportForm.irnDate}
                    onChange={(e) => setExportForm({ ...exportForm, irnDate: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Subtitle: Item details matching Image 3 & 4 */}
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 10px 0' }}>
                  Item details
                </h4>

                <table className="gstr1-b2cl-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ width: '18%' }}>Rate</th>
                      <th rowSpan={2} style={{ width: '30%' }}>Taxable value (₹) *</th>
                      <th colSpan={2} style={{ width: '52%' }}>Amount of tax</th>
                    </tr>
                    <tr>
                      <th style={{ width: '26%' }}>Integrated tax (₹) *</th>
                      <th style={{ width: '26%' }}>CESS (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesList.map((r) => {
                      const data = exportForm.ratesData[r.label] || { taxable: '', igst: 0, cess: '' };
                      return (
                        <tr key={r.label}>
                          <td>{r.label}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.taxable}
                              onChange={(e) => handleExportRateTaxableChange(r.label, r.rate, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={data.taxable ? data.igst.toFixed(2) : ''}
                              readOnly
                              disabled
                              placeholder="0.00"
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.cess}
                              onChange={(e) => handleExportRateCessChange(r.label, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons matching Image 4 */}
              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('exp-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 8: 7 - B2C (OTHERS) SUMMARY SCREEN                      */}
      {/* ============================================================== */}
      {screen === 'b2cs-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CS' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                7 - B2C (Others)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', '7 - B2C (Others) covers intra-state supplies of any value and inter-state supplies up to ₹2.5 Lakhs made to unregistered consumers.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'B2CS details synced.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div className="gstr1-subnav-bar">
              <button type="button" className="gstr1-subnav-tab">
                POS wise count
              </button>
            </div>

            <div style={{ padding: '20px 24px 28px 24px' }}>
              {b2csInvoices.length === 0 ? (
                <div className="gstr1-empty-alert">
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Place of Supply (POS)</th>
                        <th>Supply Type</th>
                        <th style={{ textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Type</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b2csInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700 }}>{inv.pos}</td>
                          <td>{inv.supplyType}</td>
                          <td style={{ textAlign: 'center' }}>{inv.rate}%</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>{inv.type === 'E' ? 'E-Comm' : 'OE'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteB2csInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('b2cs-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 9: 7 - B2C (OTHERS) - ADD DETAILS SCREEN (B2CS - Details) */}
      {/* ============================================================== */}
      {screen === 'b2cs-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CS', onClick: () => setScreen('b2cs-summary') },
                { label: 'Add Details' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('b2cs-summary')}
                  className="gstr1-back-circle-btn"
                  title="Back to B2CS Summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">B2CS - Details</span>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
                ● Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveB2csInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              <div style={{ margin: '8px 0 18px 0' }}>
                <label className="gstr1-checkbox-item" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={b2csForm.diffPercentage}
                    onChange={(e) => setB2csForm({ ...b2csForm, diffPercentage: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#1e293b' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '20px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    POS 🛈 <span>*</span>
                  </label>
                  <select
                    value={b2csForm.pos}
                    onChange={(e) => handleB2csPosChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="08-Rajasthan">08-Rajasthan</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                    <option value="10-Bihar">10-Bihar</option>
                    <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                    <option value="32-Kerala">32-Kerala</option>
                    <option value="21-Odisha">21-Odisha</option>
                    <option value="01-Jammu and Kashmir">01-Jammu and Kashmir</option>
                    <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                    <option value="04-Chandigarh">04-Chandigarh</option>
                    <option value="05-Uttarakhand">05-Uttarakhand</option>
                    <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Taxable Value (₹) <span>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter Taxable Value"
                    value={b2csForm.taxableValue}
                    onChange={(e) => setB2csForm({ ...b2csForm, taxableValue: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={b2csForm.supplyType}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                {b2csForm.diffPercentage && (
                  <div className="gstr1-field-group">
                    <label className="gstr1-field-label">
                      Applicable % of Tax Rate <span>*</span>
                    </label>
                    <select
                      value={b2csForm.applicableRatePercent}
                      onChange={(e) => setB2csForm({ ...b2csForm, applicableRatePercent: e.target.value })}
                      className="gstr1-field-input"
                    >
                      <option value="65">65% of normal rate</option>
                    </select>
                  </div>
                )}

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Rate (%) <span>*</span>
                  </label>
                  <select
                    value={b2csForm.rate}
                    onChange={(e) => setB2csForm({ ...b2csForm, rate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="0">0.0%</option>
                    <option value="0.1">0.10%</option>
                    <option value="0.25">0.25%</option>
                    <option value="1">1.0%</option>
                    <option value="1.5">1.5%</option>
                    <option value="3">3.0%</option>
                    <option value="5">5.0%</option>
                    <option value="6">6.0%</option>
                    <option value="7.5">7.5%</option>
                    <option value="12">12.0%</option>
                    <option value="18">18.0%</option>
                    <option value="28">28.0%</option>
                    <option value="40">40.0%</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Integrated Tax (₹)</label>
                  <input
                    type="text"
                    value={b2csForm.pos !== '08-Rajasthan' && b2csForm.taxableValue ? ((parseFloat(b2csForm.taxableValue) || 0) * (parseFloat(b2csForm.rate) || 0) / 100 * (b2csForm.diffPercentage ? 0.65 : 1)).toFixed(2) : '0.00'}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Central Tax (₹)</label>
                  <input
                    type="text"
                    value={b2csForm.pos === '08-Rajasthan' && b2csForm.taxableValue ? (((parseFloat(b2csForm.taxableValue) || 0) * (parseFloat(b2csForm.rate) || 0) / 100 * (b2csForm.diffPercentage ? 0.65 : 1)) / 2).toFixed(2) : '0.00'}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">State/UT Tax (₹)</label>
                  <input
                    type="text"
                    value={b2csForm.pos === '08-Rajasthan' && b2csForm.taxableValue ? (((parseFloat(b2csForm.taxableValue) || 0) * (parseFloat(b2csForm.rate) || 0) / 100 * (b2csForm.diffPercentage ? 0.65 : 1)) / 2).toFixed(2) : '0.00'}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Cess (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={b2csForm.cess}
                    onChange={(e) => setB2csForm({ ...b2csForm, cess: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Type</label>
                  <select
                    value={b2csForm.type}
                    onChange={(e) => setB2csForm({ ...b2csForm, type: e.target.value })}
                    className="gstr1-field-input"
                  >
                    <option value="OE">OE - Other than E-Commerce</option>
                    <option value="E">E - Supplies made through E-Commerce Operator</option>
                  </select>
                </div>

                {b2csForm.type === 'E' && (
                  <div className="gstr1-field-group">
                    <label className="gstr1-field-label">
                      E-Commerce Operator GSTIN <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 15-digit GSTIN of E-Commerce Operator"
                      maxLength={15}
                      value={b2csForm.ecoGstin}
                      onChange={(e) => setB2csForm({ ...b2csForm, ecoGstin: e.target.value.toUpperCase() })}
                      className="gstr1-field-input"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('b2cs-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 10: 8A, 8B, 8C, 8D - NIL RATED SUPPLIES (Direct Screen) */}
      {/* First image direct aayegi, add record ka option nahi aayega    */}
      {/* ============================================================== */}
      {screen === 'nil-supplies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Nil Rated Supplies' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-back-circle-btn"
                  title="Back to GSTR-1"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">8A, 8B, 8C, 8D - Nil Rated Supplies</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', 'Enter Nil Rated, Exempted (other than nil rated/non GST supply) and Non-GST Supplies for the current tax period.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveNilRated} style={{ padding: '20px 24px 28px 24px' }}>
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '10px 14px', fontSize: '12.5px', color: '#1e40af', marginBottom: '20px' }}>
                <strong>ℹ Note:</strong> Enter supply values under appropriate category. The values entered here will reflect in Table 8 of Form GSTR-1.
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table className="gov-turnover-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#173059', color: '#ffffff' }}>
                      <th style={{ width: '40%', padding: '10px' }}>Nature of Supplies</th>
                      <th style={{ width: '20%', textAlign: 'right', padding: '10px' }}>
                        Nil Rated Supplies (₹)
                      </th>
                      <th style={{ width: '20%', textAlign: 'right', padding: '10px' }}>
                        Exempted (other than nil rated/non GST supply) (₹)
                      </th>
                      <th style={{ width: '20%', textAlign: 'right', padding: '10px' }}>
                        Non-GST Supplies (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1: 8A Inter-State supplies to registered persons */}
                    <tr>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        Inter-State supplies to registered persons
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interRegNil}
                          onChange={(e) => handleNilRatedChange('interRegNil', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interRegExempt}
                          onChange={(e) => handleNilRatedChange('interRegExempt', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interRegNonGst}
                          onChange={(e) => handleNilRatedChange('interRegNonGst', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                    </tr>

                    {/* Row 2: 8B Intra-state supplies to registered persons */}
                    <tr>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        Intrastate supplies to registered persons
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraRegNil}
                          onChange={(e) => handleNilRatedChange('intraRegNil', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraRegExempt}
                          onChange={(e) => handleNilRatedChange('intraRegExempt', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraRegNonGst}
                          onChange={(e) => handleNilRatedChange('intraRegNonGst', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                    </tr>

                    {/* Row 3: 8C Inter-State supplies to unregistered persons */}
                    <tr>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        Inter-State supplies to unregistered persons
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interUnregNil}
                          onChange={(e) => handleNilRatedChange('interUnregNil', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interUnregExempt}
                          onChange={(e) => handleNilRatedChange('interUnregExempt', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.interUnregNonGst}
                          onChange={(e) => handleNilRatedChange('interUnregNonGst', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                    </tr>

                    {/* Row 4: 8D Intra-state supplies to unregistered persons */}
                    <tr>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        Intra-state supplies to unregistered persons
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraUnregNil}
                          onChange={(e) => handleNilRatedChange('intraUnregNil', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraUnregExempt}
                          onChange={(e) => handleNilRatedChange('intraUnregExempt', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nilRatedData.intraUnregNonGst}
                          onChange={(e) => handleNilRatedChange('intraUnregNonGst', e.target.value)}
                          className="gstr1-field-input"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                    </tr>

                    {/* Total Row */}
                    <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                      <td style={{ padding: '10px' }}>Total</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>
                        ₹ {totalNilSupplies.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>
                        ₹ {totalExemptSupplies.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>
                        ₹ {totalNonGstSupplies.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Grand Total of Nil / Exempt / Non-GST Supplies:
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7' }}>
                  ₹ {grandNilRatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleResetNilRated}
                    className="gstr1-btn-back"
                    style={{ borderColor: '#cbd5e1' }}
                  >
                    RESET
                  </button>
                  <button
                    type="submit"
                    className="gstr1-btn-navy"
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 11: 9B - CREDIT / DEBIT NOTES (REGISTERED) SUMMARY      */}
      {/* Sencond me add record ka page fir ye page add record pr        */}
      {/* ============================================================== */}
      {screen === 'cdnr-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNR' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-taxpayer-strip" style={{ borderTop: 'none' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div></div>
              <div>FY - <strong>{fy}</strong></div>
              <div>Tax Period - <strong>{taxPeriod}</strong></div>
              <div>Status - <strong>{returnStatus}</strong></div>
              <div></div>
            </div>

            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                9B - Credit / Debit Notes (Registered)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', '9B - Credit / Debit Notes (Registered) records credit notes, debit notes, or refund vouchers issued to registered recipients.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'CDNR list refreshed.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div className="gstr1-subnav-bar">
              <button type="button" className="gstr1-subnav-tab">
                Recipient wise count
              </button>
            </div>

            <div style={{ padding: '20px 24px 28px 24px' }}>
              {cdnrInvoices.length === 0 ? (
                <div className="gstr1-empty-alert">
                  There are no records to be displayed. Click on 'ADD RECORD' to add Credit or Debit Notes.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Recipient GSTIN</th>
                        <th>Receiver Name</th>
                        <th style={{ textAlign: 'center' }}>Note Type</th>
                        <th>Note No.</th>
                        <th>Note Date</th>
                        <th>Orig. Inv No.</th>
                        <th style={{ textAlign: 'right' }}>Note Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Total Tax (₹)</th>
                        <th>Supply Type</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cdnrInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700, color: '#173059' }}>{inv.recipientGstin}</td>
                          <td>{inv.recipientName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: inv.noteType === 'C' ? '#eff6ff' : inv.noteType === 'D' ? '#fef2f2' : '#f0fdf4',
                              color: inv.noteType === 'C' ? '#1e40af' : inv.noteType === 'D' ? '#991b1b' : '#166534'
                            }}>
                              {inv.noteTypeLabel}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{inv.noteNum}</td>
                          <td>{inv.noteDate}</td>
                          <td>{inv.origInvoiceNum}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            ₹ {inv.noteValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            ₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600, color: '#047857' }}>
                            ₹ {inv.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td>{inv.supplyType}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteCdnrInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('cdnr-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 12: 9B - CREDIT / DEBIT NOTES (REGISTERED) - ADD RECORD */}
      {/* Add Details Form matching official GST Portal screenshot       */}
      {/* ============================================================== */}
      {screen === 'cdnr-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNR', onClick: () => setScreen('cdnr-summary') },
                { label: 'Add Details' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setScreen('cdnr-summary')}
                  className="gstr1-back-circle-btn"
                  title="Back to CDNR Summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="gstr1-header-title">Credit / Debit Notes (Registered) - Add Details</span>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '2px' }}>
                ● Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveCdnrInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              {/* Differential Tax Checkbox */}
              <div style={{ margin: '8px 0 18px 0' }}>
                <label className="gstr1-checkbox-item" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={cdnrForm.diffPercentage}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, diffPercentage: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#1e293b' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '20px' }}>
                {/* Recipient GSTIN/UIN */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Recipient GSTIN/UIN <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 15-digit GSTIN (e.g. 08AABCB1234F1Z5)"
                    maxLength={15}
                    value={cdnrForm.recipientGstin}
                    onChange={(e) => handleCdnrGstinChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* Receiver Name */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Auto-populated on GSTIN"
                    value={cdnrForm.recipientName}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                {/* Debit/Credit Note No */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Debit / Credit Note No. <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Note Number (e.g. CRN/25/001)"
                    maxLength={16}
                    value={cdnrForm.noteNum}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, noteNum: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* Debit/Credit Note Date */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Debit / Credit Note Date <span>*</span>
                  </label>
                  <input
                    type="date"
                    value={cdnrForm.noteDate}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, noteDate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* Original Invoice Number */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Original Invoice Number</label>
                  <input
                    type="text"
                    placeholder="Enter Original Invoice No."
                    maxLength={16}
                    value={cdnrForm.origInvoiceNum}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, origInvoiceNum: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                {/* Original Invoice Date */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Original Invoice Date</label>
                  <input
                    type="date"
                    value={cdnrForm.origInvoiceDate}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, origInvoiceDate: e.target.value })}
                    className="gstr1-field-input"
                  />
                </div>

                {/* Note Type */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Note Type <span>*</span>
                  </label>
                  <select
                    value={cdnrForm.noteType}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, noteType: e.target.value })}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="C">Credit Note</option>
                    <option value="D">Debit Note</option>
                    <option value="R">Refund Voucher</option>
                  </select>
                </div>

                {/* Note Value */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Note Value (₹) <span>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total Note Value"
                    value={cdnrForm.noteValue}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, noteValue: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* Place of Supply */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Place of Supply (POS) <span>*</span>
                  </label>
                  <select
                    value={cdnrForm.pos}
                    onChange={(e) => handleCdnrPosChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="08-Rajasthan">08-Rajasthan</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                    <option value="10-Bihar">10-Bihar</option>
                    <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                    <option value="32-Kerala">32-Kerala</option>
                    <option value="21-Odisha">21-Odisha</option>
                    <option value="01-Jammu and Kashmir">01-Jammu and Kashmir</option>
                    <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                    <option value="04-Chandigarh">04-Chandigarh</option>
                    <option value="05-Uttarakhand">05-Uttarakhand</option>
                    <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                  </select>
                </div>

                {/* Supply Type */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={cdnrForm.supplyType}
                    disabled
                    className="gstr1-field-input"
                  />
                </div>

                {/* Supply Attract Reverse Charge */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Attract Reverse Charge</label>
                  <select
                    value={cdnrForm.reverseCharge}
                    onChange={(e) => setCdnrForm({ ...cdnrForm, reverseCharge: e.target.value })}
                    className="gstr1-field-input"
                  >
                    <option value="N">No</option>
                    <option value="Y">Yes</option>
                  </select>
                </div>

                {/* Applicable % of Tax Rate */}
                {cdnrForm.diffPercentage && (
                  <div className="gstr1-field-group">
                    <label className="gstr1-field-label">
                      Applicable % of Tax Rate <span>*</span>
                    </label>
                    <select
                      value={cdnrForm.applicableRatePercent}
                      onChange={(e) => setCdnrForm({ ...cdnrForm, applicableRatePercent: e.target.value })}
                      className="gstr1-field-input"
                    >
                      <option value="65">65% of normal rate</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Rates and Tax Breakdown Table */}
              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#173059', color: '#ffffff', padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}>
                  Item Details (Rate and Tax Distribution)
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderTop: 'none', padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div className="gstr1-field-group">
                      <label className="gstr1-field-label">
                        Rate (%) <span>*</span>
                      </label>
                      <select
                        value={cdnrForm.rate}
                        onChange={(e) => setCdnrForm({ ...cdnrForm, rate: e.target.value })}
                        className="gstr1-field-input"
                        required
                      >
                        <option value="0">0.0%</option>
                        <option value="0.1">0.10%</option>
                        <option value="0.25">0.25%</option>
                        <option value="1">1.0%</option>
                        <option value="1.5">1.50%</option>
                        <option value="3">3.0%</option>
                        <option value="5">5.0%</option>
                        <option value="6">6.0%</option>
                        <option value="7.5">7.5%</option>
                        <option value="12">12.0%</option>
                        <option value="18">18.0%</option>
                        <option value="28">28.0%</option>
                        <option value="40">40.0%</option>
                      </select>
                    </div>

                    <div className="gstr1-field-group">
                      <label className="gstr1-field-label">
                        Taxable Value (₹) <span>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Taxable Amount"
                        value={cdnrForm.taxableValue}
                        onChange={(e) => setCdnrForm({ ...cdnrForm, taxableValue: e.target.value })}
                        className="gstr1-field-input"
                        required
                      />
                    </div>

                    <div className="gstr1-field-group">
                      <label className="gstr1-field-label">Cess (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={cdnrForm.cess}
                        onChange={(e) => setCdnrForm({ ...cdnrForm, cess: e.target.value })}
                        className="gstr1-field-input"
                      />
                    </div>

                    <div className="gstr1-field-group">
                      <label className="gstr1-field-label">Calculated Tax (₹)</label>
                      <input
                        type="text"
                        disabled
                        value={`₹ ${(
                          ((parseFloat(cdnrForm.taxableValue) || 0) *
                            (parseFloat(cdnrForm.rate) || 18) *
                            (cdnrForm.diffPercentage ? (parseFloat(cdnrForm.applicableRatePercent) / 100 || 0.65) : 1)) /
                          100 + (parseFloat(cdnrForm.cess) || 0)
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                        className="gstr1-field-input"
                        style={{ backgroundColor: '#f8fafc', fontWeight: 700, color: '#047857' }}
                      />
                    </div>
                  </div>

                  {/* Auto Calculated Tax breakdown badges */}
                  <div style={{ display: 'flex', gap: '16px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', fontSize: '12px' }}>
                    {cdnrForm.supplyType === 'Intra-State' ? (
                      <>
                        <div>
                          Central Tax (CGST): <strong>₹ {(
                            ((parseFloat(cdnrForm.taxableValue) || 0) *
                              (parseFloat(cdnrForm.rate) || 18) *
                              (cdnrForm.diffPercentage ? (parseFloat(cdnrForm.applicableRatePercent) / 100 || 0.65) : 1)) /
                            200
                          ).toFixed(2)}</strong>
                        </div>
                        <div>
                          State/UT Tax (SGST): <strong>₹ {(
                            ((parseFloat(cdnrForm.taxableValue) || 0) *
                              (parseFloat(cdnrForm.rate) || 18) *
                              (cdnrForm.diffPercentage ? (parseFloat(cdnrForm.applicableRatePercent) / 100 || 0.65) : 1)) /
                            200
                          ).toFixed(2)}</strong>
                        </div>
                      </>
                    ) : (
                      <div>
                        Integrated Tax (IGST): <strong>₹ {(
                          ((parseFloat(cdnrForm.taxableValue) || 0) *
                            (parseFloat(cdnrForm.rate) || 18) *
                            (cdnrForm.diffPercentage ? (parseFloat(cdnrForm.applicableRatePercent) / 100 || 0.65) : 1)) /
                          100
                        ).toFixed(2)}</strong>
                      </div>
                    )}
                    <div>
                      Cess: <strong>₹ {(parseFloat(cdnrForm.cess) || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('cdnr-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 13: 9B - CREDIT / DEBIT NOTES (UNREGISTERED) - SUMMARY  */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* SCREEN 13: 9B - CREDIT / DEBIT NOTES (UNREGISTERED) SUMMARY    */}
      {/* Matching Image 2: return.gst.gov.in CDNUR Summary               */}
      {/* ============================================================== */}
      {screen === 'cdnur-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNUR' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal" style={{ borderRadius: 0 }}>
              <div className="gstr1-header-title">
                9B - Credit / Debit Notes (Unregistered)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Help', '9B - Credit / Debit Notes (Unregistered) records credit/debit notes or refund vouchers issued to unregistered persons for B2C Large inter-state supplies or exports.')}
                  className="gstr1-header-btn"
                >
                  HELP ❓
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Refreshed', 'CDNUR list refreshed.')}
                  className="gstr1-header-btn"
                  title="Refresh"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {cdnurInvoices.length === 0 ? (
                <div style={{
                  backgroundColor: '#dbeafe',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={16} color="#1d4ed8" />
                    <span>There are no records to be displayed.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info('Alert', 'Information alert dismissed.')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Close"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th style={{ textAlign: 'center' }}>Note Type</th>
                        <th>Debit/Credit Note No.</th>
                        <th>Debit/Credit Note Date</th>
                        <th>POS</th>
                        <th style={{ textAlign: 'right' }}>Note Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>CESS (₹)</th>
                        <th>Supply Type</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cdnurInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700, color: '#173059' }}>{inv.type}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: inv.noteType === 'C' ? '#eff6ff' : inv.noteType === 'D' ? '#fef2f2' : '#f0fdf4',
                              color: inv.noteType === 'C' ? '#1e40af' : inv.noteType === 'D' ? '#991b1b' : '#166534'
                            }}>
                              {inv.noteTypeLabel}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{inv.noteNum}</td>
                          <td>{inv.noteDate}</td>
                          <td>{inv.pos}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            ₹ {inv.noteValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            ₹ {inv.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600, color: '#047857' }}>
                            ₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            ₹ {inv.cess ? inv.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                          </td>
                          <td>{inv.supplyType}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteCdnurInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('cdnur-add')}
                  className="gstr1-btn-navy"
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 14: 9B - CREDIT / DEBIT NOTES (UNREGISTERED) - ADD NOTE */}
      {/* Matching Image 3: Exact fields and layout                       */}
      {/* ============================================================== */}
      {screen === 'cdnur-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNUR', onClick: () => setScreen('cdnur-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 3: Credit/Debit Notes (Unregistered)- Add Note */}
            <div className="gstr1-header-teal" style={{ borderRadius: 0, padding: '12px 20px' }}>
              <span className="gstr1-header-title" style={{ fontSize: '15px', fontWeight: 600 }}>
                Credit/Debit Notes (Unregistered)- Add Note
              </span>
            </div>

            {/* Subrow: Back circle arrow on left, Indicates Mandatory Fields on right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 6px 24px' }}>
              <button
                type="button"
                onClick={() => setScreen('cdnur-summary')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#00838f',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                }}
                title="Back to CDNUR Summary"
              >
                <ArrowLeft size={18} />
              </button>
              <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>*</span> Indicates Mandatory Fields
              </div>
            </div>

            <form onSubmit={handleSaveCdnurInvoice} style={{ padding: '12px 24px 28px 24px' }}>
              {/* Differential Tax Checkbox matching Image 3 */}
              <div style={{ margin: '8px 0 18px 0' }}>
                <label className="gstr1-checkbox-item" style={{ alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cdnurForm.diffPercentage}
                    onChange={(e) => handleCdnurDiffPercentageChange(e.target.checked)}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#1e293b' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>
              </div>

              {/* Applicable % dropdown when differential percentage is checked */}
              {cdnurForm.diffPercentage && (
                <div style={{ marginBottom: '18px', maxWidth: '340px' }}>
                  <label className="gstr1-field-label">
                    Applicable % of Tax Rate <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={cdnurForm.applicableRatePercent}
                    onChange={(e) => handleCdnurDiffPercentageChange(true, e.target.value)}
                    className="gstr1-field-input"
                  >
                    <option value="65">65% of normal rate</option>
                  </select>
                </div>
              )}

              {/* Exact Form Grid matching Image 3 (3 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '18px' }}>
                {/* 1. Type * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Type <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={cdnurForm.type}
                    onChange={(e) => handleCdnurTypeChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="B2CL">B2CL</option>
                    <option value="EXPWP">EXPWP</option>
                    <option value="EXPWOP">EXPWOP</option>
                  </select>
                </div>

                {/* 2. Debit/Credit Note No. * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Debit/Credit Note No. <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={cdnurForm.noteNum}
                    onChange={(e) => setCdnurForm({ ...cdnurForm, noteNum: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* 3. Debit/Credit Note Date * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Debit/Credit Note Date <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    placeholder="DD/MM/YYYY"
                    value={cdnurForm.noteDate}
                    onChange={(e) => setCdnurForm({ ...cdnurForm, noteDate: e.target.value })}
                    className="gstr1-field-input"
                    required
                  />
                </div>

                {/* 4. Note value (₹) * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Note value (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cdnurForm.noteValue}
                    onChange={(e) => setCdnurForm({ ...cdnurForm, noteValue: e.target.value })}
                    className="gstr1-field-input"
                    style={{ textAlign: 'right' }}
                    required
                  />
                </div>

                {/* 5. Note Type * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Note Type <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={cdnurForm.noteType}
                    onChange={(e) => setCdnurForm({ ...cdnurForm, noteType: e.target.value })}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="C">Credit</option>
                    <option value="D">Debit</option>
                    <option value="R">Refund</option>
                  </select>
                </div>

                {/* 6. POS ℹ * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    POS <Info size={13} color="#0284c7" style={{ cursor: 'pointer' }} title="Place of Supply" /> <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={cdnurForm.pos}
                    onChange={(e) => handleCdnurPosChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="">Select</option>
                    {(cdnurForm.type === 'EXPWP' || cdnurForm.type === 'EXPWOP') && (
                      <option value="96-Foreign Country">96-Foreign Country</option>
                    )}
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                    <option value="10-Bihar">10-Bihar</option>
                    <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                    <option value="32-Kerala">32-Kerala</option>
                    <option value="21-Odisha">21-Odisha</option>
                    <option value="01-Jammu and Kashmir">01-Jammu and Kashmir</option>
                    <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                    <option value="04-Chandigarh">04-Chandigarh</option>
                    <option value="05-Uttarakhand">05-Uttarakhand</option>
                    <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                  </select>
                </div>

                {/* 7. Supply type */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply type</label>
                  <input
                    type="text"
                    value={cdnurForm.supplyType || 'Inter-State'}
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#475569' }}
                  />
                </div>
                <div></div>
                <div></div>

                {/* 8. Source */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Source</label>
                  <input
                    type="text"
                    value={cdnurForm.source}
                    disabled
                    placeholder=""
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                {/* 9. IRN */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN</label>
                  <input
                    type="text"
                    value={cdnurForm.irn}
                    disabled
                    placeholder=""
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                {/* 10. IRN date */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">IRN date</label>
                  <input
                    type="text"
                    value={cdnurForm.irnDate}
                    disabled
                    placeholder=""
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Subtitle: Item details matching Image 3 */}
              <div style={{ marginTop: '24px', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>
                  Item details
                </h4>

                <table className="gstr1-b2cl-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ width: '18%' }}>Rate</th>
                      <th rowSpan={2} style={{ width: '30%' }}>Taxable value (₹) *</th>
                      <th colSpan={2} style={{ width: '52%' }}>Amount of tax</th>
                    </tr>
                    <tr>
                      <th style={{ width: '26%' }}>Integrated tax (₹) *</th>
                      <th style={{ width: '26%' }}>CESS (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesList.map((r) => {
                      const data = cdnurForm.ratesData[r.label] || { taxable: '', igst: 0, cess: '' };
                      return (
                        <tr key={r.label}>
                          <td style={{ fontWeight: 600, color: '#1e293b' }}>{r.label}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.taxable}
                              onChange={(e) => handleCdnurRateTaxableChange(r.label, r.rate, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={data.taxable ? data.igst.toFixed(2) : ''}
                              readOnly
                              disabled
                              placeholder="0.00"
                              className="gstr1-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={data.cess}
                              onChange={(e) => handleCdnurRateCessChange(r.label, e.target.value)}
                              className="gstr1-table-input"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="gstr1-action-footer-btns">
                <button
                  type="button"
                  onClick={() => setScreen('cdnur-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-navy"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 15: 11A(1), 11A(2) - TAX LIABILITY (ADVANCES RECEIVED)  */}
      {/* Matching Image 1: return.gst.gov.in advtax/summary              */}
      {/* ============================================================== */}
      {screen === 'at-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Tax Liability (Advances Received)' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 1 */}
            <div className="gstr1-header-teal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gstr1-header-title">11A(1), 11A(2) - Tax Liability (Advances Received)</span>
              <button
                type="button"
                onClick={() => toast.info('Refreshed', 'Tax Liability (Advances Received) records refreshed.')}
                style={{
                  background: '#0d9488',
                  border: '1px solid #14b8a6',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Refresh"
              >
                <RotateCw size={15} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {atInvoices.length === 0 ? (
                <div style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Place of Supply (POS)</th>
                        <th>Supply Type</th>
                        <th style={{ textAlign: 'right' }}>Gross Advance Received (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600 }}>{inv.pos}</td>
                          <td><span className="gstr1-badge-type">{inv.supplyType}</span></td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>₹ {inv.grossAdvance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteAtInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exact action buttons from Image 1 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('at-add')}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  ADD STATE WISE DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 16: 11A(1), 11A(2) - TAX LIABILITY (ADVANCE RECEIVED) - ADD DETAILS */}
      {/* Matching Image 2: return.gst.gov.in advtax/liability/add        */}
      {/* ============================================================== */}
      {screen === 'at-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Tax Liability (Advances Received)', onClick: () => setScreen('at-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 2 */}
            <div className="gstr1-header-teal">
              <span className="gstr1-header-title">Tax Liability (Advance Received) - Add Details</span>
            </div>

            <form onSubmit={handleSaveAtInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              {/* Note text matching Image 2 */}
              <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '6px' }}>
                Note: Declare here the tax liability arising on account of receipt of consideration for which invoices have not been issued in the same tax period.
              </div>

              {/* Mandatory Fields indicator on right matching Image 2 */}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>
                ● Indicates Mandatory Fields
              </div>

              {/* Form Row matching Image 2 (POS and Supply Type) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '18px' }}>
                {/* 1. POS ℹ * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    POS <Info size={13} color="#0284c7" style={{ cursor: 'pointer' }} title="Place of Supply" /> <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={atForm.pos}
                    onChange={(e) => handleAtPosChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="08-Rajasthan">08-Rajasthan</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                    <option value="10-Bihar">10-Bihar</option>
                    <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                    <option value="32-Kerala">32-Kerala</option>
                    <option value="21-Odisha">21-Odisha</option>
                    <option value="01-Jammu and Kashmir">01-Jammu and Kashmir</option>
                    <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                    <option value="04-Chandigarh">04-Chandigarh</option>
                    <option value="05-Uttarakhand">05-Uttarakhand</option>
                    <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                    <option value="18-Assam">18-Assam</option>
                    <option value="30-Goa">30-Goa</option>
                    <option value="20-Jharkhand">20-Jharkhand</option>
                    <option value="22-Chhattisgarh">22-Chhattisgarh</option>
                    <option value="96-Foreign Country">96-Foreign Country</option>
                  </select>
                </div>

                {/* 2. Supply Type (Readonly/Disabled) */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={atForm.supplyType}
                    readOnly
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f3f4f6', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Checkbox for Differential Tax Rate matching Image 2 */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={atForm.diffPercentage}
                    onChange={(e) => handleAtDiffChange(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '13px', color: '#334155' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>

                {atForm.diffPercentage && (
                  <div style={{ marginTop: '12px', maxWidth: '320px' }}>
                    <label className="gstr1-field-label">
                      Applicable % of Tax Rate <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      value={atForm.applicableRatePercent}
                      onChange={(e) => {
                        const newPct = e.target.value;
                        setAtForm((prev) => ({ ...prev, applicableRatePercent: newPct }));
                      }}
                      className="gstr1-field-input"
                    >
                      <option value="65">65</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Rate Table: Displayed when POS is selected */}
              {atForm.pos ? (
                <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: '10px' }}>
                    Item details
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                    <table className="gov-turnover-table" style={{ margin: 0 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0d9488', color: '#ffffff' }}>
                          <th style={{ width: '120px' }}>Rate</th>
                          <th style={{ textAlign: 'right' }}>Gross Advance Received (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                          {atForm.supplyType === 'Intra-State' ? (
                            <>
                              <th style={{ textAlign: 'right' }}>Central tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                              <th style={{ textAlign: 'right' }}>State/UT tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                            </>
                          ) : (
                            <th style={{ textAlign: 'right' }}>Integrated tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                          )}
                          <th style={{ textAlign: 'right', width: '150px' }}>CESS (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratesList.map((r) => {
                          const row = atForm.ratesData[r.label] || { grossAdvance: '', igst: 0, cgst: 0, sgst: 0, cess: '' };
                          return (
                            <tr key={r.label}>
                              <td style={{ fontWeight: 600 }}>{r.label}</td>
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={row.grossAdvance}
                                  onChange={(e) => handleAtRateAdvanceChange(r.label, e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '100%' }}
                                />
                              </td>
                              {atForm.supplyType === 'Intra-State' ? (
                                <>
                                  <td style={{ textAlign: 'right' }}>
                                    <input
                                      type="text"
                                      readOnly
                                      disabled
                                      value={Number(row.cgst || 0).toFixed(2)}
                                      className="gstr1-field-input"
                                      style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                    />
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <input
                                      type="text"
                                      readOnly
                                      disabled
                                      value={Number(row.sgst || 0).toFixed(2)}
                                      className="gstr1-field-input"
                                      style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                    />
                                  </td>
                                </>
                              ) : (
                                <td style={{ textAlign: 'right' }}>
                                  <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={Number(row.igst || 0).toFixed(2)}
                                    className="gstr1-field-input"
                                    style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                  />
                                </td>
                              )}
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={row.cess}
                                  onChange={(e) => handleAtCessChange(r.label, e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '100%' }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px', textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                  Please select Place of Supply (POS) to enter rate-wise tax liability details.
                </div>
              )}

              {/* Exact action buttons from Image 2 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('at-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 17: 11B(1), 11B(2) - ADJUSTMENT OF ADVANCES SUMMARY     */}
      {/* Matching Image 1: return.gst.gov.in txpd/summary               */}
      {/* ============================================================== */}
      {screen === 'adj-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Adjustment of Advances' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 1 */}
            <div className="gstr1-header-teal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gstr1-header-title">11B(1), 11B(2) - Adjustment of Advances</span>
              <button
                type="button"
                onClick={() => toast.info('Refreshed', 'Adjustment of Advances records refreshed.')}
                style={{
                  background: '#0d9488',
                  border: '1px solid #14b8a6',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Refresh"
              >
                <RotateCw size={15} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {adjAdvInvoices.length === 0 ? (
                <div style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>Place of Supply (POS)</th>
                        <th>Supply Type</th>
                        <th style={{ textAlign: 'right' }}>Gross Advance Adjusted (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adjAdvInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600 }}>{inv.pos}</td>
                          <td><span className="gstr1-badge-type">{inv.supplyType}</span></td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>₹ {inv.grossAdjusted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {inv.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteAdjInvoice(inv.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exact action buttons from Image 1 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('adj-add')}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  ADD STATE WISE DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 18: 11B(1), 11B(2) - TAX ALREADY PAID ON INVOICES - ADD DETAILS */}
      {/* Matching Image 2: return.gst.gov.in taxpaid/add                 */}
      {/* ============================================================== */}
      {screen === 'adj-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Adjustment of Advances', onClick: () => setScreen('adj-summary') }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 2 */}
            <div className="gstr1-header-teal">
              <span className="gstr1-header-title">Tax already paid on invoices issued in the current period - Add Details</span>
            </div>

            <form onSubmit={handleSaveAdjInvoice} style={{ padding: '20px 24px 28px 24px' }}>
              {/* Note text matching Image 2 */}
              <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '6px' }}>
                Note: Declare the amount of advance for which tax has already been paid receipt of consideration in an earlier period and invoices issued in the current period for the supplies
              </div>

              {/* Mandatory Fields indicator on right matching Image 2 */}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>
                ● Indicates Mandatory Fields
              </div>

              {/* Form Row matching Image 2 (POS and Supply Type) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '18px' }}>
                {/* 1. POS ℹ * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    POS <Info size={13} color="#0284c7" style={{ cursor: 'pointer' }} title="Place of Supply" /> <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={adjForm.pos}
                    onChange={(e) => handleAdjPosChange(e.target.value)}
                    className="gstr1-field-input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="08-Rajasthan">08-Rajasthan</option>
                    <option value="27-Maharashtra">27-Maharashtra</option>
                    <option value="07-Delhi">07-Delhi</option>
                    <option value="24-Gujarat">24-Gujarat</option>
                    <option value="29-Karnataka">29-Karnataka</option>
                    <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                    <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                    <option value="19-West Bengal">19-West Bengal</option>
                    <option value="06-Haryana">06-Haryana</option>
                    <option value="03-Punjab">03-Punjab</option>
                    <option value="36-Telangana">36-Telangana</option>
                    <option value="10-Bihar">10-Bihar</option>
                    <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                    <option value="32-Kerala">32-Kerala</option>
                    <option value="21-Odisha">21-Odisha</option>
                    <option value="01-Jammu and Kashmir">01-Jammu and Kashmir</option>
                    <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                    <option value="04-Chandigarh">04-Chandigarh</option>
                    <option value="05-Uttarakhand">05-Uttarakhand</option>
                    <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                    <option value="18-Assam">18-Assam</option>
                    <option value="30-Goa">30-Goa</option>
                    <option value="20-Jharkhand">20-Jharkhand</option>
                    <option value="22-Chhattisgarh">22-Chhattisgarh</option>
                    <option value="96-Foreign Country">96-Foreign Country</option>
                  </select>
                </div>

                {/* 2. Supply Type (Readonly/Disabled) */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Supply Type</label>
                  <input
                    type="text"
                    value={adjForm.supplyType}
                    readOnly
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f3f4f6', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Checkbox for Differential Tax Rate matching Image 2 */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adjForm.diffPercentage}
                    onChange={(e) => handleAdjDiffChange(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '13px', color: '#334155' }}>
                    Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
                  </span>
                </label>

                {adjForm.diffPercentage && (
                  <div style={{ marginTop: '12px', maxWidth: '320px' }}>
                    <label className="gstr1-field-label">
                      Applicable % of Tax Rate <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      value={adjForm.applicableRatePercent}
                      onChange={(e) => {
                        const newPct = e.target.value;
                        setAdjForm((prev) => ({ ...prev, applicableRatePercent: newPct }));
                      }}
                      className="gstr1-field-input"
                    >
                      <option value="65">65</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Rate Table: Displayed when POS is selected */}
              {adjForm.pos ? (
                <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: '10px' }}>
                    Item details
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                    <table className="gov-turnover-table" style={{ margin: 0 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0d9488', color: '#ffffff' }}>
                          <th style={{ width: '120px' }}>Rate</th>
                          <th style={{ textAlign: 'right' }}>Gross Advance Adjusted (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                          {adjForm.supplyType === 'Intra-State' ? (
                            <>
                              <th style={{ textAlign: 'right' }}>Central tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                              <th style={{ textAlign: 'right' }}>State/UT tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                            </>
                          ) : (
                            <th style={{ textAlign: 'right' }}>Integrated tax (₹) <span style={{ color: '#fee2e2' }}>*</span></th>
                          )}
                          <th style={{ textAlign: 'right', width: '150px' }}>CESS (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratesList.map((r) => {
                          const row = adjForm.ratesData[r.label] || { grossAdjusted: '', igst: 0, cgst: 0, sgst: 0, cess: '' };
                          return (
                            <tr key={r.label}>
                              <td style={{ fontWeight: 600 }}>{r.label}</td>
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={row.grossAdjusted}
                                  onChange={(e) => handleAdjRateAdvanceChange(r.label, e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '100%' }}
                                />
                              </td>
                              {adjForm.supplyType === 'Intra-State' ? (
                                <>
                                  <td style={{ textAlign: 'right' }}>
                                    <input
                                      type="text"
                                      readOnly
                                      disabled
                                      value={Number(row.cgst || 0).toFixed(2)}
                                      className="gstr1-field-input"
                                      style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                    />
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <input
                                      type="text"
                                      readOnly
                                      disabled
                                      value={Number(row.sgst || 0).toFixed(2)}
                                      className="gstr1-field-input"
                                      style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                    />
                                  </td>
                                </>
                              ) : (
                                <td style={{ textAlign: 'right' }}>
                                  <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={Number(row.igst || 0).toFixed(2)}
                                    className="gstr1-field-input"
                                    style={{ textAlign: 'right', width: '100%', backgroundColor: '#f1f5f9' }}
                                  />
                                </td>
                              )}
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={row.cess}
                                  onChange={(e) => handleAdjCessChange(r.label, e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '100%' }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px', textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                  Please select Place of Supply (POS) to enter rate-wise adjustment details.
                </div>
              )}

              {/* Exact action buttons from Image 2 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('adj-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 19: 12 - HSN-WISE SUMMARY OF OUTWARD SUPPLIES           */}
      {/* Matching User Screenshots 1 - 4 (HSN, HSN-2, HSN-3, HSN-4)     */}
      {/* ============================================================== */}
      {screen === 'hsn-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'HSN' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 1 & 3 */}
            <div className="gstr1-header-teal" style={{ padding: '0 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%' }}>
                <span className="gstr1-header-title">12 - HSN - wise summary of outward supplies</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toast.info('Help', 'HSN-wise summary: Report HSN details of goods and services supplied during the tax period.')}
                    style={{
                      background: '#1b365d',
                      border: '1px solid #1e40af',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>HELP</span>
                    <HelpCircle size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info('Refreshed', 'HSN summary data refreshed.')}
                    style={{
                      background: '#0d9488',
                      border: '1px solid #14b8a6',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Refresh"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              </div>

              {/* Tabs: B2B Supplies / B2C Supplies matching Image 1 & 3 */}
              <div style={{ display: 'flex', gap: '4px', paddingLeft: '20px', backgroundColor: '#0d9488', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <button
                  type="button"
                  onClick={() => setHsnTab('b2b')}
                  style={{
                    background: hsnTab === 'b2b' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: hsnTab === 'b2b' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: hsnTab === 'b2b' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 22px',
                    cursor: 'pointer'
                  }}
                >
                  B2B Supplies
                </button>
                <button
                  type="button"
                  onClick={() => setHsnTab('b2c')}
                  style={{
                    background: hsnTab === 'b2c' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: hsnTab === 'b2c' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: hsnTab === 'b2c' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 22px',
                    cursor: 'pointer'
                  }}
                >
                  B2C Supplies
                </button>
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Mandatory Fields indicator on right */}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#dc2626', fontWeight: 600, marginBottom: '10px' }}>
                ● Indicates Mandatory Fields
              </div>

              {/* Note matching Image 1 & 3 */}
              <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.6', marginBottom: '18px' }}>
                <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Note:</p>
                <p style={{ margin: '0 0 2px 14px' }}>1. Please select HSN from the search results in dropdown only. Manual entry of HSN will not be available.</p>
                <p style={{ margin: '0 0 2px 14px' }}>2. Description cannot be entered manually under &ldquo;Description as per HSN Code&rdquo; field but can be entered manually under &ldquo;Description&rdquo; field.</p>
                <p style={{ margin: '0 0 2px 14px' }}>3. Kindly click on save button after any modification( add, edit) to save the changes</p>
              </div>

              {/* Saved Records or Empty State */}
              {(hsnTab === 'b2b' ? hsnB2bRecords : hsnB2cRecords).length === 0 ? (
                <div style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  There are no saved records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '28px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <table className="gov-turnover-table" style={{ margin: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0d9488', color: '#ffffff' }}>
                        <th>HSN</th>
                        <th>Description</th>
                        <th>Product Name as in Master</th>
                        <th>UQC</th>
                        <th style={{ textAlign: 'right' }}>Total Quantity</th>
                        <th style={{ textAlign: 'right' }}>Total Taxable Value (₹)</th>
                        <th style={{ textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ textAlign: 'right' }}>Integrated Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT Tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(hsnTab === 'b2b' ? hsnB2bRecords : hsnB2cRecords).map((rec) => (
                        <tr key={rec.id}>
                          <td style={{ fontWeight: 700, color: '#0369a1' }}>{rec.hsn}</td>
                          <td>{rec.description || '-'}</td>
                          <td>{rec.productNameMaster || '-'}</td>
                          <td><span className="gstr1-badge-type">{rec.uqc}</span></td>
                          <td style={{ textAlign: 'right' }}>{rec.totalQuantity}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>₹ {rec.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>{rec.rate}%</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteHsnRecord(rec.id, hsnTab)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add/Edit Details section matching Image 1 & 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Add/Edit Details</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => toast.success('HSN Directory', 'CBIC official HSN 4/6/8-digit master code directory downloaded.')}
                    className="gstr1-btn-save"
                    style={{ background: '#1b365d', fontSize: '11px', padding: '6px 14px' }}
                  >
                    DOWNLOAD HSN CODES LIST
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info('HSN Summary', 'No e-invoices data available for current tax period.')}
                    className="gstr1-btn-save"
                    style={{ background: '#1b365d', fontSize: '11px', padding: '6px 14px' }}
                  >
                    DOWNLOAD HSN SUMMARY FROM E-INVOICES
                  </button>
                </div>
              </div>

              {/* Form Input fields matching Image 1 & 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '16px' }}>
                {/* 1. HSN * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    HSN <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={hsnForm.hsn}
                    onChange={(e) => handleHsnCodeChange(e.target.value)}
                    placeholder="Enter Product Name as in Master/HSN Code,"
                    className="gstr1-field-input"
                    list="hsnSuggestionsList"
                  />
                  <datalist id="hsnSuggestionsList">
                    <option value="6109">6109 - T-SHIRTS & SINGLETS, KNITTED</option>
                    <option value="6203">6203 - MEN'S OR BOYS' SUITS & TROUSERS</option>
                    <option value="8471">8471 - COMPUTERS & DATA PROCESSING</option>
                    <option value="8517">8517 - TELEPHONE SETS & SMARTPHONES</option>
                    <option value="1006">1006 - RICE IN HUSK OR HUSKED</option>
                    <option value="3004">3004 - MEDICAMENTS & PHARMACEUTICALS</option>
                    <option value="9983">9983 - PROFESSIONAL & TECHNICAL SERVICES</option>
                    <option value="9984">9984 - TELECOMMUNICATIONS SERVICES</option>
                  </datalist>
                </div>

                {/* 2. Description */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Description</label>
                  <input
                    type="text"
                    value={hsnForm.description}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                {/* 3. Product Name as in My Master */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Product Name as in My Master</label>
                  <input
                    type="text"
                    value={hsnForm.productNameMaster}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, productNameMaster: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Row 2: Description as per HSN Code */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '16px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Description as per HSN Code</label>
                  <input
                    type="text"
                    value={hsnForm.descAsPerHsn}
                    readOnly
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f3f4f6', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Row 3: UQC *, Total Quantity *, Total taxable value (₹) * */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '16px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    UQC <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={hsnForm.uqc}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, uqc: e.target.value }))}
                    className="gstr1-field-input"
                  >
                    <option value="">Select</option>
                    {uqcOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Total Quantity <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.totalQuantity}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, totalQuantity: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Total taxable value (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.taxableValue}
                    onChange={(e) => handleHsnRateOrTaxableChange('taxableValue', e.target.value)}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Row 4: Rate (%) *, Integrated tax (₹) *, Central tax (₹) * */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '16px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Rate (%) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={hsnForm.rate}
                    onChange={(e) => handleHsnRateOrTaxableChange('rate', e.target.value)}
                    className="gstr1-field-input"
                  >
                    <option value="">Select</option>
                    <option value="0">0%</option>
                    <option value="0.1">0.1%</option>
                    <option value="0.25">0.25%</option>
                    <option value="1.5">1.5%</option>
                    <option value="3">3%</option>
                    <option value="5">5%</option>
                    <option value="6">6%</option>
                    <option value="7.5">7.5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Integrated tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.igst}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, igst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Central tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.cgst}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, cgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Row 5: State/UT tax (₹) *, Cess (₹) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    State/UT tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.sgst}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, sgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Cess (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={hsnForm.cess}
                    onChange={(e) => setHsnForm((prev) => ({ ...prev, cess: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Action buttons matching Image 2 & 4 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setHsnForm(initialHsnForm)}
                  className="gstr1-btn-back"
                  style={{ color: '#475569' }}
                >
                  RESET
                </button>
                <button
                  type="button"
                  onClick={handleAddHsnRecord}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  ADD
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('E-Invoices', 'No e-invoices data found for current tax period.')}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  IMPORT HSN DATA FROM E-INVOICES
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Saved', 'HSN-wise summary saved successfully.');
                    setScreen('main');
                  }}
                  className="gstr1-btn-save"
                  style={{ background: '#0d9488' }}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 20: 13 - DOCUMENTS ISSUED DURING THE TAX PERIOD         */}
      {/* Matching User Screenshots 5 - 11 (DOCUMENT_ISSUE to 7)         */}
      {/* ============================================================== */}
      {screen === 'doc-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Documents Issued' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 5 */}
            <div className="gstr1-header-teal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gstr1-header-title">13 - Documents issued during the tax period</span>
              <button
                type="button"
                onClick={() => toast.info('Refreshed', 'Documents data refreshed.')}
                style={{
                  background: '#0d9488',
                  border: '1px solid #14b8a6',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Refresh"
              >
                <RotateCw size={15} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Note matching Image 5 */}
              <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '20px' }}>
                Note: Kindly click on save button after any modification( add, edit, delete) to save the changes
              </div>

              {/* All 12 Document Categories matching Screenshots 5 - 11 */}
              {docCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: '26px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
                    {cat.name}
                  </h4>

                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                    <table className="gov-turnover-table" style={{ margin: 0 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', color: '#1e3a8a' }}>
                          <th style={{ width: '60px' }}>No.</th>
                          <th colSpan={2} style={{ textAlign: 'center' }}>
                            Sr. No. <span style={{ color: '#dc2626' }}>*</span>
                          </th>
                          <th style={{ textAlign: 'right' }}>
                            Total number <span style={{ color: '#dc2626' }}>*</span>
                          </th>
                          <th style={{ textAlign: 'right' }}>
                            Cancelled <span style={{ color: '#dc2626' }}>*</span>
                          </th>
                          <th style={{ textAlign: 'right' }}>
                            Net issued <span style={{ color: '#dc2626' }}>*</span>
                          </th>
                          <th style={{ textAlign: 'center', width: '80px' }}>Action</th>
                        </tr>
                        <tr style={{ backgroundColor: '#f1f5f9', fontSize: '12px' }}>
                          <th></th>
                          <th style={{ textAlign: 'center', width: '130px' }}>From</th>
                          <th style={{ textAlign: 'center', width: '130px' }}>To</th>
                          <th colSpan={4}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.docs.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ padding: 0 }}>
                              <div style={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                padding: '12px 18px',
                                fontSize: '13px'
                              }}>
                                There are no documents to be displayed.
                              </div>
                            </td>
                          </tr>
                        ) : (
                          cat.docs.map((row) => (
                            <tr key={row.id}>
                              <td style={{ fontWeight: 600 }}>{row.no}</td>
                              <td style={{ textAlign: 'center' }}>
                                <input
                                  type="text"
                                  value={row.from}
                                  onChange={(e) => handleUpdateDocRow(cat.id, row.id, 'from', e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'center', width: '110px', padding: '4px 8px', fontSize: '12px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input
                                  type="text"
                                  value={row.to}
                                  onChange={(e) => handleUpdateDocRow(cat.id, row.id, 'to', e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'center', width: '110px', padding: '4px 8px', fontSize: '12px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  value={row.totalNum}
                                  onChange={(e) => handleUpdateDocRow(cat.id, row.id, 'totalNum', e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '90px', padding: '4px 8px', fontSize: '12px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="number"
                                  value={row.cancelled}
                                  onChange={(e) => handleUpdateDocRow(cat.id, row.id, 'cancelled', e.target.value)}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '90px', padding: '4px 8px', fontSize: '12px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <input
                                  type="text"
                                  readOnly
                                  disabled
                                  value={row.netIssued}
                                  className="gstr1-field-input"
                                  style={{ textAlign: 'right', width: '90px', padding: '4px 8px', fontSize: '12px', backgroundColor: '#f1f5f9' }}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocRow(cat.id, row.id)}
                                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Document button under each section matching Images 5 - 11 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleAddDocRow(cat.id)}
                      className="gstr1-btn-save"
                      style={{ background: '#1b365d', fontSize: '11.5px', padding: '6px 14px' }}
                    >
                      ADD DOCUMENT
                    </button>
                  </div>
                </div>
              ))}

              {/* Bottom buttons matching Image 11 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Saved', 'Documents issued during the tax period saved successfully.');
                    setScreen('main');
                  }}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 21: 14 - SUPPLIES MADE THROUGH ECO - SUMMARY            */}
      {/* Matching User Screenshot 12 (SUPPLIER_MAID_ECOMERSE)           */}
      {/* ============================================================== */}
      {screen === 'eco-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Supplies through ECO' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 12 */}
            <div className="gstr1-header-teal" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%' }}>
                <span className="gstr1-header-title">14 - Supplies made through E-Commerce Operators</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toast.info('Help', 'Supplies made through E-Commerce Operators under Section 52 or Section 9(5).')}
                    style={{
                      background: '#1b365d',
                      border: '1px solid #1e40af',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>HELP</span>
                    <HelpCircle size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info('Refreshed', 'ECO supplies data refreshed.')}
                    style={{
                      background: '#0d9488',
                      border: '1px solid #14b8a6',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Refresh"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              </div>

              {/* Tabs matching Image 12 */}
              <div style={{ display: 'flex', gap: '4px', paddingLeft: '20px', backgroundColor: '#0d9488', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <button
                  type="button"
                  onClick={() => setEcoTab('u52')}
                  style={{
                    background: ecoTab === 'u52' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: ecoTab === 'u52' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: ecoTab === 'u52' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 22px',
                    cursor: 'pointer'
                  }}
                >
                  Liable to collect tax u/s 52 (TCS)
                </button>
                <button
                  type="button"
                  onClick={() => setEcoTab('u95')}
                  style={{
                    background: ecoTab === 'u95' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: ecoTab === 'u95' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: ecoTab === 'u95' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 22px',
                    cursor: 'pointer'
                  }}
                >
                  Liable to pay tax u/s 9(5)
                </button>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {(ecoTab === 'u52' ? ecoRecordsU52 : ecoRecordsU95).length === 0 ? (
                <div style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>GSTIN of e-commerce operator</th>
                        <th>Trade/Legal Name</th>
                        <th style={{ textAlign: 'right' }}>Net value of supplies (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(ecoTab === 'u52' ? ecoRecordsU52 : ecoRecordsU95).map((rec) => (
                        <tr key={rec.id}>
                          <td style={{ fontWeight: 600 }}>{rec.ecoGstin}</td>
                          <td>{rec.tradeName || '-'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>₹ {rec.netValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteEcoRecord(rec.id, ecoTab)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exact action buttons matching Image 12 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('eco-add')}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 22: 14 - SUPPLIES MADE THROUGH ECO - ADD DETAILS        */}
      {/* Matching User Screenshot 13 (SUPPLIER_MAID_ECOMERSE-2)         */}
      {/* ============================================================== */}
      {screen === 'eco-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Supplies through ECO', onClick: () => setScreen('eco-summary') },
                { label: ecoTab === 'u52' ? 'U/s 52 (TCS)' : 'U/s 9(5)' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 13 */}
            <div className="gstr1-header-teal">
              <span className="gstr1-header-title">
                14 - Supplies made through E-Commerce Operators - {ecoTab === 'u52' ? 'u/s 52 (TCS)' : 'u/s 9(5)'} - Add Details
              </span>
            </div>

            <form onSubmit={handleSaveEcoRecord} style={{ padding: '20px 24px 28px 24px' }}>
              {/* Mandatory Fields indicator matching Image 13 */}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>
                ● Indicates Mandatory Fields
              </div>

              {/* Row 1 matching Image 13 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '18px' }}>
                {/* 1. GSTIN of e-commerce operator * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    GSTIN of e-commerce operator <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={ecoForm.ecoGstin}
                    onChange={(e) => handleEcoGstinChange(e.target.value)}
                    placeholder="Enter GSTIN"
                    maxLength={15}
                    className="gstr1-field-input"
                    list="ecoGstinList"
                    required
                  />
                  <datalist id="ecoGstinList">
                    <option value="08AAACE1234F1Z1">08AAACE1234F1Z1 - AMAZON SELLER SERVICES</option>
                    <option value="29AABCF9876E1Z9">29AABCF9876E1Z9 - FLIPKART INTERNET</option>
                    <option value="07AABCM5432D1Z4">07AABCM5432D1Z4 - MEESHO PAYMENTS</option>
                  </datalist>
                </div>

                {/* 2. Trade/Legal Name * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Trade/Legal Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={ecoForm.tradeName}
                    readOnly
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f3f4f6', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>

                {/* 3. Net value of supplies (₹) * */}
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Net value of supplies (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ecoForm.netValue}
                    onChange={(e) => setEcoForm((prev) => ({ ...prev, netValue: e.target.value }))}
                    className="gstr1-field-input"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Integrated tax, Central tax, State/UT tax matching Image 13 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '18px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Integrated tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ecoForm.igst}
                    onChange={(e) => setEcoForm((prev) => ({ ...prev, igst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Central tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ecoForm.cgst}
                    onChange={(e) => setEcoForm((prev) => ({ ...prev, cgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    State/UT tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ecoForm.sgst}
                    onChange={(e) => setEcoForm((prev) => ({ ...prev, sgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Row 3: Cess (₹) matching Image 13 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Cess (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={ecoForm.cess}
                    onChange={(e) => setEcoForm((prev) => ({ ...prev, cess: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Bottom buttons matching Image 13 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('eco-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 23: 15 - SUPPLIES U/S 9(5) - SUMMARY                    */}
      {/* Matching User Screenshot 14 (SUPPLIER_US_5f80bb05)             */}
      {/* ============================================================== */}
      {screen === 'sup15-summary' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Supplies U/s 9(5)' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header teal bar matching Image 14 */}
            <div className="gstr1-header-teal" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%' }}>
                <span className="gstr1-header-title">15 - Supplies U/s 9(5)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toast.info('Help', 'Supplies where tax is paid by e-commerce operator under section 9(5) of the CGST Act.')}
                    style={{
                      background: '#1b365d',
                      border: '1px solid #1e40af',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>HELP</span>
                    <HelpCircle size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info('Refreshed', 'Supplies U/s 9(5) data refreshed.')}
                    style={{
                      background: '#0d9488',
                      border: '1px solid #14b8a6',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Refresh"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              </div>

              {/* 4 Tabs matching Image 14 */}
              <div style={{ display: 'flex', gap: '4px', paddingLeft: '20px', backgroundColor: '#0d9488', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <button
                  type="button"
                  onClick={() => setSup15Tab('r2r')}
                  style={{
                    background: sup15Tab === 'r2r' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: sup15Tab === 'r2r' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: sup15Tab === 'r2r' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 18px',
                    cursor: 'pointer'
                  }}
                >
                  Registered to Registered
                </button>
                <button
                  type="button"
                  onClick={() => setSup15Tab('r2u')}
                  style={{
                    background: sup15Tab === 'r2u' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: sup15Tab === 'r2u' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: sup15Tab === 'r2u' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 18px',
                    cursor: 'pointer'
                  }}
                >
                  Registered to Unregistered
                </button>
                <button
                  type="button"
                  onClick={() => setSup15Tab('u2r')}
                  style={{
                    background: sup15Tab === 'u2r' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: sup15Tab === 'u2r' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: sup15Tab === 'u2r' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 18px',
                    cursor: 'pointer'
                  }}
                >
                  Unregistered to Registered
                </button>
                <button
                  type="button"
                  onClick={() => setSup15Tab('u2u')}
                  style={{
                    background: sup15Tab === 'u2u' ? '#0f766e' : 'transparent',
                    border: 'none',
                    borderBottom: sup15Tab === 'u2u' ? '3px solid #1b365d' : '3px solid transparent',
                    color: '#ffffff',
                    fontWeight: sup15Tab === 'u2u' ? 700 : 500,
                    fontSize: '13px',
                    padding: '8px 18px',
                    cursor: 'pointer'
                  }}
                >
                  Unregistered to Unregistered
                </button>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {(sup15Tab === 'r2r' ? sup15R2R : sup15Tab === 'r2u' ? sup15R2U : sup15Tab === 'u2r' ? sup15U2R : sup15U2U).length === 0 ? (
                <div style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  There are no records to be displayed.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table className="gov-turnover-table">
                    <thead>
                      <tr>
                        <th>GSTIN of e-commerce operator</th>
                        <th>Trade/Legal Name</th>
                        <th style={{ textAlign: 'right' }}>Net value of supplies (₹)</th>
                        <th style={{ textAlign: 'right' }}>Integrated tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Central tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>State/UT tax (₹)</th>
                        <th style={{ textAlign: 'right' }}>Cess (₹)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(sup15Tab === 'r2r' ? sup15R2R : sup15Tab === 'r2u' ? sup15R2U : sup15Tab === 'u2r' ? sup15U2R : sup15U2U).map((rec) => (
                        <tr key={rec.id}>
                          <td style={{ fontWeight: 600 }}>{rec.ecoGstin}</td>
                          <td>{rec.tradeName || '-'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>₹ {rec.netValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>₹ {rec.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteSup15Record(rec.id, sup15Tab)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exact action buttons matching Image 14 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('main')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('sup15-add')}
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  ADD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 24: 15 - SUPPLIES U/S 9(5) - ADD DETAILS                */}
      {/* ============================================================== */}
      {screen === 'sup15-add' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Supplies U/s 9(5)', onClick: () => setScreen('sup15-summary') },
                { label: 'Add Details' }
              ]}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🌐 English</span>
          </div>

          <div className="gst-returns-box" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="gstr1-header-teal">
              <span className="gstr1-header-title">15 - Supplies U/s 9(5) - Add Details</span>
            </div>

            <form onSubmit={handleSaveSup15Record} style={{ padding: '20px 24px 28px 24px' }}>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#dc2626', fontWeight: 600, marginBottom: '16px' }}>
                ● Indicates Mandatory Fields
              </div>

              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '18px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    GSTIN of e-commerce operator <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={sup15Form.ecoGstin}
                    onChange={(e) => handleSup15EcoGstinChange(e.target.value)}
                    placeholder="Enter GSTIN"
                    maxLength={15}
                    className="gstr1-field-input"
                    list="sup15GstinList"
                    required
                  />
                  <datalist id="sup15GstinList">
                    <option value="08AAACE1234F1Z1">08AAACE1234F1Z1 - AMAZON SELLER SERVICES</option>
                    <option value="29AABCF9876E1Z9">29AABCF9876E1Z9 - FLIPKART INTERNET</option>
                    <option value="07AABCM5432D1Z4">07AABCM5432D1Z4 - MEESHO PAYMENTS</option>
                    <option value="08AABCT4321A1Z2">08AABCT4321A1Z2 - TATA 1MG</option>
                  </datalist>
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Trade/Legal Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={sup15Form.tradeName}
                    readOnly
                    disabled
                    className="gstr1-field-input"
                    style={{ backgroundColor: '#f3f4f6', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Net value of supplies (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sup15Form.netValue}
                    onChange={(e) => setSup15Form((prev) => ({ ...prev, netValue: e.target.value }))}
                    className="gstr1-field-input"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Integrated tax, Central tax, State/UT tax */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '18px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Integrated tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sup15Form.igst}
                    onChange={(e) => setSup15Form((prev) => ({ ...prev, igst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    Central tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sup15Form.cgst}
                    onChange={(e) => setSup15Form((prev) => ({ ...prev, cgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>

                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">
                    State/UT tax (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sup15Form.sgst}
                    onChange={(e) => setSup15Form((prev) => ({ ...prev, sgst: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Row 3: Cess (₹) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                <div className="gstr1-field-group">
                  <label className="gstr1-field-label">Cess (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sup15Form.cess}
                    onChange={(e) => setSup15Form((prev) => ({ ...prev, cess: e.target.value }))}
                    className="gstr1-field-input"
                  />
                </div>
              </div>

              {/* Bottom buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setScreen('sup15-summary')}
                  className="gstr1-btn-back"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="gstr1-btn-save"
                  style={{ background: '#1b365d' }}
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 23: 9A - AMENDED B2B INVOICES                           */}
      {/* Screenshot: B2B_amendan_invoices_69b01535.png                  */}
      {/* ============================================================== */}
      {screen === 'amend-b2b' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2BA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>9A - Amended B2B Invoices</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search invoice number to amend B2B supplies.')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchB2b({ fy: '2026-27', invoiceNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendB2bRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchB2b.fy}
                  onChange={(e) => setAmendSearchB2b(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Invoice no. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Invoice No"
                  value={amendSearchB2b.invoiceNo}
                  onChange={(e) => setAmendSearchB2b(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendB2b}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendB2bRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended B2B Invoices ({amendB2bRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>FY</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Receiver GSTIN / Name</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendB2bRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.financialYear}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.origInvoiceNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="text"
                                value={editingAmendForm.revisedInvoiceNo || ''}
                                onChange={(e) => setEditingAmendForm(prev => ({ ...prev, revisedInvoiceNo: e.target.value }))}
                                style={{ width: '110px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              />
                            ) : (
                              r.revisedInvoiceNo
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>
                            <div><strong>{r.receiverGstin}</strong></div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{r.receiverName}</div>
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.pos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const isInter = editingAmendForm.pos && !editingAmendForm.pos.startsWith('08');
                                  const totalTax = (val * rt) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2,
                                    invoiceValue: val + totalTax
                                  }));
                                }}
                                style={{ width: '90px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.cgst : r.cgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.sgst : r.sgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('b2b')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('b2b', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={6} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2bRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2bRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2bRecords.reduce((acc, c) => acc + (parseFloat(c.cgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2bRecords.reduce((acc, c) => acc + (parseFloat(c.sgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 24: 9A - AMENDED B2C (LARGE) INVOICES                   */}
      {/* Screenshot: b2c_large_invoice_ddee45aa.png                     */}
      {/* ============================================================== */}
      {screen === 'amend-b2cl' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CLA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>9A - Amended B2C (Large) Invoices</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search invoice number to amend large B2C interstate supplies.')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchB2cl({ fy: '2026-27', invoiceNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendB2clRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchB2cl.fy}
                  onChange={(e) => setAmendSearchB2cl(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Invoice no. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Invoice No"
                  value={amendSearchB2cl.invoiceNo}
                  onChange={(e) => setAmendSearchB2cl(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendB2cl}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendB2clRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended B2C (Large) Invoices ({amendB2clRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>FY</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendB2clRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.financialYear}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.origInvoiceNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="text"
                                value={editingAmendForm.revisedInvoiceNo || ''}
                                onChange={(e) => setEditingAmendForm(prev => ({ ...prev, revisedInvoiceNo: e.target.value }))}
                                style={{ width: '110px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              />
                            ) : (
                              r.revisedInvoiceNo
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.pos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const totalTax = (val * rt) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: totalTax,
                                    invoiceValue: val + totalTax
                                  }));
                                }}
                                style={{ width: '90px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('b2cl')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('b2cl', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={5} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2clRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2clRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 25: 9A - AMENDED EXPORTS INVOICES                       */}
      {/* Screenshot: export_invoices_ee5af609.png                       */}
      {/* ============================================================== */}
      {screen === 'amend-exp' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'EXPA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>9A - Amended Exports Invoices</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchExp({ fy: '2025-26', invoiceNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendExpRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year</label>
                <select
                  value={amendSearchExp.fy}
                  onChange={(e) => setAmendSearchExp(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Invoice no. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Invoice No."
                  value={amendSearchExp.invoiceNo}
                  onChange={(e) => setAmendSearchExp(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendExp}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendExpRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Exports Invoices ({amendExpRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Export Type</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Port Code</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Shipping Bill No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendExpRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.origInvoiceNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="text"
                                value={editingAmendForm.revisedInvoiceNo || ''}
                                onChange={(e) => setEditingAmendForm(prev => ({ ...prev, revisedInvoiceNo: e.target.value }))}
                                style={{ width: '110px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              />
                            ) : (
                              r.revisedInvoiceNo
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.exportType}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.portCode}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.shippingBillNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const totalTax = (val * rt) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: totalTax,
                                    invoiceValue: val + totalTax
                                  }));
                                }}
                                style={{ width: '90px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('exp')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('exp', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={6} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendExpRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendExpRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 26: 9C - AMENDED CREDIT / DEBIT NOTES (REGISTERED)      */}
      {/* Screenshot: amendat_credit___debit_register_bba79d3f.png       */}
      {/* ============================================================== */}
      {screen === 'amend-cdnr' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNRA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>9C - Amended Credit / Debit Notes (Registered)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search Credit/Debit Note No. to amend registered notes.')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchCdnr({ fy: '2026-27', noteNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendCdnrRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} />
                  <span>There are no records to be displayed.</span>
                </div>
                <X size={16} style={{ cursor: 'pointer' }} />
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchCdnr.fy}
                  onChange={(e) => setAmendSearchCdnr(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Credit/Debit Note No. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Credit/Debit Note No."
                  value={amendSearchCdnr.noteNo}
                  onChange={(e) => setAmendSearchCdnr(prev => ({ ...prev, noteNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendCdnr}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendCdnrRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Credit / Debit Notes (Registered) ({amendCdnrRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Receiver GSTIN</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Note No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised Note No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Note Type</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Inv No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendCdnrRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}><strong>{r.receiverGstin}</strong></td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.origNoteNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="text"
                                value={editingAmendForm.revisedNoteNo || ''}
                                onChange={(e) => setEditingAmendForm(prev => ({ ...prev, revisedNoteNo: e.target.value }))}
                                style={{ width: '100px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              />
                            ) : (
                              r.revisedNoteNo
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.noteType}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.origInvoiceNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const isInter = editingAmendForm.pos && !editingAmendForm.pos.startsWith('08');
                                  const totalTax = (val * rt) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2,
                                    noteValue: val + totalTax
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.cgst : r.cgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.sgst : r.sgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('cdnr')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('cdnr', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={6} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnrRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnrRecords.reduce((acc, c) => acc + (parseFloat(c.cgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnrRecords.reduce((acc, c) => acc + (parseFloat(c.sgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnrRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 27: 9C - AMENDED CREDIT/DEBIT NOTES (UNREGISTERED)      */}
      {/* Screenshot: amendat_credit___debit_notes__unregister__5c9f8821.png */}
      {/* ============================================================== */}
      {screen === 'amend-cdnur' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'CDNURA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>9C - Amended Credit/Debit Notes (Unregistered)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search Credit/Debit Note No. to amend unregistered notes.')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchCdnur({ fy: '2026-27', noteNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendCdnurRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} />
                  <span>There are no records to be displayed.</span>
                </div>
                <X size={16} style={{ cursor: 'pointer' }} />
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchCdnur.fy}
                  onChange={(e) => setAmendSearchCdnur(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Credit/Debit Note No. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Credit/Debit Note No."
                  value={amendSearchCdnur.noteNo}
                  onChange={(e) => setAmendSearchCdnur(prev => ({ ...prev, noteNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendCdnur}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendCdnurRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Credit/Debit Notes (Unregistered) ({amendCdnurRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Type</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original Note No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised Note No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Note Type</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendCdnurRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.urType}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.origNoteNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="text"
                                value={editingAmendForm.revisedNoteNo || ''}
                                onChange={(e) => setEditingAmendForm(prev => ({ ...prev, revisedNoteNo: e.target.value }))}
                                style={{ width: '100px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              />
                            ) : (
                              r.revisedNoteNo
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.noteType}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.pos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const totalTax = (val * rt) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: totalTax,
                                    noteValue: val + totalTax
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('cdnur')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('cdnur', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={6} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnurRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendCdnurRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 28: 10 - AMENDED B2C(OTHERS)                            */}
      {/* Screenshot: b2c_others_93bc3d5e.png                            */}
      {/* ============================================================== */}
      {screen === 'amend-b2cs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'B2CSA' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>10 - Amended B2C(Others)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search year, month and original POS to amend B2C Others supplies.')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchB2cs({ year: '2026-27', month: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendB2csRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '12px', lineHeight: 1.6 }}>
              <em>To amend the POS of an already filed record (as reported in table 7 of earlier return period), you are required to use the following steps:</em>
              <div style={{ marginTop: '4px', paddingLeft: '8px' }}>
                <div>1. Search the POS which was originally reported and filed in earlier return period and save with &apos;0&apos; values.</div>
                <div>2. Search the new POS and save the new POS after adding respective details.</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <label className="gstr1-field-label">Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchB2cs.year}
                  onChange={(e) => setAmendSearchB2cs(prev => ({ ...prev, year: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Month <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchB2cs.month}
                  onChange={(e) => setAmendSearchB2cs(prev => ({ ...prev, month: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Original POS <Info size={13} color="#64748b" /> <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={amendSearchB2cs.pos}
                  onChange={(e) => setAmendSearchB2cs(prev => ({ ...prev, pos: e.target.value }))}
                  className="gstr1-field-select"
                >
                  <option value="">Select</option>
                  {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="amendB2csDiffCheck"
                checked={amendSearchB2cs.diffPercentage}
                onChange={(e) => setAmendSearchB2cs(prev => ({ ...prev, diffPercentage: e.target.checked }))}
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <label htmlFor="amendB2csDiffCheck" style={{ cursor: 'pointer' }}>
                Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendB2cs}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendB2csRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended B2C (Others) Supplies ({amendB2csRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Period</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Supply Type</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendB2csRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.month} {r.year}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.origPos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <select
                                value={editingAmendForm.revisedPos || ''}
                                onChange={(e) => {
                                  const p = e.target.value;
                                  const isInter = !p.startsWith('08');
                                  const val = parseFloat(editingAmendForm.taxableValue) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    revisedPos: p,
                                    supplyType: isInter ? 'Inter-State' : 'Intra-State',
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ padding: '2px 4px', fontSize: '11px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              >
                                {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            ) : (
                              r.revisedPos
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{editingAmendId === r.id ? editingAmendForm.supplyType : r.supplyType}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.taxableValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const p = editingAmendForm.revisedPos || r.revisedPos;
                                  const isInter = !p.startsWith('08');
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    taxableValue: val,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.taxableValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.cgst : r.cgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.sgst : r.sgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('b2cs')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('b2cs', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={5} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2csRecords.reduce((acc, c) => acc + (parseFloat(c.taxableValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2csRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2csRecords.reduce((acc, c) => acc + (parseFloat(c.cgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendB2csRecords.reduce((acc, c) => acc + (parseFloat(c.sgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 29: 11A - AMENDED TAX LIABILITY (ADVANCES RECEIVED)     */}
      {/* Screenshot: tax_liability_6c7a305b.png                         */}
      {/* ============================================================== */}
      {screen === 'amend-at' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Amended Tax Liability (Advances Received)' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>11A - Amended Tax Liability (Advances Received)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchAt({ fy: '2026-27', period: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendAtRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchAt.fy}
                  onChange={(e) => setAmendSearchAt(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Return Filing Period <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchAt.period}
                  onChange={(e) => setAmendSearchAt(prev => ({ ...prev, period: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  POS <Info size={13} color="#64748b" /> <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={amendSearchAt.pos}
                  onChange={(e) => setAmendSearchAt(prev => ({ ...prev, pos: e.target.value }))}
                  className="gstr1-field-select"
                >
                  <option value="">Select</option>
                  {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="amendAtDiffCheck"
                checked={amendSearchAt.diffPercentage}
                onChange={(e) => setAmendSearchAt(prev => ({ ...prev, diffPercentage: e.target.checked }))}
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <label htmlFor="amendAtDiffCheck" style={{ cursor: 'pointer' }}>
                Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendAt}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendAtRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Tax Liability (Advances Received) ({amendAtRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Period</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Gross Advance (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendAtRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.period} {r.financialYear}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.origPos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <select
                                value={editingAmendForm.revisedPos || ''}
                                onChange={(e) => {
                                  const p = e.target.value;
                                  const isInter = !p.startsWith('08');
                                  const val = parseFloat(editingAmendForm.grossAdvance) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    revisedPos: p,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ padding: '2px 4px', fontSize: '11px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              >
                                {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            ) : (
                              r.revisedPos
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.grossAdvance || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const p = editingAmendForm.revisedPos || r.revisedPos;
                                  const isInter = !p.startsWith('08');
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    grossAdvance: val,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.grossAdvance).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.cgst : r.cgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.sgst : r.sgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('at')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('at', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={4} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAtRecords.reduce((acc, c) => acc + (parseFloat(c.grossAdvance) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAtRecords.reduce((acc, c) => acc + (parseFloat(c.cgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAtRecords.reduce((acc, c) => acc + (parseFloat(c.sgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAtRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 30: 11B - AMENDMENT OF ADJUSTMENT OF ADVANCES           */}
      {/* Screenshot: adjustment_of_advance_d6714133.png                 */}
      {/* ============================================================== */}
      {screen === 'amend-adj' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Amendment of Adjustment of Advances' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>11B - Amendment of Adjustment of Advances</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchAdj({ fy: '2026-27', period: 'September', pos: '', diffPercentage: false, applicableRatePercent: '65' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendAdjRecords.length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchAdj.fy}
                  onChange={(e) => setAmendSearchAdj(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Return Filing Period <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchAdj.period}
                  onChange={(e) => setAmendSearchAdj(prev => ({ ...prev, period: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  POS <Info size={13} color="#64748b" /> <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={amendSearchAdj.pos}
                  onChange={(e) => setAmendSearchAdj(prev => ({ ...prev, pos: e.target.value }))}
                  className="gstr1-field-select"
                >
                  <option value="">Select</option>
                  {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="amendAdjDiffCheck"
                checked={amendSearchAdj.diffPercentage}
                onChange={(e) => setAmendSearchAdj(prev => ({ ...prev, diffPercentage: e.target.checked }))}
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <label htmlFor="amendAdjDiffCheck" style={{ cursor: 'pointer' }}>
                Is the supply eligible to be taxed at a differential percentage (%) of the existing rate of tax, as notified by the Government?
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendAdj}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendAdjRecords.length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Adjustment of Advances ({amendAdjRecords.length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Period</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Original POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Revised POS</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Gross Adjusted (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendAdjRecords.map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.period} {r.financialYear}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.origPos}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: '#0369a1', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <select
                                value={editingAmendForm.revisedPos || ''}
                                onChange={(e) => {
                                  const p = e.target.value;
                                  const isInter = !p.startsWith('08');
                                  const val = parseFloat(editingAmendForm.grossAdjusted) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    revisedPos: p,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ padding: '2px 4px', fontSize: '11px', border: '1px solid #0369a1', borderRadius: '3px' }}
                              >
                                {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            ) : (
                              r.revisedPos
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.grossAdjusted || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  const p = editingAmendForm.revisedPos || r.revisedPos;
                                  const isInter = !p.startsWith('08');
                                  const factor = editingAmendForm.diffPercentage ? 0.65 : 1;
                                  const totalTax = (val * rt * factor) / 100;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    grossAdjusted: val,
                                    igst: isInter ? totalTax : 0,
                                    cgst: isInter ? 0 : totalTax / 2,
                                    sgst: isInter ? 0 : totalTax / 2
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.grossAdjusted).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.cgst : r.cgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.sgst : r.sgst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('adj')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('adj', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={4} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAdjRecords.reduce((acc, c) => acc + (parseFloat(c.grossAdjusted) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAdjRecords.reduce((acc, c) => acc + (parseFloat(c.cgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAdjRecords.reduce((acc, c) => acc + (parseFloat(c.sgst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendAdjRecords.reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 31: 14A - AMENDED SUPPLIES MADE THROUGH ECO             */}
      {/* Screenshot: suppliar_eco_307df099.png                          */}
      {/* ============================================================== */}
      {screen === 'amend-eco' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Amended Supplies through ECO' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>14A - Amended Supplies made through E-Commerce Operators</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Amend supplies made through e-commerce operators under Section 52 or 9(5).')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchEco({ fy: '2026-27', period: 'September', ecoGstin: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          {/* 2 Tabs matching screenshot */}
          <div style={{ background: '#0d7d71', display: 'flex', borderBottom: '2px solid #0b685e' }}>
            <button
              type="button"
              onClick={() => setAmendEcoTab('u52')}
              style={{
                background: amendEcoTab === 'u52' ? '#ffffff' : 'transparent',
                color: amendEcoTab === 'u52' ? '#0e8a7d' : '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                padding: '10px 20px',
                border: 'none',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Liable to collect tax u/s 52 (TCS)
            </button>
            <button
              type="button"
              onClick={() => setAmendEcoTab('u95')}
              style={{
                background: amendEcoTab === 'u95' ? '#ffffff' : 'transparent',
                color: amendEcoTab === 'u95' ? '#0e8a7d' : '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                padding: '10px 20px',
                border: 'none',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Liable to pay tax u/s 9(5)
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchEco.fy}
                  onChange={(e) => setAmendSearchEco(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Month/Quarter <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchEco.period}
                  onChange={(e) => setAmendSearchEco(prev => ({ ...prev, period: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">GSTIN of e-commerce operator <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter GSTIN of ECO"
                  value={amendSearchEco.ecoGstin}
                  onChange={(e) => setAmendSearchEco(prev => ({ ...prev, ecoGstin: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendEco}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended ECO Supplies ({amendEcoTab === 'u52' ? 'u/s 52 TCS' : 'u/s 9(5)'}) ({amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>GSTIN of ECO</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Trade/Legal Name</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Net Value (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}><strong>{r.ecoGstin}</strong></td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.tradeName}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.netValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    netValue: val,
                                    igst: (val * rt) / 100
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.netValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('eco')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('eco', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={3} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).reduce((acc, c) => acc + (parseFloat(c.netValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendEcoRecords.filter(r => r.ecoTab === amendEcoTab).reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 32: 15A - AMENDED SUPPLIES U/S 9(5)                     */}
      {/* Screenshot: supplier_us_5b4df9c5.png                           */}
      {/* ============================================================== */}
      {screen === 'amend-sup15' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GSTR-1/IFF', onClick: () => setScreen('main') },
                { label: 'Amended Supplies U/s 9(5)' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>15A- Amended Supplies U/s 9(5)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{ background: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => toast.info('Help', 'Search Document No. to amend supplies under section 9(5).')}
              >
                HELP <HelpCircle size={12} />
              </button>
              <button
                type="button"
                style={{ background: '#0d7d71', border: 'none', color: '#ffffff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                onClick={() => {
                  setAmendSearchSup15({ fy: '2026-27', docNo: '' });
                  toast.info('Refreshed', 'Search fields reset.');
                }}
                title="Refresh"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          {/* 4 Tabs matching screenshot */}
          <div style={{ background: '#0d7d71', display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #0b685e' }}>
            {[
              { id: 'r2r', label: 'Registered to Registered' },
              { id: 'r2u', label: 'Registered to Unregistered' },
              { id: 'u2r', label: 'Unregistered to Registered' },
              { id: 'u2u', label: 'Unregistered to Unregistered' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAmendSup15Tab(tab.id)}
                style={{
                  background: amendSup15Tab === tab.id ? '#ffffff' : 'transparent',
                  color: amendSup15Tab === tab.id ? '#0e8a7d' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '10px 16px',
                  border: 'none',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            {amendSup15Records.filter(r => r.tab === amendSup15Tab).length === 0 && (
              <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                There are no records to be displayed.
              </div>
            )}

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <label className="gstr1-field-label">Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={amendSearchSup15.fy}
                  onChange={(e) => setAmendSearchSup15(prev => ({ ...prev, fy: e.target.value }))}
                  className="gstr1-field-select"
                >
                  {fyList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="gstr1-field-label">Document No. <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Document No."
                  value={amendSearchSup15.docNo}
                  onChange={(e) => setAmendSearchSup15(prev => ({ ...prev, docNo: e.target.value }))}
                  className="gstr1-field-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('main')}
                className="gstr1-btn-back"
                style={{ background: '#ffffff', color: '#1b365d', border: '1px solid #1b365d', padding: '8px 24px', fontWeight: 700 }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleSearchAmendSup15}
                className="gstr1-btn-save"
                style={{ background: '#1b365d', color: '#ffffff', padding: '8px 24px', fontWeight: 700 }}
              >
                AMEND RECORD
              </button>
            </div>

            {/* SEPARATE TABLE BELOW ON THE SAME PAGE */}
            {amendSup15Records.filter(r => r.tab === amendSup15Tab).length > 0 && (
              <div style={{ marginTop: '28px', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>
                    Amended Supplies U/s 9(5) ({amendSup15Records.filter(r => r.tab === amendSup15Tab).length})
                  </h4>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#173059', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Sr.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Document No.</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>GSTIN of ECO</th>
                        <th style={{ padding: '8px', border: '1px solid #334155' }}>Trade/Legal Name</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>Net Value (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Rate (%)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'right' }}>IGST (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amendSup15Records.filter(r => r.tab === amendSup15Tab).map((r, idx) => (
                        <tr key={r.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.docNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}><strong>{r.ecoGstin}</strong></td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{r.tradeName}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>
                            {editingAmendId === r.id ? (
                              <input
                                type="number"
                                value={editingAmendForm.netValue || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const rt = parseFloat(editingAmendForm.rate) || 18;
                                  setEditingAmendForm(prev => ({
                                    ...prev,
                                    netValue: val,
                                    igst: (val * rt) / 100
                                  }));
                                }}
                                style={{ width: '85px', padding: '2px 4px', fontSize: '12px', border: '1px solid #0369a1', textAlign: 'right', borderRadius: '3px' }}
                              />
                            ) : (
                              Number(r.netValue).toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{r.rate}%</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{Number(editingAmendId === r.id ? editingAmendForm.igst : r.igst).toFixed(2)}</td>
                          <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {editingAmendId === r.id ? (
                                <button
                                  type="button"
                                  onClick={() => saveEditAmendRecord('sup15')}
                                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  SAVE
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditAmendRecord(r)}
                                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  EDIT
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAmend('sup15', r.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f5f9', fontWeight: 800 }}>
                        <td colSpan={4} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total:</td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendSup15Records.filter(r => r.tab === amendSup15Tab).reduce((acc, c) => acc + (parseFloat(c.netValue) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                        <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>
                          ₹ {amendSup15Records.filter(r => r.tab === amendSup15Tab).reduce((acc, c) => acc + (parseFloat(c.igst) || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Form GSTR-1 Draft Summary Preview"
        size="lg"
      >
        <div style={{ fontSize: '13px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
            <div>Taxpayer: <strong>{tradeName}</strong></div>
            <div>GSTIN: <strong>{gstin}</strong></div>
            <div>Period: <strong>{taxPeriod} {fy}</strong></div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#173059', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Table No</th>
                <th style={{ padding: '8px' }}>Supply Description</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Taxable Value (₹)</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Total Tax (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>4A, 4B</td>
                <td style={{ padding: '8px' }}>B2B Invoices ({b2bInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2bTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2bTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>5</td>
                <td style={{ padding: '8px' }}>B2C (Large) Invoices ({b2clInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2clTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2clIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>6A</td>
                <td style={{ padding: '8px' }}>Exports Invoices ({exportsInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalExpTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalExpIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>7</td>
                <td style={{ padding: '8px' }}>B2C (Others) Supplies ({b2csInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2csTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalB2csTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>8A-8D</td>
                <td style={{ padding: '8px' }}>Nil Rated, Exempted & Non-GST Supplies</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {grandNilRatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ 0.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>9B</td>
                <td style={{ padding: '8px' }}>Credit / Debit Notes (Registered) ({cdnrInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalCdnrTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalCdnrTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>9B (Unreg)</td>
                <td style={{ padding: '8px' }}>Credit / Debit Notes (Unregistered) ({cdnurInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalCdnurTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalCdnurTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>11A(1), 11A(2)</td>
                <td style={{ padding: '8px' }}>Tax Liability (Advances Received) ({atInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalAtTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalAtTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>11B(1), 11B(2)</td>
                <td style={{ padding: '8px' }}>Adjustment of Advances ({adjAdvInvoices.length})</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalAdjTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {totalAdjTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800 }}>
                <td colSpan={2} style={{ padding: '8px' }}>Consolidated Total</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {grandTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>₹ {grandTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                toast.success('Download Complete', 'GSTR-1 Draft Summary PDF generated.');
                setPreviewOpen(false);
              }}
              className="gst-return-action-btn"
              style={{ backgroundColor: '#0284c7' }}
            >
              DOWNLOAD PDF
            </button>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="gst-return-action-btn"
              style={{ backgroundColor: '#64748b' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: FILE RETURN WITH EVC (OTP)                            */}
      {/* ============================================================== */}
      <Modal
        isOpen={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        title="File Form GSTR-1 with EVC / DSC"
        size="md"
      >
        <div>
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '12px', fontSize: '13px', color: '#1e40af', marginBottom: '16px' }}>
            <ShieldCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Authorized Signatory: <strong>{legalName}</strong>
            </label>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Enter One Time Password (OTP) sent to registered mobile/email:
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP (e.g. 123456)"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px', letterSpacing: '2px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setFileModalOpen(false)}
              className="gst-return-action-btn"
              style={{ backgroundColor: '#64748b' }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleConfirmFiling}
              disabled={submitting}
              className="gst-return-action-btn"
              style={{ backgroundColor: '#15803d' }}
            >
              {submitting ? 'VERIFYING...' : 'VERIFY & FILE'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
