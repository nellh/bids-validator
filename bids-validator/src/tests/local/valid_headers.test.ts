// Deno runtime tests for tests/data/valid_headers
import { assert, assertEquals } from '../../deps/asserts.ts'
import { validatePath } from './common.ts'

const PATH = 'tests/data/valid_headers'

Deno.test('valid_headers dataset', async (t) => {
  const { tree, result } = await validatePath(t, PATH)

  await t.step('correctly ignores .bidsignore files', () => {
    assert(
      result.issues.get('NOT_INCLUDED') === undefined,
      'NOT_INCLUDED error should not be present',
    )
  })

  await t.step('summary has correct tasks', () => {
    assertEquals(Array.from(result.summary.tasks), ['rhyme judgment'])
  })

  await t.step('summary has correct dataProcessed', () => {
    assertEquals(result.summary.dataProcessed, false)
  })

  await t.step('summary has correct modalities', () => {
    assertEquals(result.summary.modalities, ['MRI'])
  })

  await t.step('summary has correct totalFiles', () => {
    assertEquals(result.summary.totalFiles, 8)
  })

  await t.step('summary has correct subjectMetadata', () => {
    assertEquals(result.summary.subjectMetadata[0], {
      age: 25,
      participantId: '01',
      sex: 'M',
    })
  })
})
