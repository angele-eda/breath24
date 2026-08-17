const SESSIONS_KEY = 'breathe_sessions_v1';
const SETTINGS_KEY = 'breathe_settings_v1';

const DEFAULT_SETTINGS = {
  defaultDurationSeconds: 120,
  soundCuesEnabled: true,
  soundVolume: 45,
  voiceCuesEnabled: true,
  voiceVolume: 85,
  voiceCuesDefaultedOff: true,
  introVoiceEnabledByDefaultV1: true,
  voiceGender: 'female',
  vibrationCuesEnabled: true,
  darkMode: true,
  defaultTechniqueId: '4-2-6',
  beginnerRestSeconds: 2,
  voiceRate: 0.92,
  profileName: '호흡수행자',
  profileImage: '',
  customInhale: 4,
  customHold: 2,
  customExhale: 6,
  customHold2: 0
};

export function getSavedSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = { ...DEFAULT_SETTINGS, ...parsed };
      if (!parsed.voiceCuesDefaultedOff) {
        migrated.voiceCuesEnabled = false;
        migrated.voiceCuesDefaultedOff = true;
      }
      if (!parsed.introVoiceEnabledByDefaultV1) {
        migrated.voiceCuesEnabled = true;
        migrated.introVoiceEnabledByDefaultV1 = true;
      }
      if (!['female', 'male'].includes(parsed.voiceGender)) {
        migrated.voiceGender = 'female';
      }
      migrated.soundVolume = Math.max(0, Math.min(100, Number(migrated.soundVolume) || 0));
      migrated.voiceVolume = Math.max(0, Math.min(100, Number(migrated.voiceVolume) || 0));
      migrated.beginnerRestSeconds = Math.max(0, Math.min(3, Number(migrated.beginnerRestSeconds) || 0));
      return migrated;
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

export function getSavedSessions() {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error);
  }
  return [];
}

export function saveCompletedSession({ durationSeconds, cyclesCompleted, rhythmPattern, sessionName, techniqueName }) {
  try {
    const sessions = getSavedSessions();
    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      startTimeMillis: Date.now(),
      durationSeconds,
      cyclesCompleted,
      rhythmPattern,
      sessionName,
      techniqueName
    };
    sessions.unshift(newSession);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
    return null;
  }
}

export function clearAllSessions() {
  try {
    localStorage.removeItem(SESSIONS_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
}

export function getTodayStartMillis() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function calculateTodayProgressSeconds(sessions) {
  const todayStart = getTodayStartMillis();
  return sessions
    .filter((session) => session.startTimeMillis >= todayStart)
    .reduce((total, session) => total + session.durationSeconds, 0);
}

export function calculateStreakDays(sessions) {
  if (!sessions?.length) return 0;

  const days = sessions.map((session) => {
    const date = new Date(session.startTimeMillis);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const uniqueDays = [...new Set(days)].sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (uniqueDays[0] !== today.getTime() && uniqueDays[0] !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  let expected = uniqueDays[0];

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(expected);
    previous.setDate(previous.getDate() - 1);
    expected = previous.getTime();

    if (uniqueDays[index] !== expected) break;
    streak += 1;
  }

  return streak;
}

export function determineSessionNameByTime(timestamp) {
  const hour = new Date(timestamp).getHours();
  if (hour >= 5 && hour < 12) return '아침의 맑은 호흡';
  if (hour >= 12 && hour < 17) return '오후의 리셋 호흡';
  if (hour >= 17 && hour < 22) return '저녁의 고요한 호흡';
  return '깊은 휴식 호흡';
}
