export interface QuizQuestion {
  id: string;
  prompt: string;
  itemId?: string;
  options: string[];
  correctIndex: number;
  explain: string;
}

export interface QuizLevel {
  id: string;
  title: string;
  subtitle: string;
  passScore: number;
  badge: string;
  questions: QuizQuestion[];
}

const BIN_OPTIONS = ["Recycle", "Compost", "Trash", "Hazardous"];

export const QUIZ_LEVELS: QuizLevel[] = [
  {
    id: "level-1",
    title: "Greenhorn",
    subtitle: "Five everyday items. Get your bearings.",
    passScore: 70,
    badge: "quiz-greenhorn",
    questions: [
      {
        id: "l1-q1",
        prompt: "Where does a banana peel belong?",
        itemId: "banana-peel",
        options: BIN_OPTIONS,
        correctIndex: 1,
        explain: "Food scraps break down into nutrient-rich soil in compost."
      },
      {
        id: "l1-q2",
        prompt: "What about an empty aluminum soda can?",
        itemId: "aluminum-can",
        options: BIN_OPTIONS,
        correctIndex: 0,
        explain: "Recycling aluminum saves 95% of the energy vs. making it new."
      },
      {
        id: "l1-q3",
        prompt: "A dead AA battery: which bin?",
        itemId: "aa-battery",
        options: BIN_OPTIONS,
        correctIndex: 3,
        explain: "Heavy metals leach in landfills. Most hardware stores accept batteries free."
      },
      {
        id: "l1-q4",
        prompt: "A flattened cardboard shipping box?",
        itemId: "cardboard",
        options: BIN_OPTIONS,
        correctIndex: 0,
        explain: "Cardboard is one of the most-recycled materials. Flatten it and pull off heavy tape."
      },
      {
        id: "l1-q5",
        prompt: "A pile of dry autumn leaves?",
        itemId: "leaves",
        options: BIN_OPTIONS,
        correctIndex: 1,
        explain: "Leaves are excellent 'browns' for compost. Many cities pick them up curbside in fall."
      }
    ]
  },
  {
    id: "level-2",
    title: "Sorter",
    subtitle: "Seven mixed cases. The bin isn't always obvious.",
    passScore: 70,
    badge: "quiz-sorter",
    questions: [
      {
        id: "l2-q1",
        prompt: "A glass jar from pasta sauce: what's the right prep before recycling?",
        itemId: "glass-jar",
        options: [
          "Toss it straight in, sauce and all",
          "Rinse it; lid on or off per local rules",
          "Smash it first to save space",
          "Soak off the label completely"
        ],
        correctIndex: 1,
        explain: "Glass is endlessly recyclable. A quick rinse keeps the load clean; lid policy varies by city."
      },
      {
        id: "l2-q2",
        prompt: "A used coffee filter with grounds inside?",
        itemId: "coffee-grounds",
        options: BIN_OPTIONS,
        correctIndex: 1,
        explain: "Coffee grounds are an excellent nitrogen source. The paper filter goes in too."
      },
      {
        id: "l2-q3",
        prompt: "A plastic grocery bag from the supermarket?",
        itemId: "plastic-bag",
        options: BIN_OPTIONS,
        correctIndex: 2,
        explain: "Soft plastic film tangles recycling machinery. Take to a store drop-off if you can; otherwise trash."
      },
      {
        id: "l2-q4",
        prompt: "An old smartphone you don't use anymore?",
        itemId: "phone-old",
        options: BIN_OPTIONS,
        correctIndex: 3,
        explain: "E-waste contains valuable and toxic materials. Use a manufacturer or municipal drop-off."
      },
      {
        id: "l2-q5",
        prompt: "Which of these contaminates a paper-recycling stream the most?",
        options: [
          "A clean cereal box",
          "A greasy pizza box",
          "A stack of office paper",
          "A flattened mailing envelope"
        ],
        correctIndex: 1,
        explain: "Grease soaks into paper fibers and ruins the pulp. Compost the soiled parts; recycle a clean lid."
      },
      {
        id: "l2-q6",
        prompt: "A worn-out cotton t-shirt with a few holes?",
        itemId: "tshirt-worn",
        options: [
          "Trash, it's torn and no one wants it",
          "Compost, cotton is natural",
          "Recycle with paper",
          "Textile drop-off, even torn fabric gets recycled"
        ],
        correctIndex: 3,
        explain: "Don't trash textiles. Donate good ones; even ripped fabric is accepted at textile drop-offs as rags or fiber."
      },
      {
        id: "l2-q7",
        prompt: "A yogurt cup marked #5 (PP)?",
        itemId: "yogurt-cup",
        options: BIN_OPTIONS,
        correctIndex: 0,
        explain: "PP plastic #5 is widely recyclable when rinsed."
      }
    ]
  },
  {
    id: "level-3",
    title: "Master",
    subtitle: "Ten tricky cases. Tiny details matter.",
    passScore: 80,
    badge: "quiz-master",
    questions: [
      {
        id: "l3-q1",
        prompt: "A grocery-store thermal-paper receipt?",
        itemId: "receipt",
        options: BIN_OPTIONS,
        correctIndex: 2,
        explain: "Thermal paper is coated with BPA/BPS, which contaminates paper recycling. Ask for digital receipts when possible."
      },
      {
        id: "l3-q2",
        prompt: "A used tea bag from a supermarket box?",
        itemId: "tea-bag",
        options: [
          "Always compost, it's just paper and tea",
          "Always trash, too risky",
          "Compost, but tear it first if you're unsure of plastic mesh",
          "Recycle with paper"
        ],
        correctIndex: 2,
        explain: "Tea is compostable, but some bags use plastic mesh. Tearing the leaves out side-steps the question."
      },
      {
        id: "l3-q3",
        prompt: "A laminated toothpaste tube, squeezed empty?",
        itemId: "toothpaste-tube",
        options: BIN_OPTIONS,
        correctIndex: 2,
        explain: "Most tubes are mixed-material laminates that aren't curbside-recyclable. Toothpaste tabs are a great swap."
      },
      {
        id: "l3-q4",
        prompt: "Half a can of leftover latex paint?",
        itemId: "paint-can",
        options: [
          "Pour down the drain, it's water-based",
          "Trash with the lid off",
          "Solidify it or take to a Household Hazardous Waste facility",
          "Recycle the can, paint and all"
        ],
        correctIndex: 2,
        explain: "Liquid paint can't go in the trash or down drains. Solidify with cat litter or take to an HHW facility."
      },
      {
        id: "l3-q5",
        prompt: "A burned-out CFL (curly) lightbulb?",
        itemId: "lightbulb-cfl",
        options: BIN_OPTIONS,
        correctIndex: 3,
        explain: "CFLs contain mercury. Home Depot, IKEA, and many cities take them. LEDs are a mercury-free upgrade."
      },
      {
        id: "l3-q6",
        prompt: "A windowed business envelope with the plastic film still in it?",
        itemId: "envelope-window",
        options: [
          "Trash, the window ruins it",
          "Recycle as-is in most curbside programs",
          "Compost, paper and plastic are both fine",
          "Hazardous"
        ],
        correctIndex: 1,
        explain: "Most modern recyclers handle the small plastic window. If your city says otherwise, tear it out first."
      },
      {
        id: "l3-q7",
        prompt: "A wad of chewing gum?",
        itemId: "chewing-gum",
        options: BIN_OPTIONS,
        correctIndex: 2,
        explain: "Most gum bases are synthetic plastic. Wrap it in paper before binning so it doesn't stick."
      },
      {
        id: "l3-q8",
        prompt: "Half a bottle of expired prescription medication?",
        itemId: "medication",
        options: [
          "Flush it so no one finds it",
          "Trash with the cap on",
          "Take to a pharmacy take-back box",
          "Recycle the bottle, contents and all"
        ],
        correctIndex: 2,
        explain: "Don't flush. It contaminates water supplies. Pharmacy take-back programs handle drugs safely."
      },
      {
        id: "l3-q9",
        prompt: "A disposable plastic-and-metal razor at the end of its life?",
        itemId: "razor-blade",
        options: BIN_OPTIONS,
        correctIndex: 3,
        explain: "Mixed metal-plus-plastic with a sharp blade. Use a TerraCycle drop-off, or upgrade to a safety razor."
      },
      {
        id: "l3-q10",
        prompt: "Dog poop from a walk, in a compostable bag?",
        itemId: "pet-poop",
        options: [
          "Home compost, the bag says compostable",
          "Flush it down the toilet",
          "Trash, unless your city has a pet-waste program",
          "Bury in the garden"
        ],
        correctIndex: 2,
        explain: "Pet pathogens survive home compost. Some cities have pet-waste programs; otherwise, trash is the safe choice."
      }
    ]
  }
];

export function getLevel(id: string) {
  return QUIZ_LEVELS.find((l) => l.id === id);
}
