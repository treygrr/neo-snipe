# neo-snipe

A Chrome extension that puts Jelly Neo prices on every Neopets item, plus a bar of shortcuts for
dailies, Food Club, the Quest Log, the Magma Pool, auctions and more — without leaving the page.

## Install

1. Download the latest `neo-snipe-<version>-chrome.zip` from
   [Releases](https://github.com/treygrr/neo-snipe/releases) and unzip it somewhere permanent.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the unzipped folder.

## Features

### Item prices
- **🔍 badge** on items in your inventory, shops, safety deposit box, auctions, trading post and galleries.
- **Price popover** with Jelly Neo's price, rarity, category and description.
- **Tabs:** price history, trading post history, **Shop Wizard** and **Super Shop Wizard**
  (Premium). The wizards only search when you open their tab, and cache results for a set number
  of minutes. Repeated Shop Wizard searches add to the list instead of replacing it.
- **Margin line** on shop pages: how far Jelly Neo's estimate is above or below the asking price,
  green when it clears your **Buy margin**.
- **Trading Post and Auction House search links** for the item.
- **Favourite** any item with the ♥.
- **Drag** the popover anywhere, **reorder** its tabs, and optionally **reopen on the last tab** you used.
- **Hover badges** hide badges until you point at an item; **Badge size** makes them 16–32px.

### The bar
- A bar on every Neopets page with **Favourites**, **Dailies**, **Food Club**, **Shop Wizard**,
  **Super Shop Wizard**, **Quest Log**, **Magma Pool**, **Inventory** and **Settings**.
- **Collapse** it down to a small arrow.
- **Move** it by its handle; **reorder** its buttons by dragging them.
- **Vertical mode** docks it to the left or right edge of the screen, tucked behind an arrow, with
  bigger buttons.
- **Icon size** from 20–36px, set separately for horizontal and vertical.
- Your **NP counter** links to your inventory, and the extension's **toolbar button** opens Favourites.

### Panels
- **Favourites:** your saved items, drag to reorder; opening one always fetches a fresh price.
- **Dailies:** 100+ daily links in groups (money makers, wheels, free stuff, games of chance, lab
  rays, training, quests…).
  - Pin your favourites to the top.
  - Dailies tick off as you visit them, each reset on its own schedule, with a countdown.
  - Premium-only links show only with Premium.
- **Food Club:**
  - This round's odds, and the day's four bet sets at your stake, with payouts.
  - **Place** bets in one click; bets you already have on show as placed.
  - A **Collect** button that shows your winnings and collects them.
- **Shop Wizard / Super Shop Wizard:** search panels that suggest items from the page you are on,
  with sorting.
- **Quest Log:** today's quests, rewards and bonus, with **Claim** buttons, and a ready-to-claim
  count on the bar. One-click runners:
  - **Fish**, and **spin** any wheel
  - **Read**, **Feed**, **Play** and **Groom**, using your least valuable suitable item on your active pet
  - **Visit** the NC Mall
  - **Customise** your pet: equips a random item, saves, then puts the original outfit back
  - **Shop** for Purchase an Item quests: opens a random shop with stock, marks its cheapest item
    and fills in the haggle offer. The buying stays your click.
- **Magma Pool:** finds when your account's guard naps, checking every 10 minutes while Neopets is
  open. It keeps the time per account with a countdown to the next opening, plus a log of every check.
- **Fast Relist:** press **Save to Fast Relist** on an inventory item's auction form to keep its
  settings. Saved items get a ↻ badge in your inventory that opens a panel where you can adjust
  the values, **Make auction**, save changes, or delete it.

### Settings
- Grouped into **App settings**, **Layout**, **Cache settings**, **Magma Pool** and **Backup**.
- Premium is **detected automatically** from the site, or set by hand.
- **Reset** the panel position, bar position, bar order and popover tab order.
- **Export / import** your settings, favourites, pinned dailies and Magma Pool times, to the
  clipboard or a file, optionally with cached prices.

## Updating

There is no auto-update. **Back up first:** Settings → Backup → **Save file**.

Then unzip the new version **over the same folder** and press **Reload** on `chrome://extensions`.
Chrome ties your data to the folder's location, so a new location starts empty. If that happens,
use **Load file** and **Import** to restore your backup.

## Notes

Prices come from [Jelly Neo](https://items.jellyneo.net). Every lookup is one click, rate-limited
and cached for a day, and nothing buys, bets or lists anything unless you click it.

---

Building, testing or contributing? See **[DEV.md](DEV.md)**.
