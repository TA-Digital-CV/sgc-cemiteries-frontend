# Mock API for FE-01-Cemiterio

This directory provides mock endpoints under `src/app/api/v1` that mirror the backend BE-01-Cemiterio. It supports a simple substitution system to switch between local mocks and the real backend without changing frontend code.

## How Substitution Works
- Set `NEXT_PUBLIC_API_URL` to `http://localhost:3000` so the frontend services call local routes: `/api/v1/...`.
- Toggle backend usage via environment variables:
  - `USE_REAL_BACKEND=true` and `REAL_API_URL=https://api.sgc.gov.cv/api/v1` → routes proxy to the real backend.
  - `USE_REAL_BACKEND=false` → routes return mock data.

The route handlers preserve path and query, so the interface (paths, parameters, payloads) remains the same.

## Endpoints Covered
- Cemeteries: list, CRUD, `/{id}/statistics`, `/{id}/structure`, `/{id}/map-data`, `/{id}/occupancy`, `/{id}/capacity-projection`, `/{id}/heatmap-data`, `/{id}/availability`.
- Plots: list, CRUD, `/statistics`, `/search`, `/{id}/geolocation`, `/{id}/qr-code`, `/bulk-qr-generation`.

## Usage Examples (PowerShell)
```powershell
# List cemeteries
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/cemeteries" -UseBasicParsing

# Cemetery statistics
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/statistics" -UseBasicParsing

# Occupancy
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/occupancy" -UseBasicParsing

# Map data (PLOTS)
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/map-data?level=PLOTS&format=GEOJSON" -UseBasicParsing

# Plot search
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/plots/search?plotNumber=A1" -UseBasicParsing
```

## Tests
Basic tests are provided as a PowerShell script in `src/app/api/tests/test.ps1`.
- Validate status codes and JSON payload shape for key routes.
- Adjust the `USE_REAL_BACKEND` and `REAL_API_URL` to test proxy behavior.

## Notes
- These mocks are intended for local development only.
- Ensure `auth` constraints are disabled or mocked appropriately during local testing.
- When `USE_REAL_BACKEND=true`, all supported routes proxy to the real API; unimplemented routes should be added progressively.
