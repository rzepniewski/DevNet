FROM ubuntu:24.04

ARG USERNAME=przepnie
ARG USER_PASS
ARG LOGIN_MODE=key

ENV DEBIAN_FRONTEND=noninteractive

# Install tools + SSH
RUN apt-get update && apt-get install -y \
    vim nano curl wget sudo net-tools iproute2 iputils-ping \
    traceroute dnsutils tcpdump nmap mtr-tiny iperf3 telnet \
    mc git openssh-server \
 && rm -rf /var/lib/apt/lists/*

# Create user with sudo
RUN useradd -m -s /bin/bash ${USERNAME} && \
    usermod -aG sudo ${USERNAME} && \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
# Set password if provided, otherwise lock the account
RUN if [ -n "${USER_PASS}" ]; then \
      echo "${USERNAME}:${USER_PASS}" | chpasswd; \
    else \
      passwd -d ${USERNAME}; \
    fi

# Configure SSH
RUN mkdir -p /var/run/sshd && \
    ssh-keygen -A && \
    sed -i 's/.*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && \
    # PAM fix for Docker
    sed -i 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' /etc/pam.d/sshd
# Configure auth mode
RUN if [ "${LOGIN_MODE}" = "password" ]; then \
      sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config; \
    else \
      sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config; \
    fi
# Copy SSH public key (only used when LOGIN_MODE=key)
RUN mkdir -p /home/${USERNAME}/.ssh && chmod 700 /home/${USERNAME}/.ssh
COPY shared/ /tmp/shared/
RUN if [ "${LOGIN_MODE}" = "key" ]; then \
      cp /tmp/shared/id_ed25519.pub /home/${USERNAME}/.ssh/authorized_keys && \
      chmod 600 /home/${USERNAME}/.ssh/authorized_keys; \
    fi && \
    chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.ssh && \
    rm -rf /tmp/shared

# SFTP directory
RUN mkdir -p /home/${USERNAME}/sftp && chown ${USERNAME}:${USERNAME} /home/${USERNAME}/sftp
EXPOSE 22
WORKDIR /home/${USERNAME}

HEALTHCHECK --interval=30s --timeout=5s \
    CMD ss -tlnp | grep -q ':22' || exit 1
CMD ["/usr/sbin/sshd", "-D"]
