/**
 * @file E2E Tests - api
 * @module docmark-extension-hash-comment/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-extension-hash-comment'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-extension-hash-comment', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
