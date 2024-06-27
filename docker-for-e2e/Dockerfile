ARG TAG=22.04
FROM ubuntu:${TAG}

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG NODE_VERSION=20

RUN echo 'debconf debconf/frontend select teletype' | debconf-set-selections
RUN apt-get update && apt-get upgrade -y && apt-get install -y sudo apt-utils curl wget git ca-certificates gnupg \
    && if [ -z "`getent group ${GROUP_ID}`" ]; then \
        addgroup --system --gid ${GROUP_ID} user; \
    else \
        groupmod -n user `getent group ${GROUP_ID} | cut -d: -f1`; \
    fi \
    && if [ -z "`getent passwd ${USER_ID}`" ]; then \
        adduser --system --uid ${USER_ID} --ingroup user --shell /bin/sh user; \
    else \
        usermod -l user -g ${GROUP_ID} -d /home/user -m `getent passwd ${USER_ID} | cut -d: -f1`; \
    fi

# Install NODE
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs

# Install YARN
RUN mkdir -p /etc/apt/keyrings \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /etc/apt/keyrings/yarnkey.gpg >/dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn

# Install test dependencies
RUN apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2  \
    libx11-xcb1 \
    libxcursor1 \
    libgtk-3-0 \ 
    libpangocairo-1.0-0 \
    libcairo-gobject2 \
    libgdk-pixbuf-2.0-0

RUN apt-get clean \
    && rm -rf \
    /var/lib/apt/lists/* \
    /var/log/alternatives.log \
    /var/log/apt/history.log \
    /var/log/apt/term.log \
    /var/log/dpkg.log \
    /etc/machine-id \
    /var/lib/dbus/machine-id

COPY docker-entrypoint.sh /usr/bin/
COPY CI_OUTPUT.sh /usr/src
RUN chmod +x /usr/bin/docker-entrypoint.sh /usr/src/CI_OUTPUT.sh

WORKDIR /home/user/workdir

USER user

ENTRYPOINT [ "docker-entrypoint.sh" ]
