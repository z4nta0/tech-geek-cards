import type { GreetingCard } from '../types';
import mothersDayCardPreview from '../assets/mothers-day-card-preview-image.webp';
import fathersDayCardPreview from '../assets/fathers-day-card-preview-image.webp';
import happyBirthdayCardPreview from '../assets/happy-birthday-card-preview-image.webp';
import fourthOfJulyCardPreview from '../assets/fourth-of-july-card-preview-image.webp';
import happyHalloweenCardPreview from '../assets/happy-halloween-card-preview-image.webp';
import happyThanksgivingCardPreview from '../assets/happy-thanksgiving-card-preview-image.webp';

// ── Greeting Cards ─────────────────────────────────────────
export const greetingCards: GreetingCard[] = [
    {
    id: 'card-01',
    title: 'Happy Birthday',
    occasion: 'Birthday',
    description: 'An animated Happy Birthday card with confetti, ballons and a message.',
    previewUrl: happyBirthdayCardPreview,
    liveUrl: '/happybirthdaycard',
    tags: ['Animation', 'Canvas', 'SVG', 'JavaScript', 'Typescript', 'GSAP', 'React', 'Birthday'],
    year: 2026,
  },
    {
    id: 'card-02',
    title: 'Mother\'s Day',
    occasion: 'Holiday',
    description: 'A card that celebrates mothers with a heartfelt message and beautiful animations.',
    previewUrl: mothersDayCardPreview,
    liveUrl: '/mothersdaycard',
    tags: ['Animation', 'SVG', 'JavaScript', 'Typescript', 'GSAP', 'React', 'Mother\'s Day'],
    year: 2026,
  },
  {
    id: 'card-03',
    title: 'Father\'s Day',
    occasion: 'Holiday',
    description: 'A card that celebrates fathers with a heartfelt message and beautiful animations.',
    previewUrl: fathersDayCardPreview,
    liveUrl: '/fathersdaycard',
    tags: ['Animation', 'SVG', 'JavaScript', 'Typescript', 'GSAP', 'React', 'Father\'s Day'],
    year: 2026,
  },
  {
    id: 'card-04',
    title: 'Fourth of July',
    occasion: 'Holiday',
    description: 'Independence Day celebration with fireworks and patriotic animations.',
    previewUrl: fourthOfJulyCardPreview,
    liveUrl: '/fourthofjulycard',
    tags: ['Animation', 'SVG', 'Javascript', 'Typescript', 'GSAP', 'React', 'Fourth of July'],
    year: 2026,
  },
  {
    id: 'card-05',
    title: 'Happy Halloween',
    occasion: "Halloween",
    description: 'An animated Happy Halloween card with spooky animations and effects.',
    previewUrl: happyHalloweenCardPreview,
    liveUrl: '/happyhalloweencard',
    tags: ['Animation', 'SVG', 'Javascript', 'Typescript', 'GSAP', 'React', 'Halloween'],
    year: 2026,
  },
  {
    id: 'card-06',
    title: 'Happy Thanksgiving',
    occasion: 'Thanksgiving',
    description: 'An animated Happy Thanksgiving card with festive animations and effects.',
    previewUrl: happyThanksgivingCardPreview,
    liveUrl: '/happythanksgivingcard',
    tags: ['Animation', 'SVG', 'Javascript', 'Typescript', 'GSAP', 'React', 'Thanksgiving'],
    year: 2026,
  },
]
