export type FontOption = {
  id: string
  label: string
  category: "AI" | "Sans" | "Serif" | "Display" | "Mono"
}

const AI_AUTO_OPTION: FontOption = {
  id: "ai-auto",
  label: "Let AI choose the best font",
  category: "AI",
}

export const FONT_OPTIONS: FontOption[] = [
  AI_AUTO_OPTION,

  { id: "inter", label: "Inter", category: "Sans" },
  { id: "roboto", label: "Roboto", category: "Sans" },
  { id: "open-sans", label: "Open Sans", category: "Sans" },
  { id: "lato", label: "Lato", category: "Sans" },
  { id: "montserrat", label: "Montserrat", category: "Sans" },
  { id: "poppins", label: "Poppins", category: "Sans" },
  { id: "nunito", label: "Nunito", category: "Sans" },
  { id: "work-sans", label: "Work Sans", category: "Sans" },
  { id: "source-sans-3", label: "Source Sans 3", category: "Sans" },
  { id: "dm-sans", label: "DM Sans", category: "Sans" },
  { id: "plus-jakarta-sans", label: "Plus Jakarta Sans", category: "Sans" },
  { id: "manrope", label: "Manrope", category: "Sans" },
  { id: "outfit", label: "Outfit", category: "Sans" },
  { id: "urbanist", label: "Urbanist", category: "Sans" },
  { id: "raleway", label: "Raleway", category: "Sans" },
  { id: "rubik", label: "Rubik", category: "Sans" },

  { id: "merriweather", label: "Merriweather", category: "Serif" },
  { id: "playfair-display", label: "Playfair Display", category: "Serif" },
  { id: "lora", label: "Lora", category: "Serif" },
  { id: "libre-baskerville", label: "Libre Baskerville", category: "Serif" },
  { id: "crimson-pro", label: "Crimson Pro", category: "Serif" },
  { id: "cormorant-garamond", label: "Cormorant Garamond", category: "Serif" },
  { id: "pt-serif", label: "PT Serif", category: "Serif" },
  { id: "source-serif-4", label: "Source Serif 4", category: "Serif" },
  { id: "spectral", label: "Spectral", category: "Serif" },
  { id: "eb-garamond", label: "EB Garamond", category: "Serif" },
  { id: "alegreya", label: "Alegreya", category: "Serif" },
  { id: "domine", label: "Domine", category: "Serif" },

  { id: "bebas-neue", label: "Bebas Neue", category: "Display" },
  { id: "oswald", label: "Oswald", category: "Display" },
  { id: "anton", label: "Anton", category: "Display" },
  { id: "archivo-black", label: "Archivo Black", category: "Display" },
  { id: "fjalla-one", label: "Fjalla One", category: "Display" },
  { id: "righteous", label: "Righteous", category: "Display" },
  { id: "bangers", label: "Bangers", category: "Display" },
  { id: "comfortaa", label: "Comfortaa", category: "Display" },
  { id: "baloo-2", label: "Baloo 2", category: "Display" },
  { id: "fredoka", label: "Fredoka", category: "Display" },
  { id: "lilita-one", label: "Lilita One", category: "Display" },
  { id: "pacifico", label: "Pacifico", category: "Display" },

  { id: "fira-code", label: "Fira Code", category: "Mono" },
  { id: "jetbrains-mono", label: "JetBrains Mono", category: "Mono" },
  { id: "source-code-pro", label: "Source Code Pro", category: "Mono" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", category: "Mono" },
  { id: "roboto-mono", label: "Roboto Mono", category: "Mono" },
  { id: "inconsolata", label: "Inconsolata", category: "Mono" },
  { id: "space-mono", label: "Space Mono", category: "Mono" },
  { id: "ubuntu-mono", label: "Ubuntu Mono", category: "Mono" },
  { id: "dm-mono", label: "DM Mono", category: "Mono" },
  { id: "victor-mono", label: "Victor Mono", category: "Mono" },
  { id: "anonymous-pro", label: "Anonymous Pro", category: "Mono" },
]

export function getFontLabel(fontId?: string): string {
  if (!fontId) return AI_AUTO_OPTION.label
  return FONT_OPTIONS.find((font) => font.id === fontId)?.label ?? fontId
}

export function getFontCssFamily(fontId?: string): string {
  if (!fontId || fontId === "ai-auto") return 'inherit'

  const map: Record<string, string> = {
    inter: '"Inter", sans-serif',
    roboto: '"Roboto", sans-serif',
    "open-sans": '"Open Sans", sans-serif',
    lato: '"Lato", sans-serif',
    montserrat: '"Montserrat", sans-serif',
    poppins: '"Poppins", sans-serif',
    nunito: '"Nunito", sans-serif',
    "work-sans": '"Work Sans", sans-serif',
    "source-sans-3": '"Source Sans 3", sans-serif',
    "dm-sans": '"DM Sans", sans-serif',
    "plus-jakarta-sans": '"Plus Jakarta Sans", sans-serif',
    manrope: '"Manrope", sans-serif',
    outfit: '"Outfit", sans-serif',
    urbanist: '"Urbanist", sans-serif',
    raleway: '"Raleway", sans-serif',
    rubik: '"Rubik", sans-serif',
    merriweather: '"Merriweather", serif',
    "playfair-display": '"Playfair Display", serif',
    lora: '"Lora", serif',
    "libre-baskerville": '"Libre Baskerville", serif',
    "crimson-pro": '"Crimson Pro", serif',
    "cormorant-garamond": '"Cormorant Garamond", serif',
    "pt-serif": '"PT Serif", serif',
    "source-serif-4": '"Source Serif 4", serif',
    spectral: '"Spectral", serif',
    "eb-garamond": '"EB Garamond", serif',
    alegreya: '"Alegreya", serif',
    domine: '"Domine", serif',
    "bebas-neue": '"Bebas Neue", sans-serif',
    oswald: '"Oswald", sans-serif',
    anton: '"Anton", sans-serif',
    "archivo-black": '"Archivo Black", sans-serif',
    "fjalla-one": '"Fjalla One", sans-serif',
    righteous: '"Righteous", sans-serif',
    bangers: '"Bangers", cursive',
    comfortaa: '"Comfortaa", sans-serif',
    "baloo-2": '"Baloo 2", sans-serif',
    fredoka: '"Fredoka", sans-serif',
    "lilita-one": '"Lilita One", sans-serif',
    pacifico: '"Pacifico", cursive',
    "fira-code": '"Fira Code", monospace',
    "jetbrains-mono": '"JetBrains Mono", monospace',
    "source-code-pro": '"Source Code Pro", monospace',
    "ibm-plex-mono": '"IBM Plex Mono", monospace',
    "roboto-mono": '"Roboto Mono", monospace',
    inconsolata: '"Inconsolata", monospace',
    "space-mono": '"Space Mono", monospace',
    "ubuntu-mono": '"Ubuntu Mono", monospace',
    "dm-mono": '"DM Mono", monospace',
    "victor-mono": '"Victor Mono", monospace',
    "anonymous-pro": '"Anonymous Pro", monospace',
  }

  return map[fontId] ?? 'inherit'
}

export const FONT_PREVIEW_STYLESHEET_URL = "https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Open+Sans&family=Lato&family=Montserrat&family=Poppins&family=Nunito&family=Work+Sans&family=Source+Sans+3&family=DM+Sans&family=Plus+Jakarta+Sans&family=Manrope&family=Outfit&family=Urbanist&family=Raleway&family=Rubik&family=Merriweather&family=Playfair+Display&family=Lora&family=Libre+Baskerville&family=Crimson+Pro&family=Cormorant+Garamond&family=PT+Serif&family=Source+Serif+4&family=Spectral&family=EB+Garamond&family=Alegreya&family=Domine&family=Bebas+Neue&family=Oswald&family=Anton&family=Archivo+Black&family=Fjalla+One&family=Righteous&family=Bangers&family=Comfortaa&family=Baloo+2&family=Fredoka&family=Lilita+One&family=Pacifico&family=Fira+Code&family=JetBrains+Mono&family=Source+Code+Pro&family=IBM+Plex+Mono&family=Roboto+Mono&family=Inconsolata&family=Space+Mono&family=Ubuntu+Mono&family=DM+Mono&family=Victor+Mono&family=Anonymous+Pro&display=swap"
