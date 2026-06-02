# Pobierz najnowszy obraz Ubuntu
FROM ubuntu:latest

# Wyłącz interaktywne pytania podczas instalacji
ENV DEBIAN_FRONTEND=noninteractive

# Aktualizacja systemu i instalacja narzędzi + SSH
RUN apt-get update && apt-get install -y \
    vim \
    nano \
    curl \
    man-db \
    sudo \
    net-tools \
    openssh-server \
 && rm -rf /var/lib/apt/lists/*

# Przywróć pełne środowisko Ubuntu
RUN yes | unminimize

# Utwórz użytkownika 'patryk' z hasłem i nadaj mu pełne uprawnienia administracyjne
RUN useradd -m -s /bin/bash patryk && \
    echo "patryk:patryk" | chpasswd && \
    usermod -aG sudo patryk && \
    echo "patryk ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Skonfiguruj SSH i SFTP
RUN mkdir /var/run/sshd && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# (Opcjonalnie) — utwórz katalog dla SFTP (jeśli chcesz mieć też transfer plików)
RUN mkdir -p /home/patryk/sftp && chown patryk:patryk /home/patryk/sftp

# Otwórz port 22 (SSH/SFTP)
EXPOSE 22

# Ustaw katalog roboczy
WORKDIR /home/patryk

# Uruchom SSH po starcie kontenera
CMD ["/usr/sbin/sshd", "-D"]