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
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="glass-panel rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-teal-50 flex-shrink-0">
            <img src={profileImage || USER_AVATAR_URL} alt="호흡 수행자" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{profileName || '호흡수행자'}</h2>
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
                  <Star className="w-3 h-3 fill-current mr-0.5" /> 레벨 1
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                고요한 호흡을 통해 일상의 집중과 균형을 쌓고 있어요.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-center min-w-[100px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">총 세션</span>
                <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">{totalSessionsCount}회</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-center min-w-[100px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">총 시간</span>
                <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">{totalMindfulMinutes}분</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-5">
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">SESSION RHYTHM WAVE</span>
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">최근 호흡 리듬 흐름</h3>
        </div>

        <div className="h-28 flex items-end justify-between px-3 gap-2.5">
          {rhythmBars.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-teal-400 transition-all duration-1000 ease-out"
                style={{ height: `${value}%` }}
              />
              <span className="absolute -top-6 hidden group-hover:block bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded px-1 py-0.5 z-10">
                {value}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800/40 pt-2">
          <span>과거</span>
          <span className="flex items-center"><BarChart2 className="w-3.5 h-3.5 mr-0.5 text-teal-500" /> 리듬 흐름</span>
          <span>현재</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">최근 호흡 기록</h3>
          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-500 dark:text-rose-400 font-semibold flex items-center hover:opacity-85 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              전체 삭제
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center border-dashed border-slate-300 dark:border-slate-700">
            <Heart className="w-12 h-12 text-teal-500/20 dark:text-teal-400/10 mb-3 animate-pulse" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">아직 저장된 호흡 기록이 없습니다.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
              첫 호흡 세션을 완료하면 이곳에 기록이 쌓입니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="glass-panel p-4 rounded-xl flex items-center justify-between border border-slate-200/40 dark:border-slate-700/40 transition-all hover:bg-white dark:hover:bg-slate-800/80"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-10 bg-teal-500 dark:bg-teal-400 rounded-full flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200">{session.sessionName}</h4>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDateString(session.startTimeMillis)} · {session.techniqueName || '호흡 세션'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm md:text-base font-extrabold text-teal-600 dark:text-teal-400">
                    {formatDuration(session.durationSeconds)}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                    {session.cyclesCompleted}사이클
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
