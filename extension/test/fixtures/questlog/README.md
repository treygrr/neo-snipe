# Quest Log captures

Captured 2026-09-13 from a logged-in account. With the owner's go-ahead the capture fished once, claimed that
quest, and spun the Wheel of Excitement once; nothing else was claimed or bought.

## Files

- `retrieve-daily.json` — the envelope of a daily `retrieveQuests.php` reply, minus `output`.
- `retrieve-daily.html` — that reply's `output`, every quest at 0 progress. Rebuilt from the captured markup:
  the quest cards match it apart from whitespace; inside the bonus and streak blocks only the class names and
  text are captured, so their inner nesting is approximate.
- `quest-claimable.html` — the Go Fishing card once its task is done: a filled `.ql-progress-bar`, a
  `.ql-task-complete` inside the check, and a live `claimReward(this)` button instead of a `disabled` one.
- `claim-quest-np.json` — `claimRewards.php`'s reply for that quest.
- `fishing-result.html` — the Fishing Vortex page after reeling in (the catch, and the skill going up).
- `wheel-spin-np.json` — `getResult.php`'s reply for a Wheel of Excitement spin that landed on NP.

## What the list does as quests move

- A finished quest is sorted to the top of the list.
- A claimed quest is removed from the list altogether, and the tab's `.ql-notif` count drops with it.
- The bonus counts finished quests, claimed or not: `N / 5`, one `.ql-marker` turning from `ql-incomplete` to
  `ql-complete` each. The `ql-premium` quest counts toward it like any other: finishing Read to a Pet
  (Premium) moved the bonus from 2/5 to 3/5.

## Endpoints

All `POST`, header `x-requested-with: XMLHttpRequest`, body `FormData`. `_ref_ck` is the 32-hex value every
Neopets page carries inline (`hub.js` reads it with `getCK()`, which only exists on the quest log page).

| Endpoint | Body | Reply |
|---|---|---|
| `/np-templates/ajax/questlog/retrieveQuests.php` | `_ref_ck`, `tab` (`2` daily, `3` NeoPass), optional `tabGroup` | `{success, timer, output}` — `timer` is a PHP DateInterval to expiry (`h`, `i`, `s`); failure is `{success:false, error:true, errMsg}` |
| `/np-templates/ajax/questlog/claimRewards.php` | `_ref_ck` + `mode=quest&quest=<id>`, `mode=bonus&bonus=<id>`, or `mode=streak&streak=<id>` | NP: `{success, reward:"np", npAmt, newNp}` (captured). Items and newbie packs add `itemImg`, `itemName`, `newbieItems` per `hub.js`; errors are `{error, errMsg}` |
| `/np-templates/ajax/questlog/skipQuest.php` | `_ref_ck`, `quest` | from `hub.js`, not yet captured |

The quest id is the number in `id="Quest<id>"` and on the card's `data-quest`.

## Runners

- **Go Fishing** — `POST /water/fishing.phtml` with `go_fish=1`; no token. The reply is the full page: the
  catch in `.item-single__2020`'s background image and the `<b>` after it. Done inside a second of the post,
  the quest reads complete.
- **Spin the Wheel** — the quest names the wheel ("Spin the Wheel of Excitement in Faerieland"), so a runner
  must spin that one. `POST /np-templates/ajax/wheels/getResult.php` with `{type: <gameOptions.wheelType>, token}`;
  `token` stays unset on every wheel but Monotony. Knowledge is `type 1` (400 NP), Excitement `type 2` (500 NP,
  can destroy items). The reply carries `success`, `degree`, `slot`, `name` (the prize), `image`,
  `spinResultMessage`, `neopoints` (the new total) and `premium_freeSpin` — the captured spin had it `true`, so
  Premium may have covered the cost.
- **Visit NC Mall / Popular NC Items** — not captured: the browser extension is not allowed on
  `ncmall.neopets.com`.

## Buying from a Neopian shop (Purchase an Item)

- **A shop page** — `/objects.phtml?type=shop&obj_type=<shop>` (Magical Bookshop `7`, Faerieland Bookshop `38`).
  Stock sits in `<form name="items_for_sale">`; an empty shop has `<p class="soldOutMessage">` there instead
  and restocks about every eight minutes. `shop-sold-out.html` is that page's body.
- **Stock** — each item is a `.shop-item`: an `.item-img` with `data-name`, `data-price` (plain NP) and
  `data-link` (`haggle.phtml?obj_info_id=<item>&stock_id=<stock>&g=<n>`, relative to `/`), then
  `.item-name` and two `.item-stock` lines ("1 in stock", "Cost: 669 NP"). Clicking calls the page's
  `confirmPurchase(this)`. `shop-in-stock.html` keeps the captured Battle Ready! card; the second card's ids
  are placeholders.
- **Buying** — captured 2026-09-13 buying Battle Ready! for 669 NP, with the owner's go-ahead.
  1. `confirmPurchase` opens `#confirmPurchasePopup` ("Are you sure you wish to purchase Battle Ready! at
     669 NP?") with a Cloudflare Turnstile widget. It resolved by itself; the Yes link (`#confirm-link`) is
     enabled once it does, and opens the item's `data-link` plus `&cf_token=<Turnstile token>`. The
     extension never completes Turnstile — without that token there is no haggle page.
  2. `/haggle.phtml` shows the asking price ("I want at least 669 Neopoints for this great item.") and a form
     with `current_offer` and a Haggle! submit. No image check appeared on this purchase.
  3. Offering the asking price answers "I accept your offer of 669 Neopoints!" and "<item> has been added to
     your inventory".
  `haggle-offer.html` and `haggle-accepted.html` keep that text; their markup is rebuilt around it, and the
  haggle form's action and hidden fields were not captured.

## Using an item on a pet (Feed, Groom, Play With, Read to)

Captured 2026-09-13 reading Battle Ready! (a Faerie Book, bought for this) to Testeh, with the owner's
go-ahead. That finished Read to a Pet and moved the bonus from 2/5 to 3/5.

- **Inventory** — each item is `.item-img[data-itemname]` carrying `data-objid`, `data-itemtype` (`Food`,
  `Grooming`, `Plushies`, …), `data-itemname` and `data-image`. The inventory page's own HTML holds **none**
  of them: `inventory.js` fills the page in with `POST /np-templates/ajax/inventory.php?itemType=np&alpha=&itemStack=1&action=<tab>`
  (tabs: 1 Food, 2 Toys, 3 Books, 4 Grooming, 5 Healing, 6 Wearables, 7 Equipment, 8 Furniture, 9 Misc;
  blank for everything). Without the `X-Requested-With: XMLHttpRequest` header it answers
  `{"error":true,"message":"Request denied"}`. `inventory-items.html` is that reply trimmed to one cell
  (captured 2026-09-13 while fixing Feed, which had been reading the empty page).
- **The item's actions** — `POST /np-templates/views/iteminfo.phtml?obj_id=<objid>` returns an HTML fragment
  with `<form action="useobject.phtml">`: a hidden `obj_id` and `<select name="action">` (inside
  `#iteminfo_select_action`). Pet actions use the words as the value, one per pet: `Feed to <Pet>`,
  `Play with <Pet>` (plushies), `Groom <Pet>` (grooming). Food offers only `Feed to`. The rest are
  `safetydeposit`, `donate`, `drop`, `stockshop`, `stockgallery`, `give`, `auction`, `tradingpost`. A book
  (type `Faerie Book`) offers `Feed to <Pet>` and `Read to <Pet>`.
  `iteminfo-plushie.html` rebuilds that form; only the Safety Deposit Box option's label was captured, so the
  other non-pet labels in it are placeholders.
- **Using it** — `inventory.js`'s `useInvItem()` posts URL-encoded `obj_id`, `action`, `petcare=0` to
  `/np-templates/views/useobject.phtml` and shows the HTML reply as the result. `use-read-book.html` is the
  reply to `Read to Testeh`: the pet's picture, "Testeh says 'Thats one of my favourites, thanks!!'", and
  "Battle Ready! vanishes in a puff of green smoke!" — a Faerie Book is used up by reading it.
  (NC items go to `process_cash_object.phtml` instead; no quest needs those.)

## Customising a pet (Customise a Pet)

Captured 2026-09-13 on Testeh, with the owner's go-ahead: one save adding a random wearable (Faerie Lights
Garland, zone 44), then one saving the original outfit back. The wardrobe read afterwards matched the original
exactly, and Customise a Pet counted as done.

- **The page** — `/customise/` runs `npcma58.js`, started with
  `NeopetCustomisation.initialize({"username":"vothex","petname":"Testeh","baseDomain":"/amfphp/services/jss/apiservices.phtml", …})`.
- **Loading** — `POST /amfphp/services/jss/apiservices.phtml`, FormData `method=custompeteditordata`,
  `username`, `petname` → `{ editordata, pbitems }`. `editordata.custom_pet.equipped_by_zone` maps each zone
  to what is worn there (`closet_obj_id`, `asset_id`); `closet_items` are the wearables you own
  (`closet_obj_id`, `obj_info_id`, `applied_to` — empty, or the pet wearing it); `object_info_registry`
  describes each by `obj_info_id` (`name`, `assets_by_zone` for this pet, `is_compatible`, `zones_restrict`,
  a 52-character mask of the zones it hides).
- **Saving** — the same URL, FormData `method=custompetsavedata`, `username`, `petname`, `petslot=1`,
  `equippedbyzone` as JSON `{ "<zone>": <closet_obj_id> }`. It is the **whole** outfit: a zone left out is
  taken off. Both saves replied `customise-save.json` — a newline, then `{"updatecount":1}`.
- **What was there** — Testeh wore Haunted Trees Background (zone 3) and Pile of Treasure Foreground (zone 45).
  Of 86 closet items, 34 were on other pets, 36 had no registry entry, 6 used a worn zone and 8 could be added
  (Confetti Shower and Hero of Neopia Foreground in 52, Intricate Border Ink Frame and Rainbow Butterflies
  Garland in 44, Sunny Background Frame and Neovian Clocktower Lights Garland in 48, and two more).
  `customise-editor.json` keeps that shape trimmed to a few items; the two worn items' `obj_info_id`s and the
  ids starting `9001`/`9999` are placeholders, as are the one-digit asset ids.
