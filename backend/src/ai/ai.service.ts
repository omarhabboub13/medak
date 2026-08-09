import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  ask(question: string) {
    const q = question.toLowerCase();
    let answer =
      'أنا مساعد مدك الأولي. لست بديلاً عن الطبيب. إذا كانت الأعراض شديدة أو مستمرة، احجز استشارة طبية عبر المنصة.';

    if (
      q.includes('حمى') ||
      q.includes('fever') ||
      q.includes('حرارة')
    ) {
      answer =
        'ارتفاع الحرارة شائع مع العدوى. اشرب سوائل كافية، راقب الحرارة، واطلب استشارة طبية إذا تجاوزت 39° أو استمرت أكثر من يومين — خاصة للأطفال.';
    } else if (
      q.includes('صداع') ||
      q.includes('headache')
    ) {
      answer =
        'الصداع قد ينجم عن الإجهاد أو الجفاف أو الصداع النصفي. ارتج، اشرب ماءً، وتجنب الشاشات. إن كان مفاجئًا وشديدًا أو مع أعراض عصبية، راجع طبيبًا فورًا.';
    } else if (
      q.includes('جلد') ||
      q.includes('طفح') ||
      q.includes('rash')
    ) {
      answer =
        'الطفح الجلدي له أسباب متعددة. تجنّب الحكّ والمواد المهيجة. إذا صاحَبَه صعوبة تنفس أو تورم الوجه، هذه حالة طارئة. وإلا يمكن حجز طبيب جلدية عبر مدك.';
    } else if (
      q.includes('حجز') ||
      q.includes('طبيب') ||
      q.includes('موعد')
    ) {
      answer =
        'لحجز موعد: اذهب إلى «الأطباء»، اختر التخصص أو المحافظة، افتح صفحة الطبيب، اختر وقتًا من الفترات المتاحة، ثم أكّد الدفع من المحفظة.';
    }

    return {
      question,
      answer,
      disclaimer:
        'هذه إجابات توجيهية أولية فقط وليست تشخيصًا طبيًا. استشر طبيبًا عبر مدك عند الحاجة.',
      suggestedActions: [
        { label: 'تصفح الأطباء', href: '/dashboard/doctors' },
        { label: 'المحفظة', href: '/dashboard/wallet' },
      ],
    };
  }
}
