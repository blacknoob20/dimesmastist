import type { CatalogCoin } from '@/types/catalog'

export const CATALOG_SEED: readonly CatalogCoin[] = [
  // --- Ecuador ---
  { id: 'km-88', denomination: '1 Sucre', country: 'Ecuador', year: 1994, metal: 'Níquel', km: 'KM#88', weight: 5.0, diameter: 24.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-86', denomination: '1 Sucre', country: 'Ecuador', year: 1987, metal: 'Cobre-Níquel', km: 'KM#86', weight: 5.0, diameter: 24.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-169', denomination: '50 Centavos', country: 'Ecuador', year: 1943, metal: 'Cobre', km: 'KM#169', weight: 5.0, diameter: 23.0, shape: 'Circular', edge: 'Liso' },

  // --- México ---
  { id: 'km-407', denomination: '1 Peso', country: 'México', year: 1898, metal: 'Plata 0.720', km: 'KM#407', weight: 27.07, diameter: 39.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-614', denomination: '1 Peso Hidalgo', country: 'México', year: 1947, metal: 'Plata 0.720', km: 'KM#614', weight: 16.0, diameter: 34.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-630', denomination: '5 Centavos', country: 'México', year: 1942, metal: 'Acero', km: 'KM#630', weight: 2.0, diameter: 17.0, shape: 'Circular', edge: 'Liso' },

  // --- Alemania ---
  { id: 'km-215', denomination: '2 Euros', country: 'Alemania', year: 2002, metal: 'Bimetálica', km: 'KM#215', weight: 8.5, diameter: 25.75, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-185', denomination: '1 Marco', country: 'Alemania', year: 1972, metal: 'Acero', km: 'KM#185', weight: 5.5, diameter: 26.5, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-123', denomination: '5 Pfennig', country: 'Alemania', year: 1950, metal: 'Cobre', km: 'KM#123', weight: 2.0, diameter: 18.0, shape: 'Circular', edge: 'Liso' },

  // --- Brasil ---
  { id: 'km-575', denomination: '50 Centavos', country: 'Brasil', year: 1970, metal: 'Acero', km: 'KM#575', weight: 4.0, diameter: 23.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-656', denomination: '1 Real', country: 'Brasil', year: 2000, metal: 'Acero', km: 'KM#656', weight: 4.8, diameter: 27.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-538', denomination: '1 Cruzeiro', country: 'Brasil', year: 1968, metal: 'Níquel', km: 'KM#538', weight: 3.0, diameter: 22.0, shape: 'Circular', edge: 'Liso' },

  // --- USA ---
  { id: 'km-150', denomination: '1 Dólar', country: 'USA', year: 1921, metal: 'Plata 0.900', km: 'KM#150', weight: 26.73, diameter: 38.1, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-162', denomination: '1 Dólar Peace', country: 'USA', year: 1923, metal: 'Plata 0.900', km: 'KM#162', weight: 26.73, diameter: 38.1, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-231', denomination: '5 Centavos Jefferson', country: 'USA', year: 1964, metal: 'Níquel', km: 'KM#231', weight: 5.0, diameter: 21.2, shape: 'Circular', edge: 'Liso' },

  // --- Argentina ---
  { id: 'km-31', denomination: '10 Pesos', country: 'Argentina', year: 1887, metal: 'Oro', km: 'KM#31', weight: 8.064, diameter: 27.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-19', denomination: '1 Peso Ley 1899', country: 'Argentina', year: 1899, metal: 'Plata 0.900', km: 'KM#19', weight: 25.0, diameter: 37.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-40', denomination: '5 Centavos', country: 'Argentina', year: 1953, metal: 'Cobre-Níquel', km: 'KM#40', weight: 4.0, diameter: 20.0, shape: 'Circular', edge: 'Liso' },

  // --- Perú ---
  { id: 'km-265', denomination: '5 Soles', country: 'Perú', year: 1975, metal: 'Cobre-Níquel', km: 'KM#265', weight: 8.0, diameter: 30.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-163', denomination: '1 Sol', country: 'Perú', year: 1918, metal: 'Plata 0.720', km: 'KM#163', weight: 5.0, diameter: 23.0, shape: 'Circular', edge: 'Estriado' },

  // --- Colombia ---
  { id: 'km-177', denomination: '1 Peso', country: 'Colombia', year: 1942, metal: 'Cobre-Níquel', km: 'KM#177', weight: 5.0, diameter: 25.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-206', denomination: '5 Pesos', country: 'Colombia', year: 1967, metal: 'Cobre-Níquel', km: 'KM#206', weight: 8.0, diameter: 28.0, shape: 'Circular', edge: 'Estriado' },

  // --- Chile ---
  { id: 'km-155', denomination: '1 Peso', country: 'Chile', year: 1933, metal: 'Plata 0.720', km: 'KM#155', weight: 4.0, diameter: 22.0, shape: 'Circular', edge: 'Liso' },

  // --- Venezuela ---
  { id: 'km-61', denomination: '1 Bolívar', country: 'Venezuela', year: 1967, metal: 'Cobre-Níquel', km: 'KM#61', weight: 5.0, diameter: 25.0, shape: 'Circular', edge: 'Liso' },

  // --- Bolivia ---
  { id: 'km-181', denomination: '1 Boliviano', country: 'Bolivia', year: 1991, metal: 'Acero', km: 'KM#181', weight: 4.5, diameter: 24.0, shape: 'Circular', edge: 'Estriado' },

  // --- Uruguay ---
  { id: 'km-17', denomination: '1 Peso', country: 'Uruguay', year: 1924, metal: 'Plata 0.720', km: 'KM#17', weight: 4.0, diameter: 23.0, shape: 'Circular', edge: 'Liso' },

  // --- Paraguay ---
  { id: 'km-24', denomination: '1 Guaraní', country: 'Paraguay', year: 1953, metal: 'Cobre-Níquel', km: 'KM#24', weight: 5.0, diameter: 25.0, shape: 'Circular', edge: 'Liso' },

  // --- Francia ---
  { id: 'km-940', denomination: '1 Franco', country: 'Francia', year: 1960, metal: 'Níquel', km: 'KM#940', weight: 6.0, diameter: 24.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-893', denomination: '1 Franco Semeuse', country: 'Francia', year: 1917, metal: 'Bronce', km: 'KM#893', weight: 5.0, diameter: 24.0, shape: 'Circular', edge: 'Liso' },

  // --- España ---
  { id: 'km-821', denomination: '5 Pesetas', country: 'España', year: 1957, metal: 'Acero', km: 'KM#821', weight: 5.5, diameter: 23.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-786', denomination: '1 PTA', country: 'España', year: 1940, metal: 'Aluminio', km: 'KM#786', weight: 3.0, diameter: 22.0, shape: 'Circular', edge: 'Liso' },

  // --- Italia ---
  { id: 'km-87', denomination: '5 Lire', country: 'Italia', year: 1930, metal: 'Acero', km: 'KM#87', weight: 3.2, diameter: 20.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-132', denomination: '500 Lire', country: 'Italia', year: 1982, metal: 'Acero', km: 'KM#132', weight: 11.0, diameter: 29.0, shape: 'Circular', edge: 'Estriado' },

  // --- Reino Unido ---
  { id: 'km-866', denomination: '1 Crown', country: 'Reino Unido', year: 1953, metal: 'Cuproníquel', km: 'KM#866', weight: 28.3, diameter: 38.6, shape: 'Circular', edge: 'Milling' },
  { id: 'km-821', denomination: '1 Florin', country: 'Reino Unido', year: 1920, metal: 'Plata 0.500', km: 'KM#821', weight: 5.65, diameter: 24.0, shape: 'Circular', edge: 'Milling' },

  // --- Japón ---
  { id: 'km-82', denomination: '1 Yen', country: 'Japón', year: 1955, metal: 'Aluminio', km: 'KM#82', weight: 1.0, diameter: 20.0, shape: 'Circular', edge: 'Liso' },
  { id: 'km-100', denomination: '50 Yen', country: 'Japón', year: 1972, metal: 'Cuproníquel', km: 'KM#100', weight: 4.0, diameter: 21.0, shape: 'Circular', edge: 'Estriado' },

  // --- Egipto ---
  { id: 'km-420', denomination: '1 Libra', country: 'Egipto', year: 1968, metal: 'Plata 0.680', km: 'KM#420', weight: 8.0, diameter: 28.0, shape: 'Circular', edge: 'Estriado' },
  { id: 'km-342', denomination: '1 Millième', country: 'Egipto', year: 1945, metal: 'Bronce', km: 'KM#342', weight: 4.0, diameter: 21.0, shape: 'Circular', edge: 'Liso' },

  // --- Canadá ---
  { id: 'km-59', denomination: '5 Centavos Beaver', country: 'Canadá', year: 1942, metal: 'Níquel', km: 'KM#59', weight: 4.55, diameter: 21.3, shape: 'Circular', edge: 'Liso' },

  // --- Australia ---
  { id: 'km-30', denomination: '1 Florin', country: 'Australia', year: 1954, metal: 'Cuproníquel', km: 'KM#30', weight: 5.65, diameter: 28.5, shape: 'Circular', edge: 'Milling' },

  // --- China ---
  { id: 'km-423', denomination: '1 Yuan', country: 'China', year: 1991, metal: 'Acero', km: 'KM#423', weight: 6.05, diameter: 25.0, shape: 'Circular', edge: 'Estriado' },
]
