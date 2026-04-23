const R2 = 'https://pub-fee9eb6b685a48f2aa263c104838ce5e.r2.dev';
const R2_VIDEOS = `${R2}/videos`;
const R2_IMAGES = `${R2}/images`;
const NPGX = 'https://www.npg-x.com';

export interface AccentClasses {
  bg: string;
  text: string;
  hoverBorder: string;
  badgeBg: string;
}

export interface Channel {
  slug: string;
  name: string;
  tagline: string;
  accent: AccentClasses;
  badge?: string;
  agentCount: number;
}

export interface Agent {
  id: string;
  channel: string;
  name: string;
  description: string;
  tag: string;
  price: string;
  priceSats: number;
  image?: string;
  video?: string;
  videos?: string[]; // Multiple videos for carousel
  link?: string;
  accent: AccentClasses;
}

export interface TokenGroup {
  tokenAddress: string;   // e.g. 'ip_fnews'
  tokenName: string;      // e.g. '$FNEWS'
  agentIds: string[];     // which AGENTS belong to this group
  description: string;
  accent: AccentClasses;
}

const FNEWS_ACCENT: AccentClasses = {
  bg: 'bg-red-600',
  text: 'text-red-600',
  hoverBorder: 'hover:border-red-500 dark:hover:border-red-500',
  badgeBg: 'bg-red-600',
};

const ADULT_ACCENT: AccentClasses = {
  bg: 'bg-pink-600',
  text: 'text-pink-600',
  hoverBorder: 'hover:border-pink-500 dark:hover:border-pink-500',
  badgeBg: 'bg-pink-600',
};

const BMOVIES_ACCENT: AccentClasses = {
  bg: 'bg-amber-600',
  text: 'text-amber-600',
  hoverBorder: 'hover:border-amber-500 dark:hover:border-amber-500',
  badgeBg: 'bg-amber-600',
};

export const CHANNELS: Channel[] = [
  {
    slug: 'fnews',
    name: 'F.NEWS',
    tagline: 'Synthetic Media Marketplace. User-generated satirical deepfakes.',
    accent: FNEWS_ACCENT,
    badge: 'SATIRE',
    agentCount: 7,
  },
  {
    slug: 'adult',
    name: 'ADULT',
    tagline: 'AI content creators, adult entertainment, and character-driven networks.',
    accent: ADULT_ACCENT,
    agentCount: 3,
  },
  {
    slug: 'bmovies',
    name: 'B.MOVIES',
    tagline: 'Bitcoin-native film and series streaming. Token-gated access on BSV.',
    accent: BMOVIES_ACCENT,
    agentCount: 1,
  },
];

export const AGENTS: Agent[] = [
  // F.NEWS agents
  {
    id: '402_BONES',
    channel: 'fnews',
    name: 'ALEX BONES',
    description: 'THE JEPSTEIN FILES: GLOBALIST PLOT REVEALED. "THEY ARE TURNING THE FRIGGIN\' FROGS GAY!" EXCLUSIVE REVEAL OF INTERDIMENSIONAL VAMPIRE SECRETS.',
    tag: 'F.NEWS',
    price: '420 SAT',
    priceSats: 420,
    image: `${R2_IMAGES}/alex_bones.png`,
    video: `${R2_VIDEOS}/alex_bones.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_CARLSBERG',
    channel: 'fnews',
    name: 'FUCKER CARLSBERG',
    description: 'CONFUSION GRIPS THE NATION. WHY IS THE GREEN M&M NO LONGER SEXY? JUST ASKING QUESTIONS. THE WOKE MOB DOESN\'T WANT YOU TO KNOW.',
    tag: 'F.NEWS',
    price: '69 SAT',
    priceSats: 69,
    image: `${R2_IMAGES}/fucker_carlsberg.png`,
    video: `${R2_VIDEOS}/fucker_carlsberg.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_HOENS',
    channel: 'fnews',
    name: 'CANDY HOENS',
    description: 'THE TRUTH HURTS. FACTS DON\'T CARE ABOUT YOUR FEELINGS, BUT I DO CARE ABOUT EXPOSING THE LIES OF THE MAINSTREAM NARRATIVE. DEBATE ME.',
    tag: 'F.NEWS',
    price: '88 SAT',
    priceSats: 88,
    image: `${R2_IMAGES}/candy_hoens.png`,
    video: `${R2_VIDEOS}/candy_hoens.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_FLUENZA',
    channel: 'fnews',
    name: 'DICK FLUENZA',
    description: 'AMERICA FIRST... TO THE BASEMENT. CATCH THE FLU. YEAH, WE\'RE GOING THERE. UNFILTERED, UNHINGED, AND UNDERGROUND.',
    tag: 'F.NEWS',
    price: '14 SAT',
    priceSats: 14,
    image: `${R2_IMAGES}/dick_fluenza.png`,
    video: `${R2_VIDEOS}/dick_fluenza.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_SMIRK',
    channel: 'fnews',
    name: 'CHARLIE SMIRK',
    description: 'PROVE ME WRONG. IF SOCIALISM IS SO GOOD, WHY IS MY FACE SO SMALL? TURNING POINT USA? MORE LIKE TURNING POINT WHO CARES.',
    tag: 'F.NEWS',
    price: '10 SAT',
    priceSats: 10,
    image: `${R2_IMAGES}/charlie_smirk.png`,
    video: `${R2_VIDEOS}/charlie_smirk.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_KWEG',
    channel: 'fnews',
    name: 'THE ADVENTURES OF KWEG WONG ESQ.',
    description: 'He\'s always trying to pretend to be Satoshi, and going to conferences to give lectures on "scientific" papers he just made up.',
    tag: 'F.NEWS',
    price: '21 SAT',
    priceSats: 21,
    image: `${R2_IMAGES}/kweg_adventures.png`,
    video: `${R2_VIDEOS}/kweg-wong-2.mp4`,
    accent: FNEWS_ACCENT,
  },
  {
    id: '402_FAYLOOR',
    channel: 'fnews',
    name: 'MICHAEL FAYLOOR',
    description: 'THE SELF-PROCLAIMED GENIUS WHO LEVERAGED HIS ENTIRE NET WORTH INTO BITCOIN AT THE TOP. "I AM NEVER WRONG." NARRATOR: HE WAS WRONG.',
    tag: 'F.NEWS',
    price: '42 SAT',
    priceSats: 42,
    image: `${R2_IMAGES}/alex_bones.png`,
    video: `${R2_VIDEOS}/michael-fayloor.mp4`,
    accent: FNEWS_ACCENT,
  },
  // Adult agents
  {
    id: 'NPGX',
    channel: 'adult',
    name: 'NINJA PUNK GIRLS X',
    description: '26 AI content creators on autonomous phones. Each girl has her own Bitcoin identity, socials, and wallet. Buy the phone, hustle the audience, keep the profit.',
    tag: 'AI INFLUENCER NETWORK',
    price: '402 SAT',
    priceSats: 402,
    link: NPGX,
    image: `${NPGX}/npgx-images/grok/03a5f41b-464a-4b7a-90b6-a43c75169e90.jpg`,
    video: '/videos/npgx.mp4',
    accent: ADULT_ACCENT,
  },
  {
    id: 'CHERRYX',
    channel: 'adult',
    name: 'CHERRY X',
    description: 'Premium AI-generated adult content platform. Token-gated galleries, character customization, and BSV micropayment integration.',
    tag: 'ADULT CONTENT',
    price: '100 SAT',
    priceSats: 100,
    link: 'https://cherryx.space',
    image: '/cherryx-hero.png',
    video: '/videos/cherryx.mp4',
    accent: ADULT_ACCENT,
  },
  {
    id: 'ZERODICE',
    channel: 'adult',
    name: 'ZERO DICE',
    description: 'AI-powered DJ character with cinematic universe. Tokenised episodes, music, and merchandise. Community-driven narrative on BSV.',
    tag: 'AI ENTERTAINMENT',
    price: '402 SAT',
    priceSats: 402,
    link: 'https://zerodice.store',
    image: '/zerodice-cinematic.jpg',
    video: '/videos/zero-dice.mp4',
    accent: ADULT_ACCENT,
  },
  {
    id: 'BMOVIES',
    channel: 'bmovies',
    name: 'B.MOVIES',
    description: 'Stream films and series with Bitcoin SV rails. The open web for moving pictures—pay, watch, and own your lane.',
    tag: 'STREAMING',
    price: '402 SAT',
    priceSats: 402,
    link: 'https://bmovies.online',
    video: 'https://b0ase.com/bmovies.mp4',
    accent: BMOVIES_ACCENT,
  },
];

export function getChannels(): Channel[] {
  return CHANNELS;
}

export function getChannel(slug: string): Channel | undefined {
  return CHANNELS.find((c) => c.slug === slug);
}

export function getAgentsByChannel(slug: string): Agent[] {
  return AGENTS.filter((a) => a.channel === slug);
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    tokenAddress: 'ip_npgx',
    tokenName: '$NPGX',
    agentIds: ['NPGX', 'CHERRYX', 'ZERODICE'],
    description: 'Ninja Punk Girls universe — AI influencers, adult content, and DJ characters.',
    accent: ADULT_ACCENT,
  },
  {
    tokenAddress: 'ip_fnews',
    tokenName: '$FNEWS',
    agentIds: ['402_BONES', '402_CARLSBERG', '402_HOENS', '402_FLUENZA', '402_SMIRK', '402_KWEG', '402_FAYLOOR'],
    description: 'F.NEWS synthetic media network — satirical AI characters and deepfake news.',
    accent: FNEWS_ACCENT,
  },
  {
    tokenAddress: 'ip_bmovies',
    tokenName: '$BMOVIES',
    agentIds: ['BMOVIES'],
    description: 'B.MOVIES — Bitcoin-native streaming and token-gated film IP.',
    accent: BMOVIES_ACCENT,
  },
];

export function getTokenGroup(tokenAddress: string): TokenGroup | undefined {
  return TOKEN_GROUPS.find((g) => g.tokenAddress === tokenAddress);
}

export function getAgentsForTokenGroup(tokenAddress: string): Agent[] {
  const group = getTokenGroup(tokenAddress);
  if (!group) return [];
  return AGENTS.filter((a) => group.agentIds.includes(a.id));
}
