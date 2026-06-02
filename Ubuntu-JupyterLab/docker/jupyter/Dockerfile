# Jupyterlab on Ubuntu

# Ubuntu image
FROM ubuntu:latest

## COPY app /app
## WORKDIR /app

# Run a system update
# Install python3, pip3, vim & nano
RUN apt-get update && apt-get install -y \
	python3 \
	python3-pip \
	vim \
	nano

# Instal jupyter
## RUN pip3 install --upgrade pip3
## RUN pip3 install -r requirements.txt
RUN pip3 install jupyterlab

RUN mkdir /home/patryk
#COPY ./shared /home/patryk

WORKDIR /home/patryk
EXPOSE 8888

#CMD ["/bin/bash", "-c", "jupyter lab --ip='0.0.0.0' --port=8888 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password=''"]
