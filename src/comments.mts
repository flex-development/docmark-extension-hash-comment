/**
 * @file comments
 * @module docmark-extension-yaml/comments
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import comment from './comment.mts'

/**
 * The YAML comment syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} comments
 */
const comments: NormalizedExtension = {
  source: { [codes.numberSign]: comment }
}

export default comments
