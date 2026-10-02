// bracketFormat: visible label of the "Bracket Format" select. Some labels are shown more than
// once with a different description (bracketFormatDetail disambiguates which one to pick by
// matching a unique snippet of that description). Known values as of this writing:
//   Round Robin               -> unique, no detail needed
//   Double Round Robin        -> unique, no detail needed
//   Single Elimination        -> needs bracketFormatDetail: 'Gold/Silver medals only' or 'Gold/Silver/Bronze medals'
//   Double Elimination        -> needs bracketFormatDetail: 'Winner of consolation bracket moves up' or 'cannot move up to win gold' (Bronze only)
//   Double Elimination 9th Place -> shares the 'Double Elimination' prefix, so it also needs a
//                                   bracketFormatDetail (e.g. '9th Place') or it will match all
//                                   three "Double Elimination" options and fail
// playOffType only applies when bracketFormat is 'Round Robin' or 'Double Round Robin'; leave it
// null otherwise. Valid values: 'No Playoff', 'Top One', 'Top Two', 'Top Three', 'Top Four',
// 'Seeded Elimination (No Bronze Medal)', 'Seeded Elimination (All Medals)'.
export const BRACKET_CONFIGS = [
  {
    teamType: 'Open Doubles',
    bracketFormat: 'Round Robin',
    bracketFormatDetail: null,
    playOffType: 'Top Two',
    lowSkillLevel: null,
    highSkillLevel: null,
    lowAge: null,
    highAge: null,
    alternateDescription: null,
    maximumFullTeams: null,
    allowAnyScore: true,
  },
  {
    teamType: "Men's Doubles",
    bracketFormat: 'Single Elimination',
    bracketFormatDetail: 'Gold/Silver/Bronze',
    playOffType: null,
    lowSkillLevel: 'Beginner',
    highSkillLevel: 'Advanced',
    lowAge: 12,
    highAge: 40,
    alternateDescription: 'TEST',
    maximumFullTeams: 4,
    allowAnyScore: false,
  },
  {
    teamType: "Men's Doubles",
    bracketFormat: 'Double Elimination',
    bracketFormatDetail: 'Winner of consolation bracket moves up',
    playOffType: null,
    lowSkillLevel: null,
    highSkillLevel: null,
    lowAge: 12,
    highAge: 40,
    alternateDescription: 'TEST 2.0',
    maximumFullTeams: 4,
    allowAnyScore: false,
  },
  {
    teamType: "Men's Doubles",
    bracketFormat: 'Double Elimination',
    bracketFormatDetail: 'Winner of consolation bracket moves up',
    playOffType: null,
    lowSkillLevel: null,
    highSkillLevel: null,
    lowAge: null,
    highAge: null,
    allowAnyScore: false,
  },
  {
    teamType: "Men's Doubles",
    bracketFormat: 'Double Elimination',
    bracketFormatDetail: 'Winner of consolation bracket moves up',
    playOffType: null,
    lowSkillLevel: null,
    highSkillLevel: null,
    lowAge: null,
    highAge: null,
    allowAnyScore: false,
  },
];
