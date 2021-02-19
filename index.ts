import { createHash } from 'crypto'
import adjective from './words/adjectives.json'
import noun from './words/nouns.json'

interface TokenList {
  [key: string]: string[]
}

interface WordList {
  [key: string]: {
    items: string[],
    metadata: {
      lengths: {
        [key: string]: number
      }
    }
  }
}

// Default is ['adjective', 'noun']
type AvailableTokens = string[]

interface Options {
  tokens?: AvailableTokens,
  seed?: string,
  maxWordLength?: number,
  hashAlgorithm?: string,
  separator?: string,
  tokenList?: TokenList,
  wordList?: WordList
}

type WordType = [key: string, value: string[]]

// Insert metadata onto the tokens list. This metadata contains information about the length of potential words.
function parseTokens (tokens: TokenList): WordList {
  if (tokens) {
    const tokensWithMetadata = {}
    const findLengths = (items: string[]) => {
      const lengths = [3, 4, 5, 6, 7, 8, 9]
      const response = {}
      items.forEach((item) => {
        lengths.forEach((length) => {
          if (item.length <= length) {
            response[length] = response[length] ? response[length] + 1 : 1
          }
        })
      })

      return response
    }

    for (const token of Object.entries(tokens)) {
      const [key, value] = token as WordType

      tokensWithMetadata[key] = {
        items: value.sort((a, b) => (a.length === b.length ? a.localeCompare(b) : a.length - b.length)),
        metadata: {
          lengths: findLengths(value)
        }
      }
    }

    return tokensWithMetadata
  }
}

// Tries to allow you to pass in numbers and objects if you want.
function seedToString (input: string | number | object): string {
  if (input) {
    if (typeof input === 'string') {
      return input
    } else if (typeof input === 'number') {
      return input.toString()
    } else if (typeof input === 'object') {
      return JSON.stringify(input)
    }
  }
}

// Sets up some data in the config object based on user input and some defaults.
function setOptions (input: string, options: Options): Options {
  // Max word length sets how big each word can be in the output.
  const maxWordLength = options?.maxWordLength > 0 ? Math.max(3, options.maxWordLength) : 0

  // The token list will default to ['adjective', 'noun'].
  const tokens = options?.tokens || ['adjective', 'noun']

  // Coerce the seed input into a string.
  const seed = seedToString(input) || seedToString(options?.seed) || ''

  // Set the hashAlgorithm that's passed to the crypto lib. Defaults to 'md5'.
  const hashAlgorithm = options?.hashAlgorithm || 'md5'

  // Set the separator between words. Defaults to '-'
  const separator = options?.separator || '-'

  // Generate some metadata about the words in the word list for use later.
  const wordList = parseTokens(options.tokenList) || parseTokens({ adjective, noun })

  return {
    maxWordLength,
    tokens,
    seed,
    hashAlgorithm,
    separator,
    wordList
  }
}

// Takes in the available tokens in the shape of something like this:
//   [ 'adjective', 'noun' ]
// And returns an ordered array of each list of words like this:
//   [
//     [ ...allTheAdjectives ],
//     [ ...allTheNouns ]
//   ]
function getWords (config: Options): string[][] {
  const wordList = config.wordList as WordList

  return config.tokens.slice().reverse().map(token => {
    if (!wordList[token]) {
      return ['unknown']
    } else {
      return config.maxWordLength ? wordList[token].items.slice(0, wordList[token].metadata.lengths[config.maxWordLength]) : wordList[token].items
    }
  })
}

// Returns a BigInt of the total amount of words in the word space.
function getTotalWords (tokens: string[][]): bigint {
  let totalWords = 1n
  tokens.forEach(function (token) {
    totalWords = totalWords * BigInt(token.length)
  })
  return totalWords
}

// Returns a hash of the seed (defaults to md5) in hexadecimal.
function getHash (config: Options): bigint {
  const hash = createHash(config.hashAlgorithm)
  hash.update(config.seed)
  return BigInt('0x' + hash.digest('hex'))
}

// Perform the actual encoding.
function main (config: Options): string[] {
  const words = getWords(config)
  const totalWords = getTotalWords(words)
  const objHash = getHash(config)

  const results = []
  let index = objHash % totalWords
  words.forEach((token: string[]) => {
    results.push(token[Number(index % BigInt(token.length))])
    index = index / BigInt(token.length)
  })

  return results.slice().reverse()
}

// Generate a human readable digest of random english words from an input string.
export function humanize (seed: string, options: Options = {}): string {
  const config = setOptions(seed, options)
  return main(config).join(config.separator)
}
