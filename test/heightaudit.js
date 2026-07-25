// Height audit: dump every level's REAL collision surfaces and flag rises/gaps
// that violate the COMPARABLE HEIGHTS rule (see CLAUDE.md). Ground truth, not source-reading.
const { chromium } = require('playwright');
const path = require('path');

const LIMITS = { step: 2.2, dbl: 3.0, spring: 4.0, mega: 6.5, gapTap: 4.0, gapHeld: 5.5 };

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'grimmwick.html') + '?test=1');
  await page.waitForTimeout(2500);

  const levels = ['w5l1','w5l2','w5l3','w5l4','w5l5'];
  let issues = 0;
  for (const id of levels) {
    await page.evaluate((i) => window.__game.scene(i), id);
    await page.waitForTimeout(1200);
    const surfaces = await page.evaluate(() => {
      // standable surfaces: solid + bounce boxes near the lane, plus movers
      const out = [];
      for (const c of window.G.world.cols) {
        if (c.type !== 'solid' && c.type !== 'bounce') continue;
        if (c.min.z > 2.5 || c.max.z < -2.5) continue;          // off-lane deco stands
        out.push({ x1: +c.min.x.toFixed(1), x2: +c.max.x.toFixed(1), top: +c.max.y.toFixed(2), kind: c.type });
      }
      for (const m of window.G.world.movers) {
        // sample the mover's clock for its full travel envelope
        let lo = Infinity, hi = -Infinity, xlo = Infinity, xhi = -Infinity;
        for (let t = 0; t < 12; t += 0.1) { const p = m.fn(t); lo = Math.min(lo, p.y + m.h); hi = Math.max(hi, p.y + m.h); xlo = Math.min(xlo, p.x - m.w / 2); xhi = Math.max(xhi, p.x + m.w / 2); }
        out.push({ x1: +xlo.toFixed(1), x2: +xhi.toFixed(1), top: +((lo + hi) / 2).toFixed(2), kind: 'mover', topMin: +lo.toFixed(2), topMax: +hi.toFixed(2) });
      }
      return out.sort((a, b) => a.x1 - b.x1);
    });
    // walk the surfaces left→right: for each, find the reachable nexts and flag hard transitions
    const flags = [];
    for (let i = 0; i < surfaces.length; i++) {
      const a = surfaces[i];
      // candidates: surfaces starting within 8u after a's right edge (or overlapping above)
      for (const b of surfaces) {
        if (b === a) continue;
        const gap = b.x1 - a.x2;
        if (gap < -1 || gap > 7) continue;                       // not a forward transition
        const rise = b.top - a.top;
        if (rise <= 0.45) {                                      // walk/step-up — check the gap only
          if (gap > LIMITS.gapHeld && b.x1 - a.x2 < 8) flags.push(`LONG GAP ${gap.toFixed(1)}u  x${a.x2}→x${b.x1} (tops ${a.top}→${b.top})${a.kind === 'mover' || b.kind === 'mover' ? ' [mover involved]' : ''}`);
          continue;
        }
        if (a.kind === 'bounce' || b.kind === 'bounce') continue; // bounce verbs have their own ceiling (mega 6.5)
        if (rise > LIMITS.spring) flags.push(`RISE ${rise.toFixed(2)} needs spring+/mega  x${a.x2}→x${b.x1} (top ${a.top}→${b.top})`);
        else if (rise > LIMITS.dbl) flags.push(`RISE ${rise.toFixed(2)} needs spring  x${a.x2}→x${b.x1} (top ${a.top}→${b.top})`);
        else if (rise > LIMITS.step && gap > 2.5) flags.push(`RISE ${rise.toFixed(2)} + GAP ${gap.toFixed(1)} = tight double  x${a.x2}→x${b.x1} (top ${a.top}→${b.top})`);
      }
    }
    // dedupe near-identical flags
    const uniq = [...new Set(flags)];
    console.log(`\n=== ${id} — ${surfaces.length} surfaces, ${uniq.length} flags`);
    uniq.forEach(f => console.log('  ⚠ ' + f));
    issues += uniq.length;
  }
  await browser.close();
  console.log(`\nTOTAL FLAGS: ${issues} (review each against level intent — climb/spring/mega gates are legal if telegraphed)`);
})().catch(e => { console.error('CRASH', e); process.exit(1); });
