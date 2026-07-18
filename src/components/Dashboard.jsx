import React from 'react';
import { Activity, Compass, Flame, Play, Sparkles, Trophy } from 'lucide-react';
import { TECHNIQUES, getDurationLabel } from '../data/techniques';

export { TECHNIQUES };

export default function Dashboard({
  streakDays,
  todayProgressSeconds,
  selectedTechniqueId,
  setSelectedTechniqueId,
  onStartSession,
  settings
}) {
  const currentTechnique = TECHNIQUES.find((tech) => tech.id === selectedTechniqueId) || TECHNIQUES[0];
  const targetSeconds = 1200;
  const progressPercent = Math.min((todayProgressSeconds / targetSeconds) * 100, 100);
  const minutesToday = Math.floor(todayProgressSeconds / 60);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-3 pt-4 md:pt-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white transition-all duration-300">
          호흡하고 편안해지기
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto">
          검증된 호흡 리듬을 따라 오늘의 긴장을 내려놓고 차분한 집중을 되찾아보세요.
        </p>
      </div>

      <div className="flex justify-center py-6">
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-teal-500/10 dark:bg-teal-400/10 animate-pulse-slow scale-110" />
          <div className="absolute w-[80%] h-[80%] rounded-full bg-teal-500/20 dark:bg-teal-400/15 animate-pulse-slow scale-100 delay-700" />
          <button
            onClick={onStartSession}
            className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 dark:from-teal-500 dark:to-teal-300 text-white flex flex-col items-center justify-center shadow-xl hover:shadow-teal-500/20 dark:hover:shadow-teal-400/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            <Play className="w-10 h-10 mb-2 fill-current text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-base font-bold tracking-wide">호흡 시작</span>
            <span className="text-[10px] opacity-80 mt-1 uppercase font-medium">
              {getDurationLabel(currentTechnique, settings)}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              연속 호흡 기록
            </h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">{streakDays}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">일 연속</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {streakDays > 0 ? '좋아요. 오늘의 리듬을 계속 이어가고 있어요.' : '첫 세션을 시작해 매일의 호흡 기록을 만들어보세요.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
            <Flame className={`w-8 h-8 ${streakDays > 0 ? 'text-orange-500 fill-orange-500 animate-bounce' : 'text-slate-400 dark:text-slate-600'}`} />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                오늘의 호흡 진행률
              </h3>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              오늘 완료: <strong className="text-slate-800 dark:text-white text-sm">{minutesToday}</strong> / 20분
            </span>
            <span className="text-slate-400 dark:text-slate-500 flex items-center">
              <Trophy className="w-3.5 h-3.5 mr-1 text-yellow-500" /> 일일 목표 20분
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">호흡법 선택</h2>
          <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHNIQUES.map((tech) => {
            const isSelected = selectedTechniqueId === tech.id;
            return (
              <div
                key={tech.id}
                onClick={() => setSelectedTechniqueId(tech.id)}
                className={`glass-panel p-5 rounded-2xl cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0 transition-all duration-300 border-2 flex flex-col justify-between h-full ${
                  isSelected
                    ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20 bg-teal-50/20 dark:bg-teal-950/10'
                    : 'border-transparent'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className={`font-bold text-sm md:text-base ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {tech.name}
                    </h3>
                    {isSelected && (
                      <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {tech.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <span className="flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1 text-teal-500" />
                    비율: {getDurationLabel(tech, settings)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {tech.custom ? '맞춤 조정' : '검증 패턴'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
