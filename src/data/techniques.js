export const PHASE_THEME = {
  inhale: {
    colorClass: 'from-teal-100 to-teal-50 dark:from-teal-950/20 dark:to-slate-900',
    circleColor: 'bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-teal-500/30',
    glowColor: 'bg-teal-500/20',
    scale: 1.18
  },
  hold: {
    colorClass: 'from-amber-100 to-amber-50 dark:from-amber-950/20 dark:to-slate-900',
    circleColor: 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/30',
    glowColor: 'bg-amber-500/20',
    scale: 1.18
  },
  exhale: {
    colorClass: 'from-sky-100 to-sky-50 dark:from-sky-950/20 dark:to-slate-900',
    circleColor: 'bg-gradient-to-tr from-sky-500 to-indigo-400 shadow-sky-500/30',
    glowColor: 'bg-sky-500/20',
    scale: 0.85
  },
  rest: {
    colorClass: 'from-indigo-100 to-indigo-50 dark:from-indigo-950/20 dark:to-slate-900',
    circleColor: 'bg-gradient-to-tr from-indigo-500 to-violet-400 shadow-indigo-500/30',
    glowColor: 'bg-indigo-500/20',
    scale: 0.85
  }
};

export const TECHNIQUES = [
  {
    id: '4-2-6',
    name: '4-2-6 안정 호흡',
    description: '4초 들이마시고 2초 멈춘 뒤 6초 길게 내쉬는 기본 안정 호흡입니다.',
    rhythm: '4-2-6',
    introAudio: '/audio/426_intro.wav',
    outroAudio: '/audio/426_outro.wav',
    phases: [
      { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: 4, instruction: '넷까지 부드럽게 들이마셔요.' },
      { type: 'hold', label: '멈춰', speech: '멈춰', seconds: 2, instruction: '둘까지 가볍게 멈춰요.' },
      { type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: 6, instruction: '여섯까지 천천히 길게 내쉬어요.' }
    ]
  },
  {
    id: '4-7-8',
    name: '4-7-8 수면 호흡',
    description: '4초 들숨, 7초 멈춤, 8초 날숨으로 긴장을 낮추고 잠들기 전 마음을 가라앉힙니다.',
    rhythm: '4-7-8',
    phases: [
      { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: 4, instruction: '코로 조용히 들이마셔요.' },
      { type: 'hold', label: '멈춰', speech: '멈춰', seconds: 7, instruction: '몸에 힘을 빼고 숨을 머금어요.' },
      { type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: 8, instruction: '아주 천천히 끝까지 내쉬어요.' }
    ]
  },
  {
    id: 'box-breathing',
    name: '박스 호흡',
    description: '4초씩 들숨, 멈춤, 날숨, 멈춤을 반복하는 집중 회복 호흡입니다.',
    rhythm: '4-4-4-4',
    phases: [
      { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: 4, instruction: '한 변을 그리듯 천천히 들이마셔요.' },
      { type: 'hold', label: '멈춰', speech: '멈춰', seconds: 4, instruction: '고요하게 유지해요.' },
      { type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: 4, instruction: '같은 길이로 부드럽게 내쉬어요.' },
      { type: 'rest', label: '비워 멈춰', speech: '비워 멈춰', seconds: 4, instruction: '숨을 비운 채 편안히 머물러요.' }
    ]
  },
  {
    id: '4-4-6',
    name: '4-4-6 이완 호흡',
    description: '4초 들이마시고 4초 멈춘 뒤 6초 길게 내쉬어 안정감을 키웁니다.',
    rhythm: '4-4-6',
    phases: [
      { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: 4, instruction: '배와 가슴을 편안히 채워요.' },
      { type: 'hold', label: '멈춰', speech: '멈춰', seconds: 4, instruction: '어깨 힘은 내려놓아요.' },
      { type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: 6, instruction: '긴 숨으로 천천히 비워요.' }
    ]
  },
  {
    id: '5-5-coherent',
    name: '5-5 코히런트 호흡',
    description: '5초 들숨과 5초 날숨을 일정하게 반복해 균형 있는 리듬을 만듭니다.',
    rhythm: '5-5',
    phases: [
      { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: 5, instruction: '편안한 속도로 들이마셔요.' },
      { type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: 5, instruction: '같은 길이로 차분히 내쉬어요.' }
    ]
  },
  {
    id: 'belly-breathing',
    name: '복식 호흡',
    description: '가슴은 편안히 두고 배가 부풀고 내려앉는 감각에 집중하는 호흡입니다.',
    rhythm: '4-6',
    phases: [
      { type: 'inhale', label: '배로 들이마셔', speech: '배로 들이마셔', seconds: 4, instruction: '배가 풍선처럼 부풀어 오르게 해요.' },
      { type: 'exhale', label: '천천히 내쉬어', speech: '천천히 내쉬어', seconds: 6, instruction: '배가 자연스럽게 내려앉도록 내쉬어요.' }
    ]
  },
  {
    id: 'alternate-nostril',
    name: '교대 비공 호흡',
    description: '왼쪽과 오른쪽 콧구멍을 번갈아 쓰며 균형과 집중을 돕는 안내 호흡입니다.',
    rhythm: '4-4-4-4',
    phases: [
      { type: 'inhale', label: '왼쪽 들숨', speech: '오른쪽을 막고 왼쪽으로 들이마셔', seconds: 4, instruction: '오른쪽을 막고 왼쪽으로 들이마셔요.' },
      { type: 'exhale', label: '오른쪽 날숨', speech: '왼쪽을 막고 오른쪽으로 내쉬어', seconds: 4, instruction: '왼쪽을 막고 오른쪽으로 내쉬어요.' },
      { type: 'inhale', label: '오른쪽 들숨', speech: '왼쪽을 막고 오른쪽으로 들이마셔', seconds: 4, instruction: '오른쪽으로 다시 들이마셔요.' },
      { type: 'exhale', label: '왼쪽 날숨', speech: '오른쪽을 막고 왼쪽으로 내쉬어', seconds: 4, instruction: '왼쪽으로 천천히 내쉬어요.' }
    ]
  },
  {
    id: 'custom',
    name: '사용자 맞춤 호흡',
    description: '설정 화면에서 들숨, 멈춤, 날숨, 비운 멈춤 시간을 직접 조절합니다.',
    rhythm: '맞춤',
    custom: true
  }
];

export function getTechniqueById(id) {
  return TECHNIQUES.find((technique) => technique.id === id) || TECHNIQUES[0];
}

export function getTechniquePhases(technique, settings) {
  if (!technique?.custom) return technique.phases;

  const phases = [
    { type: 'inhale', label: '들이마셔', speech: '들이마셔', seconds: settings.customInhale, instruction: '설정한 길이만큼 부드럽게 들이마셔요.' }
  ];

  if (settings.customHold > 0) {
    phases.push({ type: 'hold', label: '멈춰', speech: '멈춰', seconds: settings.customHold, instruction: '편안하게 숨을 머금어요.' });
  }

  phases.push({ type: 'exhale', label: '내쉬어', speech: '내쉬어', seconds: settings.customExhale, instruction: '설정한 길이만큼 천천히 내쉬어요.' });

  if (settings.customHold2 > 0) {
    phases.push({ type: 'rest', label: '비워 멈춰', speech: '비워 멈춰', seconds: settings.customHold2, instruction: '숨을 비운 채 잠시 머물러요.' });
  }

  return phases;
}

export function getDurationLabel(technique, settings) {
  const phases = getTechniquePhases(technique, settings);
  return `${phases.map((phase) => phase.seconds).join(' - ')}초`;
}
