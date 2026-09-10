/**
 * @file E2E Tests - api
 * @module docmark-extension-yaml/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-extension-yaml'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-extension-yaml', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
