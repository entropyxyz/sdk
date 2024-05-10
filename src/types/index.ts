/**
 * These are external facing types
 * Todo move them to @types dir in root?
 * */

import { EntropyAccount } from '../keys/types'
// are we sure this is right?
import Entropy from './../index'

export type EntropyInstance = InstanceType<typeof Entropy>


