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
export const salesHistory = [];

// Lista de códigos de propiedades/calcas vendidas
export const soldCodes = salesHistory.map(item => item.code);

export const stickersData = Object.keys(imageModules).map((path, index) => {
  const fileName = path.split('/').pop().replace('.jpg', '').toLowerCase();

  const kitMatch = fileName.match(/k\d{1,2}/i);
  const baseKit = kitMatch ? kitMatch[0].toUpperCase() : 'K';
  
  const uniqueLetter = letters[index % letters.length];
  const uniqueCode = `${baseKit}${uniqueLetter}`;

  const rotationAngle = rotationsByCode[uniqueCode] !== undefined ? rotationsByCode[uniqueCode] : 0;
  const isSold = soldCodes.includes(uniqueCode);

  return {
    id: fileName,
    code: uniqueCode,
    price: '₡300',
    rotate: rotationAngle,
    image: imageModules[path].default,
    status: isSold ? 'vendido' : 'disponible'
  };
});