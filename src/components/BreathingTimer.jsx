import React, { useEffect, useRef, useState } from 'react';
import { Info, Mic, MicOff, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { PHASE_THEME } from '../data/techniques';
import { playChime } from '../utils/audio';

export default function BreathingTimer({
  currentPhase,
  currentPhaseMeta,
  phaseTimeRemaining,
  elapsedTimeSeconds,
  totalDurationSeconds,
  cyclesCompleted,
  isPaused,
  isCompleting,
  onPause,
  onResume,
  onStop,
  soundEnabled,
  setSoundEnabled,
  soundVolume,
  setSoundVolume,
  voiceEnabled,
  setVoiceEnabled,
  voiceVolume,
  setVoiceVolume,
  voiceGender,
  setVoiceGender,
  techniqueName,
  language = 'ko'
}) {
  const isEnglish = language === 'en';
  const [openAudioPanel, setOpenAudioPanel] = useState(null);
  const audioControlsRef = useRef(null);

  useEffect(() => {
    if (!openAudioPanel) return undefined;
    const closeOnOutsidePress = (event) => {
      if (!audioControlsRef.current?.contains(event.target)) setOpenAudioPanel(null);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [openAudioPanel]);
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const theme = PHASE_THEME[currentPhase] || PHASE_THEME.inhale;
  const duration = Math.max(0.5, currentPhaseMeta?.seconds || 1);
  const overallProgress = Math.min((elapsedTimeSeconds / totalDurationSeconds) * 100, 100);
  const isPreparing = currentPhase === 'prepareStart' || currentPhase === 'prepare';
  const phaseForwardCount = currentPhaseMeta?.seconds
    ? Math.min(
        currentPhaseMeta.seconds,
        Math.max(1, currentPhaseMeta.seconds - phaseTimeRemaining + 1)
      )
    : 1;
  const previewChimeAtCurrentVolume = (event) => {
    const previewVolume = Number(event.currentTarget.value ?? soundVolume);
    if (previewVolume > 0) playChime('inhale', true, previewVolume);
  };

  return (
    <div className={`fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-4 md:p-6 transition-all duration-1000 ease-in-out bg-gradient-to-b ${theme.colorClass}`}>
      <div className="w-full max-w-xl mx-auto flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
            {techniqueName}
          </span>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {isEnglish ? 'Breathing time' : '총 호흡 시간'}: {formatTime(elapsedTimeSeconds)} / {formatTime(totalDurationSeconds)}
          </h2>
        </div>

        <div ref={audioControlsRef} className="relative flex items-center space-x-2">
          <button
            onClick={() => setOpenAudioPanel((panel) => panel === 'sound' ? null : 'sound')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/60 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            title={soundEnabled ? (isEnglish ? 'Turn sounds off' : '호흡 소리 끄기') : (isEnglish ? 'Turn sounds on' : '호흡 소리 켜기')}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setOpenAudioPanel((panel) => panel === 'voice' ? null : 'voice')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/60 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            title={voiceEnabled ? (isEnglish ? 'Turn voice off' : '음성 안내 끄기') : (isEnglish ? 'Turn voice on' : '음성 안내 켜기')}
          >
            {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {openAudioPanel && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/20 bg-white/95 p-4 text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-200">
              {openAudioPanel === 'sound' ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{isEnglish ? 'Breathing sounds' : '호흡 소리'}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">{isEnglish ? 'Chimes and airflow' : '종소리와 바람 소리'}</p>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${soundEnabled ? 'bg-teal-400' : 'bg-slate-300 dark:bg-slate-700'}`}
                      aria-label={isEnglish ? 'Toggle breathing sounds' : '호흡 소리 켜기 또는 끄기'}
                    >
                      <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">{isEnglish ? 'Volume' : '소리 크기'}</span>
                    <span className="tabular-nums text-teal-600 dark:text-teal-300">{soundVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={soundVolume}
                    onInput={(event) => setSoundVolume(event.currentTarget.value)}
                    onPointerUp={previewChimeAtCurrentVolume}
                    onKeyUp={previewChimeAtCurrentVolume}
                    className="mt-2 h-1.5 w-full cursor-pointer accent-teal-500"
                    aria-label={isEnglish ? 'Breathing sound volume' : '호흡 소리 크기'}
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{isEnglish ? 'Voice guidance' : '음성 안내'}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">{isEnglish ? 'Opening and closing voice' : '시작과 완료 안내 음성'}</p>
                    </div>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${voiceEnabled ? 'bg-teal-400' : 'bg-slate-300 dark:bg-slate-700'}`}
                      aria-label={isEnglish ? 'Toggle voice guidance' : '음성 안내 켜기 또는 끄기'}
                    >
                      <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${voiceEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    {[
                      { value: 'female', label: isEnglish ? 'Female' : '여성' },
                      { value: 'male', label: isEnglish ? 'Male' : '남성' }
                    ].map((voice) => (
                      <button
                        key={voice.value}
                        onClick={() => setVoiceGender(voice.value)}
                        className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${voiceGender === voice.value ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}
                        aria-pressed={voiceGender === voice.value}
                      >
                        {voice.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">{isEnglish ? 'Voice volume' : '음성 크기'}</span>
                    <span className="tabular-nums text-teal-600 dark:text-teal-300">{voiceVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={voiceVolume}
                    onInput={(event) => setVoiceVolume(event.currentTarget.value)}
                    className="mt-2 h-1.5 w-full cursor-pointer accent-teal-500"
                    aria-label={isEnglish ? 'Voice guidance volume' : '음성 안내 크기'}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex flex-col items-center justify-center py-2 md:py-4">
        <div className="relative aspect-square w-[min(54vh,18rem)] min-w-56 flex items-center justify-center shrink-0">
          <div className={`breathing-wave-ring breathing-wave-ring-outer absolute inset-0 hidden rounded-full dark:block ${isPaused ? 'is-paused' : ''} ${isCompleting ? 'is-completing' : ''}`} />
          <div className={`breathing-wave-ring breathing-wave-ring-inner absolute inset-7 hidden rounded-full dark:block ${isPaused ? 'is-paused' : ''} ${isCompleting ? 'is-completing' : ''}`} />
          <div
            className={`breathing-core-motion absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full ${theme.glowColor} transition-all ease-in-out`}
            style={{
              transform: `translate(-50%, -50%) scale(${isCompleting ? theme.scale * 0.72 : theme.scale})`,
              opacity: isCompleting ? 0 : 1,
              transitionProperty: 'transform, opacity, background-color',
              transitionDuration: isCompleting ? '300ms' : `${duration}s`
            }}
          />
          <div
            className={`breathing-core-motion absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all ease-in-out select-none ${theme.circleColor}`}
            style={{
              transform: `translate(-50%, -50%) scale(${isCompleting ? theme.scale * 0.72 : theme.scale})`,
              opacity: isCompleting ? 0 : 1,
              transitionProperty: 'transform, opacity, background-color',
              transitionDuration: isCompleting ? '300ms' : `${duration}s`
            }}
          >
            <span className={`${isPreparing ? 'text-2xl tracking-tight' : 'text-6xl tracking-tighter tabular-nums'} font-bold drop-shadow-sm`}>
              {isPreparing ? (isEnglish ? 'Ready' : '준비') : phaseForwardCount}
            </span>
          </div>
        </div>

        <div className="text-center max-w-sm mt-7 md:mt-9 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-white transition-all duration-500">
            {currentPhaseMeta?.label || (isEnglish ? 'Ready' : '준비')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 min-h-10 px-4 leading-relaxed transition-all duration-500">
            {currentPhaseMeta?.instruction || (isEnglish ? 'Settle into a comfortable position.' : '편안한 자세로 호흡을 시작해요.')}
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-3 md:space-y-4 pb-4 md:pb-6">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">
            <span className="flex items-center"><Info className="w-3.5 h-3.5 mr-1" /> {isEnglish ? 'Progress' : '진행률'}</span>
            <span>{isEnglish ? 'Cycles' : '완료 사이클'} {cyclesCompleted}</span>
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
            title={isPaused ? (isEnglish ? 'Resume' : '계속하기') : (isEnglish ? 'Pause' : '일시 정지')}
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
            title={isEnglish ? 'Stop' : '종료'}
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        </div>

        {isPaused && (
          <div className="text-center text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {isEnglish ? 'Breathing is paused. Press play to continue.' : '호흡이 잠시 멈췄습니다. 재생 버튼을 누르면 이어서 진행됩니다.'}
          </div>
        )}
      </div>
    </div>
  );
}
