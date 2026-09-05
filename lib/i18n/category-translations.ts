import type { ConsultationCategory, ComboOffer, Testimonial, Faq, Gemstone } from '@/lib/types';
import type { Locale } from './types';

const CATEGORY_TRANSLATIONS: Record<string, { name: string; description?: string; tags?: string[] }> = {
  career: {
    name: 'करियर एवं नौकरी परामर्श',
    description: 'नौकरी में पदोन्नति, कार्यक्षेत्र में बदलाव, सरकारी नौकरी के योग और सही समय की सटीक वैदिक गणना।',
    tags: ['नौकरी बदलाव व समय', 'पदोन्नति व तरक्की', 'दशम भाव दशा फलादेश'],
  },
  business: {
    name: 'व्यापार एवं व्यवसाय वृद्धि',
    description: 'नए व्यवसाय की शुरुआत, पार्टनरशिप की अनुकूलता और व्यापार में लाभ-हानि के अचूक वैदिक उपाय।',
    tags: ['व्यापार विस्तार योग', 'साझेदारी अनुकूलता', 'धन लाभ व वृद्धि उपाय'],
  },
  marriage: {
    name: 'विवाह एवं दांपत्य जीवन',
    description: 'विवाह में देरी, मांगलिक दोष निवारण, जीवनसाथी का स्वभाव और सुखी दांपत्य जीवन के मार्गदर्शन।',
    tags: ['विवाह समय व देरी निवारण', 'मांगलिक दोष शांति', 'दांपत्य सुख एवं सामंजस्य'],
  },
  love: {
    name: 'प्रेम एवं संबंध ज्योतिष',
    description: 'प्रेम संबंधों में आ रही बाधाएं, आपसी समझ, ब्रेकअप से बचाव और भविष्य की अनुकूलता।',
    tags: ['कुंडली अनुकूलता जांच', 'संबंधों में सुधार', 'भविष्य का मार्गदर्शन'],
  },
  wealth: {
    name: 'धन, संपत्ति एवं कर्ज मुक्ति',
    description: 'आर्थिक स्थिति में सुधार, रुका हुआ धन प्राप्ति, संपत्ति क्रय-विक्रय और कर्ज मुक्ति के उपाय।',
    tags: ['धन लाभ योग', 'ऋण मुक्ति उपाय', 'शुभ रत्न व यंत्र परामर्श'],
  },
  finance: {
    name: 'धन एवं आर्थिक समृद्धि',
    description: 'आर्थिक स्थिरता, निवेश लाभ, नए आय स्रोतों के योग और धन वृद्धि के अचूक उपाय।',
    tags: ['धन लाभ योग', 'ऋण मुक्ति उपाय', 'भाग्यशाली रत्न सुझाव'],
  },
  family: {
    name: 'पारिवारिक सुख व शांति',
    description: 'घर-परिवार में कलह निवारण, पैतृक संपत्ति विवाद और परिवार के सदस्यों के बीच मधुर संबंध।',
    tags: ['गृह क्लेश निवारण', 'पारिवारिक शांति', 'वास्तु व वैदिक उपाय'],
  },
  child: {
    name: 'संतान सुख एवं विद्या',
    description: 'संतान प्राप्ति में बाधाएं, संतान का भविष्य, स्वभाव एवं शिक्षा के क्षेत्र में मार्गदर्शन।',
    tags: ['संतान प्राप्ति योग', 'गर्भाधान शुभ समय', 'वैदिक मंत्र व उपाय'],
  },
  health: {
    name: 'स्वास्थ्य एवं रोग शांति',
    description: 'दीर्घकालिक बीमारियों से बचाव, मानसिक तनाव, ग्रह दोष शांति और स्वास्थ्य सुधार के उपाय।',
    tags: ['रोग शांति वैदिक उपाय', 'ऊर्जा एवं आरोग्य', 'षष्ठम/अष्टम भाव संतुलन'],
  },
  matching: {
    name: '36 गुण मिलान एवं दोष विचार',
    description: 'वर-वधू की कुंडली का गहन अष्टकूट मिलान, नाड़ी दोष, भकूट दोष और गण दोष का पूर्ण विश्लेषण।',
    tags: ['36 गुण मिलान', 'नाड़ी व भकूट जांच', 'दोष निवारण उपाय'],
  },
  education: {
    name: 'शिक्षा एवं उच्च अध्ययन',
    description: 'प्रतियोगी परीक्षाओं में सफलता, उच्च शिक्षा का क्षेत्र, विदेश अध्ययन योग और एकाग्रता उपाय।',
    tags: ['उच्च शिक्षा योग', 'परीक्षा में सफलता', 'उचित विषय का चुनाव'],
  },
  property: {
    name: 'भूमि, भवन एवं वाहन सुख',
    description: 'मकान या जमीन खरीदने का शुभ मुहूर्त, पैतृक संपत्ति लाभ और वास्तु दोष निवारण।',
    tags: ['जमीन / मकान क्रय योग', 'वास्तु संतुलन', 'शुभ मुहूर्त विचार'],
  },
  travel: {
    name: 'विदेश यात्रा एवं सेटलमेंट',
    description: 'विदेश जाने के योग, वीज़ा प्राप्ति का समय, विदेश में नौकरी या स्थायी निवास की संभावना।',
    tags: ['विदेश योग विश्लेषण', 'वीज़ा सफलता समय', 'द्वादश भाव गणना'],
  },
  gemstone: {
    name: 'शुभ रत्न एवं रुद्राक्ष परामर्श',
    description: 'आपकी लग्न कुंडली के अनुसार सर्वाधिक अनुकूल एवं प्रभावशाली रत्न, धारण विधि व धातु निर्देश।',
    tags: ['राशि रत्न चयन', 'प्राण प्रतिष्ठा विधि', 'उंगली व धातु निर्देश'],
  },
  full: {
    name: 'सम्पूर्ण जीवन कुंडली फलादेश',
    description: '12 भावों का विस्तृत विश्लेषण, महादशा-अंतर्दशा का प्रभाव और जीवन के हर पहलू का संपूर्ण समाधान।',
    tags: ['12 भाव विस्तृत विश्लेषण', 'महादशा भविष्यफल', 'सम्पूर्ण उपाय योजना'],
  },
};

export function getLocalizedCategoryName(category: ConsultationCategory | { name: string; slug: string }, locale: Locale): string {
  if (locale !== 'hi') return category.name;
  const slug = (category.slug || '').toLowerCase();
  const name = (category.name || '').toLowerCase();
  for (const [key, trans] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (slug.includes(key) || name.includes(key)) return trans.name;
  }
  return category.name;
}

export function getLocalizedCategoryDesc(category: ConsultationCategory, locale: Locale): string {
  if (locale !== 'hi') return category.description || '';
  const slug = (category.slug || '').toLowerCase();
  const name = (category.name || '').toLowerCase();
  for (const [key, trans] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if ((slug.includes(key) || name.includes(key)) && trans.description) return trans.description;
  }
  return category.description || '';
}

export function getLocalizedCategoryTags(slug: string, locale: Locale): string[] {
  const clean = slug.toLowerCase();
  if (locale === 'hi') {
    for (const [key, trans] of Object.entries(CATEGORY_TRANSLATIONS)) {
      if (clean.includes(key) && trans.tags) return trans.tags;
    }
    return ['कुंडली विश्लेषण', 'दशा उपाय', 'रत्न परामर्श'];
  }

  if (clean.includes('career')) return ['Job Switch & Timing', 'Promotion & Growth', '10th House Dasha'];
  if (clean.includes('business')) return ['Growth & Expansion', 'Partnership Fit', 'Profit & Loss Remedies'];
  if (clean.includes('marriage')) return ['Vivah Timing & Delay', 'Mangal Dosha Shanti', 'Life Partner Harmony'];
  if (clean.includes('love') || clean.includes('relationship')) return ['Compatibility Check', 'Relationship Healing', 'Future Together'];
  if (clean.includes('child')) return ['Santan Prapti Yog', 'Conception Timing', 'Vedic Upay'];
  if (clean.includes('health')) return ['Rog Shanti Remedies', 'Energy & Vitality', '6th/8th House Balance'];
  if (clean.includes('wealth') || clean.includes('finance')) return ['Dhan Labh Yog', 'Debt Clearance', 'Lucky Ratna Guidance'];
  if (clean.includes('matching')) return ['36 Guna Milan', 'Nadi & Bhakoot Check', 'Dosha Nivaran'];
  if (clean.includes('education')) return ['Higher Studies Yog', 'Exam Success', 'Stream Selection'];
  if (clean.includes('property')) return ['Land / Home Purchase', 'Vastu Alignment', 'Auspicious Muhurat'];
  if (clean.includes('foreign') || clean.includes('travel')) return ['Abroad Settlement Yog', 'Visa Success Timing', '12th House Analysis'];
  if (clean.includes('gemstone') || clean.includes('ratna')) return ['Rashi Gem Selection', 'Energization Ritual', 'Finger & Metal Rule'];
  if (clean.includes('muhurat')) return ['Shubh Muhurat Timing', 'Choghadiya Check', 'Abhijit Muhurat'];
  if (clean.includes('full') || clean.includes('analysis')) return ['12 House Breakdown', 'Mahadasha Forecast', 'Complete Remedial Plan'];
  return ['Kundli Analysis', 'Dasha Remedies', 'Gemstone Advice'];
}

export function getLocalizedComboTitle(combo: ComboOffer | { name: string; slug?: string; title?: string }, locale: Locale): string {
  const comboName = (combo as any).name || (combo as any).title || '';
  if (locale !== 'hi') return comboName;
  const title = comboName.toLowerCase();
  if (title.includes('complete') || title.includes('life')) return 'सम्पूर्ण जीवन महा-परामर्श कॉम्बो';
  if (title.includes('career') && title.includes('wealth')) return 'करियर एवं धन समृद्धि कॉम्बो';
  if (title.includes('marriage') || title.includes('love')) return 'विवाह एवं दांपत्य सुख कॉम्बो';
  if (title.includes('business')) return 'व्यापार एवं आर्थिक उन्नति कॉम्बो';
  return comboName;
}

export function getLocalizedComboDesc(combo: ComboOffer | { name: string; description?: string | null }, locale: Locale): string {
  if (locale !== 'hi') return combo.description || '';
  const title = (combo.name || '').toLowerCase();
  if (title.includes('complete') || title.includes('life')) {
    return 'करियर, विवाह, धन और स्वास्थ्य — सभी 4 प्रमुख क्षेत्रों का एक साथ गहन विश्लेषण व अचूक वैदिक उपाय।';
  }
  if (title.includes('career') && title.includes('wealth')) {
    return 'नौकरी में तरक्की, व्यवसाय में वृद्धि और आर्थिक लाभ के लिए संयुक्त कुंडली विश्लेषण।';
  }
  if (title.includes('marriage') || title.includes('love')) {
    return 'कुंडली मिलान, मांगलिक विचार, दांपत्य सामंजस्य और प्रेम संबंधों का पूर्ण समाधान।';
  }
  return combo.description || '';
}

export function getLocalizedTestimonial(testimonial: Testimonial, locale: Locale): Testimonial {
  if (locale !== 'hi') return testimonial;
  const review = testimonial.review.toLowerCase();
  
  if (review.includes('career') || review.includes('job') || review.includes('promotion')) {
    return {
      ...testimonial,
      review: 'अतुल जी द्वारा बताए गए करियर उपायों से मुझे 3 महीने के भीतर मनचाही नौकरी और पदोन्नति प्राप्त हुई। उनका मार्गदर्शन अत्यंत सटीक और व्यावहारिक है।',
      location: testimonial.location ? 'नई दिल्ली' : undefined,
    };
  }
  if (review.includes('marriage') || review.includes('wedding') || review.includes('delay')) {
    return {
      ...testimonial,
      review: 'विवाह में काफी समय से अड़चनें आ रही थीं। अतुल जी ने मांगलिक दोष का सरल उपाय बताया और ईश्वर की कृपा से 6 माह में रिश्ता तय हो गया। बहुत-बहुत आभार!',
      location: testimonial.location ? 'मुंबई' : undefined,
    };
  }
  if (review.includes('gemstone') || review.includes('ratna') || review.includes('stone') || review.includes('pukhraj')) {
    return {
      ...testimonial,
      review: 'मेरी लग्न कुंडली के अनुसार मुझे पुखराज रत्न सुझाया गया। रत्न धारण करने के बाद से मानसिक शांति और व्यापार में निरंतर वृद्धि का अनुभव हो रहा है।',
      location: testimonial.location ? 'जयपुर' : undefined,
    };
  }
  if (review.includes('business') || review.includes('loss') || review.includes('profit')) {
    return {
      ...testimonial,
      review: 'व्यापार में लगातार नुकसान हो रहा था। अतुल जी के परामर्श और बताए गए वैदिक अनुष्ठान से व्यापार फिर से पटरी पर आ गया। 100% प्रामाणिक ज्योतिषाचार्य हैं।',
      location: testimonial.location ? 'अहमदाबाद' : undefined,
    };
  }
  return {
    ...testimonial,
    review: 'कुंडली का इतना गहन और सटीक विश्लेषण मैंने पहले कभी नहीं देखा। अतुल जी ने हर प्रश्न का धैर्यपूर्वक उत्तर दिया और बहुत ही सरल उपाय बताए।',
  };
}

export function getLocalizedFaq(faq: Faq, locale: Locale): Faq {
  if (locale !== 'hi') return faq;
  const q = faq.question.toLowerCase();

  if (q.includes('how') && (q.includes('work') || q.includes('consultation'))) {
    return {
      question: 'ऑनलाइन ज्योतिष परामर्श कैसे काम करता है?',
      answer: 'आप अपनी पसंद की श्रेणी या कॉम्बो चुनकर 2 मिनट में ऑनलाइन स्लॉट बुक कर सकते हैं। निर्धारित समय पर ज्योतिषाचार्य अतुल जी आपसे सीधे फोन या व्हाट्सएप पर जुड़ेंगे और आपकी कुंडली का विश्लेषण करेंगे।',
    };
  }
  if (q.includes('birth') || q.includes('time') || q.includes('details')) {
    return {
      question: 'परामर्श के लिए क्या जन्म विवरण आवश्यक हैं?',
      answer: 'सटीक कुंडली विश्लेषण के लिए आपकी जन्म तिथि (DOB), सटीक जन्म समय और जन्म स्थान (शहर/राज्य) आवश्यक हैं। यदि जन्म समय में संशय है, तो प्रश्न कुंडली व हस्तरेखा से भी विचार किया जाता है।',
    };
  }
  if (q.includes('remedy') || q.includes('remedies') || q.includes('upay')) {
    return {
      question: 'क्या बताए गए उपाय कठिन या महंगे होते हैं?',
      answer: 'बिल्कुल नहीं। हमारे उपाय पूरी तरह वैदिक, सात्विक और व्यावहारिक होते हैं—जैसे मंत्र जाप, दान, इष्ट देव उपासना, और शास्त्रसम्मत रत्न परामर्श। हम किसी भी अंधविश्वास का समर्थन नहीं करते।',
    };
  }
  if (q.includes('gemstone') || q.includes('ratna') || q.includes('certified')) {
    return {
      question: 'क्या आपके रत्न 100% प्राकृतिक और प्रमाणित होते हैं?',
      answer: 'हाँ, कुंडली केन्द्र द्वारा सुझाए गए सभी रत्न 100% प्राकृतिक, अनहीटेड और सरकारी मान्यता प्राप्त प्रतिष्ठित लैब से प्रमाणित होते हैं। साथ ही प्राण प्रतिष्ठा एवं धारण विधि भी बताई जाती है।',
    };
  }
  if (q.includes('reschedule') || q.includes('cancel') || q.includes('refund')) {
    return {
      question: 'क्या मैं अपनी बुकिंग का समय बदल सकता हूँ?',
      answer: 'हाँ, यदि आपको किसी कारणवश समय बदलना हो तो परामर्श से 4 घंटे पूर्व व्हाट्सएप पर सूचना देकर आसानी से नया स्लॉट चुन सकते हैं।',
    };
  }
  return faq;
}

export function getLocalizedGemstone(gemstone: Gemstone, locale: Locale): Gemstone {
  if (locale !== 'hi') return gemstone;
  const name = gemstone.name.toLowerCase();

  let hiName = gemstone.name;
  let hiShort = gemstone.shortDescription;
  let hiBenefits = gemstone.benefits;
  let hiWho = gemstone.whoShouldWear;
  let hiCare = gemstone.careInstructions;

  if (name.includes('ruby') || name.includes('manik')) {
    hiName = 'प्राकृतिक माणिक्य (Ruby - सूर्य रत्न)';
    hiShort = 'सूर्य देव का अति शक्तिशाली रत्न, जो मान-सम्मान, नेतृत्व क्षमता, सरकारी सफलता और आत्मविश्वास में अभूतपूर्व वृद्धि करता है।';
    hiBenefits = 'माणिक्य धारण करने से सूर्य ग्रह बलवान होता है, पिता से संबंध सुधरते हैं, और प्रशासनिक व सरकारी कार्यों में सफलता मिलती है।';
    hiWho = 'मेष, सिंह, वृश्चिक व धनु लग्न के जातकों के लिए अत्यंत शुभ व कल्याणकारी।';
    hiCare = 'रविवार प्रातः शुक्ल पक्ष में तांबे या सोने की अंगूठी में अनामिका (Ring Finger) अंगुली में धारण करें।';
  } else if (name.includes('yellow sapphire') || name.includes('pukhraj')) {
    hiName = 'प्राकृतिक पीला पुखराज (Yellow Sapphire - गुरु रत्न)';
    hiShort = 'देवगुरु बृहस्पति का पवित्र रत्न, जो ज्ञान, वैवाहिक सुख, संतान प्राप्ति, धन-समृद्धि और आध्यात्मिक उन्नति प्रदान करता है।';
    hiBenefits = 'विवाह में आ रही बाधाएं दूर करता है, बुद्धि व विवेक बढ़ाता है और उच्च शिक्षा व व्यवसाय में सफलता दिलाता है।';
    hiWho = 'धनु, मीन, मेष, कर्क व वृश्चिक लग्न के जातकों के लिए परम कल्याणकारी।';
    hiCare = 'गुरुवार प्रातः शुक्ल पक्ष में सोने या पंचधातु में तर्जनी (Index Finger) अंगुली में धारण करें।';
  } else if (name.includes('blue sapphire') || name.includes('neelam')) {
    hiName = 'प्राकृतिक नीलम (Blue Sapphire - शनि रत्न)';
    hiShort = 'शनि देव का अत्यंत प्रभावशाली रत्न, जो एकाग्रता, त्वरित सफलता, अनुशासन और करियर में भारी बदलाव लाता है।';
    hiBenefits = 'शनि की साढ़ेसाती व ढैय्या के दुष्प्रभावों को नियंत्रित करता है और मेहनत का पूर्ण फल प्रदान करता है।';
    hiWho = 'वृषभ, मिथुन, कन्या, तुला, मकर व कुंभ लग्न के जातकों हेतु योग्य ज्योतिषी परामर्श के बाद ही धारण योग्य।';
    hiCare = 'शनिवार सायं पंचधातु या चांदी में मध्यमा (Middle Finger) अंगुली में धारण करें।';
  } else if (name.includes('emerald') || name.includes('panna')) {
    hiName = 'प्राकृतिक पन्ना (Emerald - बुध रत्न)';
    hiShort = 'बुध ग्रह का सुंदर हरा रत्न, जो व्यापार वृद्धि, वाणी कौशल, गणित, स्मरण शक्ति और संचार कला को चमकाता है।';
    hiBenefits = 'व्यापार में लाभ, शेयर बाजार में सफलता और परीक्षा में एकाग्रता बढ़ाने में अत्यंत लाभकारी।';
    hiWho = 'मिथुन, कन्या, वृषभ, तुला व मकर लग्न के जातकों के लिए सर्वश्रेष्ठ।';
    hiCare = 'बुधवार प्रातः सोने या चांदी में कनिष्ठिका (Little Finger) अंगुली में धारण करें।';
  } else if (name.includes('red coral') || name.includes('moonga')) {
    hiName = 'प्राकृतिक लाल मूंगा (Red Coral - मंगल रत्न)';
    hiShort = 'मंगल देव का ऊर्जावान रत्न, जो साहस, पराक्रम, रक्त शुद्धि, मांगलिक दोष शांति और भूमि लाभ प्रदान करता है।';
    hiBenefits = 'शारीरिक कमजोरी व भय को दूर करता है, आत्मविश्वास बढ़ाता है और पुलिस/सेना/रियल एस्टेट में सफलता दिलाता है।';
    hiWho = 'मेष, वृश्चिक, धनु, मीन व कर्क लग्न के जातकों के लिए अनुकूल।';
    hiCare = 'मंगलवार प्रातः तांबे या सोने में अनामिका (Ring Finger) अंगुली में धारण करें।';
  } else if (name.includes('pearl') || name.includes('moti')) {
    hiName = 'प्राकृतिक सच्चा मोती (Natural Pearl - चंद्र रत्न)';
    hiShort = 'चंद्रमा का शीतल रत्न, जो मानसिक शांति, तनाव से मुक्ति, माता का सुख और भावनात्मक संतुलन प्रदान करता है।';
    hiBenefits = 'क्रोध और अनिद्रा को शांत करता है, मन को एकाग्र रखता है और रचनात्मकता बढ़ाता है।';
    hiWho = 'कर्क, मीन, वृश्चिक व धनु लग्न के जातकों के लिए अत्यंत सुखदायी।';
    hiCare = 'सोमवार सायं चांदी की अंगूठी में कनिष्ठिका (Little Finger) अंगुली में धारण करें।';
  }

  return {
    ...gemstone,
    name: hiName,
    shortDescription: hiShort ?? gemstone.shortDescription,
    benefits: hiBenefits ?? gemstone.benefits,
    whoShouldWear: hiWho ?? gemstone.whoShouldWear,
    careInstructions: hiCare ?? gemstone.careInstructions,
  };
}
