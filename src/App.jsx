import React, { useEffect, useRef, useState } from 'react';
import { BarChart2, Compass, Heart, Menu, Settings as SettingsIcon, Sparkles } from 'lucide-react';
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

  const handleUpdateSettings = (nextSettings) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
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
    speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate);
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

  const startBreathingLoop = () => {
    if (timerRef.current) clearInterval(timerRef.current);

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

    if (technique.introAudio) {
      playGuideAudio(technique.introAudio, liveSettings.voiceCuesEnabled);
    }
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
    startBreathingLoop();
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
    const phase = phasesRef.current[phaseIndexRef.current];
    const liveSettings = settingsRef.current;
    if (phase) speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate);
  };

  const handleStopSessionEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopSpeech();
    stopGuideAudio();
    if (cyclesRef.current >= 1 || elapsedRef.current >= 10) {
      setCurrentScreen('summary');
    } else {
      setCurrentScreen('dashboard');
    }
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
    setCurrentScreen(tab === 'home' ? 'dashboard' : tab);
  };

  const activeTechnique = getTechniqueById(selectedTechniqueId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20 md:pb-24 flex flex-col">
      {currentScreen !== 'breathing' && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 py-3.5 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-teal-600 dark:text-teal-400">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1.5">
                <Heart className="w-5 h-5 text-teal-600 dark:text-teal-400 fill-current" />
                <span className="font-extrabold text-lg md:text-xl tracking-tight text-slate-800 dark:text-white">Breathe24</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1 bg-teal-50 dark:bg-teal-950/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500 fill-current" />
              <span>고요한 호흡 루틴</span>
            </div>

            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shadow-sm">
              <img src={USER_AVATAR_URL} alt="사용자 프로필" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center">
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
          />
        )}
        {currentScreen === 'settings' && <SettingsSection settings={settings} onUpdateSettings={handleUpdateSettings} />}
      </main>

      {currentScreen !== 'breathing' && currentScreen !== 'summary' && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/40 py-2 shadow-lg">
          <div className="max-w-xl mx-auto flex justify-around items-center">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 py-1 transition-all ${activeTab === 'home' ? 'text-teal-600 dark:text-teal-400 font-extrabold scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">홈</span>
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 py-1 transition-all ${activeTab === 'history' ? 'text-teal-600 dark:text-teal-400 font-extrabold scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">기록</span>
            </button>
            <button
              onClick={() => handleTabClick('settings')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 py-1 transition-all ${activeTab === 'settings' ? 'text-teal-600 dark:text-teal-400 font-extrabold scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">설정</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
