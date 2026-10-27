// Taxpayer, Application, and Return Datasets for GST Tax Services & Compliance Portal

export const SAMPLE_TAXPAYERS = [
  {
    gstin: '27AABCS1429B1Z8',
    pan: 'AABCS1429B',
    legalName: 'Samyak Infotech Solutions Pvt Ltd',
    tradeName: 'Samyak Tech Enterprises',
    taxpayerType: 'Regular',
    constitution: 'Private Limited Company',
    status: 'Active',
    registrationDate: '12-Jul-2017',
    state: 'Maharashtra',
    stateCode: '27',
    district: 'Mumbai Suburban',
    pincode: '400069',
    complianceRating: '10/10'
  },
  {
    gstin: '07AAACG9821K1Z2',
    pan: 'AAACG9821K',
    legalName: 'Apex Global Logistics LLP',
    tradeName: 'Apex Freight Express',
    taxpayerType: 'Regular',
    constitution: 'Limited Liability Partnership',
    status: 'Active',
    registrationDate: '18-Aug-2018',
    state: 'Delhi',
    stateCode: '07',
    district: 'New Delhi',
    pincode: '110001',
    complianceRating: '9.8/10'
  },
  {
    gstin: '24AAECB8832L1Z4',
    pan: 'AAECB8832L',
    legalName: 'Bharat Electronics & Hardware Ltd',
    tradeName: 'Bharat Infra Components',
    taxpayerType: 'Regular',
    constitution: 'Public Limited Company',
    status: 'Active',
    registrationDate: '01-Jul-2017',
    state: 'Gujarat',
    stateCode: '24',
    district: 'Ahmedabad',
    pincode: '380015',
    complianceRating: '10/10'
  },
  {
    gstin: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    legalName: 'Kaveri Textiles & Crafts',
    tradeName: 'Kaveri Handlooms',
    taxpayerType: 'Composition',
    constitution: 'Partnership',
    status: 'Active',
    registrationDate: '14-Sep-2019',
    state: 'Karnataka',
    stateCode: '29',
    district: 'Bengaluru Urban',
    pincode: '560001',
    complianceRating: '9.5/10'
  },
  {
    gstin: '33AABCT9982H1Z1',
    pan: 'AABCT9982H',
    legalName: 'Tamil Nadu Chemical Processors Inc',
    tradeName: 'ChemTech Southern',
    taxpayerType: 'Regular',
    constitution: 'Private Limited Company',
    status: 'Suspended (Clarification Pending)',
    registrationDate: '05-May-2020',
    state: 'Tamil Nadu',
    stateCode: '33',
    district: 'Chennai',
    pincode: '600028',
    complianceRating: '7.2/10'
  }
];

export const SAMPLE_APPLICATIONS = [
  {
    arn: 'AA2709240019284',
    formType: 'REG-01',
    description: 'New GST Registration Application',
    applicantName: 'Samyak Infotech Solutions Pvt Ltd',
    pan: 'AABCS1429B',
    submissionDate: '24-Sep-2024',
    status: 'Approved',
    assignedOfficer: 'Jurisdictional Officer Range-IV, Mumbai',
    remarks: 'Registration approved and certificate issued digitally.',
    stages: [
      { title: 'Application Submitted Online', date: '24-Sep-2024 11:20 AM', done: true },
      { title: 'Aadhaar Authentication Verified', date: '24-Sep-2024 11:35 AM', done: true },
      { title: 'Under Processing / Jurisdictional Review', date: '25-Sep-2024 02:15 PM', done: true },
      { title: 'Clarification Not Required', date: '26-Sep-2024 10:00 AM', done: true },
      { title: 'Registration Certificate Issued', date: '27-Sep-2024 04:30 PM', done: true }
    ]
  },
  {
    arn: 'AA2709240024810',
    formType: 'REG-14',
    description: 'Amendment of Core Fields in Registration',
    applicantName: 'Samyak Infotech Solutions Pvt Ltd',
    pan: 'AABCS1429B',
    submissionDate: '15-Jan-2025',
    status: 'Under Verification',
    assignedOfficer: 'Superintendent Audit Circle-II',
    remarks: 'Document review in progress for additional place of business.',
    stages: [
      { title: 'Amendment Filed Online', date: '15-Jan-2025 03:40 PM', done: true },
      { title: 'Officer Assigned', date: '16-Jan-2025 09:30 AM', done: true },
      { title: 'Verification of Address Electricity Bill', date: '18-Jan-2025 11:00 AM', done: false },
      { title: 'Final Order', date: 'Pending', done: false }
    ]
  },
  {
    arn: 'AA2709240031950',
    formType: 'RFD-01',
    description: 'Application for Refund of Excess Balance in Cash Ledger',
    applicantName: 'Samyak Infotech Solutions Pvt Ltd',
    pan: 'AABCS1429B',
    submissionDate: '02-Feb-2025',
    status: 'Clarification Required',
    assignedOfficer: 'Deputy Commissioner Ward-12',
    remarks: 'Please furnish explanation regarding inverted duty calculation sheet.',
    stages: [
      { title: 'Refund Application Submitted', date: '02-Feb-2025 10:00 AM', done: true },
      { title: 'Acknowledgment Issued (RFD-02)', date: '04-Feb-2025 04:00 PM', done: true },
      { title: 'Deficiency Memo / Clarification Notice (RFD-08)', date: '08-Feb-2025 02:30 PM', done: true },
      { title: 'Taxpayer Reply (RFD-09)', date: 'Awaiting submission', done: false },
      { title: 'Sanction Order (RFD-06)', date: 'Pending', done: false }
    ]
  }
];

export const SAMPLE_RETURNS = [
  {
    id: 'ret-1',
    returnType: 'GSTR-1',
    taxPeriod: 'December 2024',
    dueDate: '11-Jan-2025',
    filingDate: '10-Jan-2025',
    status: 'Filed',
    arn: 'AA2712240981723',
    taxableValue: 4850000,
    cgst: 436500,
    sgst: 436500,
    igst: 185000,
    totalTax: 1058000,
    mode: 'E-Sign OTP'
  },
  {
    id: 'ret-2',
    returnType: 'GSTR-3B',
    taxPeriod: 'December 2024',
    dueDate: '20-Jan-2025',
    filingDate: '19-Jan-2025',
    status: 'Filed',
    arn: 'AA2712240994119',
    taxableValue: 4850000,
    cgst: 436500,
    sgst: 436500,
    igst: 185000,
    totalTax: 1058000,
    mode: 'E-Sign OTP'
  },
  {
    id: 'ret-3',
    returnType: 'GSTR-1',
    taxPeriod: 'January 2025',
    dueDate: '11-Feb-2025',
    filingDate: '09-Feb-2025',
    status: 'Filed',
    arn: 'AA2701250102938',
    taxableValue: 5200000,
    cgst: 468000,
    sgst: 468000,
    igst: 210000,
    totalTax: 1146000,
    mode: 'Digital Signature (DSC)'
  },
  {
    id: 'ret-4',
    returnType: 'GSTR-3B',
    taxPeriod: 'January 2025',
    dueDate: '20-Feb-2025',
    filingDate: '18-Feb-2025',
    status: 'Filed',
    arn: 'AA2701250119284',
    taxableValue: 5200000,
    cgst: 468000,
    sgst: 468000,
    igst: 210000,
    totalTax: 1146000,
    mode: 'Digital Signature (DSC)'
  },
  {
    id: 'ret-5',
    returnType: 'GSTR-1',
    taxPeriod: 'February 2025',
    dueDate: '11-Mar-2025',
    filingDate: null,
    status: 'Ready to File',
    arn: null,
    taxableValue: 3950000,
    cgst: 355500,
    sgst: 355500,
    igst: 145000,
    totalTax: 856000,
    mode: null
  },
  {
    id: 'ret-6',
    returnType: 'GSTR-3B',
    taxPeriod: 'February 2025',
    dueDate: '20-Mar-2025',
    filingDate: null,
    status: 'Draft Saved',
    arn: null,
    taxableValue: 3950000,
    cgst: 355500,
    sgst: 355500,
    igst: 145000,
    totalTax: 856000,
    mode: null
  }
];

export const SAMPLE_INVOICES = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'INV/24-25/0842',
    date: '14-Feb-2025',
    customerName: 'Tata Consultancy & Infra Works Ltd',
    customerGstin: '27AABCT2394K1Z9',
    billingAddress: 'Nariman Point, Marine Drive, Mumbai 400021',
    items: [
      { name: 'Enterprise Cloud ERP Consulting', hsn: '998314', qty: 1, rate: 350000, discount: 0, taxRate: 18 }
    ],
    taxableAmount: 350000,
    cgst: 31500,
    sgst: 31500,
    igst: 0,
    totalAmount: 413000,
    status: 'Paid',
    type: 'B2B'
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'INV/24-25/0843',
    date: '18-Feb-2025',
    customerName: 'Infosys BPM Technologies',
    customerGstin: '29AAACI4749Q1ZM',
    billingAddress: 'Electronic City, Phase 1, Bengaluru 560100',
    items: [
      { name: 'Custom AI Automation License', hsn: '998315', qty: 1, rate: 500000, discount: 25000, taxRate: 18 }
    ],
    taxableAmount: 475000,
    cgst: 0,
    sgst: 0,
    igst: 85500,
    totalAmount: 560500,
    status: 'Pending',
    type: 'B2B'
  },
  {
    id: 'INV-2024-003',
    invoiceNumber: 'INV/24-25/0844',
    date: '22-Feb-2025',
    customerName: 'Reliance Retail Ventures',
    customerGstin: '27AABCR0412R1Z6',
    billingAddress: 'Maker Chambers IV, Nariman Point, Mumbai 400021',
    items: [
      { name: 'Hardware Servers & Rack Integration', hsn: '847150', qty: 2, rate: 180000, discount: 10000, taxRate: 18 }
    ],
    taxableAmount: 350000,
    cgst: 31500,
    sgst: 31500,
    igst: 0,
    totalAmount: 413000,
    status: 'Paid',
    type: 'B2B'
  },
  {
    id: 'INV-2024-004',
    invoiceNumber: 'INV/24-25/0845',
    date: '26-Feb-2025',
    customerName: 'Aaditya Digital Systems',
    customerGstin: '07AAACA4512N1Z4',
    billingAddress: 'Barakhamba Road, Connaught Place, New Delhi 110001',
    items: [
      { name: 'Cybersecurity Threat Audit', hsn: '998313', qty: 1, rate: 220000, discount: 0, taxRate: 18 }
    ],
    taxableAmount: 220000,
    cgst: 0,
    sgst: 0,
    igst: 39600,
    totalAmount: 259600,
    status: 'Paid',
    type: 'B2B'
  }
];

export const SAMPLE_CHALLANS = [
  {
    cpin: '25022700142984',
    cin: 'SBIN25022700142984',
    createdDate: '18-Feb-2025',
    paidDate: '18-Feb-2025',
    bank: 'State Bank of India',
    paymentMode: 'Net Banking (NEFT/RTGS)',
    tax: 936000,
    interest: 0,
    penalty: 0,
    fees: 0,
    other: 0,
    totalAmount: 936000,
    status: 'Paid / Credited to Cash Ledger'
  },
  {
    cpin: '25011900827361',
    cin: 'HDFC25011900827361',
    createdDate: '19-Jan-2025',
    paidDate: '19-Jan-2025',
    bank: 'HDFC Bank',
    paymentMode: 'Over The Counter (OTC)',
    tax: 873000,
    interest: 0,
    penalty: 0,
    fees: 0,
    other: 0,
    totalAmount: 873000,
    status: 'Paid / Credited to Cash Ledger'
  },
  {
    cpin: '25030100918234',
    cin: null,
    createdDate: '01-Mar-2025',
    paidDate: null,
    bank: 'ICICI Bank',
    paymentMode: 'UPI / Immediate Payment',
    tax: 154000,
    interest: 0,
    penalty: 0,
    fees: 0,
    other: 0,
    totalAmount: 154000,
    status: 'Pending Payment'
  }
];

export const SAMPLE_NOTICES = [
  {
    id: 'NOT-2025-081',
    noticeNumber: 'GST/27/AC/SCN/2025/081',
    section: 'Section 73(1)',
    date: '10-Feb-2025',
    subject: 'Show Cause Notice regarding ITC discrepancy in GSTR-2B vs GSTR-3B for FY 2023-24',
    issuingAuthority: 'Assistant Commissioner of State Tax, Circle-3, Mumbai',
    dueDate: '25-Mar-2025',
    status: 'New',
    amountInvolved: 42500,
    details: 'During reconciliation of Form GSTR-2B with Form GSTR-3B filed for the financial year 2023-24, it is noticed that excess Input Tax Credit of Rs. 42,500 has been claimed under Section 16(2)(aa).'
  },
  {
    id: 'NOT-2024-219',
    noticeNumber: 'GST/27/DC/DRC-01/2024/219',
    section: 'Rule 88C',
    date: '12-Nov-2024',
    subject: 'Intimation of difference in liability reported in GSTR-1 and paid in GSTR-3B',
    issuingAuthority: 'GST Portal Automated Compliance System',
    dueDate: '20-Nov-2024',
    status: 'Replied',
    amountInvolved: 18200,
    details: 'Difference observed between outward supplies declared in GSTR-1 and tax liability paid in GSTR-3B for the month of October 2024. Taxpayer submitted DRC-01B clarification with revised invoice schedule.'
  },
  {
    id: 'NOT-2024-045',
    noticeNumber: 'GST/27/AUD/2024/045',
    section: 'Section 65',
    date: '05-Jul-2024',
    subject: 'Notice for Departmental Audit of books and accounts',
    issuingAuthority: 'Joint Commissioner (Audit), Zone-II, Maharashtra',
    dueDate: '05-Aug-2024',
    status: 'Closed',
    amountInvolved: 0,
    details: 'Departmental audit finalized under Section 65(6). Audit report issued in Form GST ADT-02 with NIL demand.'
  }
];

export const SAMPLE_LEDGER_ENTRIES = [
  {
    date: '19-Feb-2025',
    ref: 'PMT-06 (CIN: SBIN25022700142984)',
    description: 'Challan Payment deposited into Electronic Cash Ledger',
    type: 'Credit',
    cgst: 468000,
    sgst: 468000,
    igst: 0,
    total: 936000,
    balance: 984520
  },
  {
    date: '19-Feb-2025',
    ref: 'GSTR-3B Jan 2025 (ARN: AA2701250119284)',
    description: 'Tax liability discharged through Electronic Cash & Credit Ledgers',
    type: 'Debit',
    cgst: 468000,
    sgst: 468000,
    igst: 210000,
    total: 1146000,
    balance: 48520
  },
  {
    date: '10-Feb-2025',
    ref: 'GSTR-2B Auto-Drafted',
    description: 'Input Tax Credit auto-credited from inward suppliers',
    type: 'Credit',
    cgst: 68400,
    sgst: 68400,
    igst: 104500,
    total: 241300,
    balance: 142850
  }
];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'important',
    title: 'GSTR-1 Due Date Approaching',
    message: 'Form GSTR-1 for February 2025 is due on 11-Mar-2025. Please review B2B invoices and save summary.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'Payment Credited Successfully',
    message: 'Challan CPIN 25022700142984 of Rs. 9,36,000 has been credited to your Electronic Cash Ledger.',
    time: 'Yesterday',
    read: false
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'Notice DRC-01A Pending Action',
    message: 'Notice GST/27/AC/SCN/2025/081 requires response before 25-Mar-2025.',
    time: '3 days ago',
    read: true
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'GSTR-2B Generated for Current Period',
    message: 'Your Input Tax Credit statement in Form GSTR-2B has been generated and is ready for reconciliation.',
    time: '5 days ago',
    read: true
  }
];

export const FAQ_LIST = [
  {
    category: 'Registration',
    question: 'Who is required to register for GST in India?',
    answer: 'Any business whose aggregate turnover exceeds Rs. 40 Lakhs for goods (Rs. 20 Lakhs for Special Category States) or Rs. 20 Lakhs for services (Rs. 10 Lakhs for Special Category States) in a financial year must register. Casual taxable persons and non-resident taxable persons must register irrespective of turnover threshold.'
  },
  {
    category: 'Registration',
    question: 'What is an Application Reference Number (ARN)?',
    answer: 'An Application Reference Number (ARN) is a unique 15-digit alphanumeric identifier assigned immediately upon successful online submission of an application (such as new registration, amendment, or refund) on the GST Portal.'
  },
  {
    category: 'Returns',
    question: 'What is the distinction between GSTR-1 and GSTR-3B?',
    answer: 'GSTR-1 is a monthly or quarterly statement of outward supplies (sales) containing invoice-level details for B2B, B2C, credit/debit notes, and exports. GSTR-3B is a self-declared monthly summary return showing aggregate outward tax liability, input tax credit claimed, and net tax paid via cash and credit ledgers.'
  },
  {
    category: 'Returns',
    question: 'Can a filed GST return be revised?',
    answer: 'Under GST law, returns once filed cannot be revised. However, any omission or incorrect particulars reported in a return can be rectified in the subsequent period’s return, subject to the prescribed statutory deadlines under Section 39(9).'
  },
  {
    category: 'Payments',
    question: 'What is a CPIN and CIN in GST payment?',
    answer: 'CPIN (Common Portal Identification Number) is a 14-digit temporary number generated when a payment challan (PMT-06) is created. CIN (Challan Identification Number) is generated by the receiving bank after successful realization of payment and confirms credit to the Government cash ledger.'
  },
  {
    category: 'ITC',
    question: 'What is the significance of Form GSTR-2B?',
    answer: 'GSTR-2B is a static auto-drafted ITC statement generated on the 14th of every month for the previous month. It determines the maximum eligible Input Tax Credit that a taxpayer can claim in Form GSTR-3B under Section 16(2)(aa).'
  },
  {
    category: 'Invoices',
    question: 'What are the mandatory fields on a GST Tax Invoice?',
    answer: 'A valid GST Tax Invoice must include Supplier and Customer Name, Address & GSTIN, Consecutive Serial Number, Date of Issue, HSN Code, Description of Goods/Services, Quantity, Taxable Value, Applicable Tax Rates (CGST, SGST, IGST), and Signature/Digital Signature.'
  }
];

export const SAMPLE_REFUNDS = [
  {
    id: 'RFD-2025-001',
    rfdNumber: 'RFD2702250014298',
    type: 'Refund of unutilized ITC on account of exports without payment of tax',
    amount: 145000,
    claimPeriod: 'Q3 (Oct-Dec 2024)',
    reason: 'Zero-rated supply export of IT automation consulting services without tax payment',
    filingDate: '15-Jan-2025',
    status: 'Sanctioned / Credited',
    bankAccount: 'State Bank of India (A/C: *******9481)'
  },
  {
    id: 'RFD-2025-002',
    rfdNumber: 'RFD2702250089123',
    type: 'Refund of excess balance in Electronic Cash Ledger',
    amount: 52000,
    claimPeriod: 'January 2025',
    reason: 'Excess advance tax deposited through challan CPIN 25011900827361',
    filingDate: '02-Feb-2025',
    status: 'Under Verification by Jurisdictional Officer',
    bankAccount: 'HDFC Bank Ltd (A/C: *******3190)'
  }
];

