import { expect, test } from '@jest/globals'
import { humanize } from '../index'

test('1 should return delicious-natural', () => {
  const results = humanize('1')
  console.log('RESULTS', results)
  expect(results).toBe('delicious-natural')
})

test('5b5d5b84-03f2-4a0b-a87f-5b187b0a2765 should return adamant-count', () => {
  const results = humanize('5b5d5b84-03f2-4a0b-a87f-5b187b0a2765')
  console.log('RESULTS', results)
  expect(results).toBe('adamant-count')
})
