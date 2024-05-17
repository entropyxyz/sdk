// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/types/registry'

import type {
  EntropyRuntimeNposCompactSolution16,
  EntropyRuntimeOriginCaller,
  EntropyRuntimeProxyType,
  EntropyRuntimeRuntime,
  EntropyRuntimeRuntimeFreezeReason,
  EntropyRuntimeRuntimeHoldReason,
  EntropyRuntimeSessionKeys,
  EntropySharedKeyVisibility,
  EntropySharedOcwMessageDkg,
  EntropySharedOcwMessageProactiveRefresh,
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
  FrameSystemCodeUpgradeAuthorization,
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
  PalletBalancesAdjustmentDirection,
  PalletBalancesBalanceLock,
  PalletBalancesCall,
  PalletBalancesError,
  PalletBalancesEvent,
  PalletBalancesIdAmountRuntimeFreezeReason,
  PalletBalancesIdAmountRuntimeHoldReason,
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
  PalletGrandpaCall,
  PalletGrandpaError,
  PalletGrandpaEvent,
  PalletGrandpaStoredPendingChange,
  PalletGrandpaStoredState,
  PalletIdentityAuthorityProperties,
  PalletIdentityCall,
  PalletIdentityError,
  PalletIdentityEvent,
  PalletIdentityJudgement,
  PalletIdentityLegacyIdentityInfo,
  PalletIdentityRegistrarInfo,
  PalletIdentityRegistration,
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
  PalletNominationPoolsCommissionClaimPermission,
  PalletNominationPoolsConfigOpAccountId32,
  PalletNominationPoolsConfigOpPerbill,
  PalletNominationPoolsConfigOpU128,
  PalletNominationPoolsConfigOpU32,
  PalletNominationPoolsDefensiveError,
  PalletNominationPoolsError,
  PalletNominationPoolsEvent,
  PalletNominationPoolsFreezeReason,
  PalletNominationPoolsPoolMember,
  PalletNominationPoolsPoolRoles,
  PalletNominationPoolsPoolState,
  PalletNominationPoolsRewardPool,
  PalletNominationPoolsSubPools,
  PalletNominationPoolsUnbondPool,
  PalletOffencesEvent,
  PalletParametersModuleCall,
  PalletParametersModuleError,
  PalletParametersModuleEvent,
  PalletPreimageCall,
  PalletPreimageError,
  PalletPreimageEvent,
  PalletPreimageHoldReason,
  PalletPreimageOldRequestStatus,
  PalletPreimageRequestStatus,
  PalletProgramsCall,
  PalletProgramsError,
  PalletProgramsEvent,
  PalletProgramsProgramInfo,
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
  PalletRegistryCall,
  PalletRegistryError,
  PalletRegistryEvent,
  PalletRegistryProgramInstance,
  PalletRegistryRegisteredInfo,
  PalletRegistryRegisteringDetails,
  PalletRegistryValidateConfirmRegistered,
  PalletSchedulerCall,
  PalletSchedulerError,
  PalletSchedulerEvent,
  PalletSchedulerScheduled,
  PalletSessionCall,
  PalletSessionError,
  PalletSessionEvent,
  PalletSlashingCall,
  PalletSlashingEvent,
  PalletStakingActiveEraInfo,
  PalletStakingEraRewardPoints,
  PalletStakingExtensionCall,
  PalletStakingExtensionError,
  PalletStakingExtensionEvent,
  PalletStakingExtensionRefreshInfo,
  PalletStakingExtensionServerInfo,
  PalletStakingForcing,
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
  PalletTransactionStorageHoldReason,
  PalletTransactionStorageTransactionInfo,
  PalletTreasuryCall,
  PalletTreasuryError,
  PalletTreasuryEvent,
  PalletTreasuryPaymentState,
  PalletTreasuryProposal,
  PalletTreasurySpendStatus,
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
  SpStakingExposure,
  SpStakingExposurePage,
  SpStakingIndividualExposure,
  SpStakingOffenceOffenceDetails,
  SpStakingPagedExposureMetadata,
  SpTransactionStorageProofTransactionStorageProof,
  SpVersionRuntimeVersion,
  SpWeightsRuntimeDbWeight,
  SpWeightsWeightV2Weight,
} from '@polkadot/types/lookup'

declare module '@polkadot/types/types/registry' {
  interface InterfaceTypes {
    EntropyRuntimeNposCompactSolution16: EntropyRuntimeNposCompactSolution16
    EntropyRuntimeOriginCaller: EntropyRuntimeOriginCaller
    EntropyRuntimeProxyType: EntropyRuntimeProxyType
    EntropyRuntimeRuntime: EntropyRuntimeRuntime
    EntropyRuntimeRuntimeFreezeReason: EntropyRuntimeRuntimeFreezeReason
    EntropyRuntimeRuntimeHoldReason: EntropyRuntimeRuntimeHoldReason
    EntropyRuntimeSessionKeys: EntropyRuntimeSessionKeys
    EntropySharedKeyVisibility: EntropySharedKeyVisibility
    EntropySharedOcwMessageDkg: EntropySharedOcwMessageDkg
    EntropySharedOcwMessageProactiveRefresh: EntropySharedOcwMessageProactiveRefresh
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
    FrameSystemCodeUpgradeAuthorization: FrameSystemCodeUpgradeAuthorization
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
    PalletBalancesAdjustmentDirection: PalletBalancesAdjustmentDirection
    PalletBalancesBalanceLock: PalletBalancesBalanceLock
    PalletBalancesCall: PalletBalancesCall
    PalletBalancesError: PalletBalancesError
    PalletBalancesEvent: PalletBalancesEvent
    PalletBalancesIdAmountRuntimeFreezeReason: PalletBalancesIdAmountRuntimeFreezeReason
    PalletBalancesIdAmountRuntimeHoldReason: PalletBalancesIdAmountRuntimeHoldReason
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
    PalletGrandpaCall: PalletGrandpaCall
    PalletGrandpaError: PalletGrandpaError
    PalletGrandpaEvent: PalletGrandpaEvent
    PalletGrandpaStoredPendingChange: PalletGrandpaStoredPendingChange
    PalletGrandpaStoredState: PalletGrandpaStoredState
    PalletIdentityAuthorityProperties: PalletIdentityAuthorityProperties
    PalletIdentityCall: PalletIdentityCall
    PalletIdentityError: PalletIdentityError
    PalletIdentityEvent: PalletIdentityEvent
    PalletIdentityJudgement: PalletIdentityJudgement
    PalletIdentityLegacyIdentityInfo: PalletIdentityLegacyIdentityInfo
    PalletIdentityRegistrarInfo: PalletIdentityRegistrarInfo
    PalletIdentityRegistration: PalletIdentityRegistration
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
    PalletNominationPoolsCommissionClaimPermission: PalletNominationPoolsCommissionClaimPermission
    PalletNominationPoolsConfigOpAccountId32: PalletNominationPoolsConfigOpAccountId32
    PalletNominationPoolsConfigOpPerbill: PalletNominationPoolsConfigOpPerbill
    PalletNominationPoolsConfigOpU128: PalletNominationPoolsConfigOpU128
    PalletNominationPoolsConfigOpU32: PalletNominationPoolsConfigOpU32
    PalletNominationPoolsDefensiveError: PalletNominationPoolsDefensiveError
    PalletNominationPoolsError: PalletNominationPoolsError
    PalletNominationPoolsEvent: PalletNominationPoolsEvent
    PalletNominationPoolsFreezeReason: PalletNominationPoolsFreezeReason
    PalletNominationPoolsPoolMember: PalletNominationPoolsPoolMember
    PalletNominationPoolsPoolRoles: PalletNominationPoolsPoolRoles
    PalletNominationPoolsPoolState: PalletNominationPoolsPoolState
    PalletNominationPoolsRewardPool: PalletNominationPoolsRewardPool
    PalletNominationPoolsSubPools: PalletNominationPoolsSubPools
    PalletNominationPoolsUnbondPool: PalletNominationPoolsUnbondPool
    PalletOffencesEvent: PalletOffencesEvent
    PalletParametersModuleCall: PalletParametersModuleCall
    PalletParametersModuleError: PalletParametersModuleError
    PalletParametersModuleEvent: PalletParametersModuleEvent
    PalletPreimageCall: PalletPreimageCall
    PalletPreimageError: PalletPreimageError
    PalletPreimageEvent: PalletPreimageEvent
    PalletPreimageHoldReason: PalletPreimageHoldReason
    PalletPreimageOldRequestStatus: PalletPreimageOldRequestStatus
    PalletPreimageRequestStatus: PalletPreimageRequestStatus
    PalletProgramsCall: PalletProgramsCall
    PalletProgramsError: PalletProgramsError
    PalletProgramsEvent: PalletProgramsEvent
    PalletProgramsProgramInfo: PalletProgramsProgramInfo
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
    PalletRegistryCall: PalletRegistryCall
    PalletRegistryError: PalletRegistryError
    PalletRegistryEvent: PalletRegistryEvent
    PalletRegistryProgramInstance: PalletRegistryProgramInstance
    PalletRegistryRegisteredInfo: PalletRegistryRegisteredInfo
    PalletRegistryRegisteringDetails: PalletRegistryRegisteringDetails
    PalletRegistryValidateConfirmRegistered: PalletRegistryValidateConfirmRegistered
    PalletSchedulerCall: PalletSchedulerCall
    PalletSchedulerError: PalletSchedulerError
    PalletSchedulerEvent: PalletSchedulerEvent
    PalletSchedulerScheduled: PalletSchedulerScheduled
    PalletSessionCall: PalletSessionCall
    PalletSessionError: PalletSessionError
    PalletSessionEvent: PalletSessionEvent
    PalletSlashingCall: PalletSlashingCall
    PalletSlashingEvent: PalletSlashingEvent
    PalletStakingActiveEraInfo: PalletStakingActiveEraInfo
    PalletStakingEraRewardPoints: PalletStakingEraRewardPoints
    PalletStakingExtensionCall: PalletStakingExtensionCall
    PalletStakingExtensionError: PalletStakingExtensionError
    PalletStakingExtensionEvent: PalletStakingExtensionEvent
    PalletStakingExtensionRefreshInfo: PalletStakingExtensionRefreshInfo
    PalletStakingExtensionServerInfo: PalletStakingExtensionServerInfo
    PalletStakingForcing: PalletStakingForcing
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
    PalletTransactionStorageHoldReason: PalletTransactionStorageHoldReason
    PalletTransactionStorageTransactionInfo: PalletTransactionStorageTransactionInfo
    PalletTreasuryCall: PalletTreasuryCall
    PalletTreasuryError: PalletTreasuryError
    PalletTreasuryEvent: PalletTreasuryEvent
    PalletTreasuryPaymentState: PalletTreasuryPaymentState
    PalletTreasuryProposal: PalletTreasuryProposal
    PalletTreasurySpendStatus: PalletTreasurySpendStatus
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
    SpStakingExposure: SpStakingExposure
    SpStakingExposurePage: SpStakingExposurePage
    SpStakingIndividualExposure: SpStakingIndividualExposure
    SpStakingOffenceOffenceDetails: SpStakingOffenceOffenceDetails
    SpStakingPagedExposureMetadata: SpStakingPagedExposureMetadata
    SpTransactionStorageProofTransactionStorageProof: SpTransactionStorageProofTransactionStorageProof
    SpVersionRuntimeVersion: SpVersionRuntimeVersion
    SpWeightsRuntimeDbWeight: SpWeightsRuntimeDbWeight
    SpWeightsWeightV2Weight: SpWeightsWeightV2Weight
  } // InterfaceTypes
} // declare module
