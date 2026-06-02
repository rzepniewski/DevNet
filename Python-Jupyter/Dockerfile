
# Bazowy obraz z Pythonem
FROM python:latest

# Skopiuj zawartość app do folderu /app kontenera
COPY app /app

# Run a system update
# Install python3 and pip3
#RUN apt-get update && apt-get install -y \
#	python3 \
#	python3-pip \
#	vim \
#	nano
# Zainstaluj pakiety systemowe
RUN apt-get update && apt-get install -y \
    vim \
    nano \
 && rm -rf /var/lib/apt/lists/*

# Ustaw katalog roboczy (w nim jest plik requirements.txt)
WORKDIR /app
# Zaktualizuj pip i zainstaluj zależności Pythona (z pliku requirements.txt)
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Wystaw port Jupytera
EXPOSE 8888

# Automatycznie uruchom Jupyter Lab po starcie kontenera (w katalogu /home/patryk)
WORKDIR /home/patryk
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=", "--NotebookApp.password="]

#CMD ["/bin/bash", "-c", "jupyter lab --ip='0.0.0.0' --port=8888 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password=''"]
#CMD ["/bin/bash", "-c", "jupyter lab --ip='0.0.0.0' --port=8888 --no-browser --allow-root"]


# To build the image, use:
#docker build -t jupyter-webapp .
#
# To run the container, use:
#docker run -d -p 8888:8888 --name jupyter-webapp-1 jupyter-webapp
#
# uruchomienie w tle
#docker run -d --name jupyter-webapp-1 -p 8888:8888 \
#--mount src="./shared",target=/home/patryk,type=bind jupyter-webapp
#
# interaktywny shel w kontenerze
#docker run -ti --name jupyter-webapp-1 -p 8888:8888 \
#--mount src="./shared",target=/home/patryk,type=bind jupyter-webapp bash
#
