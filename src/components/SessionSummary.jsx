import React, { useEffect, useState } from 'react';
import { Calendar, Clock, RotateCcw, Save, Sparkles, Trash2 } from 'lucide-react';
import { determineSessionNameByTime } from '../utils/db';

export default function SessionSummary({
  elapsedTimeSeconds,
  cyclesCompleted,
  techniqueName,
  sessionRhythm,
  onSave,
  onDiscard
}) {
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    setSessionName(determineSessionNameByTime(Date.now()));
  }, []);

  const formatDurationLabel = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins > 0) return `${mins}분${secs > 0 ? ` ${secs}초` : ''}`;
    return `${secs}초`;
  };

  const formatChartTime = (totalSec) => {
    const safeSeconds = Math.max(0, Math.floor(totalSec || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const getRenderRhythm = () => {
    if (sessionRhythm?.length >= 5) return sessionRhythm;
    const pointsCount = Math.max(12, cyclesCompleted * 3);
    return Array.from({ length: pointsCount }, (_, index) => {
      const value = Math.round(5 + 4 * Math.sin((index / (pointsCount / 3)) * 2 * Math.PI));
      return Math.max(3, value);
    });
  };

  const finalRhythm = getRenderRhythm();
  const maxRhythmVal = Math.max(...finalRhythm, 10);
  const chartWidth = 320;
  const chartBaseline = 96;
  const rhythmPoints = finalRhythm.map((value, index) => ({
    x: (index / Math.max(finalRhythm.length - 1, 1)) * chartWidth,
    y: chartBaseline - (value / maxRhythmVal) * 68
  }));
  const rhythmLinePath = rhythmPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = rhythmPoints[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  const rhythmAreaPath = rhythmPoints.length
    ? `${rhythmLinePath} L ${rhythmPoints[rhythmPoints.length - 1].x} ${chartBaseline} L ${rhythmPoints[0].x} ${chartBaseline} Z`
    : '';

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-8 space-y-6 animate-fade-in">
      <section className="rounded-lg border border-white/10 bg-slate-900/60 p-7 text-center text-slate-100 shadow-sm dark:bg-slate-800/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10 text-teal-300 shadow-[0_0_32px_rgba(45,212,191,0.14)]">
          <Sparkles className="h-8 w-8 fill-current" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
          호흡을 완료했습니다
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
          방금 만든 고요함을 기록으로 남겨 다음 루틴에 이어갈 수 있어요.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-center text-slate-100">
          <Clock className="mx-auto mb-2 h-5 w-5 text-teal-300" />
          <span className="text-[10px] font-bold uppercase text-slate-500">호흡 시간</span>
          <span className="mt-1 block text-lg font-bold text-white">{formatDurationLabel(elapsedTimeSeconds)}</span>
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-center text-slate-100">
          <RotateCcw className="mx-auto mb-2 h-5 w-5 text-teal-300" />
          <span className="text-[10px] font-bold uppercase text-slate-500">완료 사이클</span>
          <span className="mt-1 block text-lg font-bold text-white">{cyclesCompleted}사이클</span>
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-center text-slate-100">
          <Calendar className="mx-auto mb-2 h-5 w-5 text-teal-300" />
          <span className="text-[10px] font-bold uppercase text-slate-500">호흡법</span>
          <span className="mt-1 block truncate text-sm font-bold text-white">{techniqueName}</span>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-slate-100">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
          실시간 호흡 리듬
        </h3>

        <div className="mt-4 h-28 px-2">
          <svg
            className="h-full w-full overflow-visible"
            viewBox={`0 0 ${chartWidth} 104`}
            role="img"
            aria-label="세션 동안의 호흡 리듬 변화"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="rhythm-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
              <linearGradient id="rhythm-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1={chartBaseline} x2={chartWidth} y2={chartBaseline} stroke="currentColor" strokeOpacity="0.12" />
            <path d={rhythmAreaPath} fill="url(#rhythm-area)" />
            <path
              d={rhythmLinePath}
              fill="none"
              stroke="url(#rhythm-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="mt-3 flex justify-between px-1 text-[10px] font-bold text-slate-500">
          <span>{formatChartTime(0)}</span>
          <span>{formatChartTime(elapsedTimeSeconds / 2)}</span>
          <span>{formatChartTime(elapsedTimeSeconds)}</span>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-slate-100">
        <label htmlFor="session-name" className="text-xs font-bold uppercase tracking-widest text-slate-500">
          세션 이름
        </label>
        <p className="mt-1 text-[11px] text-slate-500">
          기록 화면에서 알아보기 쉬운 이름으로 저장하세요.
        </p>
        <input
          type="text"
          id="session-name"
          value={sessionName}
          onChange={(event) => setSessionName(event.target.value)}
          maxLength={30}
          className="mt-4 w-full rounded-lg border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-bold text-slate-100 outline-none transition focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20"
          placeholder="세션 이름을 입력하세요"
        />
      </section>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          onClick={onDiscard}
          className="rounded-lg border border-rose-400/25 px-4 py-3.5 font-bold text-rose-300 transition hover:bg-rose-500/10 active:scale-95 sm:w-1/3"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Trash2 className="h-5 w-5" />
            기록하지 않기
          </span>
        </button>

        <button
          onClick={() => onSave(sessionName)}
          disabled={!sessionName.trim()}
          className="flex-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-300 px-4 py-3.5 font-bold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.14)] transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Save className="h-5 w-5" />
            호흡 기록 저장
          </span>
        </button>
      </div>
    </div>
  );
}
