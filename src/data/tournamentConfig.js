// Fixed values for the tournament's venue/equipment configuration (TournamentManagerViewPage.
// setTournamentConfiguration), so a failing run can be reproduced instead of depending on a
// random pick. Each value must match its vaadin-select option text exactly — change them here
// if a different combination needs to be tested.
export const TOURNAMENT_CONFIG = {
  ballColor: 'Franklin X-40 Performance (Yellow)',
  surfaceType: 'Asphalt',
  netType: 'Permanent',
  venueType: 'Outdoor',
};
