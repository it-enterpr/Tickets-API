FROM python:3.10-slim
WORKDIR /code

# Oprava cesty
COPY ./connectors/pohoda/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Oprava cesty
COPY ./connectors/pohoda/app /code/app