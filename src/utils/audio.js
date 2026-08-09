let audioCtx = null;
let currentGuideAudio = null;
let currentGuideResolve = null;

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
  const chimeMap = {
    inhale: { frequency: 659.25, volume: 0.1, duration: 0.85 },
    hold: { frequency: 523.25, volume: 0.075, duration: 0.65 },
    exhale: { frequency: 392, volume: 0.09, duration: 1.05 },
    rest: { frequency: 329.63, volume: 0.045, duration: 0.8 },
    complete: { frequency: 783.99, volume: 0.1, duration: 1.25 }
  };
  const chime = chimeMap[type] || chimeMap.hold;

  [1, 2.01, 3.98].forEach((harmonic, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const partialVolume = chime.volume / (index + 1.4);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(chime.frequency * harmonic, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(partialVolume, now + 0.015 + index * 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + chime.duration * (1 - index * 0.14));

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + chime.duration);
  });
}

export function stopGuideAudio() {
  if (!currentGuideAudio) return;
  currentGuideAudio.pause();
  currentGuideAudio.currentTime = 0;
  currentGuideAudio = null;
  currentGuideResolve?.(false);
  currentGuideResolve = null;
}

export function playGuideAudio(src, enabled = true, volume = 0.85) {
  if (!enabled || !src) return Promise.resolve(false);

  stopGuideAudio();
  currentGuideAudio = new Audio(src);
  currentGuideAudio.volume = volume;
  const guideAudio = currentGuideAudio;

  return new Promise((resolve) => {
    currentGuideResolve = resolve;
    const finish = (played) => {
      if (currentGuideAudio === guideAudio) currentGuideAudio = null;
      if (currentGuideResolve === resolve) currentGuideResolve = null;
      resolve(played);
    };

    guideAudio.addEventListener('ended', () => finish(true), { once: true });
    guideAudio.addEventListener('error', () => finish(false), { once: true });
    guideAudio.play().catch(() => finish(false));
  });
}
