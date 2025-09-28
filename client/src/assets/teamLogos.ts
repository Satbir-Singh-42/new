// Team logo paths from organized public directory
const AGLogo = '/images/teams/ag.png';
const CSLogo = '/images/teams/csk.jpg';
const DCLogo = '/images/teams/dc.jpg';
const GBLogo = '/images/teams/gb.png';
const GGLogo = '/images/teams/gg.png';
const GTLogo = '/images/teams/gt.png';
const ITLogo = '/images/teams/it.png';
const PBKSLogo = '/images/teams/pbks.webp';
const KKRLogo = '/images/teams/kkr.jpeg';
const KPLogo = '/images/teams/kp.png';
const PPLogo = '/images/teams/pp.png';
const RCBLogo = '/images/teams/rcb.jpg';
const SHLogo = '/images/teams/srh.webp';
const RRLogo = '/images/teams/rr.png';

// Team logo mapping by team code/short name
const logosByCode: Record<string, string> = {
  'ag': AGLogo,
  'cs': CSLogo,
  'csk': CSLogo,
  'dc': DCLogo,
  'gb': GBLogo,
  'gg': GGLogo,
  'gt': GTLogo,
  'it': ITLogo,
  'pbks': PBKSLogo,
  'kkr': KKRLogo,
  'kp': KPLogo,
  'pp': PPLogo,
  'rcb': RCBLogo,
  'sh': SHLogo,
  'srh': SHLogo,
  'rr': RRLogo,
  'mi': '/images/teams/mi.png', // Mumbai Indians
  'lg': '/images/teams/lg.png', // Lucknow Giants
};

// Team logo mapping by full team name
const logosByName: Record<string, string> = {
  // Ahmedabad Giants variants
  'ahmedabad giants': AGLogo,
  'ahmedabadgiants': AGLogo,
  
  // Chennai variants (CSK, Chennai Super Kings, Chennai Strikers)
  'chennai super kings': CSLogo,
  'chennaisuperkings': CSLogo,
  'chennai strikers': CSLogo,
  'chennaistrikers': CSLogo,
  
  // Delhi Capitals variants
  'delhi capitals': DCLogo,
  'delhicapitals': DCLogo,
  
  // Gujarat variants
  'gujarat blasters': GBLogo,
  'gujaratblasters': GBLogo,
  'gujarat titans': GTLogo,
  'gujarattitans': GTLogo,
  
  // Goa Gladiators variants
  'goa gladiators': GGLogo,
  'goagladiators': GGLogo,
  
  // Indore Titans variants
  'indore titans': ITLogo,
  'indoretitans': ITLogo,
  
  // Punjab Kings variants
  'punjab kings': PBKSLogo,
  'punjabkings': PBKSLogo,
  'kings xi punjab': PBKSLogo,
  'kingsxipunjab': PBKSLogo,
  
  // Kolkata variants (KKR, Kolkata Knight Riders, Kolkata Riders)
  'kolkata knight riders': KKRLogo,
  'kolkataknightriders': KKRLogo,
  'kolkata riders': KKRLogo,
  'kolkatariders': KKRLogo,
  
  // Kanpur Knights variants
  'kanpur knights': KPLogo,
  'kanpurknights': KPLogo,
  
  // Pune Panthers variants
  'pune panthers': PPLogo,
  'punepanthers': PPLogo,
  
  // RCB variants (Royal Challengers, Bangalore Tigers)
  'royal challengers bengaluru': RCBLogo,
  'royalchallengersbengaluru': RCBLogo,
  'royal challengers bangalore': RCBLogo,
  'royalchallengersbangalore': RCBLogo,
  'bangalore tigers': RCBLogo,
  'bangaloretigers': RCBLogo,
  
  // Sunrisers Hyderabad variants
  'sunrisers hyderabad': SHLogo,
  'sunrisershyderabad': SHLogo,
  
  // Rajasthan Royals variants
  'rajasthan royals': RRLogo,
  'rajasthanroyals': RRLogo,
  
  // Mumbai Indians variants
  'mumbai indians': '/images/teams/mi.png',
  'mumbaiindians': '/images/teams/mi.png',
  
  // Lucknow Giants variants
  'lucknow giants': '/images/teams/lg.png',
  'lucknowgiants': '/images/teams/lg.png',
};

// Token-based synonyms for flexible matching
const tokenSynonyms: Record<string, string> = {
  // Team city/region tokens (most specific)
  'chennai': 'cs',
  'delhi': 'dc',
  'mumbai': 'mi',
  'kolkata': 'kkr',
  'bangalore': 'rcb',
  'bengaluru': 'rcb',
  'hyderabad': 'srh',
  'punjab': 'pbks',
  'ahmedabad': 'ag',     // More specific than 'gujarat'
  'rajasthan': 'rr',
  'lucknow': 'lg',
  'indore': 'it',
  'goa': 'gg',
  'kanpur': 'kp',
  'pune': 'pp',
  
  // Specific team combinations to avoid ambiguity
  'gujarattitans': 'gt',
  'gujaratblasters': 'gb',
  
  // Team mascot/name tokens (only when unambiguous)
  'sunrisers': 'srh',
  'challengers': 'rcb',
  
  // Common abbreviations and exact matches
  'csk': 'cs',
  'rcb': 'rcb',
  'mi': 'mi',
  'kkr': 'kkr',
  'dc': 'dc',
  'gt': 'gt',
  'srh': 'srh',
  'pbks': 'pbks',
  'rr': 'rr',
  'ag': 'ag',
  'gb': 'gb',
  'gg': 'gg',
  'it': 'it',
  'lg': 'lg',
  'lsg': 'lg',  // Lucknow Super Giants
  'kp': 'kp',
  'pp': 'pp',
};

/**
 * Normalizes a team name or ID to a consistent format for logo lookup
 * Uses token-based matching for better flexibility
 */
export function normalizeTeamKey(nameOrId: string): string {
  if (!nameOrId) return '';
  
  // Convert to lowercase and remove special characters/spaces
  const normalized = nameOrId
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // First try exact match in tokenSynonyms
  const noSpaces = normalized.replace(/\s+/g, '');
  if (tokenSynonyms[noSpaces]) {
    return tokenSynonyms[noSpaces];
  }
  
  // Then try token-based matching
  const tokens = normalized.split(' ').filter(token => token.length > 0);
  for (const token of tokens) {
    if (tokenSynonyms[token]) {
      return tokenSynonyms[token];
    }
  }
  
  // Return the normalized string if no tokens match
  return noSpaces;
}

/**
 * Gets the team logo URL by team name or ID
 */
export function getTeamLogo(nameOrId: string): string | undefined {
  if (!nameOrId) return undefined;
  
  // FIRST: Try exact full name match (highest priority)
  const fullNameKey = nameOrId.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '');
  if (logosByName[fullNameKey]) {
    return logosByName[fullNameKey];
  }
  
  // SECOND: Try normalized token-based matching (lower priority)
  const normalizedKey = normalizeTeamKey(nameOrId);
  if (logosByCode[normalizedKey]) {
    return logosByCode[normalizedKey];
  }
  
  // THIRD: Try the normalized key in names as fallback
  if (logosByName[normalizedKey]) {
    return logosByName[normalizedKey];
  }
  
  return undefined;
}

/**
 * Gets all available team logos
 */
export function getAllTeamLogos(): Record<string, string> {
  return {
    ...logosByCode,
    ...logosByName,
  };
}

/**
 * Checks if a team has a logo available
 */
export function hasTeamLogo(nameOrId: string): boolean {
  return getTeamLogo(nameOrId) !== undefined;
}

// Export individual logos for direct use if needed
export {
  AGLogo,
  CSLogo,
  DCLogo,
  GBLogo,
  GGLogo,
  GTLogo,
  ITLogo,
  PBKSLogo,
  KKRLogo,
  KPLogo,
  PPLogo,
  RCBLogo,
  SHLogo,
  RRLogo,
};