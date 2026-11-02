export interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  caption: string;
  story: string;
  tag: 'Firsts' | 'Adventures' | 'Sweet Moments' | 'Special Trips' | 'Us';
  favorite?: boolean;
}

export interface LoveCoupon {
  id: string;
  title: string;
  perk: string;
  code: string;
  isRedeemed: boolean;
  isScratched: boolean;
  icon: string;
  badge: string;
}

export interface ReasonToLove {
  id: string;
  number: number;
  reason: string;
  details: string;
  emoji: string;
}

export interface LoveLetter {
  salutation: string;
  opening: string;
  paragraphs: string[];
  closing: string;
  senderSignature: string;
  dateStamp: string;
  waxSealColor: string;
}

export interface BirthdayCakeState {
  candlesLit: boolean;
  candlesBlown: boolean;
  wishesMade: number;
  cakeMessage: string;
}

export interface SurpriseBoxConfig {
  boxCoverMessage: string;
  boxImageUrl?: string;
  letter: LoveLetter;
  coupons: LoveCoupon[];
  reasons: ReasonToLove[];
  cake: BirthdayCakeState;
}

export interface BirthdayConfig {
  version: number;
  recipientName: string;
  senderName: string;
  nickname: string;
  birthdayDate: string; // "January 23"
  birthdayYear: number;
  heroHeadline: string;
  heroSubheadline: string;
  romanticQuote: string;
  featuredHeroPhoto?: string;
  memories: Memory[];
  surpriseBox: SurpriseBoxConfig;
  adminPin: string;
}
