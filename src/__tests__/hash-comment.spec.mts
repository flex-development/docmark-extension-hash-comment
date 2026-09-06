/**
 * @file Unit Tests - hashComment
 * @module docmark-extension-hash-comment/tests/unit/hashComment
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../hash-comment.mts'

describe('unit:hashComment', () => {
  it('should be named comment construct', () => {
    expect(testSubject).to.have.property('continuation')
    expect(testSubject).to.have.property('name').be.a('string')
    expect(testSubject).toMatchSnapshot()
  })
})
