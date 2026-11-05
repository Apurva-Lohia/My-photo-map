# little world: Apurva's photo map

A React + Tailwind CSS website of every place I've been, with my photos and videos pinned to a world map.

## Run it

Needs Node.js 20+.

    npm install    # first time only
    npm run dev    # http://localhost:5173

## Add or update photos

1. Put files in `public/media/<folder>/`, one folder per place (for example `Photos-kolkata`).
2. Restart `npm run dev`, or run `npm run media`.

- **Formats:** jpg, png, webp, gif, avif, mp4, webm, mov. Convert HEIC to JPG first.
- **Captions:** the file name becomes the caption (`howrah-bridge.jpg` → "howrah bridge").

## Edit places

`src/data/places.js` has each place's name, note, colours and map position. The first entry is home, and flight paths start there. To add a place, copy an entry and give its media folder a matching name.

## Publish

    npm run build    # outputs dist/, ready for Netlify, Vercel or GitHub Pages