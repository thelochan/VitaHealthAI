// app/types.ts

export const TIERS = {
    FREE: 'Free',
    BASIC: 'Basic',
    PREMIUM: 'Premium'
  } as const;
  
  export type TierType = typeof TIERS[keyof typeof TIERS];