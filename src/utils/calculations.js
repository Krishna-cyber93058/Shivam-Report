// Auto-calculation functions for blood test reports

export const calculateIndices = (formData) => {
    const data = { ...formData };
  
    // Calculate A/G Ratio
    const albumin = parseFloat(data.albumin);
    const globulin = parseFloat(data.globulin);
    if (!isNaN(albumin) && !isNaN(globulin) && globulin !== 0) {
      data.agRatio = (albumin / globulin).toFixed(2);
    }
  
    // Calculate SGOT/SGPT Ratio
    const sgot = parseFloat(data.sgot);
    const sgpt = parseFloat(data.sgpt);
    if (!isNaN(sgot) && !isNaN(sgpt) && sgpt !== 0) {
      data.sgotSgptRatio = (sgot / sgpt).toFixed(2);
    }
  
    // Calculate LDL / HDL Ratio
    const ldl = parseFloat(data.ldl);
    const hdl = parseFloat(data.hdl);
    if (!isNaN(ldl) && !isNaN(hdl) && hdl !== 0) {
      data.ldlHdlRatio = (ldl / hdl).toFixed(2);
    }
  
    // Calculate HDL / LDL Ratio
    if (!isNaN(ldl) && !isNaN(hdl) && ldl !== 0) {
      data.hdlLdlRatio = (hdl / ldl).toFixed(2);
    }
  
    // Calculate Chol / HDL Ratio
    const chol = parseFloat(data.cholesterol);
    if (!isNaN(chol) && !isNaN(hdl) && hdl !== 0) {
      data.cholHdlRatio = (chol / hdl).toFixed(2);
    }
  
    // Calculate Non-HDL Cholesterol
    if (!isNaN(chol) && !isNaN(hdl)) {
      data.nonHdlCholesterol = (chol - hdl).toFixed(1);
    }
  
    // Calculate VLDL
    const trig = parseFloat(data.triglyceride);
    if (!isNaN(trig)) {
      // rough estimation
      data.vldl = (trig / 5).toFixed(1);
    }
  
    // Calculate BUN/Creatinine Ratio
    const bun = parseFloat(data.bun);
    const creatinine = parseFloat(data.creatinine);
    if (!isNaN(bun) && !isNaN(creatinine) && creatinine !== 0) {
      data.bunCreatinineRatio = (bun / creatinine).toFixed(2);
    }
  
    // Calculate Urea/Creatinine Ratio
    const urea = parseFloat(data.bloodUrea);
    if (!isNaN(urea) && !isNaN(creatinine) && creatinine !== 0) {
      data.ureaCreatinineRatio = (urea / creatinine).toFixed(2);
    }
  
    return data;
  };
