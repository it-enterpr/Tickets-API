# --- Fáze 1: Sestavení React Frontendu ---
FROM node:18-alpine as frontend-builder

WORKDIR /app
# Tato cesta je správná, pokud je build kontext nastaven na '.' v docker-compose.yml
COPY frontend/task-man-app/package.json frontend/task-man-app/package-lock.json ./
RUN npm install

# Tato cesta je také správná vzhledem ke kontextu '.'
COPY frontend/task-man-app ./

RUN npm run build


# --- Fáze 2: Sestavení Python Backendu ---
FROM python:3.10-slim

WORKDIR /code
COPY --from=frontend-builder /app/dist /code/core_api/app/static/build

# Cesty zde musí začínat './core_api/', protože build kontext je o úroveň výš
COPY ./core_api/requirements.txt /code/
RUN pip install --no-cache-dir -r /code/requirements.txt

COPY ./core_api/app /code/app

# CMD je nyní v docker-compose.yml