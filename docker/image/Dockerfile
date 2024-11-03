FROM python:3.11-slim as builder

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/opt/python/lib/python3.11/site-packages

WORKDIR /app
COPY requirements.txt /app

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install --prefix /opt/python  -r requirements.txt

FROM python:3.11-slim as production

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/opt/python/lib/python3.11/site-packages
ENV PATH $PATH:/opt/python/bin

RUN mkdir /app
WORKDIR /app

#COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages/
COPY --from=builder /opt/python /opt/python
COPY --from=builder /app /app/
