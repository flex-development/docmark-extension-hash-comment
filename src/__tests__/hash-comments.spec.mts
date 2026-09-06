/**
 * @file Unit Tests - hashComments
 * @module docmark-extension-hash-comment/tests/unit/hashComments
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../hash-comments.mts'

describe('unit:hashComments', () => {
  it('should be extension', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
