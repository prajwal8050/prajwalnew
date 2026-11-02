import { BirthdayConfig } from '../types/birthday';
import sunsetImg from '../assets/images/romantic_sunset_walk_1793613226062.jpg';
import cafeImg from '../assets/images/romantic_cafe_date_1793613226272.jpg';
import stargazingImg from '../assets/images/romantic_stargazing_1793613227270.jpg';
import flowersImg from '../assets/images/romantic_flowers_gift_1793613227744.jpg';
import giftBoxImg from '../assets/images/romantic_gift_box_1793613227352.jpg';

export const INITIAL_BIRTHDAY_DATA: BirthdayConfig = {
  version: 2,
  recipientName: 'Aradhana Mohanty',
  senderName: 'Prajwal',
  nickname: 'Aradhana',
  birthdayDate: 'January 23',
  birthdayYear: 2026,
  heroHeadline: 'To My Beautiful Aradhana, Happy Birthday',
  heroSubheadline: 'Every moment with you has been my favorite chapter, Aradhana. Today on January 23rd, the entire world celebrates the magic of you.',
  romanticQuote: 'In all the world, there is no heart for me like yours, Aradhana. In all the world, there is no love for you like mine. — With all my love, Prajwal',
  adminPin: 'jan23',
  featuredHeroPhoto: sunsetImg,
  memories: [
    {
      id: 'mem-1',
      title: 'Our Golden Sunset Shoreline',
      date: 'May 14',
      location: 'Pacific Coast Sanctuary',
      imageUrl: sunsetImg,
      caption: 'The way the golden waves caught your laughter as we walked barefoot in the sand.',
      story: 'We lost track of time talking about our childhood dreams and future adventures. You turned back, smiled into the sunset breeze, and right then I knew you were the one I wanted beside me for every sunset yet to come.',
      tag: 'Adventures',
      favorite: true
    },
    {
      id: 'mem-2',
      title: 'Cozy Morning Coffee & Secret Smiles',
      date: 'September 22',
      location: 'The Little Corner Bakery',
      imageUrl: cafeImg,
      caption: 'Two warm lattes, rain drumming gently against the glass, and your eyes shining across the wooden table.',
      story: 'We sat for hours sharing warm almond croissants, drawing doodles on paper napkins, and whispering inside jokes while the autumn rain washed over the city.',
      tag: 'Sweet Moments',
      favorite: true
    },
    {
      id: 'mem-3',
      title: 'Under A Blanket of A Million Stars',
      date: 'August 08',
      location: 'Pine Crest Ridge Overlook',
      imageUrl: stargazingImg,
      caption: 'Wrapped in our favorite plaid blanket, searching for shooting stars in the quiet midnight sky.',
      story: 'The air was crisp and chilly, so I pulled you close. Every time a shooting star raced across the constellations, you closed your eyes tight and made a secret wish. I already had everything I could ever wish for right beside me.',
      tag: 'Us',
      favorite: true
    },
    {
      id: 'mem-4',
      title: 'Fresh Blooms Just Because',
      date: 'November 19',
      location: 'Home Sweet Home',
      imageUrl: flowersImg,
      caption: 'Blush garden roses and warm eucalyptus on a candlelit evening.',
      story: 'Seeing your eyes light up when you walked in the door and buried your face in the fresh petals. Your gentle happiness fills up every single corner of our home.',
      tag: 'Sweet Moments',
      favorite: false
    }
  ],
  surpriseBox: {
    boxCoverMessage: 'Tap to Unwrap Your Special Birthday Box, Aradhana',
    boxImageUrl: giftBoxImg,
    letter: {
      salutation: 'My Dearest Aradhana,',
      opening: 'Happy Birthday, my love! Another year more brilliant, kind, and breathtakingly beautiful.',
      paragraphs: [
        'Before you came into my life, Aradhana, I never realized how much brightness and warmth one single soul could bring into my world. Your sweet laugh is my absolute favorite sound, your empathy inspires me every day, and even on ordinary Tuesdays, you turn everyday routines into unforgettable adventures.',
        'Thank you for holding my hand when things feel overwhelming, for singing off-key with me on late-night drives, and for loving me with all the warmth and sweetness in your heart.',
        'Today on January 23rd, the whole universe conspired to bring someone truly extraordinary into existence. My only wish today is to make you smile as wide and brightly as you make me smile every single day.'
      ],
      closing: 'Forever and only yours, with all my love,',
      senderSignature: 'Prajwal',
      dateStamp: 'January 23rd, with infinite affection',
      waxSealColor: '#be123c'
    },
    coupons: [
      {
        id: 'coup-1',
        title: 'Candlelight Dinner of Your Choice',
        perk: 'Any restaurant in town, fancy dessert included, no budget limit!',
        code: 'LOVE-DINNER-VIP',
        isRedeemed: false,
        isScratched: false,
        icon: 'Utensils',
        badge: 'Gourmet Date'
      },
      {
        id: 'coup-2',
        title: 'Unlimited Warm Hugs & Sweet Kisses',
        perk: 'Redeemable anytime, anywhere, 24/7 with zero expiration date.',
        code: 'HUG-PASS-INF',
        isRedeemed: false,
        isScratched: false,
        icon: 'Heart',
        badge: 'Cozy Comfort'
      },
      {
        id: 'coup-3',
        title: 'Midnight Stargazing & Ice Cream Run',
        perk: 'We jump in the car in comfy pajamas and get your favorite double-scoop under the night sky.',
        code: 'NIGHT-STARS-SWEET',
        isRedeemed: false,
        isScratched: false,
        icon: 'Moon',
        badge: 'Late Night Adventure'
      },
      {
        id: 'coup-4',
        title: 'Queen of the Day: Zero Chores',
        perk: 'I do all the cooking, cleaning, foot massages, and pampering while you relax.',
        code: 'ROYAL-PAMPER-DAY',
        isRedeemed: false,
        isScratched: false,
        icon: 'Sparkles',
        badge: 'Pure Pampering'
      },
      {
        id: 'coup-5',
        title: 'Weekend Getaway Ticket',
        perk: 'Pack a cozy bag—a surprise weekend escape destination planned exclusively for you!',
        code: 'TRIP-ESCAPE-23',
        isRedeemed: false,
        isScratched: false,
        icon: 'Compass',
        badge: 'Romantic Getaway'
      },
      {
        id: 'coup-6',
        title: 'Movie Marathon with Your Snacks',
        perk: 'You pick all movies, control the remote, and I provide freshly popped butter popcorn.',
        code: 'CINEMA-NIGHT-PASS',
        isRedeemed: false,
        isScratched: false,
        icon: 'Film',
        badge: 'Cozy Movie Night'
      }
    ],
    reasons: [
      {
        id: 'r-1',
        number: 1,
        reason: 'The crinkle by your eyes when you laugh so hard you can barely breathe.',
        details: 'It lights up the whole room and instantly melts any stress I had.',
        emoji: '✨'
      },
      {
        id: 'r-2',
        number: 2,
        reason: 'How you remember the smallest, sweetest details about people you care about.',
        details: 'Your heart is so deeply attentive and caring.',
        emoji: '🌸'
      },
      {
        id: 'r-3',
        number: 3,
        reason: 'The way your hand instinctively reaches for mine when we walk.',
        details: 'It feels like the most natural, comforting thing in the universe.',
        emoji: '🤝'
      },
      {
        id: 'r-4',
        number: 4,
        reason: 'Your adorable excitement over cute animals and little things.',
        details: 'Watching you get overjoyed makes me fall in love with you all over again.',
        emoji: '🐾'
      },
      {
        id: 'r-5',
        number: 5,
        reason: 'The courage and dedication you show toward your dreams.',
        details: 'You are so intelligent, ambitious, and strong.',
        emoji: '🌟'
      },
      {
        id: 'r-6',
        number: 6,
        reason: 'How cozy you make every place feel just by being there.',
        details: 'Home isn’t four walls; home is whenever I am with you.',
        emoji: '🏡'
      },
      {
        id: 'r-7',
        number: 7,
        reason: 'Your silly dance moves when your favorite song plays.',
        details: 'Completely unbothered, playful, and wonderfully authentic.',
        emoji: '💃'
      },
      {
        id: 'r-8',
        number: 8,
        reason: 'The peaceful expression on your face when you sleep peacefully.',
        details: 'I often look at you and wonder how on earth I got so blessed.',
        emoji: '🌙'
      },
      {
        id: 'r-9',
        number: 9,
        reason: 'Your honest warmth and gentle soul.',
        details: 'You see the good in people and make the world gentler.',
        emoji: '🕊️'
      },
      {
        id: 'r-10',
        number: 10,
        reason: 'How you always know how to cheer me up with just a quiet hug.',
        details: 'Without saying a word, everything feels okay again.',
        emoji: '🫂'
      },
      {
        id: 'r-11',
        number: 11,
        reason: 'The excitement we share planning all the places we have yet to visit.',
        details: 'Every future tomorrow looks brighter because you are in it.',
        emoji: '🗺️'
      },
      {
        id: 'r-12',
        number: 12,
        reason: 'Because you are my best friend and the greatest gift of my life.',
        details: 'Happy Birthday, my love. Today and for every year to come.',
        emoji: '💖'
      }
    ],
    cake: {
      candlesLit: true,
      candlesBlown: false,
      wishesMade: 0,
      cakeMessage: 'Make a wish, close your eyes, and blow the candles!'
    }
  }
};
