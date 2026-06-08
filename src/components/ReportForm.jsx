import React, { useState, useEffect } from 'react';
import { calculateIndices } from '../utils/calculations';
import './ReportForm.css'; // Will create specific styles for form grid

function ReportForm({ onGeneratePdf, initialData = {} }) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    // Patient Details
    patientName: '', ageGender: '', referedBy: 'SELF', barcodeNo: '', labNo: '',
    reportDate: today, sampleRecDate: today, sampleCollDate: today, regDate: today,

    // Haematology
    haemoglobin: '', tlc: '', rbc: '', hct: '', mcv: '', mch: '', mchc: '',
    polymorphs: '', lymphocytes: '', eosinophils: '', monocytes: '', basophils: '',
    absNeutrophil: '', absLymphocyte: '', absEosinophil: '', absMonocyte: '', absBasophil: '',
    plateletCount: '', mpv: '', pdw: '', pct: '', rdwCv: '', rdwSd: '',
    mentzerIndex: '', rdwi: '', greenKingIndex: '', nlr: '', lmr: '', plr: '',

    // Biochemistry - Diabetes
    hba1c: '', averageGlucose: '', fastingSugar: '', sugarPp: '', sugarRandom: '',

    // Lipid Profile
    cholesterol: '', triglyceride: '', hdl: '', ldl: '', vldl: '',
    ldlHdlRatio: '', hdlLdlRatio: '', cholHdlRatio: '', nonHdlCholesterol: '',

    // Liver Panel
    totalBilirubin: '', directBilirubin: '', indirectBilirubin: '',
    sgot: '', sgpt: '', alkPhosphatase: '', tProtein: '', albumin: '', globulin: '',
    agRatio: '', gammaGt: '', sgotSgptRatio: '',

    // Thyroid
    t3: '', t4: '', tsh: '',

    // Iron Panel
    iron: '', tibc: '', uibc: '', transferrinSat: '',

    // Kidney Panel
    bloodUrea: '', creatinine: '', uricAcid: '', sodium: '', potassium: '', chloride: '',
    calcium: '', phosphorus: '', bun: '', bunCreatinineRatio: '', ureaCreatinineRatio: '', egfr: '',

    ...initialData
  });

  const [selectedTests, setSelectedTests] = useState(initialData.selectedTests || {
    haematology: true,
    hba1c: true,
    fastingSugar: true,
    randomSugar: true,
    lipidProfile: true,
    liverPanel: true,
    thyroid: true,
    tshOnly: true,
    ironPanel: true,
    kidneyPanel: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      return calculateIndices(newData); // Auto-calculate dependent fields
    });
  };

  const handleTestSelection = (e) => {
    const { name, checked } = e.target;
    setSelectedTests(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.sampleCollDate && formData.reportDate && formData.sampleCollDate > formData.reportDate) {
      alert("Report Date cannot be before Sample Collection Date");
      return;
    }
    onGeneratePdf({ ...formData, selectedTests });
  };

  const renderCheckbox = (label, name) => (
    <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={selectedTests[name]}
        onChange={handleTestSelection}
        className="form-check-input"
        style={{ width: '1.2rem', height: '1.2rem' }}
      />
      <label htmlFor={name} className="form-check-label" style={{ margin: 0 }}>{label}</label>
    </div>
  );

  // Generic render input helper
  const renderInput = (label, name, type = 'text', unit = '', placeholder = '') => (
    <div className="form-group-grid">
      <label htmlFor={name}>{label}</label>
      <div className="input-with-unit">
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className="form-control"
          placeholder={placeholder}
          required={true}
        />
        {unit && <span className="unit-label">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="container mt-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h2 className="mb-4">Blood Test Report Data Entry</h2>
          <form onSubmit={handleSubmit}>
            
            <fieldset className="form-section">
              <legend>Patient Details</legend>
              <div className="grid-2-col">
                {renderInput('Patient Name', 'patientName')}
                {renderInput('Age/Gender (e.g. 55 Y 0 M / M)', 'ageGender')}
                {renderInput('Referred By', 'referedBy')}
                {renderInput('Barcode No.', 'barcodeNo')}
                {renderInput('Lab No.', 'labNo')}
                {renderInput('Reg Date', 'regDate', 'date')}
                {renderInput('Sample Coll. Date', 'sampleCollDate', 'date')}
                {renderInput('Sample Rec. Date', 'sampleRecDate', 'date')}
                {renderInput('Report Date', 'reportDate', 'date')}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Select Tests to Include</legend>
              <div className="grid-3-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {renderCheckbox('Complete Blood Count (CBC)', 'haematology')}
                {renderCheckbox('HbA1c (Glycated hemoglobin)', 'hba1c')}
                {renderCheckbox('Glucose (Fasting & PP)', 'fastingSugar')}
                {renderCheckbox('Glucose Random', 'randomSugar')}
                {renderCheckbox('Lipid Profile', 'lipidProfile')}
                {renderCheckbox('Liver Panel (LFT)', 'liverPanel')}
                {renderCheckbox('Thyroid Profile-I', 'thyroid')}
                {renderCheckbox('TSH Only', 'tshOnly')}
                {renderCheckbox('Iron Panel Basic', 'ironPanel')}
                {renderCheckbox('Kidney Panel-2', 'kidneyPanel')}
              </div>
            </fieldset>

            {selectedTests.haematology && (
              <fieldset className="form-section">
                <legend>Haematology (CBC)</legend>
                <div className="grid-3-col">
                  {renderInput('Haemoglobin', 'haemoglobin', 'number', 'gm/dl', '13.0-17.0')}
                  {renderInput('TLC', 'tlc', 'number', 'th/cumm', '4.0-10.0')}
                  {renderInput('RBC', 'rbc', 'number', 'millions/cmm', '4.5-5.5')}
                  {renderInput('HCT', 'hct', 'number', '%', '40-50')}
                  {renderInput('MCV', 'mcv', 'number', 'fl', '83-101')}
                  {renderInput('MCH', 'mch', 'number', 'pg', '27-32')}
                  {renderInput('MCHC', 'mchc', 'number', 'g/dl', '31.5-34.5')}
                  {renderInput('Platelet Count', 'plateletCount', 'number', 'thou/µL', '150-410')}
                  {renderInput('MPV', 'mpv', 'number', 'fl', '7.0-12.0')}
                  {renderInput('RDW- CV', 'rdwCv', 'number', '%', '11.6-14.0')}
                  {renderInput('RDW- SD', 'rdwSd', 'number', 'fl', '35-56')}
                  {renderInput('PCT', 'pct', 'number', '%', '0.10-0.28')}
                  {renderInput('PDW', 'pdw', 'number', 'fl', '9.0-17.0')}
                </div>
                <h4 className="mt-4">Differential Leucocyte Count</h4>
                <div className="grid-3-col">
                  {renderInput('Polymorphs', 'polymorphs', 'number', '%', '40-80')}
                  {renderInput('Lymphocytes', 'lymphocytes', 'number', '%', '20-40')}
                  {renderInput('Eosinophils', 'eosinophils', 'number', '%', '1-6')}
                  {renderInput('Monocytes', 'monocytes', 'number', '%', '2-10')}
                  {renderInput('Basophils', 'basophils', 'number', '%', '0-1')}
                </div>
              </fieldset>
            )}

            {selectedTests.hba1c && (
              <fieldset className="form-section">
                <legend>HbA1c (Glycated hemoglobin)</legend>
                <div className="grid-3-col">
                  {renderInput('Glycosylated Hb (HbA1c)', 'hba1c', 'number', '%', '< 5.7')}
                  {renderInput('Average Glucose', 'averageGlucose', 'number', 'mg/dl', '73-140')}
                </div>
              </fieldset>
            )}

            {selectedTests.fastingSugar && (
              <fieldset className="form-section">
                <legend>Glucose (Fasting & PP)</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Sugar Fasting', 'fastingSugar', 'number', 'mg/dL', '70-100')}
                  {renderInput('Blood Sugar (PP)', 'sugarPp', 'number', 'mg/dL', '<140')}
                </div>
              </fieldset>
            )}

            {selectedTests.randomSugar && (
              <fieldset className="form-section">
                <legend>Glucose Random</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Sugar Random', 'sugarRandom', 'number', 'mg/dL', '<140')}
                </div>
              </fieldset>
            )}

            {selectedTests.lipidProfile && (
              <fieldset className="form-section">
                <legend>Lipid Profile</legend>
                <div className="grid-3-col">
                  {renderInput('Cholesterol', 'cholesterol', 'number', 'mg/dl', '<200')}
                  {renderInput('Triglyceride', 'triglyceride', 'number', 'mg/dl', '<150')}
                  {renderInput('HDL-Cholesterol', 'hdl', 'number', 'mg/dL', '40-60')}
                  {renderInput('LDL Cholesterol', 'ldl', 'number', 'mg/dl', '0-100')}
                  {renderInput('VLDL Cholesterol', 'vldl', 'number', 'mg/dl', '5 - 40')}
                </div>
              </fieldset>
            )}

            {selectedTests.liverPanel && (
              <fieldset className="form-section">
                <legend>Liver Panel (LFT)</legend>
                <div className="grid-3-col">
                  {renderInput('Total Bilirubin', 'totalBilirubin', 'number', 'mg/dl', '0.0-1.2')}
                  {renderInput('Direct Bilirubin', 'directBilirubin', 'number', 'mg/dl', '0.0-0.3')}
                  {renderInput('Indirect Bilirubin', 'indirectBilirubin', 'number', 'mg/dL', '0.2-0.7')}
                  {renderInput('SGOT (AST)', 'sgot', 'number', 'IU/L', '0-40')}
                  {renderInput('SGPT (ALT)', 'sgpt', 'number', 'IU/L', '0-41')}
                  {renderInput('Alk. Phosphatase', 'alkPhosphatase', 'number', 'IU/L', '40-129')}
                  {renderInput('Total Protein', 'tProtein', 'number', 'gm/dl', '6.4-8.3')}
                  {renderInput('Sr. Albumin', 'albumin', 'number', 'gm/dL', '3.5-5.2')}
                </div>
              </fieldset>
            )}

            {selectedTests.thyroid && (
              <fieldset className="form-section">
                <legend>Thyroid Profile-I</legend>
                <div className="grid-3-col">
                  {renderInput('T3', 't3', 'number', 'ng/dl', '80-200')}
                  {renderInput('T4', 't4', 'number', 'ug/dl', '5.1-14.1')}
                  {renderInput('TSH', 'tsh', 'number', 'uIU/mL', '0.13-6.33')}
                </div>
              </fieldset>
            )}

            {selectedTests.tshOnly && (
              <fieldset className="form-section">
                <legend>TSH Only</legend>
                <div className="grid-3-col">
                  {renderInput('TSH', 'tsh', 'number', 'uIU/mL', '0.13-6.33')}
                </div>
              </fieldset>
            )}

            {selectedTests.ironPanel && (
              <fieldset className="form-section">
                <legend>Iron Panel Basic</legend>
                <div className="grid-3-col">
                  {renderInput('Iron', 'iron', 'number', 'ug/dl', '59–158')}
                  {renderInput('UIBC', 'uibc', 'number', 'ug/dL', '63 - 433')}
                  {renderInput('TIBC', 'tibc', 'number', 'ug/dL', '250 - 400')}
                  {renderInput('Transferrin Saturation', 'transferrinSat', 'number', '%', '15-55')}
                </div>
              </fieldset>
            )}

            {selectedTests.kidneyPanel && (
              <fieldset className="form-section">
                <legend>Kidney Panel-2</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Urea', 'bloodUrea', 'number', 'mg/dL', '21-40.0')}
                  {renderInput('Serum Creatinine', 'creatinine', 'number', 'mg/dL', '0.7-1.2')}
                  {renderInput('Uric Acid', 'uricAcid', 'number', 'mg/dl', '3.4 - 7.0')}
                  {renderInput('Sodium', 'sodium', 'number', 'mmol/L', '136-145')}
                  {renderInput('Potassium', 'potassium', 'number', 'mmol/L', '3.7-5.5')}
                  {renderInput('Calcium', 'calcium', 'number', 'mg/dL', '8.6-10.0')}
                </div>
              </fieldset>
            )}

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.25rem' }}>
                Preview & Generate PDF Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportForm;
