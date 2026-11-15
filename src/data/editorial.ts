import type { PhotoKey } from "./photos";
import type { RoomId } from "../lib/availability";

// Editorial presentation; fictitious quantities, capacities and rates live in lib/availability.
export const rooms: {
  id: RoomId;
  name: string;
  mood: string;
  image: PhotoKey;
  description: string;
  details: string[];
}[] = [
  {
    id: "ulivo",
    name: "Camera Ulivo",
    mood: "Toni naturali · Un angolo per leggere",
    image: "ulivo",
    description:
      "Il verde salvia incontra il legno e la luce del mattino. Una poltrona vicino alla finestra, le valigie finalmente disfatte e lo spazio per sentirsi già in vacanza.",
    details: [
      "Palette verde salvia e lino",
      "Letto matrimoniale immaginato",
      "Angolo lettura raccolto",
    ],
  },
  {
    id: "acqua",
    name: "Camera Acqua",
    mood: "Luce chiara · Sfumature d’estate",
    image: "acqua",
    description:
      "Azzurri polverosi, tessuti leggeri e dettagli che ricordano l’acqua. L’idea di una camera fresca e luminosa, dove rientrare dopo una giornata trascorsa tra i borghi.",
    details: [
      "Tessuti nei toni dell’acqua",
      "Materiali chiari e trame leggere",
      "Atmosfera luminosa e ariosa",
    ],
  },
  {
    id: "lino",
    name: "Camera Lino",
    mood: "Colori caldi · Piccoli rituali",
    image: "dettaglio",
    description:
      "Il piacere di aprire un libro prima di alzarsi. Toni miele, tende chiare e una semplicità curata: un rifugio intimo per chi ama le mattine che cominciano piano.",
    details: [
      "Colori lino e miele",
      "Dettagli in legno naturale",
      "Un’atmosfera intima e tranquilla",
    ],
  },
];
export const experiences: {
  id: string;
  name: string;
  moment: string;
  image: PhotoKey;
  description: string;
  suggestion: string;
}[] = [
  {
    id: "ulivi",
    name: "Il sentiero degli ulivi",
    moment: "Al mattino · All’aria aperta",
    image: "uliveto",
    description:
      "Uscire quando l’aria è ancora fresca, seguire un filare e fermarsi dove si apre il panorama. Una passeggiata senza un traguardo da raggiungere, da accompagnare con scarpe comode e curiosità.",
    suggestion:
      "Il momento da cercare: la luce che attraversa le foglie argentate.",
  },
  {
    id: "acqua",
    name: "Un pomeriggio d’estate",
    moment: "Nel pomeriggio · Tempo per sé",
    image: "finestra",
    description:
      "Nel nostro racconto, una sosta a bordo piscina alterna un tuffo a qualche pagina di lettura. All’ombra, un telo leggero e un bicchiere d’acqua: la giornata può restare tutta qui.",
    suggestion: "Il momento da cercare: il riflesso delle colline sull’acqua.",
  },
  {
    id: "tramonto",
    name: "Aspettare l’ultima luce",
    moment: "Verso sera · Paesaggio",
    image: "orizzonti",
    description:
      "Scegliere un punto panoramico, lasciare il telefono in tasca e guardare i colori cambiare. La Toscana, al tramonto, si scopre anche così: senza un programma da riempire.",
    suggestion:
      "Il momento da cercare: i cipressi che si disegnano contro il cielo.",
  },
];
