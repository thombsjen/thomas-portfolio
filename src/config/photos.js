/**
 * Photo gallery — update src, tags, and captions as your portfolio grows.
 */
export const photoConfig = {
  location: 'Minneapolis, Minnesota',
}

export const photoSections = [
  {
    id: 'intro',
    cards: {
      quote: {
        corner: '01',
        text: 'CAPTURING <gold>LIGHT</gold>, MOTION, AND EMOTION IN EVERY FRAME',
      },
      stats: {
        heading: 'Gallery',
        label: 'Boxcar von productions — Myth Anthropix',
        value: 'Live music, studio portraits, and behind-the-scenes documentation.',
      },
    },
    grid: 'trio',
    photos: [
      {
        src: '/images/band1.jpg',
        alt: 'Live music performance on stage',
        tag: 'LIVE',
        caption: 'Stage energy — live sound, performance, and atmosphere.',
        size: 'feature',
        ratio: '4 / 3',
      },
      {
        src: '/images/band2.jpg',
        alt: 'Band performance',
        tag: 'STAGE',
        caption: 'Immersive moments from the studio and the road.',
        size: 'tall',
        ratio: '5 / 7',
      },
      {
        src: '/images/photo_2026-05-28_17-10-18.jpg',
        alt: 'Portrait session',
        tag: 'PORTRAIT',
        caption: 'Visual identity and creative direction.',
        size: 'tall',
        ratio: '7 / 9',
      },
    ],
  },
  {
    id: 'stage',
    band: {
      corner: '02',
      text: 'FROM THE <gold>STAGE</gold> TO THE STUDIO — VISUAL NARRATIVES THAT MOVE',
    },
    grid: 'quad',
    photos: [
      {
        src: '/images/band3.jpg',
        alt: 'Creative production session',
        tag: 'STUDIO',
        caption: 'Behind the scenes — production and collaboration.',
        ratio: '3 / 2',
      },
      {
        src: '/images/photo_2026-05-28_17-10-30.jpg',
        alt: 'Studio session',
        tag: 'SESSION',
        caption: 'Light, texture, and mood in the studio.',
        ratio: '4 / 5',
      },
      {
        src: '/images/band4.jpg',
        alt: 'Selected creative work',
        tag: 'BEHIND',
        caption: 'Selected work from live and studio projects.',
        ratio: '4 / 3',
      },
      {
        src: '/images/photo_2026-05-28_17-10-33.jpg',
        alt: 'Live moment capture',
        tag: 'MOMENTS',
        caption: 'Candid frames from performances and events.',
        ratio: '15 / 19',
      },
    ],
  },
  {
    id: 'archive',
    cards: {
      quote: {
        corner: '03',
        text: 'EVERY SHOT IS A STORY — <gold>RAW</gold> TEXTURE AND CONTROLLED LIGHT',
      },
      stats: {
        heading: 'Focus',
        label: 'Categories',
        value:
          'Live performance · Studio portraits · Behind the scenes · Event coverage · Creative direction',
      },
    },
    grid: 'duo',
    photos: [
      {
        src: '/images/photo_2026-05-28_17-10-40.jpg',
        alt: 'Featured photograph',
        tag: 'SELECTED',
        caption: 'Featured selection — visual stories from the archive.',
        size: 'wide',
        ratio: '13 / 8.5',
      },
      {
        src: '/images/111.jpg',
        alt: 'Creative photograph',
        tag: 'RAW',
        caption: 'Unfiltered frames — texture, contrast, and tone.',
        size: 'tall',
        ratio: '7 / 9',
      },
    ],
  },
  {
    id: 'outro',
    footer: {
      quote: {
        corner: '04',
        text: 'MINNEAPOLIS-BASED — MUSIC, MEDIA, AND <gold>VISUAL</gold> PRODUCTION',
      },
      stats: {
        heading: 'Collaborate',
        label: 'Available for',
        value:
          'Live event photography · Artist portraits · Album and promo shoots · Creative direction',
      },
    },
  },
]

/** @deprecated kept for any external imports */
export const photoGallery = photoSections.flatMap((s) => s.photos ?? [])
