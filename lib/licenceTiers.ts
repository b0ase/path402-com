/**
 * IP Licence Tier System
 *
 * Defines what rights users get based on token holdings.
 * Each tier includes all rights from lower tiers.
 */

export interface LicenceTier {
  tier: number;
  label: string;
  tokensRequired: number;
  rights: string[];
  costUsdApprox: string;
}

export const IP_LICENCE_TIERS: LicenceTier[] = [
  {
    tier: 0,
    label: 'FAN',
    tokensRequired: 1,
    rights: [
      'Share content',
      'Non-commercial remix',
    ],
    costUsdApprox: '~free',
  },
  {
    tier: 1,
    label: 'CREATOR',
    tokensRequired: 10_000,
    rights: [
      'Fan works (tier 0)',
      'Create fan works',
      'Non-commercial publishing',
      'Derivative characters',
    ],
    costUsdApprox: '~$0.04',
  },
  {
    tier: 2,
    label: 'INDIE',
    tokensRequired: 1_000_000,
    rights: [
      'Creator tier rights (tier 1)',
      'Commercial content',
      '$1M revenue cap',
      'Build new IP on this universe',
    ],
    costUsdApprox: '~$402',
  },
  {
    tier: 3,
    label: 'STUDIO',
    tokensRequired: 10_000_000,
    rights: [
      'Indie tier rights (tier 2)',
      'Commercial, $100M cap',
      'Sublicense to creators',
      'Studio derivative works',
    ],
    costUsdApprox: '~$4,020',
  },
  {
    tier: 4,
    label: 'PARTNER',
    tokensRequired: 100_000_000,
    rights: [
      'Studio tier rights (tier 3)',
      'Unlimited creation rights',
      'No revenue cap',
      'Co-production rights',
    ],
    costUsdApprox: '~$40,200',
  },
  {
    tier: 5,
    label: 'OWNER',
    tokensRequired: 500_000_000,
    rights: [
      'Partner tier rights (tier 4)',
      'Governance',
      'Veto rights',
      'Exclusive partnership',
    ],
    costUsdApprox: '~$100K+',
  },
];

/**
 * Get the highest tier a user qualifies for based on token balance
 */
export function getTierForBalance(balance: number): LicenceTier {
  // Find the highest tier where balance >= tokensRequired
  const matchingTier = [...IP_LICENCE_TIERS]
    .reverse()
    .find((t) => balance >= t.tokensRequired);

  return matchingTier ?? IP_LICENCE_TIERS[0];
}

/**
 * Get all rights for a given token balance (includes all lower-tier rights)
 */
export function getRightsForBalance(balance: number): string[] {
  const tier = getTierForBalance(balance);
  // Collect all rights from tier 0 up to this tier
  const allRights: string[] = [];
  for (const t of IP_LICENCE_TIERS) {
    if (t.tier <= tier.tier) {
      allRights.push(...t.rights.filter(r => !r.startsWith(t.label) && !r.includes('tier')));
    }
  }
  return [...new Set(allRights)]; // Remove duplicates
}
