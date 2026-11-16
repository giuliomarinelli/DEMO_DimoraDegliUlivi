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
      "Nel nostro mattino immaginato, una passeggiata tra gli ulivi diventa un piccolo esercizio di osservazione. Scegli un tronco, segui con gli occhi i nodi della corteccia e confronta il verde delle foglie con il loro rovescio argentato. Su un taccuino puoi annotare un colore o abbozzare una forma: un ricordo diverso dalla solita fotografia.",
    suggestion:
      "Da portare nel racconto: un taccuino e una matita, per raccogliere un dettaglio.",
  },
  {
    id: "acqua",
    name: "Un pomeriggio d’estate",
    moment: "Nel pomeriggio · Tempo per sé",
    image: "finestra",
    description:
      "Il pomeriggio della nostra storia si divide fra un tuffo e un libro portato da casa. Dopo l’acqua, riprendi il capitolo lasciato a metà e scegli una frase da ricordare. La piscina è una scena narrativa della dimora fittizia: qui immaginiamo una pausa personale, senza attività organizzate o attrezzature fornite.",
    suggestion:
      "Un piccolo rituale: lasciare il segnalibro fra due pagine, poi riprendere da lì.",
  },
  {
    id: "tramonto",
    name: "Aspettare l’ultima luce",
    moment: "Verso sera · Un ricordo da tenere",
    image: "orizzonti",
    description:
      "Verso sera immaginiamo di fermarci a guardare lo stesso tratto di colline mentre cambia colore. Prova a scegliere tre parole per descriverlo, poi torna al taccuino del mattino: che cosa aggiungeresti? Il ricordo della giornata può finire in poche righe, da rileggere una volta a casa.",
    suggestion:
      "Da tenere per sé: tre parole sul tramonto, invece di un’altra lista di cose da fare.",
  },
];
