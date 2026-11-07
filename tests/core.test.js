import test from 'node:test';
import assert from 'node:assert/strict';
import {parseBirth,calculate,reduceNumber,compatibility,move,rollDice,cells,transitions,localDay,archetypes} from '../core.js';
const now = new Date(2026,10,7);
test('rejects impossible, malformed, future and out-of-range dates', () => {
  for(const value of ['',null,'2001-02-29','2000-13-01','2000-04-31','2026-11-08','1899-01-01','01.01.2000']) assert.throws(()=>parseBirth(value,now));
  assert.deepEqual(parseBirth('2000-02-29',now),{year:2000,month:2,day:29});
  assert.equal(parseBirth('2026-11-07',now).day,7);
});
test('known psychomatrix calculation for 16 July 1996', () => {
  const c=calculate('1996-07-16',now);
  assert.equal(c.life,3);
  assert.deepEqual([c.first,c.second,c.third,c.fourth],[39,12,37,10]);
  assert.deepEqual(c.counts,{1:4,2:1,3:2,4:0,5:0,6:2,7:2,8:0,9:3});
  assert.deepEqual(c.resource,[7,7,7]);
  assert.equal(c.year,6);
});
test('master numbers are preserved only when requested',()=>{
  for(const n of [11,22,33]) assert.equal(reduceNumber(n),n);
  assert.equal(reduceNumber(29),11);assert.equal(reduceNumber(22,false),4);
  assert.equal(calculate('2000-01-08',now).life,11);
});
test('negative working numbers and single-digit days are defined',()=>{
  const c=calculate('2000-01-09',now);
  assert.equal(c.third,-6);assert.equal(c.fourth,6);
  assert.ok(Object.values(c.counts).every(Number.isInteger));
});
test('compatibility is symmetric and never invents a percentage',()=>{
  const a=compatibility('1996-07-16','2000-01-08');
  const b=compatibility('2000-01-08','1996-07-16');
  assert.equal(a.common,b.common);assert.equal(a.common,5);assert.equal('score' in a,false);
});
test('board transitions and completion rules',()=>{
  assert.equal(cells.length,36);
  assert.deepEqual(move(0,3),{landing:3,position:1});
  assert.deepEqual(move(4,2),{landing:6,position:13});
  assert.deepEqual(move(35,6),{landing:36,position:36});
  for(const [from,to] of Object.entries(transitions)) {assert.ok(Number(from)>=1 && Number(from)<=36);assert.ok(to>=1 && to<=36);}
  assert.throws(()=>move(-1,1));assert.throws(()=>move(1,0));assert.throws(()=>move(1,7));assert.throws(()=>move(1.5,2));
});
test('random dice remains within 1–6',()=>{for(let i=0;i<1000;i++){const n=rollDice();assert.ok(Number.isInteger(n)&&n>=1&&n<=6);}});
test('local date uses calendar day and pads components',()=>{assert.equal(localDay(new Date(2026,0,2,0,1)),'2026-01-02');});
test('all supported birth dates produce usable content',()=>{
  for(let year=1900;year<=2026;year++) for(let month=1;month<=12;month++) {
    const birth=`${year}-${String(month).padStart(2,'0')}-01`;
    if(birth>'2026-11-07')continue;
    const c=calculate(birth,now);assert.ok(archetypes[c.life]);assert.ok(c.year>=1&&c.year<=9);assert.ok(c.resource.every(n=>n>=1&&n<=9));
  }
});
