$ErrorActionPreference = "Stop"

function Test-Endpoint {
  param(
    [string]$Url,
    [int]$ExpectedStatus = 200
  )
  $res = Invoke-WebRequest -Uri $Url -UseBasicParsing
  if ($res.StatusCode -ne $ExpectedStatus) {
    throw "Unexpected status for ${Url}: $($res.StatusCode)"
  }
  Write-Host "OK ${Url} ($ExpectedStatus)"
}

Test-Endpoint -Url "http://localhost:3000/api/health"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/statistics"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/occupancy"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/map-data?level=PLOTS&format=GEOJSON"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/capacity-projection?projectionPeriod=12"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/heatmap-data?gridSize=50&metric=OCCUPANCY"
Test-Endpoint -Url "http://localhost:3000/api/v1/cemeteries/550e8400-e29b-41d4-a716-446655440000/availability"
Test-Endpoint -Url "http://localhost:3000/api/v1/plots"
Test-Endpoint -Url "http://localhost:3000/api/v1/plots/statistics"
Test-Endpoint -Url "http://localhost:3000/api/v1/plots/search?plotNumber=A1"
