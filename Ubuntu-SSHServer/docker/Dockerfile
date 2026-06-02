# Oficjalny obraz Ubuntu
FROM ubuntu:latest

# "unminimize"
# Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.10.14-linuxkit aarch64)
#
#  * Documentation:  https://help.ubuntu.com
#  * Management:     https://landscape.canonical.com
#  * Support:        https://ubuntu.com/pro
#
# This system has been minimized by removing packages and content that are
# not required on a system that users do not log into.
#
# To restore this content, you can run the 'unminimize' command.

# Aktualizacja pakietow i instalacja openssh-server
# RUN apt-get update && apt-get install -y openssh-server
# Aktualizacja pakietow i instalacja openssh-server oraz sudo
RUN apt-get update && apt-get install -y openssh-server sudo

# Utworz katalog, ktory jest wymagany przez serwer SSH
RUN mkdir /var/run/sshd

# Ustaw haslo dla uzytkownika root (ZMIEN TO HASLO NA SILNIEJSZE W PRODUKCJI!)
# Mozesz tez utworzyc nowego uzytkownika zamiast uzywac root'a
# RUN echo 'root:twoje_super_tajne_haslo' | chpasswd
# RUN echo 'root:L1ons@svs' | chpasswd

# --- Sekcja dodawania nowego uzytkownika ---
#ARG USERNAME=patryk
#ARG PASSWORD=p@ssw0rd
# Dodaj nowego uzytkownika
#RUN useradd -m -s /bin/bash ${USERNAME}
#
# Ustaw haslo dla nowego uzytkownika
#RUN echo "${USERNAME}:${PASSWORD}" | chpasswd
#
# Dodaj nowego uzytkownika do grupy sudo, aby mial uprawnienia root'a
#RUN usermod -aG sudo ${USERNAME}

# Opcjonalnie: Skonfiguruj sudo, aby nie pytal o haslo dla uzytkownikow z grupy sudo
# (NIEZALECANE W PRODUKCJI, ale wygodne do testow)
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
# --- Koniec sekcji dodawania nowego uytkownika ---

# Zezwol na logowanie roota przez SSH (czesto niezalecane w produkcji ze wzgldow bezpieczenstwa)
#RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Wlacz autentykacje haslem (jesli chcesz uzywac kluczy SSH, mozesz to pominac lub skonfigurowac inaczej)
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Usun wpis pam_loginuid.so, ktory moze powodowac problemy z logowaniem SSH w Dockerze
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# Otwrz port SSH
EXPOSE 22

# Uruchom serwer SSH w tle
CMD ["/usr/sbin/sshd", "-D"]
