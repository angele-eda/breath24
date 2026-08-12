let audioCtx = null;
let currentGuideAudio = null;
let currentGuideResolve = null;
let currentAirflow = null;

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
  utterance.lang = /[가-힣]/.test(text) ? 'ko-KR' : 'en-US';
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

function getSoundVolumeScale(volumePercent = 65) {
  return Math.max(0, Math.min(100, Number(volumePercent) || 0)) / 65;
}

export function playChime(type = 'inhale', enabled = true, volumePercent = 65) {
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
  const volumeScale = getSoundVolumeScale(volumePercent);
  if (volumeScale <= 0) return;

  [1, 2.01, 3.98].forEach((harmonic, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const partialVolume = (chime.volume * volumeScale) / (index + 1.4);

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

function createSoftAirBuffer(ctx) {
  const durationSeconds = 2;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * durationSeconds, ctx.sampleRate);
  const samples = buffer.getChannelData(0);
  let smoothedNoise = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const whiteNoise = Math.random() * 2 - 1;
    smoothedNoise = smoothedNoise * 0.985 + whiteNoise * 0.015;
    samples[index] = smoothedNoise * 3.2;
  }

  return buffer;
}

export function stopAirflow(fadeSeconds = 0.25) {
  if (!currentAirflow) return;

  const airflow = currentAirflow;
  currentAirflow = null;
  const now = airflow.ctx.currentTime;
  const fadeDuration = Math.max(0.02, fadeSeconds);

  if (typeof airflow.gain.gain.cancelAndHoldAtTime === 'function') {
    airflow.gain.gain.cancelAndHoldAtTime(now);
  } else {
    airflow.gain.gain.cancelScheduledValues(now);
    airflow.gain.gain.setValueAtTime(Math.max(airflow.gain.gain.value, 0.0001), now);
  }
  airflow.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

  try {
    airflow.source.stop(now + fadeDuration + 0.03);
  } catch {
    // The source may already have stopped at the natural end of a phase.
  }
}

export function playAirflow(type, durationSeconds, enabled = true, volumePercent = 65) {
  stopAirflow(0.25);
  if (!enabled || !['inhale', 'exhale'].includes(type)) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = Math.max(0.5, Number(durationSeconds) || 1);
  const now = ctx.currentTime;
  const end = now + duration;
  const fadeDuration = Math.min(0.25, duration * 0.2);
  const source = ctx.createBufferSource();
  const highpass = ctx.createBiquadFilter();
  const lowpass = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  source.buffer = createSoftAirBuffer(ctx);
  source.loop = true;
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(70, now);
  highpass.Q.setValueAtTime(0.35, now);
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(type === 'inhale' ? 720 : 620, now);
  lowpass.Q.setValueAtTime(0.25, now);

  const volumeScale = getSoundVolumeScale(volumePercent);
  if (volumeScale <= 0) return;
  const peakVolume = (type === 'inhale' ? 0.044 : 0.049) * volumeScale;
  gain.gain.setValueAtTime(0.0001, now);
  if (type === 'inhale') {
    gain.gain.exponentialRampToValueAtTime(0.0045, now + fadeDuration);
    gain.gain.exponentialRampToValueAtTime(peakVolume, Math.max(now + fadeDuration, end - fadeDuration));
  } else {
    gain.gain.exponentialRampToValueAtTime(peakVolume, now + fadeDuration);
    gain.gain.exponentialRampToValueAtTime(0.003, Math.max(now + fadeDuration, end - fadeDuration));
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(end + 0.03);

  currentAirflow = { ctx, source, gain };
  source.addEventListener('ended', () => {
    if (currentAirflow?.source === source) currentAirflow = null;
  }, { once: true });
}

export function stopGuideAudio() {
  if (!currentGuideAudio) return;
  currentGuideAudio.pause();
  currentGuideAudio.currentTime = 0;
  currentGuideAudio = null;
  currentGuideResolve?.(false);
  currentGuideResolve = null;
}

export function setGuideAudioVolume(volumePercent = 85) {
  if (!currentGuideAudio) return;
  currentGuideAudio.volume = Math.max(0, Math.min(1, (Number(volumePercent) || 0) / 100));
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
