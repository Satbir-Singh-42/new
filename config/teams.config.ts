/**
 * ========================================
 * TEAM CONFIGURATION
 * ========================================
 * 
 * This file contains ALL team-related settings:
 * - Team logos (paths to images in /client/public/images/teams/)
 * - Team colors (border colors)
 * - Team gradients (background gradients)
 * 
 * HOW TO UPDATE:
 * 1. Add team logo to: client/public/images/teams/
 * 2. Add team entry below with logo path, colors, and gradient
 * 3. All changes here will apply across the entire app
 */

export interface TeamConfig {
  logo: string;           // Path to logo image or abbreviation (e.g., '/images/teams/mi.jpg' or 'MI')
  borderColor: string;    // Tailwind border class (e.g., 'border-[#045093]')
  bgGradient: string;     // Tailwind gradient class for card backgrounds
}

// ========================================
// TEAM CONFIGURATIONS
// ========================================
export const TEAMS: Record<string, TeamConfig> = {
  'Mumbai Indians': {
    logo: '/images/teams/mi.jpg',
    borderColor: 'border-[#045093]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(4,80,147,0.95)_0%,rgba(2,50,93,0.85)_45%,rgba(1,30,70,0.9)_100%)]',
  },
  'Lucknow Giants': {
    logo: '/images/teams/lsg.png',
    borderColor: 'border-[#0097A7]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,151,167,0.95)_0%,rgba(0,120,135,0.85)_45%,rgba(0,90,110,0.9)_100%)]',
  },
  'Bangalore Tigers': {
    logo: '/images/teams/rcb.jpg',
    borderColor: 'border-[#DA1212]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(218,18,18,0.95)_0%,rgba(180,15,15,0.85)_45%,rgba(140,10,10,0.9)_100%)]',
  },
  'Kolkata Riders': {
    logo: '/images/teams/kkr.jpeg',
    borderColor: 'border-[#3E1F47]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(62,31,71,0.95)_0%,rgba(45,20,55,0.85)_45%,rgba(30,15,40,0.9)_100%)]',
  },
  'Sunrisers Hyderabad': {
    logo: '/images/teams/srh.webp',
    borderColor: 'border-[#F26522]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(242,101,34,0.95)_0%,rgba(200,80,25,0.85)_45%,rgba(160,65,20,0.9)_100%)]',
  },
  'Delhi Capitals': {
    logo: '/images/teams/dc.jpg',
    borderColor: 'border-[#004C97]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,76,151,0.95)_0%,rgba(0,60,120,0.85)_45%,rgba(0,45,95,0.9)_100%)]',
  },
  'Chennai Strikers': {
    logo: '/images/teams/csk.jpg',
    borderColor: 'border-[#F9CD00]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(249,205,0,0.95)_0%,rgba(200,165,0,0.85)_45%,rgba(160,130,0,0.9)_100%)]',
  },
  'Ahmedabad Giants': {
    logo: '/images/teams/ag.png',
    borderColor: 'border-[#0B132B]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(11,19,43,0.95)_0%,rgba(8,15,35,0.85)_45%,rgba(5,10,25,0.9)_100%)]',
  },
  'Punjab Kings': {
    logo: '/images/teams/pbks.webp',
    borderColor: 'border-[#C8102E]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(200,16,46,0.95)_0%,rgba(160,10,35,0.85)_45%,rgba(120,8,25,0.9)_100%)]',
  },
  'Rajasthan Royals': {
    logo: '/images/teams/rr.png',
    borderColor: 'border-[#EA1A8C]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(234,26,140,0.95)_0%,rgba(190,20,115,0.85)_45%,rgba(150,15,90,0.9)_100%)]',
  },
  'Indore Titans': {
    logo: '/images/teams/it.png',
    borderColor: 'border-[#0074D9]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,116,217,0.95)_0%,rgba(0,90,170,0.85)_45%,rgba(0,70,130,0.9)_100%)]',
  },
  'Goa Gladiators': {
    logo: '/images/teams/gg.png',
    borderColor: 'border-[#00BCD4]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(0,188,212,0.95)_0%,rgba(0,150,170,0.85)_45%,rgba(0,120,140,0.9)_100%)]',
  },
  'Gujarat Titans': {
    logo: '/images/teams/gt.png',
    borderColor: 'border-[#0A1931]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(10,25,49,0.95)_0%,rgba(7,20,40,0.85)_45%,rgba(5,15,30,0.9)_100%)]',
  },
  'Gujarat Blasters': {
    logo: '/images/teams/gb.png',
    borderColor: 'border-[#FF6B35]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(255,107,53,0.95)_0%,rgba(200,85,40,0.85)_45%,rgba(160,68,32,0.9)_100%)]',
  },
  'Pune Panthers': {
    logo: '/images/teams/pp.png',
    borderColor: 'border-[#5E35B1]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(94,53,177,0.95)_0%,rgba(75,40,140,0.85)_45%,rgba(60,30,110,0.9)_100%)]',
  },
  'Kanpur Knights': {
    logo: '/images/teams/kp.png',
    borderColor: 'border-[#424242]',
    bgGradient: 'bg-[linear-gradient(135deg,rgba(66,66,66,0.95)_0%,rgba(50,50,50,0.85)_45%,rgba(35,35,35,0.9)_100%)]',
  },
};

// ========================================
// DEFAULT TEAM (for teams not configured)
// ========================================
export const DEFAULT_TEAM: TeamConfig = {
  logo: '??',
  borderColor: 'border-[#666666]',
  bgGradient: 'bg-[linear-gradient(135deg,rgba(100,100,100,0.95)_0%,rgba(60,60,60,0.85)_45%,rgba(40,40,40,0.9)_100%)]',
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getTeamConfig(teamName: string): TeamConfig {
  return TEAMS[teamName] || DEFAULT_TEAM;
}

export function getTeamLogo(teamName: string): string {
  return getTeamConfig(teamName).logo;
}

export function getTeamBorderColor(teamName: string): string {
  return getTeamConfig(teamName).borderColor;
}

export function getTeamGradient(teamName: string): string {
  return getTeamConfig(teamName).bgGradient;
}

export function getAllTeams(): string[] {
  return Object.keys(TEAMS);
}
