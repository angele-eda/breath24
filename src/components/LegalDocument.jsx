import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const DOCUMENTS = {
  terms: {
    ko: {
      title: '이용약관',
      intro: '이 약관은 Breathe24 호흡 안내 서비스의 이용 조건을 설명합니다.',
      sections: [
        ['1. 서비스의 목적', 'Breathe24는 호흡 리듬, 타이머, 소리 및 기록 기능을 제공하여 사용자의 편안한 호흡 연습을 돕습니다.'],
        ['2. 이용 조건 및 건강 안내', '누구나 관계 법령과 이 약관에 따라 서비스를 이용할 수 있습니다. Breathe24는 일반적인 웰니스 도구이며 의료기기나 의료서비스가 아니고, 질병의 진단·치료 또는 의료 전문가의 조언을 대신하지 않습니다. 불편함이 느껴지면 즉시 중단하고 필요한 경우 의료 전문가와 상담하세요.'],
        ['3. 유료 기능, 결제 및 환불', '향후 유료 기능이 제공되는 경우 가격과 이용 조건을 결제 전에 명확히 안내합니다. Google Play를 통한 결제는 Google Play 결제 정책이 적용되며, 구매 취소와 환불은 관계 법령 및 해당 스토어 정책에 따라 처리됩니다. 중복 결제나 기능 미제공 등 문제가 있으면 문의처로 알려주세요.'],
        ['4. 금지행위', '서비스의 정상 운영을 방해하거나, 무단 복제·변조·역설계하거나, 타인의 권리를 침해하거나, 법령 또는 공공질서에 위반되는 방식으로 서비스를 이용해서는 안 됩니다.'],
        ['5. 면책사항', '이용자는 자신의 건강 상태와 환경을 고려해 안전하게 이용해야 합니다. 관련 법령이 허용하는 범위에서, 이용자의 건강 판단, 부적절한 사용, 기기·네트워크 환경 또는 통제할 수 없는 사유로 발생한 손해에 대해 책임을 지지 않습니다.'],
        ['6. 서비스 변경 및 중단', '기능 개선, 유지보수, 정책 변경 또는 불가피한 사정으로 서비스의 전부 또는 일부가 변경·중단될 수 있습니다. 중요한 변경은 가능한 범위에서 서비스 안에 안내합니다.'],
        ['7. 약관 변경', '이 약관이 변경되면 시행일과 변경 내용을 이 화면에 표시합니다. 변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 봅니다.'],
        ['8. 문의처', '서비스, 결제 또는 약관 관련 문의: 1004dayu@gmail.com']
      ]
    },
    en: {
      title: 'Terms of Use',
      intro: 'These terms explain the conditions for using the Breathe24 breathing guidance service.',
      sections: [
        ['1. Purpose', 'Breathe24 provides breathing rhythms, timers, sounds, and session records to support comfortable breathing practice.'],
        ['2. Conditions and health notice', 'You may use the service subject to applicable law and these terms. Breathe24 is a general wellness tool, not a medical device or medical service, and it does not replace diagnosis, treatment, or professional medical advice. Stop if you feel unwell and consult a medical professional when appropriate.'],
        ['3. Paid features, payment, and refunds', 'If paid features are introduced, the price and conditions will be shown clearly before purchase. Google Play purchases are governed by Google Play billing policies. Cancellations and refunds are handled under applicable law and the relevant store policy. Contact us about duplicate charges or unavailable purchased features.'],
        ['4. Prohibited conduct', 'You may not disrupt the service, copy, alter, or reverse-engineer it without authorization, infringe another person’s rights, or use it in violation of law or public order.'],
        ['5. Disclaimer', 'Use the service safely in light of your health and surroundings. To the extent permitted by law, we are not liable for loss caused by personal health decisions, misuse, device or network conditions, or events outside our reasonable control.'],
        ['6. Changes and availability', 'The service may be changed or suspended for improvements, maintenance, policy changes, or unavoidable circumstances. Material changes will be announced in the service where reasonably possible.'],
        ['7. Changes to these terms', 'If these terms change, the effective date and updated text will be shown here. Continued use after a change means acceptance of the updated terms.'],
        ['8. Contact', 'Questions about the service, billing, or these terms: 1004dayu@gmail.com']
      ]
    }
  },
  privacy: {
    ko: {
      title: '개인정보처리방침',
      intro: 'Breathe24는 필요한 정보만 사용하고, 사용자의 호흡 기록과 설정을 기기 안에 보관하는 것을 원칙으로 합니다.',
      sections: [
        ['1. 수집·이용하는 정보', '회원가입은 요구하지 않습니다. 닉네임, 프로필 사진, 호흡 기록, 앱·언어 설정은 기기 로컬 저장소에 저장되어 프로필 표시, 기록 계산과 설정 유지에 이용됩니다. 서비스 제공 과정에서 IP 주소, 접속 시각, 기기·브라우저 정보가 호스팅 사업자에 의해 자동 처리될 수 있습니다.'],
        ['2. AdMob 광고', '향후 Google AdMob 광고가 도입되면 Google과 광고 파트너가 광고 제공, 빈도 제한, 부정 이용 방지, 측정 및 동의한 경우 맞춤 광고를 위해 광고 식별자, IP 주소, 대략적 위치, 기기·앱 정보와 광고 상호작용 정보를 처리할 수 있습니다. 도입 시 앱에서 필요한 동의와 광고 선택권을 제공합니다.'],
        ['3. Google Play 결제', '유료 기능 도입 시 Google Play가 결제 수단과 결제 정보를 처리합니다. Breathe24는 구매 확인과 기능 제공, 환불 지원을 위해 주문·거래 식별자, 구매 상품, 결제 상태와 구매 시각을 처리할 수 있으며 카드번호 전체를 직접 수집하지 않습니다.'],
        ['4. 보관 및 삭제', '로컬 정보는 사용자가 기록 또는 사이트·앱 데이터를 삭제할 때까지 보관됩니다. 결제 관련 기록은 전자상거래 등 관계 법령이 요구하는 기간 동안 보관 후 삭제하며, 광고 사업자가 처리한 정보는 해당 사업자의 보관 정책을 따릅니다.'],
        ['5. 제3자 처리', '현재 로컬 호흡 기록과 프로필 설정을 판매하지 않습니다. 광고·결제가 도입되면 Google AdMob, Google Play 및 호스팅 사업자가 각자의 방침과 관계 법령에 따라 필요한 정보를 처리할 수 있습니다.'],
        ['6. 이용자의 권리', '이용자는 기록 화면에서 호흡 기록을 삭제하고 브라우저 또는 설치된 앱의 데이터 삭제 기능으로 로컬 정보를 제거할 수 있습니다. 광고 맞춤설정은 기기 또는 Google 계정의 광고 설정에서 변경할 수 있으며, 개인정보 관련 열람·정정·삭제 문의도 할 수 있습니다.'],
        ['7. 아동의 개인정보', '법정대리인의 동의가 필요한 연령의 아동을 대상으로 개인정보를 의도적으로 수집하지 않습니다. 향후 광고 또는 결제를 제공할 때에는 연령과 지역에 맞는 보호 조치를 적용합니다.'],
        ['8. 안전성 및 방침 변경', '최소한의 정보만 처리하도록 설계하고 있으며, 기능이나 처리 방식이 달라지면 시행 전에 이 방침을 갱신합니다. 공동 기기에서는 기기 잠금 등 기본 보안 설정을 권장합니다.'],
        ['9. 문의 이메일', '개인정보 및 이용자 권리 관련 문의: 1004dayu@gmail.com']
      ]
    },
    en: {
      title: 'Privacy Policy',
      intro: 'Breathe24 uses only the information needed for the service and keeps breathing records and preferences on your device by default.',
      sections: [
        ['1. Information collected and used', 'No account is required. Nickname, profile image, breathing records, and app and language preferences stay in local device storage and are used for the profile, record calculations, and preferences. The hosting provider may automatically process IP address, access time, and device and browser details when delivering the service.'],
        ['2. AdMob advertising', 'If Google AdMob is introduced, Google and advertising partners may process advertising identifiers, IP address, approximate location, device and app information, and ad interactions to deliver ads, limit frequency, prevent fraud, measure performance, and, with consent, personalize ads. Required consent and ad choices will be provided in the app before launch.'],
        ['3. Google Play billing', 'If paid features are introduced, Google Play will process payment methods and payment data. Breathe24 may process order or transaction identifiers, purchased item, payment status, and purchase time to verify purchases, unlock features, and support refunds. It will not directly collect full card numbers.'],
        ['4. Retention and deletion', 'Local data remains until you delete records or clear site or app data. Purchase records may be retained for periods required by commerce and tax law and then deleted. Data processed by advertising providers follows their retention policies.'],
        ['5. Third-party processing', 'Local breathing records and profile preferences are not sold. If ads or billing are launched, Google AdMob, Google Play, and the hosting provider may process necessary information under their own policies and applicable law.'],
        ['6. Your rights', 'You can delete breathing records in History and remove local information by clearing browser or installed app data. Change ad personalization in device or Google Account ad settings. You may also request access, correction, or deletion by contacting us.'],
        ['7. Children’s privacy', 'We do not intentionally collect personal information from children whose age requires parental consent. Age- and region-appropriate safeguards will be applied before advertising or billing is offered.'],
        ['8. Security and changes', 'The service is designed to minimize information handling. This policy will be updated before material practices change. Device locking is recommended on shared devices.'],
        ['9. Contact email', 'Privacy and user-rights inquiries: 1004dayu@gmail.com']
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
