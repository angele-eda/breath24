import React from 'react';
import { Info, Mic, MicOff, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { PHASE_THEME } from '../data/techniques';

export default function BreathingTimer({
  currentPhase,
  currentPhaseMeta,
  phaseTimeRemaining,
  elapsedTimeSeconds,
  totalDurationSeconds,
  cyclesCompleted,
  isPaused,
  onPause,
  onResume,
  onStop,
  soundEnabled,
  setSoundEnabled,
  voiceEnabled,
  setVoiceEnabled,
  techniqueName
}) {
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const theme = PHASE_THEME[currentPhase] || PHASE_THEME.inhale;
  const duration = Math.max(0.5, currentPhaseMeta?.seconds || 1);
  const overallProgress = Math.min((elapsedTimeSeconds / totalDurationSeconds) * 100, 100);

  return (
    <div className={`fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-4 md:p-6 transition-all duration-1000 ease-in-out bg-gradient-to-b ${theme.colorClass}`}>
      <div className="w-full max-w-xl mx-auto flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
            {techniqueName}
          </span>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            총 호흡 시간: {formatTime(elapsedTimeSeconds)} / {formatTime(totalDurationSeconds)}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/60 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            title={soundEnabled ? '종소리 끄기' : '종소리 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/60 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            title={voiceEnabled ? '음성 안내 끄기' : '음성 안내 켜기'}
          >
            {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex flex-col items-center justify-center py-2 md:py-4">
        <div className="relative aspect-square w-[min(54vh,18rem)] min-w-56 flex items-center justify-center shrink-0">
          <div
            className={`absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full ${theme.glowColor} transition-all ease-in-out`}
            style={{
              transform: `translate(-50%, -50%) scale(${theme.scale})`,
              transitionProperty: 'transform, background-color',
              transitionDuration: `${duration}s`
            }}
          />
          <div
            className={`absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all ease-in-out select-none ${theme.circleColor}`}
            style={{
              transform: `translate(-50%, -50%) scale(${theme.scale})`,
              transitionProperty: 'transform, background-color',
              transitionDuration: `${duration}s`
            }}
          >
            <span className="text-6xl font-bold tracking-tighter tabular-nums drop-shadow-sm">
              {phaseTimeRemaining}
            </span>
          </div>
        </div>

        <div className="text-center max-w-sm mt-4 md:mt-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-white transition-all duration-500">
            {currentPhaseMeta?.label || '준비'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 min-h-10 px-4 leading-relaxed transition-all duration-500">
            {currentPhaseMeta?.instruction || '편안한 자세로 호흡을 시작해요.'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-3 md:space-y-4 pb-4 md:pb-6">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">
            <span className="flex items-center"><Info className="w-3.5 h-3.5 mr-1" /> 진행률</span>
            <span>완료 사이클 {cyclesCompleted}</span>
          </div>
          <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-800/30 backdrop-blur-md rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={isPaused ? onResume : onPause}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-md backdrop-blur-md border active:scale-95 transition-all cursor-pointer ${
              isPaused
                ? 'bg-teal-600 dark:bg-teal-500 hover:bg-teal-500 dark:hover:bg-teal-400 text-white border-teal-500/40'
                : 'bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-100 border-white/20 dark:border-slate-700/20'
            }`}
            title={isPaused ? '계속하기' : '일시 정지'}
          >
            {isPaused ? (
              <Play className="w-6 h-6 fill-current text-white" />
            ) : (
              <Pause className="w-6 h-6 fill-current" />
            )}
          </button>

          <button
            onClick={onStop}
            className="w-12 h-12 rounded-full bg-rose-500/20 dark:bg-rose-500/10 hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30 active:scale-95 transition-all cursor-pointer"
            title="종료"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        </div>

        {isPaused && (
          <div className="text-center text-xs text-amber-600 dark:text-amber-400 font-semibold">
            호흡이 잠시 멈췄습니다. 재생 버튼을 누르면 이어서 진행됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
