import React from 'react';
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

  const renderRow = (testName, value, unit, refRange) => {
    const outOfRange = isOutOfRange(value, refRange);
    return (
      <tr className="report-row">
        <td className="col-test" style={{ padding: '4px 0' }}>{testName}</td>
        <td className="col-result" style={{ padding: '4px 0', fontWeight: outOfRange ? 'bold' : 'normal', color: 'inherit' }}>
          {value || '-'}
        </td>
        <td className="col-unit" style={{ padding: '4px 0' }}>{unit}</td>
        <td className="col-ref" style={{ padding: '4px 0' }}>{refRange}</td>
      </tr>
    );
  };

  return (
    <div className="preview-container">
      <div className="no-print mb-4 text-center">
        <button className="btn btn-secondary mr-2" onClick={onBack} style={{ marginRight: '1rem' }}>Back to Edit</button>
        <button className="btn btn-primary" onClick={handlePrint}>Print / Save as PDF</button>
      </div>

      <div className="report-page">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead style={{ display: 'table-header-group' }}>
            <tr>
              <th colSpan="4" style={{ padding: 0, fontWeight: 'normal' }}>
                <div style={{ height: '1.2in' }} className="print-only"></div>
                <div className="patient-info-box">
                  <table style={{ width: '100%', fontSize: 'inherit', borderCollapse: 'collapse', borderSpacing: 0 }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px 0', width: '50%', textAlign: 'left' }}><strong>Patient Name:</strong> {data.patientName || '-'}</td>
                        <td style={{ padding: '4px 0', width: '50%', textAlign: 'left' }}><strong>Reg Date:</strong> {data.regDate || '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Age/Gender:</strong> {data.ageGender || '-'}</td>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Sample Coll. Date:</strong> {data.sampleCollDate || '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Referred By:</strong> {data.referedBy || '-'}</td>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Sample Rec. Date:</strong> {data.sampleRecDate || '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Barcode No:</strong> {data.barcodeNo || '-'}</td>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Report Date:</strong> {data.reportDate || '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', textAlign: 'left' }}><strong>Lab No:</strong> {data.labNo || '-'}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>
            </tr>
            <tr className="results-header">
              <th className="col-test" style={{ textAlign: 'left', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '8px 0' }}>Test Name</th>
              <th className="col-result" style={{ textAlign: 'left', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '8px 0' }}>Result</th>
              <th className="col-unit" style={{ textAlign: 'left', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '8px 0' }}>Unit</th>
              <th className="col-ref" style={{ textAlign: 'left', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '8px 0' }}>Bio. Ref. Range</th>
            </tr>
          </thead>
          
          <tbody style={{ display: 'table-row-group' }}>
          {(!data.selectedTests || data.selectedTests.haematology) && (
            <>
              <tr><td colSpan="4"><div className="department-title">DEPARTMENT OF HAEMATOLOGY</div></td></tr>
              <tr><td colSpan="4"><div className="test-group-title">Complete Blood Count (CBC)</div></td></tr>
              {renderRow('Haemoglobin', data.haemoglobin, 'gm/dl', '13.0-17.0')}
              {renderRow('TLC (Total Leucocyte Count)', data.tlc, '/cumm', '4000-10000')}

              <tr><td colSpan="4"><div className="test-group-subtitle mt-2" style={{ fontWeight: 'bold' }}>DIFFERENTIAL LEUCOCYTE COUNT</div></td></tr>
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
              {renderRow('Platelet Count', data.plateletCount, 'Lacs/cumm', '1.5-4.5')}
              {renderRow('MPV', data.mpv, 'fl', '7.0-12.0')}
              {renderRow('RDW- CV', data.rdwCv, '%', '11.6-14.0')}
              {renderRow('RDW- SD', data.rdwSd, 'fl', '35-56')}
              {renderRow('PCT', data.pct, '%', '0.10-0.28')}
              {renderRow('PDW', data.pdw, 'fl', '9.0-17.0')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.hba1c) && (
            <>
              <tr><td colSpan="4"><div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div></td></tr>
              <tr><td colSpan="4"><div className="test-group-title mt-2">HbA1c (Glycated hemoglobin)</div></td></tr>
              {renderRow('Glycosylated Hb (HbA1c)', data.hba1c, '%', 'Non Diabetic: < 5.7')}
              {renderRow('Average Glucose', data.averageGlucose, 'mg/dl', '73-140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.fastingSugar) && (
            <>
              {(!data.selectedTests || !data.selectedTests.hba1c) && <tr><td colSpan="4"><div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div></td></tr>}
              <tr><td colSpan="4"><div className="test-group-title mt-2">Glucose (Fasting & PP)</div></td></tr>
              {renderRow('Blood Sugar Fasting', data.fastingSugar, 'mg/dL', '70-100')}
              {renderRow('Blood Sugar (PP)', data.sugarPp, 'mg/dL', '<140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.randomSugar) && (
            <>
              {(!data.selectedTests || (!data.selectedTests.hba1c && !data.selectedTests.fastingSugar)) && <tr><td colSpan="4"><div className="department-title mt-4">DEPARTMENT OF IMMUNO BIOCHEMISTRY</div></td></tr>}
              <tr><td colSpan="4"><div className="test-group-title mt-2">Glucose Random</div></td></tr>
              {renderRow('Blood Sugar Random', data.sugarRandom, 'mg/dL', '<140')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.lipidProfile) && (
            <>
              <tr><td colSpan="4"><div className="test-group-title mt-2">Lipid Profile</div></td></tr>
              {renderRow('Cholesterol', data.cholesterol, 'mg/dl', '<200')}
              {renderRow('Triglyceride', data.triglyceride, 'mg/dl', '<150')}
              {renderRow('HDL-Cholesterol', data.hdl, 'mg/dL', '40-60')}
              {renderRow('LDL Cholesterol', data.ldl, 'mg/dl', '0-100')}
              {renderRow('VLDL Cholesterol', data.vldl, 'mg/dl', '5 - 40')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.liverPanel) && (
            <>
              <tr><td colSpan="4"><div className="test-group-title mt-2">Liver Panel (LFT)</div></td></tr>
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
              <tr><td colSpan="4"><div className="test-group-title mt-2">Thyroid Profile-I [T3,T4,TSH]</div></td></tr>
              {renderRow('T3 (Triiodothyronine)', data.t3, 'ng/dl', '80-200')}
              {renderRow('T4 (Thyroxine)', data.t4, 'ug/dl', '5.1-14.1')}
              {renderRow('TSH', data.tsh, 'uIU/mL', '0.13-6.33')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.tshOnly) && (
            <>
              <tr><td colSpan="4"><div className="test-group-title mt-2">Thyroid Stimulating Hormone (TSH)</div></td></tr>
              {renderRow('TSH', data.tsh, 'uIU/mL', '0.13-6.33')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.ironPanel) && (
            <>
              <tr><td colSpan="4"><div className="test-group-title mt-2">Iron Panel Basic</div></td></tr>
              {renderRow('Iron', data.iron, 'ug/dl', '59–158')}
              {renderRow('UIBC', data.uibc, 'ug/dL', '63 - 433')}
              {renderRow('TIBC', data.tibc, 'ug/dL', '250 - 400')}
              {renderRow('Transferrin Saturation', data.transferrinSat, '%', '15-55')}
            </>
          )}

          {(!data.selectedTests || data.selectedTests.kidneyPanel) && (
            <>
              <tr><td colSpan="4"><div className="test-group-title mt-2">Kidney Panel-2</div></td></tr>
              {renderRow('Blood Urea', data.bloodUrea, 'mg/dL', '21-40.0')}
              {renderRow('Serum Creatinine', data.creatinine, 'mg/dL', '0.7-1.2')}
              {renderRow('Uric Acid', data.uricAcid, 'mg/dl', '3.4 - 7.0')}
              {renderRow('Sodium', data.sodium, 'mmol/L', '136-145')}
              {renderRow('Potassium', data.potassium, 'mmol/L', '3.7-5.5')}
              {renderRow('Calcium', data.calcium, 'mg/dL', '8.6-10.0')}
            </>
          )}
          </tbody>

          <tfoot style={{ display: 'table-footer-group' }}>
            <tr>
              <td colSpan="4" style={{ height: '3in' }}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ReportPreview;
