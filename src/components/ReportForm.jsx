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
  const renderInput = (label, name, type = 'text', unit = '') => (
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
                  {renderInput('Haemoglobin', 'haemoglobin', 'number', 'gm/dl')}
                  {renderInput('TLC', 'tlc', 'number', 'th/cumm')}
                  {renderInput('RBC', 'rbc', 'number', 'millions/cmm')}
                  {renderInput('HCT', 'hct', 'number', '%')}
                  {renderInput('MCV', 'mcv', 'number', 'fl')}
                  {renderInput('MCH', 'mch', 'number', 'pg')}
                  {renderInput('MCHC', 'mchc', 'number', 'g/dl')}
                  {renderInput('Platelet Count', 'plateletCount', 'number', 'thou/µL')}
                  {renderInput('MPV', 'mpv', 'number', 'fl')}
                  {renderInput('RDW- CV', 'rdwCv', 'number', '%')}
                  {renderInput('RDW- SD', 'rdwSd', 'number', 'fl')}
                  {renderInput('PCT', 'pct', 'number', '%')}
                  {renderInput('PDW', 'pdw', 'number', 'fl')}
                </div>
                <h4 className="mt-4">Differential Leucocyte Count</h4>
                <div className="grid-3-col">
                  {renderInput('Polymorphs', 'polymorphs', 'number', '%')}
                  {renderInput('Lymphocytes', 'lymphocytes', 'number', '%')}
                  {renderInput('Eosinophils', 'eosinophils', 'number', '%')}
                  {renderInput('Monocytes', 'monocytes', 'number', '%')}
                  {renderInput('Basophils', 'basophils', 'number', '%')}
                </div>
              </fieldset>
            )}

            {selectedTests.hba1c && (
              <fieldset className="form-section">
                <legend>HbA1c (Glycated hemoglobin)</legend>
                <div className="grid-3-col">
                  {renderInput('Glycosylated Hb (HbA1c)', 'hba1c', 'number', '%')}
                  {renderInput('Average Glucose', 'averageGlucose', 'number', 'mg/dl')}
                </div>
              </fieldset>
            )}

            {selectedTests.fastingSugar && (
              <fieldset className="form-section">
                <legend>Glucose (Fasting & PP)</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Sugar Fasting', 'fastingSugar', 'number', 'mg/dL')}
                  {renderInput('Blood Sugar (PP)', 'sugarPp', 'number', 'mg/dL')}
                </div>
              </fieldset>
            )}

            {selectedTests.randomSugar && (
              <fieldset className="form-section">
                <legend>Glucose Random</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Sugar Random', 'sugarRandom', 'number', 'mg/dL')}
                </div>
              </fieldset>
            )}

            {selectedTests.lipidProfile && (
              <fieldset className="form-section">
                <legend>Lipid Profile</legend>
                <div className="grid-3-col">
                  {renderInput('Cholesterol', 'cholesterol', 'number', 'mg/dl')}
                  {renderInput('Triglyceride', 'triglyceride', 'number', 'mg/dl')}
                  {renderInput('HDL-Cholesterol', 'hdl', 'number', 'mg/dL')}
                  {renderInput('LDL Cholesterol', 'ldl', 'number', 'mg/dl')}
                  {renderInput('VLDL Cholesterol', 'vldl', 'number', 'mg/dl')}
                </div>
              </fieldset>
            )}

            {selectedTests.liverPanel && (
              <fieldset className="form-section">
                <legend>Liver Panel (LFT)</legend>
                <div className="grid-3-col">
                  {renderInput('Total Bilirubin', 'totalBilirubin', 'number', 'mg/dl')}
                  {renderInput('Direct Bilirubin', 'directBilirubin', 'number', 'mg/dl')}
                  {renderInput('Indirect Bilirubin', 'indirectBilirubin', 'number', 'mg/dL')}
                  {renderInput('SGOT (AST)', 'sgot', 'number', 'IU/L')}
                  {renderInput('SGPT (ALT)', 'sgpt', 'number', 'IU/L')}
                  {renderInput('Alk. Phosphatase', 'alkPhosphatase', 'number', 'IU/L')}
                  {renderInput('Total Protein', 'tProtein', 'number', 'gm/dl')}
                  {renderInput('Sr. Albumin', 'albumin', 'number', 'gm/dL')}
                </div>
              </fieldset>
            )}

            {selectedTests.thyroid && (
              <fieldset className="form-section">
                <legend>Thyroid Profile-I</legend>
                <div className="grid-3-col">
                  {renderInput('T3', 't3', 'number', 'ng/dl')}
                  {renderInput('T4', 't4', 'number', 'ug/dl')}
                  {renderInput('TSH', 'tsh', 'number', 'uIU/mL')}
                </div>
              </fieldset>
            )}

            {selectedTests.tshOnly && (
              <fieldset className="form-section">
                <legend>TSH Only</legend>
                <div className="grid-3-col">
                  {renderInput('TSH', 'tsh', 'number', 'uIU/mL')}
                </div>
              </fieldset>
            )}

            {selectedTests.ironPanel && (
              <fieldset className="form-section">
                <legend>Iron Panel Basic</legend>
                <div className="grid-3-col">
                  {renderInput('Iron', 'iron', 'number', 'ug/dl')}
                  {renderInput('UIBC', 'uibc', 'number', 'ug/dL')}
                  {renderInput('TIBC', 'tibc', 'number', 'ug/dL')}
                  {renderInput('Transferrin Saturation', 'transferrinSat', 'number', '%')}
                </div>
              </fieldset>
            )}

            {selectedTests.kidneyPanel && (
              <fieldset className="form-section">
                <legend>Kidney Panel-2</legend>
                <div className="grid-3-col">
                  {renderInput('Blood Urea', 'bloodUrea', 'number', 'mg/dL')}
                  {renderInput('Serum Creatinine', 'creatinine', 'number', 'mg/dL')}
                  {renderInput('Uric Acid', 'uricAcid', 'number', 'mg/dl')}
                  {renderInput('Sodium', 'sodium', 'number', 'mmol/L')}
                  {renderInput('Potassium', 'potassium', 'number', 'mmol/L')}
                  {renderInput('Calcium', 'calcium', 'number', 'mg/dL')}
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
