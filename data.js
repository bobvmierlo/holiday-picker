/*
 * Built-in destination catalogue.
 *
 * Every destination is tagged so the wheel can be filtered:
 *   budget   : 'low' | 'mid' | 'high'
 *   distance : 'regional' | 'europe' | 'longhaul'
 *   vibes    : any of 'beach' | 'city' | 'nature' | 'winter'
 *   seasons  : best time to go, any of 'spring' | 'summer' | 'autumn' | 'winter'
 *   party    : who it suits, any of 'couple' | 'group'
 *
 * "regional" is meant as: reachable by car/train for a weekend-ish trip.
 * Tweak this list (or add your own destinations in the app) to taste.
 */
const BUILTIN_DESTINATIONS = [
  // ── Regional ───────────────────────────────────────────────────────────
  { id: 'be', name: 'Belgium',        flag: '🇧🇪', budget: 'low',  distance: 'regional', vibes: ['city'],                       seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'de', name: 'Germany',        flag: '🇩🇪', budget: 'mid',  distance: 'regional', vibes: ['city', 'nature', 'winter'],   seasons: ['spring', 'summer', 'autumn', 'winter'], party: ['couple', 'group'] },
  { id: 'fr', name: 'France',         flag: '🇫🇷', budget: 'mid',  distance: 'regional', vibes: ['beach', 'city', 'nature'],    seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'lu', name: 'Luxembourg',     flag: '🇱🇺', budget: 'mid',  distance: 'regional', vibes: ['city', 'nature'],             seasons: ['spring', 'summer', 'autumn'],           party: ['couple'] },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', budget: 'high', distance: 'regional', vibes: ['city', 'nature'],             seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'dk', name: 'Denmark',        flag: '🇩🇰', budget: 'high', distance: 'regional', vibes: ['city', 'nature'],             seasons: ['spring', 'summer'],                     party: ['couple', 'group'] },

  // ── Europe ─────────────────────────────────────────────────────────────
  { id: 'es', name: 'Spain',          flag: '🇪🇸', budget: 'mid',  distance: 'europe',   vibes: ['beach', 'city'],              seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'pt', name: 'Portugal',       flag: '🇵🇹', budget: 'mid',  distance: 'europe',   vibes: ['beach', 'city', 'nature'],    seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'it', name: 'Italy',          flag: '🇮🇹', budget: 'mid',  distance: 'europe',   vibes: ['beach', 'city', 'nature'],    seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'gr', name: 'Greece',         flag: '🇬🇷', budget: 'mid',  distance: 'europe',   vibes: ['beach', 'nature'],            seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'hr', name: 'Croatia',        flag: '🇭🇷', budget: 'mid',  distance: 'europe',   vibes: ['beach', 'nature'],            seasons: ['summer', 'autumn'],                     party: ['couple', 'group'] },
  { id: 'at', name: 'Austria',        flag: '🇦🇹', budget: 'mid',  distance: 'europe',   vibes: ['nature', 'winter'],           seasons: ['summer', 'winter'],                     party: ['couple', 'group'] },
  { id: 'ch', name: 'Switzerland',    flag: '🇨🇭', budget: 'high', distance: 'europe',   vibes: ['nature', 'winter'],           seasons: ['summer', 'winter'],                     party: ['couple'] },
  { id: 'no', name: 'Norway',         flag: '🇳🇴', budget: 'high', distance: 'europe',   vibes: ['nature', 'winter'],           seasons: ['summer', 'winter'],                     party: ['couple', 'group'] },
  { id: 'is', name: 'Iceland',        flag: '🇮🇸', budget: 'high', distance: 'europe',   vibes: ['nature', 'winter'],           seasons: ['summer', 'winter'],                     party: ['couple'] },
  { id: 'cz', name: 'Czechia',        flag: '🇨🇿', budget: 'low',  distance: 'europe',   vibes: ['city'],                       seasons: ['spring', 'summer', 'autumn', 'winter'], party: ['couple', 'group'] },
  { id: 'pl', name: 'Poland',         flag: '🇵🇱', budget: 'low',  distance: 'europe',   vibes: ['city', 'nature'],             seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'hu', name: 'Hungary',        flag: '🇭🇺', budget: 'low',  distance: 'europe',   vibes: ['city'],                       seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'tr', name: 'Türkiye',        flag: '🇹🇷', budget: 'low',  distance: 'europe',   vibes: ['beach', 'city'],              seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },

  // ── Long-haul ──────────────────────────────────────────────────────────
  { id: 'jp', name: 'Japan',          flag: '🇯🇵', budget: 'high', distance: 'longhaul', vibes: ['city', 'nature', 'winter'],   seasons: ['spring', 'autumn', 'winter'],           party: ['couple', 'group'] },
  { id: 'th', name: 'Thailand',       flag: '🇹🇭', budget: 'low',  distance: 'longhaul', vibes: ['beach', 'city', 'nature'],    seasons: ['winter', 'spring'],                     party: ['couple', 'group'] },
  { id: 'vn', name: 'Vietnam',        flag: '🇻🇳', budget: 'low',  distance: 'longhaul', vibes: ['beach', 'city', 'nature'],    seasons: ['winter', 'spring'],                     party: ['couple', 'group'] },
  { id: 'id', name: 'Indonesia',      flag: '🇮🇩', budget: 'low',  distance: 'longhaul', vibes: ['beach', 'nature'],            seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'us', name: 'United States',  flag: '🇺🇸', budget: 'high', distance: 'longhaul', vibes: ['city', 'nature'],             seasons: ['spring', 'summer', 'autumn'],           party: ['couple', 'group'] },
  { id: 'ca', name: 'Canada',         flag: '🇨🇦', budget: 'high', distance: 'longhaul', vibes: ['city', 'nature', 'winter'],   seasons: ['summer', 'autumn', 'winter'],           party: ['couple', 'group'] },
  { id: 'mx', name: 'Mexico',         flag: '🇲🇽', budget: 'mid',  distance: 'longhaul', vibes: ['beach', 'city', 'nature'],    seasons: ['winter', 'spring'],                     party: ['couple', 'group'] },
  { id: 'cr', name: 'Costa Rica',     flag: '🇨🇷', budget: 'mid',  distance: 'longhaul', vibes: ['beach', 'nature'],            seasons: ['winter', 'spring'],                     party: ['couple'] },
  { id: 'za', name: 'South Africa',   flag: '🇿🇦', budget: 'mid',  distance: 'longhaul', vibes: ['beach', 'city', 'nature'],    seasons: ['autumn', 'winter', 'spring'],           party: ['couple', 'group'] },
  { id: 'au', name: 'Australia',      flag: '🇦🇺', budget: 'high', distance: 'longhaul', vibes: ['beach', 'city', 'nature'],    seasons: ['winter', 'spring', 'autumn'],           party: ['couple', 'group'] },
  { id: 'nz', name: 'New Zealand',    flag: '🇳🇿', budget: 'high', distance: 'longhaul', vibes: ['nature', 'winter'],           seasons: ['winter', 'spring', 'autumn'],           party: ['couple'] },
  { id: 'mv', name: 'Maldives',       flag: '🇲🇻', budget: 'high', distance: 'longhaul', vibes: ['beach'],                      seasons: ['winter', 'spring'],                     party: ['couple'] },
];
