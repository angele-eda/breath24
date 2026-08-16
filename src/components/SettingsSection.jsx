import React, { useEffect } from 'react';
import { Activity, ChevronDown, Globe2, Mic, Moon, Play, Settings, Sliders, Smartphone, Sun, Timer, Volume2 } from 'lucide-react';
import { playAirflow, stopAirflow } from '../utils/audio';

const DURATION_OPTIONS = [
  { label: '1분', value: 60 },
  { label: '2분', value: 120 },
  { label: '3분', value: 180 },
  { label: '5분', value: 300 },
  { label: '10분', value: 600 },
  { label: '15분', value: 900 },
  { label: '20분', value: 1200 }
];

export default function SettingsSection({ settings, onUpdateSettings, language = 'ko' }) {
  const isEnglish = language === 'en';
  const toggleSetting = (key) => {
    const enabled = !settings[key];
    const nextSettings = { ...settings, [key]: enabled };
    if (key === 'soundCuesEnabled' && enabled && settings.soundVolume <= 0) {
      nextSettings.soundVolume = 45;
    }
    onUpdateSettings(nextSettings);
  };
  const setDuration = (seconds) => onUpdateSettings({ ...settings, defaultDurationSeconds: seconds });
  const setSoundVolume = (value) => {
    const soundVolume = Math.max(0, Math.min(100, Number(value)));
    onUpdateSettings({
      ...settings,
      soundVolume,
      soundCuesEnabled: soundVolume > 0
    });
  };

  useEffect(() => () => stopAirflow(0.1), []);

  const previewAirflow = () => {
    const previewVolume = settings.soundVolume > 0 ? settings.soundVolume : 45;
    playAirflow('exhale', 2.4, true, previewVolume);
  };

  const adjustCustomPart = (key, delta, min, max) => {
    const value = Math.max(min, Math.min(max, (settings[key] || 0) + delta));
    onUpdateSettings({ ...settings, [key]: value });
  };

  const ToggleRow = ({ icon, title, description, settingKey }) => (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-300/10 text-teal-300">
          {icon}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-100">{title}</h4>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => toggleSetting(settingKey)}
        className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
          settings[settingKey] ? 'bg-teal-400' : 'bg-slate-700'
        }`}
        aria-label={`${title} ${isEnglish ? 'toggle' : '전환'}`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            settings[settingKey] ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const NumberControl = ({ title, hint, colorClass, settingKey, min, max }) => (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/30 p-3">
      <div>
        <span className={`block text-xs font-bold ${colorClass}`}>{title}</span>
        <span className="text-xs text-slate-500">{hint}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => adjustCustomPart(settingKey, -1, min, max)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-100 transition hover:bg-slate-700 active:scale-90"
        >
          -
        </button>
        <span className="w-10 text-center text-sm font-bold tabular-nums text-white">{settings[settingKey]}{isEnglish ? 's' : '초'}</span>
        <button
          onClick={() => adjustCustomPart(settingKey, 1, min, max)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-100 transition hover:bg-slate-700 active:scale-90"
        >
          +
        </button>
      </div>
    </div>
  );

  const GroupHeader = ({ icon, title, description }) => (
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-300/10 text-teal-300 transition-colors group-open:bg-teal-300 group-open:text-slate-950">{icon}</span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-100 transition-colors group-open:text-teal-200">{title}</span>
          <span className="mt-0.5 block text-[11px] font-medium leading-4 text-slate-500">{description}</span>
        </span>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-all duration-200 group-open:rotate-180 group-open:text-teal-300" />
    </summary>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-6 space-y-5 animate-fade-in">
      <div className="px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold text-teal-300">
          <Settings className="h-4 w-4" />
          {isEnglish ? 'Settings' : '설정'}
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white">{isEnglish ? 'Breathing preferences' : '호흡 환경 설정'}</h2>
        <p className="mt-1 text-sm text-slate-500">{isEnglish ? 'Adjust sound, session length, and your custom rhythm.' : '소리, 시간, 맞춤 호흡 리듬을 편하게 조절하세요.'}</p>
      </div>

      <details className="group overflow-hidden rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 shadow-sm transition-colors open:border-teal-300/45 open:bg-teal-950/25 open:shadow-[0_0_0_1px_rgba(94,234,212,0.08)] dark:bg-slate-800/50 dark:open:bg-teal-950/25">
        <GroupHeader
          icon={<Globe2 className="h-4 w-4" />}
          title={isEnglish ? 'Basic settings' : '기본 설정'}
          description={isEnglish ? 'Language and screen appearance' : '언어와 화면 모드를 설정합니다.'}
        />
        <div className="border-t border-white/10">
        <ToggleRow
          icon={settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          title={isEnglish ? 'Theme' : '테마 모드'}
          description={isEnglish ? 'Switch between light and dark appearance.' : '밝은 화면과 어두운 화면을 전환합니다.'}
          settingKey="darkMode"
        />

        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-300/10 text-teal-300"><Globe2 className="h-5 w-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-100">{isEnglish ? 'Language' : '언어'}</h4><p className="mt-0.5 text-[11px] text-slate-500">{isEnglish ? 'The device language is used on first visit.' : '첫 접속 시 기기 언어를 자동으로 적용합니다.'}</p></div>
          </div>
          <div className="flex shrink-0 rounded-full bg-slate-950/30 p-1">
            {[{ value: 'ko', label: '한국어' }, { value: 'en', label: 'English' }].map((option) => (
              <button key={option.value} onClick={() => onUpdateSettings({ ...settings, language: option.value })} className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors ${language === option.value ? 'bg-teal-300 text-slate-950' : 'text-slate-400 hover:text-slate-100'}`}>{option.label}</button>
            ))}
          </div>
        </div>
        </div>
      </details>

      <details id="session-duration-settings" className="group scroll-mt-24 overflow-hidden rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 shadow-sm transition-colors open:border-teal-300/45 open:bg-teal-950/25 open:shadow-[0_0_0_1px_rgba(94,234,212,0.08)] dark:bg-slate-800/50 dark:open:bg-teal-950/25">
        <GroupHeader
          icon={<Timer className="h-4 w-4" />}
          title={isEnglish ? 'Breathing session' : '호흡 세션'}
          description={isEnglish ? 'Default duration and vibration' : '기본 시간과 진동을 설정합니다.'}
        />
        <div className="border-t border-white/10">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-300/10 text-teal-300">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{isEnglish ? 'Default session time' : '기본 세션 시간'}</h4>
              <p className="mt-0.5 text-[11px] text-slate-500">{isEnglish ? 'Choose the duration used when a session begins.' : '호흡 시작 시 적용되는 기본 시간을 정합니다.'}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  settings.defaultDurationSeconds === option.value
                    ? 'border-teal-300 bg-teal-300 text-slate-950'
                    : 'border-white/10 bg-slate-950/30 text-slate-400 hover:border-teal-300/40 hover:text-slate-100'
                }`}
              >
                {isEnglish ? `${option.value / 60} min` : option.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow icon={<Smartphone className="h-5 w-5" />} title={isEnglish ? 'Vibration' : '진동 효과'} description={isEnglish ? 'Use subtle vibration feedback on supported devices.' : '지원 기기에서 미세한 진동 피드백을 사용합니다.'} settingKey="vibrationCuesEnabled" />
        </div>
      </details>

      <details className="group overflow-hidden rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 shadow-sm transition-colors open:border-teal-300/45 open:bg-teal-950/25 open:shadow-[0_0_0_1px_rgba(94,234,212,0.08)] dark:bg-slate-800/50 dark:open:bg-teal-950/25">
        <GroupHeader
          icon={<Volume2 className="h-4 w-4" />}
          title={isEnglish ? 'Sound and voice' : '소리 및 음성'}
          description={isEnglish ? 'Chimes, airflow, and voice guidance' : '종소리, 바람 소리와 음성 안내를 설정합니다.'}
        />
        <div className="border-t border-white/10">
        <ToggleRow icon={<Volume2 className="h-5 w-5" />} title={isEnglish ? 'Breathing sounds' : '호흡 소리'} description={isEnglish ? 'Play gentle chimes and soft airflow with the breathing rhythm.' : '단계 종소리와 부드러운 공기 흐름음을 재생합니다.'} settingKey="soundCuesEnabled" />
        <div className="border-b border-white/10 px-4 pb-4 pt-3">
          <div className="mb-2.5 flex items-center justify-between text-xs font-semibold">
            <label htmlFor="breathing-sound-volume" className="text-slate-400">
              {isEnglish ? 'Sound volume' : '소리 크기'}
            </label>
            <span className="tabular-nums text-teal-300">{settings.soundVolume ?? 45}%</span>
          </div>
          <input
            id="breathing-sound-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.soundVolume ?? 45}
            onInput={(event) => setSoundVolume(event.currentTarget.value)}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-teal-300"
            aria-label={isEnglish ? 'Breathing sound volume' : '호흡 소리 크기'}
          />
          <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-500">
            <span>{isEnglish ? 'Quiet' : '작게'}</span>
            <span>{isEnglish ? 'Loud' : '크게'}</span>
          </div>
          <button
            type="button"
            onClick={previewAirflow}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[11px] font-bold text-teal-300 transition hover:bg-teal-300/15 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {isEnglish ? 'Preview airflow' : '바람 소리 미리 듣기'}
          </button>
        </div>
        <ToggleRow icon={<Mic className="h-5 w-5" />} title={isEnglish ? 'Voice guidance' : '음성 안내'} description={isEnglish ? 'Use voice guidance at the start and finish.' : '호흡 시작과 완료를 음성으로 안내합니다.'} settingKey="voiceCuesEnabled" />
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-100">{isEnglish ? 'Voice' : '목소리'}</h4>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{isEnglish ? 'Choose the voice for the opening guidance.' : '시작 안내에 사용할 목소리를 선택합니다.'}</p>
          </div>
          <div className={`flex shrink-0 rounded-full bg-slate-950/30 p-1 transition-opacity ${settings.voiceCuesEnabled ? 'opacity-100' : 'pointer-events-none opacity-45'}`}>
            {[
              { value: 'female', label: isEnglish ? 'Female' : '여성' },
              { value: 'male', label: isEnglish ? 'Male' : '남성' }
            ].map((voice) => (
              <button
                key={voice.value}
                onClick={() => onUpdateSettings({ ...settings, voiceGender: voice.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  settings.voiceGender === voice.value
                    ? 'bg-teal-300 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
                aria-pressed={settings.voiceGender === voice.value}
              >
                {voice.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </details>

      <details className="group overflow-hidden rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 shadow-sm transition-colors open:border-teal-300/45 open:bg-teal-950/25 open:shadow-[0_0_0_1px_rgba(94,234,212,0.08)] dark:bg-slate-800/50 dark:open:bg-teal-950/25">
        <GroupHeader
          icon={<Sliders className="h-4 w-4" />}
          title={isEnglish ? 'Custom breathing' : '사용자 맞춤 호흡'}
          description={isEnglish ? 'Set inhale, hold, and exhale timing' : '들숨·멈춤·날숨 시간을 직접 조절합니다.'}
        />
        <div className="border-t border-white/10 p-5">
        <p className="text-xs leading-5 text-slate-500">
          {isEnglish ? 'Choose Custom breathing to use the timing below.' : '호흡법 선택에서 사용자 맞춤 호흡을 고르면 아래 비율로 세션이 진행됩니다.'}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NumberControl title={isEnglish ? '1. Inhale' : '1. 들이마시기'} hint={isEnglish ? 'Suggested: 4s' : '추천: 4초'} colorClass="text-teal-300" settingKey="customInhale" min={1} max={10} />
          <NumberControl title={isEnglish ? '2. Hold' : '2. 멈추기'} hint={isEnglish ? '0s to skip' : '0초면 생략'} colorClass="text-amber-300" settingKey="customHold" min={0} max={15} />
          <NumberControl title={isEnglish ? '3. Exhale' : '3. 내쉬기'} hint={isEnglish ? 'Suggested: 6s' : '추천: 6초'} colorClass="text-sky-300" settingKey="customExhale" min={1} max={15} />
          <NumberControl title={isEnglish ? '4. Hold empty' : '4. 빈 채 멈추기'} hint={isEnglish ? '0s to skip' : '0초면 생략'} colorClass="text-indigo-300" settingKey="customHold2" min={0} max={10} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-teal-300" />
            {isEnglish ? 'Custom ratio' : '맞춤 비율'}
          </span>
          <span className="text-sm font-bold text-teal-300">
            {settings.customInhale} - {settings.customHold > 0 ? `${settings.customHold} - ` : ''}{settings.customExhale}{settings.customHold2 > 0 ? ` - ${settings.customHold2}` : ''}{isEnglish ? 's' : '초'}
          </span>
        </div>
        </div>
      </details>
    </div>
  );
}
