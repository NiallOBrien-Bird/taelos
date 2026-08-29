'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './heatmap-lab.css';

type RangeMonths = 1 | 3 | 6 | 12;
type ActivityDay = { date: Date; key: string; count: number; weekday: number };

const ranges: RangeMonths[] = [1, 3, 6, 12];
const rangeDays: Record<RangeMonths, number> = { 1: 31, 3: 92, 6: 183, 12: 365 };
const referenceDate = new Date(2026, 7, 29, 12);

function formatKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function makeActivity(range: RangeMonths): ActivityDay[] {
  return Array.from({ length: rangeDays[range] }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - (rangeDays[range] - index - 1));
    const signal = (index * 13 + Math.floor(index / 7) * 5 + date.getMonth() * 7) % 23;
    const count = signal < 5 ? 0 : signal < 11 ? 1 : signal < 16 ? 2 : signal < 20 ? 3 : signal === 20 ? 5 : 0;
    return { date, key: formatKey(date), count, weekday: date.getDay() };
  });
}

function bucket(data: ActivityDay[], desired: number) {
  const size = Math.max(1, Math.ceil(data.length / desired));
  return Array.from({ length: Math.ceil(data.length / size) }, (_, index) => {
    const days = data.slice(index * size, (index + 1) * size);
    return { count: days.reduce((sum, day) => sum + day.count, 0), days };
  });
}

function level(count: number) {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

function ConceptHeader({ number, title, description, strength }: { number: string; title: string; description: string; strength: string }) {
  return <header className="hl-card-header"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div><small>{strength}</small></header>;
}

function WeekMatrix({ data }: { data: ActivityDay[] }) {
  const leading = Array.from({ length: data[0]?.weekday ?? 0 });
  return <div className="hl-matrix-wrap"><div className="hl-week-labels"><span>M</span><span>W</span><span>F</span></div><div className="hl-week-matrix">
    {leading.map((_, index) => <i key={`leading-${index}`} className="empty" />)}
    {data.map((day) => <i key={day.key} className={`level-${level(day.count)}`} title={`${day.key}: ${day.count} work units`} />)}
  </div></div>;
}

function MomentumRibbon({ data, range }: { data: ActivityDay[]; range: RangeMonths }) {
  const bars = bucket(data, range === 1 ? 31 : range === 3 ? 40 : 52);
  const high = Math.max(...bars.map((bar) => bar.count), 1);
  return <div className="hl-ribbon"><div className="hl-ribbon-bars">{bars.map((bar, index) => <i key={index} style={{ '--bar': `${Math.max(8, (bar.count / high) * 100)}%` } as CSSProperties} className={bar.count ? '' : 'quiet'} title={`${bar.count} work units`} />)}</div><div className="hl-ribbon-axis"><span>{data[0].date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span><b>Momentum over time</b><span>Today</span></div></div>;
}

function RhythmLanes({ data }: { data: ActivityDay[] }) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return <div className="hl-rhythm">{labels.map((label, weekday) => {
    const days = data.filter((day) => day.weekday === weekday);
    return <div className="hl-rhythm-row" key={`${label}-${weekday}`}><span>{label}</span><div>{days.map((day) => <i key={day.key} className={`level-${level(day.count)}`} title={`${day.key}: ${day.count} work units`} />)}</div><strong>{days.reduce((sum, day) => sum + day.count, 0)}</strong></div>;
  })}</div>;
}

function PulseWave({ data, range }: { data: ActivityDay[]; range: RangeMonths }) {
  const values = bucket(data, range === 1 ? 24 : 32).map((item) => item.count);
  const high = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${52 - (value / high) * 40}`).join(' ');
  const area = `0,56 ${points} 100,56`;
  return <div className="hl-wave"><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-label="Work pulse over time"><defs><linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b7cf6" stopOpacity=".55"/><stop offset="1" stopColor="#8b7cf6" stopOpacity="0"/></linearGradient></defs><path d="M0 52H100M0 32H100M0 12H100" className="hl-wave-grid"/><polygon points={area} fill="url(#wave-fill)"/><polyline points={points} className="hl-wave-line"/></svg><div><span>Quiet</span><b>Work pulse</b><span>Focused</span></div></div>;
}

function ActivityOrbit({ data, range }: { data: ActivityDay[]; range: RangeMonths }) {
  const groups = Array.from({ length: range }, (_, offset) => {
    const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - range + offset + 1, 1);
    const days = data.filter((day) => day.date.getFullYear() === target.getFullYear() && day.date.getMonth() === target.getMonth());
    return { label: target.toLocaleDateString('en', { month: 'short' }), count: days.reduce((sum, day) => sum + day.count, 0) };
  });
  const high = Math.max(...groups.map((group) => group.count), 1);
  return <div className="hl-orbit"><svg viewBox="0 0 220 150" aria-label="Monthly activity orbits">{groups.map((group, index) => {
    const radius = range === 1 ? 56 : 16 + index * (55 / Math.max(1, range - 1));
    return <g key={`${group.label}-${index}`}><circle cx="110" cy="75" r={radius} className="hl-orbit-track"/><circle cx="110" cy="75" r={radius} className="hl-orbit-value" pathLength="100" strokeDasharray={`${(group.count / high) * 82} 100`} style={{ '--orbit-index': index } as CSSProperties}/></g>;
  })}<text x="110" y="72" textAnchor="middle">{data.reduce((sum, day) => sum + day.count, 0)}</text><text x="110" y="88" textAnchor="middle">WORK UNITS</text></svg><div>{groups.map((group, index) => <span key={`${group.label}-legend`}><i style={{ '--orbit-index': index } as CSSProperties}/>{group.label}</span>)}</div></div>;
}

function WorkConstellation({ data, range }: { data: ActivityDay[]; range: RangeMonths }) {
  const active = data.flatMap((day, position) => day.count > 0 ? [{ day, position }] : []);
  return <div className="hl-constellation"><div className="hl-constellation-grid">{[1, 2, 3, 4].map((line) => <i key={line} style={{ left: `${line * 20}%` }} />)}</div>{active.map((day, index) => {
    const x = data.length === 1 ? 50 : (day.position / (data.length - 1)) * 100;
    const y = 78 - ((day.day.count * 17 + day.day.weekday * 7 + index * 3) % 62);
    return <b key={day.day.key} className={`level-${level(day.day.count)}`} style={{ left: `${x}%`, top: `${y}%`, '--dot': `${5 + day.day.count * 1.8}px` } as CSSProperties} title={`${day.day.key}: ${day.day.count} work units`} />;
  })}<div className="hl-constellation-axis"><span>{range === 1 ? 'Earlier this month' : `${range} months ago`}</span><span>Today</span></div></div>;
}

export default function HeatmapLab() {
  const [range, setRange] = useState<RangeMonths>(3);
  const data = useMemo(() => makeActivity(range), [range]);
  const work = data.reduce((sum, day) => sum + day.count, 0);
  const activeDays = data.filter((day) => day.count > 0).length;
  return <main className="hl-page">
    <header className="hl-topbar"><Link href="/" aria-label="Back to tasks"><span>←</span> Tasks</Link><div><span className="hl-eyebrow">Exploration page</span><h1>Heatmap Lab</h1><p>Six ways to make work visible across changing time scales.</p></div><div className="hl-range" aria-label="Demo time range">{ranges.map((item) => <button type="button" key={item} className={range === item ? 'active' : ''} aria-pressed={range === item} onClick={() => setRange(item)}>{item}m</button>)}</div></header>
    <section className="hl-summary"><span><b>{data.length}</b> days shown</span><span><b>{work}</b> work units</span><span><b>{activeDays}</b> active days</span><p>All concepts use the same sample activity.</p></section>
    <section className="hl-concepts">
      <article className="hl-card accent-green"><ConceptHeader number="01" title="Week matrix" description="The familiar contribution grid, stripped down and allowed to stretch." strength="Best all-rounder"/><div className="hl-visual"><WeekMatrix data={data}/></div></article>
      <article className="hl-card accent-cyan"><ConceptHeader number="02" title="Momentum ribbon" description="Compress time into vertical beats. Height shows how much work landed." strength="Best for trends"/><div className="hl-visual"><MomentumRibbon data={data} range={range}/></div></article>
      <article className="hl-card accent-blue"><ConceptHeader number="03" title="Weekly rhythm" description="Seven lanes reveal which days of the week consistently carry the load." strength="Best for habits"/><div className="hl-visual"><RhythmLanes data={data}/></div></article>
      <article className="hl-card accent-violet"><ConceptHeader number="04" title="Work pulse" description="A continuous signal emphasizes momentum, peaks, and quiet valleys." strength="Best for flow"/><div className="hl-visual"><PulseWave data={data} range={range}/></div></article>
      <article className="hl-card accent-amber"><ConceptHeader number="05" title="Activity orbit" description="Each ring is a month; completion wraps around a shared center." strength="Most expressive"/><div className="hl-visual"><ActivityOrbit data={data} range={range}/></div></article>
      <article className="hl-card accent-pink"><ConceptHeader number="06" title="Work constellation" description="Only active days appear, keeping sparse histories airy and honest." strength="Best for sparse data"/><div className="hl-visual"><WorkConstellation data={data} range={range}/></div></article>
    </section>
  </main>;
}
