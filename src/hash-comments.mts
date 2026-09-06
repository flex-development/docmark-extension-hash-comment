/**
 * @file hashComments
 * @module docmark-extension-hash-comment/hashComments
 */

import { codes } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import hashComment from './hash-comment.mts'

/**
 * The hash comment syntax extension.
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} hashComments
 */
const hashComments: NormalizedExtension = {
  source: { [codes.numberSign]: hashComment }
}

export default hashComments
