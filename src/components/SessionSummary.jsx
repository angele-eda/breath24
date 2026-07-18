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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 mb-2">
          <Sparkles className="w-8 h-8 fill-current text-teal-500 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          호흡을 완료했습니다
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          방금 만든 고요함을 기록으로 남겨 다음 루틴에 이어갈 수 있어요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
          <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">호흡 시간</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">{formatDurationLabel(elapsedTimeSeconds)}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
          <RotateCcw className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2 animate-spin-slow" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">완료 사이클</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">{cyclesCompleted}사이클</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
          <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">호흡법</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">{techniqueName}</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase text-center">
          실시간 호흡 리듬
        </h3>

        <div className="h-28 flex items-end justify-between px-2 gap-1.5 pt-4">
          {finalRhythm.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-md bg-gradient-to-t from-teal-500/80 to-teal-400 transition-all duration-700 ease-out"
              style={{ height: `${(value / maxRhythmVal) * 100}%` }}
              title={`리듬 강도: ${value}`}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
          <span>시작</span>
          <span>리듬 흐름</span>
          <span>종료</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <label htmlFor="session-name" className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            세션 이름
          </label>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            기록 화면에서 알아보기 쉬운 이름으로 저장하세요.
          </p>
        </div>

        <input
          type="text"
          id="session-name"
          value={sessionName}
          onChange={(event) => setSessionName(event.target.value)}
          maxLength={30}
          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-300 font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400"
          placeholder="세션 이름을 입력하세요"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onDiscard}
          className="sm:order-1 sm:w-1/3 py-3.5 rounded-xl border border-rose-200 dark:border-rose-950/40 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all font-semibold flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
          <span>기록하지 않기</span>
        </button>

        <button
          onClick={() => onSave(sessionName)}
          disabled={!sessionName.trim()}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-500 dark:to-teal-400 text-white hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:shadow-teal-500/10"
        >
          <Save className="w-5 h-5" />
          <span>호흡 기록 저장</span>
        </button>
      </div>
    </div>
  );
}
