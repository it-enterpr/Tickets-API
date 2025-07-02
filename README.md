# API-Man v1.0

Univerzální API brána pro propojení s různými podnikovými systémy.

## Předpoklady

- Nainstalovaný a spuštěný Docker a Docker Compose.

## První spuštění

1.  **Konfigurace:**
    - Vytvořte kopii souboru `.env.example` a pojmenujte ji `.env`.
    - Otevřete soubor `.env` a vyplňte všechny potřebné hodnoty (přístupy k databázi, tajné klíče).

2.  **Spuštění:**
    - **Linux / macOS:** Spusťte skript `./start.sh`
    - **Windows:** Spusťte skript `start.bat` (jeho obsah bude `docker compose up -d --build`)

Aplikace se spustí na pozadí. Hlavní API bude dostupné na `http://localhost:8000`.

## Zastavení

Pro zastavení všech služeb použijte v terminálu příkaz:
`docker compose down`