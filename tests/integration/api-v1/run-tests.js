/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * runIntegrationTests
 * Executes HTTP requests against local Next.js API routes to validate contracts.
 */
async function runIntegrationTests() {
  const base = process.env.TEST_BASE_URL || "http://localhost:3000";
  const cases = [
    {
      name: "GET /api/v1/cemeteries",
      url: `${base}/api/v1/cemeteries?page=0&size=10`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["content", "pageable"],
    },
    {
      name: "POST /api/v1/cemeteries",
      url: `${base}/api/v1/cemeteries`,
      method: "POST",
      body: {
        municipalityId: "123e4567-e89b-12d3-a456-426614174000",
        name: "Cemitério Teste",
        address: "Praia",
        geoPoint: { latitude: 14.9177, longitude: -23.5092 },
        totalArea: 1000,
        maxCapacity: 10,
      },
      expectStatus: 201,
      expectKeys: ["data"],
    },
    {
      name: "GET /api/v1/plots",
      url: `${base}/api/v1/plots?page=0&size=10`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["data", "pageable"],
    },
    {
      name: "GET /api/v1/plots/search",
      url: `${base}/api/v1/plots/search?plotType=GROUND`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["data"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/structure",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/structure`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["cemeteryId", "structure", "summary"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/occupancy",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/occupancy`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["overall", "byBlocks"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/statistics",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/statistics`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["cemeteryId", "occupancyStats"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/map-data",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/map-data?level=BLOCKS`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["type", "features", "metadata"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/heatmap-data",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/heatmap-data`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["gridSize", "data"],
    },
    {
      name: "GET /api/v1/cemeteries/{id}/availability",
      url: `${base}/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/availability?plotType=GROUND&limit=5`,
      method: "GET",
      expectStatus: 200,
      expectKeys: ["cemeteryId", "availablePlots", "summary"],
    },
  ];

  let failures = 0;
  for (const c of cases) {
    const res = await fetch(c.url, {
      method: c.method,
      headers: {
        "content-type": "application/json",
      },
      body: c.body ? JSON.stringify(c.body) : undefined,
    });
    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json") || c.method === "GET";
    const payload = isJson
      ? await res.json().catch(() => ({}))
      : await res.text();
    const ok =
      res.status === c.expectStatus &&
      c.expectKeys.every((k) => Object.hasOwn(payload, k));
    console.log(`${ok ? "OK" : "FAIL"} - ${c.name} - status=${res.status}`);
    if (!ok) {
      failures++;
      console.log("Resposta:", payload);
    }
  }
  if (failures > 0) {
    console.error(`Erros encontrados: ${failures}`);
    process.exit(1);
  }
  console.log("Todos os testes de integração passaram.");
}

runIntegrationTests().catch((err) => {
  console.error("Erro ao executar testes:", err);
  process.exit(1);
});
