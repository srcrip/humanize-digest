#!/usr/bin/env node

import { humanize } from './index'

const input = process.argv.slice(2)[0]
console.log(humanize(input))
