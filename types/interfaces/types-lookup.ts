// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup'

import type { Data } from '@polkadot/types'
import type {
  BTreeMap,
  Bytes,
  Compact,
  Enum,
  Null,
  Option,
  Result,
  Set,
  Struct,
  Text,
  U8aFixed,
  Vec,
  WrapperKeepOpaque,
  bool,
  u128,
  u16,
  u32,
  u64,
  u8,
} from '@polkadot/types-codec'
import type { ITuple } from '@polkadot/types-codec/types'
import type { Vote } from '@polkadot/types/interfaces/elections'
import type {
  OpaqueMultiaddr,
  OpaquePeerId,
} from '@polkadot/types/interfaces/imOnline'
import type {
  AccountId32,
  Call,
  H160,
  H256,
  MultiAddress,
  PerU16,
  Perbill,
  Percent,
  WeightV1,
} from '@polkadot/types/interfaces/runtime'
import type { Event } from '@polkadot/types/interfaces/system'

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemAccountInfo (3) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32
    readonly consumers: u32
    readonly providers: u32
    readonly sufficients: u32
    readonly data: PalletBalancesAccountData
  }

  /** @name PalletBalancesAccountData (5) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128
    readonly reserved: u128
    readonly miscFrozen: u128
    readonly feeFrozen: u128
  }

  /** @name FrameSupportDispatchPerDispatchClassWeight (7) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: WeightV1
    readonly operational: WeightV1
    readonly mandatory: WeightV1
  }

  /** @name SpRuntimeDigest (12) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>
  }

  /** @name SpRuntimeDigestDigestItem (14) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean
    readonly asOther: Bytes
    readonly isConsensus: boolean
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>
    readonly isSeal: boolean
    readonly asSeal: ITuple<[U8aFixed, Bytes]>
    readonly isPreRuntime: boolean
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>
    readonly isRuntimeEnvironmentUpdated: boolean
    readonly type:
      | 'Other'
      | 'Consensus'
      | 'Seal'
      | 'PreRuntime'
      | 'RuntimeEnvironmentUpdated'
  }

  /** @name FrameSystemEventRecord (17) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase
    readonly event: Event
    readonly topics: Vec<H256>
  }

  /** @name FrameSystemEvent (19) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean
    readonly asExtrinsicSuccess: {
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo
    } & Struct
    readonly isExtrinsicFailed: boolean
    readonly asExtrinsicFailed: {
      readonly dispatchError: SpRuntimeDispatchError
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo
    } & Struct
    readonly isCodeUpdated: boolean
    readonly isNewAccount: boolean
    readonly asNewAccount: {
      readonly account: AccountId32
    } & Struct
    readonly isKilledAccount: boolean
    readonly asKilledAccount: {
      readonly account: AccountId32
    } & Struct
    readonly isRemarked: boolean
    readonly asRemarked: {
      readonly sender: AccountId32
      readonly hash_: H256
    } & Struct
    readonly type:
      | 'ExtrinsicSuccess'
      | 'ExtrinsicFailed'
      | 'CodeUpdated'
      | 'NewAccount'
      | 'KilledAccount'
      | 'Remarked'
  }

  /** @name FrameSupportDispatchDispatchInfo (20) */
  interface FrameSupportDispatchDispatchInfo extends Struct {
    readonly weight: WeightV1
    readonly class: FrameSupportDispatchDispatchClass
    readonly paysFee: FrameSupportDispatchPays
  }

  /** @name FrameSupportDispatchDispatchClass (21) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean
    readonly isOperational: boolean
    readonly isMandatory: boolean
    readonly type: 'Normal' | 'Operational' | 'Mandatory'
  }

  /** @name FrameSupportDispatchPays (22) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean
    readonly isNo: boolean
    readonly type: 'Yes' | 'No'
  }

  /** @name SpRuntimeDispatchError (23) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean
    readonly isCannotLookup: boolean
    readonly isBadOrigin: boolean
    readonly isModule: boolean
    readonly asModule: SpRuntimeModuleError
    readonly isConsumerRemaining: boolean
    readonly isNoProviders: boolean
    readonly isTooManyConsumers: boolean
    readonly isToken: boolean
    readonly asToken: SpRuntimeTokenError
    readonly isArithmetic: boolean
    readonly asArithmetic: SpRuntimeArithmeticError
    readonly isTransactional: boolean
    readonly asTransactional: SpRuntimeTransactionalError
    readonly type:
      | 'Other'
      | 'CannotLookup'
      | 'BadOrigin'
      | 'Module'
      | 'ConsumerRemaining'
      | 'NoProviders'
      | 'TooManyConsumers'
      | 'Token'
      | 'Arithmetic'
      | 'Transactional'
  }

  /** @name SpRuntimeModuleError (24) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8
    readonly error: U8aFixed
  }

  /** @name SpRuntimeTokenError (25) */
  interface SpRuntimeTokenError extends Enum {
    readonly isNoFunds: boolean
    readonly isWouldDie: boolean
    readonly isBelowMinimum: boolean
    readonly isCannotCreate: boolean
    readonly isUnknownAsset: boolean
    readonly isFrozen: boolean
    readonly isUnsupported: boolean
    readonly type:
      | 'NoFunds'
      | 'WouldDie'
      | 'BelowMinimum'
      | 'CannotCreate'
      | 'UnknownAsset'
      | 'Frozen'
      | 'Unsupported'
  }

  /** @name SpRuntimeArithmeticError (26) */
  interface SpRuntimeArithmeticError extends Enum {
    readonly isUnderflow: boolean
    readonly isOverflow: boolean
    readonly isDivisionByZero: boolean
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero'
  }

  /** @name SpRuntimeTransactionalError (27) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean
    readonly isNoLayer: boolean
    readonly type: 'LimitReached' | 'NoLayer'
  }

  /** @name PalletUtilityEvent (28) */
  interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean
    readonly asBatchInterrupted: {
      readonly index: u32
      readonly error: SpRuntimeDispatchError
    } & Struct
    readonly isBatchCompleted: boolean
    readonly isBatchCompletedWithErrors: boolean
    readonly isItemCompleted: boolean
    readonly isItemFailed: boolean
    readonly asItemFailed: {
      readonly error: SpRuntimeDispatchError
    } & Struct
    readonly isDispatchedAs: boolean
    readonly asDispatchedAs: {
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly type:
      | 'BatchInterrupted'
      | 'BatchCompleted'
      | 'BatchCompletedWithErrors'
      | 'ItemCompleted'
      | 'ItemFailed'
      | 'DispatchedAs'
  }

  /** @name PalletIndicesEvent (31) */
  interface PalletIndicesEvent extends Enum {
    readonly isIndexAssigned: boolean
    readonly asIndexAssigned: {
      readonly who: AccountId32
      readonly index: u32
    } & Struct
    readonly isIndexFreed: boolean
    readonly asIndexFreed: {
      readonly index: u32
    } & Struct
    readonly isIndexFrozen: boolean
    readonly asIndexFrozen: {
      readonly index: u32
      readonly who: AccountId32
    } & Struct
    readonly type: 'IndexAssigned' | 'IndexFreed' | 'IndexFrozen'
  }

  /** @name PalletBalancesEvent (32) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean
    readonly asEndowed: {
      readonly account: AccountId32
      readonly freeBalance: u128
    } & Struct
    readonly isDustLost: boolean
    readonly asDustLost: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly from: AccountId32
      readonly to: AccountId32
      readonly amount: u128
    } & Struct
    readonly isBalanceSet: boolean
    readonly asBalanceSet: {
      readonly who: AccountId32
      readonly free: u128
      readonly reserved: u128
    } & Struct
    readonly isReserved: boolean
    readonly asReserved: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUnreserved: boolean
    readonly asUnreserved: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isReserveRepatriated: boolean
    readonly asReserveRepatriated: {
      readonly from: AccountId32
      readonly to: AccountId32
      readonly amount: u128
      readonly destinationStatus: FrameSupportTokensMiscBalanceStatus
    } & Struct
    readonly isDeposit: boolean
    readonly asDeposit: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isWithdraw: boolean
    readonly asWithdraw: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isSlashed: boolean
    readonly asSlashed: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly type:
      | 'Endowed'
      | 'DustLost'
      | 'Transfer'
      | 'BalanceSet'
      | 'Reserved'
      | 'Unreserved'
      | 'ReserveRepatriated'
      | 'Deposit'
      | 'Withdraw'
      | 'Slashed'
  }

  /** @name FrameSupportTokensMiscBalanceStatus (33) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean
    readonly isReserved: boolean
    readonly type: 'Free' | 'Reserved'
  }

  /** @name PalletTransactionPaymentEvent (34) */
  interface PalletTransactionPaymentEvent extends Enum {
    readonly isTransactionFeePaid: boolean
    readonly asTransactionFeePaid: {
      readonly who: AccountId32
      readonly actualFee: u128
      readonly tip: u128
    } & Struct
    readonly type: 'TransactionFeePaid'
  }

  /** @name PalletElectionProviderMultiPhaseEvent (35) */
  interface PalletElectionProviderMultiPhaseEvent extends Enum {
    readonly isSolutionStored: boolean
    readonly asSolutionStored: {
      readonly compute: PalletElectionProviderMultiPhaseElectionCompute
      readonly prevEjected: bool
    } & Struct
    readonly isElectionFinalized: boolean
    readonly asElectionFinalized: {
      readonly compute: PalletElectionProviderMultiPhaseElectionCompute
      readonly score: SpNposElectionsElectionScore
    } & Struct
    readonly isElectionFailed: boolean
    readonly isRewarded: boolean
    readonly asRewarded: {
      readonly account: AccountId32
      readonly value: u128
    } & Struct
    readonly isSlashed: boolean
    readonly asSlashed: {
      readonly account: AccountId32
      readonly value: u128
    } & Struct
    readonly isSignedPhaseStarted: boolean
    readonly asSignedPhaseStarted: {
      readonly round: u32
    } & Struct
    readonly isUnsignedPhaseStarted: boolean
    readonly asUnsignedPhaseStarted: {
      readonly round: u32
    } & Struct
    readonly type:
      | 'SolutionStored'
      | 'ElectionFinalized'
      | 'ElectionFailed'
      | 'Rewarded'
      | 'Slashed'
      | 'SignedPhaseStarted'
      | 'UnsignedPhaseStarted'
  }

  /** @name PalletElectionProviderMultiPhaseElectionCompute (36) */
  interface PalletElectionProviderMultiPhaseElectionCompute extends Enum {
    readonly isOnChain: boolean
    readonly isSigned: boolean
    readonly isUnsigned: boolean
    readonly isFallback: boolean
    readonly isEmergency: boolean
    readonly type: 'OnChain' | 'Signed' | 'Unsigned' | 'Fallback' | 'Emergency'
  }

  /** @name SpNposElectionsElectionScore (38) */
  interface SpNposElectionsElectionScore extends Struct {
    readonly minimalStake: u128
    readonly sumStake: u128
    readonly sumStakeSquared: u128
  }

  /** @name PalletStakingPalletEvent (39) */
  interface PalletStakingPalletEvent extends Enum {
    readonly isEraPaid: boolean
    readonly asEraPaid: {
      readonly eraIndex: u32
      readonly validatorPayout: u128
      readonly remainder: u128
    } & Struct
    readonly isRewarded: boolean
    readonly asRewarded: {
      readonly stash: AccountId32
      readonly amount: u128
    } & Struct
    readonly isSlashed: boolean
    readonly asSlashed: {
      readonly staker: AccountId32
      readonly amount: u128
    } & Struct
    readonly isOldSlashingReportDiscarded: boolean
    readonly asOldSlashingReportDiscarded: {
      readonly sessionIndex: u32
    } & Struct
    readonly isStakersElected: boolean
    readonly isBonded: boolean
    readonly asBonded: {
      readonly stash: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUnbonded: boolean
    readonly asUnbonded: {
      readonly stash: AccountId32
      readonly amount: u128
    } & Struct
    readonly isWithdrawn: boolean
    readonly asWithdrawn: {
      readonly stash: AccountId32
      readonly amount: u128
    } & Struct
    readonly isKicked: boolean
    readonly asKicked: {
      readonly nominator: AccountId32
      readonly stash: AccountId32
    } & Struct
    readonly isStakingElectionFailed: boolean
    readonly isChilled: boolean
    readonly asChilled: {
      readonly stash: AccountId32
    } & Struct
    readonly isPayoutStarted: boolean
    readonly asPayoutStarted: {
      readonly eraIndex: u32
      readonly validatorStash: AccountId32
    } & Struct
    readonly isValidatorPrefsSet: boolean
    readonly asValidatorPrefsSet: {
      readonly stash: AccountId32
      readonly prefs: PalletStakingValidatorPrefs
    } & Struct
    readonly type:
      | 'EraPaid'
      | 'Rewarded'
      | 'Slashed'
      | 'OldSlashingReportDiscarded'
      | 'StakersElected'
      | 'Bonded'
      | 'Unbonded'
      | 'Withdrawn'
      | 'Kicked'
      | 'StakingElectionFailed'
      | 'Chilled'
      | 'PayoutStarted'
      | 'ValidatorPrefsSet'
  }

  /** @name PalletStakingValidatorPrefs (40) */
  interface PalletStakingValidatorPrefs extends Struct {
    readonly commission: Compact<Perbill>
    readonly blocked: bool
  }

  /** @name PalletStakingExtensionEvent (43) */
  interface PalletStakingExtensionEvent extends Enum {
    readonly isEndpointChanged: boolean
    readonly asEndpointChanged: ITuple<[AccountId32, Bytes]>
    readonly isNodeInfoChanged: boolean
    readonly asNodeInfoChanged: ITuple<[AccountId32, Bytes, AccountId32]>
    readonly isThresholdAccountChanged: boolean
    readonly asThresholdAccountChanged: ITuple<
      [AccountId32, PalletStakingExtensionServerInfo]
    >
    readonly isNodeInfoRemoved: boolean
    readonly asNodeInfoRemoved: AccountId32
    readonly isValidatorSyncStatus: boolean
    readonly asValidatorSyncStatus: ITuple<[AccountId32, bool]>
    readonly type:
      | 'EndpointChanged'
      | 'NodeInfoChanged'
      | 'ThresholdAccountChanged'
      | 'NodeInfoRemoved'
      | 'ValidatorSyncStatus'
  }

  /** @name PalletStakingExtensionServerInfo (44) */
  interface PalletStakingExtensionServerInfo extends Struct {
    readonly tssAccount: AccountId32
    readonly x25519PublicKey: U8aFixed
    readonly endpoint: Bytes
  }

  /** @name PalletSessionEvent (45) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean
    readonly asNewSession: {
      readonly sessionIndex: u32
    } & Struct
    readonly type: 'NewSession'
  }

  /** @name PalletDemocracyEvent (46) */
  interface PalletDemocracyEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly proposalIndex: u32
      readonly deposit: u128
    } & Struct
    readonly isTabled: boolean
    readonly asTabled: {
      readonly proposalIndex: u32
      readonly deposit: u128
      readonly depositors: Vec<AccountId32>
    } & Struct
    readonly isExternalTabled: boolean
    readonly isStarted: boolean
    readonly asStarted: {
      readonly refIndex: u32
      readonly threshold: PalletDemocracyVoteThreshold
    } & Struct
    readonly isPassed: boolean
    readonly asPassed: {
      readonly refIndex: u32
    } & Struct
    readonly isNotPassed: boolean
    readonly asNotPassed: {
      readonly refIndex: u32
    } & Struct
    readonly isCancelled: boolean
    readonly asCancelled: {
      readonly refIndex: u32
    } & Struct
    readonly isExecuted: boolean
    readonly asExecuted: {
      readonly refIndex: u32
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isDelegated: boolean
    readonly asDelegated: {
      readonly who: AccountId32
      readonly target: AccountId32
    } & Struct
    readonly isUndelegated: boolean
    readonly asUndelegated: {
      readonly account: AccountId32
    } & Struct
    readonly isVetoed: boolean
    readonly asVetoed: {
      readonly who: AccountId32
      readonly proposalHash: H256
      readonly until: u32
    } & Struct
    readonly isPreimageNoted: boolean
    readonly asPreimageNoted: {
      readonly proposalHash: H256
      readonly who: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isPreimageUsed: boolean
    readonly asPreimageUsed: {
      readonly proposalHash: H256
      readonly provider: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isPreimageInvalid: boolean
    readonly asPreimageInvalid: {
      readonly proposalHash: H256
      readonly refIndex: u32
    } & Struct
    readonly isPreimageMissing: boolean
    readonly asPreimageMissing: {
      readonly proposalHash: H256
      readonly refIndex: u32
    } & Struct
    readonly isPreimageReaped: boolean
    readonly asPreimageReaped: {
      readonly proposalHash: H256
      readonly provider: AccountId32
      readonly deposit: u128
      readonly reaper: AccountId32
    } & Struct
    readonly isBlacklisted: boolean
    readonly asBlacklisted: {
      readonly proposalHash: H256
    } & Struct
    readonly isVoted: boolean
    readonly asVoted: {
      readonly voter: AccountId32
      readonly refIndex: u32
      readonly vote: PalletDemocracyVoteAccountVote
    } & Struct
    readonly isSeconded: boolean
    readonly asSeconded: {
      readonly seconder: AccountId32
      readonly propIndex: u32
    } & Struct
    readonly isProposalCanceled: boolean
    readonly asProposalCanceled: {
      readonly propIndex: u32
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Tabled'
      | 'ExternalTabled'
      | 'Started'
      | 'Passed'
      | 'NotPassed'
      | 'Cancelled'
      | 'Executed'
      | 'Delegated'
      | 'Undelegated'
      | 'Vetoed'
      | 'PreimageNoted'
      | 'PreimageUsed'
      | 'PreimageInvalid'
      | 'PreimageMissing'
      | 'PreimageReaped'
      | 'Blacklisted'
      | 'Voted'
      | 'Seconded'
      | 'ProposalCanceled'
  }

  /** @name PalletDemocracyVoteThreshold (48) */
  interface PalletDemocracyVoteThreshold extends Enum {
    readonly isSuperMajorityApprove: boolean
    readonly isSuperMajorityAgainst: boolean
    readonly isSimpleMajority: boolean
    readonly type:
      | 'SuperMajorityApprove'
      | 'SuperMajorityAgainst'
      | 'SimpleMajority'
  }

  /** @name PalletDemocracyVoteAccountVote (49) */
  interface PalletDemocracyVoteAccountVote extends Enum {
    readonly isStandard: boolean
    readonly asStandard: {
      readonly vote: Vote
      readonly balance: u128
    } & Struct
    readonly isSplit: boolean
    readonly asSplit: {
      readonly aye: u128
      readonly nay: u128
    } & Struct
    readonly type: 'Standard' | 'Split'
  }

  /** @name PalletCollectiveEvent (51) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly account: AccountId32
      readonly proposalIndex: u32
      readonly proposalHash: H256
      readonly threshold: u32
    } & Struct
    readonly isVoted: boolean
    readonly asVoted: {
      readonly account: AccountId32
      readonly proposalHash: H256
      readonly voted: bool
      readonly yes: u32
      readonly no: u32
    } & Struct
    readonly isApproved: boolean
    readonly asApproved: {
      readonly proposalHash: H256
    } & Struct
    readonly isDisapproved: boolean
    readonly asDisapproved: {
      readonly proposalHash: H256
    } & Struct
    readonly isExecuted: boolean
    readonly asExecuted: {
      readonly proposalHash: H256
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isMemberExecuted: boolean
    readonly asMemberExecuted: {
      readonly proposalHash: H256
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isClosed: boolean
    readonly asClosed: {
      readonly proposalHash: H256
      readonly yes: u32
      readonly no: u32
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Voted'
      | 'Approved'
      | 'Disapproved'
      | 'Executed'
      | 'MemberExecuted'
      | 'Closed'
  }

  /** @name PalletElectionsPhragmenEvent (53) */
  interface PalletElectionsPhragmenEvent extends Enum {
    readonly isNewTerm: boolean
    readonly asNewTerm: {
      readonly newMembers: Vec<ITuple<[AccountId32, u128]>>
    } & Struct
    readonly isEmptyTerm: boolean
    readonly isElectionError: boolean
    readonly isMemberKicked: boolean
    readonly asMemberKicked: {
      readonly member: AccountId32
    } & Struct
    readonly isRenounced: boolean
    readonly asRenounced: {
      readonly candidate: AccountId32
    } & Struct
    readonly isCandidateSlashed: boolean
    readonly asCandidateSlashed: {
      readonly candidate: AccountId32
      readonly amount: u128
    } & Struct
    readonly isSeatHolderSlashed: boolean
    readonly asSeatHolderSlashed: {
      readonly seatHolder: AccountId32
      readonly amount: u128
    } & Struct
    readonly type:
      | 'NewTerm'
      | 'EmptyTerm'
      | 'ElectionError'
      | 'MemberKicked'
      | 'Renounced'
      | 'CandidateSlashed'
      | 'SeatHolderSlashed'
  }

  /** @name PalletMembershipEvent (56) */
  interface PalletMembershipEvent extends Enum {
    readonly isMemberAdded: boolean
    readonly isMemberRemoved: boolean
    readonly isMembersSwapped: boolean
    readonly isMembersReset: boolean
    readonly isKeyChanged: boolean
    readonly isDummy: boolean
    readonly type:
      | 'MemberAdded'
      | 'MemberRemoved'
      | 'MembersSwapped'
      | 'MembersReset'
      | 'KeyChanged'
      | 'Dummy'
  }

  /** @name PalletGrandpaEvent (57) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean
    readonly asNewAuthorities: {
      readonly authoritySet: Vec<ITuple<[SpFinalityGrandpaAppPublic, u64]>>
    } & Struct
    readonly isPaused: boolean
    readonly isResumed: boolean
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed'
  }

  /** @name SpFinalityGrandpaAppPublic (60) */
  interface SpFinalityGrandpaAppPublic extends SpCoreEd25519Public {}

  /** @name SpCoreEd25519Public (61) */
  interface SpCoreEd25519Public extends U8aFixed {}

  /** @name PalletTreasuryEvent (62) */
  interface PalletTreasuryEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly proposalIndex: u32
    } & Struct
    readonly isSpending: boolean
    readonly asSpending: {
      readonly budgetRemaining: u128
    } & Struct
    readonly isAwarded: boolean
    readonly asAwarded: {
      readonly proposalIndex: u32
      readonly award: u128
      readonly account: AccountId32
    } & Struct
    readonly isRejected: boolean
    readonly asRejected: {
      readonly proposalIndex: u32
      readonly slashed: u128
    } & Struct
    readonly isBurnt: boolean
    readonly asBurnt: {
      readonly burntFunds: u128
    } & Struct
    readonly isRollover: boolean
    readonly asRollover: {
      readonly rolloverBalance: u128
    } & Struct
    readonly isDeposit: boolean
    readonly asDeposit: {
      readonly value: u128
    } & Struct
    readonly isSpendApproved: boolean
    readonly asSpendApproved: {
      readonly proposalIndex: u32
      readonly amount: u128
      readonly beneficiary: AccountId32
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Spending'
      | 'Awarded'
      | 'Rejected'
      | 'Burnt'
      | 'Rollover'
      | 'Deposit'
      | 'SpendApproved'
  }

  /** @name PalletSudoEvent (63) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isKeyChanged: boolean
    readonly asKeyChanged: {
      readonly oldSudoer: Option<AccountId32>
    } & Struct
    readonly isSudoAsDone: boolean
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone'
  }

  /** @name PalletImOnlineEvent (65) */
  interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean
    readonly asHeartbeatReceived: {
      readonly authorityId: PalletImOnlineSr25519AppSr25519Public
    } & Struct
    readonly isAllGood: boolean
    readonly isSomeOffline: boolean
    readonly asSomeOffline: {
      readonly offline: Vec<ITuple<[AccountId32, PalletStakingExposure]>>
    } & Struct
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline'
  }

  /** @name PalletImOnlineSr25519AppSr25519Public (66) */
  interface PalletImOnlineSr25519AppSr25519Public extends SpCoreSr25519Public {}

  /** @name SpCoreSr25519Public (67) */
  interface SpCoreSr25519Public extends U8aFixed {}

  /** @name PalletStakingExposure (70) */
  interface PalletStakingExposure extends Struct {
    readonly total: Compact<u128>
    readonly own: Compact<u128>
    readonly others: Vec<PalletStakingIndividualExposure>
  }

  /** @name PalletStakingIndividualExposure (73) */
  interface PalletStakingIndividualExposure extends Struct {
    readonly who: AccountId32
    readonly value: Compact<u128>
  }

  /** @name PalletOffencesEvent (74) */
  interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean
    readonly asOffence: {
      readonly kind: U8aFixed
      readonly timeslot: Bytes
    } & Struct
    readonly type: 'Offence'
  }

  /** @name PalletIdentityEvent (76) */
  interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean
    readonly asIdentitySet: {
      readonly who: AccountId32
    } & Struct
    readonly isIdentityCleared: boolean
    readonly asIdentityCleared: {
      readonly who: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isIdentityKilled: boolean
    readonly asIdentityKilled: {
      readonly who: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isJudgementRequested: boolean
    readonly asJudgementRequested: {
      readonly who: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isJudgementUnrequested: boolean
    readonly asJudgementUnrequested: {
      readonly who: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isJudgementGiven: boolean
    readonly asJudgementGiven: {
      readonly target: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isRegistrarAdded: boolean
    readonly asRegistrarAdded: {
      readonly registrarIndex: u32
    } & Struct
    readonly isSubIdentityAdded: boolean
    readonly asSubIdentityAdded: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isSubIdentityRemoved: boolean
    readonly asSubIdentityRemoved: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isSubIdentityRevoked: boolean
    readonly asSubIdentityRevoked: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly type:
      | 'IdentitySet'
      | 'IdentityCleared'
      | 'IdentityKilled'
      | 'JudgementRequested'
      | 'JudgementUnrequested'
      | 'JudgementGiven'
      | 'RegistrarAdded'
      | 'SubIdentityAdded'
      | 'SubIdentityRemoved'
      | 'SubIdentityRevoked'
  }

  /** @name PalletSocietyEvent (77) */
  interface PalletSocietyEvent extends Enum {
    readonly isFounded: boolean
    readonly asFounded: {
      readonly founder: AccountId32
    } & Struct
    readonly isBid: boolean
    readonly asBid: {
      readonly candidateId: AccountId32
      readonly offer: u128
    } & Struct
    readonly isVouch: boolean
    readonly asVouch: {
      readonly candidateId: AccountId32
      readonly offer: u128
      readonly vouching: AccountId32
    } & Struct
    readonly isAutoUnbid: boolean
    readonly asAutoUnbid: {
      readonly candidate: AccountId32
    } & Struct
    readonly isUnbid: boolean
    readonly asUnbid: {
      readonly candidate: AccountId32
    } & Struct
    readonly isUnvouch: boolean
    readonly asUnvouch: {
      readonly candidate: AccountId32
    } & Struct
    readonly isInducted: boolean
    readonly asInducted: {
      readonly primary: AccountId32
      readonly candidates: Vec<AccountId32>
    } & Struct
    readonly isSuspendedMemberJudgement: boolean
    readonly asSuspendedMemberJudgement: {
      readonly who: AccountId32
      readonly judged: bool
    } & Struct
    readonly isCandidateSuspended: boolean
    readonly asCandidateSuspended: {
      readonly candidate: AccountId32
    } & Struct
    readonly isMemberSuspended: boolean
    readonly asMemberSuspended: {
      readonly member: AccountId32
    } & Struct
    readonly isChallenged: boolean
    readonly asChallenged: {
      readonly member: AccountId32
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly candidate: AccountId32
      readonly voter: AccountId32
      readonly vote: bool
    } & Struct
    readonly isDefenderVote: boolean
    readonly asDefenderVote: {
      readonly voter: AccountId32
      readonly vote: bool
    } & Struct
    readonly isNewMaxMembers: boolean
    readonly asNewMaxMembers: {
      readonly max: u32
    } & Struct
    readonly isUnfounded: boolean
    readonly asUnfounded: {
      readonly founder: AccountId32
    } & Struct
    readonly isDeposit: boolean
    readonly asDeposit: {
      readonly value: u128
    } & Struct
    readonly type:
      | 'Founded'
      | 'Bid'
      | 'Vouch'
      | 'AutoUnbid'
      | 'Unbid'
      | 'Unvouch'
      | 'Inducted'
      | 'SuspendedMemberJudgement'
      | 'CandidateSuspended'
      | 'MemberSuspended'
      | 'Challenged'
      | 'Vote'
      | 'DefenderVote'
      | 'NewMaxMembers'
      | 'Unfounded'
      | 'Deposit'
  }

  /** @name PalletRecoveryEvent (78) */
  interface PalletRecoveryEvent extends Enum {
    readonly isRecoveryCreated: boolean
    readonly asRecoveryCreated: {
      readonly account: AccountId32
    } & Struct
    readonly isRecoveryInitiated: boolean
    readonly asRecoveryInitiated: {
      readonly lostAccount: AccountId32
      readonly rescuerAccount: AccountId32
    } & Struct
    readonly isRecoveryVouched: boolean
    readonly asRecoveryVouched: {
      readonly lostAccount: AccountId32
      readonly rescuerAccount: AccountId32
      readonly sender: AccountId32
    } & Struct
    readonly isRecoveryClosed: boolean
    readonly asRecoveryClosed: {
      readonly lostAccount: AccountId32
      readonly rescuerAccount: AccountId32
    } & Struct
    readonly isAccountRecovered: boolean
    readonly asAccountRecovered: {
      readonly lostAccount: AccountId32
      readonly rescuerAccount: AccountId32
    } & Struct
    readonly isRecoveryRemoved: boolean
    readonly asRecoveryRemoved: {
      readonly lostAccount: AccountId32
    } & Struct
    readonly type:
      | 'RecoveryCreated'
      | 'RecoveryInitiated'
      | 'RecoveryVouched'
      | 'RecoveryClosed'
      | 'AccountRecovered'
      | 'RecoveryRemoved'
  }

  /** @name PalletVestingEvent (79) */
  interface PalletVestingEvent extends Enum {
    readonly isVestingUpdated: boolean
    readonly asVestingUpdated: {
      readonly account: AccountId32
      readonly unvested: u128
    } & Struct
    readonly isVestingCompleted: boolean
    readonly asVestingCompleted: {
      readonly account: AccountId32
    } & Struct
    readonly type: 'VestingUpdated' | 'VestingCompleted'
  }

  /** @name PalletSchedulerEvent (80) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean
    readonly asScheduled: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isCanceled: boolean
    readonly asCanceled: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isDispatched: boolean
    readonly asDispatched: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<Bytes>
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isCallLookupFailed: boolean
    readonly asCallLookupFailed: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<Bytes>
      readonly error: FrameSupportScheduleLookupError
    } & Struct
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched' | 'CallLookupFailed'
  }

  /** @name FrameSupportScheduleLookupError (83) */
  interface FrameSupportScheduleLookupError extends Enum {
    readonly isUnknown: boolean
    readonly isBadFormat: boolean
    readonly type: 'Unknown' | 'BadFormat'
  }

  /** @name PalletPreimageEvent (84) */
  interface PalletPreimageEvent extends Enum {
    readonly isNoted: boolean
    readonly asNoted: {
      readonly hash_: H256
    } & Struct
    readonly isRequested: boolean
    readonly asRequested: {
      readonly hash_: H256
    } & Struct
    readonly isCleared: boolean
    readonly asCleared: {
      readonly hash_: H256
    } & Struct
    readonly type: 'Noted' | 'Requested' | 'Cleared'
  }

  /** @name PalletProxyEvent (85) */
  interface PalletProxyEvent extends Enum {
    readonly isProxyExecuted: boolean
    readonly asProxyExecuted: {
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isPureCreated: boolean
    readonly asPureCreated: {
      readonly pure: AccountId32
      readonly who: AccountId32
      readonly proxyType: EntropyRuntimeProxyType
      readonly disambiguationIndex: u16
    } & Struct
    readonly isAnnounced: boolean
    readonly asAnnounced: {
      readonly real: AccountId32
      readonly proxy: AccountId32
      readonly callHash: H256
    } & Struct
    readonly isProxyAdded: boolean
    readonly asProxyAdded: {
      readonly delegator: AccountId32
      readonly delegatee: AccountId32
      readonly proxyType: EntropyRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isProxyRemoved: boolean
    readonly asProxyRemoved: {
      readonly delegator: AccountId32
      readonly delegatee: AccountId32
      readonly proxyType: EntropyRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly type:
      | 'ProxyExecuted'
      | 'PureCreated'
      | 'Announced'
      | 'ProxyAdded'
      | 'ProxyRemoved'
  }

  /** @name EntropyRuntimeProxyType (86) */
  interface EntropyRuntimeProxyType extends Enum {
    readonly isAny: boolean
    readonly isNonTransfer: boolean
    readonly isGovernance: boolean
    readonly isStaking: boolean
    readonly type: 'Any' | 'NonTransfer' | 'Governance' | 'Staking'
  }

  /** @name PalletMultisigEvent (88) */
  interface PalletMultisigEvent extends Enum {
    readonly isNewMultisig: boolean
    readonly asNewMultisig: {
      readonly approving: AccountId32
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly isMultisigApproval: boolean
    readonly asMultisigApproval: {
      readonly approving: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly isMultisigExecuted: boolean
    readonly asMultisigExecuted: {
      readonly approving: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isMultisigCancelled: boolean
    readonly asMultisigCancelled: {
      readonly cancelling: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly type:
      | 'NewMultisig'
      | 'MultisigApproval'
      | 'MultisigExecuted'
      | 'MultisigCancelled'
  }

  /** @name PalletMultisigTimepoint (89) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32
    readonly index: u32
  }

  /** @name PalletBountiesEvent (90) */
  interface PalletBountiesEvent extends Enum {
    readonly isBountyProposed: boolean
    readonly asBountyProposed: {
      readonly index: u32
    } & Struct
    readonly isBountyRejected: boolean
    readonly asBountyRejected: {
      readonly index: u32
      readonly bond: u128
    } & Struct
    readonly isBountyBecameActive: boolean
    readonly asBountyBecameActive: {
      readonly index: u32
    } & Struct
    readonly isBountyAwarded: boolean
    readonly asBountyAwarded: {
      readonly index: u32
      readonly beneficiary: AccountId32
    } & Struct
    readonly isBountyClaimed: boolean
    readonly asBountyClaimed: {
      readonly index: u32
      readonly payout: u128
      readonly beneficiary: AccountId32
    } & Struct
    readonly isBountyCanceled: boolean
    readonly asBountyCanceled: {
      readonly index: u32
    } & Struct
    readonly isBountyExtended: boolean
    readonly asBountyExtended: {
      readonly index: u32
    } & Struct
    readonly type:
      | 'BountyProposed'
      | 'BountyRejected'
      | 'BountyBecameActive'
      | 'BountyAwarded'
      | 'BountyClaimed'
      | 'BountyCanceled'
      | 'BountyExtended'
  }

  /** @name PalletTipsEvent (91) */
  interface PalletTipsEvent extends Enum {
    readonly isNewTip: boolean
    readonly asNewTip: {
      readonly tipHash: H256
    } & Struct
    readonly isTipClosing: boolean
    readonly asTipClosing: {
      readonly tipHash: H256
    } & Struct
    readonly isTipClosed: boolean
    readonly asTipClosed: {
      readonly tipHash: H256
      readonly who: AccountId32
      readonly payout: u128
    } & Struct
    readonly isTipRetracted: boolean
    readonly asTipRetracted: {
      readonly tipHash: H256
    } & Struct
    readonly isTipSlashed: boolean
    readonly asTipSlashed: {
      readonly tipHash: H256
      readonly finder: AccountId32
      readonly deposit: u128
    } & Struct
    readonly type:
      | 'NewTip'
      | 'TipClosing'
      | 'TipClosed'
      | 'TipRetracted'
      | 'TipSlashed'
  }

  /** @name PalletTransactionStorageEvent (92) */
  interface PalletTransactionStorageEvent extends Enum {
    readonly isStored: boolean
    readonly asStored: {
      readonly index: u32
    } & Struct
    readonly isRenewed: boolean
    readonly asRenewed: {
      readonly index: u32
    } & Struct
    readonly isProofChecked: boolean
    readonly type: 'Stored' | 'Renewed' | 'ProofChecked'
  }

  /** @name PalletBagsListEvent (93) */
  interface PalletBagsListEvent extends Enum {
    readonly isRebagged: boolean
    readonly asRebagged: {
      readonly who: AccountId32
      readonly from: u64
      readonly to: u64
    } & Struct
    readonly isScoreUpdated: boolean
    readonly asScoreUpdated: {
      readonly who: AccountId32
      readonly newScore: u64
    } & Struct
    readonly type: 'Rebagged' | 'ScoreUpdated'
  }

  /** @name PalletNominationPoolsEvent (94) */
  interface PalletNominationPoolsEvent extends Enum {
    readonly isCreated: boolean
    readonly asCreated: {
      readonly depositor: AccountId32
      readonly poolId: u32
    } & Struct
    readonly isBonded: boolean
    readonly asBonded: {
      readonly member: AccountId32
      readonly poolId: u32
      readonly bonded: u128
      readonly joined: bool
    } & Struct
    readonly isPaidOut: boolean
    readonly asPaidOut: {
      readonly member: AccountId32
      readonly poolId: u32
      readonly payout: u128
    } & Struct
    readonly isUnbonded: boolean
    readonly asUnbonded: {
      readonly member: AccountId32
      readonly poolId: u32
      readonly balance: u128
      readonly points: u128
      readonly era: u32
    } & Struct
    readonly isWithdrawn: boolean
    readonly asWithdrawn: {
      readonly member: AccountId32
      readonly poolId: u32
      readonly balance: u128
      readonly points: u128
    } & Struct
    readonly isDestroyed: boolean
    readonly asDestroyed: {
      readonly poolId: u32
    } & Struct
    readonly isStateChanged: boolean
    readonly asStateChanged: {
      readonly poolId: u32
      readonly newState: PalletNominationPoolsPoolState
    } & Struct
    readonly isMemberRemoved: boolean
    readonly asMemberRemoved: {
      readonly poolId: u32
      readonly member: AccountId32
    } & Struct
    readonly isRolesUpdated: boolean
    readonly asRolesUpdated: {
      readonly root: Option<AccountId32>
      readonly stateToggler: Option<AccountId32>
      readonly nominator: Option<AccountId32>
    } & Struct
    readonly isPoolSlashed: boolean
    readonly asPoolSlashed: {
      readonly poolId: u32
      readonly balance: u128
    } & Struct
    readonly isUnbondingPoolSlashed: boolean
    readonly asUnbondingPoolSlashed: {
      readonly poolId: u32
      readonly era: u32
      readonly balance: u128
    } & Struct
    readonly type:
      | 'Created'
      | 'Bonded'
      | 'PaidOut'
      | 'Unbonded'
      | 'Withdrawn'
      | 'Destroyed'
      | 'StateChanged'
      | 'MemberRemoved'
      | 'RolesUpdated'
      | 'PoolSlashed'
      | 'UnbondingPoolSlashed'
  }

  /** @name PalletNominationPoolsPoolState (95) */
  interface PalletNominationPoolsPoolState extends Enum {
    readonly isOpen: boolean
    readonly isBlocked: boolean
    readonly isDestroying: boolean
    readonly type: 'Open' | 'Blocked' | 'Destroying'
  }

  /** @name PalletPropagationEvent (96) */
  interface PalletPropagationEvent extends Enum {
    readonly isMessagesPassed: boolean
    readonly asMessagesPassed: Vec<EntropySharedMessage>
    readonly type: 'MessagesPassed'
  }

  /** @name EntropySharedMessage (98) */
  interface EntropySharedMessage extends Struct {
    readonly sigRequest: EntropySharedSigRequest
    readonly account: Bytes
    readonly ipAddresses: Vec<Bytes>
  }

  /** @name EntropySharedSigRequest (99) */
  interface EntropySharedSigRequest extends Struct {
    readonly sigHash: Bytes
  }

  /** @name PalletRelayerEvent (101) */
  interface PalletRelayerEvent extends Enum {
    readonly isSignatureRequested: boolean
    readonly asSignatureRequested: EntropySharedMessage
    readonly isSignalRegister: boolean
    readonly asSignalRegister: AccountId32
    readonly isAccountRegistering: boolean
    readonly asAccountRegistering: ITuple<[AccountId32, u8]>
    readonly isAccountRegistered: boolean
    readonly asAccountRegistered: AccountId32
    readonly isConfirmedDone: boolean
    readonly asConfirmedDone: ITuple<[AccountId32, u32, Vec<u32>]>
    readonly type:
      | 'SignatureRequested'
      | 'SignalRegister'
      | 'AccountRegistering'
      | 'AccountRegistered'
      | 'ConfirmedDone'
  }

  /** @name PalletSlashingEvent (103) */
  interface PalletSlashingEvent extends Enum {
    readonly isOffence: boolean
    readonly asOffence: ITuple<[AccountId32, Vec<AccountId32>]>
    readonly type: 'Offence'
  }

  /** @name PalletConstraintsEvent (104) */
  interface PalletConstraintsEvent extends Enum {
    readonly isConstraintsUpdated: boolean
    readonly asConstraintsUpdated: ITuple<
      [AccountId32, EntropySharedConstraints]
    >
    readonly type: 'ConstraintsUpdated'
  }

  /** @name EntropySharedConstraints (105) */
  interface EntropySharedConstraints extends Struct {
    readonly evmAcl: Option<EntropySharedConstraintsAclH160>
    readonly btcAcl: Option<EntropySharedConstraintsAclH256>
  }

  /** @name EntropySharedConstraintsAclH160 (107) */
  interface EntropySharedConstraintsAclH160 extends Struct {
    readonly addresses: Vec<H160>
    readonly kind: EntropySharedConstraintsAclAclKind
    readonly allowNullRecipient: bool
  }

  /** @name EntropySharedConstraintsAclAclKind (111) */
  interface EntropySharedConstraintsAclAclKind extends Enum {
    readonly isAllow: boolean
    readonly isDeny: boolean
    readonly type: 'Allow' | 'Deny'
  }

  /** @name EntropySharedConstraintsAclH256 (113) */
  interface EntropySharedConstraintsAclH256 extends Struct {
    readonly addresses: Vec<H256>
    readonly kind: EntropySharedConstraintsAclAclKind
    readonly allowNullRecipient: bool
  }

  /** @name PalletTransactionPauseModuleEvent (115) */
  interface PalletTransactionPauseModuleEvent extends Enum {
    readonly isTransactionPaused: boolean
    readonly asTransactionPaused: {
      readonly palletNameBytes: Bytes
      readonly functionNameBytes: Bytes
    } & Struct
    readonly isTransactionUnpaused: boolean
    readonly asTransactionUnpaused: {
      readonly palletNameBytes: Bytes
      readonly functionNameBytes: Bytes
    } & Struct
    readonly type: 'TransactionPaused' | 'TransactionUnpaused'
  }

  /** @name PalletFreeTxEvent (116) */
  interface PalletFreeTxEvent extends Enum {
    readonly isElectricitySpent: boolean
    readonly asElectricitySpent: ITuple<
      [AccountId32, Result<Null, SpRuntimeDispatchError>]
    >
    readonly type: 'ElectricitySpent'
  }

  /** @name FrameSystemPhase (117) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean
    readonly asApplyExtrinsic: u32
    readonly isFinalization: boolean
    readonly isInitialization: boolean
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization'
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (119) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>
    readonly specName: Text
  }

  /** @name FrameSystemCall (122) */
  interface FrameSystemCall extends Enum {
    readonly isFillBlock: boolean
    readonly asFillBlock: {
      readonly ratio: Perbill
    } & Struct
    readonly isRemark: boolean
    readonly asRemark: {
      readonly remark: Bytes
    } & Struct
    readonly isSetHeapPages: boolean
    readonly asSetHeapPages: {
      readonly pages: u64
    } & Struct
    readonly isSetCode: boolean
    readonly asSetCode: {
      readonly code: Bytes
    } & Struct
    readonly isSetCodeWithoutChecks: boolean
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes
    } & Struct
    readonly isSetStorage: boolean
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>
    } & Struct
    readonly isKillStorage: boolean
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>
    } & Struct
    readonly isKillPrefix: boolean
    readonly asKillPrefix: {
      readonly prefix: Bytes
      readonly subkeys: u32
    } & Struct
    readonly isRemarkWithEvent: boolean
    readonly asRemarkWithEvent: {
      readonly remark: Bytes
    } & Struct
    readonly type:
      | 'FillBlock'
      | 'Remark'
      | 'SetHeapPages'
      | 'SetCode'
      | 'SetCodeWithoutChecks'
      | 'SetStorage'
      | 'KillStorage'
      | 'KillPrefix'
      | 'RemarkWithEvent'
  }

  /** @name FrameSystemLimitsBlockWeights (125) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: WeightV1
    readonly maxBlock: WeightV1
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (126) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass
    readonly operational: FrameSystemLimitsWeightsPerClass
    readonly mandatory: FrameSystemLimitsWeightsPerClass
  }

  /** @name FrameSystemLimitsWeightsPerClass (127) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: WeightV1
    readonly maxExtrinsic: Option<WeightV1>
    readonly maxTotal: Option<WeightV1>
    readonly reserved: Option<WeightV1>
  }

  /** @name FrameSystemLimitsBlockLength (129) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (130) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32
    readonly operational: u32
    readonly mandatory: u32
  }

  /** @name SpWeightsRuntimeDbWeight (131) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64
    readonly write: u64
  }

  /** @name SpVersionRuntimeVersion (132) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text
    readonly implName: Text
    readonly authoringVersion: u32
    readonly specVersion: u32
    readonly implVersion: u32
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>
    readonly transactionVersion: u32
    readonly stateVersion: u8
  }

  /** @name FrameSystemError (137) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean
    readonly isSpecVersionNeedsToIncrease: boolean
    readonly isFailedToExtractRuntimeVersion: boolean
    readonly isNonDefaultComposite: boolean
    readonly isNonZeroRefCount: boolean
    readonly isCallFiltered: boolean
    readonly type:
      | 'InvalidSpecName'
      | 'SpecVersionNeedsToIncrease'
      | 'FailedToExtractRuntimeVersion'
      | 'NonDefaultComposite'
      | 'NonZeroRefCount'
      | 'CallFiltered'
  }

  /** @name PalletUtilityCall (138) */
  interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean
    readonly asBatch: {
      readonly calls: Vec<Call>
    } & Struct
    readonly isAsDerivative: boolean
    readonly asAsDerivative: {
      readonly index: u16
      readonly call: Call
    } & Struct
    readonly isBatchAll: boolean
    readonly asBatchAll: {
      readonly calls: Vec<Call>
    } & Struct
    readonly isDispatchAs: boolean
    readonly asDispatchAs: {
      readonly asOrigin: EntropyRuntimeOriginCaller
      readonly call: Call
    } & Struct
    readonly isForceBatch: boolean
    readonly asForceBatch: {
      readonly calls: Vec<Call>
    } & Struct
    readonly type:
      | 'Batch'
      | 'AsDerivative'
      | 'BatchAll'
      | 'DispatchAs'
      | 'ForceBatch'
  }

  /** @name PalletBabeCall (141) */
  interface PalletBabeCall extends Enum {
    readonly isReportEquivocation: boolean
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof
      readonly keyOwnerProof: SpSessionMembershipProof
    } & Struct
    readonly isReportEquivocationUnsigned: boolean
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof
      readonly keyOwnerProof: SpSessionMembershipProof
    } & Struct
    readonly isPlanConfigChange: boolean
    readonly asPlanConfigChange: {
      readonly config: SpConsensusBabeDigestsNextConfigDescriptor
    } & Struct
    readonly type:
      | 'ReportEquivocation'
      | 'ReportEquivocationUnsigned'
      | 'PlanConfigChange'
  }

  /** @name SpConsensusSlotsEquivocationProof (142) */
  interface SpConsensusSlotsEquivocationProof extends Struct {
    readonly offender: SpConsensusBabeAppPublic
    readonly slot: u64
    readonly firstHeader: SpRuntimeHeader
    readonly secondHeader: SpRuntimeHeader
  }

  /** @name SpRuntimeHeader (143) */
  interface SpRuntimeHeader extends Struct {
    readonly parentHash: H256
    readonly number: Compact<u32>
    readonly stateRoot: H256
    readonly extrinsicsRoot: H256
    readonly digest: SpRuntimeDigest
  }

  /** @name SpRuntimeBlakeTwo256 (144) */
  type SpRuntimeBlakeTwo256 = Null

  /** @name SpConsensusBabeAppPublic (145) */
  interface SpConsensusBabeAppPublic extends SpCoreSr25519Public {}

  /** @name SpSessionMembershipProof (147) */
  interface SpSessionMembershipProof extends Struct {
    readonly session: u32
    readonly trieNodes: Vec<Bytes>
    readonly validatorCount: u32
  }

  /** @name SpConsensusBabeDigestsNextConfigDescriptor (148) */
  interface SpConsensusBabeDigestsNextConfigDescriptor extends Enum {
    readonly isV1: boolean
    readonly asV1: {
      readonly c: ITuple<[u64, u64]>
      readonly allowedSlots: SpConsensusBabeAllowedSlots
    } & Struct
    readonly type: 'V1'
  }

  /** @name SpConsensusBabeAllowedSlots (150) */
  interface SpConsensusBabeAllowedSlots extends Enum {
    readonly isPrimarySlots: boolean
    readonly isPrimaryAndSecondaryPlainSlots: boolean
    readonly isPrimaryAndSecondaryVRFSlots: boolean
    readonly type:
      | 'PrimarySlots'
      | 'PrimaryAndSecondaryPlainSlots'
      | 'PrimaryAndSecondaryVRFSlots'
  }

  /** @name PalletTimestampCall (151) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean
    readonly asSet: {
      readonly now: Compact<u64>
    } & Struct
    readonly type: 'Set'
  }

  /** @name PalletAuthorshipCall (153) */
  interface PalletAuthorshipCall extends Enum {
    readonly isSetUncles: boolean
    readonly asSetUncles: {
      readonly newUncles: Vec<SpRuntimeHeader>
    } & Struct
    readonly type: 'SetUncles'
  }

  /** @name PalletIndicesCall (155) */
  interface PalletIndicesCall extends Enum {
    readonly isClaim: boolean
    readonly asClaim: {
      readonly index: u32
    } & Struct
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly new_: MultiAddress
      readonly index: u32
    } & Struct
    readonly isFree: boolean
    readonly asFree: {
      readonly index: u32
    } & Struct
    readonly isForceTransfer: boolean
    readonly asForceTransfer: {
      readonly new_: MultiAddress
      readonly index: u32
      readonly freeze: bool
    } & Struct
    readonly isFreeze: boolean
    readonly asFreeze: {
      readonly index: u32
    } & Struct
    readonly type: 'Claim' | 'Transfer' | 'Free' | 'ForceTransfer' | 'Freeze'
  }

  /** @name PalletBalancesCall (157) */
  interface PalletBalancesCall extends Enum {
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isSetBalance: boolean
    readonly asSetBalance: {
      readonly who: MultiAddress
      readonly newFree: Compact<u128>
      readonly newReserved: Compact<u128>
    } & Struct
    readonly isForceTransfer: boolean
    readonly asForceTransfer: {
      readonly source: MultiAddress
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isTransferKeepAlive: boolean
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isTransferAll: boolean
    readonly asTransferAll: {
      readonly dest: MultiAddress
      readonly keepAlive: bool
    } & Struct
    readonly isForceUnreserve: boolean
    readonly asForceUnreserve: {
      readonly who: MultiAddress
      readonly amount: u128
    } & Struct
    readonly type:
      | 'Transfer'
      | 'SetBalance'
      | 'ForceTransfer'
      | 'TransferKeepAlive'
      | 'TransferAll'
      | 'ForceUnreserve'
  }

  /** @name PalletElectionProviderMultiPhaseCall (158) */
  interface PalletElectionProviderMultiPhaseCall extends Enum {
    readonly isSubmitUnsigned: boolean
    readonly asSubmitUnsigned: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution
      readonly witness: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize
    } & Struct
    readonly isSetMinimumUntrustedScore: boolean
    readonly asSetMinimumUntrustedScore: {
      readonly maybeNextScore: Option<SpNposElectionsElectionScore>
    } & Struct
    readonly isSetEmergencyElectionResult: boolean
    readonly asSetEmergencyElectionResult: {
      readonly supports: Vec<ITuple<[AccountId32, SpNposElectionsSupport]>>
    } & Struct
    readonly isSubmit: boolean
    readonly asSubmit: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution
    } & Struct
    readonly isGovernanceFallback: boolean
    readonly asGovernanceFallback: {
      readonly maybeMaxVoters: Option<u32>
      readonly maybeMaxTargets: Option<u32>
    } & Struct
    readonly type:
      | 'SubmitUnsigned'
      | 'SetMinimumUntrustedScore'
      | 'SetEmergencyElectionResult'
      | 'Submit'
      | 'GovernanceFallback'
  }

  /** @name PalletElectionProviderMultiPhaseRawSolution (159) */
  interface PalletElectionProviderMultiPhaseRawSolution extends Struct {
    readonly solution: EntropyRuntimeNposSolution16
    readonly score: SpNposElectionsElectionScore
    readonly round: u32
  }

  /** @name EntropyRuntimeNposSolution16 (160) */
  interface EntropyRuntimeNposSolution16 extends Struct {
    readonly votes1: Vec<ITuple<[Compact<u32>, Compact<u16>]>>
    readonly votes2: Vec<
      ITuple<
        [Compact<u32>, ITuple<[Compact<u16>, Compact<PerU16>]>, Compact<u16>]
      >
    >
    readonly votes3: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes4: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes5: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes6: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes7: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes8: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes9: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes10: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes11: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes12: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes13: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes14: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes15: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
    readonly votes16: Vec<
      ITuple<
        [
          Compact<u32>,
          Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>,
          Compact<u16>
        ]
      >
    >
  }

  /** @name PalletElectionProviderMultiPhaseSolutionOrSnapshotSize (211) */
  interface PalletElectionProviderMultiPhaseSolutionOrSnapshotSize
    extends Struct {
    readonly voters: Compact<u32>
    readonly targets: Compact<u32>
  }

  /** @name SpNposElectionsSupport (215) */
  interface SpNposElectionsSupport extends Struct {
    readonly total: u128
    readonly voters: Vec<ITuple<[AccountId32, u128]>>
  }

  /** @name PalletStakingPalletCall (217) */
  interface PalletStakingPalletCall extends Enum {
    readonly isBond: boolean
    readonly asBond: {
      readonly controller: MultiAddress
      readonly value: Compact<u128>
      readonly payee: PalletStakingRewardDestination
    } & Struct
    readonly isBondExtra: boolean
    readonly asBondExtra: {
      readonly maxAdditional: Compact<u128>
    } & Struct
    readonly isUnbond: boolean
    readonly asUnbond: {
      readonly value: Compact<u128>
    } & Struct
    readonly isWithdrawUnbonded: boolean
    readonly asWithdrawUnbonded: {
      readonly numSlashingSpans: u32
    } & Struct
    readonly isValidate: boolean
    readonly asValidate: {
      readonly prefs: PalletStakingValidatorPrefs
    } & Struct
    readonly isNominate: boolean
    readonly asNominate: {
      readonly targets: Vec<MultiAddress>
    } & Struct
    readonly isChill: boolean
    readonly isSetPayee: boolean
    readonly asSetPayee: {
      readonly payee: PalletStakingRewardDestination
    } & Struct
    readonly isSetController: boolean
    readonly asSetController: {
      readonly controller: MultiAddress
    } & Struct
    readonly isSetValidatorCount: boolean
    readonly asSetValidatorCount: {
      readonly new_: Compact<u32>
    } & Struct
    readonly isIncreaseValidatorCount: boolean
    readonly asIncreaseValidatorCount: {
      readonly additional: Compact<u32>
    } & Struct
    readonly isScaleValidatorCount: boolean
    readonly asScaleValidatorCount: {
      readonly factor: Percent
    } & Struct
    readonly isForceNoEras: boolean
    readonly isForceNewEra: boolean
    readonly isSetInvulnerables: boolean
    readonly asSetInvulnerables: {
      readonly invulnerables: Vec<AccountId32>
    } & Struct
    readonly isForceUnstake: boolean
    readonly asForceUnstake: {
      readonly stash: AccountId32
      readonly numSlashingSpans: u32
    } & Struct
    readonly isForceNewEraAlways: boolean
    readonly isCancelDeferredSlash: boolean
    readonly asCancelDeferredSlash: {
      readonly era: u32
      readonly slashIndices: Vec<u32>
    } & Struct
    readonly isPayoutStakers: boolean
    readonly asPayoutStakers: {
      readonly validatorStash: AccountId32
      readonly era: u32
    } & Struct
    readonly isRebond: boolean
    readonly asRebond: {
      readonly value: Compact<u128>
    } & Struct
    readonly isReapStash: boolean
    readonly asReapStash: {
      readonly stash: AccountId32
      readonly numSlashingSpans: u32
    } & Struct
    readonly isKick: boolean
    readonly asKick: {
      readonly who: Vec<MultiAddress>
    } & Struct
    readonly isSetStakingConfigs: boolean
    readonly asSetStakingConfigs: {
      readonly minNominatorBond: PalletStakingPalletConfigOpU128
      readonly minValidatorBond: PalletStakingPalletConfigOpU128
      readonly maxNominatorCount: PalletStakingPalletConfigOpU32
      readonly maxValidatorCount: PalletStakingPalletConfigOpU32
      readonly chillThreshold: PalletStakingPalletConfigOpPercent
      readonly minCommission: PalletStakingPalletConfigOpPerbill
    } & Struct
    readonly isChillOther: boolean
    readonly asChillOther: {
      readonly controller: AccountId32
    } & Struct
    readonly isForceApplyMinCommission: boolean
    readonly asForceApplyMinCommission: {
      readonly validatorStash: AccountId32
    } & Struct
    readonly type:
      | 'Bond'
      | 'BondExtra'
      | 'Unbond'
      | 'WithdrawUnbonded'
      | 'Validate'
      | 'Nominate'
      | 'Chill'
      | 'SetPayee'
      | 'SetController'
      | 'SetValidatorCount'
      | 'IncreaseValidatorCount'
      | 'ScaleValidatorCount'
      | 'ForceNoEras'
      | 'ForceNewEra'
      | 'SetInvulnerables'
      | 'ForceUnstake'
      | 'ForceNewEraAlways'
      | 'CancelDeferredSlash'
      | 'PayoutStakers'
      | 'Rebond'
      | 'ReapStash'
      | 'Kick'
      | 'SetStakingConfigs'
      | 'ChillOther'
      | 'ForceApplyMinCommission'
  }

  /** @name PalletStakingRewardDestination (218) */
  interface PalletStakingRewardDestination extends Enum {
    readonly isStaked: boolean
    readonly isStash: boolean
    readonly isController: boolean
    readonly isAccount: boolean
    readonly asAccount: AccountId32
    readonly isNone: boolean
    readonly type: 'Staked' | 'Stash' | 'Controller' | 'Account' | 'None'
  }

  /** @name PalletStakingPalletConfigOpU128 (221) */
  interface PalletStakingPalletConfigOpU128 extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: u128
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletStakingPalletConfigOpU32 (222) */
  interface PalletStakingPalletConfigOpU32 extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: u32
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletStakingPalletConfigOpPercent (223) */
  interface PalletStakingPalletConfigOpPercent extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: Percent
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletStakingPalletConfigOpPerbill (224) */
  interface PalletStakingPalletConfigOpPerbill extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: Perbill
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletStakingExtensionCall (225) */
  interface PalletStakingExtensionCall extends Enum {
    readonly isChangeEndpoint: boolean
    readonly asChangeEndpoint: {
      readonly endpoint: Bytes
    } & Struct
    readonly isChangeThresholdAccounts: boolean
    readonly asChangeThresholdAccounts: {
      readonly tssAccount: AccountId32
      readonly x25519PublicKey: U8aFixed
    } & Struct
    readonly isWithdrawUnbonded: boolean
    readonly asWithdrawUnbonded: {
      readonly numSlashingSpans: u32
    } & Struct
    readonly isValidate: boolean
    readonly asValidate: {
      readonly prefs: PalletStakingValidatorPrefs
      readonly endpoint: Bytes
      readonly tssAccount: AccountId32
      readonly x25519PublicKey: U8aFixed
    } & Struct
    readonly isDeclareSynced: boolean
    readonly asDeclareSynced: {
      readonly synced: bool
    } & Struct
    readonly type:
      | 'ChangeEndpoint'
      | 'ChangeThresholdAccounts'
      | 'WithdrawUnbonded'
      | 'Validate'
      | 'DeclareSynced'
  }

  /** @name PalletSessionCall (226) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean
    readonly asSetKeys: {
      readonly keys_: EntropyRuntimeSessionKeys
      readonly proof: Bytes
    } & Struct
    readonly isPurgeKeys: boolean
    readonly type: 'SetKeys' | 'PurgeKeys'
  }

  /** @name EntropyRuntimeSessionKeys (227) */
  interface EntropyRuntimeSessionKeys extends Struct {
    readonly grandpa: SpFinalityGrandpaAppPublic
    readonly babe: SpConsensusBabeAppPublic
    readonly imOnline: PalletImOnlineSr25519AppSr25519Public
    readonly authorityDiscovery: SpAuthorityDiscoveryAppPublic
  }

  /** @name SpAuthorityDiscoveryAppPublic (228) */
  interface SpAuthorityDiscoveryAppPublic extends SpCoreSr25519Public {}

  /** @name PalletDemocracyCall (229) */
  interface PalletDemocracyCall extends Enum {
    readonly isPropose: boolean
    readonly asPropose: {
      readonly proposalHash: H256
      readonly value: Compact<u128>
    } & Struct
    readonly isSecond: boolean
    readonly asSecond: {
      readonly proposal: Compact<u32>
      readonly secondsUpperBound: Compact<u32>
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly refIndex: Compact<u32>
      readonly vote: PalletDemocracyVoteAccountVote
    } & Struct
    readonly isEmergencyCancel: boolean
    readonly asEmergencyCancel: {
      readonly refIndex: u32
    } & Struct
    readonly isExternalPropose: boolean
    readonly asExternalPropose: {
      readonly proposalHash: H256
    } & Struct
    readonly isExternalProposeMajority: boolean
    readonly asExternalProposeMajority: {
      readonly proposalHash: H256
    } & Struct
    readonly isExternalProposeDefault: boolean
    readonly asExternalProposeDefault: {
      readonly proposalHash: H256
    } & Struct
    readonly isFastTrack: boolean
    readonly asFastTrack: {
      readonly proposalHash: H256
      readonly votingPeriod: u32
      readonly delay: u32
    } & Struct
    readonly isVetoExternal: boolean
    readonly asVetoExternal: {
      readonly proposalHash: H256
    } & Struct
    readonly isCancelReferendum: boolean
    readonly asCancelReferendum: {
      readonly refIndex: Compact<u32>
    } & Struct
    readonly isCancelQueued: boolean
    readonly asCancelQueued: {
      readonly which: u32
    } & Struct
    readonly isDelegate: boolean
    readonly asDelegate: {
      readonly to: MultiAddress
      readonly conviction: PalletDemocracyConviction
      readonly balance: u128
    } & Struct
    readonly isUndelegate: boolean
    readonly isClearPublicProposals: boolean
    readonly isNotePreimage: boolean
    readonly asNotePreimage: {
      readonly encodedProposal: Bytes
    } & Struct
    readonly isNotePreimageOperational: boolean
    readonly asNotePreimageOperational: {
      readonly encodedProposal: Bytes
    } & Struct
    readonly isNoteImminentPreimage: boolean
    readonly asNoteImminentPreimage: {
      readonly encodedProposal: Bytes
    } & Struct
    readonly isNoteImminentPreimageOperational: boolean
    readonly asNoteImminentPreimageOperational: {
      readonly encodedProposal: Bytes
    } & Struct
    readonly isReapPreimage: boolean
    readonly asReapPreimage: {
      readonly proposalHash: H256
      readonly proposalLenUpperBound: Compact<u32>
    } & Struct
    readonly isUnlock: boolean
    readonly asUnlock: {
      readonly target: MultiAddress
    } & Struct
    readonly isRemoveVote: boolean
    readonly asRemoveVote: {
      readonly index: u32
    } & Struct
    readonly isRemoveOtherVote: boolean
    readonly asRemoveOtherVote: {
      readonly target: MultiAddress
      readonly index: u32
    } & Struct
    readonly isEnactProposal: boolean
    readonly asEnactProposal: {
      readonly proposalHash: H256
      readonly index: u32
    } & Struct
    readonly isBlacklist: boolean
    readonly asBlacklist: {
      readonly proposalHash: H256
      readonly maybeRefIndex: Option<u32>
    } & Struct
    readonly isCancelProposal: boolean
    readonly asCancelProposal: {
      readonly propIndex: Compact<u32>
    } & Struct
    readonly type:
      | 'Propose'
      | 'Second'
      | 'Vote'
      | 'EmergencyCancel'
      | 'ExternalPropose'
      | 'ExternalProposeMajority'
      | 'ExternalProposeDefault'
      | 'FastTrack'
      | 'VetoExternal'
      | 'CancelReferendum'
      | 'CancelQueued'
      | 'Delegate'
      | 'Undelegate'
      | 'ClearPublicProposals'
      | 'NotePreimage'
      | 'NotePreimageOperational'
      | 'NoteImminentPreimage'
      | 'NoteImminentPreimageOperational'
      | 'ReapPreimage'
      | 'Unlock'
      | 'RemoveVote'
      | 'RemoveOtherVote'
      | 'EnactProposal'
      | 'Blacklist'
      | 'CancelProposal'
  }

  /** @name PalletDemocracyConviction (230) */
  interface PalletDemocracyConviction extends Enum {
    readonly isNone: boolean
    readonly isLocked1x: boolean
    readonly isLocked2x: boolean
    readonly isLocked3x: boolean
    readonly isLocked4x: boolean
    readonly isLocked5x: boolean
    readonly isLocked6x: boolean
    readonly type:
      | 'None'
      | 'Locked1x'
      | 'Locked2x'
      | 'Locked3x'
      | 'Locked4x'
      | 'Locked5x'
      | 'Locked6x'
  }

  /** @name PalletCollectiveCall (231) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>
      readonly prime: Option<AccountId32>
      readonly oldCount: u32
    } & Struct
    readonly isExecute: boolean
    readonly asExecute: {
      readonly proposal: Call
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly isPropose: boolean
    readonly asPropose: {
      readonly threshold: Compact<u32>
      readonly proposal: Call
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly proposal: H256
      readonly index: Compact<u32>
      readonly approve: bool
    } & Struct
    readonly isClose: boolean
    readonly asClose: {
      readonly proposalHash: H256
      readonly index: Compact<u32>
      readonly proposalWeightBound: Compact<WeightV1>
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly isDisapproveProposal: boolean
    readonly asDisapproveProposal: {
      readonly proposalHash: H256
    } & Struct
    readonly type:
      | 'SetMembers'
      | 'Execute'
      | 'Propose'
      | 'Vote'
      | 'Close'
      | 'DisapproveProposal'
  }

  /** @name PalletElectionsPhragmenCall (234) */
  interface PalletElectionsPhragmenCall extends Enum {
    readonly isVote: boolean
    readonly asVote: {
      readonly votes: Vec<AccountId32>
      readonly value: Compact<u128>
    } & Struct
    readonly isRemoveVoter: boolean
    readonly isSubmitCandidacy: boolean
    readonly asSubmitCandidacy: {
      readonly candidateCount: Compact<u32>
    } & Struct
    readonly isRenounceCandidacy: boolean
    readonly asRenounceCandidacy: {
      readonly renouncing: PalletElectionsPhragmenRenouncing
    } & Struct
    readonly isRemoveMember: boolean
    readonly asRemoveMember: {
      readonly who: MultiAddress
      readonly slashBond: bool
      readonly rerunElection: bool
    } & Struct
    readonly isCleanDefunctVoters: boolean
    readonly asCleanDefunctVoters: {
      readonly numVoters: u32
      readonly numDefunct: u32
    } & Struct
    readonly type:
      | 'Vote'
      | 'RemoveVoter'
      | 'SubmitCandidacy'
      | 'RenounceCandidacy'
      | 'RemoveMember'
      | 'CleanDefunctVoters'
  }

  /** @name PalletElectionsPhragmenRenouncing (235) */
  interface PalletElectionsPhragmenRenouncing extends Enum {
    readonly isMember: boolean
    readonly isRunnerUp: boolean
    readonly isCandidate: boolean
    readonly asCandidate: Compact<u32>
    readonly type: 'Member' | 'RunnerUp' | 'Candidate'
  }

  /** @name PalletMembershipCall (236) */
  interface PalletMembershipCall extends Enum {
    readonly isAddMember: boolean
    readonly asAddMember: {
      readonly who: MultiAddress
    } & Struct
    readonly isRemoveMember: boolean
    readonly asRemoveMember: {
      readonly who: MultiAddress
    } & Struct
    readonly isSwapMember: boolean
    readonly asSwapMember: {
      readonly remove: MultiAddress
      readonly add: MultiAddress
    } & Struct
    readonly isResetMembers: boolean
    readonly asResetMembers: {
      readonly members: Vec<AccountId32>
    } & Struct
    readonly isChangeKey: boolean
    readonly asChangeKey: {
      readonly new_: MultiAddress
    } & Struct
    readonly isSetPrime: boolean
    readonly asSetPrime: {
      readonly who: MultiAddress
    } & Struct
    readonly isClearPrime: boolean
    readonly type:
      | 'AddMember'
      | 'RemoveMember'
      | 'SwapMember'
      | 'ResetMembers'
      | 'ChangeKey'
      | 'SetPrime'
      | 'ClearPrime'
  }

  /** @name PalletGrandpaCall (237) */
  interface PalletGrandpaCall extends Enum {
    readonly isReportEquivocation: boolean
    readonly asReportEquivocation: {
      readonly equivocationProof: SpFinalityGrandpaEquivocationProof
      readonly keyOwnerProof: SpSessionMembershipProof
    } & Struct
    readonly isReportEquivocationUnsigned: boolean
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpFinalityGrandpaEquivocationProof
      readonly keyOwnerProof: SpSessionMembershipProof
    } & Struct
    readonly isNoteStalled: boolean
    readonly asNoteStalled: {
      readonly delay: u32
      readonly bestFinalizedBlockNumber: u32
    } & Struct
    readonly type:
      | 'ReportEquivocation'
      | 'ReportEquivocationUnsigned'
      | 'NoteStalled'
  }

  /** @name SpFinalityGrandpaEquivocationProof (238) */
  interface SpFinalityGrandpaEquivocationProof extends Struct {
    readonly setId: u64
    readonly equivocation: SpFinalityGrandpaEquivocation
  }

  /** @name SpFinalityGrandpaEquivocation (239) */
  interface SpFinalityGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean
    readonly asPrevote: FinalityGrandpaEquivocationPrevote
    readonly isPrecommit: boolean
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit
    readonly type: 'Prevote' | 'Precommit'
  }

  /** @name FinalityGrandpaEquivocationPrevote (240) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64
    readonly identity: SpFinalityGrandpaAppPublic
    readonly first: ITuple<
      [FinalityGrandpaPrevote, SpFinalityGrandpaAppSignature]
    >
    readonly second: ITuple<
      [FinalityGrandpaPrevote, SpFinalityGrandpaAppSignature]
    >
  }

  /** @name FinalityGrandpaPrevote (241) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256
    readonly targetNumber: u32
  }

  /** @name SpFinalityGrandpaAppSignature (242) */
  interface SpFinalityGrandpaAppSignature extends SpCoreEd25519Signature {}

  /** @name SpCoreEd25519Signature (243) */
  interface SpCoreEd25519Signature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (246) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64
    readonly identity: SpFinalityGrandpaAppPublic
    readonly first: ITuple<
      [FinalityGrandpaPrecommit, SpFinalityGrandpaAppSignature]
    >
    readonly second: ITuple<
      [FinalityGrandpaPrecommit, SpFinalityGrandpaAppSignature]
    >
  }

  /** @name FinalityGrandpaPrecommit (247) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256
    readonly targetNumber: u32
  }

  /** @name PalletTreasuryCall (249) */
  interface PalletTreasuryCall extends Enum {
    readonly isProposeSpend: boolean
    readonly asProposeSpend: {
      readonly value: Compact<u128>
      readonly beneficiary: MultiAddress
    } & Struct
    readonly isRejectProposal: boolean
    readonly asRejectProposal: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly isApproveProposal: boolean
    readonly asApproveProposal: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly isSpend: boolean
    readonly asSpend: {
      readonly amount: Compact<u128>
      readonly beneficiary: MultiAddress
    } & Struct
    readonly isRemoveApproval: boolean
    readonly asRemoveApproval: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly type:
      | 'ProposeSpend'
      | 'RejectProposal'
      | 'ApproveProposal'
      | 'Spend'
      | 'RemoveApproval'
  }

  /** @name PalletSudoCall (250) */
  interface PalletSudoCall extends Enum {
    readonly isSudo: boolean
    readonly asSudo: {
      readonly call: Call
    } & Struct
    readonly isSudoUncheckedWeight: boolean
    readonly asSudoUncheckedWeight: {
      readonly call: Call
      readonly weight: WeightV1
    } & Struct
    readonly isSetKey: boolean
    readonly asSetKey: {
      readonly new_: MultiAddress
    } & Struct
    readonly isSudoAs: boolean
    readonly asSudoAs: {
      readonly who: MultiAddress
      readonly call: Call
    } & Struct
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs'
  }

  /** @name PalletImOnlineCall (251) */
  interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean
    readonly asHeartbeat: {
      readonly heartbeat: PalletImOnlineHeartbeat
      readonly signature: PalletImOnlineSr25519AppSr25519Signature
    } & Struct
    readonly type: 'Heartbeat'
  }

  /** @name PalletImOnlineHeartbeat (252) */
  interface PalletImOnlineHeartbeat extends Struct {
    readonly blockNumber: u32
    readonly networkState: SpCoreOffchainOpaqueNetworkState
    readonly sessionIndex: u32
    readonly authorityIndex: u32
    readonly validatorsLen: u32
  }

  /** @name SpCoreOffchainOpaqueNetworkState (253) */
  interface SpCoreOffchainOpaqueNetworkState extends Struct {
    readonly peerId: OpaquePeerId
    readonly externalAddresses: Vec<OpaqueMultiaddr>
  }

  /** @name PalletImOnlineSr25519AppSr25519Signature (257) */
  interface PalletImOnlineSr25519AppSr25519Signature
    extends SpCoreSr25519Signature {}

  /** @name SpCoreSr25519Signature (258) */
  interface SpCoreSr25519Signature extends U8aFixed {}

  /** @name PalletIdentityCall (259) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean
    readonly asAddRegistrar: {
      readonly account: MultiAddress
    } & Struct
    readonly isSetIdentity: boolean
    readonly asSetIdentity: {
      readonly info: PalletIdentityIdentityInfo
    } & Struct
    readonly isSetSubs: boolean
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId32, Data]>>
    } & Struct
    readonly isClearIdentity: boolean
    readonly isRequestJudgement: boolean
    readonly asRequestJudgement: {
      readonly regIndex: Compact<u32>
      readonly maxFee: Compact<u128>
    } & Struct
    readonly isCancelRequest: boolean
    readonly asCancelRequest: {
      readonly regIndex: u32
    } & Struct
    readonly isSetFee: boolean
    readonly asSetFee: {
      readonly index: Compact<u32>
      readonly fee: Compact<u128>
    } & Struct
    readonly isSetAccountId: boolean
    readonly asSetAccountId: {
      readonly index: Compact<u32>
      readonly new_: MultiAddress
    } & Struct
    readonly isSetFields: boolean
    readonly asSetFields: {
      readonly index: Compact<u32>
      readonly fields: PalletIdentityBitFlags
    } & Struct
    readonly isProvideJudgement: boolean
    readonly asProvideJudgement: {
      readonly regIndex: Compact<u32>
      readonly target: MultiAddress
      readonly judgement: PalletIdentityJudgement
      readonly identity: H256
    } & Struct
    readonly isKillIdentity: boolean
    readonly asKillIdentity: {
      readonly target: MultiAddress
    } & Struct
    readonly isAddSub: boolean
    readonly asAddSub: {
      readonly sub: MultiAddress
      readonly data: Data
    } & Struct
    readonly isRenameSub: boolean
    readonly asRenameSub: {
      readonly sub: MultiAddress
      readonly data: Data
    } & Struct
    readonly isRemoveSub: boolean
    readonly asRemoveSub: {
      readonly sub: MultiAddress
    } & Struct
    readonly isQuitSub: boolean
    readonly type:
      | 'AddRegistrar'
      | 'SetIdentity'
      | 'SetSubs'
      | 'ClearIdentity'
      | 'RequestJudgement'
      | 'CancelRequest'
      | 'SetFee'
      | 'SetAccountId'
      | 'SetFields'
      | 'ProvideJudgement'
      | 'KillIdentity'
      | 'AddSub'
      | 'RenameSub'
      | 'RemoveSub'
      | 'QuitSub'
  }

  /** @name PalletIdentityIdentityInfo (260) */
  interface PalletIdentityIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>
    readonly display: Data
    readonly legal: Data
    readonly web: Data
    readonly riot: Data
    readonly email: Data
    readonly pgpFingerprint: Option<U8aFixed>
    readonly image: Data
    readonly twitter: Data
  }

  /** @name PalletIdentityBitFlags (296) */
  interface PalletIdentityBitFlags extends Set {
    readonly isDisplay: boolean
    readonly isLegal: boolean
    readonly isWeb: boolean
    readonly isRiot: boolean
    readonly isEmail: boolean
    readonly isPgpFingerprint: boolean
    readonly isImage: boolean
    readonly isTwitter: boolean
  }

  /** @name PalletIdentityIdentityField (297) */
  interface PalletIdentityIdentityField extends Enum {
    readonly isDisplay: boolean
    readonly isLegal: boolean
    readonly isWeb: boolean
    readonly isRiot: boolean
    readonly isEmail: boolean
    readonly isPgpFingerprint: boolean
    readonly isImage: boolean
    readonly isTwitter: boolean
    readonly type:
      | 'Display'
      | 'Legal'
      | 'Web'
      | 'Riot'
      | 'Email'
      | 'PgpFingerprint'
      | 'Image'
      | 'Twitter'
  }

  /** @name PalletIdentityJudgement (298) */
  interface PalletIdentityJudgement extends Enum {
    readonly isUnknown: boolean
    readonly isFeePaid: boolean
    readonly asFeePaid: u128
    readonly isReasonable: boolean
    readonly isKnownGood: boolean
    readonly isOutOfDate: boolean
    readonly isLowQuality: boolean
    readonly isErroneous: boolean
    readonly type:
      | 'Unknown'
      | 'FeePaid'
      | 'Reasonable'
      | 'KnownGood'
      | 'OutOfDate'
      | 'LowQuality'
      | 'Erroneous'
  }

  /** @name PalletSocietyCall (299) */
  interface PalletSocietyCall extends Enum {
    readonly isBid: boolean
    readonly asBid: {
      readonly value: u128
    } & Struct
    readonly isUnbid: boolean
    readonly asUnbid: {
      readonly pos: u32
    } & Struct
    readonly isVouch: boolean
    readonly asVouch: {
      readonly who: MultiAddress
      readonly value: u128
      readonly tip: u128
    } & Struct
    readonly isUnvouch: boolean
    readonly asUnvouch: {
      readonly pos: u32
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly candidate: MultiAddress
      readonly approve: bool
    } & Struct
    readonly isDefenderVote: boolean
    readonly asDefenderVote: {
      readonly approve: bool
    } & Struct
    readonly isPayout: boolean
    readonly isFound: boolean
    readonly asFound: {
      readonly founder: MultiAddress
      readonly maxMembers: u32
      readonly rules: Bytes
    } & Struct
    readonly isUnfound: boolean
    readonly isJudgeSuspendedMember: boolean
    readonly asJudgeSuspendedMember: {
      readonly who: MultiAddress
      readonly forgive: bool
    } & Struct
    readonly isJudgeSuspendedCandidate: boolean
    readonly asJudgeSuspendedCandidate: {
      readonly who: MultiAddress
      readonly judgement: PalletSocietyJudgement
    } & Struct
    readonly isSetMaxMembers: boolean
    readonly asSetMaxMembers: {
      readonly max: u32
    } & Struct
    readonly type:
      | 'Bid'
      | 'Unbid'
      | 'Vouch'
      | 'Unvouch'
      | 'Vote'
      | 'DefenderVote'
      | 'Payout'
      | 'Found'
      | 'Unfound'
      | 'JudgeSuspendedMember'
      | 'JudgeSuspendedCandidate'
      | 'SetMaxMembers'
  }

  /** @name PalletSocietyJudgement (300) */
  interface PalletSocietyJudgement extends Enum {
    readonly isRebid: boolean
    readonly isReject: boolean
    readonly isApprove: boolean
    readonly type: 'Rebid' | 'Reject' | 'Approve'
  }

  /** @name PalletRecoveryCall (301) */
  interface PalletRecoveryCall extends Enum {
    readonly isAsRecovered: boolean
    readonly asAsRecovered: {
      readonly account: MultiAddress
      readonly call: Call
    } & Struct
    readonly isSetRecovered: boolean
    readonly asSetRecovered: {
      readonly lost: MultiAddress
      readonly rescuer: MultiAddress
    } & Struct
    readonly isCreateRecovery: boolean
    readonly asCreateRecovery: {
      readonly friends: Vec<AccountId32>
      readonly threshold: u16
      readonly delayPeriod: u32
    } & Struct
    readonly isInitiateRecovery: boolean
    readonly asInitiateRecovery: {
      readonly account: MultiAddress
    } & Struct
    readonly isVouchRecovery: boolean
    readonly asVouchRecovery: {
      readonly lost: MultiAddress
      readonly rescuer: MultiAddress
    } & Struct
    readonly isClaimRecovery: boolean
    readonly asClaimRecovery: {
      readonly account: MultiAddress
    } & Struct
    readonly isCloseRecovery: boolean
    readonly asCloseRecovery: {
      readonly rescuer: MultiAddress
    } & Struct
    readonly isRemoveRecovery: boolean
    readonly isCancelRecovered: boolean
    readonly asCancelRecovered: {
      readonly account: MultiAddress
    } & Struct
    readonly type:
      | 'AsRecovered'
      | 'SetRecovered'
      | 'CreateRecovery'
      | 'InitiateRecovery'
      | 'VouchRecovery'
      | 'ClaimRecovery'
      | 'CloseRecovery'
      | 'RemoveRecovery'
      | 'CancelRecovered'
  }

  /** @name PalletVestingCall (302) */
  interface PalletVestingCall extends Enum {
    readonly isVest: boolean
    readonly isVestOther: boolean
    readonly asVestOther: {
      readonly target: MultiAddress
    } & Struct
    readonly isVestedTransfer: boolean
    readonly asVestedTransfer: {
      readonly target: MultiAddress
      readonly schedule: PalletVestingVestingInfo
    } & Struct
    readonly isForceVestedTransfer: boolean
    readonly asForceVestedTransfer: {
      readonly source: MultiAddress
      readonly target: MultiAddress
      readonly schedule: PalletVestingVestingInfo
    } & Struct
    readonly isMergeSchedules: boolean
    readonly asMergeSchedules: {
      readonly schedule1Index: u32
      readonly schedule2Index: u32
    } & Struct
    readonly type:
      | 'Vest'
      | 'VestOther'
      | 'VestedTransfer'
      | 'ForceVestedTransfer'
      | 'MergeSchedules'
  }

  /** @name PalletVestingVestingInfo (303) */
  interface PalletVestingVestingInfo extends Struct {
    readonly locked: u128
    readonly perBlock: u128
    readonly startingBlock: u32
  }

  /** @name PalletSchedulerCall (304) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean
    readonly asSchedule: {
      readonly when: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: FrameSupportScheduleMaybeHashed
    } & Struct
    readonly isCancel: boolean
    readonly asCancel: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isScheduleNamed: boolean
    readonly asScheduleNamed: {
      readonly id: Bytes
      readonly when: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: FrameSupportScheduleMaybeHashed
    } & Struct
    readonly isCancelNamed: boolean
    readonly asCancelNamed: {
      readonly id: Bytes
    } & Struct
    readonly isScheduleAfter: boolean
    readonly asScheduleAfter: {
      readonly after: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: FrameSupportScheduleMaybeHashed
    } & Struct
    readonly isScheduleNamedAfter: boolean
    readonly asScheduleNamedAfter: {
      readonly id: Bytes
      readonly after: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: FrameSupportScheduleMaybeHashed
    } & Struct
    readonly type:
      | 'Schedule'
      | 'Cancel'
      | 'ScheduleNamed'
      | 'CancelNamed'
      | 'ScheduleAfter'
      | 'ScheduleNamedAfter'
  }

  /** @name FrameSupportScheduleMaybeHashed (306) */
  interface FrameSupportScheduleMaybeHashed extends Enum {
    readonly isValue: boolean
    readonly asValue: Call
    readonly isHash: boolean
    readonly asHash: H256
    readonly type: 'Value' | 'Hash'
  }

  /** @name PalletPreimageCall (307) */
  interface PalletPreimageCall extends Enum {
    readonly isNotePreimage: boolean
    readonly asNotePreimage: {
      readonly bytes: Bytes
    } & Struct
    readonly isUnnotePreimage: boolean
    readonly asUnnotePreimage: {
      readonly hash_: H256
    } & Struct
    readonly isRequestPreimage: boolean
    readonly asRequestPreimage: {
      readonly hash_: H256
    } & Struct
    readonly isUnrequestPreimage: boolean
    readonly asUnrequestPreimage: {
      readonly hash_: H256
    } & Struct
    readonly type:
      | 'NotePreimage'
      | 'UnnotePreimage'
      | 'RequestPreimage'
      | 'UnrequestPreimage'
  }

  /** @name PalletProxyCall (308) */
  interface PalletProxyCall extends Enum {
    readonly isProxy: boolean
    readonly asProxy: {
      readonly real: MultiAddress
      readonly forceProxyType: Option<EntropyRuntimeProxyType>
      readonly call: Call
    } & Struct
    readonly isAddProxy: boolean
    readonly asAddProxy: {
      readonly delegate: MultiAddress
      readonly proxyType: EntropyRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isRemoveProxy: boolean
    readonly asRemoveProxy: {
      readonly delegate: MultiAddress
      readonly proxyType: EntropyRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isRemoveProxies: boolean
    readonly isCreatePure: boolean
    readonly asCreatePure: {
      readonly proxyType: EntropyRuntimeProxyType
      readonly delay: u32
      readonly index: u16
    } & Struct
    readonly isKillPure: boolean
    readonly asKillPure: {
      readonly spawner: MultiAddress
      readonly proxyType: EntropyRuntimeProxyType
      readonly index: u16
      readonly height: Compact<u32>
      readonly extIndex: Compact<u32>
    } & Struct
    readonly isAnnounce: boolean
    readonly asAnnounce: {
      readonly real: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isRemoveAnnouncement: boolean
    readonly asRemoveAnnouncement: {
      readonly real: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isRejectAnnouncement: boolean
    readonly asRejectAnnouncement: {
      readonly delegate: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isProxyAnnounced: boolean
    readonly asProxyAnnounced: {
      readonly delegate: MultiAddress
      readonly real: MultiAddress
      readonly forceProxyType: Option<EntropyRuntimeProxyType>
      readonly call: Call
    } & Struct
    readonly type:
      | 'Proxy'
      | 'AddProxy'
      | 'RemoveProxy'
      | 'RemoveProxies'
      | 'CreatePure'
      | 'KillPure'
      | 'Announce'
      | 'RemoveAnnouncement'
      | 'RejectAnnouncement'
      | 'ProxyAnnounced'
  }

  /** @name PalletMultisigCall (310) */
  interface PalletMultisigCall extends Enum {
    readonly isAsMultiThreshold1: boolean
    readonly asAsMultiThreshold1: {
      readonly otherSignatories: Vec<AccountId32>
      readonly call: Call
    } & Struct
    readonly isAsMulti: boolean
    readonly asAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>
      readonly call: WrapperKeepOpaque<Call>
      readonly storeCall: bool
      readonly maxWeight: WeightV1
    } & Struct
    readonly isApproveAsMulti: boolean
    readonly asApproveAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>
      readonly callHash: U8aFixed
      readonly maxWeight: WeightV1
    } & Struct
    readonly isCancelAsMulti: boolean
    readonly asCancelAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly timepoint: PalletMultisigTimepoint
      readonly callHash: U8aFixed
    } & Struct
    readonly type:
      | 'AsMultiThreshold1'
      | 'AsMulti'
      | 'ApproveAsMulti'
      | 'CancelAsMulti'
  }

  /** @name PalletBountiesCall (313) */
  interface PalletBountiesCall extends Enum {
    readonly isProposeBounty: boolean
    readonly asProposeBounty: {
      readonly value: Compact<u128>
      readonly description: Bytes
    } & Struct
    readonly isApproveBounty: boolean
    readonly asApproveBounty: {
      readonly bountyId: Compact<u32>
    } & Struct
    readonly isProposeCurator: boolean
    readonly asProposeCurator: {
      readonly bountyId: Compact<u32>
      readonly curator: MultiAddress
      readonly fee: Compact<u128>
    } & Struct
    readonly isUnassignCurator: boolean
    readonly asUnassignCurator: {
      readonly bountyId: Compact<u32>
    } & Struct
    readonly isAcceptCurator: boolean
    readonly asAcceptCurator: {
      readonly bountyId: Compact<u32>
    } & Struct
    readonly isAwardBounty: boolean
    readonly asAwardBounty: {
      readonly bountyId: Compact<u32>
      readonly beneficiary: MultiAddress
    } & Struct
    readonly isClaimBounty: boolean
    readonly asClaimBounty: {
      readonly bountyId: Compact<u32>
    } & Struct
    readonly isCloseBounty: boolean
    readonly asCloseBounty: {
      readonly bountyId: Compact<u32>
    } & Struct
    readonly isExtendBountyExpiry: boolean
    readonly asExtendBountyExpiry: {
      readonly bountyId: Compact<u32>
      readonly remark: Bytes
    } & Struct
    readonly type:
      | 'ProposeBounty'
      | 'ApproveBounty'
      | 'ProposeCurator'
      | 'UnassignCurator'
      | 'AcceptCurator'
      | 'AwardBounty'
      | 'ClaimBounty'
      | 'CloseBounty'
      | 'ExtendBountyExpiry'
  }

  /** @name PalletTipsCall (314) */
  interface PalletTipsCall extends Enum {
    readonly isReportAwesome: boolean
    readonly asReportAwesome: {
      readonly reason: Bytes
      readonly who: MultiAddress
    } & Struct
    readonly isRetractTip: boolean
    readonly asRetractTip: {
      readonly hash_: H256
    } & Struct
    readonly isTipNew: boolean
    readonly asTipNew: {
      readonly reason: Bytes
      readonly who: MultiAddress
      readonly tipValue: Compact<u128>
    } & Struct
    readonly isTip: boolean
    readonly asTip: {
      readonly hash_: H256
      readonly tipValue: Compact<u128>
    } & Struct
    readonly isCloseTip: boolean
    readonly asCloseTip: {
      readonly hash_: H256
    } & Struct
    readonly isSlashTip: boolean
    readonly asSlashTip: {
      readonly hash_: H256
    } & Struct
    readonly type:
      | 'ReportAwesome'
      | 'RetractTip'
      | 'TipNew'
      | 'Tip'
      | 'CloseTip'
      | 'SlashTip'
  }

  /** @name PalletTransactionStorageCall (315) */
  interface PalletTransactionStorageCall extends Enum {
    readonly isStore: boolean
    readonly asStore: {
      readonly data: Bytes
    } & Struct
    readonly isRenew: boolean
    readonly asRenew: {
      readonly block: u32
      readonly index: u32
    } & Struct
    readonly isCheckProof: boolean
    readonly asCheckProof: {
      readonly proof: SpTransactionStorageProofTransactionStorageProof
    } & Struct
    readonly type: 'Store' | 'Renew' | 'CheckProof'
  }

  /** @name SpTransactionStorageProofTransactionStorageProof (316) */
  interface SpTransactionStorageProofTransactionStorageProof extends Struct {
    readonly chunk: Bytes
    readonly proof: Vec<Bytes>
  }

  /** @name PalletBagsListCall (317) */
  interface PalletBagsListCall extends Enum {
    readonly isRebag: boolean
    readonly asRebag: {
      readonly dislocated: MultiAddress
    } & Struct
    readonly isPutInFrontOf: boolean
    readonly asPutInFrontOf: {
      readonly lighter: MultiAddress
    } & Struct
    readonly type: 'Rebag' | 'PutInFrontOf'
  }

  /** @name PalletNominationPoolsCall (318) */
  interface PalletNominationPoolsCall extends Enum {
    readonly isJoin: boolean
    readonly asJoin: {
      readonly amount: Compact<u128>
      readonly poolId: u32
    } & Struct
    readonly isBondExtra: boolean
    readonly asBondExtra: {
      readonly extra: PalletNominationPoolsBondExtra
    } & Struct
    readonly isClaimPayout: boolean
    readonly isUnbond: boolean
    readonly asUnbond: {
      readonly memberAccount: MultiAddress
      readonly unbondingPoints: Compact<u128>
    } & Struct
    readonly isPoolWithdrawUnbonded: boolean
    readonly asPoolWithdrawUnbonded: {
      readonly poolId: u32
      readonly numSlashingSpans: u32
    } & Struct
    readonly isWithdrawUnbonded: boolean
    readonly asWithdrawUnbonded: {
      readonly memberAccount: MultiAddress
      readonly numSlashingSpans: u32
    } & Struct
    readonly isCreate: boolean
    readonly asCreate: {
      readonly amount: Compact<u128>
      readonly root: MultiAddress
      readonly nominator: MultiAddress
      readonly stateToggler: MultiAddress
    } & Struct
    readonly isNominate: boolean
    readonly asNominate: {
      readonly poolId: u32
      readonly validators: Vec<AccountId32>
    } & Struct
    readonly isSetState: boolean
    readonly asSetState: {
      readonly poolId: u32
      readonly state: PalletNominationPoolsPoolState
    } & Struct
    readonly isSetMetadata: boolean
    readonly asSetMetadata: {
      readonly poolId: u32
      readonly metadata: Bytes
    } & Struct
    readonly isSetConfigs: boolean
    readonly asSetConfigs: {
      readonly minJoinBond: PalletNominationPoolsConfigOpU128
      readonly minCreateBond: PalletNominationPoolsConfigOpU128
      readonly maxPools: PalletNominationPoolsConfigOpU32
      readonly maxMembers: PalletNominationPoolsConfigOpU32
      readonly maxMembersPerPool: PalletNominationPoolsConfigOpU32
    } & Struct
    readonly isUpdateRoles: boolean
    readonly asUpdateRoles: {
      readonly poolId: u32
      readonly newRoot: PalletNominationPoolsConfigOpAccountId32
      readonly newNominator: PalletNominationPoolsConfigOpAccountId32
      readonly newStateToggler: PalletNominationPoolsConfigOpAccountId32
    } & Struct
    readonly isChill: boolean
    readonly asChill: {
      readonly poolId: u32
    } & Struct
    readonly type:
      | 'Join'
      | 'BondExtra'
      | 'ClaimPayout'
      | 'Unbond'
      | 'PoolWithdrawUnbonded'
      | 'WithdrawUnbonded'
      | 'Create'
      | 'Nominate'
      | 'SetState'
      | 'SetMetadata'
      | 'SetConfigs'
      | 'UpdateRoles'
      | 'Chill'
  }

  /** @name PalletNominationPoolsBondExtra (319) */
  interface PalletNominationPoolsBondExtra extends Enum {
    readonly isFreeBalance: boolean
    readonly asFreeBalance: u128
    readonly isRewards: boolean
    readonly type: 'FreeBalance' | 'Rewards'
  }

  /** @name PalletNominationPoolsConfigOpU128 (320) */
  interface PalletNominationPoolsConfigOpU128 extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: u128
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletNominationPoolsConfigOpU32 (321) */
  interface PalletNominationPoolsConfigOpU32 extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: u32
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletNominationPoolsConfigOpAccountId32 (322) */
  interface PalletNominationPoolsConfigOpAccountId32 extends Enum {
    readonly isNoop: boolean
    readonly isSet: boolean
    readonly asSet: AccountId32
    readonly isRemove: boolean
    readonly type: 'Noop' | 'Set' | 'Remove'
  }

  /** @name PalletPropagationCall (323) */
  type PalletPropagationCall = Null

  /** @name PalletRelayerCall (324) */
  interface PalletRelayerCall extends Enum {
    readonly isPrepTransaction: boolean
    readonly asPrepTransaction: {
      readonly sigRequest: EntropySharedSigRequest
    } & Struct
    readonly isRegister: boolean
    readonly asRegister: {
      readonly constraintAccount: AccountId32
      readonly initialConstraints: Option<EntropySharedConstraints>
    } & Struct
    readonly isSwapKeys: boolean
    readonly isConfirmRegister: boolean
    readonly asConfirmRegister: {
      readonly sigReqAccount: AccountId32
      readonly signingSubgroup: u8
    } & Struct
    readonly isConfirmDone: boolean
    readonly asConfirmDone: {
      readonly blockNumber: u32
      readonly failures: Vec<u32>
    } & Struct
    readonly type:
      | 'PrepTransaction'
      | 'Register'
      | 'SwapKeys'
      | 'ConfirmRegister'
      | 'ConfirmDone'
  }

  /** @name PalletSlashingCall (326) */
  interface PalletSlashingCall extends Enum {
    readonly isDemoOffence: boolean
    readonly asDemoOffence: {
      readonly offenders: Vec<AccountId32>
    } & Struct
    readonly type: 'DemoOffence'
  }

  /** @name PalletConstraintsCall (327) */
  interface PalletConstraintsCall extends Enum {
    readonly isUpdateConstraints: boolean
    readonly asUpdateConstraints: {
      readonly sigReqAccount: AccountId32
      readonly newConstraints: EntropySharedConstraints
    } & Struct
    readonly type: 'UpdateConstraints'
  }

  /** @name PalletTransactionPauseModuleCall (328) */
  interface PalletTransactionPauseModuleCall extends Enum {
    readonly isPauseTransaction: boolean
    readonly asPauseTransaction: {
      readonly palletName: Bytes
      readonly functionName: Bytes
    } & Struct
    readonly isUnpauseTransaction: boolean
    readonly asUnpauseTransaction: {
      readonly palletName: Bytes
      readonly functionName: Bytes
    } & Struct
    readonly type: 'PauseTransaction' | 'UnpauseTransaction'
  }

  /** @name PalletFreeTxCall (329) */
  interface PalletFreeTxCall extends Enum {
    readonly isCallUsingElectricity: boolean
    readonly asCallUsingElectricity: {
      readonly call: Call
    } & Struct
    readonly isSetIndividualElectricityEraLimit: boolean
    readonly asSetIndividualElectricityEraLimit: {
      readonly maxCells: Option<u32>
    } & Struct
    readonly isSetBatteryCount: boolean
    readonly asSetBatteryCount: {
      readonly account: AccountId32
      readonly batteryCount: u32
    } & Struct
    readonly isGiveZaps: boolean
    readonly asGiveZaps: {
      readonly recipient: AccountId32
      readonly cells: u32
    } & Struct
    readonly type:
      | 'CallUsingElectricity'
      | 'SetIndividualElectricityEraLimit'
      | 'SetBatteryCount'
      | 'GiveZaps'
  }

  /** @name EntropyRuntimeOriginCaller (330) */
  interface EntropyRuntimeOriginCaller extends Enum {
    readonly isSystem: boolean
    readonly asSystem: FrameSupportDispatchRawOrigin
    readonly isVoid: boolean
    readonly isCouncil: boolean
    readonly asCouncil: PalletCollectiveRawOrigin
    readonly isTechnicalCommittee: boolean
    readonly asTechnicalCommittee: PalletCollectiveRawOrigin
    readonly type: 'System' | 'Void' | 'Council' | 'TechnicalCommittee'
  }

  /** @name FrameSupportDispatchRawOrigin (331) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean
    readonly isSigned: boolean
    readonly asSigned: AccountId32
    readonly isNone: boolean
    readonly type: 'Root' | 'Signed' | 'None'
  }

  /** @name PalletCollectiveRawOrigin (332) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean
    readonly asMembers: ITuple<[u32, u32]>
    readonly isMember: boolean
    readonly asMember: AccountId32
    readonly isPhantom: boolean
    readonly type: 'Members' | 'Member' | 'Phantom'
  }

  /** @name SpCoreVoid (334) */
  type SpCoreVoid = Null

  /** @name PalletUtilityError (335) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean
    readonly type: 'TooManyCalls'
  }

  /** @name SpConsensusBabeDigestsPreDigest (342) */
  interface SpConsensusBabeDigestsPreDigest extends Enum {
    readonly isPrimary: boolean
    readonly asPrimary: SpConsensusBabeDigestsPrimaryPreDigest
    readonly isSecondaryPlain: boolean
    readonly asSecondaryPlain: SpConsensusBabeDigestsSecondaryPlainPreDigest
    readonly isSecondaryVRF: boolean
    readonly asSecondaryVRF: SpConsensusBabeDigestsSecondaryVRFPreDigest
    readonly type: 'Primary' | 'SecondaryPlain' | 'SecondaryVRF'
  }

  /** @name SpConsensusBabeDigestsPrimaryPreDigest (343) */
  interface SpConsensusBabeDigestsPrimaryPreDigest extends Struct {
    readonly authorityIndex: u32
    readonly slot: u64
    readonly vrfOutput: U8aFixed
    readonly vrfProof: U8aFixed
  }

  /** @name SpConsensusBabeDigestsSecondaryPlainPreDigest (344) */
  interface SpConsensusBabeDigestsSecondaryPlainPreDigest extends Struct {
    readonly authorityIndex: u32
    readonly slot: u64
  }

  /** @name SpConsensusBabeDigestsSecondaryVRFPreDigest (345) */
  interface SpConsensusBabeDigestsSecondaryVRFPreDigest extends Struct {
    readonly authorityIndex: u32
    readonly slot: u64
    readonly vrfOutput: U8aFixed
    readonly vrfProof: U8aFixed
  }

  /** @name SpConsensusBabeBabeEpochConfiguration (347) */
  interface SpConsensusBabeBabeEpochConfiguration extends Struct {
    readonly c: ITuple<[u64, u64]>
    readonly allowedSlots: SpConsensusBabeAllowedSlots
  }

  /** @name PalletBabeError (348) */
  interface PalletBabeError extends Enum {
    readonly isInvalidEquivocationProof: boolean
    readonly isInvalidKeyOwnershipProof: boolean
    readonly isDuplicateOffenceReport: boolean
    readonly isInvalidConfiguration: boolean
    readonly type:
      | 'InvalidEquivocationProof'
      | 'InvalidKeyOwnershipProof'
      | 'DuplicateOffenceReport'
      | 'InvalidConfiguration'
  }

  /** @name PalletAuthorshipUncleEntryItem (350) */
  interface PalletAuthorshipUncleEntryItem extends Enum {
    readonly isInclusionHeight: boolean
    readonly asInclusionHeight: u32
    readonly isUncle: boolean
    readonly asUncle: ITuple<[H256, Option<AccountId32>]>
    readonly type: 'InclusionHeight' | 'Uncle'
  }

  /** @name PalletAuthorshipError (352) */
  interface PalletAuthorshipError extends Enum {
    readonly isInvalidUncleParent: boolean
    readonly isUnclesAlreadySet: boolean
    readonly isTooManyUncles: boolean
    readonly isGenesisUncle: boolean
    readonly isTooHighUncle: boolean
    readonly isUncleAlreadyIncluded: boolean
    readonly isOldUncle: boolean
    readonly type:
      | 'InvalidUncleParent'
      | 'UnclesAlreadySet'
      | 'TooManyUncles'
      | 'GenesisUncle'
      | 'TooHighUncle'
      | 'UncleAlreadyIncluded'
      | 'OldUncle'
  }

  /** @name PalletIndicesError (354) */
  interface PalletIndicesError extends Enum {
    readonly isNotAssigned: boolean
    readonly isNotOwner: boolean
    readonly isInUse: boolean
    readonly isNotTransfer: boolean
    readonly isPermanent: boolean
    readonly type:
      | 'NotAssigned'
      | 'NotOwner'
      | 'InUse'
      | 'NotTransfer'
      | 'Permanent'
  }

  /** @name PalletBalancesBalanceLock (356) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed
    readonly amount: u128
    readonly reasons: PalletBalancesReasons
  }

  /** @name PalletBalancesReasons (357) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean
    readonly isMisc: boolean
    readonly isAll: boolean
    readonly type: 'Fee' | 'Misc' | 'All'
  }

  /** @name PalletBalancesReserveData (360) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed
    readonly amount: u128
  }

  /** @name PalletBalancesReleases (362) */
  interface PalletBalancesReleases extends Enum {
    readonly isV100: boolean
    readonly isV200: boolean
    readonly type: 'V100' | 'V200'
  }

  /** @name PalletBalancesError (363) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean
    readonly isLiquidityRestrictions: boolean
    readonly isInsufficientBalance: boolean
    readonly isExistentialDeposit: boolean
    readonly isKeepAlive: boolean
    readonly isExistingVestingSchedule: boolean
    readonly isDeadAccount: boolean
    readonly isTooManyReserves: boolean
    readonly type:
      | 'VestingBalance'
      | 'LiquidityRestrictions'
      | 'InsufficientBalance'
      | 'ExistentialDeposit'
      | 'KeepAlive'
      | 'ExistingVestingSchedule'
      | 'DeadAccount'
      | 'TooManyReserves'
  }

  /** @name PalletTransactionPaymentReleases (365) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean
    readonly isV2: boolean
    readonly type: 'V1Ancient' | 'V2'
  }

  /** @name PalletElectionProviderMultiPhasePhase (366) */
  interface PalletElectionProviderMultiPhasePhase extends Enum {
    readonly isOff: boolean
    readonly isSigned: boolean
    readonly isUnsigned: boolean
    readonly asUnsigned: ITuple<[bool, u32]>
    readonly isEmergency: boolean
    readonly type: 'Off' | 'Signed' | 'Unsigned' | 'Emergency'
  }

  /** @name PalletElectionProviderMultiPhaseReadySolution (368) */
  interface PalletElectionProviderMultiPhaseReadySolution extends Struct {
    readonly supports: Vec<ITuple<[AccountId32, SpNposElectionsSupport]>>
    readonly score: SpNposElectionsElectionScore
    readonly compute: PalletElectionProviderMultiPhaseElectionCompute
  }

  /** @name PalletElectionProviderMultiPhaseRoundSnapshot (369) */
  interface PalletElectionProviderMultiPhaseRoundSnapshot extends Struct {
    readonly voters: Vec<ITuple<[AccountId32, u64, Vec<AccountId32>]>>
    readonly targets: Vec<AccountId32>
  }

  /** @name PalletElectionProviderMultiPhaseSignedSignedSubmission (377) */
  interface PalletElectionProviderMultiPhaseSignedSignedSubmission
    extends Struct {
    readonly who: AccountId32
    readonly deposit: u128
    readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution
    readonly callFee: u128
  }

  /** @name PalletElectionProviderMultiPhaseError (378) */
  interface PalletElectionProviderMultiPhaseError extends Enum {
    readonly isPreDispatchEarlySubmission: boolean
    readonly isPreDispatchWrongWinnerCount: boolean
    readonly isPreDispatchWeakSubmission: boolean
    readonly isSignedQueueFull: boolean
    readonly isSignedCannotPayDeposit: boolean
    readonly isSignedInvalidWitness: boolean
    readonly isSignedTooMuchWeight: boolean
    readonly isOcwCallWrongEra: boolean
    readonly isMissingSnapshotMetadata: boolean
    readonly isInvalidSubmissionIndex: boolean
    readonly isCallNotAllowed: boolean
    readonly isFallbackFailed: boolean
    readonly type:
      | 'PreDispatchEarlySubmission'
      | 'PreDispatchWrongWinnerCount'
      | 'PreDispatchWeakSubmission'
      | 'SignedQueueFull'
      | 'SignedCannotPayDeposit'
      | 'SignedInvalidWitness'
      | 'SignedTooMuchWeight'
      | 'OcwCallWrongEra'
      | 'MissingSnapshotMetadata'
      | 'InvalidSubmissionIndex'
      | 'CallNotAllowed'
      | 'FallbackFailed'
  }

  /** @name PalletStakingStakingLedger (379) */
  interface PalletStakingStakingLedger extends Struct {
    readonly stash: AccountId32
    readonly total: Compact<u128>
    readonly active: Compact<u128>
    readonly unlocking: Vec<PalletStakingUnlockChunk>
    readonly claimedRewards: Vec<u32>
  }

  /** @name PalletStakingUnlockChunk (381) */
  interface PalletStakingUnlockChunk extends Struct {
    readonly value: Compact<u128>
    readonly era: Compact<u32>
  }

  /** @name PalletStakingNominations (384) */
  interface PalletStakingNominations extends Struct {
    readonly targets: Vec<AccountId32>
    readonly submittedIn: u32
    readonly suppressed: bool
  }

  /** @name PalletStakingActiveEraInfo (385) */
  interface PalletStakingActiveEraInfo extends Struct {
    readonly index: u32
    readonly start: Option<u64>
  }

  /** @name PalletStakingEraRewardPoints (388) */
  interface PalletStakingEraRewardPoints extends Struct {
    readonly total: u32
    readonly individual: BTreeMap<AccountId32, u32>
  }

  /** @name PalletStakingForcing (392) */
  interface PalletStakingForcing extends Enum {
    readonly isNotForcing: boolean
    readonly isForceNew: boolean
    readonly isForceNone: boolean
    readonly isForceAlways: boolean
    readonly type: 'NotForcing' | 'ForceNew' | 'ForceNone' | 'ForceAlways'
  }

  /** @name PalletStakingUnappliedSlash (394) */
  interface PalletStakingUnappliedSlash extends Struct {
    readonly validator: AccountId32
    readonly own: u128
    readonly others: Vec<ITuple<[AccountId32, u128]>>
    readonly reporters: Vec<AccountId32>
    readonly payout: u128
  }

  /** @name PalletStakingSlashingSlashingSpans (396) */
  interface PalletStakingSlashingSlashingSpans extends Struct {
    readonly spanIndex: u32
    readonly lastStart: u32
    readonly lastNonzeroSlash: u32
    readonly prior: Vec<u32>
  }

  /** @name PalletStakingSlashingSpanRecord (397) */
  interface PalletStakingSlashingSpanRecord extends Struct {
    readonly slashed: u128
    readonly paidOut: u128
  }

  /** @name PalletStakingReleases (400) */
  interface PalletStakingReleases extends Enum {
    readonly isV100Ancient: boolean
    readonly isV200: boolean
    readonly isV300: boolean
    readonly isV400: boolean
    readonly isV500: boolean
    readonly isV600: boolean
    readonly isV700: boolean
    readonly isV800: boolean
    readonly isV900: boolean
    readonly isV1000: boolean
    readonly isV1100: boolean
    readonly isV1200: boolean
    readonly type:
      | 'V100Ancient'
      | 'V200'
      | 'V300'
      | 'V400'
      | 'V500'
      | 'V600'
      | 'V700'
      | 'V800'
      | 'V900'
      | 'V1000'
      | 'V1100'
      | 'V1200'
  }

  /** @name PalletStakingPalletError (401) */
  interface PalletStakingPalletError extends Enum {
    readonly isNotController: boolean
    readonly isNotStash: boolean
    readonly isAlreadyBonded: boolean
    readonly isAlreadyPaired: boolean
    readonly isEmptyTargets: boolean
    readonly isDuplicateIndex: boolean
    readonly isInvalidSlashIndex: boolean
    readonly isInsufficientBond: boolean
    readonly isNoMoreChunks: boolean
    readonly isNoUnlockChunk: boolean
    readonly isFundedTarget: boolean
    readonly isInvalidEraToReward: boolean
    readonly isInvalidNumberOfNominations: boolean
    readonly isNotSortedAndUnique: boolean
    readonly isAlreadyClaimed: boolean
    readonly isIncorrectHistoryDepth: boolean
    readonly isIncorrectSlashingSpans: boolean
    readonly isBadState: boolean
    readonly isTooManyTargets: boolean
    readonly isBadTarget: boolean
    readonly isCannotChillOther: boolean
    readonly isTooManyNominators: boolean
    readonly isTooManyValidators: boolean
    readonly isCommissionTooLow: boolean
    readonly isBoundNotMet: boolean
    readonly type:
      | 'NotController'
      | 'NotStash'
      | 'AlreadyBonded'
      | 'AlreadyPaired'
      | 'EmptyTargets'
      | 'DuplicateIndex'
      | 'InvalidSlashIndex'
      | 'InsufficientBond'
      | 'NoMoreChunks'
      | 'NoUnlockChunk'
      | 'FundedTarget'
      | 'InvalidEraToReward'
      | 'InvalidNumberOfNominations'
      | 'NotSortedAndUnique'
      | 'AlreadyClaimed'
      | 'IncorrectHistoryDepth'
      | 'IncorrectSlashingSpans'
      | 'BadState'
      | 'TooManyTargets'
      | 'BadTarget'
      | 'CannotChillOther'
      | 'TooManyNominators'
      | 'TooManyValidators'
      | 'CommissionTooLow'
      | 'BoundNotMet'
  }

  /** @name PalletStakingExtensionError (402) */
  interface PalletStakingExtensionError extends Enum {
    readonly isEndpointTooLong: boolean
    readonly isNoBond: boolean
    readonly isNotController: boolean
    readonly isNoThresholdKey: boolean
    readonly isInvalidValidatorId: boolean
    readonly isSigningGroupError: boolean
    readonly type:
      | 'EndpointTooLong'
      | 'NoBond'
      | 'NotController'
      | 'NoThresholdKey'
      | 'InvalidValidatorId'
      | 'SigningGroupError'
  }

  /** @name SpCoreCryptoKeyTypeId (406) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (407) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean
    readonly isNoAssociatedValidatorId: boolean
    readonly isDuplicatedKey: boolean
    readonly isNoKeys: boolean
    readonly isNoAccount: boolean
    readonly type:
      | 'InvalidProof'
      | 'NoAssociatedValidatorId'
      | 'DuplicatedKey'
      | 'NoKeys'
      | 'NoAccount'
  }

  /** @name PalletDemocracyPreimageStatus (411) */
  interface PalletDemocracyPreimageStatus extends Enum {
    readonly isMissing: boolean
    readonly asMissing: u32
    readonly isAvailable: boolean
    readonly asAvailable: {
      readonly data: Bytes
      readonly provider: AccountId32
      readonly deposit: u128
      readonly since: u32
      readonly expiry: Option<u32>
    } & Struct
    readonly type: 'Missing' | 'Available'
  }

  /** @name PalletDemocracyReferendumInfo (412) */
  interface PalletDemocracyReferendumInfo extends Enum {
    readonly isOngoing: boolean
    readonly asOngoing: PalletDemocracyReferendumStatus
    readonly isFinished: boolean
    readonly asFinished: {
      readonly approved: bool
      readonly end: u32
    } & Struct
    readonly type: 'Ongoing' | 'Finished'
  }

  /** @name PalletDemocracyReferendumStatus (413) */
  interface PalletDemocracyReferendumStatus extends Struct {
    readonly end: u32
    readonly proposalHash: H256
    readonly threshold: PalletDemocracyVoteThreshold
    readonly delay: u32
    readonly tally: PalletDemocracyTally
  }

  /** @name PalletDemocracyTally (414) */
  interface PalletDemocracyTally extends Struct {
    readonly ayes: u128
    readonly nays: u128
    readonly turnout: u128
  }

  /** @name PalletDemocracyVoteVoting (415) */
  interface PalletDemocracyVoteVoting extends Enum {
    readonly isDirect: boolean
    readonly asDirect: {
      readonly votes: Vec<ITuple<[u32, PalletDemocracyVoteAccountVote]>>
      readonly delegations: PalletDemocracyDelegations
      readonly prior: PalletDemocracyVotePriorLock
    } & Struct
    readonly isDelegating: boolean
    readonly asDelegating: {
      readonly balance: u128
      readonly target: AccountId32
      readonly conviction: PalletDemocracyConviction
      readonly delegations: PalletDemocracyDelegations
      readonly prior: PalletDemocracyVotePriorLock
    } & Struct
    readonly type: 'Direct' | 'Delegating'
  }

  /** @name PalletDemocracyDelegations (418) */
  interface PalletDemocracyDelegations extends Struct {
    readonly votes: u128
    readonly capital: u128
  }

  /** @name PalletDemocracyVotePriorLock (419) */
  interface PalletDemocracyVotePriorLock extends ITuple<[u32, u128]> {}

  /** @name PalletDemocracyReleases (422) */
  interface PalletDemocracyReleases extends Enum {
    readonly isV1: boolean
    readonly type: 'V1'
  }

  /** @name PalletDemocracyError (423) */
  interface PalletDemocracyError extends Enum {
    readonly isValueLow: boolean
    readonly isProposalMissing: boolean
    readonly isAlreadyCanceled: boolean
    readonly isDuplicateProposal: boolean
    readonly isProposalBlacklisted: boolean
    readonly isNotSimpleMajority: boolean
    readonly isInvalidHash: boolean
    readonly isNoProposal: boolean
    readonly isAlreadyVetoed: boolean
    readonly isDuplicatePreimage: boolean
    readonly isNotImminent: boolean
    readonly isTooEarly: boolean
    readonly isImminent: boolean
    readonly isPreimageMissing: boolean
    readonly isReferendumInvalid: boolean
    readonly isPreimageInvalid: boolean
    readonly isNoneWaiting: boolean
    readonly isNotVoter: boolean
    readonly isNoPermission: boolean
    readonly isAlreadyDelegating: boolean
    readonly isInsufficientFunds: boolean
    readonly isNotDelegating: boolean
    readonly isVotesExist: boolean
    readonly isInstantNotAllowed: boolean
    readonly isNonsense: boolean
    readonly isWrongUpperBound: boolean
    readonly isMaxVotesReached: boolean
    readonly isTooManyProposals: boolean
    readonly isVotingPeriodLow: boolean
    readonly type:
      | 'ValueLow'
      | 'ProposalMissing'
      | 'AlreadyCanceled'
      | 'DuplicateProposal'
      | 'ProposalBlacklisted'
      | 'NotSimpleMajority'
      | 'InvalidHash'
      | 'NoProposal'
      | 'AlreadyVetoed'
      | 'DuplicatePreimage'
      | 'NotImminent'
      | 'TooEarly'
      | 'Imminent'
      | 'PreimageMissing'
      | 'ReferendumInvalid'
      | 'PreimageInvalid'
      | 'NoneWaiting'
      | 'NotVoter'
      | 'NoPermission'
      | 'AlreadyDelegating'
      | 'InsufficientFunds'
      | 'NotDelegating'
      | 'VotesExist'
      | 'InstantNotAllowed'
      | 'Nonsense'
      | 'WrongUpperBound'
      | 'MaxVotesReached'
      | 'TooManyProposals'
      | 'VotingPeriodLow'
  }

  /** @name PalletCollectiveVotes (425) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32
    readonly threshold: u32
    readonly ayes: Vec<AccountId32>
    readonly nays: Vec<AccountId32>
    readonly end: u32
  }

  /** @name PalletCollectiveError (426) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean
    readonly isDuplicateProposal: boolean
    readonly isProposalMissing: boolean
    readonly isWrongIndex: boolean
    readonly isDuplicateVote: boolean
    readonly isAlreadyInitialized: boolean
    readonly isTooEarly: boolean
    readonly isTooManyProposals: boolean
    readonly isWrongProposalWeight: boolean
    readonly isWrongProposalLength: boolean
    readonly type:
      | 'NotMember'
      | 'DuplicateProposal'
      | 'ProposalMissing'
      | 'WrongIndex'
      | 'DuplicateVote'
      | 'AlreadyInitialized'
      | 'TooEarly'
      | 'TooManyProposals'
      | 'WrongProposalWeight'
      | 'WrongProposalLength'
  }

  /** @name PalletElectionsPhragmenSeatHolder (430) */
  interface PalletElectionsPhragmenSeatHolder extends Struct {
    readonly who: AccountId32
    readonly stake: u128
    readonly deposit: u128
  }

  /** @name PalletElectionsPhragmenVoter (431) */
  interface PalletElectionsPhragmenVoter extends Struct {
    readonly votes: Vec<AccountId32>
    readonly stake: u128
    readonly deposit: u128
  }

  /** @name PalletElectionsPhragmenError (432) */
  interface PalletElectionsPhragmenError extends Enum {
    readonly isUnableToVote: boolean
    readonly isNoVotes: boolean
    readonly isTooManyVotes: boolean
    readonly isMaximumVotesExceeded: boolean
    readonly isLowBalance: boolean
    readonly isUnableToPayBond: boolean
    readonly isMustBeVoter: boolean
    readonly isDuplicatedCandidate: boolean
    readonly isTooManyCandidates: boolean
    readonly isMemberSubmit: boolean
    readonly isRunnerUpSubmit: boolean
    readonly isInsufficientCandidateFunds: boolean
    readonly isNotMember: boolean
    readonly isInvalidWitnessData: boolean
    readonly isInvalidVoteCount: boolean
    readonly isInvalidRenouncing: boolean
    readonly isInvalidReplacement: boolean
    readonly type:
      | 'UnableToVote'
      | 'NoVotes'
      | 'TooManyVotes'
      | 'MaximumVotesExceeded'
      | 'LowBalance'
      | 'UnableToPayBond'
      | 'MustBeVoter'
      | 'DuplicatedCandidate'
      | 'TooManyCandidates'
      | 'MemberSubmit'
      | 'RunnerUpSubmit'
      | 'InsufficientCandidateFunds'
      | 'NotMember'
      | 'InvalidWitnessData'
      | 'InvalidVoteCount'
      | 'InvalidRenouncing'
      | 'InvalidReplacement'
  }

  /** @name PalletMembershipError (434) */
  interface PalletMembershipError extends Enum {
    readonly isAlreadyMember: boolean
    readonly isNotMember: boolean
    readonly isTooManyMembers: boolean
    readonly type: 'AlreadyMember' | 'NotMember' | 'TooManyMembers'
  }

  /** @name PalletGrandpaStoredState (435) */
  interface PalletGrandpaStoredState extends Enum {
    readonly isLive: boolean
    readonly isPendingPause: boolean
    readonly asPendingPause: {
      readonly scheduledAt: u32
      readonly delay: u32
    } & Struct
    readonly isPaused: boolean
    readonly isPendingResume: boolean
    readonly asPendingResume: {
      readonly scheduledAt: u32
      readonly delay: u32
    } & Struct
    readonly type: 'Live' | 'PendingPause' | 'Paused' | 'PendingResume'
  }

  /** @name PalletGrandpaStoredPendingChange (436) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32
    readonly delay: u32
    readonly nextAuthorities: Vec<ITuple<[SpFinalityGrandpaAppPublic, u64]>>
    readonly forced: Option<u32>
  }

  /** @name PalletGrandpaError (438) */
  interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean
    readonly isResumeFailed: boolean
    readonly isChangePending: boolean
    readonly isTooSoon: boolean
    readonly isInvalidKeyOwnershipProof: boolean
    readonly isInvalidEquivocationProof: boolean
    readonly isDuplicateOffenceReport: boolean
    readonly type:
      | 'PauseFailed'
      | 'ResumeFailed'
      | 'ChangePending'
      | 'TooSoon'
      | 'InvalidKeyOwnershipProof'
      | 'InvalidEquivocationProof'
      | 'DuplicateOffenceReport'
  }

  /** @name PalletTreasuryProposal (439) */
  interface PalletTreasuryProposal extends Struct {
    readonly proposer: AccountId32
    readonly value: u128
    readonly beneficiary: AccountId32
    readonly bond: u128
  }

  /** @name FrameSupportPalletId (443) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name PalletTreasuryError (444) */
  interface PalletTreasuryError extends Enum {
    readonly isInsufficientProposersBalance: boolean
    readonly isInvalidIndex: boolean
    readonly isTooManyApprovals: boolean
    readonly isInsufficientPermission: boolean
    readonly isProposalNotApproved: boolean
    readonly type:
      | 'InsufficientProposersBalance'
      | 'InvalidIndex'
      | 'TooManyApprovals'
      | 'InsufficientPermission'
      | 'ProposalNotApproved'
  }

  /** @name PalletSudoError (445) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean
    readonly type: 'RequireSudo'
  }

  /** @name PalletImOnlineBoundedOpaqueNetworkState (449) */
  interface PalletImOnlineBoundedOpaqueNetworkState extends Struct {
    readonly peerId: Bytes
    readonly externalAddresses: Vec<Bytes>
  }

  /** @name PalletImOnlineError (453) */
  interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean
    readonly isDuplicatedHeartbeat: boolean
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat'
  }

  /** @name SpStakingOffenceOffenceDetails (456) */
  interface SpStakingOffenceOffenceDetails extends Struct {
    readonly offender: ITuple<[AccountId32, PalletStakingExposure]>
    readonly reporters: Vec<AccountId32>
  }

  /** @name PalletIdentityRegistration (460) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[u32, PalletIdentityJudgement]>>
    readonly deposit: u128
    readonly info: PalletIdentityIdentityInfo
  }

  /** @name PalletIdentityRegistrarInfo (468) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32
    readonly fee: u128
    readonly fields: PalletIdentityBitFlags
  }

  /** @name PalletIdentityError (470) */
  interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean
    readonly isNotFound: boolean
    readonly isNotNamed: boolean
    readonly isEmptyIndex: boolean
    readonly isFeeChanged: boolean
    readonly isNoIdentity: boolean
    readonly isStickyJudgement: boolean
    readonly isJudgementGiven: boolean
    readonly isInvalidJudgement: boolean
    readonly isInvalidIndex: boolean
    readonly isInvalidTarget: boolean
    readonly isTooManyFields: boolean
    readonly isTooManyRegistrars: boolean
    readonly isAlreadyClaimed: boolean
    readonly isNotSub: boolean
    readonly isNotOwned: boolean
    readonly isJudgementForDifferentIdentity: boolean
    readonly type:
      | 'TooManySubAccounts'
      | 'NotFound'
      | 'NotNamed'
      | 'EmptyIndex'
      | 'FeeChanged'
      | 'NoIdentity'
      | 'StickyJudgement'
      | 'JudgementGiven'
      | 'InvalidJudgement'
      | 'InvalidIndex'
      | 'InvalidTarget'
      | 'TooManyFields'
      | 'TooManyRegistrars'
      | 'AlreadyClaimed'
      | 'NotSub'
      | 'NotOwned'
      | 'JudgementForDifferentIdentity'
  }

  /** @name PalletSocietyBid (472) */
  interface PalletSocietyBid extends Struct {
    readonly who: AccountId32
    readonly kind: PalletSocietyBidKind
    readonly value: u128
  }

  /** @name PalletSocietyBidKind (473) */
  interface PalletSocietyBidKind extends Enum {
    readonly isDeposit: boolean
    readonly asDeposit: u128
    readonly isVouch: boolean
    readonly asVouch: ITuple<[AccountId32, u128]>
    readonly type: 'Deposit' | 'Vouch'
  }

  /** @name PalletSocietyVouchingStatus (475) */
  interface PalletSocietyVouchingStatus extends Enum {
    readonly isVouching: boolean
    readonly isBanned: boolean
    readonly type: 'Vouching' | 'Banned'
  }

  /** @name PalletSocietyVote (479) */
  interface PalletSocietyVote extends Enum {
    readonly isSkeptic: boolean
    readonly isReject: boolean
    readonly isApprove: boolean
    readonly type: 'Skeptic' | 'Reject' | 'Approve'
  }

  /** @name PalletSocietyError (480) */
  interface PalletSocietyError extends Enum {
    readonly isBadPosition: boolean
    readonly isNotMember: boolean
    readonly isAlreadyMember: boolean
    readonly isSuspended: boolean
    readonly isNotSuspended: boolean
    readonly isNoPayout: boolean
    readonly isAlreadyFounded: boolean
    readonly isInsufficientPot: boolean
    readonly isAlreadyVouching: boolean
    readonly isNotVouching: boolean
    readonly isHead: boolean
    readonly isFounder: boolean
    readonly isAlreadyBid: boolean
    readonly isAlreadyCandidate: boolean
    readonly isNotCandidate: boolean
    readonly isMaxMembers: boolean
    readonly isNotFounder: boolean
    readonly isNotHead: boolean
    readonly type:
      | 'BadPosition'
      | 'NotMember'
      | 'AlreadyMember'
      | 'Suspended'
      | 'NotSuspended'
      | 'NoPayout'
      | 'AlreadyFounded'
      | 'InsufficientPot'
      | 'AlreadyVouching'
      | 'NotVouching'
      | 'Head'
      | 'Founder'
      | 'AlreadyBid'
      | 'AlreadyCandidate'
      | 'NotCandidate'
      | 'MaxMembers'
      | 'NotFounder'
      | 'NotHead'
  }

  /** @name PalletRecoveryRecoveryConfig (481) */
  interface PalletRecoveryRecoveryConfig extends Struct {
    readonly delayPeriod: u32
    readonly deposit: u128
    readonly friends: Vec<AccountId32>
    readonly threshold: u16
  }

  /** @name PalletRecoveryActiveRecovery (483) */
  interface PalletRecoveryActiveRecovery extends Struct {
    readonly created: u32
    readonly deposit: u128
    readonly friends: Vec<AccountId32>
  }

  /** @name PalletRecoveryError (484) */
  interface PalletRecoveryError extends Enum {
    readonly isNotAllowed: boolean
    readonly isZeroThreshold: boolean
    readonly isNotEnoughFriends: boolean
    readonly isMaxFriends: boolean
    readonly isNotSorted: boolean
    readonly isNotRecoverable: boolean
    readonly isAlreadyRecoverable: boolean
    readonly isAlreadyStarted: boolean
    readonly isNotStarted: boolean
    readonly isNotFriend: boolean
    readonly isDelayPeriod: boolean
    readonly isAlreadyVouched: boolean
    readonly isThreshold: boolean
    readonly isStillActive: boolean
    readonly isAlreadyProxy: boolean
    readonly isBadState: boolean
    readonly type:
      | 'NotAllowed'
      | 'ZeroThreshold'
      | 'NotEnoughFriends'
      | 'MaxFriends'
      | 'NotSorted'
      | 'NotRecoverable'
      | 'AlreadyRecoverable'
      | 'AlreadyStarted'
      | 'NotStarted'
      | 'NotFriend'
      | 'DelayPeriod'
      | 'AlreadyVouched'
      | 'Threshold'
      | 'StillActive'
      | 'AlreadyProxy'
      | 'BadState'
  }

  /** @name PalletVestingReleases (487) */
  interface PalletVestingReleases extends Enum {
    readonly isV0: boolean
    readonly isV1: boolean
    readonly type: 'V0' | 'V1'
  }

  /** @name PalletVestingError (488) */
  interface PalletVestingError extends Enum {
    readonly isNotVesting: boolean
    readonly isAtMaxVestingSchedules: boolean
    readonly isAmountLow: boolean
    readonly isScheduleIndexOutOfBounds: boolean
    readonly isInvalidScheduleParams: boolean
    readonly type:
      | 'NotVesting'
      | 'AtMaxVestingSchedules'
      | 'AmountLow'
      | 'ScheduleIndexOutOfBounds'
      | 'InvalidScheduleParams'
  }

  /** @name PalletSchedulerScheduledV3 (491) */
  interface PalletSchedulerScheduledV3 extends Struct {
    readonly maybeId: Option<Bytes>
    readonly priority: u8
    readonly call: FrameSupportScheduleMaybeHashed
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>
    readonly origin: EntropyRuntimeOriginCaller
  }

  /** @name PalletSchedulerError (492) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean
    readonly isNotFound: boolean
    readonly isTargetBlockNumberInPast: boolean
    readonly isRescheduleNoChange: boolean
    readonly type:
      | 'FailedToSchedule'
      | 'NotFound'
      | 'TargetBlockNumberInPast'
      | 'RescheduleNoChange'
  }

  /** @name PalletPreimageRequestStatus (493) */
  interface PalletPreimageRequestStatus extends Enum {
    readonly isUnrequested: boolean
    readonly asUnrequested: Option<ITuple<[AccountId32, u128]>>
    readonly isRequested: boolean
    readonly asRequested: u32
    readonly type: 'Unrequested' | 'Requested'
  }

  /** @name PalletPreimageError (496) */
  interface PalletPreimageError extends Enum {
    readonly isTooLarge: boolean
    readonly isAlreadyNoted: boolean
    readonly isNotAuthorized: boolean
    readonly isNotNoted: boolean
    readonly isRequested: boolean
    readonly isNotRequested: boolean
    readonly type:
      | 'TooLarge'
      | 'AlreadyNoted'
      | 'NotAuthorized'
      | 'NotNoted'
      | 'Requested'
      | 'NotRequested'
  }

  /** @name PalletProxyProxyDefinition (499) */
  interface PalletProxyProxyDefinition extends Struct {
    readonly delegate: AccountId32
    readonly proxyType: EntropyRuntimeProxyType
    readonly delay: u32
  }

  /** @name PalletProxyAnnouncement (503) */
  interface PalletProxyAnnouncement extends Struct {
    readonly real: AccountId32
    readonly callHash: H256
    readonly height: u32
  }

  /** @name PalletProxyError (505) */
  interface PalletProxyError extends Enum {
    readonly isTooMany: boolean
    readonly isNotFound: boolean
    readonly isNotProxy: boolean
    readonly isUnproxyable: boolean
    readonly isDuplicate: boolean
    readonly isNoPermission: boolean
    readonly isUnannounced: boolean
    readonly isNoSelfProxy: boolean
    readonly type:
      | 'TooMany'
      | 'NotFound'
      | 'NotProxy'
      | 'Unproxyable'
      | 'Duplicate'
      | 'NoPermission'
      | 'Unannounced'
      | 'NoSelfProxy'
  }

  /** @name PalletMultisigMultisig (507) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint
    readonly deposit: u128
    readonly depositor: AccountId32
    readonly approvals: Vec<AccountId32>
  }

  /** @name PalletMultisigError (509) */
  interface PalletMultisigError extends Enum {
    readonly isMinimumThreshold: boolean
    readonly isAlreadyApproved: boolean
    readonly isNoApprovalsNeeded: boolean
    readonly isTooFewSignatories: boolean
    readonly isTooManySignatories: boolean
    readonly isSignatoriesOutOfOrder: boolean
    readonly isSenderInSignatories: boolean
    readonly isNotFound: boolean
    readonly isNotOwner: boolean
    readonly isNoTimepoint: boolean
    readonly isWrongTimepoint: boolean
    readonly isUnexpectedTimepoint: boolean
    readonly isMaxWeightTooLow: boolean
    readonly isAlreadyStored: boolean
    readonly type:
      | 'MinimumThreshold'
      | 'AlreadyApproved'
      | 'NoApprovalsNeeded'
      | 'TooFewSignatories'
      | 'TooManySignatories'
      | 'SignatoriesOutOfOrder'
      | 'SenderInSignatories'
      | 'NotFound'
      | 'NotOwner'
      | 'NoTimepoint'
      | 'WrongTimepoint'
      | 'UnexpectedTimepoint'
      | 'MaxWeightTooLow'
      | 'AlreadyStored'
  }

  /** @name PalletBountiesBounty (510) */
  interface PalletBountiesBounty extends Struct {
    readonly proposer: AccountId32
    readonly value: u128
    readonly fee: u128
    readonly curatorDeposit: u128
    readonly bond: u128
    readonly status: PalletBountiesBountyStatus
  }

  /** @name PalletBountiesBountyStatus (511) */
  interface PalletBountiesBountyStatus extends Enum {
    readonly isProposed: boolean
    readonly isApproved: boolean
    readonly isFunded: boolean
    readonly isCuratorProposed: boolean
    readonly asCuratorProposed: {
      readonly curator: AccountId32
    } & Struct
    readonly isActive: boolean
    readonly asActive: {
      readonly curator: AccountId32
      readonly updateDue: u32
    } & Struct
    readonly isPendingPayout: boolean
    readonly asPendingPayout: {
      readonly curator: AccountId32
      readonly beneficiary: AccountId32
      readonly unlockAt: u32
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Approved'
      | 'Funded'
      | 'CuratorProposed'
      | 'Active'
      | 'PendingPayout'
  }

  /** @name PalletBountiesError (513) */
  interface PalletBountiesError extends Enum {
    readonly isInsufficientProposersBalance: boolean
    readonly isInvalidIndex: boolean
    readonly isReasonTooBig: boolean
    readonly isUnexpectedStatus: boolean
    readonly isRequireCurator: boolean
    readonly isInvalidValue: boolean
    readonly isInvalidFee: boolean
    readonly isPendingPayout: boolean
    readonly isPremature: boolean
    readonly isHasActiveChildBounty: boolean
    readonly isTooManyQueued: boolean
    readonly type:
      | 'InsufficientProposersBalance'
      | 'InvalidIndex'
      | 'ReasonTooBig'
      | 'UnexpectedStatus'
      | 'RequireCurator'
      | 'InvalidValue'
      | 'InvalidFee'
      | 'PendingPayout'
      | 'Premature'
      | 'HasActiveChildBounty'
      | 'TooManyQueued'
  }

  /** @name PalletTipsOpenTip (514) */
  interface PalletTipsOpenTip extends Struct {
    readonly reason: H256
    readonly who: AccountId32
    readonly finder: AccountId32
    readonly deposit: u128
    readonly closes: Option<u32>
    readonly tips: Vec<ITuple<[AccountId32, u128]>>
    readonly findersFee: bool
  }

  /** @name PalletTipsError (515) */
  interface PalletTipsError extends Enum {
    readonly isReasonTooBig: boolean
    readonly isAlreadyKnown: boolean
    readonly isUnknownTip: boolean
    readonly isNotFinder: boolean
    readonly isStillOpen: boolean
    readonly isPremature: boolean
    readonly type:
      | 'ReasonTooBig'
      | 'AlreadyKnown'
      | 'UnknownTip'
      | 'NotFinder'
      | 'StillOpen'
      | 'Premature'
  }

  /** @name PalletTransactionStorageTransactionInfo (517) */
  interface PalletTransactionStorageTransactionInfo extends Struct {
    readonly chunkRoot: H256
    readonly contentHash: H256
    readonly size_: u32
    readonly blockChunks: u32
  }

  /** @name PalletTransactionStorageError (519) */
  interface PalletTransactionStorageError extends Enum {
    readonly isInsufficientFunds: boolean
    readonly isNotConfigured: boolean
    readonly isRenewedNotFound: boolean
    readonly isEmptyTransaction: boolean
    readonly isUnexpectedProof: boolean
    readonly isInvalidProof: boolean
    readonly isMissingProof: boolean
    readonly isMissingStateData: boolean
    readonly isDoubleCheck: boolean
    readonly isProofNotChecked: boolean
    readonly isTransactionTooLarge: boolean
    readonly isTooManyTransactions: boolean
    readonly isBadContext: boolean
    readonly type:
      | 'InsufficientFunds'
      | 'NotConfigured'
      | 'RenewedNotFound'
      | 'EmptyTransaction'
      | 'UnexpectedProof'
      | 'InvalidProof'
      | 'MissingProof'
      | 'MissingStateData'
      | 'DoubleCheck'
      | 'ProofNotChecked'
      | 'TransactionTooLarge'
      | 'TooManyTransactions'
      | 'BadContext'
  }

  /** @name PalletBagsListListNode (520) */
  interface PalletBagsListListNode extends Struct {
    readonly id: AccountId32
    readonly prev: Option<AccountId32>
    readonly next: Option<AccountId32>
    readonly bagUpper: u64
    readonly score: u64
  }

  /** @name PalletBagsListListBag (521) */
  interface PalletBagsListListBag extends Struct {
    readonly head: Option<AccountId32>
    readonly tail: Option<AccountId32>
  }

  /** @name PalletBagsListError (523) */
  interface PalletBagsListError extends Enum {
    readonly isList: boolean
    readonly asList: PalletBagsListListListError
    readonly type: 'List'
  }

  /** @name PalletBagsListListListError (524) */
  interface PalletBagsListListListError extends Enum {
    readonly isDuplicate: boolean
    readonly isNotHeavier: boolean
    readonly isNotInSameBag: boolean
    readonly isNodeNotFound: boolean
    readonly type: 'Duplicate' | 'NotHeavier' | 'NotInSameBag' | 'NodeNotFound'
  }

  /** @name PalletNominationPoolsPoolMember (525) */
  interface PalletNominationPoolsPoolMember extends Struct {
    readonly poolId: u32
    readonly points: u128
    readonly lastRecordedRewardCounter: u128
    readonly unbondingEras: BTreeMap<u32, u128>
  }

  /** @name PalletNominationPoolsBondedPoolInner (528) */
  interface PalletNominationPoolsBondedPoolInner extends Struct {
    readonly points: u128
    readonly state: PalletNominationPoolsPoolState
    readonly memberCounter: u32
    readonly roles: PalletNominationPoolsPoolRoles
  }

  /** @name PalletNominationPoolsPoolRoles (529) */
  interface PalletNominationPoolsPoolRoles extends Struct {
    readonly depositor: AccountId32
    readonly root: Option<AccountId32>
    readonly nominator: Option<AccountId32>
    readonly stateToggler: Option<AccountId32>
  }

  /** @name PalletNominationPoolsRewardPool (530) */
  interface PalletNominationPoolsRewardPool extends Struct {
    readonly lastRecordedRewardCounter: u128
    readonly lastRecordedTotalPayouts: u128
    readonly totalRewardsClaimed: u128
  }

  /** @name PalletNominationPoolsSubPools (531) */
  interface PalletNominationPoolsSubPools extends Struct {
    readonly noEra: PalletNominationPoolsUnbondPool
    readonly withEra: BTreeMap<u32, PalletNominationPoolsUnbondPool>
  }

  /** @name PalletNominationPoolsUnbondPool (532) */
  interface PalletNominationPoolsUnbondPool extends Struct {
    readonly points: u128
    readonly balance: u128
  }

  /** @name PalletNominationPoolsError (538) */
  interface PalletNominationPoolsError extends Enum {
    readonly isPoolNotFound: boolean
    readonly isPoolMemberNotFound: boolean
    readonly isRewardPoolNotFound: boolean
    readonly isSubPoolsNotFound: boolean
    readonly isAccountBelongsToOtherPool: boolean
    readonly isFullyUnbonding: boolean
    readonly isMaxUnbondingLimit: boolean
    readonly isCannotWithdrawAny: boolean
    readonly isMinimumBondNotMet: boolean
    readonly isOverflowRisk: boolean
    readonly isNotDestroying: boolean
    readonly isNotNominator: boolean
    readonly isNotKickerOrDestroying: boolean
    readonly isNotOpen: boolean
    readonly isMaxPools: boolean
    readonly isMaxPoolMembers: boolean
    readonly isCanNotChangeState: boolean
    readonly isDoesNotHavePermission: boolean
    readonly isMetadataExceedsMaxLen: boolean
    readonly isDefensive: boolean
    readonly asDefensive: PalletNominationPoolsDefensiveError
    readonly isPartialUnbondNotAllowedPermissionlessly: boolean
    readonly type:
      | 'PoolNotFound'
      | 'PoolMemberNotFound'
      | 'RewardPoolNotFound'
      | 'SubPoolsNotFound'
      | 'AccountBelongsToOtherPool'
      | 'FullyUnbonding'
      | 'MaxUnbondingLimit'
      | 'CannotWithdrawAny'
      | 'MinimumBondNotMet'
      | 'OverflowRisk'
      | 'NotDestroying'
      | 'NotNominator'
      | 'NotKickerOrDestroying'
      | 'NotOpen'
      | 'MaxPools'
      | 'MaxPoolMembers'
      | 'CanNotChangeState'
      | 'DoesNotHavePermission'
      | 'MetadataExceedsMaxLen'
      | 'Defensive'
      | 'PartialUnbondNotAllowedPermissionlessly'
  }

  /** @name PalletNominationPoolsDefensiveError (539) */
  interface PalletNominationPoolsDefensiveError extends Enum {
    readonly isNotEnoughSpaceInUnbondPool: boolean
    readonly isPoolNotFound: boolean
    readonly isRewardPoolNotFound: boolean
    readonly isSubPoolsNotFound: boolean
    readonly isBondedStashKilledPrematurely: boolean
    readonly type:
      | 'NotEnoughSpaceInUnbondPool'
      | 'PoolNotFound'
      | 'RewardPoolNotFound'
      | 'SubPoolsNotFound'
      | 'BondedStashKilledPrematurely'
  }

  /** @name PalletRelayerRegisteringDetails (540) */
  interface PalletRelayerRegisteringDetails extends Struct {
    readonly isRegistering: bool
    readonly constraintAccount: AccountId32
    readonly isSwapping: bool
    readonly confirmations: Bytes
    readonly constraints: Option<EntropySharedConstraints>
  }

  /** @name PalletRelayerError (541) */
  interface PalletRelayerError extends Enum {
    readonly isTest: boolean
    readonly isNotYourResponsibility: boolean
    readonly isNoResponsibility: boolean
    readonly isAlreadySubmitted: boolean
    readonly isNoThresholdKey: boolean
    readonly isNotRegistering: boolean
    readonly isNotRegistered: boolean
    readonly isInvalidSubgroup: boolean
    readonly isAlreadyConfirmed: boolean
    readonly isNotInSigningGroup: boolean
    readonly isInvalidValidatorId: boolean
    readonly isIpAddressError: boolean
    readonly isSigningGroupError: boolean
    readonly isNoSyncedValidators: boolean
    readonly type:
      | 'Test'
      | 'NotYourResponsibility'
      | 'NoResponsibility'
      | 'AlreadySubmitted'
      | 'NoThresholdKey'
      | 'NotRegistering'
      | 'NotRegistered'
      | 'InvalidSubgroup'
      | 'AlreadyConfirmed'
      | 'NotInSigningGroup'
      | 'InvalidValidatorId'
      | 'IpAddressError'
      | 'SigningGroupError'
      | 'NoSyncedValidators'
  }

  /** @name EntropySharedConstraintsArch (543) */
  interface EntropySharedConstraintsArch extends Enum {
    readonly isEvm: boolean
    readonly isBtc: boolean
    readonly isGeneric: boolean
    readonly type: 'Evm' | 'Btc' | 'Generic'
  }

  /** @name PalletConstraintsError (544) */
  interface PalletConstraintsError extends Enum {
    readonly isNotAuthorized: boolean
    readonly isArchitectureDisabled: boolean
    readonly isAclLengthExceeded: boolean
    readonly type:
      | 'NotAuthorized'
      | 'ArchitectureDisabled'
      | 'AclLengthExceeded'
  }

  /** @name PalletTransactionPauseModuleError (545) */
  interface PalletTransactionPauseModuleError extends Enum {
    readonly isCannotPause: boolean
    readonly isInvalidCharacter: boolean
    readonly type: 'CannotPause' | 'InvalidCharacter'
  }

  /** @name PalletFreeTxElectricalPanel (546) */
  interface PalletFreeTxElectricalPanel extends Struct {
    readonly batteries: u32
    readonly zaps: u32
    readonly used: PalletFreeTxElectricityMeter
  }

  /** @name PalletFreeTxElectricityMeter (547) */
  interface PalletFreeTxElectricityMeter extends Struct {
    readonly latestEra: u32
    readonly count: u32
  }

  /** @name PalletFreeTxError (548) */
  interface PalletFreeTxError extends Enum {
    readonly isElectricityIsDisabled: boolean
    readonly isNoCellsAvailable: boolean
    readonly isElectricityEraLimitReached: boolean
    readonly type:
      | 'ElectricityIsDisabled'
      | 'NoCellsAvailable'
      | 'ElectricityEraLimitReached'
  }

  /** @name SpRuntimeMultiSignature (550) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean
    readonly asEd25519: SpCoreEd25519Signature
    readonly isSr25519: boolean
    readonly asSr25519: SpCoreSr25519Signature
    readonly isEcdsa: boolean
    readonly asEcdsa: SpCoreEcdsaSignature
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa'
  }

  /** @name SpCoreEcdsaSignature (551) */
  interface SpCoreEcdsaSignature extends U8aFixed {}

  /** @name FrameSystemExtensionsCheckSpecVersion (554) */
  type FrameSystemExtensionsCheckSpecVersion = Null

  /** @name FrameSystemExtensionsCheckTxVersion (555) */
  type FrameSystemExtensionsCheckTxVersion = Null

  /** @name FrameSystemExtensionsCheckGenesis (556) */
  type FrameSystemExtensionsCheckGenesis = Null

  /** @name FrameSystemExtensionsCheckNonce (559) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (560) */
  type FrameSystemExtensionsCheckWeight = Null

  /** @name PalletTransactionPaymentChargeTransactionPayment (561) */
  interface PalletTransactionPaymentChargeTransactionPayment
    extends Compact<u128> {}

  /** @name PalletFreeTxValidateElectricityPayment (562) */
  type PalletFreeTxValidateElectricityPayment = Null

  /** @name EntropyRuntimeRuntime (563) */
  type EntropyRuntimeRuntime = Null
} // declare module
