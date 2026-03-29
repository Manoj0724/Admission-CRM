// ─── ADMISSION BUSINESS RULES TESTS ──────────────

describe('RULE 3: Admission Number Format', () => {

  test('✅ PASS: admission number matches correct format', () => {
    const admissionNumber = 'INST/2026/UG/CSE/KCET/0001'
    const regex = /^[A-Z]+\/\d{4}\/[A-Z]+\/[A-Z]+\/[A-Z]+\/\d{4}$/
    expect(admissionNumber).toMatch(regex)
  })

  test('❌ BLOCK: wrong format is rejected', () => {
    const admissionNumber = 'INST-2026-UG-CSE-0001'
    const regex = /^[A-Z]+\/\d{4}\/[A-Z]+\/[A-Z]+\/[A-Z]+\/\d{4}$/
    expect(admissionNumber).not.toMatch(regex)
  })

})

describe('RULE 4: Fee Before Confirmation', () => {

  test('✅ PASS: confirm when fee is paid', () => {
    const applicant = { feeStatus: 'Paid' }
    const canConfirm = applicant.feeStatus === 'Paid'
    expect(canConfirm).toBe(true)
  })

  test('❌ BLOCK: cannot confirm when fee is pending', () => {
    const applicant = { feeStatus: 'Pending' }
    const canConfirm = applicant.feeStatus === 'Paid'
    expect(canConfirm).toBe(false)
  })

})

describe('RULE 5: Allotment Number Required', () => {

  test('✅ PASS: Management quota does not need allotment number', () => {
    const applicant = { quotaType: 'Management', allotmentNumber: '' }
    const isValid = applicant.quotaType === 'Management'
      || applicant.allotmentNumber !== ''
    expect(isValid).toBe(true)
  })

  test('❌ BLOCK: KCET quota needs allotment number', () => {
    const applicant = { quotaType: 'KCET', allotmentNumber: '' }
    const isValid = applicant.quotaType === 'Management'
      || applicant.allotmentNumber !== ''
    expect(isValid).toBe(false)
  })

  test('✅ PASS: KCET quota with allotment number is valid', () => {
    const applicant = { quotaType: 'KCET', allotmentNumber: 'KCT123456' }
    const isValid = applicant.quotaType === 'Management'
      || applicant.allotmentNumber !== ''
    expect(isValid).toBe(true)
  })

})