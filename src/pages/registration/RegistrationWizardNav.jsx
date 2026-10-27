import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function RegistrationWizardNav({ currentStep = 1 }) {
  const steps = [
    { num: 1, label: 'Business Details', path: '/registration/business-details' },
    { num: 2, label: 'Promoter Details', path: '/registration/promoter-details' },
    { num: 3, label: 'Address Details', path: '/registration/address' },
    { num: 4, label: 'Bank Details', path: '/registration/bank-details' },
    { num: 5, label: 'Upload Documents', path: '/registration/documents' },
    { num: 6, label: 'Verification', path: '/registration/verification' }
  ];

  return (
    <div className="wizard-steps" role="navigation" aria-label="Registration Progress">
      {steps.map((s, idx) => {
        const isCompleted = s.num < currentStep;
        const isActive = s.num === currentStep;
        return (
          <React.Fragment key={s.num}>
            <Link
              to={s.path}
              className={`wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="wizard-step-circle">
                {isCompleted ? <Check size={14} /> : s.num}
              </div>
              <span>{s.label}</span>
            </Link>
            {idx < steps.length - 1 && <div className="wizard-connector"></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
