// Coding puzzles: guide the robot to the flag with blocks. Sequences first, then loops, then "repeat until" with
// "if path ahead". Every puzzle carries a known solution; scripts/check.mjs runs it and checks the block limit.
//
// Map legend: # wall · . floor · S start · F flag · * gem (all gems must be collected)
// Blocks: F forward · L turn left · R turn right · [n ...] repeat n times · {until ...} repeat until the flag ·
//         ?L / ?R / ?F / ?W  "if path to the left / right / ahead", "if wall ahead" (do the next block only if so)
export const PUZZLES = [
  { id: 1, title: 'First steps', grade: 0, dir: 'E', limit: 5, map: ['#####', '#S.F#', '#####'], tools: 'FLR', solution: 'F F', teach: 'Put "Move forward" blocks in order. The robot does them one at a time.' },
  { id: 2, title: 'Turn the corner', grade: 0, dir: 'E', limit: 6, map: ['#####', '#S.##', '##.##', '##F##', '#####'], tools: 'FLR', solution: 'F R F F', teach: 'Turning does not move the robot. It only changes the way it faces.' },
  { id: 3, title: 'Zig-zag', grade: 1, dir: 'E', limit: 9, map: ['######', '#S.###', '##..##', '###.F#', '######'], tools: 'FLR', solution: 'F R F L F R F L F', teach: 'Plan the whole path before you press Run.' },
  { id: 4, title: 'Pick up the gem', grade: 1, dir: 'S', limit: 8, map: ['#####', '#S*.#', '#.#.#', '#..F#', '#####'], tools: 'FLR', solution: 'L F F R F F', teach: 'Collect every gem before you reach the flag.' },
  { id: 5, title: 'The long hall', grade: 1, dir: 'E', limit: 2, map: ['##########', '#S......F#', '##########'], tools: 'FLR[', solution: '[7 F]', teach: 'A repeat block does the blocks inside it again and again. Seven steps with one block!' },
  { id: 6, title: 'Stairs', grade: 2, dir: 'E', limit: 6, map: ['#######', '#S.####', '##..###', '###..##', '####.F#', '#######'], tools: 'FLR[', solution: 'F [3 R F L F]', teach: 'Find the part that repeats. Here it is: turn right, forward, turn left, forward.' },
  { id: 7, title: 'Square walk', grade: 2, dir: 'E', limit: 6, map: ['######', '#S..*#', '#F##.#', '#*##.#', '#..*.#', '######'], tools: 'FLR[', solution: '[3 [3 F] R] F F', teach: 'Walking a square is: go along a side, turn, and do it again. You can put a repeat inside a repeat.' },
  { id: 8, title: 'Gem row', grade: 2, dir: 'E', limit: 2, map: ['#########', '#S*.*.*F#', '#########'], tools: 'FLR[', solution: '[6 F]', teach: 'Gems on the way are picked up as you walk over them.' },
  { id: 9, title: 'Big stairs', grade: 3, dir: 'E', limit: 7, map: ['#########', '#S..#####', '###..####', '####..###', '#####..##', '######.F#', '#########'], tools: 'FLR[', solution: 'F [4 F R F L] F', teach: 'Count how many times the pattern happens before you set the repeat number.' },
  { id: 10, title: 'Spiral in', grade: 3, dir: 'E', limit: 10, map: ['#######', '#S....#', '#####.#', '#F###.#', '#.....#', '#######'], tools: 'FLR[', solution: '[4 F] R [3 F] R [4 F] R F', teach: 'Long straight parts are perfect for repeat blocks.' },
  { id: 11, title: 'Follow the path', grade: 3, dir: 'E', limit: 6, map: ['########', '#S..####', '###.####', '###...##', '#####.F#', '########'], tools: 'FLR{?', solution: '{ ?R R ?L L F }', teach: '"Repeat until the flag" keeps going until the robot arrives. "If path to the right" checks before acting.' },
  { id: 12, title: 'Winding road', grade: 4, dir: 'S', limit: 6, map: ['#########', '#S#.....#', '#.#.###.#', '#...#F#.#', '#####.#.#', '#####...#', '#########'], tools: 'FLR{?', solution: '{ ?L L ?R R F }', teach: 'One small program can follow any winding path. That is the power of loops and ifs together.' },
  { id: 13, title: 'Gem staircase', grade: 4, dir: 'E', limit: 7, map: ['#########', '#S.*#####', '###.#####', '###.*.###', '#####.###', '#####.*.#', '#######.#', '#######F#', '#########'], tools: 'FLR[', solution: '[3 [2 F] R [2 F] L]', teach: 'Each stair is the same: two steps along, turn, two steps down, turn back. Repeat the stair.' },
  { id: 14, title: 'Maze runner', grade: 5, dir: 'E', limit: 7, map: ['##########', '#S...#...#', '###.##.#.#', '#...#..#.#', '#.###.##.#', '#.....#F.#', '##########'], tools: 'FLR{?W', solution: '{ ?R R ?W L ?F F }', teach: 'The right-hand rule: keep your right hand on the wall and you will find the way out.' },
  { id: 15, title: 'Gem maze', grade: 6, dir: 'E', limit: 7, map: ['#########', '#S*..*..#', '#.#####*#', '#.#####.#', '#.#####*#', '#.....*.#', '###F#####', '#########'], tools: 'FLR{?W', solution: '{ ?L L ?W R ?F F }', teach: 'The left-hand rule works too. Which wall would you follow here?' },
];

export const BLOCKS = {
  F: { label: 'Move forward', short: '↑' },
  L: { label: 'Turn left', short: '↺' },
  R: { label: 'Turn right', short: '↻' },
  '[': { label: 'Repeat', short: '⟳' },
  '{': { label: 'Repeat until flag', short: '∞' },
  '?L': { label: 'If path left', short: '?←' },
  '?R': { label: 'If path right', short: '?→' },
  '?F': { label: 'If path ahead', short: '?↑' },
  '?W': { label: 'If wall ahead', short: '?▮' },
};

// program text → tree. "F [3 R F] { ?R R F }" → [{op:'F'}, {op:'repeat', n:3, body:[...]}, {op:'until', body:[...]}]
export function parse(text) {
  const toks = text.replace(/([[\]{}])/g, ' $1 ').trim().split(/\s+/).filter(Boolean);
  let i = 0;
  const seq = (end) => {
    const out = [];
    while (i < toks.length && toks[i] !== end) {
      const t = toks[i++];
      if (t === '[') { const n = Number(toks[i++]); out.push({ op: 'repeat', n, body: seq(']') }); i++; }
      else if (t === '{') { out.push({ op: 'until', body: seq('}') }); i++; }
      else if (/^\?[LRFW]$/.test(t)) out.push({ op: 'if', dir: t[1] });
      else if (/^[FLR]$/.test(t)) out.push({ op: t });
      else throw new Error(`Unknown block ${t}`);
    }
    return out;
  };
  return seq(null);
}
export const countBlocks = (tree) => tree.reduce((n, b) => n + 1 + (b.body ? countBlocks(b.body) : 0), 0);
export const toText = (tree) => tree.map((b) => (b.op === 'repeat' ? `[${b.n} ${toText(b.body)}]` : b.op === 'until' ? `{ ${toText(b.body)} }` : b.op === 'if' ? `?${b.dir}` : b.op)).join(' ');

const DIRS = ['N', 'E', 'S', 'W'], DX = { N: 0, E: 1, S: 0, W: -1 }, DY = { N: -1, E: 0, S: 1, W: 0 };
export function world(p) {
  const grid = p.map.map((row) => row.split(''));
  let start, flag; const gems = new Set();
  grid.forEach((row, y) => row.forEach((c, x) => { if (c === 'S') start = { x, y }; if (c === 'F') flag = { x, y }; if (c === '*') gems.add(`${x},${y}`); }));
  return { grid, start, flag, gems, w: grid[0].length, h: grid.length };
}

// Run a program; returns { trace: [{x,y,dir,gems,event}], result: 'win' | 'crash' | 'short' | 'gems' | 'loop' }
export function run(p, tree, maxSteps = 400) {
  const W = world(p);
  const s = { x: W.start.x, y: W.start.y, dir: p.dir, gems: new Set(W.gems) };
  const trace = [{ x: s.x, y: s.y, dir: s.dir, gems: [...s.gems] }];
  const free = (x, y) => W.grid[y]?.[x] != null && W.grid[y][x] !== '#';
  const turn = (d, k) => DIRS[(DIRS.indexOf(d) + k + 4) % 4];
  const ahead = (d) => free(s.x + DX[d], s.y + DY[d]);
  let steps = 0, crashed = false;
  const atFlag = () => s.x === W.flag.x && s.y === W.flag.y;
  const exec = (list) => {
    for (let k = 0; k < list.length; k++) {
      if (crashed || steps > maxSteps) return;
      const b = list[k]; steps++;
      if (b.op === 'F') {
        if (!ahead(s.dir)) { crashed = true; trace.push({ x: s.x, y: s.y, dir: s.dir, gems: [...s.gems], event: 'bump' }); return; }
        s.x += DX[s.dir]; s.y += DY[s.dir]; s.gems.delete(`${s.x},${s.y}`);
        trace.push({ x: s.x, y: s.y, dir: s.dir, gems: [...s.gems] });
      } else if (b.op === 'L' || b.op === 'R') { s.dir = turn(s.dir, b.op === 'L' ? -1 : 1); trace.push({ x: s.x, y: s.y, dir: s.dir, gems: [...s.gems] }); }
      else if (b.op === 'repeat') { for (let n = 0; n < b.n && !crashed; n++) exec(b.body); }
      else if (b.op === 'until') { let guard = 0; while (!atFlag() && !crashed && guard++ < 200 && steps <= maxSteps) exec(b.body); }
      else if (b.op === 'if') {
        const d = b.dir === 'F' || b.dir === 'W' ? s.dir : turn(s.dir, b.dir === 'L' ? -1 : 1);
        if (b.dir === 'W' ? ahead(d) : !ahead(d)) k++;               // skip the next block
      }
    }
  };
  exec(tree);
  const result = crashed ? 'crash' : steps > maxSteps ? 'loop' : !atFlag() ? 'short' : s.gems.size ? 'gems' : 'win';
  return { trace, result };
}
// stars: 3 if within the block limit, 2 if a few over, 1 otherwise
export const starsFor = (p, n) => (n <= p.limit ? 3 : n <= p.limit + 3 ? 2 : 1);
