/**
 * Team Branding Configuration
 * 
 * This file contains all team visual configurations including:
 * - Team logos (images or abbreviations)
 * - Border colors (Tailwind CSS with hex values to avoid conflicts)
 * - Background gradients (CSS linear-gradient with RGBA for proper transparency)
 * 
 * IMPORTANT: Color Guidelines
 * - Use border-[#HEXCOLOR] format for border colors (e.g., border-[#045093])
 * - Use bg-[linear-gradient(...)] for gradients with RGBA values for transparency
 * - Gradients use 135deg angle and three color stops at 0%, 45%, and 100%
 * - Opacity values: 0.95 (start), 0.85 (middle), 0.9 (end) for consistent appearance
 * 
 * To add a new team:
 * 1. Add an entry to the TEAM_BRANDING object with the exact team name from Google Sheets
 * 2. Specify the logo (file path or abbreviation letters like 'NT')
 * 3. Add border color: border-[#HEXCOLOR]
 * 4. Add background gradient following the pattern below
 * 
 * Example:
 * 'New Team Name': {
 *   logo: '/images/teams/newteam.png',  // or 'NT' for abbreviation
 *   borderColor: 'border-[#FF5733]',
 *   bgGradient: 'bg-[linear-gradient(135deg,rgba(255,87,51,0.95)_0%,rgba(200,70,40,0.85)_45%,rgba(150,50,30,0.9)_100%)]',
 * }
 */

export interface TeamBranding {
  logo: string;
  borderColor: string;
  bgGradient: string;
}

export const TEAM_BRANDING: Record<string, TeamBranding> = {
  'Mumbai Indians': {
    logo: '/images/teams/mi.png',
    borderColor: 'border-[#045093]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(4,80,147,0.95)_0%,rgba(2,50,93,0.85)_45%,rgba(1,30,70,0.9)_100%)]',
  },
  'Lucknow Giants': {
    logo: '/images/teams/lg.png',
    borderColor: 'border-[#0097A7]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,151,167,0.95)_0%,rgba(0,120,135,0.85)_45%,rgba(0,90,110,0.9)_100%)]',
  },
  'Bangalore Tigers': {
    logo: 'BT',
    borderColor: 'border-[#DA1212]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(218,18,18,0.95)_0%,rgba(180,15,15,0.85)_45%,rgba(140,10,10,0.9)_100%)]',
  },
  'Kolkata Riders': {
    logo: 'KR',
    borderColor: 'border-[#3E1F47]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(62,31,71,0.95)_0%,rgba(45,20,55,0.85)_45%,rgba(30,15,40,0.9)_100%)]',
  },
  'Sunrisers Hyderabad': {
    logo: 'SH',
    borderColor: 'border-[#F26522]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(242,101,34,0.95)_0%,rgba(200,80,25,0.85)_45%,rgba(160,65,20,0.9)_100%)]',
  },
  'Delhi Capitals': {
    logo: 'DC',
    borderColor: 'border-[#004C97]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,76,151,0.95)_0%,rgba(0,60,120,0.85)_45%,rgba(0,45,95,0.9)_100%)]',
  },
  'Chennai Strikers': {
    logo: 'CS',
    borderColor: 'border-[#F9CD00]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(249,205,0,0.95)_0%,rgba(200,165,0,0.85)_45%,rgba(160,130,0,0.9)_100%)]',
  },
  'Ahmedabad Giants': {
    logo: 'AG',
    borderColor: 'border-[#0B132B]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(11,19,43,0.95)_0%,rgba(8,15,35,0.85)_45%,rgba(5,10,25,0.9)_100%)]',
  },
  'Punjab Kings': {
    logo: 'PK',
    borderColor: 'border-[#C8102E]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(200,16,46,0.95)_0%,rgba(160,10,35,0.85)_45%,rgba(120,8,25,0.9)_100%)]',
  },
  'Rajasthan Royals': {
    logo: 'RR',
    borderColor: 'border-[#EA1A8C]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(234,26,140,0.95)_0%,rgba(190,20,115,0.85)_45%,rgba(150,15,90,0.9)_100%)]',
  },
  'Indore Titans': {
    logo: 'IT',
    borderColor: 'border-[#0074D9]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,116,217,0.95)_0%,rgba(0,90,170,0.85)_45%,rgba(0,70,130,0.9)_100%)]',
  },
  'Goa Gladiators': {
    logo: 'GG',
    borderColor: 'border-[#00BCD4]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,188,212,0.95)_0%,rgba(0,150,170,0.85)_45%,rgba(0,120,140,0.9)_100%)]',
  },
  'Gujarat Titans': {
    logo: 'GT',
    borderColor: 'border-[#0A1931]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(10,25,49,0.95)_0%,rgba(7,20,40,0.85)_45%,rgba(5,15,30,0.9)_100%)]',
  },
  'Pune Panthers': {
    logo: 'PP',
    borderColor: 'border-[#5E35B1]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(94,53,177,0.95)_0%,rgba(75,40,140,0.85)_45%,rgba(60,30,110,0.9)_100%)]',
  },
  'Kanpur Knights': {
    logo: 'KK',
    borderColor: 'border-[#424242]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(66,66,66,0.95)_0%,rgba(50,50,50,0.85)_45%,rgba(35,35,35,0.9)_100%)]',
  },
};

/**
 * Default branding for teams not found in the configuration
 */
export const DEFAULT_TEAM_BRANDING: TeamBranding = {
  logo: '??', // Will show team initials
  borderColor: 'border-[#666666]',
  bgGradient: 'bg-[linear-gradient(135deg,rgba(100,100,100,0.95)_0%,rgba(60,60,60,0.85)_45%,rgba(40,40,40,0.9)_100%)]',
};

/**
 * Get team branding configuration
 */
export function getTeamBranding(teamName: string): TeamBranding {
  return TEAM_BRANDING[teamName] || DEFAULT_TEAM_BRANDING;
}

/**
 * Get team logo (file path or abbreviation)
 */
export function getTeamLogo(teamName: string): string {
  const branding = getTeamBranding(teamName);
  return branding.logo;
}

/**
 * Get team border color (Tailwind class)
 */
export function getTeamBorderColor(teamName: string): string {
  const branding = getTeamBranding(teamName);
  return branding.borderColor;
}

/**
 * Get team background gradient (Tailwind class)
 */
export function getTeamGradient(teamName: string): string {
  const branding = getTeamBranding(teamName);
  return branding.bgGradient;
}
