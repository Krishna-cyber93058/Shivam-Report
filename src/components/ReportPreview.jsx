import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import './ReportPreview.css';

function ReportPreview({ data, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  const isOutOfRange = (result, refRange) => {
    if (!result || !refRange) return false;
    const numResult = parseFloat(result);
    if (isNaN(numResult)) return false;

    const rangeStr = refRange.toLowerCase().replace(/ /g, '');

    const dashMatch = rangeStr.match(/([\d.]+)-([\d.]+)/);
    if (dashMatch) {
      const min = parseFloat(dashMatch[1]);
      const max = parseFloat(dashMatch[2]);
      return numResult < min || numResult > max;
    }

    const ltMatch = rangeStr.match(/<([\d.]+)/);
    if (ltMatch) {
      const max = parseFloat(ltMatch[1]);
      return numResult >= max;
    }

    const gtMatch = rangeStr.match(/>([\d.]+)/);
    if (gtMatch) {
      const min = parseFloat(gtMatch[1]);
      return numResult <= min;
    }

    return false;
  };

  const renderRow = (testName, result, unit, refRange) => {
    const isAbnormal = isOutOfRange(result, refRange);
    return (
      <div className="report-row" key={testName}>
        <div className="col-test">{testName}</div>
        <div className="col-result">
          {isAbnormal ? <strong>{result || '-'}</strong> : <span>{result || '-'}</span>}
        </div>
        <div className="col-unit">{unit}</div>
        <div className="col-ref">{refRange}</div>
      </div>
    );
  };

  return (
    <div className="preview-container">
      <div className="no-print mb-4 text-center">
        <button className="btn btn-secondary mr-2" onClick={onBack} style={{ marginRight: '1rem' }}>Back to Edit</button>
        <button className="btn btn-primary" onClick={handlePrint}>Print / Save as PDF</button>
      </div>

      <div className="report-page">
        {/* Header Section Removed as requested */}

        <div className="patient-info-box">
          <div className="info-grid">
            <div><strong>Patient Name:</strong> {data.patientName || '-'}</div>
            <div><strong>Reg Date:</strong> {data.regDate || '-'}</div>
            
            <div><strong>Age/Gender:</strong> {data.ageGender || '-'}</div>
            <div><strong>Sample Coll. Date:</strong> {data.sampleCollDate || '-'}</div>

            <div><strong>Referred By:</strong> {data.referedBy || '-'}</div>
            <div><strong>Sample Rec. Date:</strong> {data.sampleRecDate || '-'}</div>

            <div><strong>Barcode No:</strong> {data.barcodeNo || '-'}</div>
            <div><strong>Report Date:</strong> {data.reportDate || '-'}</div>

            <div><strong>Lab No:</strong> {data.labNo || '-'}</div>
            <div></div>
          </div>
        </div>

        {/* Results Table Header */}
        <div className="results-header">
          <div className="col-test">Test Name</div>
          <div className="col-result">Result</div>
          <div className="col-unit">Unit</div>
          <div className="col-ref">Bio. Ref. Range</div>
        </div>

        <div className="results-body">
          {(!data.selectedTests || data.selectedTests.haematology) && (
            <>
              <div className="department-title">DEPARTMENT OF HAEMATOLOGY</div>
              <div className="test-group-title">Complete Blood Count (CBC)</div>
              {renderRow('Haemoglobin', data.haemoglobin, 'gm/dl', '13.0-17.0')}
              {renderRow('TLC (Total Leucocyte Count)', data.tlc, 'th/cumm', '4.0-10.0')}

              <div className="test-group-subtitle mt-2" style={{ fontWeight: 'bold' }}>DIFFERENTIAL LEUCOCYTE COUNT</div>
              {renderRow('Polymorphs', data.polymorphs, '%', '40-80')}
              {renderRow('Lymphocytes', data.lymphocytes, '%', '20-40')}
              {renderRow('Eosinophils', data.eosinophils, '%', '1-6')}
              {renderRow('Monocytes', data.monocytes, '%', '2-10')}
              {renderRow('Basophils', data.basophils, '%', '0-1')}

              {renderRow('RBC', data.rbc, 'millions/cmm', '4.5-5.5')}
              {renderRow('HCT', data.hct, '%', '40-50')}
              {renderRow('MCV', data.mcv, 'fl', '83-101')}
              {renderRow('MCH', data.mch, 'pg', '27-32')}
              {renderRow('MCHC', data.mchc, 'g/dl', '31.5-34.5')}
              
              {renderRow('Platelet Count', data.plateletCount, 'thou/µL', '150-410')}
              {renderRow('MPV', data.mpv, 'fl', '7.0-12.0')}
              {renderRow('RDW- CV', data.rdwCv, '%', '11.6-14.0')}
              {renderRow('RDW- SD', data.rdwSd, 'fl', '35-56')}
              {renderRow('PCT', data.pct, '%', '0.10-0.28')}
              {renderRow('PDW', data.pdw, 'fl', '9.0-17.0')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.hba1c) && (
            <>
              <div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div>
              <div className="test-group-title mt-2">HbA1c (Glycated hemoglobin)</div>
              {renderRow('Glycosylated Hb (HbA1c)', data.hba1c, '%', 'Non Diabetic: < 5.7')}
              {renderRow('Average Glucose', data.averageGlucose, 'mg/dl', '73-140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.fastingSugar) && (
            <>
              {/* Only show department title if hba1c is not selected to avoid duplication, though usually both are there. Let's just output it. */}
              {(!data.selectedTests || !data.selectedTests.hba1c) && <div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div>}
              <div className="test-group-title mt-2">Glucose (Fasting & PP)</div>
              {renderRow('Blood Sugar Fasting', data.fastingSugar, 'mg/dL', '70-100')}
              {renderRow('Blood Sugar (PP)', data.sugarPp, 'mg/dL', '<140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.randomSugar) && (
            <>
              {(!data.selectedTests || (!data.selectedTests.hba1c && !data.selectedTests.fastingSugar)) && <div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div>}
              <div className="test-group-title mt-2">Glucose Random</div>
              {renderRow('Blood Sugar Random', data.sugarRandom, 'mg/dL', '<140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.lipidProfile) && (
            <>
              <div className="test-group-title mt-2">Lipid Profile</div>
              {renderRow('Cholesterol', data.cholesterol, 'mg/dl', '<200')}
              {renderRow('Triglyceride', data.triglyceride, 'mg/dl', '<150')}
              {renderRow('HDL-Cholesterol', data.hdl, 'mg/dL', '40-60')}
              {renderRow('LDL Cholesterol', data.ldl, 'mg/dl', '0-100')}
              {renderRow('VLDL Cholesterol', data.vldl, 'mg/dl', '5 - 40')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.liverPanel) && (
            <>
              <div className="test-group-title mt-2">Liver Panel (LFT)</div>
              {renderRow('Total Bilirubin', data.totalBilirubin, 'mg/dl', '0.0-1.2')}
              {renderRow('Direct Bilirubin', data.directBilirubin, 'mg/dl', '0.0-0.3')}
              {renderRow('Indirect Bilirubin', data.indirectBilirubin, 'mg/dL', '0.2-0.7')}
              {renderRow('SGOT (AST)', data.sgot, 'IU/L', '0 -40')}
              {renderRow('SGPT (ALT)', data.sgpt, 'IU/L', '0-41')}
              {renderRow('Alk.Phosphatase', data.alkPhosphatase, 'IU/L', '40-129')}
              {renderRow('T.Protein', data.tProtein, 'gm/dl', '6.4-8.3')}
              {renderRow('Sr. Albumin', data.albumin, 'gm/dL', '3.5-5.2')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.thyroid) && (
            <>
              <div className="test-group-title mt-2">Thyroid Profile-I [T3,T4,TSH]</div>
              {renderRow('T3 (Triiodothyronine)', data.t3, 'ng/dl', '80-200')}
              {renderRow('T4 (Thyroxine)', data.t4, 'ug/dl', '5.1-14.1')}
              {renderRow('TSH', data.tsh, 'uIU/mL', '0.13-6.33')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.tshOnly) && (
            <>
              <div className="test-group-title mt-2">Thyroid Stimulating Hormone (TSH)</div>
              {renderRow('TSH', data.tsh, 'uIU/mL', '0.13-6.33')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.ironPanel) && (
            <>
              <div className="test-group-title mt-2">Iron Panel Basic</div>
              {renderRow('Iron', data.iron, 'ug/dl', '59–158')}
              {renderRow('UIBC', data.uibc, 'ug/dL', '63 - 433')}
              {renderRow('TIBC', data.tibc, 'ug/dL', '250 - 400')}
              {renderRow('Transferrin Saturation', data.transferrinSat, '%', '15-55')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.kidneyPanel) && (
            <>
              <div className="test-group-title mt-2">Kidney Panel-2</div>
              {renderRow('Blood Urea', data.bloodUrea, 'mg/dL', '21-40.0')}
              {renderRow('Serum Creatinine', data.creatinine, 'mg/dL', '0.7-1.2')}
              {renderRow('Uric Acid', data.uricAcid, 'mg/dl', '3.4 - 7.0')}
              {renderRow('Sodium', data.sodium, 'mmol/L', '136-145')}
              {renderRow('Potassium', data.potassium, 'mmol/L', '3.7-5.5')}
              {renderRow('Calcium', data.calcium, 'mg/dL', '8.6-10.0')}
            </>
          )}
        </div>
        
        <div className="report-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
          <div>
            <p>*** End of Report ***</p>
            <p>This test was performed by Accuprobe Diagnostics</p>
          </div>
          <div className="qr-code-section" style={{ textAlign: 'center' }}>
            <QRCode value={`https://accuprobe.com/verify-report/${data.labNo || 'demo'}`} size={80} />
            <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', fontWeight: 'bold' }}>Scan to Verify</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;
