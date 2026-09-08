const imageModules = import.meta.glob('../img/*.jpg', { eager: true });

// Mapeo corregido a 270°/180° para que el texto y diseño queden al derecho
const rotationsByCode = {
  // --- Fila 1 & 2 ---
  K10A: 90,
  K10B: 270,
  K10C: 270,
  K10D: 270,
  K10E: 270,
  K10F: 270,
  K10G: 90,
  K10H: 90,

  // --- K10R & K11 ---
  K10R: 270,
  K10Z: 0,
  K11X: 270,
  K11Y: 90,
  K11P: 270,  // Jackson Racing (Invertida a derecho)
  K11N: 270,  // Graffiti Zombie (Invertida a derecho)
  K11M: 270,    // Osito Crossbones (Normal)

  // --- K20 ---
  K20Q: 270,
  K20A: 270,
  K20B: 270,
  K20C: 270,
  K20D: 270,

  // --- K30 ---
  K30E: 90,
  K30F: 270,    // Manita Verde (Alineada normal)
  K30G: 270,    // Auto / Texto Rojo (Alineado normal)
  K30H: 270,  // Drift for Life (Volteada al derecho)
  K30R: 270,  // Rays Engineering (Invertida a derecho)
  K30Z: 270,  // SDE WUC (Invertida a derecho)

  // --- K40 ---
  K40X: 270,  // New York City (Invertida a derecho)
  K40Y: 270,  // JDM Concept (Invertida a derecho)
  K40P: 270,  // Day of the Dead (Volteada a derecho)
  K40N: 270,  // HKS (Invertida a derecho)
  K40M: 270,  // Summit Racing (Invertida a derecho)
  K40A: 270,  // RUF (Invertida a derecho)
  K40B: 270,  // Volk Racing (Invertida a derecho)

  // --- K50, K60, K70, K90 ---
  K50C: 0,    // Curitas (Normal)
  K50D: 270,  // ProTaper (Invertida a derecho)
  K50E: 270,  // Toxic Verde (Invertida a derecho)
  K50F: 270,  // K&N (Invertida a derecho)
  K60H: 90,
  K60Z: 270,  // Cash Only (Invertida a derecho)
  K60X: 270,  // TRD (Invertida a derecho)
  K70M: 270,  // Advance (Invertida a derecho)
  K90H: 90,
  K90Y: 90,
  K90X: 90,
  K90Z: 90,
  K90R: 90,
};

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'R', 'Z', 'X', 'Y', 'M', 'N', 'P', 'Q'];

// Historial oficial de ventas registradas tras confirmación de pago completo
export const salesHistory = [
  {
    code: 'K30Z',
    client: 'Jonathan',
    price: '₡300',
    date: '2026-09-07',
    status: 'vendido',
    paymentStatus: 'completo'
  }
];

// Lista de códigos de propiedades/calcas vendidas
export const soldCodes = salesHistory.map(item => item.code.toUpperCase());

// Diccionario para clasificar manualmente las calcas exactas por su código
const explicitCategories = {
  'K10A': 'letras',      // Pones el código de la calca exacto : y la categoría entre comillas
  'K30H': 'letras',     // Las categorías válidas son: 'letras', 'logos', 'criaturas', 'premium'
  'K90H': 'letras',
  'K11N': 'criaturas',
  'K70P': 'logos',
  'K10F': 'premium',
  'K20D': 'letras',
  'K10B': 'letras',
  'K10E': 'letras',
  'K10G': 'letras',
  'K10R': 'letras',
  'K11Y': 'letras',
  'K20C': 'letras',
  'K20A': 'letras',
  'K30R': 'letras',
  'K40X': 'letras',
  'K40N': 'letras',
  'K40B': 'letras',
  'K50E': 'premium',
  'K50G': 'letras',
  'K80D': 'letras',
  'K80E': 'letras',
  'K80G': 'letras',
  'K70Q': 'letras',
  'K70A': 'logos',
  'K70B': 'logos',
  'K90Z': 'criaturas',
  'K90Y': 'logos',
  'K10Z': 'premium',
  'K30G': 'premium',
  'K60Z': 'criaturas',
  'K80C': 'criaturas',
  'K40P': 'premium',
};

// Función auxiliar para asignar la categoría de forma precisa
const getCategoryForSticker = (uniqueCode) => {
  // 1. Si está definida explícitamente arriba, usa esa
  if (explicitCategories[uniqueCode]) {
    return explicitCategories[uniqueCode];
  }

  // 2. Clasificación automática inteligente por rangos o prefijos
  if (uniqueCode.startsWith('K9') || uniqueCode.startsWith('K7')) return 'premium';
  if (['K11N', 'K11M', 'K40P'].includes(uniqueCode)) return 'criaturas';
  
  // Por defecto, si no cae en las anteriores, se va a 'logos'
  return 'logos';
};

export const stickersData = Object.keys(imageModules).map((path, index) => {
  const fileName = path.split('/').pop().replace('.jpg', '').toLowerCase();

  const kitMatch = fileName.match(/k\d{1,2}/i);
  const baseKit = kitMatch ? kitMatch[0].toUpperCase() : 'K';
  
  const uniqueLetter = letters[index % letters.length];
  const uniqueCode = `${baseKit}${uniqueLetter}`;

  const rotationAngle = rotationsByCode[uniqueCode] !== undefined ? rotationsByCode[uniqueCode] : 0;
  const isSold = soldCodes.includes(uniqueCode.toUpperCase());
  const assignedCategory = getCategoryForSticker(uniqueCode);
  const price = assignedCategory === 'premium' ? '₡400' : '₡300';

  return {
    id: fileName,
    code: uniqueCode,
    price: price,
    rotate: rotationAngle,
    image: imageModules[path].default,
    category: assignedCategory, // Categoría asignada para los filtros
    status: isSold ? 'vendido' : 'disponible'
  };
});