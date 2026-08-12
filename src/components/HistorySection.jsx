import React, { useMemo } from 'react';
import { BarChart2, Heart, Star, Trash2 } from 'lucide-react';

const USER_AVATAR_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60';
const LEVEL_THRESHOLDS = [0, 5, 15, 30, 50];

export default function HistorySection({
  sessions,
  totalSessionsCount,
  totalMindfulMinutes,
  onClearHistory,
  profileName,
  profileImage,
  language = 'ko'
}) {
  const isEnglish = language === 'en';
  const formatDateString = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'ko-KR', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (mins > 0) return isEnglish ? (rest > 0 ? `${mins}m ${rest}s` : `${mins} min`) : (rest > 0 ? `${mins}분 ${rest}초` : `${mins}분`);
    return isEnglish ? `${seconds} sec` : `${seconds}초`;
  };

  const rhythmBars = useMemo(() => {
    if (!sessions.length) return [30, 80, 45, 95, 55, 90, 35, 75, 50, 85];
    const recent = [...sessions].slice(0, 10).reverse();
    const durations = recent.map((session) => session.durationSeconds);
    const maxDuration = Math.max(...durations, 60);
    const mapped = durations.map((duration) => Math.round((duration / maxDuration) * 85) + 15);
    while (mapped.length < 10) mapped.unshift(20);
    return mapped;
  }, [sessions]);

  const currentLevelIndex = LEVEL_THRESHOLDS.reduce(
    (levelIndex, threshold, index) => (totalSessionsCount >= threshold ? index : levelIndex),
    0
  );
  const currentLevel = currentLevelIndex + 1;
  const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevelIndex + 1];
  const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevelIndex];
  const isMaxLevel = nextLevelThreshold === undefined;
  const levelProgress = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.round(
          ((totalSessionsCount - currentLevelThreshold) /
            (nextLevelThreshold - currentLevelThreshold)) *
            100
        )
      );
  const sessionsUntilNextLevel = isMaxLevel ? 0 : nextLevelThreshold - totalSessionsCount;

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-6 space-y-5 animate-fade-in">
      <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-6 py-2 text-[var(--text-title)] shadow-[0_4px_14px_rgba(30,70,90,0.08)] dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100 dark:shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border border-teal-300/40 bg-slate-800 shadow-[0_0_32px_rgba(45,212,191,0.14)]">
            <img src={profileImage || USER_AVATAR_URL} alt={isEnglish ? 'Breathing practitioner' : '호흡 수행자'} className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl font-bold text-[var(--text-title)] dark:text-white">{profileName && profileName !== '호흡수행자' ? profileName : (isEnglish ? 'Friend' : '호흡수행자')}</h2>
                <span className="inline-flex items-center rounded-full border border-[#FFD5AF] bg-[#FFF4E8] px-2 py-0.5 text-[10px] font-bold text-[#F28C45] dark:border-0 dark:bg-amber-300/10 dark:text-amber-300">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  {isEnglish ? 'Level' : '레벨'} {currentLevel}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-slate-400">
                {isEnglish ? 'Building everyday focus and balance through calm breathing.' : '고요한 호흡으로 일상의 집중과 균형을 쌓고 있어요.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--app-bg)] px-4 py-3 dark:border-white/10 dark:bg-slate-950/30">
                <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)] dark:text-slate-500">{isEnglish ? 'Total sessions' : '총 세션'}</span>
                <span className="text-lg font-bold text-[var(--accent-strong)] dark:text-teal-300">{totalSessionsCount}{isEnglish ? '' : '회'}</span>
              </div>
              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--app-bg)] px-4 py-3 dark:border-white/10 dark:bg-slate-950/30">
                <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)] dark:text-slate-500">{isEnglish ? 'Total time' : '총 시간'}</span>
                <span className="text-lg font-bold text-[var(--accent-strong)] dark:text-teal-300">{totalMindfulMinutes}{isEnglish ? ' min' : '분'}</span>
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <span className="text-[#527189] dark:text-slate-400">{isEnglish ? 'Level progress' : '레벨 진행'}</span>
                <span className="text-[#0E9F90] dark:text-teal-300">
                  {isMaxLevel ? (isEnglish ? 'Top level' : '최고 레벨') : (isEnglish ? `${sessionsUntilNextLevel} to next level` : `다음 레벨까지 ${sessionsUntilNextLevel}회`)}
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-[#DFE9EE] dark:bg-slate-700"
                role="progressbar"
                aria-label={isEnglish ? `Level ${currentLevel} progress` : `레벨 ${currentLevel} 진행률`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={levelProgress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#58DCE0] to-[#20BFAE] transition-[width] duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] p-5 text-[var(--text-title)] shadow-[0_4px_14px_rgba(30,70,90,0.08)] dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100 dark:shadow-sm">
        <div className="text-center">
          <h3 className="text-sm font-bold text-[#172F47] dark:text-slate-300">{isEnglish ? 'Recent Breathing Duration' : '최근 호흡 시간'}</h3>
        </div>

        <div className="mt-5 flex h-28 items-end justify-between gap-2 px-2">
          {rhythmBars.map((value, index) => (
            <div key={index} className="flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-b from-[#58DCE0] to-[#20BFAE] transition-all duration-1000 dark:bg-gradient-to-t dark:from-teal-500 dark:to-cyan-300"
                style={{ height: `${value}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#DCE8EC] pt-3 text-[10px] font-bold text-[#7890A3] dark:border-white/10 dark:text-slate-500">
          <span>{isEnglish ? 'Past' : '과거'}</span>
          <span className="inline-flex items-center gap-1 text-[#0E9F90] dark:text-teal-300">
            <BarChart2 className="h-3.5 w-3.5" />
            {isEnglish ? 'Session Duration' : '세션 시간'}
          </span>
          <span>{isEnglish ? 'Now' : '현재'}</span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-[#172F47] dark:text-slate-100">{isEnglish ? 'Recent breathing history' : '최근 호흡 기록'}</h3>
          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-rose-400 transition hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              {isEnglish ? 'Delete all' : '전체 삭제'}
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--surface-border)] bg-[var(--surface-card)] p-10 text-center shadow-[0_4px_14px_rgba(30,70,90,0.08)] dark:border-white/10 dark:bg-slate-900/40 dark:shadow-none">
            <Heart className="mx-auto mb-3 h-12 w-12 text-[#35CDBB] dark:text-teal-300/25" />
            <p className="text-sm font-semibold text-[#36566D] dark:font-bold dark:text-slate-300">{isEnglish ? 'No breathing records saved yet.' : '아직 저장된 호흡 기록이 없습니다.'}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#7890A3] dark:text-slate-500">
              {isEnglish ? 'Complete your first session and it will appear here.' : '첫 호흡 세션을 완료하면 이곳에 기록이 쌓입니다.'}
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] p-4 shadow-[0_4px_14px_rgba(30,70,90,0.08)] transition hover:border-[#35CDBB] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-teal-300/25 dark:hover:bg-slate-800/70"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-[#172F47] dark:text-slate-100">{session.sessionName}</h4>
                    <span className="block truncate text-[11px] text-[#7890A3] dark:text-slate-500">
                      {formatDateString(session.startTimeMillis)} · {session.techniqueName || (isEnglish ? 'Breathing session' : '호흡 세션')}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-[#0E9F90] dark:text-teal-300">{formatDuration(session.durationSeconds)}</span>
                  <span className="block text-[10px] font-bold uppercase text-[#7890A3] dark:text-slate-500">
                    {session.cyclesCompleted}{isEnglish ? ' cycles' : '사이클'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
