/**
 * @file E2E Tests - hashComments
 * @module docmark-extension-hash-comment/tests/e2e/hashComments
 */

import snapshot from '#tests/utils/snapshot-events'
import { parse, postprocess, preprocess } from '@flex-development/docmark'
import testSubject from '@flex-development/docmark-extension-hash-comment'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  FileLike,
  ParseOptions
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('e2e:hashComments', () => {
  let directory: string
  let options: ParseOptions

  beforeAll(() => {
    directory = '__fixtures__'
    options = { extensions: [testSubject] }
  })

  it.each<[path: string]>([
    ['empty/01.txt']
  ])('should handle no hash comments (%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = postprocess(parse(options).source().write(slice))

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
  })

  it.each<[path: string]>([
    ['opener-only/01.txt'],
    ['opener-only/02.txt'],
    ['opener-only/03.txt'],
    ['opener-only/04.txt'],
    ['no-eol/01.txt'],
    ['no-eol/02.txt'],
    ['multiline/01.txt'],
    ['multiline/02.txt']
  ])('should parse hash comments (%j,%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = postprocess(parse(options).source().write(slice))

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
