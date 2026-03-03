import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";

// default font
export const inter = Inter({
  subsets: ["latin"],
});

// PHISH
export const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

// WISE
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
});
