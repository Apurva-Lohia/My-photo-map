// Every place on the map. The first one is "home".
//
// To add a place: copy an entry, give it a unique `key`, and put its photos and
// videos in public/media/<key>/ (or a folder named after the place, see `aliases`).
//
// ox / oy: where the polaroid sits relative to its pin (in px) when the map is
// zoomed out, so pins that are close together fan out instead of stacking.
// illustrations: fallback pictures used until you add real photos.
//   Each is [caption, time] where time is 'dawn' | 'day' | 'dusk' | 'night'.

export const places = [
  {
    key: 'kolkata', name: 'Kolkata', region: 'West Bengal, India', country: 'India', code: 'CCU',
    home: true, lat: 22.57, lon: 88.36, deep: '#B23A64', tint: '#FFF1F5', line: '#E9B9C8', ox: 46, oy: -36,
    note: 'Home. Yellow taxis, adda over chai, and the best street food on earth.',
    aliases: ['calcutta'],
    illustrations: [['Howrah Bridge at dusk', 'dusk'], ['phuchka run', 'day'], ['yellow taxis', 'day'], ['College Street', 'dawn'], ['Victoria Memorial', 'dusk'], ['Durga Puja nights', 'night']],
  },
  {
    key: 'kerala', name: 'Kerala', region: 'Kerala, India', country: 'India', code: 'COK',
    lat: 9.49, lon: 76.33, deep: '#2F7D4F', tint: '#EEF7EE', line: '#B5D9C0', ox: -74, oy: 50,
    note: 'Backwaters, coconut palms and a houseboat that moved at the speed of a nap.',
    aliases: ['kochi', 'alleppey', 'munnar'],
    illustrations: [['houseboat morning', 'dawn'], ['Alleppey backwaters', 'day'], ['banana chips stop', 'day'], ['Fort Kochi nets', 'dusk'], ['monsoon evening', 'night']],
  },
  {
    key: 'bangalore', name: 'Bangalore', region: 'Karnataka, India', country: 'India', code: 'BLR',
    lat: 12.97, lon: 77.59, deep: '#3F4FA8', tint: '#F0F2FC', line: '#C6CCEE', ox: -14, oy: 66,
    note: 'Garden-city mornings, filter coffee and the friendliest traffic jams.',
    aliases: ['bengaluru', 'banglore', 'bangaluru'],
    illustrations: [['Vidhana Soudha', 'day'], ['Cubbon Park walk', 'dawn'], ['filter coffee', 'day'], ['Church Street', 'dusk'], ['city lights', 'night']],
  },
  {
    key: 'chennai', name: 'Chennai', region: 'Tamil Nadu, India', country: 'India', code: 'MAA',
    lat: 13.08, lon: 80.27, deep: '#0F7287', tint: '#E9F6F9', line: '#B0DCE5', ox: 50, oy: 64,
    note: 'Temple towers, Marina Beach at sunrise and filter coffee that ruins all others.',
    aliases: ['madras'],
    illustrations: [['Kapaleeshwarar Temple', 'day'], ['Marina Beach sunrise', 'dawn'], ['filter coffee', 'day'], ['Besant Nagar evening', 'dusk'], ['city by night', 'night']],
  },
  {
    key: 'gujarat', name: 'Gujarat', region: 'Gujarat, India', country: 'India', code: 'AMD',
    lat: 23.02, lon: 72.57, deep: '#B8571B', tint: '#FFF3E8', line: '#F0C9A8', ox: -94, oy: 6,
    note: 'Kites on every rooftop, dhokla for breakfast, and a sky full of strings.',
    aliases: ['ahmedabad', 'gujrat', 'gujurat'],
    illustrations: [['Uttarayan kites', 'day'], ['old city pols', 'dawn'], ['rooftop sunset', 'dusk'], ['dhokla breakfast', 'day'], ['lantern night', 'night']],
  },
  {
    key: 'kashmir', name: 'Kashmir', region: 'Jammu & Kashmir, India', country: 'India', code: 'SXR',
    lat: 34.08, lon: 74.8, deep: '#2D6A9F', tint: '#EEF5FC', line: '#B9D2EA', ox: -66, oy: -74,
    note: 'A shikara on Dal Lake and mountains that did not look real.',
    aliases: ['srinagar', 'kashimir', 'kashmeer'],
    illustrations: [['shikara ride', 'day'], ['Dal Lake at dawn', 'dawn'], ['snowy peaks', 'day'], ['kahwa break', 'dusk'], ['houseboat night', 'night']],
  },
  {
    key: 'delhi', name: 'Delhi', region: 'Delhi, India', country: 'India', code: 'DEL',
    lat: 28.61, lon: 77.21, deep: '#A33F2F', tint: '#FFF1ED', line: '#EDC2B8', ox: 30, oy: -100,
    note: 'Old lanes, big monuments and parathas worth the queue.',
    aliases: ['new delhi', 'new-delhi'],
    illustrations: [['India Gate evening', 'dusk'], ['Chandni Chowk', 'day'], ['paratha gali', 'day'], ['Lodhi Garden walk', 'dawn'], ['Humayun’s Tomb', 'dusk'], ['late-night chai', 'night']],
  },
  {
    key: 'moscow', name: 'Moscow', region: 'Moscow, Russia', country: 'Russia', code: 'SVO',
    lat: 55.76, lon: 37.62, deep: '#9B2C3A', tint: '#FFF0F1', line: '#ECC0C6', ox: 0, oy: -52,
    note: 'Onion domes in every colour and a Red Square that hums at night.',
    aliases: ['moskva'],
    illustrations: [['St Basil’s Cathedral', 'day'], ['Red Square at night', 'night'], ['metro palaces', 'dawn'], ['Gorky Park', 'day'], ['river cruise', 'dusk']],
  },
  {
    key: 'sydney', name: 'Sydney', region: 'New South Wales, Australia', country: 'Australia', code: 'SYD',
    lat: -33.87, lon: 151.21, deep: '#1F7A7A', tint: '#EAF7F6', line: '#B1DAD7', ox: 0, oy: -52,
    note: 'Sunsets at the foreshore, every single evening.',
    aliases: [],
    illustrations: [['Glebe foreshore', 'dusk'], ['ANZAC Bridge glow', 'night'], ['harbour ferry', 'day'], ['Bondi to Coogee', 'day'], ['uni lawns', 'dawn'], ['Opera House', 'dusk']],
  },
  {
    key: 'singapore', name: 'Singapore', region: 'Singapore', country: 'Singapore', code: 'SIN',
    lat: 1.29, lon: 103.85, deep: '#6B4FA8', tint: '#F5F1FD', line: '#D3C6EE', ox: 36, oy: 72,
    note: 'Hawker centres, glowing supertrees and the friendliest humidity ever.',
    aliases: [],
    illustrations: [['Marina Bay at night', 'night'], ['Gardens by the Bay', 'dusk'], ['hawker centre feast', 'day'], ['Chinatown lanes', 'dawn'], ['Jewel waterfall', 'day']],
  },
  {
    key: 'bangkok', name: 'Bangkok', region: 'Bangkok, Thailand', country: 'Thailand', code: 'BKK',
    lat: 13.75, lon: 100.49, deep: '#8A5E05', tint: '#FFF7E2', line: '#EBD39A', ox: 66, oy: 6,
    note: 'Temples in gold, boats on the river, mango sticky rice on repeat.',
    aliases: ['thailand'],
    illustrations: [['Wat Arun at dusk', 'dusk'], ['river longtail', 'day'], ['floating market', 'dawn'], ['street food night', 'night'], ['mango sticky rice', 'day']],
  },
]

// Continent colours used on the map legend.
export const continents = [
  { name: 'Asia', fill: '#F3C6D6' },
  { name: 'Europe', fill: '#D6C3EE' },
  { name: 'Oceania', fill: '#F2AA9E' },
  { name: 'Africa', fill: '#F3BE93' },
  { name: 'Americas', fill: '#F4D58C' },
]
