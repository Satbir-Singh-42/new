# Configuration Guide

This folder contains all the main configuration files for the IPL Auction application. Edit these files to customize your auction settings and team branding.

## 📁 Configuration Files

### 1. **teams.config.ts** - Team Management
Edit this file to manage all team-related settings:
- **Team Logos**: Add logo images to `/client/public/images/teams/` and reference them here
- **Team Colors**: Border colors for team cards
- **Team Gradients**: Background gradients for visual design

**How to Add a New Team:**
```typescript
'New Team Name': {
  logo: '/images/teams/newteam.png',  // Path to logo in public folder
  borderColor: 'border-[#FF5733]',     // Hex color for border
  bgGradient: 'bg-[linear-gradient(135deg,rgba(255,87,51,0.95)_0%,rgba(200,70,40,0.85)_45%,rgba(150,50,30,0.9)_100%)]',
}
```

### 2. **app.config.ts** - Website Settings
Edit this file to manage auction rules and UI settings:
- **Auction Rules**: Max players, overseas limits, qualification
- **UI Styling**: Card layouts, colors, text formatting
- **Dashboard Colors**: Stat card colors and status indicators

**Common Changes:**
- Change max players: `AUCTION_RULES.maxPlayers = 20`
- Change overseas limit: `AUCTION_RULES.maxOverseasPlayers = 8`
- Modify colors: Update hex values in `DASHBOARD_COLORS`

## 🎨 Team Logo Management

All team logos are stored in one location:
```
/client/public/images/teams/
├── mi.jpg          (Mumbai Indians)
├── lsg.png         (Lucknow Giants)
├── csk.jpg         (Chennai Strikers)
└── ...
```

**To Update a Team Logo:**
1. Add your new logo to `/client/public/images/teams/`
2. Update the path in `teams.config.ts`
3. Changes apply automatically across the entire app

## 🔄 How Changes Apply

When you edit these files:
1. Save the file
2. The development server auto-reloads
3. Changes appear immediately in the app

**No need to restart the server or modify multiple files!**

## 📝 Quick Reference

| What to Change | Which File | What to Edit |
|----------------|------------|--------------|
| Team logo image | `teams.config.ts` | Update `logo` property |
| Team colors | `teams.config.ts` | Update `borderColor` and `bgGradient` |
| Max players | `app.config.ts` | Update `AUCTION_RULES.maxPlayers` |
| Overseas limit | `app.config.ts` | Update `AUCTION_RULES.maxOverseasPlayers` |
| Card colors | `app.config.ts` | Update `DASHBOARD_COLORS` |
| UI layout | `app.config.ts` | Update `TEAM_CARD_STYLE` |

## 🛠️ Technical Notes

- Use Tailwind CSS class format for all colors and styles
- Gradients use RGBA values for transparency
- Border colors use `border-[#HEXCOLOR]` format
- All changes are type-safe with TypeScript
