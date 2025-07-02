FROM python:3.10-slim

WORKDIR /code

# Cesty jsou nyní relativní ke složce `core_api`
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

# Spouštěcí příkaz je nyní zde
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]