// Quick links to Neopets dailies.
//
// Every URL here was taken verbatim from a published dailies guide rather than
// written from memory, and generated from those pages rather than hand-typed:
//   https://www.jellyneo.net/?go=dailies
//   https://thedailyneopets.com/dailies
//
// The second is curated: that page also lists its own games nav and site
// sections, which are not dailies. Where the two disagreed — TDN gives the Lab
// Ray as lab2.phtml, Jelly Neo as lab.phtml — lab2.phtml redirects to
// destination=/lab.phtml, so the latter is canonical.
export const DAILIES = [
  {
    title: "Money makers",
    items: [
      { label: "Food Club", url: "https://www.neopets.com/pirates/foodclub.phtml?type=bet" },
      { label: "Bargain stocks", url: "https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true" },
      { label: "Your portfolio", url: "https://www.neopets.com/stockmarket.phtml?type=portfolio" },
      { label: "Bank interest", url: "https://www.neopets.com/bank.phtml" },
      { label: "Trudy's Surprise", url: "https://www.neopets.com/trudys_surprise.phtml" }
    ],
  },
  {
    title: "Wheels",
    items: [
      { label: "Wheel of Excitement", url: "https://www.neopets.com/faerieland/wheel.phtml" },
      { label: "Wheel of Extravagance", url: "https://www.neopets.com/desert/extravagance.phtml" },
      { label: "Wheel of Knowledge", url: "https://www.neopets.com/medieval/knowledge.phtml" },
      { label: "Wheel of Mediocrity", url: "https://www.neopets.com/prehistoric/mediocrity.phtml" },
      { label: "Wheel of Misfortune", url: "https://www.neopets.com/halloween/wheel/index.phtml" },
      { label: "Wheel of Monotony", url: "https://www.neopets.com/prehistoric/monotony/monotony.phtml" },
      { label: "Wheel of Starlight (premium)", url: "https://www.neopets.com/premium/wheel.phtml" }
    ],
  },
  {
    title: "Free stuff",
    items: [
      { label: "Monthly freebies", url: "https://www.neopets.com/freebies/" },
      { label: "Tarla's Treasures", url: "https://www.neopets.com/freebies/tarlastoolbar.phtml" },
      { label: "Money Tree", url: "https://www.neopets.com/donations.phtml" },
      { label: "Soup Kitchen", url: "https://www.neopets.com/soupkitchen.phtml" },
      { label: "Rich Slorg", url: "https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes" },
      { label: "Second-Hand Shoppe", url: "https://www.neopets.com/thriftshoppe/index.phtml" },
      { label: "Rubbish Dump", url: "https://www.neopets.com/medieval/rubbishdump.phtml" },
      { label: "Snowager", url: "https://www.neopets.com/winter/snowager.phtml" },
      { label: "Wishing Well", url: "https://www.neopets.com/wishing.phtml" },
      { label: "Igloo Garage Sale", url: "https://www.neopets.com/winter/igloo.phtml" },
      { label: "Almost Abandoned Attic", url: "https://www.neopets.com/halloween/garage.phtml" },
      { label: "Tarla's Shop of Mystery", url: "https://www.neopets.com/winter/shopofmystery.phtml" },
      { label: "The Neggery", url: "https://www.neopets.com/winter/neggery.phtml" },
      { label: "Toy Repair Shop", url: "https://www.neopets.com/winter/brokentoys.phtml" },
      { label: "Smuggler's Cove", url: "https://www.neopets.com/pirates/smugglerscove.phtml" }
    ],
  },
  {
    title: "Chance",
    items: [
      { label: "Fruit Machine", url: "https://www.neopets.com/desert/fruitmachine.phtml" },
      { label: "Deadly Dice", url: "https://www.neopets.com/worlds/deadlydice.phtml" },
      { label: "Dice-a-Roo", url: "https://www.neopets.com/games/dicearoo.phtml" },
      { label: "Tombola", url: "https://www.neopets.com/island/tombola.phtml" },
      { label: "Poogle Racing", url: "https://www.neopets.com/faerieland/poogleracing.phtml" },
      { label: "Scratchcard \u2014 Desert", url: "https://www.neopets.com/desert/sc/kiosk.phtml" },
      { label: "Scratchcard \u2014 Haunted", url: "https://www.neopets.com/halloween/scratch.phtml" },
      { label: "Scratchcard \u2014 Ice Caves", url: "https://www.neopets.com/winter/kiosk.phtml" },
      { label: "Faerie Caverns", url: "https://www.neopets.com/faerieland/caverns/index.phtml" },
      { label: "Bagatelle", url: "https://www.neopets.com/halloween/bagatelle.phtml" },
      { label: "Coconut Shy", url: "https://www.neopets.com/halloween/coconutshy.phtml" },
      { label: "Cork Gun Gallery", url: "https://www.neopets.com/halloween/corkgun.phtml" },
      { label: "Test Your Strength", url: "https://www.neopets.com/halloween/strtest/index.phtml" },
      { label: "Grarrl Keno", url: "https://www.neopets.com/prehistoric/keno.phtml" },
      { label: "Gormball", url: "https://www.neopets.com/space/gormball.phtml" },
      { label: "Scorchy Slots", url: "https://www.neopets.com/games/slots.phtml" },
      { label: "Neopian Lottery", url: "https://www.neopets.com/games/lottery.phtml" },
      { label: "Merry Go Round", url: "https://www.neopets.com/worlds/roo/merrygoround.phtml" },
      { label: "Cheeseroller", url: "https://www.neopets.com/medieval/cheeseroller.phtml" },
      { label: "Kiss the Mortog", url: "https://www.neopets.com/medieval/kissthemortog.phtml" },
      { label: "Turdle Racing", url: "https://www.neopets.com/medieval/turdleracing.phtml" },
      { label: "x2 or Nothing", url: "https://www.neopets.com/medieval/doubleornothing.phtml" }
    ],
  },
  {
    title: "Dailies",
    items: [
      { label: "Coltzan's Shrine", url: "https://www.neopets.com/desert/shrine.phtml" },
      { label: "Healing Springs", url: "https://www.neopets.com/faerieland/springs.phtml" },
      { label: "Fishing Vortex", url: "https://www.neopets.com/water/fishing.phtml" },
      { label: "Giant Omelette", url: "https://www.neopets.com/prehistoric/omelette.phtml" },
      { label: "Giant Jelly", url: "https://www.neopets.com/jelly/jelly.phtml" },
      { label: "Symol Hole", url: "https://www.neopets.com/medieval/symolhole.phtml" },
      { label: "Grumpy Old King", url: "https://www.neopets.com/medieval/grumpyking.phtml" },
      { label: "Wise Old King", url: "https://www.neopets.com/medieval/wiseking.phtml" },
      { label: "Guess the Marrow", url: "https://www.neopets.com/medieval/guessmarrow.phtml" },
      { label: "Apple Bobbing", url: "https://www.neopets.com/halloween/applebobbing.phtml" },
      { label: "Forgotten Shore", url: "https://www.neopets.com/pirates/forgottenshore.phtml" },
      { label: "Grave Danger", url: "https://www.neopets.com/halloween/gravedanger/" },
      { label: "Lunar Temple", url: "https://www.neopets.com/shenkuu/lunar/" },
      { label: "Negg Cave", url: "https://www.neopets.com/shenkuu/neggcave/" },
      { label: "Meteor", url: "https://www.neopets.com/moon/meteor.phtml" },
      { label: "Moltara Quarry", url: "https://www.neopets.com/magma/quarry.phtml" },
      { label: "Dark Cave", url: "https://www.neopets.com/magma/darkcave.phtml" },
      { label: "Anchor Management", url: "https://www.neopets.com/pirates/anchormanagement.phtml" },
      { label: "Deserted Tomb", url: "https://www.neopets.com/worlds/geraptiku/tomb.phtml" },
      { label: "Lair of the Beast", url: "https://www.neopets.com/prehistoric/thebeast.phtml" },
      { label: "Kiko Pop", url: "https://www.neopets.com/worlds/kiko/kpop/" },
      { label: "Council Chamber", url: "https://www.neopets.com/altador/council.phtml" },
      { label: "Faerie Crossword", url: "https://www.neopets.com/games/crossword/index.phtml" },
      { label: "Daily Puzzle", url: "https://www.neopets.com/community/" },
      { label: "Blue Grundo Plushie", url: "https://www.neopets.com/faerieland/tdmbgpop.phtml" },
      { label: "Quest Log", url: "https://www.neopets.com/questlog/" },
      { label: "Alien Aisha Vending Machine", url: "https://www.neopets.com/vending.phtml" },
      { label: "Turmaculus", url: "https://www.neopets.com/medieval/turmaculus.phtml" },
      { label: "Island Mystic", url: "https://www.neopets.com/island/mystichut.phtml" },
      { label: "Lever of Doom", url: "https://www.neopets.com/space/strangelever.phtml" },
      { label: "NeoCola Machine", url: "https://www.neopets.com/moon/neocola.phtml" },
      { label: "Magma Pool", url: "https://www.neopets.com/magma/pool.phtml" },
      { label: "Tangor's Workshop", url: "https://www.neopets.com/magma/workshop.phtml" },
      { label: "The Coincidence", url: "https://www.neopets.com/magma/portal/ship.phtml" },
      { label: "Qasalan Expellibox", url: "https://www.neopets.com/games/giveaway/giveaway_game.phtml" },
      { label: "Pick Your Own", url: "https://www.neopets.com/medieval/pickyourown_index.phtml" },
      { label: "Tiki Tours", url: "https://www.neopets.com/island/tikitours.phtml" },
      { label: "Gourmet Club", url: "https://www.neopets.com/gourmet_club.phtml" },
      { label: "Buried Treasure", url: "https://www.neopets.com/pirates/buriedtreasure/index.phtml" },
      { label: "The Kadoatery", url: "https://www.neopets.com/games/kadoatery/index.phtml" },
      { label: "Neolodge", url: "https://www.neopets.com/neolodge.phtml" }
    ],
  },
  {
    title: "Labs",
    items: [
      { label: "Lab Ray", url: "https://www.neopets.com/lab.phtml" },
      { label: "Petpet Lab Ray", url: "https://www.neopets.com/petpetlab.phtml" }
    ],
  },
  {
    title: "Training",
    items: [
      { label: "Mystery Island Training", url: "https://www.neopets.com/island/training.phtml" },
      { label: "Ninja Training School", url: "https://www.neopets.com/island/fight_training.phtml" },
      { label: "Pirate Academy", url: "https://www.neopets.com/pirates/academy.phtml" },
      { label: "Employment Agency", url: "https://www.neopets.com/faerieland/employ/employment.phtml" }
    ],
  },
  {
    title: "Contests",
    items: [
      { label: "Lenny Conundrum", url: "https://www.neopets.com/games/conundrum.phtml" },
      { label: "Mystery Pic", url: "https://www.neopets.com/games/mysterypic.phtml" },
      { label: "Cliffhanger", url: "https://www.neopets.com/games/cliffhanger/cliffhanger.phtml" },
      { label: "Caption Competition", url: "https://www.neopets.com/games/new_caption.phtml" },
      { label: "Story Telling", url: "https://www.neopets.com/art/storytell.phtml" },
      { label: "Better Than You", url: "https://www.neopets.com/games/betterthanyou.phtml" }
    ],
  },
  {
    title: "Quests",
    items: [
      { label: "Faerie Quests", url: "https://www.neopets.com/quests.phtml" },
      { label: "Illusen's Glade", url: "https://www.neopets.com/medieval/earthfaerie.phtml" },
      { label: "Jhudora's Bluff", url: "https://www.neopets.com/faerieland/darkfaerie.phtml" },
      { label: "Taelia's Quests", url: "https://www.neopets.com/winter/snowfaerie.phtml" },
      { label: "Brain Tree", url: "https://www.neopets.com/halloween/braintree.phtml" },
      { label: "Esophagor", url: "https://www.neopets.com/halloween/esophagor.phtml" },
      { label: "Edna's Quests", url: "https://www.neopets.com/halloween/witchtower.phtml" },
      { label: "Kitchen Quests", url: "https://www.neopets.com/island/kitchen.phtml" }
    ],
  },
];

export const DAILY_COUNT = DAILIES.reduce((n, g) => n + g.items.length, 0);

// Anything under /premium/ needs a Neopets Premium subscription. Deriving this
// from the path rather than tagging entries by hand means a premium link added
// later is caught without anyone remembering to flag it.
const PREMIUM_PATH = /^https:\/\/www\.neopets\.com\/premium\//i;

export const isPremiumDaily = (item) => item?.premium === true || PREMIUM_PATH.test(item?.url || '');

/** The list as it should be shown: premium-only entries are dropped without it. */
export function dailiesFor({ premium = false } = {}) {
  if (premium) return DAILIES;
  return DAILIES
    .map((group) => ({ ...group, items: group.items.filter((i) => !isPremiumDaily(i)) }))
    .filter((group) => group.items.length);
}
