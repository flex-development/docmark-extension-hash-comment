/**
 * @file hashComment
 * @module docmark-extension-hash-comment/hashComment
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import {
  codes,
  constants,
  kind,
  tt
} from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ok as assert } from 'devlop'

/**
 * The hash comment construct.
 *
 * This construct is expected to run at the `source` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} hashComment
 */
const hashComment: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeHashCommentContinuation },
  exit: exitHashComment,
  name: `${tt.comment}:${kind.hash}`,
  tokenize: tokenizeHashComment
}

export default hashComment

/**
 * Exit the comment container.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitHashComment(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.comment)
}

/**
 * Tokenize the first line of a hash comment or a continued line.
 *
 * The first line opens the comment container before capturing
 * the comment line prefix.\
 * Continued lines reuse this tokenizer through the continuation construct.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeHashComment(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return startComment

  /**
   * Attempt to begin or continue a hash comment.
   *
   * The comment container is opened when it is not already open.
   * Continued lines reuse this state through the continuation construct.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |# get workspace directory.␊
   *     ^
   *  > |# skip root workspace.␊
   *  ```
   *
   * @example
   *  ```markdown
   *  > |# get workspace directory.␊
   *  > |# skip root workspace.␊
   *     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startComment(this: void, code: Code): State | undefined {
    // cannot start or continue a hash comment.
    if (code !== codes.numberSign) return nok(code)
    assert(self.containerState, 'expected `containerState` inside comment')

    // open the comment container if not already open.
    if (!self.containerState.open) {
      effects.enter(tt.comment, { _container: true, _kind: kind.hash })
      self.containerState.open = true
    }

    // begin comment line prefix.
    effects.enter(tt.commentLinePrefix)

    // capture comment line marker.
    effects.enter(tt.commentLineMarker)
    effects.consume(code)
    effects.exit(tt.commentLineMarker)

    // capture optional padding.
    return factorySpace(
      effects,
      afterMarker,
      tt.commentPadding,
      constants.commentPaddingSizeMin
    )
  }

  /**
   * After comment line marker and optional padding.
   *
   * The comment line prefix ends immediately before comment content.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |# get workspace directory.␊
   *       ^
   *  > |# skip root workspace.␊
   *  ```
   *
   * @example
   *  ```markdown
   *  > |# get workspace directory.␊
   *  > |# skip root workspace.␊
   *       ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterMarker(this: void, code: Code): State | undefined {
    effects.exit(tt.commentLinePrefix)
    return ok(code)
  }
}

/**
 * Continue tokenizing a hash comment.
 *
 * A continuation line may contain optional padding before
 * a comment line prefix.\
 * The existing comment container remains open while the {@linkcode hashComment}
 * construct is attempted again.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeHashCommentContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return lineStart

  /**
   * Begin a continued comment line.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |   # get workspace directory.␊
   *  > |   # skip root workspace.␊
   *     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function lineStart(this: void, code: Code): State | undefined {
    return factorySpace(effects, afterLineStart, tt.commentPadding)(code)
  }

  /**
   * Attempt to tokenize a comment line prefix.
   *
   * The {@linkcode hashComment} construct is attempted from the current point
   * after optional padding.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |   # get workspace directory.␊
   *  > |   # skip root workspace.␊
   *        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterLineStart(this: void, code: Code): State | undefined {
    return effects.attempt(hashComment, ok, nok)(code)
  }
}
