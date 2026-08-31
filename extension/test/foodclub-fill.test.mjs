// Filling Neopets' own bet form, against the real form markup.
//
// This is the money-touching path, so it is checked in a real browser with the
// page's own handlers stubbed: the point is to prove we *drive* those handlers
// rather than assigning values silently, which would post total_odds=0.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const formHtml = readFileSync(resolve('test/fixtures/foodclub/bet-page.html'), 'utf8');
const fillSrc = readFileSync(resolve('src/content/foodclub-fill.js'), 'utf8')
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/^export /gm, '');

const browser = await chromium.launch();

async function fill(bet) {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><body>
    <script>
      // Stand-ins for Neopets' own scripts, recording what we trigger.
      window.calls = [];
      function add_odds(arena, pirate) { window.calls.push(['add_odds', arena, pirate]); }
      function calc_odds() { window.calls.push(['calc_odds']); }
      function reset_odds(arena) { window.calls.push(['reset_odds', arena]); }
      function set_winnings(v) { window.calls.push(['set_winnings', v]); }
    </script>
    ${formHtml}</body>`);

  const result = await page.evaluate(([src, b]) => {
    const mod = {};
    // eslint-disable-next-line no-new-func
    new Function('module', 'exports', `${src}; module.fillBetForm = fillBetForm;`)(mod, {});
    const out = mod.fillBetForm(document, b);
    const form = document.querySelector('form[name="bet_form"]');
    return {
      out,
      selects: [1, 2, 3, 4, 5].map((n) => form.querySelector(`select[name="winner${n}"]`).value),
      checked: [...form.querySelectorAll('input[name="matches[]"]')].map((c) => c.checked),
      amount: form.querySelector('input[name="bet_amount"]').value,
      calls: window.calls,
    };
  }, [fillSrc, bet]);

  await page.close();
  return result;
}

test('fills the picked arenas and leaves the rest alone', async () => {
  // Ids are taken from the saved page, not guessed: Ol' Stripey is 12 in
  // Shipwreck and The Tailhook Kid is 20 in Treasure Island.
  const r = await fill({
    picks: [{ arena: 1, pirateId: '12' }, { arena: 3, pirateId: '20' }],
    amount: 1000,
  });

  assert.equal(r.out.ok, true);
  assert.deepEqual(r.out.arenas, [1, 3]);
  assert.equal(r.selects[0], '12');
  assert.equal(r.selects[2], '20');
  assert.deepEqual(r.selects[1], '', 'untouched arenas stay empty');
  assert.deepEqual(r.checked, [true, false, true, false, false]);
  assert.equal(r.amount, '1000');
});

test('drives the page\'s own odds handlers rather than setting values silently', async () => {
  const r = await fill({ picks: [{ arena: 1, pirateId: '12' }], amount: 500 });

  // The checkbox click is what runs add_odds with the chosen pirate, then calc_odds.
  assert.ok(r.calls.some(([fn, arena, pirate]) => fn === 'add_odds' && arena === 1 && pirate === '12'),
    `add_odds was not called with the pirate: ${JSON.stringify(r.calls)}`);
  assert.ok(r.calls.some(([fn]) => fn === 'calc_odds'), 'calc_odds never ran, so total_odds would post as 0');
  assert.ok(r.calls.some(([fn]) => fn === 'set_winnings'), 'the winnings field was never recalculated');
});

test('clears a previous selection instead of merging into it', async () => {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><body>
    <script>
      window.calls = [];
      function add_odds(a, p) { window.calls.push(['add_odds', a, p]); }
      function calc_odds() { window.calls.push(['calc_odds']); }
      function reset_odds(a) { window.calls.push(['reset_odds', a]); }
      function set_winnings(v) {}
    </script>${formHtml}</body>`);

  const r = await page.evaluate(([src]) => {
    const form = document.querySelector('form[name="bet_form"]');
    // Pretend the user already had arena 2 selected.
    form.querySelector('select[name="winner2"]').value = form.querySelector('select[name="winner2"]').options[1].value;
    form.querySelectorAll('input[name="matches[]"]')[1].checked = true;

    const mod = {};
    // eslint-disable-next-line no-new-func
    new Function('module', 'exports', `${src}; module.fillBetForm = fillBetForm;`)(mod, {});
    mod.fillBetForm(document, { picks: [{ arena: 1, pirateId: '12' }], amount: 100 });

    return {
      checked: [...form.querySelectorAll('input[name="matches[]"]')].map((c) => c.checked),
      winner2: form.querySelector('select[name="winner2"]').value,
      resetCalled: window.calls.some(([fn, a]) => fn === 'reset_odds' && a === 2),
    };
  }, [fillSrc]);
  await page.close();

  assert.deepEqual(r.checked, [true, false, false, false, false], 'the old arena was unchecked');
  assert.equal(r.winner2, '', 'the old pirate was cleared');
  assert.ok(r.resetCalled, 'reset_odds must run so the stale odds are dropped');
});

test('refuses rather than filling a pirate that is not in this round', async () => {
  const r = await fill({ picks: [{ arena: 1, pirateId: '99999' }], amount: 100 });
  assert.equal(r.out.ok, false);
  assert.equal(r.out.reason, 'no_pirates_matched');
  assert.deepEqual(r.checked, [false, false, false, false, false]);
});

test('never submits the form', async () => {
  assert.ok(!/\.submit\s*\(/.test(fillSrc), 'the filler must not call form.submit()');
  assert.ok(!/type=["']?submit/.test(fillSrc), 'the filler must not synthesise a submit');
});

test.after(async () => { await browser.close(); });
