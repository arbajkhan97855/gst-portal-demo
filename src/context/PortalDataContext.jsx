import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SAMPLE_TAXPAYERS,
  SAMPLE_APPLICATIONS,
  SAMPLE_RETURNS,
  SAMPLE_INVOICES,
  SAMPLE_CHALLANS,
  SAMPLE_REFUNDS,
  SAMPLE_NOTICES,
  SAMPLE_LEDGER_ENTRIES
} from '../data/portalData';

const PortalDataContext = createContext(null);

// LocalStorage Helper with fallback
const getInitialData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  // Store fallback into localStorage if not set
  try {
    localStorage.setItem(key, JSON.stringify(fallback));
  } catch (e) {
    // ignore
  }
  return fallback;
};

export const PortalDataProvider = ({ children }) => {
  // 1. Invoices
  const [invoices, setInvoices] = useState(() =>
    getInitialData('gst_portal_invoices', SAMPLE_INVOICES)
  );

  // 2. Returns
  const [returns, setReturns] = useState(() =>
    getInitialData('gst_portal_returns', SAMPLE_RETURNS)
  );

  // 3. Challans / Payments
  const [challans, setChallans] = useState(() =>
    getInitialData('gst_portal_challans', SAMPLE_CHALLANS)
  );

  // 4. Saved Draft Challans
  const [savedChallans, setSavedChallans] = useState(() =>
    getInitialData('gst_portal_saved_challans', [
      {
        id: 'DRAFT-01',
        cpin: '26042700812944',
        createdDate: '18/04/2026',
        expiryDate: '03/05/2026',
        cgst: 18000,
        sgst: 18000,
        igst: 0,
        cess: 0,
        totalAmount: 36000,
        reason: 'Monthly GSTR-3B Tax Liability',
        status: 'Valid'
      },
      {
        id: 'DRAFT-02',
        cpin: '26042700945120',
        createdDate: '15/04/2026',
        expiryDate: '30/04/2026',
        cgst: 0,
        sgst: 0,
        igst: 24000,
        cess: 0,
        totalAmount: 24000,
        reason: 'Inter-state Reverse Charge (RCM)',
        status: 'Valid'
      }
    ])
  );

  // 5. Applications (Registration, Amendments, etc.)
  const [applications, setApplications] = useState(() =>
    getInitialData('gst_portal_applications', SAMPLE_APPLICATIONS)
  );

  // 6. Refunds
  const [refunds, setRefunds] = useState(() =>
    getInitialData('gst_portal_refunds', SAMPLE_REFUNDS)
  );

  // 7. Taxpayers Directory
  const [taxpayers, setTaxpayers] = useState(() =>
    getInitialData('gst_portal_taxpayers', SAMPLE_TAXPAYERS)
  );

  // 8. Notices
  const [notices, setNotices] = useState(() =>
    getInitialData('gst_portal_notices', SAMPLE_NOTICES)
  );

  // 9. Ledger Entries
  const [ledgerEntries, setLedgerEntries] = useState(() =>
    getInitialData('gst_portal_ledgers', SAMPLE_LEDGER_ENTRIES)
  );

  const isSyncing = false;

  // Sync to localStorage whenever any state changes
  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_invoices', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_returns', JSON.stringify(returns));
    } catch (e) {}
  }, [returns]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_challans', JSON.stringify(challans));
    } catch (e) {}
  }, [challans]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_saved_challans', JSON.stringify(savedChallans));
    } catch (e) {}
  }, [savedChallans]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_applications', JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_refunds', JSON.stringify(refunds));
    } catch (e) {}
  }, [refunds]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_taxpayers', JSON.stringify(taxpayers));
    } catch (e) {}
  }, [taxpayers]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_notices', JSON.stringify(notices));
    } catch (e) {}
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem('gst_portal_ledgers', JSON.stringify(ledgerEntries));
    } catch (e) {}
  }, [ledgerEntries]);

  // Synchronize across browser tabs/windows if modified elsewhere
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (!e.newValue) return;
        const val = JSON.parse(e.newValue);
        if (e.key === 'gst_portal_invoices') setInvoices(val);
        if (e.key === 'gst_portal_returns') setReturns(val);
        if (e.key === 'gst_portal_challans') setChallans(val);
        if (e.key === 'gst_portal_saved_challans') setSavedChallans(val);
        if (e.key === 'gst_portal_applications') setApplications(val);
        if (e.key === 'gst_portal_refunds') setRefunds(val);
        if (e.key === 'gst_portal_taxpayers') setTaxpayers(val);
        if (e.key === 'gst_portal_notices') setNotices(val);
        if (e.key === 'gst_portal_ledgers') setLedgerEntries(val);
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ================= INVOICE OPERATIONS (ADD, EDIT, DELETE) =================
  const addInvoice = (invoiceData) => {
    const cleanId = String(invoiceData.invoiceNumber || `INV_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '_');
    const newInvoice = {
      ...invoiceData,
      id: invoiceData.id || cleanId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return { success: true, id: newInvoice.id };
  };

  const updateInvoice = (id, updatedFields) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id || inv.invoiceNumber === id
          ? { ...inv, ...updatedFields, updatedAt: new Date().toISOString() }
          : inv
      )
    );
    return { success: true };
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id && inv.invoiceNumber !== id));
    return { success: true };
  };

  const getInvoice = (id) => {
    return invoices.find(inv => inv.id === id || inv.invoiceNumber === id) || null;
  };

  // ================= RETURNS OPERATIONS (FILE, EDIT, DELETE) =================
  const fileReturnRecord = (returnData) => {
    const cleanId = String(returnData.arn || `RET_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '_');
    const newRecord = {
      ...returnData,
      id: returnData.id || cleanId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReturns(prev => {
      // If return already exists with same returnType and period/taxPeriod, update it
      const existingIdx = prev.findIndex(r =>
        (r.returnType === returnData.returnType && r.period === returnData.period) ||
        r.arn === returnData.arn
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...newRecord };
        return copy;
      }
      return [newRecord, ...prev];
    });
    return { success: true, id: newRecord.id };
  };

  const updateReturnRecord = (id, updatedFields) => {
    setReturns(prev =>
      prev.map(r => (r.id === id || r.arn === id ? { ...r, ...updatedFields } : r))
    );
    return { success: true };
  };

  const deleteReturnRecord = (id) => {
    setReturns(prev => prev.filter(r => r.id !== id && r.arn !== id));
    return { success: true };
  };

  // ================= CHALLANS / PAYMENTS (ADD, EDIT, DELETE) =================
  const addChallan = (challanData) => {
    const cleanId = String(challanData.cpin || `CPIN_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '_');
    const newChallan = {
      ...challanData,
      id: challanData.id || cleanId,
      createdAt: new Date().toISOString()
    };
    setChallans(prev => [newChallan, ...prev]);
    return { success: true, id: newChallan.id };
  };

  const updateChallan = (id, updatedFields) => {
    setChallans(prev =>
      prev.map(c => (c.id === id || c.cpin === id ? { ...c, ...updatedFields } : c))
    );
    return { success: true };
  };

  const deleteChallan = (id) => {
    setChallans(prev => prev.filter(c => c.id !== id && c.cpin !== id));
    return { success: true };
  };

  // Saved Draft Challans
  const addSavedChallan = (challan) => {
    setSavedChallans(prev => [challan, ...prev]);
    return { success: true };
  };

  const deleteSavedChallan = (id) => {
    setSavedChallans(prev => prev.filter(c => c.id !== id && c.cpin !== id));
    return { success: true };
  };

  // ================= APPLICATIONS (ADD, EDIT, DELETE) =================
  const submitApplication = (appData) => {
    const cleanId = String(appData.arn || `ARN_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '_');
    const newApp = {
      ...appData,
      id: appData.id || cleanId,
      createdAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    return { success: true, id: newApp.id };
  };

  const updateApplication = (arnOrId, updates) => {
    setApplications(prev =>
      prev.map(a => (a.id === arnOrId || a.arn === arnOrId ? { ...a, ...updates } : a))
    );
    return { success: true };
  };

  const deleteApplication = (arnOrId) => {
    setApplications(prev => prev.filter(a => a.id !== arnOrId && a.arn !== arnOrId));
    return { success: true };
  };

  // ================= REFUNDS (ADD, EDIT, DELETE) =================
  const addRefund = (refundData) => {
    const cleanId = String(refundData.rfdNumber || `RFD_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '_');
    const newRefund = {
      ...refundData,
      id: refundData.id || cleanId,
      createdAt: new Date().toISOString()
    };
    setRefunds(prev => [newRefund, ...prev]);
    return { success: true, id: newRefund.id };
  };

  const updateRefund = (id, updates) => {
    setRefunds(prev =>
      prev.map(r => (r.id === id || r.rfdNumber === id ? { ...r, ...updates } : r))
    );
    return { success: true };
  };

  const deleteRefund = (id) => {
    setRefunds(prev => prev.filter(r => r.id !== id && r.rfdNumber !== id));
    return { success: true };
  };

  // ================= TAXPAYERS (ADD, EDIT, DELETE) =================
  const addTaxpayer = (tpData) => {
    setTaxpayers(prev => [tpData, ...prev]);
    return { success: true };
  };

  const updateTaxpayer = (gstin, updates) => {
    setTaxpayers(prev =>
      prev.map(tp => (tp.gstin.toLowerCase() === gstin.toLowerCase() ? { ...tp, ...updates } : tp))
    );
    return { success: true };
  };

  const deleteTaxpayer = (gstin) => {
    setTaxpayers(prev => prev.filter(tp => tp.gstin.toLowerCase() !== gstin.toLowerCase()));
    return { success: true };
  };

  // ================= NOTICES (ADD, EDIT, DELETE) =================
  const addNotice = (noticeData) => {
    const newNotice = {
      ...noticeData,
      id: noticeData.id || `NOT-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotices(prev => [newNotice, ...prev]);
    return { success: true, id: newNotice.id };
  };

  const updateNotice = (id, updates) => {
    setNotices(prev =>
      prev.map(n => (n.id === id || n.noticeNumber === id ? { ...n, ...updates } : n))
    );
    return { success: true };
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id && n.noticeNumber !== id));
    return { success: true };
  };

  // ================= LEDGER ENTRIES =================
  const addLedgerEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: entry.id || `LED-${Date.now()}`
    };
    setLedgerEntries(prev => [newEntry, ...prev]);
    return { success: true, id: newEntry.id };
  };

  // ================= RESET ALL DATA TO DEFAULTS =================
  const resetAllDataToDefault = () => {
    setInvoices(SAMPLE_INVOICES);
    setReturns(SAMPLE_RETURNS);
    setChallans(SAMPLE_CHALLANS);
    setApplications(SAMPLE_APPLICATIONS);
    setRefunds(SAMPLE_REFUNDS);
    setTaxpayers(SAMPLE_TAXPAYERS);
    setNotices(SAMPLE_NOTICES);
    setLedgerEntries(SAMPLE_LEDGER_ENTRIES);

    try {
      localStorage.setItem('gst_portal_invoices', JSON.stringify(SAMPLE_INVOICES));
      localStorage.setItem('gst_portal_returns', JSON.stringify(SAMPLE_RETURNS));
      localStorage.setItem('gst_portal_challans', JSON.stringify(SAMPLE_CHALLANS));
      localStorage.setItem('gst_portal_applications', JSON.stringify(SAMPLE_APPLICATIONS));
      localStorage.setItem('gst_portal_refunds', JSON.stringify(SAMPLE_REFUNDS));
      localStorage.setItem('gst_portal_taxpayers', JSON.stringify(SAMPLE_TAXPAYERS));
      localStorage.setItem('gst_portal_notices', JSON.stringify(SAMPLE_NOTICES));
      localStorage.setItem('gst_portal_ledgers', JSON.stringify(SAMPLE_LEDGER_ENTRIES));
    } catch (e) {}
  };

  return (
    <PortalDataContext.Provider
      value={{
        invoices,
        returns,
        challans,
        savedChallans,
        applications,
        refunds,
        taxpayers,
        notices,
        ledgerEntries,
        isSyncing,
        // Invoices
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
        // Returns
        fileReturnRecord,
        updateReturnRecord,
        deleteReturnRecord,
        // Challans
        addChallan,
        updateChallan,
        deleteChallan,
        addSavedChallan,
        deleteSavedChallan,
        // Applications
        submitApplication,
        updateApplication,
        deleteApplication,
        // Refunds
        addRefund,
        updateRefund,
        deleteRefund,
        // Taxpayers
        addTaxpayer,
        updateTaxpayer,
        deleteTaxpayer,
        // Notices
        addNotice,
        updateNotice,
        deleteNotice,
        // Ledgers
        addLedgerEntry,
        // Reset
        resetAllDataToDefault
      }}
    >
      {children}
    </PortalDataContext.Provider>
  );
};

export const usePortalData = () => useContext(PortalDataContext);
