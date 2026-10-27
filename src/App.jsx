import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { PortalDataProvider } from './context/PortalDataContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import SearchTaxpayer from './pages/public/SearchTaxpayer';
import VerifyGstin from './pages/public/VerifyGstin';
import TrackApplication from './pages/public/TrackApplication';
import TrackPayment from './pages/public/TrackPayment';
import Calculators from './pages/public/Calculators';
import Help from './pages/public/Help';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Downloads from './pages/public/Downloads';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard & Core Pages
import Dashboard from './pages/dashboard/Dashboard';
import TurnoverDeclaration from './pages/dashboard/TurnoverDeclaration';
import Profile from './pages/dashboard/Profile';
import Liability from './pages/dashboard/Liability';
import ITC from './pages/dashboard/ITC';
import Ledgers from './pages/dashboard/Ledgers';
import Documents from './pages/dashboard/Documents';
import Reports from './pages/dashboard/Reports';
import Notifications from './pages/dashboard/Notifications';
import Activity from './pages/dashboard/Activity';
import Settings from './pages/dashboard/Settings';
import Security from './pages/dashboard/Security';

// Registration Module
import RegistrationOverview from './pages/registration/RegistrationOverview';
import BusinessDetails from './pages/registration/BusinessDetails';
import PromoterDetails from './pages/registration/PromoterDetails';
import AddressDetails from './pages/registration/AddressDetails';
import BankDetails from './pages/registration/BankDetails';
import DocumentsUpload from './pages/registration/DocumentsUpload';
import VerificationStep from './pages/registration/VerificationStep';
import RegistrationStatus from './pages/registration/RegistrationStatus';

// Returns Module
import ReturnsOverview from './pages/returns/ReturnsOverview';
import GSTR1Filing from './pages/returns/GSTR1Filing';
import GSTR2BFiling from './pages/returns/GSTR2BFiling';
import GSTR3BFiling from './pages/returns/GSTR3BFiling';
import GSTR9Annual from './pages/returns/GSTR9Annual';
import ReturnsHistory from './pages/returns/ReturnsHistory';
import ReturnsStatus from './pages/returns/ReturnsStatus';
import ITCForms from './pages/returns/ITCForms';
import TdsTcsCredit from './pages/returns/TdsTcsCredit';
import QuarterlyOptIn from './pages/returns/QuarterlyOptIn';
import IMSDashboard from './pages/returns/IMSDashboard';
import TransitionForms from './pages/returns/TransitionForms';
import LiabilityItcComparison from './pages/returns/LiabilityItcComparison';
import ReturnCompliance from './pages/returns/ReturnCompliance';
import UnbarringApplication from './pages/returns/UnbarringApplication';

// Invoices Module
import InvoicesList from './pages/invoices/InvoicesList';
import CreateInvoice from './pages/invoices/CreateInvoice';
import InvoiceDetails from './pages/invoices/InvoiceDetails';
import CreditNote from './pages/invoices/CreditNote';
import DebitNote from './pages/invoices/DebitNote';

// Payments Module
import PaymentsOverview from './pages/payments/PaymentsOverview';
import GenerateChallan from './pages/payments/GenerateChallan';
import PaymentHistory from './pages/payments/PaymentHistory';
import PaymentStatus from './pages/payments/PaymentStatus';
import SavedChallans from './pages/payments/SavedChallans';
import InstalmentCalendar from './pages/payments/InstalmentCalendar';
import DeferredPaymentApplication from './pages/payments/DeferredPaymentApplication';
import GrievancePMT07 from './pages/payments/GrievancePMT07';

// Refunds Module
import RefundsOverview from './pages/refunds/RefundsOverview';
import ApplyRefund from './pages/refunds/ApplyRefund';
import RefundStatus from './pages/refunds/RefundStatus';

// Notices Module
import NoticesList from './pages/notices/NoticesList';
import NoticeDetails from './pages/notices/NoticeDetails';
import NoticeReply from './pages/notices/NoticeReply';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminApplications from './pages/admin/AdminApplications';
import AdminReturns from './pages/admin/AdminReturns';
import AdminPayments from './pages/admin/AdminPayments';
import AdminNotices from './pages/admin/AdminNotices';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import ServerError from './pages/errors/ServerError';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortalDataProvider>
          <NotificationProvider>
            <BrowserRouter>
            <Routes>
              {/* Public Layout Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/search-taxpayer" element={<SearchTaxpayer />} />
                <Route path="/verify-gstin" element={<VerifyGstin />} />
                <Route path="/track-application" element={<TrackApplication />} />
                <Route path="/track-payment" element={<TrackPayment />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/help" element={<Help />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/registration" element={<RegistrationOverview />} />
                <Route path="/registration/business-details" element={<BusinessDetails />} />
                <Route path="/registration/promoter-details" element={<PromoterDetails />} />
                <Route path="/registration/address" element={<AddressDetails />} />
                <Route path="/registration/bank-details" element={<BankDetails />} />
                <Route path="/registration/documents" element={<DocumentsUpload />} />
                <Route path="/registration/verification" element={<VerificationStep />} />
                <Route path="/registration/status" element={<RegistrationStatus />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/403" element={<Forbidden />} />
                <Route path="/500" element={<ServerError />} />
              </Route>

              {/* Protected Taxpayer Portal Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/turnover-update" element={<TurnoverDeclaration />} />
                <Route path="/turnover/edit" element={<TurnoverDeclaration />} />
                <Route path="/services/auth/turnover/edit" element={<TurnoverDeclaration />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/liability" element={<Liability />} />
                <Route path="/itc" element={<ITC />} />
                <Route path="/ledgers" element={<Ledgers />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/security" element={<Security />} />

                {/* Registration Workflow */}
                <Route path="/registration" element={<RegistrationOverview />} />
                <Route path="/registration/business-details" element={<BusinessDetails />} />
                <Route path="/registration/promoter-details" element={<PromoterDetails />} />
                <Route path="/registration/address" element={<AddressDetails />} />
                <Route path="/registration/bank-details" element={<BankDetails />} />
                <Route path="/registration/documents" element={<DocumentsUpload />} />
                <Route path="/registration/verification" element={<VerificationStep />} />
                <Route path="/registration/status" element={<RegistrationStatus />} />

                {/* Returns Module */}
                <Route path="/returns" element={<ReturnsOverview />} />
                <Route path="/returns/overview" element={<ReturnsOverview />} />
                <Route path="/returns/gstr1" element={<GSTR1Filing />} />
                <Route path="/returns/gstr2b" element={<GSTR2BFiling />} />
                <Route path="/returns2/auth/gstr2b" element={<GSTR2BFiling />} />
                <Route path="/returns/gstr3b" element={<GSTR3BFiling />} />
                <Route path="/returns/gstr9" element={<GSTR9Annual />} />
                <Route path="/returns/annual" element={<GSTR9Annual />} />
                <Route path="/returns/annual-return" element={<GSTR9Annual />} />
                <Route path="/returns2/auth/annualreturn" element={<GSTR9Annual />} />
                <Route path="/returns2/auth/gstr9/questionnaire" element={<GSTR9Annual />} />
                <Route path="/returns/history" element={<ReturnsHistory />} />
                <Route path="/returns/view-filed" element={<ReturnsHistory />} />
                <Route path="/returns/efiledReturns" element={<ReturnsHistory />} />
                <Route path="/returns/auth/efiledReturns" element={<ReturnsHistory />} />
                <Route path="/returns2/auth/efiledReturns" element={<ReturnsHistory />} />
                <Route path="/returns/status" element={<ReturnsStatus />} />
                <Route path="/returns/track-return-status" element={<ReturnsStatus />} />
                <Route path="/returns/auth/trackreturnstatus" element={<ReturnsStatus />} />
                <Route path="/returns2/auth/trackreturnstatus" element={<ReturnsStatus />} />
                <Route path="/returns/itc-forms" element={<ITCForms />} />
                <Route path="/returns2/auth/itcform/links" element={<ITCForms />} />
                <Route path="/returns2/auth/itcform/add" element={<ITCForms />} />
                <Route path="/returns2/auth/itc02/transfer" element={<ITCForms />} />
                <Route path="/returns2/auth/itc02a/transfer" element={<ITCForms />} />
                <Route path="/returns2/auth/itc03/section" element={<ITCForms />} />
                <Route path="/returns2/auth/itc04/selectquarter" element={<ITCForms />} />
                <Route path="/itc/forms" element={<ITCForms />} />
                <Route path="/returns/tds-tcs" element={<TdsTcsCredit />} />
                <Route path="/returns/tds-tcs-credit" element={<TdsTcsCredit />} />
                <Route path="/returns2/auth/comptds" element={<TdsTcsCredit />} />
                <Route path="/returns2/auth/gstr2x" element={<TdsTcsCredit />} />
                <Route path="/returns/quarterly-opt-in" element={<QuarterlyOptIn />} />
                <Route path="/returns/opt-in" element={<QuarterlyOptIn />} />
                <Route path="/returns/ims-dashboard" element={<IMSDashboard />} />
                <Route path="/ims/dashboard" element={<IMSDashboard />} />
                <Route path="/returns/transition-forms" element={<TransitionForms />} />
                <Route path="/returns/liability-itc-comparison" element={<LiabilityItcComparison />} />
                <Route path="/returns/comparison" element={<LiabilityItcComparison />} />
                <Route path="/returns/compliance" element={<ReturnCompliance />} />
                <Route path="/returns/auth/returnComp" element={<ReturnCompliance />} />
                <Route path="/returns/auth/drc01b" element={<ReturnCompliance />} />
                <Route path="/returns/auth/drc01c" element={<ReturnCompliance />} />
                <Route path="/returns/unbarring-application" element={<UnbarringApplication />} />
                <Route path="/returns/unbarring" element={<UnbarringApplication />} />

                {/* Invoices Module */}
                <Route path="/invoices" element={<InvoicesList />} />
                <Route path="/invoices/list" element={<InvoicesList />} />
                <Route path="/invoices/create" element={<CreateInvoice />} />
                <Route path="/invoices/details" element={<InvoiceDetails />} />
                <Route path="/invoices/credit-note" element={<CreditNote />} />
                <Route path="/invoices/debit-note" element={<DebitNote />} />

                {/* Payments Module */}
                <Route path="/payments" element={<PaymentsOverview />} />
                <Route path="/payments/challan" element={<GenerateChallan />} />
                <Route path="/payment/challan" element={<GenerateChallan />} />
                <Route path="/payments/create-challan" element={<GenerateChallan />} />
                <Route path="/payment/auth/challanreason" element={<GenerateChallan />} />
                <Route path="/payments/auth/challanreason" element={<GenerateChallan />} />
                <Route path="/payments/history" element={<PaymentHistory />} />
                <Route path="/payments/challan-history" element={<PaymentHistory />} />
                <Route path="/payments/instalment-calendar" element={<InstalmentCalendar />} />
                <Route path="/payments/saved-challans" element={<SavedChallans />} />
                <Route path="/payments/deferred-payment" element={<DeferredPaymentApplication />} />
                <Route path="/payments/grievance" element={<GrievancePMT07 />} />
                <Route path="/payments/grievance-pmt07" element={<GrievancePMT07 />} />
                <Route path="/payments/pmt07" element={<GrievancePMT07 />} />
                <Route path="/payments/status" element={<PaymentStatus />} />

                {/* Refunds Module */}
                <Route path="/refunds" element={<RefundsOverview />} />
                <Route path="/refunds/apply" element={<ApplyRefund />} />
                <Route path="/refunds/status" element={<RefundStatus />} />

                {/* Notices Module */}
                <Route path="/notices" element={<NoticesList />} />
                <Route path="/notices/details" element={<NoticeDetails />} />
                <Route path="/notices/reply" element={<NoticeReply />} />
              </Route>

              {/* Admin / Officer Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="returns" element={<AdminReturns />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="notices" element={<AdminNotices />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </PortalDataProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}
