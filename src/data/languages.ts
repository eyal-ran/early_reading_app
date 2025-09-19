export interface LetterCard {
  symbol: string;
  name: string;
  phoneme: string;
}

export interface LanguagePack {
  id: string;
  label: string;
  locale: string;
  direction: 'ltr' | 'rtl';
  letters: LetterCard[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const languages: LanguagePack[] = [
  {
    id: 'english',
    label: 'English',
    locale: 'en-US',
    direction: 'ltr',
    colors: {
      primary: '#5e60ce',
      secondary: '#ffd166',
      accent: '#ff6b6b',
    },
    letters: [
      { symbol: 'A', name: 'A', phoneme: 'ay' },
      { symbol: 'B', name: 'B', phoneme: 'bee' },
      { symbol: 'C', name: 'C', phoneme: 'see' },
      { symbol: 'D', name: 'D', phoneme: 'dee' },
      { symbol: 'E', name: 'E', phoneme: 'ee' },
      { symbol: 'F', name: 'F', phoneme: 'eff' },
      { symbol: 'G', name: 'G', phoneme: 'jee' },
      { symbol: 'H', name: 'H', phoneme: 'aitch' },
      { symbol: 'I', name: 'I', phoneme: 'eye' },
      { symbol: 'J', name: 'J', phoneme: 'jay' },
      { symbol: 'K', name: 'K', phoneme: 'kay' },
      { symbol: 'L', name: 'L', phoneme: 'ell' },
      { symbol: 'M', name: 'M', phoneme: 'em' },
      { symbol: 'N', name: 'N', phoneme: 'en' },
      { symbol: 'O', name: 'O', phoneme: 'oh' },
      { symbol: 'P', name: 'P', phoneme: 'pee' },
      { symbol: 'Q', name: 'Q', phoneme: 'queue' },
      { symbol: 'R', name: 'R', phoneme: 'ar' },
      { symbol: 'S', name: 'S', phoneme: 'ess' },
      { symbol: 'T', name: 'T', phoneme: 'tee' },
      { symbol: 'U', name: 'U', phoneme: 'you' },
      { symbol: 'V', name: 'V', phoneme: 'vee' },
      { symbol: 'W', name: 'W', phoneme: 'double you' },
      { symbol: 'X', name: 'X', phoneme: 'ex' },
      { symbol: 'Y', name: 'Y', phoneme: 'why' },
      { symbol: 'Z', name: 'Z', phoneme: 'zee' },
    ],
  },
  {
    id: 'hebrew',
    label: 'עברית',
    locale: 'he-IL',
    direction: 'rtl',
    colors: {
      primary: '#00b4d8',
      secondary: '#ffafcc',
      accent: '#ff6b6b',
    },
    letters: [
      { symbol: 'א', name: 'אַלֶף', phoneme: 'ah-lef' },
      { symbol: 'ב', name: 'בֵּית', phoneme: 'bet' },
      { symbol: 'ג', name: 'גִּימֶל', phoneme: 'gee-mel' },
      { symbol: 'ד', name: 'דָּלֶת', phoneme: 'dah-let' },
      { symbol: 'ה', name: 'הֵא', phoneme: 'hay' },
      { symbol: 'ו', name: 'ווָאו', phoneme: 'vahv' },
      { symbol: 'ז', name: 'זַיִן', phoneme: 'zah-yeen' },
      { symbol: 'ח', name: 'חֵית', phoneme: 'khayt' },
      { symbol: 'ט', name: 'טֵית', phoneme: 'tate' },
      { symbol: 'י', name: 'יוֹד', phoneme: 'yode' },
      { symbol: 'כ', name: 'כַּף', phoneme: 'khaf' },
      { symbol: 'ל', name: 'לָמֶד', phoneme: 'lah-med' },
      { symbol: 'מ', name: 'מֵם', phoneme: 'mem' },
      { symbol: 'נ', name: 'נוּן', phoneme: 'noon' },
      { symbol: 'ס', name: 'סָמֶךְ', phoneme: 'sah-mekh' },
      { symbol: 'ע', name: 'עַיִן', phoneme: 'ah-yeen' },
      { symbol: 'פ', name: 'פֵּא', phoneme: 'peh' },
      { symbol: 'צ', name: 'צַדִּי', phoneme: 'tsah-dee' },
      { symbol: 'ק', name: 'קוֹף', phoneme: 'kof' },
      { symbol: 'ר', name: 'רֵישׁ', phoneme: 'ray-sh' },
      { symbol: 'ש', name: 'שִׁין', phoneme: 'sheen' },
      { symbol: 'ת', name: 'תָּו', phoneme: 'tav' },
    ],
  },
];
