# Use it with to build the image:
# docker build -t python_jupiter_custom .
# after run
# docker run -ti --name python-jupyter -p 8888:8888 \
# --mount src="/Users/przepnie/OneDrive - Cisco/DevNet/docker/images/Python-Jupyter/shared",target=/home/patryk,type=bind python_jupiter_custom bash

FROM python:latest

COPY app /app
WORKDIR /app

# Run a system update
# Install python3 and pip3
RUN apt-get update && apt-get install -y \
	python3 \
	python3-pip \
	vim \
	nano

# Instal jupyter
#RUN pip3 install jupyterlab
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

EXPOSE 8888

WORKDIR /home/patryk

#CMD ["/bin/bash", "-c", "jupyter lab --ip='0.0.0.0' --port=8888 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password=''"]
#CMD ["/bin/bash", "-c", "jupyter lab --ip='0.0.0.0' --port=8888 --no-browser --allow-root"]
