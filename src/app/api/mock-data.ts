/* eslint-disable @typescript-eslint/no-explicit-any */
export const cemeteries = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    municipalityId: "123e4567-e89b-12d3-a456-426614174000",
    name: "Cemitério Municipal da Praia",
    address: "Rua Principal, Praia, Santiago",
    geoPoint: { latitude: 14.9177, longitude: -23.5092 },
    totalArea: 15000.5,
    maxCapacity: 2500,
    currentOccupancy: 1847,
    occupancyRate: 73.88,
    status: "ACTIVE",
    createdDate: "2024-01-15T10:30:00Z",
    lastModifiedDate: "2024-01-20T14:45:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    municipalityId: "123e4567-e89b-12d3-a456-426614174000",
    name: "Cemitério de São Vicente",
    address: "Avenida Marginal, Mindelo, São Vicente",
    geoPoint: { latitude: 16.8866, longitude: -24.9817 },
    totalArea: 12000.0,
    maxCapacity: 1800,
    currentOccupancy: 1620,
    occupancyRate: 90.0,
    status: "ACTIVE",
    createdDate: "2024-02-10T09:00:00Z",
    lastModifiedDate: "2024-02-15T11:00:00Z",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440002",
    municipalityId: "123e4567-e89b-12d3-a456-426614174000",
    name: "Cemitério do Sal",
    address: "Rua das Flores, Espargos, Sal",
    geoPoint: { latitude: 16.7644, longitude: -22.9444 },
    totalArea: 8000.0,
    maxCapacity: 1200,
    currentOccupancy: 540,
    occupancyRate: 45.0,
    status: "ACTIVE",
    createdDate: "2024-03-05T14:30:00Z",
    lastModifiedDate: "2024-03-10T16:00:00Z",
  },
];

export const plots = [
  {
    id: "aa0e8400-e29b-41d4-a716-446655440004",
    cemeteryId: cemeteries[0].id,
    blockId: "770e8400-e29b-41d4-a716-446655440001",
    sectionId: "880e8400-e29b-41d4-a716-446655440002",
    plotNumber: "A1-001",
    plotType: "GROUND",
    occupationStatus: "AVAILABLE",
    geoPoint: { latitude: 14.9176, longitude: -23.5091 },
    qrCode: "QR_A1_001_2024",
    dimensions: { length: 2.5, width: 1.2, depth: 1.8, unit: "meters" },
    notes: null,
    createdDate: "2024-01-15T11:00:00Z",
    lastModifiedDate: "2024-01-15T11:00:00Z",
  },
];

export const blocks = [
  {
    id: "770e8400-e29b-41d4-a716-446655440001",
    cemeteryId: cemeteries[0].id,
    name: "Bloco A",
    description: "Bloco principal - entrada norte",
    maxCapacity: 500,
    currentOccupancy: 387,
    occupancyRate: 77.4,
    status: "ACTIVE",
    geoPolygon: {
      type: "Polygon",
      coordinates: [
        [
          [-23.5092, 14.9177],
          [-23.509, 14.9177],
          [-23.509, 14.9175],
          [-23.5092, 14.9175],
          [-23.5092, 14.9177],
        ],
      ],
    },
  },
];

export const sections = [
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    cemeteryId: cemeteries[0].id,
    blockId: blocks[0].id,
    name: "Secção A1",
    description: "Sepulturas tradicionais",
    maxCapacity: 100,
    currentOccupancy: 78,
    occupancyRate: 78.0,
    status: "ACTIVE",
  },
];

export function pageable<T>(items: T[], page = 0, size = 10) {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    pageable: {
      page,
      size,
      totalElements: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / size)),
    },
  };
}
