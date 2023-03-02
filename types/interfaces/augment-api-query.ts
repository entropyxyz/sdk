// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/storage'

import type {
  ApiTypes,
  AugmentedQuery,
  QueryableStorageEntry,
} from '@polkadot/api-base/types'
import type { Data } from '@polkadot/types'
import type {
  BTreeMap,
  Bytes,
  Null,
  Option,
  U8aFixed,
  Vec,
  WrapperKeepOpaque,
  WrapperOpaque,
  bool,
  u128,
  u32,
  u64,
  u8,
} from '@polkadot/types-codec'
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types'
import type {
  AccountId32,
  Call,
  H256,
  Perbill,
  Percent,
} from '@polkadot/types/interfaces/runtime'
import type {
  EntropyRuntimeSessionKeys,
  EntropySharedConstraintsAclH160,
  EntropySharedConstraintsAclH256,
  EntropySharedConstraintsArch,
  EntropySharedMessage,
  FrameSupportDispatchPerDispatchClassWeight,
  FrameSystemAccountInfo,
  FrameSystemEventRecord,
  FrameSystemLastRuntimeUpgradeInfo,
  FrameSystemPhase,
  PalletAuthorshipUncleEntryItem,
  PalletBagsListListBag,
  PalletBagsListListNode,
  PalletBalancesAccountData,
  PalletBalancesBalanceLock,
  PalletBalancesReleases,
  PalletBalancesReserveData,
  PalletBountiesBounty,
  PalletCollectiveVotes,
  PalletDemocracyPreimageStatus,
  PalletDemocracyReferendumInfo,
  PalletDemocracyReleases,
  PalletDemocracyVoteThreshold,
  PalletDemocracyVoteVoting,
  PalletElectionProviderMultiPhasePhase,
  PalletElectionProviderMultiPhaseReadySolution,
  PalletElectionProviderMultiPhaseRoundSnapshot,
  PalletElectionProviderMultiPhaseSignedSignedSubmission,
  PalletElectionProviderMultiPhaseSolutionOrSnapshotSize,
  PalletElectionsPhragmenSeatHolder,
  PalletElectionsPhragmenVoter,
  PalletFreeTxElectricalPanel,
  PalletGrandpaStoredPendingChange,
  PalletGrandpaStoredState,
  PalletIdentityRegistrarInfo,
  PalletIdentityRegistration,
  PalletImOnlineBoundedOpaqueNetworkState,
  PalletImOnlineSr25519AppSr25519Public,
  PalletMultisigMultisig,
  PalletNominationPoolsBondedPoolInner,
  PalletNominationPoolsPoolMember,
  PalletNominationPoolsRewardPool,
  PalletNominationPoolsSubPools,
  PalletPreimageRequestStatus,
  PalletProxyAnnouncement,
  PalletProxyProxyDefinition,
  PalletRecoveryActiveRecovery,
  PalletRecoveryRecoveryConfig,
  PalletRelayerRegisteringDetails,
  PalletSchedulerScheduledV3,
  PalletSocietyBid,
  PalletSocietyBidKind,
  PalletSocietyVote,
  PalletSocietyVouchingStatus,
  PalletStakingActiveEraInfo,
  PalletStakingEraRewardPoints,
  PalletStakingExposure,
  PalletStakingExtensionServerInfo,
  PalletStakingForcing,
  PalletStakingNominations,
  PalletStakingReleases,
  PalletStakingRewardDestination,
  PalletStakingSlashingSlashingSpans,
  PalletStakingSlashingSpanRecord,
  PalletStakingStakingLedger,
  PalletStakingUnappliedSlash,
  PalletStakingValidatorPrefs,
  PalletTipsOpenTip,
  PalletTransactionPaymentReleases,
  PalletTransactionStorageTransactionInfo,
  PalletTreasuryProposal,
  PalletVestingReleases,
  PalletVestingVestingInfo,
  SpAuthorityDiscoveryAppPublic,
  SpConsensusBabeAppPublic,
  SpConsensusBabeBabeEpochConfiguration,
  SpConsensusBabeDigestsNextConfigDescriptor,
  SpConsensusBabeDigestsPreDigest,
  SpCoreCryptoKeyTypeId,
  SpNposElectionsElectionScore,
  SpRuntimeDigest,
  SpStakingOffenceOffenceDetails,
} from '@polkadot/types/lookup'
import type { Observable } from '@polkadot/types/types'

export type __AugmentedQuery<ApiType extends ApiTypes> = AugmentedQuery<
  ApiType,
  () => unknown
>
export type __QueryableStorageEntry<
  ApiType extends ApiTypes
> = QueryableStorageEntry<ApiType>

declare module '@polkadot/api-base/types/storage' {
  interface AugmentedQueries<ApiType extends ApiTypes> {
    authorityDiscovery: {
      /**
       * Keys of the current authority set.
       **/
      keys: AugmentedQuery<
        ApiType,
        () => Observable<Vec<SpAuthorityDiscoveryAppPublic>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Keys of the next authority set.
       **/
      nextKeys: AugmentedQuery<
        ApiType,
        () => Observable<Vec<SpAuthorityDiscoveryAppPublic>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    authorship: {
      /**
       * Author of current block.
       **/
      author: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Whether uncles were already set in this block.
       **/
      didSetUncles: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Uncles
       **/
      uncles: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletAuthorshipUncleEntryItem>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    babe: {
      /**
       * Current epoch authorities.
       **/
      authorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * This field should always be populated during block processing unless
       * secondary plain slots are enabled (which don't contain a VRF output).
       *
       * It is set in `on_finalize`, before it will contain the value from the last block.
       **/
      authorVrfRandomness: AugmentedQuery<
        ApiType,
        () => Observable<Option<U8aFixed>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Current slot number.
       **/
      currentSlot: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The configuration for the current epoch. Should never be `None` as it is initialized in
       * genesis.
       **/
      epochConfig: AugmentedQuery<
        ApiType,
        () => Observable<Option<SpConsensusBabeBabeEpochConfiguration>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Current epoch index.
       **/
      epochIndex: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The block numbers when the last and current epoch have started, respectively `N-1` and
       * `N`.
       * NOTE: We track this is in order to annotate the block number when a given pool of
       * entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
       * slots, which may be skipped, the block numbers may not line up with the slot numbers.
       **/
      epochStart: AugmentedQuery<
        ApiType,
        () => Observable<ITuple<[u32, u32]>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The slot at which the first epoch actually started. This is 0
       * until the first block of the chain.
       **/
      genesisSlot: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Temporary value (cleared at block finalization) which is `Some`
       * if per-block initialization has already been called for current block.
       **/
      initialized: AugmentedQuery<
        ApiType,
        () => Observable<Option<Option<SpConsensusBabeDigestsPreDigest>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * How late the current block is compared to its parent.
       *
       * This entry is populated as part of block execution and is cleaned up
       * on block finalization. Querying this storage entry outside of block
       * execution context should always yield zero.
       **/
      lateness: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Next epoch authorities.
       **/
      nextAuthorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The configuration for the next epoch, `None` if the config will not change
       * (you can fallback to `EpochConfig` instead in that case).
       **/
      nextEpochConfig: AugmentedQuery<
        ApiType,
        () => Observable<Option<SpConsensusBabeBabeEpochConfiguration>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Next epoch randomness.
       **/
      nextRandomness: AugmentedQuery<ApiType, () => Observable<U8aFixed>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Pending epoch configuration change that will be applied when the next epoch is enacted.
       **/
      pendingEpochConfigChange: AugmentedQuery<
        ApiType,
        () => Observable<Option<SpConsensusBabeDigestsNextConfigDescriptor>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The epoch randomness for the *current* epoch.
       *
       * # Security
       *
       * This MUST NOT be used for gambling, as it can be influenced by a
       * malicious validator in the short term. It MAY be used in many
       * cryptographic protocols, however, so long as one remembers that this
       * (like everything else on-chain) it is public. For example, it can be
       * used where a number is needed that cannot have been chosen by an
       * adversary, for purposes such as public-coin zero-knowledge proofs.
       **/
      randomness: AugmentedQuery<ApiType, () => Observable<U8aFixed>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Randomness under construction.
       *
       * We make a trade-off between storage accesses and list length.
       * We store the under-construction randomness in segments of up to
       * `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
       *
       * Once a segment reaches this length, we begin the next one.
       * We reset all segments and return to `0` at the beginning of every
       * epoch.
       **/
      segmentIndex: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay.
       **/
      underConstruction: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<U8aFixed>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    bagsList: {
      /**
       * Counter for the related counted storage map
       **/
      counterForListNodes: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * A bag stored in storage.
       *
       * Stores a `Bag` struct, which stores head and tail pointers to itself.
       **/
      listBags: AugmentedQuery<
        ApiType,
        (
          arg: u64 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletBagsListListBag>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>
      /**
       * A single node, within some bag.
       *
       * Nodes store links forward and back within their respective bags.
       **/
      listNodes: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletBagsListListNode>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    balances: {
      /**
       * The Balances pallet example of storing the balance of an account.
       *
       * # Example
       *
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
       * }
       * ```
       *
       * You can also store the balance of an account in the `System` pallet.
       *
       * # Example
       *
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = System
       * }
       * ```
       *
       * But this comes with tradeoffs, storing account balances in the system pallet stores
       * `frame_system` data alongside the account data contrary to storing account balances in the
       * `Balances` pallet, which uses a `StorageMap` to store balances data only.
       * NOTE: This is only used in the case that this pallet is used to store balances.
       **/
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletBalancesAccountData>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Any liquidity locks on some account balances.
       * NOTE: Should only be accessed when setting, changing and freeing a lock.
       **/
      locks: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesBalanceLock>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Named reserves on some account balances.
       **/
      reserves: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesReserveData>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Storage version of the pallet.
       *
       * This is set to v2.0.0 for new networks.
       **/
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletBalancesReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The total units issued in the system.
       **/
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    bounties: {
      /**
       * Bounties that have been made.
       **/
      bounties: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletBountiesBounty>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Bounty indices that have been approved but not yet funded.
       **/
      bountyApprovals: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Number of bounty proposals that have been made.
       **/
      bountyCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The description of each bounty.
       **/
      bountyDescriptions: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<Bytes>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    constraints: {
      /**
       * 2-ary set associating a signature-request account to the architectures it has active
       * constraints on.
       **/
      activeArchitectures: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2:
            | EntropySharedConstraintsArch
            | 'Evm'
            | 'Btc'
            | 'Generic'
            | number
            | Uint8Array
        ) => Observable<Option<Null>>,
        [AccountId32, EntropySharedConstraintsArch]
      > &
        QueryableStorageEntry<
          ApiType,
          [AccountId32, EntropySharedConstraintsArch]
        >
      /**
       * If the constraint-modification `AccountId` and signature-request `AccountId` tuple as a key
       * exists, then the constraint-modification `AccountId` is authorized to modify the
       * constraints for this account
       **/
      allowedToModifyConstraints: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<Null>>,
        [AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, AccountId32]>
      /**
       * Stores the BTC ACL of each user
       **/
      btcAcl: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<EntropySharedConstraintsAclH256>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Stores the EVM ACL of each user
       **/
      evmAcl: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<EntropySharedConstraintsAclH160>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    council: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The prime member that helps determine the default vote behavior in case of absentations.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Call>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletCollectiveVotes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    democracy: {
      /**
       * A record of who vetoed what. Maps proposal hash to a possible existent block number
       * (until when it may not be resubmitted) and who vetoed it.
       **/
      blacklist: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<ITuple<[u32, Vec<AccountId32>]>>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Record of all proposals that have been subject to emergency cancellation.
       **/
      cancellations: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<bool>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Those who have locked a deposit.
       *
       * TWOX-NOTE: Safe, as increasing integer keys are safe.
       **/
      depositOf: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[Vec<AccountId32>, u128]>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * True if the last referendum tabled was submitted externally. False if it was a public
       * proposal.
       **/
      lastTabledWasExternal: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The lowest referendum index representing an unbaked referendum. Equal to
       * `ReferendumCount` if there isn't a unbaked referendum.
       **/
      lowestUnbaked: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The referendum to be tabled whenever it would be valid to table an external proposal.
       * This happens when a referendum needs to be tabled and one of two conditions are met:
       * - `LastTabledWasExternal` is `false`; or
       * - `PublicProps` is empty.
       **/
      nextExternal: AugmentedQuery<
        ApiType,
        () => Observable<Option<ITuple<[H256, PalletDemocracyVoteThreshold]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Map of hashes to the proposal preimage, along with who registered it and their deposit.
       * The block number is the block at which it was deposited.
       **/
      preimages: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletDemocracyPreimageStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * The number of (public) proposals that have been made so far.
       **/
      publicPropCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The public proposals. Unsorted. The second item is the proposal's hash.
       **/
      publicProps: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[u32, H256, AccountId32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The next free referendum index, aka the number of referenda started so far.
       **/
      referendumCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Information concerning any given referendum.
       *
       * TWOX-NOTE: SAFE as indexes are not under an attacker’s control.
       **/
      referendumInfoOf: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletDemocracyReferendumInfo>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Storage version of the pallet.
       *
       * New networks start with last version.
       **/
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletDemocracyReleases>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * All votes for a particular voter. We store the balance for the number of votes that we
       * have recorded. The second item is the total amount of delegations, that will be added.
       *
       * TWOX-NOTE: SAFE as `AccountId`s are crypto hashes anyway.
       **/
      votingOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletDemocracyVoteVoting>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    electionProviderMultiPhase: {
      /**
       * Current phase.
       **/
      currentPhase: AugmentedQuery<
        ApiType,
        () => Observable<PalletElectionProviderMultiPhasePhase>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Desired number of targets to elect for this round.
       *
       * Only exists when [`Snapshot`] is present.
       **/
      desiredTargets: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The minimum score that each 'untrusted' solution must attain in order to be considered
       * feasible.
       *
       * Can be set via `set_minimum_untrusted_score`.
       **/
      minimumUntrustedScore: AugmentedQuery<
        ApiType,
        () => Observable<Option<SpNposElectionsElectionScore>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Current best solution, signed or unsigned, queued to be returned upon `elect`.
       **/
      queuedSolution: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletElectionProviderMultiPhaseReadySolution>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Internal counter for the number of rounds.
       *
       * This is useful for de-duplication of transactions submitted to the pool, and general
       * diagnostics of the pallet.
       *
       * This is merely incremented once per every time that an upstream `elect` is called.
       **/
      round: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * A sorted, bounded set of `(score, index)`, where each `index` points to a value in
       * `SignedSubmissions`.
       *
       * We never need to process more than a single signed submission at a time. Signed submissions
       * can be quite large, so we're willing to pay the cost of multiple database accesses to access
       * them one at a time instead of reading and decoding all of them at once.
       **/
      signedSubmissionIndices: AugmentedQuery<
        ApiType,
        () => Observable<BTreeMap<SpNposElectionsElectionScore, u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The next index to be assigned to an incoming signed submission.
       *
       * Every accepted submission is assigned a unique index; that index is bound to that particular
       * submission for the duration of the election. On election finalization, the next index is
       * reset to 0.
       *
       * We can't just use `SignedSubmissionIndices.len()`, because that's a bounded set; past its
       * capacity, it will simply saturate. We can't just iterate over `SignedSubmissionsMap`,
       * because iteration is slow. Instead, we store the value here.
       **/
      signedSubmissionNextIndex: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Unchecked, signed solutions.
       *
       * Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
       * allowing us to keep only a single one in memory at a time.
       *
       * Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
       * affect; we shouldn't need a cryptographically secure hasher.
       **/
      signedSubmissionsMap: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<
          Option<PalletElectionProviderMultiPhaseSignedSignedSubmission>
        >,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Snapshot data of the round.
       *
       * This is created at the beginning of the signed phase and cleared upon calling `elect`.
       **/
      snapshot: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletElectionProviderMultiPhaseRoundSnapshot>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The metadata of the [`RoundSnapshot`]
       *
       * Only exists when [`Snapshot`] is present.
       **/
      snapshotMetadata: AugmentedQuery<
        ApiType,
        () => Observable<
          Option<PalletElectionProviderMultiPhaseSolutionOrSnapshotSize>
        >,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    elections: {
      /**
       * The present candidate list. A current member or runner-up can never enter this vector
       * and is always implicitly assumed to be a candidate.
       *
       * Second element is the deposit.
       *
       * Invariant: Always sorted based on account id.
       **/
      candidates: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[AccountId32, u128]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The total number of vote rounds that have happened, excluding the upcoming one.
       **/
      electionRounds: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current elected members.
       *
       * Invariant: Always sorted based on account id.
       **/
      members: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletElectionsPhragmenSeatHolder>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current reserved runners-up.
       *
       * Invariant: Always sorted based on rank (worse to best). Upon removal of a member, the
       * last (i.e. _best_) runner-up will be replaced.
       **/
      runnersUp: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletElectionsPhragmenSeatHolder>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Votes and locked stake of a particular voter.
       *
       * TWOX-NOTE: SAFE as `AccountId` is a crypto hash.
       **/
      voting: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletElectionsPhragmenVoter>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    freeTx: {
      /**
       * Stores the balance of batteries, zaps, and usage of electricity of a user
       **/
      electricalAccount: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletFreeTxElectricalPanel>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Maximum number of cells a user can use per era.
       *
       * `None`: users can use as many cells as they own.
       * `Some(0)`: cells are disabled.
       * `Some(n)`: users can use up to `n` cells per era
       **/
      maxUserElectricityUsagePerEra: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    grandpa: {
      /**
       * The number of changes (both in terms of keys and underlying economic responsibilities)
       * in the "set" of Grandpa validators from genesis.
       **/
      currentSetId: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * next block number where we can force a change.
       **/
      nextForced: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Pending change: (signaled at, scheduled change).
       **/
      pendingChange: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletGrandpaStoredPendingChange>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * A mapping from grandpa set ID to the index of the *most recent* session for which its
       * members were responsible.
       *
       * TWOX-NOTE: `SetId` is not under user control.
       **/
      setIdSession: AugmentedQuery<
        ApiType,
        (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<u32>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>
      /**
       * `true` if we are currently stalled.
       **/
      stalled: AugmentedQuery<
        ApiType,
        () => Observable<Option<ITuple<[u32, u32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * State of the current authority set.
       **/
      state: AugmentedQuery<
        ApiType,
        () => Observable<PalletGrandpaStoredState>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    historical: {
      /**
       * Mapping from historical session indices to session-data root hash and validator count.
       **/
      historicalSessions: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[H256, u32]>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * The range of historical sessions we store. [first, last)
       **/
      storedRange: AugmentedQuery<
        ApiType,
        () => Observable<Option<ITuple<[u32, u32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    identity: {
      /**
       * Information that is pertinent to identify the entity behind an account.
       *
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       **/
      identityOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletIdentityRegistration>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The set of registrars. Not expected to get very big as can only be added through a
       * special origin (likely a council motion).
       *
       * The index into this can be cast to `RegistrarIndex` to get a valid value.
       **/
      registrars: AugmentedQuery<
        ApiType,
        () => Observable<Vec<Option<PalletIdentityRegistrarInfo>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Alternative "sub" identities of this account.
       *
       * The first item is the deposit, the second is a vector of the accounts.
       *
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       **/
      subsOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[u128, Vec<AccountId32>]>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The super-identity of an alternative "sub" identity together with its name, within that
       * context. If the account is not some other account's sub-identity, then just `None`.
       **/
      superOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<ITuple<[AccountId32, Data]>>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    imOnline: {
      /**
       * For each session index, we keep a mapping of `ValidatorId<T>` to the
       * number of blocks authored by the given authority.
       **/
      authoredBlocks: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<u32>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * The block number after which it's ok to send heartbeats in the current
       * session.
       *
       * At the beginning of each session we set this to a value that should fall
       * roughly in the middle of the session duration. The idea is to first wait for
       * the validators to produce a block in the current session, so that the
       * heartbeat later on will not be necessary.
       *
       * This value will only be used as a fallback if we fail to get a proper session
       * progress estimate from `NextSessionRotation`, as those estimates should be
       * more accurate then the value we calculate for `HeartbeatAfter`.
       **/
      heartbeatAfter: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current set of keys that may issue a heartbeat.
       **/
      keys: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletImOnlineSr25519AppSr25519Public>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * For each session index, we keep a mapping of `SessionIndex` and `AuthIndex` to
       * `WrapperOpaque<BoundedOpaqueNetworkState>`.
       **/
      receivedHeartbeats: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: u32 | AnyNumber | Uint8Array
        ) => Observable<
          Option<WrapperOpaque<PalletImOnlineBoundedOpaqueNetworkState>>
        >,
        [u32, u32]
      > &
        QueryableStorageEntry<ApiType, [u32, u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    indices: {
      /**
       * The lookup from index to account.
       **/
      accounts: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[AccountId32, u128, bool]>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    multisig: {
      calls: AugmentedQuery<
        ApiType,
        (
          arg: U8aFixed | string | Uint8Array
        ) => Observable<
          Option<ITuple<[WrapperKeepOpaque<Call>, AccountId32, u128]>>
        >,
        [U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [U8aFixed]>
      /**
       * The set of open multisig operations.
       **/
      multisigs: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: U8aFixed | string | Uint8Array
        ) => Observable<Option<PalletMultisigMultisig>>,
        [AccountId32, U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, U8aFixed]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    nominationPools: {
      /**
       * Storage for bonded pools.
       **/
      bondedPools: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletNominationPoolsBondedPoolInner>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Counter for the related counted storage map
       **/
      counterForBondedPools: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForMetadata: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForPoolMembers: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForReversePoolIdLookup: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForRewardPools: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForSubPoolsStorage: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Ever increasing number of all pools created so far.
       **/
      lastPoolId: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Maximum number of members that can exist in the system. If `None`, then the count
       * members are not bound on a system wide basis.
       **/
      maxPoolMembers: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Maximum number of members that may belong to pool. If `None`, then the count of
       * members is not bound on a per pool basis.
       **/
      maxPoolMembersPerPool: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Maximum number of nomination pools that can exist. If `None`, then an unbounded number of
       * pools can exist.
       **/
      maxPools: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Metadata for the pool.
       **/
      metadata: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Minimum bond required to create a pool.
       *
       * This is the amount that the depositor must put as their initial stake in the pool, as an
       * indication of "skin in the game".
       *
       * This is the value that will always exist in the staking ledger of the pool bonded account
       * while all other accounts leave.
       **/
      minCreateBond: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Minimum amount to bond to join a pool.
       **/
      minJoinBond: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Active members.
       **/
      poolMembers: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletNominationPoolsPoolMember>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * A reverse lookup from the pool's account id to its id.
       *
       * This is only used for slashing. In all other instances, the pool id is used, and the
       * accounts are deterministically derived from it.
       **/
      reversePoolIdLookup: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<Option<u32>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Reward pools. This is where there rewards for each pool accumulate. When a members payout
       * is claimed, the balance comes out fo the reward pool. Keyed by the bonded pools account.
       **/
      rewardPools: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletNominationPoolsRewardPool>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Groups of unbonding pools. Each group of unbonding pools belongs to a bonded pool,
       * hence the name sub-pools. Keyed by the bonded pools account.
       **/
      subPoolsStorage: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletNominationPoolsSubPools>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    offences: {
      /**
       * A vector of reports of the same kind that happened at the same time slot.
       **/
      concurrentReportsIndex: AugmentedQuery<
        ApiType,
        (
          arg1: U8aFixed | string | Uint8Array,
          arg2: Bytes | string | Uint8Array
        ) => Observable<Vec<H256>>,
        [U8aFixed, Bytes]
      > &
        QueryableStorageEntry<ApiType, [U8aFixed, Bytes]>
      /**
       * The primary structure that holds all offence records keyed by report identifiers.
       **/
      reports: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<SpStakingOffenceOffenceDetails>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Enumerates all reports of a kind along with the time they happened.
       *
       * All reports are sorted by the time of offence.
       *
       * Note that the actual type of this mapping is `Vec<u8>`, this is because values of
       * different types are not supported at the moment so we are doing the manual serialization.
       **/
      reportsByKindIndex: AugmentedQuery<
        ApiType,
        (arg: U8aFixed | string | Uint8Array) => Observable<Bytes>,
        [U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [U8aFixed]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    preimage: {
      /**
       * The preimages stored by this pallet.
       **/
      preimageFor: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Bytes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * The request status of a given hash.
       **/
      statusFor: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletPreimageRequestStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    proxy: {
      /**
       * The announcements made by the proxy (key).
       **/
      announcements: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[Vec<PalletProxyAnnouncement>, u128]>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The set of account proxies. Maps the account which has delegated to the accounts
       * which are being delegated to, together with the amount held on deposit.
       **/
      proxies: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[Vec<PalletProxyProxyDefinition>, u128]>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    randomnessCollectiveFlip: {
      /**
       * Series of block headers from the last 81 blocks that acts as random seed material. This
       * is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
       * the oldest hash.
       **/
      randomMaterial: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    recovery: {
      /**
       * Active recovery attempts.
       *
       * First account is the account to be recovered, and the second account
       * is the user trying to recover the account.
       **/
      activeRecoveries: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletRecoveryActiveRecovery>>,
        [AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, AccountId32]>
      /**
       * The list of allowed proxy accounts.
       *
       * Map from the user who can access it to the recovered account.
       **/
      proxy: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<AccountId32>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The set of recoverable accounts and their recovery configuration.
       **/
      recoverable: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletRecoveryRecoveryConfig>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    relayer: {
      failures: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<Vec<u32>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      messages: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<EntropySharedMessage>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      pending: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<EntropySharedMessage>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      registered: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<Option<bool>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      registering: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletRelayerRegisteringDetails>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      responsibility: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      unresponsive: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u32>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    scheduler: {
      /**
       * Items to be executed, indexed by the block number that they should be executed on.
       **/
      agenda: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<Option<PalletSchedulerScheduledV3>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Lookup from identity to the block number and index of the task.
       **/
      lookup: AugmentedQuery<
        ApiType,
        (
          arg: Bytes | string | Uint8Array
        ) => Observable<Option<ITuple<[u32, u32]>>>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    session: {
      /**
       * Current index of the session.
       **/
      currentIndex: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Indices of disabled validators.
       *
       * The vec is always kept sorted so that we can find whether a given validator is
       * disabled using binary search. It gets cleared when `on_session_ending` returns
       * a new set of identities.
       **/
      disabledValidators: AugmentedQuery<
        ApiType,
        () => Observable<Vec<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The owner of a key. The key is the `KeyTypeId` + the encoded key.
       **/
      keyOwner: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[SpCoreCryptoKeyTypeId, Bytes]>
            | [
                SpCoreCryptoKeyTypeId | string | Uint8Array,
                Bytes | string | Uint8Array
              ]
        ) => Observable<Option<AccountId32>>,
        [ITuple<[SpCoreCryptoKeyTypeId, Bytes]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[SpCoreCryptoKeyTypeId, Bytes]>]>
      /**
       * The next session keys for a validator.
       **/
      nextKeys: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<EntropyRuntimeSessionKeys>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * True if the underlying economic identities or weighting behind the validators
       * has changed in the queued validator set.
       **/
      queuedChanged: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The queued keys for the next session. When the next session begins, these keys
       * will be used to determine the validator's session keys.
       **/
      queuedKeys: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[AccountId32, EntropyRuntimeSessionKeys]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current set of validators.
       **/
      validators: AugmentedQuery<
        ApiType,
        () => Observable<Vec<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    society: {
      /**
       * The current bids, stored ordered by the value of the bid.
       **/
      bids: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletSocietyBid>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current set of candidates; bidders that are attempting to become members.
       **/
      candidates: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletSocietyBid>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The defending member currently being challenged.
       **/
      defender: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Votes for the defender.
       **/
      defenderVotes: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletSocietyVote>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The first member.
       **/
      founder: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The most primary from the most recently approved members.
       **/
      head: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The max number of members for the society at one time.
       **/
      maxMembers: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current set of members, ordered.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Pending payouts; ordered by block number, with the amount that should be paid out.
       **/
      payouts: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<ITuple<[u32, u128]>>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Amount of our account balance that is specifically for the next round's bid(s).
       **/
      pot: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * A hash of the rules of this society concerning membership. Can only be set once and
       * only by the founder.
       **/
      rules: AugmentedQuery<ApiType, () => Observable<Option<H256>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The ongoing number of losing votes cast by the member.
       **/
      strikes: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u32>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The set of suspended candidates.
       **/
      suspendedCandidates: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<ITuple<[u128, PalletSocietyBidKind]>>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The set of suspended members.
       **/
      suspendedMembers: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<bool>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Double map from Candidate -> Voter -> (Maybe) Vote.
       **/
      votes: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletSocietyVote>>,
        [AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, AccountId32]>
      /**
       * Members currently vouching or banned from vouching again
       **/
      vouching: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletSocietyVouchingStatus>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    staking: {
      /**
       * The active era information, it holds index and start.
       *
       * The active era is the era being currently rewarded. Validator set of this era must be
       * equal to [`SessionInterface::validators`].
       **/
      activeEra: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletStakingActiveEraInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Map from all locked "stash" accounts to the controller account.
       **/
      bonded: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<AccountId32>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * A mapping from still-bonded eras to the first session index of that era.
       *
       * Must contains information for eras for the range:
       * `[active_era - bounding_duration; active_era]`
       **/
      bondedEras: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[u32, u32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The amount of currency given to reporters of a slash event which was
       * canceled by extraordinary circumstances (e.g. governance).
       **/
      canceledSlashPayout: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The threshold for when users can start calling `chill_other` for other validators /
       * nominators. The threshold is compared to the actual number of validators / nominators
       * (`CountFor*`) in the system compared to the configured max (`Max*Count`).
       **/
      chillThreshold: AugmentedQuery<
        ApiType,
        () => Observable<Option<Percent>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForNominators: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Counter for the related counted storage map
       **/
      counterForValidators: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current era index.
       *
       * This is the latest planned era, depending on how the Session pallet queues the validator
       * set, it might be active or not.
       **/
      currentEra: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The last planned session scheduled by the session pallet.
       *
       * This is basically in sync with the call to [`pallet_session::SessionManager::new_session`].
       **/
      currentPlannedSession: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Rewards for the last `HISTORY_DEPTH` eras.
       * If reward hasn't been set or has been removed then 0 reward is returned.
       **/
      erasRewardPoints: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<PalletStakingEraRewardPoints>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Exposure of validator at era.
       *
       * This is keyed first by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       * If stakers hasn't been set or has been removed then empty exposure is returned.
       **/
      erasStakers: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<PalletStakingExposure>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * Clipped Exposure of validator at era.
       *
       * This is similar to [`ErasStakers`] but number of nominators exposed is reduced to the
       * `T::MaxNominatorRewardedPerValidator` biggest stakers.
       * (Note: the field `total` and `own` of the exposure remains unchanged).
       * This is used to limit the i/o cost for the nominator payout.
       *
       * This is keyed fist by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       * If stakers hasn't been set or has been removed then empty exposure is returned.
       **/
      erasStakersClipped: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<PalletStakingExposure>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * The session index at which the era start for the last `HISTORY_DEPTH` eras.
       *
       * Note: This tracks the starting session (i.e. session index when era start being active)
       * for the eras in `[CurrentEra - HISTORY_DEPTH, CurrentEra]`.
       **/
      erasStartSessionIndex: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<u32>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * The total amount staked for the last `HISTORY_DEPTH` eras.
       * If total hasn't been set or has been removed then 0 stake is returned.
       **/
      erasTotalStake: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<u128>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Similar to `ErasStakers`, this holds the preferences of validators.
       *
       * This is keyed first by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       **/
      erasValidatorPrefs: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<PalletStakingValidatorPrefs>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * The total validator era payout for the last `HISTORY_DEPTH` eras.
       *
       * Eras that haven't finished yet or has been removed doesn't have reward.
       **/
      erasValidatorReward: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<u128>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Mode of era forcing.
       **/
      forceEra: AugmentedQuery<
        ApiType,
        () => Observable<PalletStakingForcing>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
       * easy to initialize and the performance hit is minimal (we expect no more than four
       * invulnerables) and restricted to testnets.
       **/
      invulnerables: AugmentedQuery<
        ApiType,
        () => Observable<Vec<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Map from all (unlocked) "controller" accounts to the info regarding the staking.
       **/
      ledger: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletStakingStakingLedger>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The maximum nominator count before we stop allowing new validators to join.
       *
       * When this value is not set, no limits are enforced.
       **/
      maxNominatorsCount: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The maximum validator count before we stop allowing new validators to join.
       *
       * When this value is not set, no limits are enforced.
       **/
      maxValidatorsCount: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The minimum amount of commission that validators can set.
       *
       * If set to `0`, no limit exists.
       **/
      minCommission: AugmentedQuery<ApiType, () => Observable<Perbill>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Minimum number of staking participants before emergency conditions are imposed.
       **/
      minimumValidatorCount: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The minimum active bond to become and maintain the role of a nominator.
       **/
      minNominatorBond: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The minimum active bond to become and maintain the role of a validator.
       **/
      minValidatorBond: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The map from nominator stash key to their nomination preferences, namely the validators that
       * they wish to support.
       *
       * Note that the keys of this storage map might become non-decodable in case the
       * [`Config::MaxNominations`] configuration is decreased. In this rare case, these nominators
       * are still existent in storage, their key is correct and retrievable (i.e. `contains_key`
       * indicates that they exist), but their value cannot be decoded. Therefore, the non-decodable
       * nominators will effectively not-exist, until they re-submit their preferences such that it
       * is within the bounds of the newly set `Config::MaxNominations`.
       *
       * This implies that `::iter_keys().count()` and `::iter().count()` might return different
       * values for this map. Moreover, the main `::count()` is aligned with the former, namely the
       * number of keys that exist.
       *
       * Lastly, if any of the nominators become non-decodable, they can be chilled immediately via
       * [`Call::chill_other`] dispatchable by anyone.
       **/
      nominators: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletStakingNominations>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * All slashing events on nominators, mapped by era to the highest slash value of the era.
       **/
      nominatorSlashInEra: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<u128>>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * Indices of validators that have offended in the active era and whether they are currently
       * disabled.
       *
       * This value should be a superset of disabled validators since not all offences lead to the
       * validator being disabled (if there was no slash). This is needed to track the percentage of
       * validators that have offended in the current era, ensuring a new era is forced if
       * `OffendingValidatorsThreshold` is reached. The vec is always kept sorted so that we can find
       * whether a given validator has previously offended using binary search. It gets cleared when
       * the era ends.
       **/
      offendingValidators: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[u32, bool]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Where the reward payment should be made. Keyed by stash.
       **/
      payee: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletStakingRewardDestination>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Slashing spans for stash accounts.
       **/
      slashingSpans: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletStakingSlashingSlashingSpans>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * The percentage of the slash that is distributed to reporters.
       *
       * The rest of the slashed value is handled by the `Slash`.
       **/
      slashRewardFraction: AugmentedQuery<
        ApiType,
        () => Observable<Perbill>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Records information about the maximum slash of a stash within a slashing span,
       * as well as how much reward has been paid out.
       **/
      spanSlash: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[AccountId32, u32]>
            | [AccountId32 | string | Uint8Array, u32 | AnyNumber | Uint8Array]
        ) => Observable<PalletStakingSlashingSpanRecord>,
        [ITuple<[AccountId32, u32]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[AccountId32, u32]>]>
      /**
       * True if network has been upgraded to this version.
       * Storage version of the pallet.
       *
       * This is set to v7.0.0 for new networks.
       **/
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletStakingReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * All unapplied slashes that are queued for later.
       **/
      unappliedSlashes: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<PalletStakingUnappliedSlash>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * The ideal number of staking participants.
       **/
      validatorCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The map from (wannabe) validator stash key to the preferences of that validator.
       **/
      validators: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletStakingValidatorPrefs>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * All slashing events on validators, mapped by era to the highest slash proportion
       * and slash value of the era.
       **/
      validatorSlashInEra: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<ITuple<[Perbill, u128]>>>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    stakingExtension: {
      /**
       * Tracks wether the validator's kvdb is synced
       **/
      isValidatorSynced: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<bool>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Stores the relationship between a signing group (u8) and its member's (validator's)
       * threshold server's account.
       **/
      signingGroups: AugmentedQuery<
        ApiType,
        (
          arg: u8 | AnyNumber | Uint8Array
        ) => Observable<Option<Vec<AccountId32>>>,
        [u8]
      > &
        QueryableStorageEntry<ApiType, [u8]>
      /**
       * Stores the relationship between
       * a validator's stash account and their threshold server's sr25519 and x25519 keys.
       *
       * Clients query this via state or `stakingExtension_getKeys` RPC and uses
       * the x25519 pub key in noninteractive ECDH for authenticating/encrypting distribute TSS
       * shares over HTTP.
       **/
      thresholdServers: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletStakingExtensionServerInfo>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      thresholdToStash: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<AccountId32>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    sudo: {
      /**
       * The `AccountId` of the sudo key.
       **/
      key: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    system: {
      /**
       * The full account information for a particular account ID.
       **/
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<FrameSystemAccountInfo>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       **/
      allExtrinsicsLen: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Map of block numbers to block hashes.
       **/
      blockHash: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<H256>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * The current weight for the block.
       **/
      blockWeight: AugmentedQuery<
        ApiType,
        () => Observable<FrameSupportDispatchPerDispatchClassWeight>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Digest of the current block, also part of the block header.
       **/
      digest: AugmentedQuery<ApiType, () => Observable<SpRuntimeDigest>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The number of events in the `Events<T>` list.
       **/
      eventCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Events deposited for the current block.
       *
       * NOTE: The item is unbound and should therefore never be read on chain.
       * It could otherwise inflate the PoV size of a block.
       *
       * Events have a large in-memory size. Box the events to not go out-of-memory
       * just in case someone still reads them from within the runtime.
       **/
      events: AugmentedQuery<
        ApiType,
        () => Observable<Vec<FrameSystemEventRecord>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       *
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       *
       * The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       **/
      eventTopics: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Vec<ITuple<[u32, u32]>>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * The execution phase of the block.
       **/
      executionPhase: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemPhase>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Total extrinsics count for the current block.
       **/
      extrinsicCount: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       **/
      extrinsicData: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
       **/
      lastRuntimeUpgrade: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemLastRuntimeUpgradeInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current block number being processed. Set by `execute_block`.
       **/
      number: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Hash of the previous block.
       **/
      parentHash: AugmentedQuery<ApiType, () => Observable<H256>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
       * (default) if not.
       **/
      upgradedToTripleRefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
       **/
      upgradedToU32RefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    technicalCommittee: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The prime member that helps determine the default vote behavior in case of absentations.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Call>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletCollectiveVotes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    technicalMembership: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    timestamp: {
      /**
       * Did the timestamp get updated in this block?
       **/
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Current time for the current block.
       **/
      now: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    tips: {
      /**
       * Simple preimage lookup from the reason's hash to the original data. Again, has an
       * insecure enumerable hash since the key is guaranteed to be the result of a secure hash.
       **/
      reasons: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Bytes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * TipsMap that are not yet completed. Keyed by the hash of `(reason, who)` from the value.
       * This has the insecure enumerable hash function since the key itself is already
       * guaranteed to be a secure hash.
       **/
      tips: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletTipsOpenTip>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    transactionPause: {
      /**
       * The paused transaction map
       *
       * map (PalletNameBytes, FunctionNameBytes) => Option<()>
       **/
      pausedTransactions: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[Bytes, Bytes]>
            | [Bytes | string | Uint8Array, Bytes | string | Uint8Array]
        ) => Observable<Option<Null>>,
        [ITuple<[Bytes, Bytes]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[Bytes, Bytes]>]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletTransactionPaymentReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    transactionStorage: {
      blockTransactions: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletTransactionStorageTransactionInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Storage fee per byte.
       **/
      byteFee: AugmentedQuery<ApiType, () => Observable<Option<u128>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Count indexed chunks for each block.
       **/
      chunkCount: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<u32>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Storage fee per transaction.
       **/
      entryFee: AugmentedQuery<ApiType, () => Observable<Option<u128>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Was the proof checked in this block?
       **/
      proofChecked: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Storage period for data in blocks. Should match `sp_storage_proof::DEFAULT_STORAGE_PERIOD`
       * for block authoring.
       **/
      storagePeriod: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Collection of transaction metadata by block number.
       **/
      transactions: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<Vec<PalletTransactionStorageTransactionInfo>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    treasury: {
      /**
       * Proposal indices that have been approved but not yet awarded.
       **/
      approvals: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Number of proposals that have been made.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>
      /**
       * Proposals that have been made.
       **/
      proposals: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletTreasuryProposal>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
    vesting: {
      /**
       * Storage version of the pallet.
       *
       * New networks start with latest version, as determined by the genesis build.
       **/
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletVestingReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>
      /**
       * Information regarding the vesting of a given account.
       **/
      vesting: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<Vec<PalletVestingVestingInfo>>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>
    }
  } // AugmentedQueries
} // declare module