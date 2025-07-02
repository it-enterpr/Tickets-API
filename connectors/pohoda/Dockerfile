FROM python:3.10-slim
WORKDIR /code

# OPRAVA ZDE: Hledáme requirements.txt přímo v build kontextu (složce 'pohoda')
COPY ./requirements.txt /code/
RUN pip install --no-cache-dir -r /code/requirements.txt

COPY ./app /code/app