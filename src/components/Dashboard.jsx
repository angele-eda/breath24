import React, { useRef, useState } from 'react';
import { Activity, ArrowRight, Box, Compass, Flame, Moon, MoveHorizontal, Sparkles, Trophy, Waves, Wind } from 'lucide-react';
import { TECHNIQUES, getDurationLabel } from '../data/techniques';
import { localizeTechnique } from '../i18n';

export { TECHNIQUES };

const ICON_BY_TECHNIQUE = {
  '4-2-6': Wind,
  '4-7-8': Moon,
  'box-breathing': Box,
  '4-4-6': Waves,
  '5-5-coherent': Activity,
  'belly-breathing': MoveHorizontal,
  'alternate-nostril': Compass,
  custom: Sparkles
};

const TAGS_BY_TECHNIQUE = {
  '4-2-6': ['안정', '회복'],
  '4-7-8': ['수면', '이완'],
  'box-breathing': ['집중', '균형'],
  '4-4-6': ['진정', '리셋'],
  '5-5-coherent': ['리듬', '균형'],
  'belly-breathing': ['횡격막', '이완'],
  'alternate-nostril': ['균형', '집중'],
  custom: ['맞춤', '설정']
};

export default function Dashboard({
  streakDays,
  todayProgressSeconds,
  selectedTechniqueId,
  setSelectedTechniqueId,
  onStartSession,
  onOpenLegal,
  settings,
  language = 'ko'
}) {
  const isEnglish = language === 'en';
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const [isCollapsingTechniques, setIsCollapsingTechniques] = useState(false);
  const techniqueListRef = useRef(null);
  const localizedTechniques = TECHNIQUES.map((technique) => localizeTechnique(technique, language));
  const currentTechnique = localizedTechniques.find((tech) => tech.id === selectedTechniqueId) || localizedTechniques[0];
  const targetSeconds = 1200;
  const progressPercent = Math.min((todayProgressSeconds / targetSeconds) * 100, 100);
  const minutesToday = Math.floor(todayProgressSeconds / 60);
  const CurrentIcon = ICON_BY_TECHNIQUE[currentTechnique.id] || Wind;
  const visibleTechniques = showAllTechniques
    ? localizedTechniques
    : [currentTechnique];
  const durationLabel = (technique) => {
    if (!isEnglish) return getDurationLabel(technique, settings);
    return `${technique.phases.map((phase) => phase.seconds).join(' - ')} sec`;
  };
  const startCircleRhythm = currentTechnique.rhythm?.replaceAll('-', ' · ');
  const handleToggleTechniques = () => {
    if (showAllTechniques) {
      setShowAllTechniques(false);
      return;
    }

    setShowAllTechniques(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const listTop = techniqueListRef.current?.getBoundingClientRect().top ?? 0;
        const targetTop = window.scrollY + listTop - 150;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      });
    });
  };
  const handleTechniqueSelect = (techniqueId) => {
    setSelectedTechniqueId(techniqueId);
    if (!showAllTechniques) return;

    const collapseDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
    setIsCollapsingTechniques(true);
    window.setTimeout(() => {
      setShowAllTechniques(false);
      setIsCollapsingTechniques(false);
    }, collapseDuration);
  };

  return (
    <div className="home-dashboard mx-auto w-full max-w-[480px] px-5 py-5 animate-fade-in">
      <section className="home-focus-zone flex flex-col items-center justify-center">
        <div className="relative flex h-72 w-72 items-center justify-center">
          <div className="home-wave-ring-outer absolute inset-0 rounded-full border border-teal-300/15" />
          <div className="home-wave-ring-inner absolute inset-7 rounded-full border border-teal-300/20" />
          <div className="absolute inset-14 rounded-full bg-teal-300/10 dark:bg-teal-300/10 backdrop-blur-sm" />
          <button
            onClick={onStartSession}
            className="group relative flex h-40 w-40 flex-col items-center justify-center rounded-full border border-white/15 bg-[#24C9B5] text-white shadow-[0_0_48px_rgba(36,201,181,0.18)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_64px_rgba(36,201,181,0.25)] active:scale-95 dark:bg-gradient-to-tr dark:from-teal-500 dark:to-teal-300"
            aria-label={`${currentTechnique.name} ${isEnglish ? 'start breathing' : '호흡 시작'}`}
          >
            <CurrentIcon className="mb-2 h-9 w-9 text-white drop-shadow-sm transition-transform duration-300 group-hover:rotate-6" />
            <span className="text-base font-semibold drop-shadow-sm">{isEnglish ? 'Start breathing' : '호흡 시작'}</span>
            <span className="mt-1 text-[11px] font-medium text-white/85">
              {startCircleRhythm}
            </span>
          </button>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] p-4 text-[var(--text-title)] shadow-sm dark:border-[#334A5F] dark:bg-slate-800/50 dark:text-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-medium text-[#172F47] dark:text-[#F2F7FA]">{isEnglish ? 'Breathing streak' : '연속 호흡 기록'}</h3>
            <Flame className={`h-5 w-5 ${streakDays > 0 ? 'fill-amber-400 text-amber-400' : 'text-[#647D90] dark:text-slate-500'}`} />
          </div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-[#24C9B5] dark:text-teal-300">{streakDays}</span>
            <span className="pb-1 text-xs font-medium text-[#506A7D] dark:font-semibold dark:text-[#C4D1DB]">{isEnglish ? 'day streak' : '일 연속'}</span>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] p-4 text-[var(--text-title)] shadow-sm dark:border-[#334A5F] dark:bg-slate-800/50 dark:text-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-medium text-[#172F47] dark:text-[#F2F7FA]">{isEnglish ? "Today's progress" : '오늘 진행률'}</h3>
            <span className="text-xs font-bold text-[#24C9B5] dark:text-teal-300">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#DFE9EE] dark:bg-slate-700/70">
            <div
              className="h-full rounded-full bg-[#24C9B5] transition-all duration-1000 dark:bg-gradient-to-r dark:from-teal-400 dark:to-cyan-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#506A7D] dark:font-semibold dark:text-[#C4D1DB]">
            <span>{minutesToday} / {isEnglish ? '20 min' : '20분'}</span>
            <span className="inline-flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              {isEnglish ? 'Goal' : '목표'}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-medium text-[#506A7D] dark:font-medium dark:text-[#C4D1DB]">{isEnglish ? "Choose today's rhythm." : '오늘의 리듬을 선택하세요.'}</p>
          <button
            type="button"
            onClick={handleToggleTechniques}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold text-teal-600 transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40 dark:text-teal-300 dark:hover:text-teal-200"
            aria-expanded={showAllTechniques}
            aria-controls="breathing-technique-list"
          >
            {showAllTechniques ? (isEnglish ? 'Collapse' : '접기') : (isEnglish ? 'View all' : '전체 보기')}
            <ArrowRight className={`h-3.5 w-3.5 transition-transform ${showAllTechniques ? '-rotate-90' : ''}`} />
          </button>
        </div>

        <div
          ref={techniqueListRef}
          id="breathing-technique-list"
          style={{ overflowAnchor: 'none' }}
          className={`grid grid-cols-1 transition-[gap] duration-[450ms] ease-in-out motion-reduce:transition-none ${
            isCollapsingTechniques ? 'pointer-events-none gap-0' : 'gap-3'
          }`}
        >
          {visibleTechniques.map((tech) => {
            const isSelected = selectedTechniqueId === tech.id;
            const TechniqueIcon = ICON_BY_TECHNIQUE[tech.id] || Wind;
            const tags = isEnglish ? tech.tags : (TAGS_BY_TECHNIQUE[tech.id] || ['호흡']);
            const isSlidingClosed = isCollapsingTechniques && !isSelected;

            return (
              <div
                key={tech.id}
                className={`grid transition-[grid-template-rows,opacity] duration-[450ms] ease-in-out motion-reduce:transition-none ${
                  isSlidingClosed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <button
                    data-technique-card
                    onClick={() => handleTechniqueSelect(tech.id)}
                    className={`group relative w-full overflow-hidden rounded-lg border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                      isSelected
                        ? 'border-[#35CDBB] bg-[#EAF9F7] shadow-[0_0_24px_rgba(36,201,181,0.12)] dark:border-teal-300/70 dark:bg-teal-300/10 dark:shadow-[0_0_24px_rgba(45,212,191,0.12)]'
                        : 'border-[var(--surface-border)] bg-[var(--surface-card)] hover:border-[#35CDBB] hover:bg-[#F7FCFC] dark:border-[#334A5F] dark:bg-slate-800/45 dark:hover:border-teal-300/45 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className={`text-lg font-bold ${isSelected ? 'text-[#0E9F90] dark:text-teal-300' : 'text-[#172F47] dark:text-[#F2F7FA]'}`}>
                          {tech.name}
                        </h3>
                        <p className={`mt-2 line-clamp-2 break-keep text-sm font-medium leading-6 ${isSelected ? 'text-[#496D72] dark:text-[#C4D1DB]' : 'text-[#506A7D] dark:text-[#C4D1DB]'}`}>
                          {tech.description}
                        </p>
                      </div>
                      <TechniqueIcon className={`h-6 w-6 shrink-0 ${isSelected ? 'text-[#0E9F90] dark:text-teal-300' : 'text-[#527189] group-hover:text-[#0E9F90] dark:text-[#9FB5C5] dark:group-hover:text-teal-300'}`} />
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#E4EDF2] px-3 py-1 text-[11px] font-semibold text-[#36566D] dark:bg-[#26384A] dark:text-[#C4D1DB]"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className={`ml-auto text-[11px] font-semibold ${isSelected ? 'text-[#4F7479] dark:text-[#A8BAC7]' : 'text-[#647D90] dark:text-[#A8BAC7]'}`}>
                        {durationLabel(tech)}
                      </span>
                    </div>
                  </button>
                  </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-8 flex items-center justify-center gap-3 pb-2 text-[13px] font-semibold text-[#60798C] dark:text-slate-400">
        <button type="button" onClick={() => onOpenLegal('terms')} className="rounded px-1 py-1 transition-colors hover:text-[#0E9F90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40 dark:hover:text-teal-300">
          {isEnglish ? 'Terms of Use' : '이용약관'}
        </button>
        <span aria-hidden="true" className="text-[#A4B8C3] dark:text-slate-600">·</span>
        <button type="button" onClick={() => onOpenLegal('privacy')} className="rounded px-1 py-1 transition-colors hover:text-[#0E9F90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40 dark:hover:text-teal-300">
          {isEnglish ? 'Privacy Policy' : '개인정보처리방침'}
        </button>
      </footer>
    </div>
  );
}
