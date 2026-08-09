import React, { useMemo } from 'react';
import { BarChart2, Heart, Star, Trash2 } from 'lucide-react';

const USER_AVATAR_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60';

export default function HistorySection({
  sessions,
  totalSessionsCount,
  totalMindfulMinutes,
  onClearHistory,
  profileName,
  profileImage
}) {
  const formatDateString = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('ko-KR', {
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
    if (mins > 0) return rest > 0 ? `${mins}분 ${rest}초` : `${mins}분`;
    return `${seconds}초`;
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

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-6 space-y-5 animate-fade-in">
      <section className="rounded-lg border border-white/10 bg-slate-900/60 p-6 text-slate-100 shadow-sm dark:bg-slate-800/50">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-teal-300/40 bg-slate-800 shadow-[0_0_32px_rgba(45,212,191,0.14)]">
            <img src={profileImage || USER_AVATAR_URL} alt="호흡 수행자" className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl font-bold text-white">{profileName || '호흡수행자'}</h2>
                <span className="inline-flex items-center rounded-full bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  레벨 1
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                고요한 호흡으로 일상의 집중과 균형을 쌓고 있어요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-slate-950/30 px-4 py-3">
                <span className="block text-[10px] font-bold uppercase text-slate-500">총 세션</span>
                <span className="text-lg font-bold text-teal-300">{totalSessionsCount}회</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/30 px-4 py-3">
                <span className="block text-[10px] font-bold uppercase text-slate-500">총 시간</span>
                <span className="text-lg font-bold text-teal-300">{totalMindfulMinutes}분</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-slate-900/60 p-5 text-slate-100 shadow-sm dark:bg-slate-800/50">
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Session Rhythm Wave</span>
          <h3 className="mt-1 text-sm font-bold text-slate-300">최근 호흡 리듬 흐름</h3>
        </div>

        <div className="mt-5 flex h-28 items-end justify-between gap-2 px-2">
          {rhythmBars.map((value, index) => (
            <div key={index} className="flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-cyan-300 transition-all duration-1000"
                style={{ height: `${value}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold text-slate-500">
          <span>과거</span>
          <span className="inline-flex items-center gap-1 text-teal-300">
            <BarChart2 className="h-3.5 w-3.5" />
            리듬 흐름
          </span>
          <span>현재</span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-100">최근 호흡 기록</h3>
          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-rose-400 transition hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              전체 삭제
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 bg-slate-900/40 p-10 text-center">
            <Heart className="mx-auto mb-3 h-12 w-12 text-teal-300/25" />
            <p className="text-sm font-bold text-slate-300">아직 저장된 호흡 기록이 없습니다.</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              첫 호흡 세션을 완료하면 이곳에 기록이 쌓입니다.
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-4 transition hover:border-teal-300/25 hover:bg-slate-800/70"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-slate-100">{session.sessionName}</h4>
                    <span className="block truncate text-[11px] text-slate-500">
                      {formatDateString(session.startTimeMillis)} · {session.techniqueName || '호흡 세션'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-teal-300">{formatDuration(session.durationSeconds)}</span>
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    {session.cyclesCompleted}사이클
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
