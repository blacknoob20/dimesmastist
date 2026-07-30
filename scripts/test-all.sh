#!/usr/bin/env bash
set -euo pipefail
COVERAGE_MIN=90

echo "==> [1/5] Go tests con cobertura"
cd backend
go test ./... -count=1 -race -timeout 90s \
    -coverprofile=coverage.out -covermode=atomic
cd ..

echo "==> [2/5] Verificación de cobertura ≥ ${COVERAGE_MIN}%"
TOTAL=$(go tool cover -func=backend/coverage.out | tail -1 | awk '{print $3}' | tr -d '%')
echo "    Cobertura total: ${TOTAL}%"
if (( $(echo "${TOTAL} < ${COVERAGE_MIN}" | bc -l) )); then
    echo "    ❌ FAIL: cobertura por debajo del mínimo (${COVERAGE_MIN}%)"
    go tool cover -func=backend/coverage.out | grep -E "total|---"
    exit 1
fi
echo "    ✅ PASS"

echo "==> [3/5] Build backend image"
docker compose build backend

echo "==> [4/5] Levantar stack (nginx + backend + react)"
docker compose up -d nginx
docker compose --profile test run --rm playwright

echo "==> [5/5] Apagar stack"
docker compose down

echo ""
echo "✅ TODOS LOS TESTS EN VERDE"
