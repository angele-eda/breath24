export const SUPPORTED_LANGUAGES = ['ko', 'en'];

export function detectDeviceLanguage() {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

const en = {
  common: {
    seconds: 'sec', minutes: 'min', sessions: 'sessions', cycles: 'cycles', cancel: 'Cancel', save: 'Save'
  },
  nav: { home: 'Home', starter: 'Start here', history: 'History', settings: 'Settings' },
  header: {
    home: 'Go to Breathe24 home', suffix: '', lightMode: 'Switch to light mode', darkMode: 'Switch to dark mode',
    profileChange: 'Edit profile', profileEdit: 'Edit profile', close: 'Close profile editor', nickname: 'Nickname',
    private: 'Your photo and nickname stay on this device.', user: 'Breather', profileAlt: 'User profile', previewAlt: 'Profile preview'
  },
  dashboard: {
    start: 'Start breathing', streak: 'Breathing streak', dayStreak: 'day streak', today: "Today's progress",
    goal: 'Goal', choose: 'Choose your rhythm for today.', viewAll: 'View all', collapse: 'Collapse', breathing: 'Breathing'
  },
  settings: {
    badge: 'Settings', title: 'Breathing preferences', subtitle: 'Adjust sound, duration, and your custom breathing rhythm.',
    language: 'Language', languageDescription: 'Choose the language used for text and voice guidance.', korean: '한국어', english: 'English',
    theme: 'Theme mode', themeDescription: 'Switch between light and dark appearance.', duration: 'Default session length',
    durationDescription: 'Choose the default time used when a session starts.', chime: 'Chime cues', chimeDescription: 'Play a gentle sound when the phase changes.',
    voice: 'Voice guidance', voiceDescription: 'Use spoken guidance at the start and end of a session.', voiceChoice: 'Voice',
    voiceChoiceDescription: 'Choose the voice used for spoken guidance.', female: 'Female', male: 'Male', vibration: 'Vibration',
    vibrationDescription: 'Use subtle vibration feedback on supported devices.', customTitle: 'Custom breathing ratio',
    customDescription: 'Choose Custom Breathing from the exercise list to use the ratio below.', customRatio: 'Custom ratio',
    inhale: '1. Inhale', hold: '2. Hold', exhale: '3. Exhale', emptyHold: '4. Empty hold', recommended4: 'Recommended: 4 sec',
    recommended6: 'Recommended: 6 sec', zeroSkip: '0 sec skips this phase', toggle: 'toggle'
  },
  timer: {
    total: 'Breathing time', chimeOff: 'Turn chimes off', chimeOn: 'Turn chimes on', voiceOff: 'Turn voice off', voiceOn: 'Turn voice on',
    ready: 'Ready', readyTitle: 'Get ready', readyInstruction: 'Exhale comfortably and get ready.', progress: 'Progress', completedCycles: 'Completed cycles',
    resume: 'Resume', pause: 'Pause', stop: 'Stop', paused: 'Breathing is paused. Press play when you are ready to continue.'
  },
  summary: {
    complete: 'Breathing complete', description: 'Save this moment of calm and carry it into your next routine.', duration: 'Breathing time',
    cycles: 'Completed cycles', technique: 'Technique', rhythm: 'Live breathing rhythm', chartAlt: 'Breathing rhythm throughout the session',
    name: 'Session name', nameHelp: 'Choose a name that will be easy to recognize in History.', placeholder: 'Enter a session name', discard: "Don't save", save: 'Save breathing record'
  },
  history: {
    user: 'Breather', userAlt: 'Breather', bio: 'Building focus and balance through calm breathing.', level: 'Level', totalSessions: 'Total sessions',
    totalTime: 'Total time', levelProgress: 'Level progress', maxLevel: 'Top level', untilNext: '{count} sessions to next level', recentRhythm: 'Recent breathing rhythm',
    past: 'Past', rhythm: 'Rhythm flow', present: 'Now', recent: 'Recent breathing records', clear: 'Clear all', empty: 'No saved breathing records yet.',
    emptyHelp: 'Complete your first breathing session to see it here.', session: 'Breathing session', clearConfirm: 'Delete all saved breathing records? This cannot be undone.'
  }
};

const ko = {};

const techniqueEn = {
  '4-2-6': { name: '4-2-6 Calming Breath', description: 'Inhale for 4 seconds, hold for 2, then exhale slowly for 6.', tags: ['Calm', 'Recover'], phases: [
    ['Inhale', 'Breathe in gently for four.'], ['Hold', 'Hold lightly for two.'], ['Exhale', 'Exhale slowly for six.']
  ]},
  '4-7-8': { name: '4-7-8 Sleep Breath', description: 'A longer 4-7-8 rhythm to release tension before sleep.', tags: ['Sleep', 'Relax'], phases: [
    ['Inhale', 'Breathe in quietly through your nose.'], ['Hold', 'Relax your body as you hold.'], ['Exhale', 'Exhale very slowly and fully.']
  ]},
  'box-breathing': { name: 'Box Breathing', description: 'Equal inhale, hold, exhale, and hold phases for focus and balance.', tags: ['Focus', 'Balance'], phases: [
    ['Inhale', 'Inhale as if tracing one side of a box.'], ['Hold', 'Stay calm and steady.'], ['Exhale', 'Exhale gently for the same length.'], ['Empty hold', 'Rest comfortably with empty lungs.']
  ]},
  '4-4-6': { name: '4-4-6 Relaxing Breath', description: 'Inhale for 4, hold for 4, and exhale for 6 to settle the body.', tags: ['Calm', 'Reset'], phases: [
    ['Inhale', 'Fill your belly and chest comfortably.'], ['Hold', 'Let your shoulders relax.'], ['Exhale', 'Empty slowly with a long breath.']
  ]},
  '5-5-coherent': { name: '5-5 Coherent Breathing', description: 'An even 5-second inhale and exhale for a balanced rhythm.', tags: ['Rhythm', 'Balance'], phases: [
    ['Inhale', 'Breathe in at a comfortable pace.'], ['Exhale', 'Breathe out calmly for the same length.']
  ]},
  'belly-breathing': { name: 'Diaphragmatic Breathing', description: 'Inhale through the nose, expanding the belly and lower ribs, then exhale slowly to release tension.', tags: ['Diaphragm', 'Relaxation'], phases: [
    ['Breathe into your belly', 'Let your belly expand like a balloon.'], ['Exhale slowly', 'Let your belly settle naturally.']
  ]},
  'alternate-nostril': { name: 'Alternate Nostril Breathing', description: 'Alternate between nostrils to support balance and focus.', tags: ['Balance', 'Focus'], phases: [
    ['Inhale left', 'Close the right side and inhale through the left.'], ['Exhale right', 'Close the left side and exhale through the right.'],
    ['Inhale right', 'Inhale again through the right.'], ['Exhale left', 'Exhale slowly through the left.']
  ]},
  custom: { name: 'Custom Breathing', description: 'Set your own inhale, hold, exhale, and empty-hold timing in Settings.', tags: ['Custom', 'Settings'] }
};

export function t(language, path, vars = {}) {
  if (language === 'ko') return null;
  const value = path.split('.').reduce((current, key) => current?.[key], en);
  if (typeof value !== 'string') return path;
  return Object.entries(vars).reduce((text, [key, replacement]) => text.replace(`{${key}}`, replacement), value);
}

export function localizeTechnique(technique, language) {
  if (language === 'ko') return technique;
  const translated = techniqueEn[technique.id];
  if (!translated) return technique;
  return {
    ...technique,
    name: translated.name,
    description: translated.description,
    tags: translated.tags,
    rhythm: technique.custom ? 'Custom' : technique.rhythm,
    phases: technique.phases?.map((phase, index) => ({
      ...phase,
      label: translated.phases?.[index]?.[0] || phase.label,
      speech: translated.phases?.[index]?.[0] || phase.speech,
      instruction: translated.phases?.[index]?.[1] || phase.instruction
    }))
  };
}

export function localizeCustomPhases(phases, language) {
  if (language === 'ko') return phases;
  const labels = { inhale: ['Inhale', 'Breathe in gently for the selected time.'], hold: ['Hold', 'Hold comfortably.'], exhale: ['Exhale', 'Exhale slowly for the selected time.'], rest: ['Empty hold', 'Rest briefly with empty lungs.'] };
  return phases.map((phase) => ({ ...phase, label: labels[phase.type][0], speech: labels[phase.type][0], instruction: labels[phase.type][1] }));
}
