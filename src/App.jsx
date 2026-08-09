import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, BarChart2, Camera, Compass, LockKeyhole, Moon, Settings as SettingsIcon, Sprout, Sun, Wind, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BreathingTimer from './components/BreathingTimer';
import SessionSummary from './components/SessionSummary';
import HistorySection from './components/HistorySection';
import SettingsSection from './components/SettingsSection';
import { getTechniqueById, getTechniquePhases } from './data/techniques';
import { playChime, playGuideAudio, speakText, stopGuideAudio, stopSpeech } from './utils/audio';
import {
  calculateStreakDays,
  calculateTodayProgressSeconds,
  clearAllSessions,
  getSavedSessions,
  getSavedSettings,
  saveCompletedSession,
  saveSettings
} from './utils/db';

const USER_AVATAR_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState(() => getSavedSettings());
  const [sessions, setSessions] = useState(() => getSavedSessions());
  const [selectedTechniqueId, setSelectedTechniqueId] = useState(() => settings.defaultTechniqueId || '4-2-6');
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [draftProfileName, setDraftProfileName] = useState(() => settings.profileName || '호흡수행자');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [streakDays, setStreakDays] = useState(0);
  const [todayProgressSeconds, setTodayProgressSeconds] = useState(0);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [totalMindfulMinutes, setTotalMindfulMinutes] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [currentPhaseMeta, setCurrentPhaseMeta] = useState(null);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(4);
  const [elapsedTimeSeconds, setElapsedTimeSeconds] = useState(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(settings.defaultDurationSeconds);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionRhythm, setSessionRhythm] = useState([]);

  const timerRef = useRef(null);
  const settingsRef = useRef(settings);
  const pausedRef = useRef(false);
  const phasesRef = useRef([]);
  const phaseIndexRef = useRef(0);
  const phaseRemainingRef = useRef(0);
  const elapsedRef = useRef(0);
  const durationRef = useRef(settings.defaultDurationSeconds);
  const cyclesRef = useRef(0);
  const rhythmRef = useRef([]);
  const sessionRunIdRef = useRef(0);

  useEffect(() => {
    setStreakDays(calculateStreakDays(sessions));
    setTodayProgressSeconds(calculateTodayProgressSeconds(sessions));
    setTotalSessionsCount(sessions.length);
    setTotalMindfulMinutes(Math.ceil(sessions.reduce((total, session) => total + session.durationSeconds, 0) / 60));
  }, [sessions]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
    settingsRef.current = settings;
  }, [settings.darkMode]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeech();
      stopGuideAudio();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 420);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateSettings = (nextSettings) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const resizeProfileImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        const sourceSize = Math.min(image.width, image.height);
        const sourceX = (image.width - sourceSize) / 2;
        const sourceY = (image.height - sourceSize) / 2;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const profileImage = await resizeProfileImage(file);
    handleUpdateSettings({ ...settingsRef.current, profileImage });
    event.target.value = '';
  };

  const saveProfileName = () => {
    const profileName = draftProfileName.trim() || '호흡수행자';
    setDraftProfileName(profileName);
    handleUpdateSettings({ ...settingsRef.current, profileName });
    setIsProfileEditorOpen(false);
  };

  const closeProfileEditor = () => {
    setDraftProfileName(settingsRef.current.profileName || '호흡수행자');
    setIsProfileEditorOpen(false);
  };

  const applyPhase = (index) => {
    const phase = phasesRef.current[index];
    const liveSettings = settingsRef.current;
    phaseIndexRef.current = index;
    phaseRemainingRef.current = phase.seconds;
    setCurrentPhase(phase.type);
    setCurrentPhaseMeta(phase);
    setPhaseTimeRemaining(phase.seconds);
    playChime(phase.type, liveSettings.soundCuesEnabled);
    if (selectedTechniqueId !== '4-2-6') {
      speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate);
    }
  };

  const completeSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopSpeech();

    const technique = getTechniqueById(selectedTechniqueId);
    const liveSettings = settingsRef.current;
    playChime('complete', liveSettings.soundCuesEnabled);
    if (technique.outroAudio) {
      playGuideAudio(technique.outroAudio, liveSettings.voiceCuesEnabled);
    } else {
      speakText('호흡 세션이 완료되었습니다.', liveSettings.voiceCuesEnabled, liveSettings.voiceRate);
    }
    setCurrentScreen('summary');
  };

  const startBreathingLoop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const runId = sessionRunIdRef.current + 1;
    sessionRunIdRef.current = runId;

    const technique = getTechniqueById(selectedTechniqueId);
    const liveSettings = settingsRef.current;
    const phases = getTechniquePhases(technique, liveSettings);
    phasesRef.current = phases;
    pausedRef.current = false;
    elapsedRef.current = 0;
    cyclesRef.current = 0;
    rhythmRef.current = [3, 8, 4];
    durationRef.current = liveSettings.defaultDurationSeconds;

    setTotalDurationSeconds(liveSettings.defaultDurationSeconds);
    setElapsedTimeSeconds(0);
    setCyclesCompleted(0);
    setSessionRhythm(rhythmRef.current);
    setIsPaused(false);

    const introAudio = technique.id === '4-2-6'
      ? `/audio/intro/ko-4-2-6-${liveSettings.voiceGender || 'female'}.wav`
      : technique.introAudio;
    if (introAudio) {
      await playGuideAudio(introAudio, liveSettings.voiceCuesEnabled);
    }
    if (sessionRunIdRef.current !== runId || pausedRef.current) return;
    applyPhase(0);

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;

      elapsedRef.current += 1;
      phaseRemainingRef.current -= 1;
      setElapsedTimeSeconds(elapsedRef.current);
      setPhaseTimeRemaining(Math.max(phaseRemainingRef.current, 0));

      if (elapsedRef.current % 10 === 0) {
        const phase = phasesRef.current[phaseIndexRef.current];
        const nextValue = phase.type === 'inhale' ? 8 : phase.type === 'hold' ? 4 : 6;
        rhythmRef.current = [...rhythmRef.current, nextValue];
        setSessionRhythm(rhythmRef.current);
      }

      if (phaseRemainingRef.current <= 0) {
        const nextIndex = (phaseIndexRef.current + 1) % phasesRef.current.length;
        if (nextIndex === 0) {
          cyclesRef.current += 1;
          setCyclesCompleted(cyclesRef.current);
        }
        applyPhase(nextIndex);
      }

      if (elapsedRef.current >= durationRef.current) {
        completeSession();
      }
    }, 1000);
  };

  const handleStartSession = () => {
    const nextSettings = { ...settings, defaultTechniqueId: selectedTechniqueId };
    handleUpdateSettings(nextSettings);
    setCurrentScreen('breathing');
    void startBreathingLoop();
  };

  const handlePauseSession = () => {
    pausedRef.current = true;
    setIsPaused(true);
    stopSpeech();
    stopGuideAudio();
  };

  const handleResumeSession = () => {
    pausedRef.current = false;
    setIsPaused(false);
    if (!timerRef.current) {
      void startBreathingLoop();
      return;
    }
    const phase = phasesRef.current[phaseIndexRef.current];
    const liveSettings = settingsRef.current;
    if (phase && selectedTechniqueId !== '4-2-6') {
      speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate);
    }
  };

  const handleStopSessionEarly = () => {
    sessionRunIdRef.current += 1;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopSpeech();
    stopGuideAudio();
    setCurrentScreen('summary');
  };

  const handleSaveSession = (sessionName) => {
    const technique = getTechniqueById(selectedTechniqueId);
    saveCompletedSession({
      durationSeconds: elapsedRef.current || elapsedTimeSeconds,
      cyclesCompleted: cyclesRef.current || cyclesCompleted,
      rhythmPattern: technique.rhythm,
      sessionName,
      techniqueName: technique.name
    });
    setSessions(getSavedSessions());
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleDiscardSession = () => {
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleClearHistory = () => {
    if (window.confirm('저장된 모든 호흡 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.')) {
      clearAllSessions();
      setSessions([]);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'starter') {
      setSelectedTechniqueId('4-2-6');
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen(tab === 'home' ? 'dashboard' : tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTechnique = getTechniqueById(selectedTechniqueId);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F2F8FA] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-100 pb-20 md:pb-24 flex flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(45,212,191,0.14),transparent_32rem)] dark:bg-[radial-gradient(circle_at_50%_18%,rgba(45,212,191,0.11),transparent_32rem)]" />
      {currentScreen !== 'breathing' && (
        <header className="sticky top-0 z-40 border-b border-[#DCE8EC] bg-white px-6 py-3.5 shadow-sm backdrop-blur-none dark:border-white/5 dark:bg-slate-950/35 dark:shadow-none dark:backdrop-blur-xl">
          <div className="mx-auto flex max-w-[480px] items-center justify-between">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center space-x-2 rounded-lg outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-teal-400/50"
              aria-label="Breathe24 홈으로 이동"
            >
              <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span className="brand-logo font-bold text-lg md:text-xl tracking-tight text-slate-800 dark:text-white">Breathe24</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleUpdateSettings({ ...settings, darkMode: !settings.darkMode })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-teal-600 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
                aria-label={settings.darkMode ? '낮 모드로 전환' : '밤 모드로 전환'}
                title={settings.darkMode ? '낮 모드' : '밤 모드'}
              >
                {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
              <button
                onClick={() => {
                  setDraftProfileName(settings.profileName || '호흡수행자');
                  setIsProfileEditorOpen((open) => !open);
                }}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
                title="프로필 바꾸기"
              >
                <span className="hidden sm:block max-w-24 truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {settings.profileName || '호흡수행자'}
                </span>
                <span className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shadow-sm">
                  <img src={settings.profileImage || USER_AVATAR_URL} alt="사용자 프로필" className="w-full h-full object-cover" />
                </span>
              </button>

              {isProfileEditorOpen && (
                <div className="fixed inset-x-4 top-20 z-50 mx-auto w-auto max-w-[18rem] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_55px_rgba(15,23,42,0.18)] backdrop-blur-none dark:border-white/10 dark:bg-slate-900/95 dark:backdrop-blur-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-72">
                  <div className="pr-9">
                    <p className="text-base font-bold text-slate-900 dark:text-white">프로필 편집</p>
                  </div>
                  <button
                    onClick={closeProfileEditor}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    title="닫기"
                    aria-label="프로필 편집 닫기"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="mt-3 flex justify-center">
                    <label className="group relative h-16 w-16 cursor-pointer rounded-full">
                      <span className="block h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                      <img
                        src={settings.profileImage || USER_AVATAR_URL}
                        alt="프로필 미리보기"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      </span>
                      <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-teal-500 text-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900">
                        <Camera className="h-3 w-3" />
                      </span>
                      <input type="file" accept="image/*" onChange={handleProfileImageChange} className="sr-only" />
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-400" htmlFor="profile-name">
                      닉네임
                    </label>
                    <input
                      id="profile-name"
                      value={draftProfileName}
                      onChange={(event) => setDraftProfileName(event.target.value)}
                      maxLength={12}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:border-teal-500 dark:focus:bg-slate-800"
                      placeholder="닉네임"
                    />
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-semibold text-teal-800 dark:bg-teal-950/30 dark:font-medium dark:text-teal-300">
                    <LockKeyhole className="h-3.5 w-3.5 shrink-0" />
                    <span>사진과 닉네임은 이 기기에만 저장돼요</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={closeProfileEditor}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      취소
                    </button>
                    <button
                      onClick={saveProfileName}
                      className="flex-1 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-500 active:scale-[0.98]"
                    >
                      저장
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-center">
        {currentScreen === 'dashboard' && (
          <Dashboard
            streakDays={streakDays}
            todayProgressSeconds={todayProgressSeconds}
            selectedTechniqueId={selectedTechniqueId}
            setSelectedTechniqueId={setSelectedTechniqueId}
            onStartSession={handleStartSession}
            settings={settings}
          />
        )}
        {currentScreen === 'breathing' && (
          <BreathingTimer
            currentPhase={currentPhase}
            currentPhaseMeta={currentPhaseMeta}
            phaseTimeRemaining={phaseTimeRemaining}
            elapsedTimeSeconds={elapsedTimeSeconds}
            totalDurationSeconds={totalDurationSeconds}
            cyclesCompleted={cyclesCompleted}
            isPaused={isPaused}
            onPause={handlePauseSession}
            onResume={handleResumeSession}
            onStop={handleStopSessionEarly}
            soundEnabled={settings.soundCuesEnabled}
            setSoundEnabled={(value) => handleUpdateSettings({ ...settings, soundCuesEnabled: value })}
            voiceEnabled={settings.voiceCuesEnabled}
            setVoiceEnabled={(value) => handleUpdateSettings({ ...settings, voiceCuesEnabled: value })}
            techniqueName={activeTechnique.name}
          />
        )}
        {currentScreen === 'summary' && (
          <SessionSummary
            elapsedTimeSeconds={elapsedRef.current || elapsedTimeSeconds}
            cyclesCompleted={cyclesRef.current || cyclesCompleted}
            selectedTechniqueId={selectedTechniqueId}
            techniqueName={activeTechnique.name}
            rhythmPattern={activeTechnique.rhythm}
            sessionRhythm={sessionRhythm}
            onSave={handleSaveSession}
            onDiscard={handleDiscardSession}
          />
        )}
        {currentScreen === 'history' && (
          <HistorySection
            sessions={sessions}
            totalSessionsCount={totalSessionsCount}
            totalMindfulMinutes={totalMindfulMinutes}
            onClearHistory={handleClearHistory}
            profileName={settings.profileName}
            profileImage={settings.profileImage}
          />
        )}
        {currentScreen === 'settings' && <SettingsSection settings={settings} onUpdateSettings={handleUpdateSettings} />}
      </main>

      {currentScreen !== 'breathing' && currentScreen !== 'summary' && (
        <>
          <button
            onClick={scrollToTop}
            className={`fixed bottom-20 right-4 z-50 transition-all duration-300 md:bottom-24 md:right-8 ${
              showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
            aria-label="맨 위로 이동"
            title="맨 위로"
          >
            <span className="scroll-top-breath flex h-11 w-11 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/18 text-teal-200 shadow-[0_0_24px_rgba(45,212,191,0.12)] backdrop-blur-md transition-colors duration-300 hover:bg-teal-300/28 hover:text-white active:scale-95">
              <ArrowUp className="h-5 w-5" />
            </span>
          </button>

        <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 py-2 shadow-lg backdrop-blur-none dark:border-white/5 dark:bg-slate-950/75 dark:backdrop-blur-xl">
          <div className="mx-auto flex max-w-[480px] items-center justify-around">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'home' ? 'text-teal-700 dark:text-teal-400 font-semibold scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">홈</span>
            </button>
            <button
              onClick={() => handleTabClick('starter')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'starter' ? 'text-teal-700 dark:text-teal-400 font-semibold scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
              aria-label="처음 시작"
            >
              <Sprout className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">처음 시작</span>
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'history' ? 'text-teal-700 dark:text-teal-400 font-semibold scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">기록</span>
            </button>
            <button
              onClick={() => handleTabClick('settings')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'settings' ? 'text-teal-700 dark:text-teal-400 font-semibold scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">설정</span>
            </button>
          </div>
        </nav>
        </>
      )}
    </div>
  );
}
