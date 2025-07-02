#!/bin/bash
# Tento skript spustí všechny služby API-Man na pozadí.
echo "Spouštím Tickets-API..."
docker compose up -d --build
echo "Tickets-API byl úspěšně spuštěn."
echo "Core API je dostupné na http://localhost:8000"
echo "Pro zastavení služeb použijte příkaz: docker compose down"