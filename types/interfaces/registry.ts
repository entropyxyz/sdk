// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/types/registry'

import type {
  EntropyRuntimeHoldReason,
  EntropyRuntimeNposSolution16,
  EntropyRuntimeOriginCaller,
  EntropyRuntimeProxyType,
  EntropyRuntimeRuntime,
  EntropyRuntimeSessionKeys,
  EntropySharedConstraints,
  EntropySharedConstraintsAcl,
  EntropySharedConstraintsAclAclKind,
  EntropySharedConstraintsArch,
  EntropySharedKeyVisibility,
  EntropySharedOcwMessage,
  EntropySharedValidatorInfo,
  FinalityGrandpaEquivocationPrecommit,
  FinalityGrandpaEquivocationPrevote,
  FinalityGrandpaPrecommit,
  FinalityGrandpaPrevote,
  FrameSupportDispatchDispatchClass,
  FrameSupportDispatchDispatchInfo,
  FrameSupportDispatchPays,
  FrameSupportDispatchPerDispatchClassU32,
  FrameSupportDispatchPerDispatchClassWeight,
  FrameSupportDispatchPerDispatchClassWeightsPerClass,
  FrameSupportDispatchRawOrigin,
  FrameSupportPalletId,
  FrameSupportPreimagesBounded,
  FrameSupportTokensMiscBalanceStatus,
  FrameSystemAccountInfo,
  FrameSystemCall,
  FrameSystemError,
  FrameSystemEvent,
  FrameSystemEventRecord,
  FrameSystemExtensionsCheckGenesis,
  FrameSystemExtensionsCheckNonce,
  FrameSystemExtensionsCheckSpecVersion,
  FrameSystemExtensionsCheckTxVersion,
  FrameSystemExtensionsCheckWeight,
  FrameSystemLastRuntimeUpgradeInfo,
  FrameSystemLimitsBlockLength,
  FrameSystemLimitsBlockWeights,
  FrameSystemLimitsWeightsPerClass,
  FrameSystemPhase,
  PalletBabeCall,
  PalletBabeError,
  PalletBagsListCall,
  PalletBagsListError,
  PalletBagsListEvent,
  PalletBagsListListBag,
  PalletBagsListListListError,
  PalletBagsListListNode,
  PalletBalancesAccountData,
  PalletBalancesBalanceLock,
  PalletBalancesCall,
  PalletBalancesError,
  PalletBalancesEvent,
  PalletBalancesIdAmount,
  PalletBalancesReasons,
  PalletBalancesReserveData,
  PalletBountiesBounty,
  PalletBountiesBountyStatus,
  PalletBountiesCall,
  PalletBountiesError,
  PalletBountiesEvent,
  PalletCollectiveCall,
  PalletCollectiveError,
  PalletCollectiveEvent,
  PalletCollectiveRawOrigin,
  PalletCollectiveVotes,
  PalletConstraintsCall,
  PalletConstraintsError,
  PalletConstraintsEvent,
  PalletDemocracyCall,
  PalletDemocracyConviction,
  PalletDemocracyDelegations,
  PalletDemocracyError,
  PalletDemocracyEvent,
  PalletDemocracyMetadataOwner,
  PalletDemocracyReferendumInfo,
  PalletDemocracyReferendumStatus,
  PalletDemocracyTally,
  PalletDemocracyVoteAccountVote,
  PalletDemocracyVotePriorLock,
  PalletDemocracyVoteThreshold,
  PalletDemocracyVoteVoting,
  PalletElectionProviderMultiPhaseCall,
  PalletElectionProviderMultiPhaseElectionCompute,
  PalletElectionProviderMultiPhaseError,
  PalletElectionProviderMultiPhaseEvent,
  PalletElectionProviderMultiPhasePhase,
  PalletElectionProviderMultiPhaseRawSolution,
  PalletElectionProviderMultiPhaseReadySolution,
  PalletElectionProviderMultiPhaseRoundSnapshot,
  PalletElectionProviderMultiPhaseSignedSignedSubmission,
  PalletElectionProviderMultiPhaseSolutionOrSnapshotSize,
  PalletElectionsPhragmenCall,
  PalletElectionsPhragmenError,
  PalletElectionsPhragmenEvent,
  PalletElectionsPhragmenRenouncing,
  PalletElectionsPhragmenSeatHolder,
  PalletElectionsPhragmenVoter,
  PalletFreeTxCall,
  PalletFreeTxElectricalPanel,
  PalletFreeTxElectricityMeter,
  PalletFreeTxError,
  PalletFreeTxEvent,
  PalletFreeTxValidateElectricityPayment,
  PalletGrandpaCall,
  PalletGrandpaError,
  PalletGrandpaEvent,
  PalletGrandpaStoredPendingChange,
  PalletGrandpaStoredState,
  PalletIdentityBitFlags,
  PalletIdentityCall,
  PalletIdentityError,
  PalletIdentityEvent,
  PalletIdentityIdentityField,
  PalletIdentityIdentityInfo,
  PalletIdentityJudgement,
  PalletIdentityRegistrarInfo,
  PalletIdentityRegistration,
  PalletImOnlineBoundedOpaqueNetworkState,
  PalletImOnlineCall,
  PalletImOnlineError,
  PalletImOnlineEvent,
  PalletImOnlineHeartbeat,
  PalletImOnlineSr25519AppSr25519Public,
  PalletImOnlineSr25519AppSr25519Signature,
  PalletIndicesCall,
  PalletIndicesError,
  PalletIndicesEvent,
  PalletMembershipCall,
  PalletMembershipError,
  PalletMembershipEvent,
  PalletMultisigCall,
  PalletMultisigError,
  PalletMultisigEvent,
  PalletMultisigMultisig,
  PalletMultisigTimepoint,
  PalletNominationPoolsBondExtra,
  PalletNominationPoolsBondedPoolInner,
  PalletNominationPoolsCall,
  PalletNominationPoolsClaimPermission,
  PalletNominationPoolsCommission,
  PalletNominationPoolsCommissionChangeRate,
  PalletNominationPoolsConfigOpAccountId32,
  PalletNominationPoolsConfigOpPerbill,
  PalletNominationPoolsConfigOpU128,
  PalletNominationPoolsConfigOpU32,
  PalletNominationPoolsDefensiveError,
  PalletNominationPoolsError,
  PalletNominationPoolsEvent,
  PalletNominationPoolsPoolMember,
  PalletNominationPoolsPoolRoles,
  PalletNominationPoolsPoolState,
  PalletNominationPoolsRewardPool,
  PalletNominationPoolsSubPools,
  PalletNominationPoolsUnbondPool,
  PalletOffencesEvent,
  PalletPreimageCall,
  PalletPreimageError,
  PalletPreimageEvent,
  PalletPreimageRequestStatus,
  PalletPropagationCall,
  PalletPropagationEvent,
  PalletProxyAnnouncement,
  PalletProxyCall,
  PalletProxyError,
  PalletProxyEvent,
  PalletProxyProxyDefinition,
  PalletRecoveryActiveRecovery,
  PalletRecoveryCall,
  PalletRecoveryError,
  PalletRecoveryEvent,
  PalletRecoveryRecoveryConfig,
  PalletRelayerCall,
  PalletRelayerError,
  PalletRelayerEvent,
  PalletRelayerRegisteredInfo,
  PalletRelayerRegisteringDetails,
  PalletRelayerValidateConfirmRegistered,
  PalletSchedulerCall,
  PalletSchedulerError,
  PalletSchedulerEvent,
  PalletSchedulerScheduled,
  PalletSessionCall,
  PalletSessionError,
  PalletSessionEvent,
  PalletSlashingCall,
  PalletSlashingEvent,
  PalletSocietyBid,
  PalletSocietyBidKind,
  PalletSocietyCall,
  PalletSocietyError,
  PalletSocietyEvent,
  PalletSocietyJudgement,
  PalletSocietyVote,
  PalletSocietyVouchingStatus,
  PalletStakingActiveEraInfo,
  PalletStakingEraRewardPoints,
  PalletStakingExposure,
  PalletStakingExtensionCall,
  PalletStakingExtensionError,
  PalletStakingExtensionEvent,
  PalletStakingExtensionServerInfo,
  PalletStakingForcing,
  PalletStakingIndividualExposure,
  PalletStakingNominations,
  PalletStakingPalletCall,
  PalletStakingPalletConfigOpPerbill,
  PalletStakingPalletConfigOpPercent,
  PalletStakingPalletConfigOpU128,
  PalletStakingPalletConfigOpU32,
  PalletStakingPalletError,
  PalletStakingPalletEvent,
  PalletStakingRewardDestination,
  PalletStakingSlashingSlashingSpans,
  PalletStakingSlashingSpanRecord,
  PalletStakingStakingLedger,
  PalletStakingUnappliedSlash,
  PalletStakingUnlockChunk,
  PalletStakingValidatorPrefs,
  PalletSudoCall,
  PalletSudoError,
  PalletSudoEvent,
  PalletTimestampCall,
  PalletTipsCall,
  PalletTipsError,
  PalletTipsEvent,
  PalletTipsOpenTip,
  PalletTransactionPauseModuleCall,
  PalletTransactionPauseModuleError,
  PalletTransactionPauseModuleEvent,
  PalletTransactionPaymentChargeTransactionPayment,
  PalletTransactionPaymentEvent,
  PalletTransactionPaymentReleases,
  PalletTransactionStorageCall,
  PalletTransactionStorageError,
  PalletTransactionStorageEvent,
  PalletTransactionStorageTransactionInfo,
  PalletTreasuryCall,
  PalletTreasuryError,
  PalletTreasuryEvent,
  PalletTreasuryProposal,
  PalletUtilityCall,
  PalletUtilityError,
  PalletUtilityEvent,
  PalletVestingCall,
  PalletVestingError,
  PalletVestingEvent,
  PalletVestingReleases,
  PalletVestingVestingInfo,
  SpArithmeticArithmeticError,
  SpAuthorityDiscoveryAppPublic,
  SpConsensusBabeAllowedSlots,
  SpConsensusBabeAppPublic,
  SpConsensusBabeBabeEpochConfiguration,
  SpConsensusBabeDigestsNextConfigDescriptor,
  SpConsensusBabeDigestsPreDigest,
  SpConsensusBabeDigestsPrimaryPreDigest,
  SpConsensusBabeDigestsSecondaryPlainPreDigest,
  SpConsensusBabeDigestsSecondaryVRFPreDigest,
  SpConsensusGrandpaAppPublic,
  SpConsensusGrandpaAppSignature,
  SpConsensusGrandpaEquivocation,
  SpConsensusGrandpaEquivocationProof,
  SpConsensusSlotsEquivocationProof,
  SpCoreCryptoKeyTypeId,
  SpCoreEcdsaSignature,
  SpCoreEd25519Public,
  SpCoreEd25519Signature,
  SpCoreOffchainOpaqueNetworkState,
  SpCoreSr25519Public,
  SpCoreSr25519Signature,
  SpCoreSr25519VrfVrfSignature,
  SpCoreVoid,
  SpNposElectionsElectionScore,
  SpNposElectionsSupport,
  SpRuntimeBlakeTwo256,
  SpRuntimeDigest,
  SpRuntimeDigestDigestItem,
  SpRuntimeDispatchError,
  SpRuntimeHeader,
  SpRuntimeModuleError,
  SpRuntimeMultiSignature,
  SpRuntimeTokenError,
  SpRuntimeTransactionalError,
  SpSessionMembershipProof,
  SpStakingOffenceOffenceDetails,
  SpTransactionStorageProofTransactionStorageProof,
  SpVersionRuntimeVersion,
  SpWeightsRuntimeDbWeight,
  SpWeightsWeightV2Weight,
} from '@polkadot/types/lookup'

declare module '@polkadot/types/types/registry' {
  interface InterfaceTypes {
    EntropyRuntimeHoldReason: EntropyRuntimeHoldReason
    EntropyRuntimeNposSolution16: EntropyRuntimeNposSolution16
    EntropyRuntimeOriginCaller: EntropyRuntimeOriginCaller
    EntropyRuntimeProxyType: EntropyRuntimeProxyType
    EntropyRuntimeRuntime: EntropyRuntimeRuntime
    EntropyRuntimeSessionKeys: EntropyRuntimeSessionKeys
    EntropySharedConstraints: EntropySharedConstraints
    EntropySharedConstraintsAcl: EntropySharedConstraintsAcl
    EntropySharedConstraintsAclAclKind: EntropySharedConstraintsAclAclKind
    EntropySharedConstraintsArch: EntropySharedConstraintsArch
    EntropySharedKeyVisibility: EntropySharedKeyVisibility
    EntropySharedOcwMessage: EntropySharedOcwMessage
    EntropySharedValidatorInfo: EntropySharedValidatorInfo
    FinalityGrandpaEquivocationPrecommit: FinalityGrandpaEquivocationPrecommit
    FinalityGrandpaEquivocationPrevote: FinalityGrandpaEquivocationPrevote
    FinalityGrandpaPrecommit: FinalityGrandpaPrecommit
    FinalityGrandpaPrevote: FinalityGrandpaPrevote
    FrameSupportDispatchDispatchClass: FrameSupportDispatchDispatchClass
    FrameSupportDispatchDispatchInfo: FrameSupportDispatchDispatchInfo
    FrameSupportDispatchPays: FrameSupportDispatchPays
    FrameSupportDispatchPerDispatchClassU32: FrameSupportDispatchPerDispatchClassU32
    FrameSupportDispatchPerDispatchClassWeight: FrameSupportDispatchPerDispatchClassWeight
    FrameSupportDispatchPerDispatchClassWeightsPerClass: FrameSupportDispatchPerDispatchClassWeightsPerClass
    FrameSupportDispatchRawOrigin: FrameSupportDispatchRawOrigin
    FrameSupportPalletId: FrameSupportPalletId
    FrameSupportPreimagesBounded: FrameSupportPreimagesBounded
    FrameSupportTokensMiscBalanceStatus: FrameSupportTokensMiscBalanceStatus
    FrameSystemAccountInfo: FrameSystemAccountInfo
    FrameSystemCall: FrameSystemCall
    FrameSystemError: FrameSystemError
    FrameSystemEvent: FrameSystemEvent
    FrameSystemEventRecord: FrameSystemEventRecord
    FrameSystemExtensionsCheckGenesis: FrameSystemExtensionsCheckGenesis
    FrameSystemExtensionsCheckNonce: FrameSystemExtensionsCheckNonce
    FrameSystemExtensionsCheckSpecVersion: FrameSystemExtensionsCheckSpecVersion
    FrameSystemExtensionsCheckTxVersion: FrameSystemExtensionsCheckTxVersion
    FrameSystemExtensionsCheckWeight: FrameSystemExtensionsCheckWeight
    FrameSystemLastRuntimeUpgradeInfo: FrameSystemLastRuntimeUpgradeInfo
    FrameSystemLimitsBlockLength: FrameSystemLimitsBlockLength
    FrameSystemLimitsBlockWeights: FrameSystemLimitsBlockWeights
    FrameSystemLimitsWeightsPerClass: FrameSystemLimitsWeightsPerClass
    FrameSystemPhase: FrameSystemPhase
    PalletBabeCall: PalletBabeCall
    PalletBabeError: PalletBabeError
    PalletBagsListCall: PalletBagsListCall
    PalletBagsListError: PalletBagsListError
    PalletBagsListEvent: PalletBagsListEvent
    PalletBagsListListBag: PalletBagsListListBag
    PalletBagsListListListError: PalletBagsListListListError
    PalletBagsListListNode: PalletBagsListListNode
    PalletBalancesAccountData: PalletBalancesAccountData
    PalletBalancesBalanceLock: PalletBalancesBalanceLock
    PalletBalancesCall: PalletBalancesCall
    PalletBalancesError: PalletBalancesError
    PalletBalancesEvent: PalletBalancesEvent
    PalletBalancesIdAmount: PalletBalancesIdAmount
    PalletBalancesReasons: PalletBalancesReasons
    PalletBalancesReserveData: PalletBalancesReserveData
    PalletBountiesBounty: PalletBountiesBounty
    PalletBountiesBountyStatus: PalletBountiesBountyStatus
    PalletBountiesCall: PalletBountiesCall
    PalletBountiesError: PalletBountiesError
    PalletBountiesEvent: PalletBountiesEvent
    PalletCollectiveCall: PalletCollectiveCall
    PalletCollectiveError: PalletCollectiveError
    PalletCollectiveEvent: PalletCollectiveEvent
    PalletCollectiveRawOrigin: PalletCollectiveRawOrigin
    PalletCollectiveVotes: PalletCollectiveVotes
    PalletConstraintsCall: PalletConstraintsCall
    PalletConstraintsError: PalletConstraintsError
    PalletConstraintsEvent: PalletConstraintsEvent
    PalletDemocracyCall: PalletDemocracyCall
    PalletDemocracyConviction: PalletDemocracyConviction
    PalletDemocracyDelegations: PalletDemocracyDelegations
    PalletDemocracyError: PalletDemocracyError
    PalletDemocracyEvent: PalletDemocracyEvent
    PalletDemocracyMetadataOwner: PalletDemocracyMetadataOwner
    PalletDemocracyReferendumInfo: PalletDemocracyReferendumInfo
    PalletDemocracyReferendumStatus: PalletDemocracyReferendumStatus
    PalletDemocracyTally: PalletDemocracyTally
    PalletDemocracyVoteAccountVote: PalletDemocracyVoteAccountVote
    PalletDemocracyVotePriorLock: PalletDemocracyVotePriorLock
    PalletDemocracyVoteThreshold: PalletDemocracyVoteThreshold
    PalletDemocracyVoteVoting: PalletDemocracyVoteVoting
    PalletElectionProviderMultiPhaseCall: PalletElectionProviderMultiPhaseCall
    PalletElectionProviderMultiPhaseElectionCompute: PalletElectionProviderMultiPhaseElectionCompute
    PalletElectionProviderMultiPhaseError: PalletElectionProviderMultiPhaseError
    PalletElectionProviderMultiPhaseEvent: PalletElectionProviderMultiPhaseEvent
    PalletElectionProviderMultiPhasePhase: PalletElectionProviderMultiPhasePhase
    PalletElectionProviderMultiPhaseRawSolution: PalletElectionProviderMultiPhaseRawSolution
    PalletElectionProviderMultiPhaseReadySolution: PalletElectionProviderMultiPhaseReadySolution
    PalletElectionProviderMultiPhaseRoundSnapshot: PalletElectionProviderMultiPhaseRoundSnapshot
    PalletElectionProviderMultiPhaseSignedSignedSubmission: PalletElectionProviderMultiPhaseSignedSignedSubmission
    PalletElectionProviderMultiPhaseSolutionOrSnapshotSize: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize
    PalletElectionsPhragmenCall: PalletElectionsPhragmenCall
    PalletElectionsPhragmenError: PalletElectionsPhragmenError
    PalletElectionsPhragmenEvent: PalletElectionsPhragmenEvent
    PalletElectionsPhragmenRenouncing: PalletElectionsPhragmenRenouncing
    PalletElectionsPhragmenSeatHolder: PalletElectionsPhragmenSeatHolder
    PalletElectionsPhragmenVoter: PalletElectionsPhragmenVoter
    PalletFreeTxCall: PalletFreeTxCall
    PalletFreeTxElectricalPanel: PalletFreeTxElectricalPanel
    PalletFreeTxElectricityMeter: PalletFreeTxElectricityMeter
    PalletFreeTxError: PalletFreeTxError
    PalletFreeTxEvent: PalletFreeTxEvent
    PalletFreeTxValidateElectricityPayment: PalletFreeTxValidateElectricityPayment
    PalletGrandpaCall: PalletGrandpaCall
    PalletGrandpaError: PalletGrandpaError
    PalletGrandpaEvent: PalletGrandpaEvent
    PalletGrandpaStoredPendingChange: PalletGrandpaStoredPendingChange
    PalletGrandpaStoredState: PalletGrandpaStoredState
    PalletIdentityBitFlags: PalletIdentityBitFlags
    PalletIdentityCall: PalletIdentityCall
    PalletIdentityError: PalletIdentityError
    PalletIdentityEvent: PalletIdentityEvent
    PalletIdentityIdentityField: PalletIdentityIdentityField
    PalletIdentityIdentityInfo: PalletIdentityIdentityInfo
    PalletIdentityJudgement: PalletIdentityJudgement
    PalletIdentityRegistrarInfo: PalletIdentityRegistrarInfo
    PalletIdentityRegistration: PalletIdentityRegistration
    PalletImOnlineBoundedOpaqueNetworkState: PalletImOnlineBoundedOpaqueNetworkState
    PalletImOnlineCall: PalletImOnlineCall
    PalletImOnlineError: PalletImOnlineError
    PalletImOnlineEvent: PalletImOnlineEvent
    PalletImOnlineHeartbeat: PalletImOnlineHeartbeat
    PalletImOnlineSr25519AppSr25519Public: PalletImOnlineSr25519AppSr25519Public
    PalletImOnlineSr25519AppSr25519Signature: PalletImOnlineSr25519AppSr25519Signature
    PalletIndicesCall: PalletIndicesCall
    PalletIndicesError: PalletIndicesError
    PalletIndicesEvent: PalletIndicesEvent
    PalletMembershipCall: PalletMembershipCall
    PalletMembershipError: PalletMembershipError
    PalletMembershipEvent: PalletMembershipEvent
    PalletMultisigCall: PalletMultisigCall
    PalletMultisigError: PalletMultisigError
    PalletMultisigEvent: PalletMultisigEvent
    PalletMultisigMultisig: PalletMultisigMultisig
    PalletMultisigTimepoint: PalletMultisigTimepoint
    PalletNominationPoolsBondExtra: PalletNominationPoolsBondExtra
    PalletNominationPoolsBondedPoolInner: PalletNominationPoolsBondedPoolInner
    PalletNominationPoolsCall: PalletNominationPoolsCall
    PalletNominationPoolsClaimPermission: PalletNominationPoolsClaimPermission
    PalletNominationPoolsCommission: PalletNominationPoolsCommission
    PalletNominationPoolsCommissionChangeRate: PalletNominationPoolsCommissionChangeRate
    PalletNominationPoolsConfigOpAccountId32: PalletNominationPoolsConfigOpAccountId32
    PalletNominationPoolsConfigOpPerbill: PalletNominationPoolsConfigOpPerbill
    PalletNominationPoolsConfigOpU128: PalletNominationPoolsConfigOpU128
    PalletNominationPoolsConfigOpU32: PalletNominationPoolsConfigOpU32
    PalletNominationPoolsDefensiveError: PalletNominationPoolsDefensiveError
    PalletNominationPoolsError: PalletNominationPoolsError
    PalletNominationPoolsEvent: PalletNominationPoolsEvent
    PalletNominationPoolsPoolMember: PalletNominationPoolsPoolMember
    PalletNominationPoolsPoolRoles: PalletNominationPoolsPoolRoles
    PalletNominationPoolsPoolState: PalletNominationPoolsPoolState
    PalletNominationPoolsRewardPool: PalletNominationPoolsRewardPool
    PalletNominationPoolsSubPools: PalletNominationPoolsSubPools
    PalletNominationPoolsUnbondPool: PalletNominationPoolsUnbondPool
    PalletOffencesEvent: PalletOffencesEvent
    PalletPreimageCall: PalletPreimageCall
    PalletPreimageError: PalletPreimageError
    PalletPreimageEvent: PalletPreimageEvent
    PalletPreimageRequestStatus: PalletPreimageRequestStatus
    PalletPropagationCall: PalletPropagationCall
    PalletPropagationEvent: PalletPropagationEvent
    PalletProxyAnnouncement: PalletProxyAnnouncement
    PalletProxyCall: PalletProxyCall
    PalletProxyError: PalletProxyError
    PalletProxyEvent: PalletProxyEvent
    PalletProxyProxyDefinition: PalletProxyProxyDefinition
    PalletRecoveryActiveRecovery: PalletRecoveryActiveRecovery
    PalletRecoveryCall: PalletRecoveryCall
    PalletRecoveryError: PalletRecoveryError
    PalletRecoveryEvent: PalletRecoveryEvent
    PalletRecoveryRecoveryConfig: PalletRecoveryRecoveryConfig
    PalletRelayerCall: PalletRelayerCall
    PalletRelayerError: PalletRelayerError
    PalletRelayerEvent: PalletRelayerEvent
    PalletRelayerRegisteredInfo: PalletRelayerRegisteredInfo
    PalletRelayerRegisteringDetails: PalletRelayerRegisteringDetails
    PalletRelayerValidateConfirmRegistered: PalletRelayerValidateConfirmRegistered
    PalletSchedulerCall: PalletSchedulerCall
    PalletSchedulerError: PalletSchedulerError
    PalletSchedulerEvent: PalletSchedulerEvent
    PalletSchedulerScheduled: PalletSchedulerScheduled
    PalletSessionCall: PalletSessionCall
    PalletSessionError: PalletSessionError
    PalletSessionEvent: PalletSessionEvent
    PalletSlashingCall: PalletSlashingCall
    PalletSlashingEvent: PalletSlashingEvent
    PalletSocietyBid: PalletSocietyBid
    PalletSocietyBidKind: PalletSocietyBidKind
    PalletSocietyCall: PalletSocietyCall
    PalletSocietyError: PalletSocietyError
    PalletSocietyEvent: PalletSocietyEvent
    PalletSocietyJudgement: PalletSocietyJudgement
    PalletSocietyVote: PalletSocietyVote
    PalletSocietyVouchingStatus: PalletSocietyVouchingStatus
    PalletStakingActiveEraInfo: PalletStakingActiveEraInfo
    PalletStakingEraRewardPoints: PalletStakingEraRewardPoints
    PalletStakingExposure: PalletStakingExposure
    PalletStakingExtensionCall: PalletStakingExtensionCall
    PalletStakingExtensionError: PalletStakingExtensionError
    PalletStakingExtensionEvent: PalletStakingExtensionEvent
    PalletStakingExtensionServerInfo: PalletStakingExtensionServerInfo
    PalletStakingForcing: PalletStakingForcing
    PalletStakingIndividualExposure: PalletStakingIndividualExposure
    PalletStakingNominations: PalletStakingNominations
    PalletStakingPalletCall: PalletStakingPalletCall
    PalletStakingPalletConfigOpPerbill: PalletStakingPalletConfigOpPerbill
    PalletStakingPalletConfigOpPercent: PalletStakingPalletConfigOpPercent
    PalletStakingPalletConfigOpU128: PalletStakingPalletConfigOpU128
    PalletStakingPalletConfigOpU32: PalletStakingPalletConfigOpU32
    PalletStakingPalletError: PalletStakingPalletError
    PalletStakingPalletEvent: PalletStakingPalletEvent
    PalletStakingRewardDestination: PalletStakingRewardDestination
    PalletStakingSlashingSlashingSpans: PalletStakingSlashingSlashingSpans
    PalletStakingSlashingSpanRecord: PalletStakingSlashingSpanRecord
    PalletStakingStakingLedger: PalletStakingStakingLedger
    PalletStakingUnappliedSlash: PalletStakingUnappliedSlash
    PalletStakingUnlockChunk: PalletStakingUnlockChunk
    PalletStakingValidatorPrefs: PalletStakingValidatorPrefs
    PalletSudoCall: PalletSudoCall
    PalletSudoError: PalletSudoError
    PalletSudoEvent: PalletSudoEvent
    PalletTimestampCall: PalletTimestampCall
    PalletTipsCall: PalletTipsCall
    PalletTipsError: PalletTipsError
    PalletTipsEvent: PalletTipsEvent
    PalletTipsOpenTip: PalletTipsOpenTip
    PalletTransactionPauseModuleCall: PalletTransactionPauseModuleCall
    PalletTransactionPauseModuleError: PalletTransactionPauseModuleError
    PalletTransactionPauseModuleEvent: PalletTransactionPauseModuleEvent
    PalletTransactionPaymentChargeTransactionPayment: PalletTransactionPaymentChargeTransactionPayment
    PalletTransactionPaymentEvent: PalletTransactionPaymentEvent
    PalletTransactionPaymentReleases: PalletTransactionPaymentReleases
    PalletTransactionStorageCall: PalletTransactionStorageCall
    PalletTransactionStorageError: PalletTransactionStorageError
    PalletTransactionStorageEvent: PalletTransactionStorageEvent
    PalletTransactionStorageTransactionInfo: PalletTransactionStorageTransactionInfo
    PalletTreasuryCall: PalletTreasuryCall
    PalletTreasuryError: PalletTreasuryError
    PalletTreasuryEvent: PalletTreasuryEvent
    PalletTreasuryProposal: PalletTreasuryProposal
    PalletUtilityCall: PalletUtilityCall
    PalletUtilityError: PalletUtilityError
    PalletUtilityEvent: PalletUtilityEvent
    PalletVestingCall: PalletVestingCall
    PalletVestingError: PalletVestingError
    PalletVestingEvent: PalletVestingEvent
    PalletVestingReleases: PalletVestingReleases
    PalletVestingVestingInfo: PalletVestingVestingInfo
    SpArithmeticArithmeticError: SpArithmeticArithmeticError
    SpAuthorityDiscoveryAppPublic: SpAuthorityDiscoveryAppPublic
    SpConsensusBabeAllowedSlots: SpConsensusBabeAllowedSlots
    SpConsensusBabeAppPublic: SpConsensusBabeAppPublic
    SpConsensusBabeBabeEpochConfiguration: SpConsensusBabeBabeEpochConfiguration
    SpConsensusBabeDigestsNextConfigDescriptor: SpConsensusBabeDigestsNextConfigDescriptor
    SpConsensusBabeDigestsPreDigest: SpConsensusBabeDigestsPreDigest
    SpConsensusBabeDigestsPrimaryPreDigest: SpConsensusBabeDigestsPrimaryPreDigest
    SpConsensusBabeDigestsSecondaryPlainPreDigest: SpConsensusBabeDigestsSecondaryPlainPreDigest
    SpConsensusBabeDigestsSecondaryVRFPreDigest: SpConsensusBabeDigestsSecondaryVRFPreDigest
    SpConsensusGrandpaAppPublic: SpConsensusGrandpaAppPublic
    SpConsensusGrandpaAppSignature: SpConsensusGrandpaAppSignature
    SpConsensusGrandpaEquivocation: SpConsensusGrandpaEquivocation
    SpConsensusGrandpaEquivocationProof: SpConsensusGrandpaEquivocationProof
    SpConsensusSlotsEquivocationProof: SpConsensusSlotsEquivocationProof
    SpCoreCryptoKeyTypeId: SpCoreCryptoKeyTypeId
    SpCoreEcdsaSignature: SpCoreEcdsaSignature
    SpCoreEd25519Public: SpCoreEd25519Public
    SpCoreEd25519Signature: SpCoreEd25519Signature
    SpCoreOffchainOpaqueNetworkState: SpCoreOffchainOpaqueNetworkState
    SpCoreSr25519Public: SpCoreSr25519Public
    SpCoreSr25519Signature: SpCoreSr25519Signature
    SpCoreSr25519VrfVrfSignature: SpCoreSr25519VrfVrfSignature
    SpCoreVoid: SpCoreVoid
    SpNposElectionsElectionScore: SpNposElectionsElectionScore
    SpNposElectionsSupport: SpNposElectionsSupport
    SpRuntimeBlakeTwo256: SpRuntimeBlakeTwo256
    SpRuntimeDigest: SpRuntimeDigest
    SpRuntimeDigestDigestItem: SpRuntimeDigestDigestItem
    SpRuntimeDispatchError: SpRuntimeDispatchError
    SpRuntimeHeader: SpRuntimeHeader
    SpRuntimeModuleError: SpRuntimeModuleError
    SpRuntimeMultiSignature: SpRuntimeMultiSignature
    SpRuntimeTokenError: SpRuntimeTokenError
    SpRuntimeTransactionalError: SpRuntimeTransactionalError
    SpSessionMembershipProof: SpSessionMembershipProof
    SpStakingOffenceOffenceDetails: SpStakingOffenceOffenceDetails
    SpTransactionStorageProofTransactionStorageProof: SpTransactionStorageProofTransactionStorageProof
    SpVersionRuntimeVersion: SpVersionRuntimeVersion
    SpWeightsRuntimeDbWeight: SpWeightsRuntimeDbWeight
    SpWeightsWeightV2Weight: SpWeightsWeightV2Weight
  } // InterfaceTypes
} // declare module
