# Humanize Digest

```ts
import { humanize } from 'humanize-digest'

const uuid = '5b5d5b84-03f2-4a0b-a87f-5b187b0a2765'
const humanizedString = humanize(uuid)
// => adamant-count
```

This is a library for generating human-friendly word lists as digests of any input you want. This could be useful for:
- Displaying a 'username' in an anonymous system based on user IP address
- Hashing an important UUID in human readable form for people to remember

This should go without saying, but the resulting string should not be stored for any actual identification purposes. The space for collisions can be as big or as small as you want, but this is intended meerly for displaying human-readable versions of already unique strings.

This library is based on the work in [codenamize](https://github.com/jjmontesl/codenamize) and [codenamize-js](https://github.com/stemail23/codenamize-js).

## Improvements you may like or care about
- Written in TypeScript
- Isomorphic (will run in Node or the browser)
- Exports an ES Module and Common JS
- Tested with `jest` and linted with `eslint`
- No external dependencies (uses Node and browser-native `crypto` libraries)
- Can run on the command line
- Extendable with your favorite word lists
