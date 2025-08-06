import { describe, it, expect } from 'vitest'

describe('OmniTask App', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should have correct environment', () => {
    // @ts-expect-error - globalThis test
    expect(globalThis.testEnvironment).toBe('jsdom')
  })
})