// export default function PersianCalendar({ empetyDates, setappointment, startJYear, startJMonth, value = [], presetDates = [], events = {}, onSelect = null }) {
//   // compute today using system date -> jalaali

//   useEffect(() => {
//     setSelectedDates([])
//   }, [empetyDates])
import { useState, useMemo, useEffect } from 'react';
import { toJalaali, toGregorian, jalaaliMonthLength } from 'jalaali-js';

export default function ShamsiCalendar({ empetyDates, setappointment, startJYear, startJMonth, value = [], presetDates = [], events = {}, onChange = null }) {
  useEffect(() => {
    setSelectedDates([])
  }, [empetyDates])
  const today = useMemo(() => {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return { jy: j.jy, jm: j.jm, jd: j.jd };
  }, []);

  const [visibleYear, setVisibleYear] = useState(startJYear ?? today.jy);
  const [visibleMonth, setVisibleMonth] = useState(startJMonth ?? today.jm);
  const [selectedDates, setSelectedDates] = useState(() => Array.isArray(value) ? value : []);

  useEffect(() => {
    if (Array.isArray(value)) setSelectedDates(value);
  }, [value]);

  const formatKey = (jy, jm, jd) => `${String(jy).padStart(4, '0')}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
  const isPresetKey = (key) => presetDates.some(p => p.date === key);
  const isSelectedKey = (key) => selectedDates.some(s => s.date === key);

  function goMonth(delta) {
    let m = visibleMonth + delta;
    let y = visibleYear;
    while (m > 12) { m -= 12; y += 1; }
    while (m < 1) { m += 12; y -= 1; }
    setVisibleMonth(m);
    setVisibleYear(y);
  }

  function toggleDate(jy, jm, jd) {
    const key = formatKey(jy, jm, jd);
    const isPast = (jy < today.jy) || (jy === today.jy && jm < today.jm) || (jy === today.jy && jm === today.jm && jd < today.jd);
    if (isPast) return;
    if (isPresetKey(key)) return;

    setSelectedDates(prev => {
      const exists = prev.find(x => x.date === key);
      if (exists) {
        const next = prev.filter(x => x.date !== key);
        if (typeof onChange === 'function') onChange(next);
        return next;
      }
      if (prev.length >= 30) return prev;
      const next = [...prev, { date: key, hours: [] }];
      if (typeof onChange === 'function') onChange(next);
      return next;
    });
    setappointment(prev => {
      const exists = prev.find(x => x.date === key);
      if (exists) {
        const next = prev.filter(x => x.date !== key);
        if (typeof onChange === 'function') onChange(next);
        return next;
      }
      if (prev.length >= 30) return prev;
      const next = [...prev, { date: key, hours: [] }];
      if (typeof onChange === 'function') onChange(next);
      return next;
    });
  }

  function buildMonthGrid(jy, jm) {
    const g = toGregorian(jy, jm, 1);
    const gDate = new Date(g.gy, g.gm - 1, g.gd);
    const jsWeekday = gDate.getDay();
    const startWeekday = (jsWeekday + 1) % 7;

    const dim = jalaaliMonthLength(jy, jm);
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= dim; ++d) cells.push({ jy, jm, jd: d });
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  const weeks = useMemo(() => buildMonthGrid(visibleYear, visibleMonth), [visibleYear, visibleMonth, selectedDates, presetDates]);

  const weekdayLabels = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500">{visibleYear} — {monthNames[visibleMonth - 1]}</div>
          <div className="text-2xl font-semibold">{monthNames[visibleMonth - 1]} {visibleYear}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => goMonth(-12)} className="px-3 py-1 rounded-md hover:bg-gray-100">« سال</button>
          <button onClick={() => goMonth(-1)} className="px-3 py-1 rounded-md hover:bg-gray-100">‹ ماه</button>
          <button onClick={() => { const g = new Date(); const j = toJalaali(g.getFullYear(), g.getMonth() + 1, g.getDate()); setVisibleYear(j.jy); setVisibleMonth(j.jm); }} className="px-3 py-1 rounded-md bg-gray-100">امروز</button>
          <button onClick={() => goMonth(1)} className="px-3 py-1 rounded-md hover:bg-gray-100">ماه ›</button>
          <button onClick={() => goMonth(12)} className="px-3 py-1 rounded-md hover:bg-gray-100">سال »</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-2">
        {weekdayLabels.map((w, i) => (<div key={i} className="py-1">{w}</div>))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((cell, ci) => {
              if (!cell) return <div key={ci} className="h-14 rounded-md bg-gray-50" />;
              const { jy, jm, jd } = cell;
              const key = formatKey(jy, jm, jd);
              const isToday = (jy === today.jy && jm === today.jm && jd === today.jd);
              const isPast = (jy < today.jy) || (jy === today.jy && jm < today.jm) || (jy === today.jy && jm === today.jm && jd < today.jd);
              const isSelected = isSelectedKey(key);
              const isPreset = isPresetKey(key);
              const ev = events[key];

              const base = 'relative h-14 rounded-lg focus:outline-none flex items-center justify-center';
              const disabledCls = 'opacity-40 cursor-not-allowed bg-transparent';
              const selectedCls = 'ring-2 ring-offset-1 ring-indigo-300 bg-indigo-50';
              const presetCls = 'bg-blue-200 border border-blue-400 opacity-90';
              const todayCls = 'border-2 border-emerald-400 bg-emerald-50 font-semibold';
              const numberCls = 'w-8 h-8 flex items-center justify-center rounded'; // smaller square, centered

              return (
                <button
                  key={ci}
                  onClick={() => toggleDate(jy, jm, jd)}
                  disabled={isPast || isPreset}
                  className={`${base} ${isPast ? disabledCls : 'hover:bg-gray-50'} ${isSelected ? selectedCls : ''} ${isPreset ? presetCls : ''} ${isToday ? todayCls : ''}`}
                >
                  <div className={numberCls}>{jd}</div>
                  {isPreset && <div className="absolute bottom-1 text-[10px] px-1 rounded bg-blue-600 text-white">رزرو شده</div>}
                  {ev && !isPreset && <div className="absolute bottom-1 text-xs px-1 rounded text-white" style={{ background: ev.color || '#f97316' }}>{ev.title}</div>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 border rounded-lg bg-gray-50">
        <div className="text-sm text-gray-600">تعداد انتخاب شده: <span className="font-medium">{selectedDates.filter(d => !presetDates.some(p => p.date === d.date)).length}</span></div>
        {(selectedDates.filter(d => !presetDates.some(p => p.date === d.date)).length > 0 || presetDates.length > 0) && (
          <div className="mt-2 text-sm">
            {selectedDates.filter(d => !presetDates.some(p => p.date === d.date)).map(d => (<div key={d.date} className="inline-block mr-2 px-2 py-1 bg-green-200 border border-green-500  rounded shadow-sm">{d.date}</div>))}
            {presetDates.map(d => (<div key={"preset-" + d.date} className="inline-block mr-2 px-2 py-1 bg-blue-200 border border-blue-500 rounded shadow-sm">{d.date} </div>))}
          </div>
        )}
      </div>
    </div>
  );
}