FROM python:3.10-slim

WORKDIR /code

# Cesty jsou nyní relativní ke složce `connectors/odoo`
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.connector:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]