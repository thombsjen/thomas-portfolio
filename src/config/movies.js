/**
 * Film & video gallery — update youtubeId, posters, and captions as your reel grows.
 */
export const movieConfig = {
  location: 'Minneapolis, Minnesota',
}

export const movieSections = [
  {
    id: 'intro',
    cards: {
      quote: {
        corner: '01',
        text: 'MOTION, <gold>SOUND</gold>, AND STORY — EVERY FRAME HAS A RHYTHM',
      },
      stats: {
        heading: 'Reel',
        label: 'Boxcar von productions — Myth Anthropix',
        value:
          'Music videos, live films, documentaries, and creative direction for visual media.',
      },
    },
    grid: 'videos-mixed',
    videos: [
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/band1.jpg',
        tag: 'FEATURED',
        title: 'Myth Anthropix — Visual Reel',
        caption: 'Featured film — live performance, studio sessions, and creative direction.',
        embed: true,
        span: 7,
        ratio: '16 / 9',
      },
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/band2.jpg',
        tag: 'LIVE',
        title: 'Stage Sessions',
        caption: 'Immersive live capture — sound, motion, and atmosphere on film.',
        embed: false,
        span: 5,
        ratio: '5 / 7',
      },
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/band3.jpg',
        tag: 'STUDIO',
        title: 'Behind the Lens',
        caption: 'Production and collaboration — from concept to final cut.',
        embed: false,
        span: 5,
        ratio: '7 / 9',
      },
    ],
  },
  {
    id: 'production',
    band: {
      corner: '02',
      text: 'FROM <gold>CONCEPT</gold> TO FINAL CUT — CINEMATIC STORYTELLING AT EVERY SCALE',
    },
    grid: 'videos-mixed',
    videos: [
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/band4.jpg',
        tag: 'DOCUMENTARY',
        title: 'Creative Process',
        caption: 'Documentary-style coverage of music and media projects.',
        embed: true,
        span: 8,
        ratio: '16 / 9',
      },
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/photo_2026-05-28_17-10-30.jpg',
        tag: 'PROMO',
        title: 'Artist Promo',
        caption: 'Short-form promos and visual identity for artists and brands.',
        embed: false,
        span: 4,
        ratio: '4 / 5',
      },
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/photo_2026-05-28_17-10-33.jpg',
        tag: 'EVENT',
        title: 'Event Coverage',
        caption: 'Multi-camera event films and live stream production.',
        embed: false,
        span: 6,
        ratio: '16 / 9',
      },
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/photo_2026-05-28_17-10-40.jpg',
        tag: 'SELECTED',
        title: 'Selected Work',
        caption: 'Curated reel — narrative film and visual storytelling.',
        embed: true,
        span: 6,
        ratio: '16 / 9',
      },
    ],
  },
  {
    id: 'craft',
    cards: {
      quote: {
        corner: '03',
        text: 'EDITING WITH <gold>INTENT</gold> — PACE, TONE, AND VISUAL NARRATIVE',
      },
      stats: {
        heading: 'Focus',
        label: 'Categories',
        value:
          'Music videos · Live performance films · Documentaries · Promo reels · Event coverage · Creative direction',
      },
    },
    grid: 'duo',
    videos: [
      {
        youtubeId: '9iHbUniBWqI',
        poster: '/images/111.jpg',
        tag: 'RAW',
        title: 'Unfiltered Cuts',
        caption: 'Experimental edits — texture, rhythm, and raw visual energy.',
        embed: false,
        ratio: '16 / 9',
      },
    ],
  },
  {
    id: 'outro',
    footer: {
      quote: {
        corner: '04',
        text: 'MINNEAPOLIS-BASED — MUSIC, MEDIA, AND <gold>FILM</gold> PRODUCTION',
      },
      stats: {
        heading: 'Collaborate',
        label: 'Available for',
        value:
          'Music video production · Live event filming · Documentary · Promo content · Post-production',
      },
    },
  },
]

/** @deprecated kept for any external imports */
export const movieGallery = movieSections.flatMap((s) => s.videos ?? [])
