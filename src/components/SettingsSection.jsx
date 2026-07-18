import React from 'react';
import { Activity, Mic, Moon, Settings, Sliders, Smartphone, Sun, Timer, Volume2 } from 'lucide-react';

const DURATION_OPTIONS = [
  { label: '1분', value: 60 },
  { label: '2분', value: 120 },
  { label: '3분', value: 180 },
  { label: '5분', value: 300 },
  { label: '10분', value: 600 },
  { label: '15분', value: 900 },
  { label: '20분', value: 1200 }
];

export default function SettingsSection({ settings, onUpdateSettings }) {
  const toggleSetting = (key) => onUpdateSettings({ ...settings, [key]: !settings[key] });
  const setDuration = (seconds) => onUpdateSettings({ ...settings, defaultDurationSeconds: seconds });

  const adjustCustomPart = (key, delta, min, max) => {
    const value = Math.max(min, Math.min(max, (settings[key] || 0) + delta));
    onUpdateSettings({ ...settings, [key]: value });
  };

  const ToggleRow = ({ icon, title, description, settingKey }) => (
    <div className="p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-slate-800/20 transition-all duration-300">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-full bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{title}</h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => toggleSetting(settingKey)}
        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 outline-none ${settings[settingKey] ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow ${settings[settingKey] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  const NumberControl = ({ title, hint, colorClass, settingKey, min, max }) => (
    <div className="bg-slate-50 dark:bg-slate-800/20 rounded-xl p-3 flex justify-between items-center border border-slate-100 dark:border-slate-800/40">
      <div>
        <span className={`text-xs font-bold block ${colorClass}`}>{title}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>
      </div>
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => adjustCustomPart(settingKey, -1, min, max)}
          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold hover:opacity-80 active:scale-90 flex items-center justify-center text-sm cursor-pointer select-none text-slate-800 dark:text-slate-200"
        >
          -
        </button>
        <span className="text-sm font-bold w-6 text-center tabular-nums text-slate-800 dark:text-white">{settings[settingKey]}초</span>
        <button
          onClick={() => adjustCustomPart(settingKey, 1, min, max)}
          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold hover:opacity-80 active:scale-90 flex items-center justify-center text-sm cursor-pointer select-none text-slate-800 dark:text-slate-200"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 px-1">
        <Settings className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">설정 및 환경설정</h2>
      </div>

      <div className="glass-panel rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/40">
        <ToggleRow
          icon={settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          title="테마 모드"
          description="라이트 모드와 다크 모드를 전환합니다."
          settingKey="darkMode"
        />

        <div className="p-4 space-y-3.5 hover:bg-white/30 dark:hover:bg-slate-800/20 transition-all duration-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">기본 세션 시간</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">호흡 시작 시 적용되는 기본 시간을 정합니다.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 pl-1">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-300 ${
                  settings.defaultDurationSeconds === option.value
                    ? 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow icon={<Volume2 className="w-5 h-5" />} title="종소리 안내" description="단계가 바뀔 때 부드러운 소리를 재생합니다." settingKey="soundCuesEnabled" />
        <ToggleRow icon={<Mic className="w-5 h-5" />} title="음성 안내" description="각 호흡 단계를 한국어 음성으로 안내합니다." settingKey="voiceCuesEnabled" />
        <ToggleRow icon={<Smartphone className="w-5 h-5" />} title="진동 효과" description="지원 기기에서 미세한 진동 피드백을 사용합니다." settingKey="vibrationCuesEnabled" />
      </div>

      <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800/40">
          <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">사용자 맞춤 호흡 비율</h3>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          대시보드에서 사용자 맞춤 호흡을 선택하면 아래 비율로 세션이 진행됩니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <NumberControl title="1. 들이마시기" hint="추천: 4초" colorClass="text-teal-600 dark:text-teal-400" settingKey="customInhale" min={1} max={10} />
          <NumberControl title="2. 멈추기" hint="0초면 생략" colorClass="text-amber-600 dark:text-amber-400" settingKey="customHold" min={0} max={15} />
          <NumberControl title="3. 내쉬기" hint="추천: 6초" colorClass="text-sky-600 dark:text-sky-400" settingKey="customExhale" min={1} max={15} />
          <NumberControl title="4. 비운 채 멈추기" hint="0초면 생략" colorClass="text-indigo-600 dark:text-indigo-400" settingKey="customHold2" min={0} max={10} />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
          <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-teal-500" /> 맞춤 비율 요약</span>
          <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
            {settings.customInhale} - {settings.customHold > 0 ? `${settings.customHold} - ` : ''}{settings.customExhale}{settings.customHold2 > 0 ? ` - ${settings.customHold2}` : ''}초
          </span>
        </div>
      </div>
    </div>
  );
}
