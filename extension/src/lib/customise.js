// Customising a pet — the Customise a Pet quest. Pure given the editor's JSON;
// the store does the fetching. Requests come from the Customise page's own
// script (npcma58.js) and replies from real traffic, saved in
// test/fixtures/questlog/ with a README.
//
// A save sends the whole outfit, zone by zone, so a zone left out is taken off.
// Everything here starts from what is worn and only ever adds to it.

export const CUSTOMISE_URL = 'https://www.neopets.com/customise/';
export const CUSTOMISE_API_URL = 'https://www.neopets.com/amfphp/services/jss/apiservices.phtml';

export class CustomiseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomiseError';
  }
}

/** What the Customise page posts to load a pet's editor. */
export function editorBody(username, petname) {
  const body = new FormData();
  body.append('method', 'custompeteditordata');
  body.append('username', username);
  body.append('petname', petname);
  return body;
}

/** What the Customise page posts to save an outfit: every zone, as JSON. */
export function saveBody(username, petname, equipped) {
  const body = new FormData();
  body.append('method', 'custompetsavedata');
  body.append('username', username);
  body.append('petname', petname);
  body.append('petslot', '1');
  body.append('equippedbyzone', JSON.stringify(equipped));
  return body;
}

/** The editor data out of a load reply, or an error saying why there is none. */
export function readEditor(json) {
  const editor = json?.editordata;
  if (!editor?.custom_pet) {
    throw new CustomiseError('Neopets did not return that pet’s wardrobe. Are you logged in, and is the pet yours?');
  }
  return editor;
}

/** What is worn now, as the save expects it: `{ zone: closet_obj_id }`. */
export function readEquipped(editor) {
  return Object.fromEntries(Object.entries(editor?.custom_pet?.equipped_by_zone ?? {})
    .map(([zone, worn]) => [String(zone), worn.closet_obj_id]));
}

const hides = (mask, zone) => String(mask ?? '')[Number(zone) - 1] === '1';

/**
 * The wearables that could be added without changing anything already worn:
 * owned, not on another pet, known to the registry, compatible with this pet,
 * in zones nothing occupies, and neither hiding nor hidden by what is worn.
 */
export function wearableCandidates(editor, petname) {
  const infos = editor?.object_info_registry ?? {};
  const equipped = readEquipped(editor);
  const wornZones = Object.keys(equipped);
  const wornIds = new Set(Object.values(equipped));
  const wornInfos = Object.values(editor?.closet_items ?? {})
    .filter((c) => wornIds.has(c.closet_obj_id))
    .map((c) => infos[c.obj_info_id])
    .filter(Boolean);
  const pet = String(petname ?? '').toLowerCase();

  return Object.values(editor?.closet_items ?? {})
    .filter((c) => !wornIds.has(c.closet_obj_id))
    .filter((c) => !c.applied_to || String(c.applied_to).toLowerCase() === pet)
    .map((c) => ({ closet: c, info: infos[c.obj_info_id] }))
    .filter(({ info }) => info?.is_compatible)
    .map(({ closet, info }) => ({
      name: info.name,
      closetObjId: closet.closet_obj_id,
      objInfoId: closet.obj_info_id,
      zones: Object.keys(info.assets_by_zone ?? {}),
      restrict: info.zones_restrict,
    }))
    .filter((item) => item.zones.length)
    .filter((item) => !item.zones.some((z) => wornZones.includes(z)))
    .filter((item) => !item.zones.some((z) => wornInfos.some((w) => hides(w.zones_restrict, z))))
    .filter((item) => !wornZones.some((z) => hides(item.restrict, z)))
    .map(({ restrict, ...item }) => item);
}

/** One candidate, at random. */
export const pickRandom = (list, random = Math.random) =>
  (list?.length ? list[Math.min(list.length - 1, Math.floor(random() * list.length))] : null);

/** The outfit with an item added in each of its zones; the original is left as it was. */
export const withItem = (equipped, item) => ({
  ...equipped,
  ...Object.fromEntries(item.zones.map((z) => [String(z), item.closetObjId])),
});

/**
 * A save's reply, which Neopets sends as a newline then `{"updatecount":1}`.
 * Anything without a count of at least one did not save.
 */
export function parseSave(reply) {
  let json = reply;
  if (typeof reply === 'string') {
    try { json = JSON.parse(reply.trim()); } catch { json = null; }
  }
  const updated = Number(json?.updatecount);
  if (!(updated >= 1)) throw new CustomiseError('Neopets did not save that outfit.');
  return { updated };
}
