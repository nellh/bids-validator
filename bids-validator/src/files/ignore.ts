import { BIDSFile } from '../types/file.ts'
import { default as ignore } from 'https://esm.sh/ignore@5.3.1'
import type { Ignore } from 'https://esm.sh/ignore@5.3.1'

export async function readBidsIgnore(file: BIDSFile) {
  const value = await file.text()
  if (value) {
    const lines = value.split('\n')
    return lines
  } else {
    return []
  }
}

const defaultIgnores = [
  '.git**',
  '.*',
  'sourcedata/',
  'code/',
  'stimuli/',
  'log/',
  '**/meg/*.ds/**',
  '**/micr/*.zarr/**',
]

/**
 * Deno implementation of .bidsignore style rules
 */
export class FileIgnoreRules {
  #ignore: Ignore

  constructor(config: string[]) {
    // @ts-expect-error
    this.#ignore = ignore()
    this.#ignore.add(defaultIgnores)
    this.#ignore.add(config)
  }

  add(config: string[]): void {
    this.#ignore.add(config)
  }

  /** Test if a dataset relative path should be ignored given configured rules */
  test(path: string): boolean {
    // Paths come in with a leading slash, but ignore expects paths relative to root
    return this.#ignore.ignores(path.slice(1, path.length))
  }
}
