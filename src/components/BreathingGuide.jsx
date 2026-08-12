import React from 'react';
import { ArrowRight, Clock3, Pause, Sparkles, Sprout, Volume2, Wind } from 'lucide-react';

const BASE_GUIDE_STEPS = [
  {
    seconds: 4,
    koTitle: '천천히 들이마시기',
    enTitle: 'Breathe in slowly',
    koDescription: '배가 편안하게 부풀도록 코로 들이마셔요.',
    enDescription: 'Breathe in through your nose and let your belly expand.',
    icon: Wind,
    color: 'text-teal-600 dark:text-teal-300',
    surface: 'bg-teal-50 dark:bg-teal-400/10'
  },
  {
    seconds: 2,
    koTitle: '가볍게 멈추기',
    enTitle: 'Hold gently',
    koDescription: '어깨에 힘을 주지 않고 잠시 머물러요.',
    enDescription: 'Pause briefly without tightening your shoulders.',
    icon: Pause,
    color: 'text-amber-600 dark:text-amber-300',
    surface: 'bg-amber-50 dark:bg-amber-400/10'
  },
  {
    seconds: 6,
    koTitle: '길게 내쉬기',
    enTitle: 'Breathe out longer',
    koDescription: '배가 자연스럽게 내려가도록 천천히 내쉬어요.',
    enDescription: 'Exhale slowly and let your belly settle naturally.',
    icon: Wind,
    color: 'text-sky-600 dark:text-sky-300',
    surface: 'bg-sky-50 dark:bg-sky-400/10'
  }
];

export default function BreathingGuide({
  language = 'ko',
  restSeconds = 2,
  onRestSecondsChange,
  onStart,
  onOpenDurationSettings
}) {
  const isEnglish = language === 'en';
  const restStep = restSeconds > 0
    ? {
        seconds: restSeconds,
        koTitle: '편하게 쉬기',
        enTitle: 'Rest comfortably',
        koDescription: '숨을 참지 말고 다음 들숨을 편안히 기다려요.',
        enDescription: 'Do not hold; simply wait comfortably for the next inhale.',
        icon: Sparkles,
        color: 'text-indigo-600 dark:text-indigo-300',
        surface: 'bg-indigo-50 dark:bg-indigo-400/10'
      }
    : null;
  const guideSteps = restStep ? [...BASE_GUIDE_STEPS, restStep] : BASE_GUIDE_STEPS;
  const rhythmLabel = restSeconds > 0 ? `4 · 2 · 6 · ${restSeconds}` : '4 · 2 · 6';

  return (
    <div className="w-full px-5 py-7 animate-fade-in">
      <div className="rounded-3xl border border-[#DCE8EC] bg-white p-5 shadow-[0_8px_28px_rgba(30,70,90,0.08)] dark:border-white/10 dark:bg-slate-900/65 dark:shadow-none sm:p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF9F7] px-3 py-1.5 text-xs font-bold text-[#0E9F90] dark:bg-teal-400/10 dark:text-teal-300">
          <Sprout className="h-4 w-4" />
          {isEnglish ? 'Breathing guide' : '호흡 안내'}
        </div>

        <h1 className="mt-4 break-keep text-2xl font-bold leading-tight text-[#172F47] dark:text-white">
          {isEnglish
            ? `Start comfortably with ${rhythmLabel}`
            : `처음이라면 ${rhythmLabel}으로 편안하게 시작해요`}
        </h1>
        <p className="mt-2 break-keep text-sm font-medium leading-6 text-[#506A7D] dark:text-slate-300">
          {isEnglish
            ? 'Follow the circle for two minutes. There is no need to force or deepen your breath.'
            : '2분 동안 원의 움직임만 따라오세요. 숨을 억지로 깊게 쉬지 않아도 괜찮아요.'}
        </p>

        <div className="mt-5 space-y-2.5">
          {guideSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.koTitle} className="flex items-center gap-3 rounded-2xl border border-[#DCE8EC] bg-[#F7FBFC] p-3.5 dark:border-white/10 dark:bg-slate-950/30">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${step.surface} ${step.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-extrabold tabular-nums ${step.color}`}>{step.seconds}</span>
                    <h2 className="text-sm font-bold text-[#172F47] dark:text-slate-100">
                      {isEnglish ? step.enTitle : step.koTitle}
                    </h2>
                  </div>
                  <p className="mt-0.5 break-keep text-xs font-semibold leading-5 text-[#647D90] dark:text-slate-400">
                    {isEnglish ? step.enDescription : step.koDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#F2F8FA] p-3.5 text-[#506A7D] dark:bg-slate-800/60 dark:text-slate-300">
          <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0E9F90] dark:text-teal-300" />
          <p className="break-keep text-xs font-semibold leading-5">
            {isEnglish
              ? 'Gentle chimes mark each phase, while soft airflow helps you follow the rhythm.'
              : '단계마다 은은한 종소리가 나고, 부드러운 공기 소리가 호흡 리듬을 안내해요.'}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-[#DCE8EC] bg-[#F7FBFC] p-3.5 dark:border-white/10 dark:bg-slate-950/30">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#172F47] dark:text-slate-100">
                {isEnglish ? 'Rest after exhaling' : '날숨 뒤 편하게 쉬기'}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#7890A3] dark:text-slate-400">
                {isEnglish ? 'Choose what feels comfortable.' : '편안한 길이로 선택하세요.'}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl bg-[#EAF1F4] p-1 dark:bg-slate-800">
            {[0, 1, 2, 3].map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => onRestSecondsChange(seconds)}
                className={`rounded-lg px-1 py-2 text-xs font-bold transition ${
                  restSeconds === seconds
                    ? 'bg-white text-[#0E9F90] shadow-sm dark:bg-slate-700 dark:text-teal-300'
                    : 'text-[#647D90] hover:text-[#36566D] dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                aria-pressed={restSeconds === seconds}
              >
                {seconds === 0
                  ? (isEnglish ? 'None' : '없음')
                  : (isEnglish ? `${seconds}s` : `${seconds}초`)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#20BFAE] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/15 transition hover:bg-[#18AD9E] active:scale-[0.98]"
        >
          {isEnglish ? 'Start a 2-minute beginner breath' : '2분 초보 호흡 시작'}
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onOpenDurationSettings}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-[#527189] transition hover:bg-[#F2F8FA] hover:text-[#0E9F90] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-300"
        >
          <Clock3 className="h-4 w-4" />
          {isEnglish ? 'Set a different breathing time' : '호흡 시간 직접 설정'}
        </button>
      </div>
    </div>
  );
}
