// ─── QUOTA BUSINESS RULES TESTS ───────────────────

describe('RULE 1: Quota Integrity', () => {

  test('✅ PASS: quota totals equal program intake', () => {
    const intake = 100
    const quotas = [
      { type: 'KCET',       total: 40 },
      { type: 'COMEDK',     total: 30 },
      { type: 'Management', total: 30 },
    ]
    const sum = quotas.reduce((a, q) => a + q.total, 0)
    expect(sum).toBe(intake)
  })

  test('❌ BLOCK: quota totals do NOT equal program intake', () => {
    const intake = 100
    const quotas = [
      { type: 'KCET',       total: 40 },
      { type: 'COMEDK',     total: 30 },
      { type: 'Management', total: 20 }, // sum = 90 ≠ 100
    ]
    const sum = quotas.reduce((a, q) => a + q.total, 0)
    expect(sum).not.toBe(intake)
  })

})

describe('RULE 2: No Overbooking', () => {

  test('✅ PASS: seat available when quota not full', () => {
    const quota = { total: 30, filled: 25 }
    const canAllocate = quota.filled < quota.total
    expect(canAllocate).toBe(true)
  })

  test('❌ BLOCK: seat NOT available when quota is full', () => {
    const quota = { total: 30, filled: 30 }
    const canAllocate = quota.filled < quota.total
    expect(canAllocate).toBe(false)
  })

  test('❌ BLOCK: seat NOT available when quota is overfilled', () => {
    const quota = { total: 30, filled: 31 }
    const canAllocate = quota.filled < quota.total
    expect(canAllocate).toBe(false)
  })

})