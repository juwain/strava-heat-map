import type { ActivitiesCache, Activity } from '../../src/client/types/index.js';

/**
 * Mock response from /api/activities endpoint
 * This is the exact format returned by the server's activities endpoint
 */
export const mockActivitiesResponse: ActivitiesCache = {
  lastFetchedAt: 1770921534,
  activities: [
    {
      id: 4185305030,
      sport_type: 'Ride',
      start_date: '2020-10-12T12:42:16Z',
      polyline:
        'iublJes`xDRIdAOZAvA@lBRjBFx@ANENQJWN{@Dc@BqAH{FNgC@uBBMDIFETEj@Ah@D`@Cb@M|@QrA]`B[tCa@\\AxAMdBGZFbB|@VTHHZnAHF?O@BB@d@EZ?L@LJd@v@Zt@r@~Bt@rC`A|C`@|ADBFANa@j@gA`AmCjBqEP]p@gALu@D{@@aAHU^K~AGvDDf@Gz@G`ASrCa@|AMd@CfAAj@L`@@f@GxA[p@C|@MdBK~@@xBLnA?`BSlAa@~@In@@dCEz@FzABp@Mf@EdCGd@Pf@BfBGLG|AHx@?pEObDUdADb@Ll@R`@Rx@j@p@v@p@bA^t@dAbC^tAb@`CPzANbCFnBKzDShDYvD_@jDSdB]tDu@|GoAdNyAvROlDObCu@jH]lFK`@[^AF?LThA?f@aBnRiAzIi@|Ca@lC_ArHs@jI_@dFaAzJ_@tFYzCUnBUzCw@jFgAtMw@|Ei@pC[jAMRINc@^cAd@OVUp@Y^qBlAgCbAq@ZOL[h@Up@Mr@MfAk@bJKbC?b@Dp@Lh@Vp@H`ABz@G\\JqBCOCMa@q@Sm@G_@EmABiAv@}JJiAHe@Jc@J[NW`@e@^YzAq@rAu@dBy@L[F{@L?|@_@`@ULOh@kAfBqFZgBHm@LmAhAuONeAXkDn@mGrCw^|@}HxDuYR}Bj@kI\\iEFgADUZu@FoA|AwRRk@ViA\\gCEq@@iBDsAPkCjB_TNa@R_AN}@LiAfBgT^kHBoC]}Ci@oCYcAWw@iCyFg@kB[Ai@G}DeAK?{APcAFgGLkFT_FDk@@oGn@aCIcABm@Fq@Na@FgBH}@?{AMk@?qAH_BAo@HmA`@g@D[?_AOy@GwCH{CT_B\\oC`@gBFq@?k@DORCNGdBQ|@W`@cAtBiAjC_AbCo@`AQPOOYs@g@mBy@gCqAyEWq@IQKKKGKA_@?KBWRG@KOEg@ISqAu@wAo@QCYAc@De@@m@Nk@@m@HcCd@oBj@qB\\g@Ac@HaBEIBSPWH_AO_DQkAEeDAgBDaAAyAB{FPuATwAD_AL_@KQAE@DO@cAIwBCuKDc@NWTORE\\Bl@J~@D|CYJ@JDDHTj@NLPBzE]p@@fAAz@Fn@?VCFEDGDs@FsEC_C',
    },
    {
      id: 4189658793,
      sport_type: 'Walk',
      start_date: '2020-10-13T13:04:07Z',
      polyline:
        'kublJifbxDIL?G@XAa@DHCNGFI^[NEAAWKWSJo@v@KRIZUd@Mn@IHe@FUCGCIKOg@IKICM?QFKNGb@@bACNABKAWHYBQAe@HYSU]GEMEk@Es@FKAg@Fg@RUMi@AYBOFOCq@@aAM]NMJW@YFI?QIMBWHq@CSBUEmAL}@CU@s@G]BS?w@NYASL_@n@Uj@Mf@IJUHSh@i@j@[f@KTG@GIGe@GDANKJMPKFGASQIJWMOAYDOAYQE?IBEX@TAfBGc@KUCE_@QWWGAe@H]DaACaAHQ?IGa@oAECED',
    },
    {
      id: 4189658929,
      sport_type: 'Run',
      start_date: '2020-10-13T13:22:26Z',
      polyline:
        'oaelJwraxDEBGEG?}AJUA[?y@CaAFq@@UCsAFs@EYBc@?g@B]Cy@H[Ai@?oBPg@Ec@@c@FSAqB@a@H]@w@L[@[C[H_@Bc@?c@GOMGSKg@SkBU}@Sg@ASZaBbA}CNYb@g@|A{AJOLc@RaA^{@dAuB^i@`@u@fBoD`@o@`AgCTe@BEHAJH`@~@BBLBROl@aATg@P{@LaAJyAF]JQPIPCrAFt@VPLRVj@x@L^`@v@`AbEHdCHlAb@vBb@rACZKr@Ab@@~EHrK?rCC\\GH_@DyAB{AAWB{@A_BJc@@e@FyACKEIUOw@[kAq@eD[oAYcB_@{AGEK@CBk@~@Ib@Cl@QhBMh@Q`@QZKDQDg@EKEg@m@Ue@GUIa@OwAWm@G[FsAb@_Cl@cBbAmBbA_B|@mBt@iA^MX?FDBL?lE?v@JbBC~@Bb@FTd@z@HVp@xCRnAL|KDRFBHIDOB_@CeB@iDC_ABUFAZBn@Cz@Bp@Ij@BDC?YIa@MUOMa@Go@B]D_@NOLINK\\SVEPAr@IPULaAHUJGAGIIQS{@w@aF?GDMf@}@Da@@e@AmAQqDCiD@m@BGTKPSb@{@`@i@r@q@h@y@L]H]NaBFkABYFSHGFAp@Bp@Gx@PVTLP@ZAlABlBLdA@tAFf@jAvC`@t@^j@Rd@`@r@DRHpCAbFBzCB\\Lb@fBhC`@vAVp@',
    },
  ],
};

/**
 * Individual mock activities for easier testing
 */
export const mockActivities: Activity[] = mockActivitiesResponse.activities;

/**
 * Mock activity by sport type for easier testing
 */
export const mockActivityBySportType: Record<string, Activity> = {
  Ride: mockActivities.find((a) => a.sport_type === 'Ride')!,
  Walk: mockActivities.find((a) => a.sport_type === 'Walk')!,
  Run: mockActivities.find((a) => a.sport_type === 'Run')!,
};

/**
 * Empty activities cache for testing empty states
 */
export const mockEmptyActivitiesResponse: ActivitiesCache = {
  lastFetchedAt: 0,
  activities: [],
};
