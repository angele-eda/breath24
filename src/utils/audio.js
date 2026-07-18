let audioCtx = null;
let currentGuideAudio = null;

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function speakText(text, enabled = true, rate = 0.92, volume = 0.9) {
  if (!enabled || !text || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = rate;
  utterance.pitch = 0.95;
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function playChime(type = 'inhale', enabled = true) {
  if (!enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  const frequencyMap = {
    inhale: 528,
    hold: 440,
    exhale: 392,
    rest: 330,
    complete: 660
  };

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequencyMap[type] || 440, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.8);
}

export function stopGuideAudio() {
  if (!currentGuideAudio) return;
  currentGuideAudio.pause();
  currentGuideAudio.currentTime = 0;
  currentGuideAudio = null;
}

export function playGuideAudio(src, enabled = true, volume = 0.85) {
  if (!enabled || !src) return Promise.resolve();

  stopGuideAudio();
  currentGuideAudio = new Audio(src);
  currentGuideAudio.volume = volume;

  return currentGuideAudio.play().catch(() => {
    currentGuideAudio = null;
  });
}
