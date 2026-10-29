# Credits and licences

## Demo content

- **Artwork.** All 191 images in `public/images/` are original illustrations generated for Tavique by `scripts/art/`. There's no stock photography, AI-generated likeness of a real person, third-party product photography, logo or trademark.
- **Brands, products, reviews and people.** Arcline, Kestrel, Halden Audio, Orbis, Voltara, Nova, Tavique Atelier, the beauty lines and every reviewer name are fictional. Any resemblance to real brands or people is coincidental.
- **Icons.** [Lucide](https://lucide.dev) (ISC licence).

## Fonts

All fonts are open source under the **SIL Open Font License 1.1**. In the app they're self-hosted at build time by `next/font/google`.

| Font | Used by | Licence |
| --- | --- | --- |
| Bodoni Moda | Fashion headings | OFL 1.1 |
| Jost | Fashion body text; artwork | OFL 1.1 |
| Geist and Geist Mono | Electronics | OFL 1.1 |
| Newsreader | Beauty headings | OFL 1.1 |
| Figtree | Beauty body text | OFL 1.1 |

`scripts/art/fonts/` contains Jost and Bodoni Moda (OFL 1.1), used only to render the artwork.

## Runtime dependencies

| Package | Licence |
| --- | --- |
| next | MIT |
| react, react-dom | MIT |
| motion | MIT |
| zustand | MIT |
| zod | MIT |
| react-hook-form, @hookform/resolvers | MIT |
| lucide-react | ISC |
| clsx | MIT |
| server-only | MIT |
| sharp (installed by Next.js for image optimisation) | Apache-2.0 |

## Development dependencies

| Package | Licence |
| --- | --- |
| typescript | Apache-2.0 |
| tailwindcss, @tailwindcss/postcss | MIT |
| eslint, eslint-config-next | MIT |
| vitest, @vitejs/plugin-react | MIT |
| jsdom | MIT |
| @testing-library/react, dom, user-event, jest-dom | MIT |

For a full list of transitive licences, run:

```bash
npx license-checker --summary
```
