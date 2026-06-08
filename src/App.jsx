import React, { useState } from 'react';
import Login from './components/Login';
import Otp from './components/Otp';
import ReportForm from './components/ReportForm';
import ReportPreview from './components/ReportPreview';

function App() {
  const [authState, setAuthState] = useState('login'); // 'login', 'otp', 'form', 'preview'
  const [reportData, setReportData] = useState(null);

  const handleLogin = () => setAuthState('otp');
  const handleOtpVerify = () => setAuthState('form');
  const handleBackToLogin = () => setAuthState('login');
  
  const handleGeneratePdf = (data) => {
    setReportData(data);
    setAuthState('preview');
  };

  const handleBackToForm = () => {
    setAuthState('form');
  };

  return (
    <div className="App">
      {authState === 'login' && <Login onLogin={handleLogin} />}
      {authState === 'otp' && <Otp onVerify={handleOtpVerify} onBack={handleBackToLogin} />}
      
      {authState === 'form' && (
        <div className="print-only" style={{ display: 'none' }}>
          {/* Prevent form from printing if accidentally triggered */}
        </div>
      )}
      {authState === 'form' && (
        <div className="no-print">
           <ReportForm onGeneratePdf={handleGeneratePdf} initialData={reportData || {}} />
        </div>
      )}

      {authState === 'preview' && (
        <ReportPreview data={reportData} onBack={handleBackToForm} />
      )}
    </div>
  );
}

export default App;
