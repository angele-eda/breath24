import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const DOCUMENTS = {
  terms: {
    ko: {
      title: '이용약관',
      intro: '이 약관은 Breathe24 호흡 안내 서비스의 이용 조건을 설명합니다.',
      sections: [
        ['1. 서비스의 목적', 'Breathe24는 호흡 리듬, 타이머, 소리 및 기록 기능을 제공하여 사용자의 편안한 호흡 연습을 돕습니다.'],
        ['2. 의료 서비스가 아닙니다', 'Breathe24는 의료기기나 진단·치료 서비스가 아닙니다. 어지러움, 통증, 호흡 곤란 또는 불편함이 느껴지면 즉시 사용을 중단하고 필요한 경우 의료 전문가와 상담하세요.'],
        ['3. 이용자의 책임', '이용자는 자신의 건강 상태와 주변 환경을 고려하여 안전한 장소에서 서비스를 이용해야 합니다. 운전 중이거나 집중이 필요한 기기를 조작하는 중에는 사용하지 마세요.'],
        ['4. 기록과 설정', '호흡 기록, 닉네임, 프로필 사진 및 설정은 현재 사용하는 브라우저 또는 기기에 저장됩니다. 브라우저 데이터 삭제, 기기 변경 또는 앱 삭제 시 복구되지 않을 수 있습니다.'],
        ['5. 서비스 변경 및 중단', '기능 개선, 유지보수 또는 불가피한 사정으로 서비스의 일부가 변경되거나 일시 중단될 수 있습니다. 중요한 변경이 있는 경우 서비스 안에서 안내합니다.'],
        ['6. 책임의 범위', '서비스는 일반적인 웰니스 도구로 제공됩니다. 관련 법령이 허용하는 범위에서, 이용자의 건강 판단이나 기기·브라우저 환경으로 발생한 손해에 대해 보증하지 않습니다.'],
        ['7. 약관 변경', '이 약관이 변경되면 시행일과 변경 내용을 이 화면에 표시합니다. 변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 봅니다.']
      ]
    },
    en: {
      title: 'Terms of Use',
      intro: 'These terms explain the conditions for using the Breathe24 breathing guidance service.',
      sections: [
        ['1. Purpose', 'Breathe24 provides breathing rhythms, timers, sounds, and session records to support comfortable breathing practice.'],
        ['2. Not medical care', 'Breathe24 is not a medical device and does not provide diagnosis or treatment. Stop immediately if you feel dizzy, short of breath, in pain, or otherwise unwell, and seek professional medical advice when appropriate.'],
        ['3. Your responsibility', 'Consider your health and surroundings and use the service in a safe place. Do not use it while driving or operating equipment that requires attention.'],
        ['4. Records and settings', 'Breathing records, nickname, profile image, and settings are stored in your current browser or device. They may not be recoverable after clearing browser data, changing devices, or removing the app.'],
        ['5. Changes and availability', 'Parts of the service may change or become temporarily unavailable for improvements, maintenance, or circumstances beyond our control. Material changes will be announced in the service.'],
        ['6. Limitation', 'The service is provided as a general wellness tool. To the extent permitted by law, no guarantee is made against loss arising from personal health decisions or the user’s device and browser environment.'],
        ['7. Changes to these terms', 'If these terms change, the effective date and updated text will be shown here. Continued use after a change means acceptance of the updated terms.']
      ]
    }
  },
  privacy: {
    ko: {
      title: '개인정보처리방침',
      intro: 'Breathe24는 필요한 정보만 사용하고, 사용자의 호흡 기록과 설정을 기기 안에 보관하는 것을 원칙으로 합니다.',
      sections: [
        ['1. 처리하는 정보', '회원가입을 요구하지 않습니다. 사용자가 입력하거나 생성한 닉네임, 프로필 사진, 호흡 기록, 앱 설정 및 언어 설정은 브라우저의 로컬 저장소에 보관됩니다.'],
        ['2. 이용 목적', '해당 정보는 프로필 표시, 호흡 기록과 연속 기록 계산, 소리·언어·테마 등 개인 설정 유지에만 사용됩니다.'],
        ['3. 보관 위치와 기간', '앱에서 생성한 정보는 사용자의 브라우저 또는 설치된 PWA의 로컬 저장소에 보관됩니다. 사용자가 기록을 삭제하거나 브라우저 데이터 또는 앱을 삭제할 때까지 유지됩니다.'],
        ['4. 외부 전송 및 제3자 제공', 'Breathe24는 앱에 저장된 닉네임, 프로필 사진, 호흡 기록 및 개인 설정을 운영 서버로 전송하거나 제3자에게 판매하지 않습니다. 다만 웹사이트 제공 과정에서 IP 주소, 접속 시각, 브라우저 정보와 같은 일반적인 접속 기록이 호스팅 제공자에게 자동 처리될 수 있습니다.'],
        ['5. 쿠키와 분석 도구', '현재 맞춤 광고, 행동 추적 또는 별도의 방문자 분석 도구를 사용하지 않습니다. 서비스 기능 유지를 위한 브라우저 로컬 저장소만 사용합니다.'],
        ['6. 정보 삭제와 이용자 선택', '기록 화면의 전체 삭제 기능으로 호흡 기록을 삭제할 수 있습니다. 닉네임·사진·설정은 브라우저 사이트 데이터 삭제 또는 설치된 앱 데이터 삭제를 통해 제거할 수 있습니다.'],
        ['7. 안전성', '정보가 외부 서버로 전송되지 않도록 최소 수집 방식으로 설계했지만, 공동 기기 사용이나 기기 분실 시 다른 사람이 로컬 정보를 볼 수 있으므로 기기 잠금 등 기본 보안 설정을 권장합니다.'],
        ['8. 방침 변경', '기능이나 정보 처리 방식이 달라질 경우 이 방침을 먼저 갱신하고 시행일을 표시합니다.']
      ]
    },
    en: {
      title: 'Privacy Policy',
      intro: 'Breathe24 uses only the information needed for the service and keeps breathing records and preferences on your device by default.',
      sections: [
        ['1. Information handled', 'No account is required. Your nickname, profile image, breathing records, app preferences, and language choice are stored in browser local storage.'],
        ['2. How it is used', 'This information is used only to show your profile, calculate session and streak records, and retain preferences such as sound, language, and theme.'],
        ['3. Storage and retention', 'App-generated information remains in your browser or installed PWA storage until you delete records, clear site data, or remove the app and its data.'],
        ['4. Transfers and third parties', 'Breathe24 does not send locally stored nicknames, profile images, breathing records, or personal preferences to its operator’s server or sell them to third parties. Standard connection data such as IP address, access time, and browser details may be processed automatically by the hosting provider when the website is delivered.'],
        ['5. Cookies and analytics', 'Breathe24 currently uses no personalized advertising, behavioral tracking, or separate visitor analytics. Browser local storage is used only to maintain app features.'],
        ['6. Deletion and choices', 'Delete breathing records with the clear-history control. Remove nickname, image, and preferences by clearing the site data in your browser or deleting the installed app data.'],
        ['7. Security', 'The service is designed to minimize external data transfer. On a shared or lost device, another person may be able to view local information, so device locking and other basic safeguards are recommended.'],
        ['8. Policy changes', 'If features or data practices change, this policy will be updated first and the new effective date will be displayed.']
      ]
    }
  }
};

export default function LegalDocument({ type, language = 'ko', onBack }) {
  const document = DOCUMENTS[type]?.[language === 'ko' ? 'ko' : 'en'] || DOCUMENTS.terms.en;
  const isEnglish = language !== 'ko';

  return (
    <article className="mx-auto w-full max-w-[480px] px-5 pb-10 pt-6 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#36566D] transition-colors hover:bg-white hover:text-[#0E9F90] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEnglish ? 'Back' : '돌아가기'}
      </button>

      <div className="rounded-2xl border border-[#DCE8EC] bg-white p-5 shadow-[0_4px_14px_rgba(30,70,90,0.08)] dark:border-[#334A5F] dark:bg-slate-800/55 sm:p-6">
        <div className="flex items-center gap-2 text-[#0E9F90] dark:text-teal-300">
          <ShieldCheck className="h-5 w-5" />
          <h1 className="text-xl font-bold text-[#172F47] dark:text-white">{document.title}</h1>
        </div>
        <p className="mt-3 break-keep text-sm font-medium leading-6 text-[#506A7D] dark:text-slate-300">{document.intro}</p>
        <p className="mt-3 text-[11px] font-semibold text-[#7890A3] dark:text-slate-500">
          {isEnglish ? 'Effective: August 12, 2026' : '시행일: 2026년 8월 12일'}
        </p>

        <div className="mt-7 space-y-6">
          {document.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-sm font-bold text-[#172F47] dark:text-slate-100">{heading}</h2>
              <p className="mt-2 break-keep text-sm font-medium leading-6 text-[#506A7D] dark:text-slate-300">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
