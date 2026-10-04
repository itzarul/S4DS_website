const { test } = require('node:test');
const assert = require('node:assert/strict');
const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/pages/Home/storyMath.js'), 'utf8');
require('node:vm').runInThisContext(source.replace('export default function mount', 'function mountStoryMath') + '\nmountStoryMath({environment:{window:globalThis}});');
const { phases, geometry } = globalThis.StoryMath;
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} differs from ${b}`);

test('NOVA phase boundaries retain their overlapping contraction and spread', () => {
  assert.deepEqual(phases(0), {phase1:0,phase2:0,phase3:0,phase4:0});
  close(phases(200).phase1,.75);
  close(phases(200).phase2,0);
  close(phases(800/3).phase1,1);
  close(phases(800/3).phase2,2/3);
  close(phases(300).phase2,1);
  close(phases(300).phase3,0);
});
test('each card faces the camera in order and the opening begins after 270 degrees', () => {
  [300, 300+500/3, 300+1000/3, 800].forEach((v,i) => close(phases(v).phase3*270,i*90));
  close(phases(800).phase4,0);
  close(phases(1150).phase4,.5);
  close(phases(1500).phase4,1);
  assert.deepEqual(phases(1600), {phase1:1,phase2:1,phase3:1,phase4:1});
});
test('scrubbing backwards has the same state with no accumulated rotation', () => {
  const forward = Array.from({length:1601},(_,v)=>phases(v));
  for(let v=1600;v>=0;v--) assert.deepEqual(phases(v),forward[v]);
  for(const key of ['phase1','phase2','phase3','phase4']) {
    for(let v=1;v<=1600;v++) assert.ok(forward[v][key]>=forward[v-1][key]);
  }
});
test('desktop, tablet, and mobile keep Nova card proportions and depths', () => {
  for(const [w,h,expected] of [[1920,920,[42,62,27,40]], [768,1024,[54,80,35,52]], [390,844,[64,94,41,60]]]) {
    const vmin = Math.min(w,h)/100;
    Object.values(geometry(w,h)).forEach((value,i)=>close(value,expected[i]*vmin));
  }
});

test('every rotating card corner fits the framed viewport on desktop and mobile', () => {
  for (const [w,h,frameW,frameH,p] of [[1440,900,490,666,118],[390,844,285,371,155],[768,1024,256,758,136]]) {
    const {cardWidth,cardHeight,radius} = geometry(w,h);
    const perspective = p*Math.min(w,h)/100;
    const scale = globalThis.StoryMath.fitDeck(cardWidth,cardHeight,radius,perspective,frameW,frameH);
    for(let degrees=0;degrees<360;degrees++) {
      const a=degrees*Math.PI/180;
      for(const x of [-cardWidth/2,cardWidth/2]) {
        const rotatedX=x*Math.cos(a)+radius*Math.sin(a);
        const z=-x*Math.sin(a)+radius*Math.cos(a);
        const magnification=perspective/(perspective-z);
        assert.ok(Math.abs(rotatedX*magnification*scale)<frameW/2);
        assert.ok(cardHeight/2*magnification*scale<frameH/2);
      }
    }
  }
});

