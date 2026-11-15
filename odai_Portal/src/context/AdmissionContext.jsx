import React, { createContext, useContext, useState } from 'react';
import AdmissionModal from '../components/AdmissionModal';

const AdmissionContext = createContext({
  openAdmission: () => {},
  closeAdmission: () => {},
});

export function AdmissionProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialProgram, setInitialProgram] = useState('');
  const [initialMode, setInitialMode] = useState('');

  const openAdmission = (program = '', mode = '') => {
    setInitialProgram(program);
    setInitialMode(mode);
    setIsOpen(true);
  };

  const closeAdmission = () => {
    setIsOpen(false);
  };

  return (
    <AdmissionContext.Provider value={{ openAdmission, closeAdmission }}>
      {children}
      <AdmissionModal
        isOpen={isOpen}
        onClose={closeAdmission}
        initialProgram={initialProgram}
        initialMode={initialMode}
      />
    </AdmissionContext.Provider>
  );
}

export function useAdmission() {
  return useContext(AdmissionContext);
}

