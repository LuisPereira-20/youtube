// Datos base del clon de YouTube
// Puedes ampliar/editar esta lista para añadir más videos.
(function () {
  const toDate = (s) => new Date(s);
  const views = (n) => n; // alias semántico

  // Utilidades simples
  function formatNumber(n) {
    try {
      return new Intl.NumberFormat('es-ES').format(n);
    } catch (e) {
      return String(n);
    }
  }

  function timeAgo(dateStr) {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const diffMs = Date.now() - d.getTime();
    const sec = Math.max(1, Math.floor(diffMs / 1000));
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(day / 365);

    if (year >= 1) return `Hace ${year} año${year > 1 ? 's' : ''}`;
    if (month >= 1) return `Hace ${month} mes${month > 1 ? 'es' : ''}`;
    if (day >= 1) return `Hace ${day} día${day > 1 ? 's' : ''}`;
    if (hour >= 1) return `Hace ${hour} hora${hour > 1 ? 's' : ''}`;
    if (min >= 1) return `Hace ${min} minuto${min > 1 ? 's' : ''}`;
    return `Hace ${sec} segundo${sec > 1 ? 's' : ''}`;
  }

  // Catálogo de videos
  const VIDEOS = [
    {
      id: 'cold',
      title: 'Maroon 5 - Cold ft. Future (Official Music Video)',
      channel: {
        name: 'Maroon 5',
        avatar: './imagenes/107137-maroon_5_617_409.webp',
        subscribers: '36.8 M'
      },
      stats: { views: views(265_000_000), uploadedAt: toDate('2017-02-14'), likes: 1_900_000 },
      thumbnail: './imagenes/cold.jpeg',
      videoSrc: './videos/Maroon 5 - Cold ft. Future (Official Music Video)(360P).mp4',
      description: 'Video musical oficial de Maroon 5 con Future.',
      duration: '4:00'
    },
    {
      id: 'starboy',
      title: 'The Weeknd - Starboy ft. Daft Punk (Official Video)',
      channel: { name: 'The Weeknd', avatar: './imagenes/paramore-video.png', subscribers: '31.5 M' },
      stats: { views: views(2_360_000_000), uploadedAt: toDate('2016-09-28'), likes: 12_000_000 },
      thumbnail: './imagenes/Starboy.jpeg',
      videoSrc: null,
      description: 'Starboy, The Weeknd ft. Daft Punk.',
      duration: '4:33'
    },
    {
      id: 'sugar',
      title: 'Maroon 5 - Sugar (Official Music Video)',
      channel: { name: 'Maroon 5', avatar: './imagenes/107137-maroon_5_617_409.webp', subscribers: '36.8 M' },
      stats: { views: views(3_983_000_000), uploadedAt: toDate('2015-01-14'), likes: 13_000_000 },
      thumbnail: './imagenes/WhatsApp Image 2023-12-25 at 1.57.15 PM.jpeg',
      videoSrc: null,
      description: 'Sugar por Maroon 5.',
      duration: '5:01'
    },
    {
      id: 'shape-of-you',
      title: 'Ed Sheeran - Shape of You (Official Music Video)',
      channel: { name: 'Ed Sheeran', avatar: './imagenes/kevinkaarl.png', subscribers: '55.4 M' },
      stats: { views: views(6_165_000_000), uploadedAt: toDate('2017-01-30'), likes: 30_000_000 },
      thumbnail: './imagenes/WhatsApp Image 2 2023-12-25 at 1.57.15 PM.jpeg',
      videoSrc: null,
      description: 'Shape of You por Ed Sheeran.',
      duration: '4:22'
    },
    {
      id: 'classy-101',
      title: 'Feid, Young Miko - Classy 101 (Official Video)',
      channel: { name: 'Feid', avatar: './imagenes/classy.jpg', subscribers: '10.2 M' },
      stats: { views: views(365_000_000), uploadedAt: toDate('2023-04-05'), likes: 3_100_000 },
      thumbnail: './imagenes/classy.jpg',
      videoSrc: null,
      description: 'Classy 101 por Feid y Young Miko.'
    },
    {
      id: 'que-te-vas',
      title: 'Kevin Kaarl - Que te vas (Official Video)',
      channel: { name: 'Kevin Kaarl', avatar: './imagenes/kevinkaarl.png', subscribers: '2.2 M' },
      stats: { views: views(2_100_000), uploadedAt: toDate('2023-10-15'), likes: 250_000 },
      thumbnail: './imagenes/kevinkaarl.png',
      videoSrc: null,
      description: 'Que te vas de Kevin Kaarl.'
    },
    {
      id: 'paramore-emergency',
      title: 'Paramore - Emergency (Official Video)',
      channel: { name: 'Paramore', avatar: './imagenes/paramore-video.png', subscribers: '6.0 M' },
      stats: { views: views(51_000_000), uploadedAt: toDate('2006-07-31'), likes: 700_000 },
      thumbnail: './imagenes/paramore-video.png',
      videoSrc: null,
      description: 'Emergency por Paramore.'
    },
    {
      id: 'when-youre-gone',
      title: "Avril Lavigne - When You're Gone (Official Video)",
      channel: { name: 'Avril Lavigne', avatar: './imagenes/avrillaviogne.png', subscribers: '11.9 M' },
      stats: { views: views(523_000_000), uploadedAt: toDate('2007-06-19'), likes: 4_000_000 },
      thumbnail: './imagenes/avrillaviogne.png',
      videoSrc: null,
      description: "When You're Gone por Avril Lavigne."
    },
    {
      id: 'my-december',
      title: 'Linkin Park - My December (Audio)',
      channel: { name: 'Linkin Park', avatar: './imagenes/linkin park.png', subscribers: '23.1 M' },
      stats: { views: views(10_000_000), uploadedAt: toDate('2014-12-10'), likes: 210_000 },
      thumbnail: './imagenes/linkin park.png',
      videoSrc: null,
      description: 'My December por Linkin Park.'
    },
    {
      id: 'monaco',
      title: 'Bad Bunny - Mónaco (Letra)',
      channel: { name: 'Bad Bunny', avatar: './imagenes/Starboy.jpeg', subscribers: '48.0 M' },
      stats: { views: views(11_000_000), uploadedAt: toDate('2023-10-13'), likes: 600_000 },
      thumbnail: './videos/monaco.jpg',
      videoSrc: null,
      description: 'Mónaco (Letra) por Bad Bunny.'
    }
  ];

  window.VIDEOS = VIDEOS;
  window.utils = { formatNumber, timeAgo };
})();
