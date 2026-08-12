import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, BarChart2, Camera, Compass, LockKeyhole, Moon, Settings as SettingsIcon, Sprout, Sun, Wind, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BreathingTimer from './components/BreathingTimer';
import SessionSummary from './components/SessionSummary';
import HistorySection from './components/HistorySection';
import SettingsSection from './components/SettingsSection';
import BreathingGuide from './components/BreathingGuide';
import LegalDocument from './components/LegalDocument';
import { getTechniqueById, getTechniquePhases } from './data/techniques';
import { detectDeviceLanguage, localizeCustomPhases, localizeTechnique } from './i18n';
import { playAirflow, playChime, playGuideAudio, setGuideAudioVolume, speakText, stopAirflow, stopGuideAudio, stopSpeech } from './utils/audio';
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
const getLegalDocumentFromUrl = () => {
  const documentType = new URLSearchParams(window.location.search).get('document');
  return ['terms', 'privacy'].includes(documentType) ? documentType : null;
};

export default function App() {
  const initialLegalDocument = getLegalDocumentFromUrl();
  const [currentScreen, setCurrentScreen] = useState(initialLegalDocument ? 'legal' : 'dashboard');
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState(() => {
    const savedSettings = getSavedSettings();
    return { ...savedSettings, language: savedSettings.language || detectDeviceLanguage() };
  });
  const [sessions, setSessions] = useState(() => getSavedSessions());
  const [selectedTechniqueId, setSelectedTechniqueId] = useState(() => settings.defaultTechniqueId || '4-2-6');
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [draftProfileName, setDraftProfileName] = useState(() => settings.profileName || '호흡수행자');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [legalDocumentType, setLegalDocumentType] = useState(initialLegalDocument || 'terms');

  const [streakDays, setStreakDays] = useState(0);
  const [todayProgressSeconds, setTodayProgressSeconds] = useState(0);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [totalMindfulMinutes, setTotalMindfulMinutes] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
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
  const completionTimeoutRef = useRef(null);
  const beginnerSessionRef = useRef(false);

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
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
      stopSpeech();
      stopAirflow(0.05);
      stopGuideAudio();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 420);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHistoryChange = (event) => {
      const documentType = getLegalDocumentFromUrl();
      if (documentType) {
        setLegalDocumentType(documentType);
        setCurrentScreen('legal');
      } else {
        setCurrentScreen('dashboard');
        setActiveTab('home');
      }
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: event.state?.scrollY || 0, behavior: 'auto' });
      });
    };
    window.addEventListener('popstate', handleHistoryChange);
    return () => window.removeEventListener('popstate', handleHistoryChange);
  }, []);

  const handleUpdateSettings = (nextSettings) => {
    settingsRef.current = nextSettings;
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const handleSoundEnabled = (enabled) => {
    const soundVolume = enabled && settingsRef.current.soundVolume <= 0
      ? 65
      : settingsRef.current.soundVolume;
    handleUpdateSettings({ ...settingsRef.current, soundCuesEnabled: enabled, soundVolume });

    if (!enabled) {
      stopAirflow();
      return;
    }

    if (
      currentScreen === 'breathing'
      && !pausedRef.current
      && !isCompleting
      && ['inhale', 'exhale'].includes(currentPhase)
    ) {
      playAirflow(currentPhase, Math.max(phaseRemainingRef.current, 0.5), true, soundVolume);
    }
  };

  const handleSoundVolume = (soundVolume) => {
    const normalizedVolume = Math.max(0, Math.min(100, Number(soundVolume) || 0));
    const soundCuesEnabled = normalizedVolume > 0;
    handleUpdateSettings({ ...settingsRef.current, soundVolume: normalizedVolume, soundCuesEnabled });

    if (!soundCuesEnabled) {
      stopAirflow();
    } else if (
      currentScreen === 'breathing'
      && !pausedRef.current
      && !isCompleting
      && ['inhale', 'exhale'].includes(currentPhase)
    ) {
      playAirflow(currentPhase, Math.max(phaseRemainingRef.current, 0.5), true, normalizedVolume);
    }
  };

  const handleVoiceEnabled = (enabled) => {
    const voiceVolume = enabled && settingsRef.current.voiceVolume <= 0
      ? 85
      : settingsRef.current.voiceVolume;
    handleUpdateSettings({ ...settingsRef.current, voiceCuesEnabled: enabled, voiceVolume });
    if (!enabled) {
      stopSpeech();
      stopGuideAudio();
    }
  };

  const handleVoiceVolume = (voiceVolume) => {
    const normalizedVolume = Math.max(0, Math.min(100, Number(voiceVolume) || 0));
    const voiceCuesEnabled = normalizedVolume > 0;
    handleUpdateSettings({ ...settingsRef.current, voiceVolume: normalizedVolume, voiceCuesEnabled });
    setGuideAudioVolume(normalizedVolume);
    if (!voiceCuesEnabled) stopSpeech();
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
    const profileName = draftProfileName.trim().slice(0, 6) || '호흡수행자';
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
    playChime(phase.type, liveSettings.soundCuesEnabled, liveSettings.soundVolume);
    playAirflow(phase.type, phase.seconds, liveSettings.soundCuesEnabled, liveSettings.soundVolume);
    if (selectedTechniqueId !== '4-2-6') {
      speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate, liveSettings.voiceVolume / 100);
    }
  };

  const completeSession = () => {
    if (isCompleting) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopSpeech();
    stopAirflow();
    setIsCompleting(true);

    const technique = localizeTechnique(getTechniqueById(selectedTechniqueId), settingsRef.current.language);
    const liveSettings = settingsRef.current;
    playChime('complete', liveSettings.soundCuesEnabled, liveSettings.soundVolume);
    if (technique.id === '4-2-6') {
      playGuideAudio(`/audio/outro/${liveSettings.language === 'ko' ? 'ko' : 'en'}-female.wav`, liveSettings.voiceCuesEnabled, liveSettings.voiceVolume / 100);
    } else if (technique.outroAudio) {
      playGuideAudio(technique.outroAudio, liveSettings.voiceCuesEnabled, liveSettings.voiceVolume / 100);
    } else {
      speakText(liveSettings.language === 'ko' ? '호흡 세션이 완료되었습니다.' : 'Breathing session complete.', liveSettings.voiceCuesEnabled, liveSettings.voiceRate, liveSettings.voiceVolume / 100);
    }
    const completionTransitionMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
    completionTimeoutRef.current = window.setTimeout(() => {
      setCurrentScreen('summary');
      setIsCompleting(false);
      completionTimeoutRef.current = null;
    }, completionTransitionMs);
  };

  const startBreathingLoop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const runId = sessionRunIdRef.current + 1;
    sessionRunIdRef.current = runId;

    const liveSettings = settingsRef.current;
    const baseTechnique = getTechniqueById(selectedTechniqueId);
    const technique = localizeTechnique(baseTechnique, liveSettings.language);
    const basePhases = getTechniquePhases(baseTechnique, liveSettings);
    let phases = baseTechnique.custom ? localizeCustomPhases(basePhases, liveSettings.language) : technique.phases;
    const beginnerRestSeconds = Math.max(0, Math.min(3, liveSettings.beginnerRestSeconds ?? 2));
    if (beginnerSessionRef.current && technique.id === '4-2-6' && beginnerRestSeconds > 0) {
      phases = [
        ...phases,
        {
          type: 'rest',
          label: liveSettings.language === 'ko' ? '편하게 쉬기' : 'Rest comfortably',
          speech: '',
          seconds: beginnerRestSeconds,
          instruction: liveSettings.language === 'ko'
            ? '숨을 참지 말고 다음 들숨을 편안히 기다려요.'
            : 'Do not hold your breath; simply wait comfortably for the next inhale.'
        }
      ];
    }
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
    setIsCompleting(false);

    const isPreparing426 = technique.id === '4-2-6';
    const preparationSeconds = 2.4;
    if (isPreparing426) {
      const preparationMeta = {
        type: 'prepare',
        label: liveSettings.language === 'ko' ? '호흡 준비' : 'Get ready',
        seconds: preparationSeconds,
        instruction: liveSettings.language === 'ko' ? '편안히 숨을 내쉬고 준비해요.' : 'Exhale comfortably and get ready.'
      };
      setCurrentPhase('prepareStart');
      setCurrentPhaseMeta(preparationMeta);
      setPhaseTimeRemaining(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (sessionRunIdRef.current === runId) setCurrentPhase('prepare');
        });
      });
    }

    const introAudio = technique.id === '4-2-6'
      ? `/audio/intro/${liveSettings.language === 'ko' ? 'ko' : 'en'}-4-2-6-${liveSettings.voiceGender || 'female'}.wav`
      : technique.introAudio;
    const introPromise = introAudio
      ? playGuideAudio(introAudio, liveSettings.voiceCuesEnabled, liveSettings.voiceVolume / 100)
      : Promise.resolve(false);
    const preparationPromise = isPreparing426
      ? new Promise((resolve) => window.setTimeout(resolve, preparationSeconds * 1000))
      : Promise.resolve();
    await Promise.all([introPromise, preparationPromise]);
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
    beginnerSessionRef.current = false;
    const nextSettings = { ...settings, defaultTechniqueId: selectedTechniqueId };
    handleUpdateSettings(nextSettings);
    setCurrentScreen('breathing');
    void startBreathingLoop();
  };

  const handlePauseSession = () => {
    pausedRef.current = true;
    setIsPaused(true);
    stopSpeech();
    stopAirflow();
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
    if (phase) {
      playAirflow(phase.type, phaseRemainingRef.current, liveSettings.soundCuesEnabled, liveSettings.soundVolume);
    }
    if (phase && selectedTechniqueId !== '4-2-6') {
      speakText(phase.speech, liveSettings.voiceCuesEnabled, liveSettings.voiceRate, liveSettings.voiceVolume / 100);
    }
  };

  const handleStopSessionEarly = () => {
    sessionRunIdRef.current += 1;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopSpeech();
    stopAirflow();
    stopGuideAudio();
    setCurrentScreen('summary');
  };

  const handleSaveSession = (sessionName) => {
    const technique = localizeTechnique(getTechniqueById(selectedTechniqueId), settingsRef.current.language);
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
    if (window.confirm(settings.language === 'ko' ? '저장된 모든 호흡 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.' : 'Delete all saved breathing records? This cannot be undone.')) {
      clearAllSessions();
      setSessions([]);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'starter') {
      setSelectedTechniqueId('4-2-6');
      setCurrentScreen('guide');
    } else {
      setCurrentScreen(tab === 'home' ? 'dashboard' : tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBeginnerSession = () => {
    const nextSettings = {
      ...settingsRef.current,
      defaultDurationSeconds: 120,
      defaultTechniqueId: '4-2-6'
    };
    beginnerSessionRef.current = true;
    setSelectedTechniqueId('4-2-6');
    handleUpdateSettings(nextSettings);
    setCurrentScreen('breathing');
    void startBreathingLoop();
  };

  const handleOpenDurationSettings = () => {
    setActiveTab('settings');
    setCurrentScreen('settings');
    window.setTimeout(() => {
      document.getElementById('session-duration-settings')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 80);
  };

  const handleOpenLegal = (type) => {
    window.history.replaceState(
      { ...window.history.state, scrollY: window.scrollY },
      '',
      window.location.href
    );
    setLegalDocumentType(type);
    setCurrentScreen('legal');
    const url = new URL(window.location.href);
    url.searchParams.set('document', type);
    window.history.pushState({ breathe24Legal: type }, '', `${url.pathname}${url.search}${url.hash}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseLegal = () => {
    if (window.history.state?.breathe24Legal) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('document');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setCurrentScreen('dashboard');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTechnique = localizeTechnique(getTechniqueById(selectedTechniqueId), settings.language);
  const isEnglish = settings.language === 'en';
  const fallbackProfileName = isEnglish ? 'Friend' : '호흡수행자';
  const displayProfileName = settings.profileName && settings.profileName !== '호흡수행자'
    ? settings.profileName
    : fallbackProfileName;

  return (
    <div className="mobile-type-tuned relative min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-100 pb-20 md:pb-24 flex flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(45,212,191,0.14),transparent_32rem)] dark:bg-[radial-gradient(circle_at_50%_18%,rgba(45,212,191,0.11),transparent_32rem)]" />
      {currentScreen !== 'breathing' && (
        <header className="sticky top-0 z-40 border-b border-[var(--surface-border)] bg-[var(--surface-card)] px-6 py-3.5 shadow-sm backdrop-blur-none dark:border-white/5 dark:bg-slate-950/35 dark:shadow-none dark:backdrop-blur-xl">
          <div className="mx-auto flex max-w-[480px] items-center justify-between">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center space-x-2 rounded-lg outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-teal-400/50"
              aria-label={isEnglish ? 'Go to Breathe24 home' : 'Breathe24 홈으로 이동'}
            >
              <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span className="brand-logo font-bold text-lg md:text-xl tracking-tight text-slate-800 dark:text-white">Breathe24</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span
                className="max-w-[5.5rem] truncate text-[11px] font-semibold text-[#527189] dark:text-slate-300"
                title={isEnglish ? displayProfileName : `${displayProfileName}님`}
              >
                {isEnglish ? displayProfileName : `${displayProfileName}님`}
              </span>

              <button
                onClick={() => handleUpdateSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`translate-x-[5px] flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95 ${
                  settings.darkMode
                    ? 'bg-transparent text-[#5FD6CC] hover:bg-transparent'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-teal-600'
                }`}
                aria-label={settings.darkMode ? (isEnglish ? 'Switch to light mode' : '낮 모드로 전환') : (isEnglish ? 'Switch to dark mode' : '밤 모드로 전환')}
                title={settings.darkMode ? (isEnglish ? 'Light mode' : '낮 모드') : (isEnglish ? 'Dark mode' : '밤 모드')}
              >
                {settings.darkMode ? <Moon className="mode-toggle-moon h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              <div className="relative">
              <button
                onClick={() => {
                  setDraftProfileName(displayProfileName);
                  setIsProfileEditorOpen((open) => !open);
                }}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
                title={isEnglish ? 'Edit profile' : '프로필 바꾸기'}
              >
                <span className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shadow-sm">
                  <img src={settings.profileImage || USER_AVATAR_URL} alt={isEnglish ? 'User profile' : '사용자 프로필'} className="w-full h-full object-cover" />
                </span>
              </button>

              {isProfileEditorOpen && (
                <div className="fixed inset-x-4 top-20 z-50 mx-auto w-auto max-w-[18rem] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_55px_rgba(15,23,42,0.18)] backdrop-blur-none dark:border-white/10 dark:bg-slate-900/95 dark:backdrop-blur-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-72">
                  <div className="pr-9">
                    <p className="text-base font-bold text-slate-900 dark:text-white">{isEnglish ? 'Edit profile' : '프로필 편집'}</p>
                  </div>
                  <button
                    onClick={closeProfileEditor}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    title={isEnglish ? 'Close' : '닫기'}
                    aria-label={isEnglish ? 'Close profile editor' : '프로필 편집 닫기'}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="mt-3 flex justify-center">
                    <label className="group relative h-16 w-16 cursor-pointer rounded-full">
                      <span className="block h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                      <img
                        src={settings.profileImage || USER_AVATAR_URL}
                        alt={isEnglish ? 'Profile preview' : '프로필 미리보기'}
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
                      {isEnglish ? 'Nickname' : '닉네임'}
                    </label>
                    <input
                      id="profile-name"
                      value={draftProfileName}
                      onChange={(event) => setDraftProfileName(event.target.value)}
                      maxLength={6}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:border-teal-500 dark:focus:bg-slate-800"
                      placeholder={isEnglish ? 'Nickname' : '닉네임'}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-semibold text-teal-800 dark:bg-teal-950/30 dark:font-medium dark:text-teal-300">
                    <LockKeyhole className="h-3.5 w-3.5 shrink-0" />
                    <span>{isEnglish ? 'Your photo and nickname stay on this device.' : '사진과 닉네임은 이 기기에만 저장돼요'}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={closeProfileEditor}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {isEnglish ? 'Cancel' : '취소'}
                    </button>
                    <button
                      onClick={saveProfileName}
                      className="flex-1 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-500 active:scale-[0.98]"
                    >
                      {isEnglish ? 'Save' : '저장'}
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
            onOpenLegal={handleOpenLegal}
            settings={settings}
            language={settings.language}
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
            isCompleting={isCompleting}
            onPause={handlePauseSession}
            onResume={handleResumeSession}
            onStop={handleStopSessionEarly}
            soundEnabled={settings.soundCuesEnabled}
            setSoundEnabled={handleSoundEnabled}
            soundVolume={settings.soundVolume}
            setSoundVolume={handleSoundVolume}
            voiceEnabled={settings.voiceCuesEnabled}
            setVoiceEnabled={handleVoiceEnabled}
            voiceVolume={settings.voiceVolume}
            setVoiceVolume={handleVoiceVolume}
            voiceGender={settings.voiceGender}
            setVoiceGender={(voiceGender) => handleUpdateSettings({ ...settingsRef.current, voiceGender })}
            techniqueName={beginnerSessionRef.current
              ? `${settings.beginnerRestSeconds > 0 ? `4-2-6-${settings.beginnerRestSeconds}` : '4-2-6'} ${isEnglish ? 'Beginner Breath' : '초보 호흡'}`
              : activeTechnique.name}
            language={settings.language}
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
            language={settings.language}
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
            language={settings.language}
          />
        )}
        {currentScreen === 'guide' && (
          <BreathingGuide
            language={settings.language}
            restSeconds={settings.beginnerRestSeconds}
            onRestSecondsChange={(beginnerRestSeconds) => handleUpdateSettings({
              ...settingsRef.current,
              beginnerRestSeconds
            })}
            onStart={handleStartBeginnerSession}
            onOpenDurationSettings={handleOpenDurationSettings}
          />
        )}
        {currentScreen === 'settings' && <SettingsSection settings={settings} onUpdateSettings={handleUpdateSettings} language={settings.language} />}
        {currentScreen === 'legal' && (
          <LegalDocument
            type={legalDocumentType}
            language={settings.language}
            onBack={handleCloseLegal}
          />
        )}
      </main>

      {currentScreen !== 'breathing' && currentScreen !== 'summary' && currentScreen !== 'legal' && (
        <>
          <button
            onClick={scrollToTop}
            className={`fixed bottom-20 right-4 z-50 transition-all duration-300 md:bottom-24 md:right-8 ${
              showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
            aria-label={isEnglish ? 'Back to top' : '맨 위로 이동'}
            title={isEnglish ? 'Back to top' : '맨 위로'}
          >
            <span className="scroll-top-breath flex h-11 w-11 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/18 text-teal-200 shadow-[0_0_24px_rgba(45,212,191,0.12)] backdrop-blur-md transition-colors duration-300 hover:bg-teal-300/28 hover:text-white active:scale-95">
              <ArrowUp className="h-5 w-5" />
            </span>
          </button>

        <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[#E1EAEE] bg-white py-2 shadow-lg backdrop-blur-none dark:border-white/5 dark:bg-slate-950/75 dark:backdrop-blur-xl">
          <div className="mx-auto flex max-w-[480px] items-center justify-around">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'home' ? 'text-[#0E9F90] dark:text-teal-400 font-semibold scale-105' : 'text-[#60798C] dark:text-slate-400 hover:text-[#36566D] dark:hover:text-slate-300'}`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">{isEnglish ? 'Home' : '홈'}</span>
            </button>
            <button
              onClick={() => handleTabClick('starter')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'starter' ? 'text-[#0E9F90] dark:text-teal-400 font-semibold scale-105' : 'text-[#60798C] dark:text-slate-400 hover:text-[#36566D] dark:hover:text-slate-300'}`}
              aria-label={isEnglish ? 'Breathing guide' : '호흡 안내'}
            >
              <Sprout className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">{isEnglish ? 'Guide' : '호흡 안내'}</span>
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'history' ? 'text-[#0E9F90] dark:text-teal-400 font-semibold scale-105' : 'text-[#60798C] dark:text-slate-400 hover:text-[#36566D] dark:hover:text-slate-300'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">{isEnglish ? 'History' : '기록'}</span>
            </button>
            <button
              onClick={() => handleTabClick('settings')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer flex-1 rounded-lg py-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-300/45 ${activeTab === 'settings' ? 'text-[#0E9F90] dark:text-teal-400 font-semibold scale-105' : 'text-[#60798C] dark:text-slate-400 hover:text-[#36566D] dark:hover:text-slate-300'}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-[10px] md:text-xs">{isEnglish ? 'Settings' : '설정'}</span>
            </button>
          </div>
        </nav>
        </>
      )}
    </div>
  );
}
