<h1><picture>
  <img alt="Mastodon" src="./lib/assets/VantaSocial_Banner.png?raw=true" width="100%">
</picture></h1>

## What is Vanta Interactive Social?
VantaInteractive/Social is a fork of [Mastodon Glitch Edition](https://github.com/glitch-soc/mastodon/), with some [upstream](https://github.com/mastodon/mastodon) PRs merged, some features from the archived [koyu.space](https://github.com/koyuspace/mastodon), and our own changes on top, in order for them to be used on the social.vantainteractive.com subdomain. Vanta Interactive Social is a server instance that doesn't accept new users, as it's meant to be exclusively used by Vanta Interactive members.

## Navigation

- [Mastodon project homepage](https://joinmastodon.org)
- [Mastodon Glitch Edition project homepage](https://glitch-soc.github.io/docs/)
- [Support the Mastodon development via Patreon](https://www.patreon.com/mastodon)
- [View Mastodon sponsors](https://joinmastodon.org/sponsors)
- [Mastodon Blog](https://blog.joinmastodon.org)
- [Mastodon Documentation](https://docs.joinmastodon.org)
- [Mastodon Roadmap](https://joinmastodon.org/roadmap)
- [Browse Mastodon servers](https://joinmastodon.org/communities)
- [Browse Mastodon apps](https://joinmastodon.org/apps)

## Features
As compared to 'vanilla' Mastodon, with this repo and the original repo's commit hashes:
#### From Mastodon upstream
- ADDED: [Change design of confirmation modals in web UI #30884](https://github.com/mastodon/mastodon/pull/30884)
- ADDED: [Replace more font-awesome icons in views/settings #30963](https://github.com/mastodon/mastodon/pull/30963)
- ADDED: [Replace more font-awesome icons in navigation sidebar area #30974](https://github.com/mastodon/mastodon/pull/30974)
- ADDED: [Add missing Appeals link under Moderation in navigiation #31071](https://github.com/mastodon/mastodon/pull/31071)
- ADDED (was merged to Glitch Edition while editing the README.md for the first time): Grouped Notifications UI

#### From Mastodon Glitch Edition
- REMOVED: Doodle

#### From kiyo.social
- ADDED: Jit.si integration

#### From TheEssem/Mastodon
- ADDED: [Emoji reactions](https://github.com/glitch-soc/mastodon/pull/2462) and [allowing dashes in emoji shortcodes](https://github.com/TheEssem/mastodon/commit/c5d084f11ab0f66aa039020d6fb8d2ad0c064d53#diff-f9a445238e0976bb929a67c223f33906304867e27d24e4de79c7421e8d48101dR30)
- ADDED: [Bubble timeline](https://github.com/TheEssem/mastodon/tree/feature/bubble-timeline)

#### VantaInteractive/Social additions
- ADDED: More sharp Material Symbols icons changes in the interface, for a more unified and coherent design that works well with Obsidian Design
- ADDED: Markdown guide
- ADDED: Design similar to the Obsidian Design system used in places such as the [AlexTECPlayz website](https://alextecplayz.github.io) or [carbon](https://github.com/VantaInteractive/carbon)

## Deployment

### Tech stack

- **Ruby on Rails** powers the REST API and other web pages
- **React.js** and **Redux** are used for the dynamic parts of the interface
- **Node.js** powers the streaming API

### Requirements

- **PostgreSQL** 12+
- **Redis** 4+
- **Ruby** 3.2+
- **Node.js** 18+

The [**standalone** installation guide](https://docs.joinmastodon.org/admin/install/) is available on the Mastodon documentation website, and below, for ease of access:

### Preparing your machine

If you are setting up a fresh machine, it is recommended that you secure it first. Assuming that you are running Ubuntu 22.04 or Debian 12, or newer:

#### Do not allow password-based SSH login (keys only)

First, make sure you are actually logging in to the server using keys and not via a password, otherwise, this will lock you out. Many hosting providers support uploading a public key and automatically set up key-based root login on new machines for you.

Edit `/etc/ssh/sshd_config` and find `PasswordAuthentication`. Make sure it’s uncommented and set to no. If you made any changes, restart sshd:

`systemctl restart ssh.service`

#### Update system packages

`apt update && apt upgrade -y`

Install fail2ban so it blocks repeated login attempts

First, install fail2ban:

`apt install fail2ban`

Edit `/etc/fail2ban/jail.local` and put this inside:

```
[DEFAULT]
destemail = your@email.here
sendername = Fail2Ban

[sshd]
enabled = true
port = 22
mode = aggressive
```

Finally, restart fail2ban:

`systemctl restart fail2ban`

Install a firewall and only allow SSH, HTTP and HTTPS ports

First, install iptables-persistent. During installation, it will ask you if you want to keep the current rules–decline.

`apt install -y iptables-persistent`

Edit `/etc/iptables/rules.v4` and put this inside:

```
*filter

#  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

#  Accept all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#  Allow all outbound traffic - you can modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

#  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
-A INPUT -p tcp --dport 80 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT
#  (optional) Allow HTTP/3 connections from anywhere.
-A INPUT -p udp --dport 443 -j ACCEPT

#  Allow SSH connections
#  The -dport number should be the same port number you set in sshd_config
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

#  Allow ping
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# Allow destination unreachable messages, especially code 4 (fragmentation required) is required or PMTUD breaks
-A INPUT -p icmp -m icmp --icmp-type 3 -j ACCEPT

#  Log iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

#  Reject all other inbound - default deny unless explicitly allowed policy
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
```

With iptables-persistent, that configuration will be loaded at boot time. But since we are not rebooting right now, we need to load it manually for the first time:

`iptables-restore < /etc/iptables/rules.v4`

If your server is also reachable over IPv6, edit `/etc/iptables/rules.v6` and add this inside:

```
*filter

#  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -d ::1/128 -j REJECT

#  Accept all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#  Allow all outbound traffic - you can modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

#  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
-A INPUT -p tcp --dport 80 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT
#  (optional) Allow HTTP/3 connections from anywhere.
-A INPUT -p udp --dport 443 -j ACCEPT

#  Allow SSH connections
#  The -dport number should be the same port number you set in sshd_config
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

#  Allow ping
-A INPUT -p icmpv6 -j ACCEPT

#  Log iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

#  Reject all other inbound - default deny unless explicitly allowed policy
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
```

Similar to the IPv4 rules, you can load it manually like this:

`ip6tables-restore < /etc/iptables/rules.v6`

### Installing from source

#### Pre-requisites
- A machine running **Ubuntu 22.04** or **Debian 12** that you have root access to
- A **domain name** (or a subdomain) for the Mastodon server, e.g. `example.com`
- An e-mail delivery service or other **SMTP server**

##### System repositories

Make sure `curl`, `wget`, `gnupg`, `apt-transport-https`, `lsb-release` and `ca-certificates` are installed first:

`apt install -y curl wget gnupg apt-transport-https lsb-release ca-certificates`

##### Node.js

```
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
```

Alternatively, you can install [nvm](https://github.com/nvm-sh/nvm) and install Node 20 LTS from there.

##### PostgreSQL

```
wget -O /usr/share/keyrings/postgresql.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
echo "deb [signed-by=/usr/share/keyrings/postgresql.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/postgresql.list
```

##### System packages

```
apt update
apt install -y \
  imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core \
  g++ libprotobuf-dev protobuf-compiler pkg-config gcc autoconf \
  bison build-essential libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev \
  nginx nodejs redis-server redis-tools postgresql postgresql-contrib \
  certbot python3-certbot-nginx libidn11-dev libicu-dev libjemalloc-dev
```

##### Yarn

```
corepack enable
yarn set version classic
```

#### Installing Ruby

We will use `rbenv` to manage Ruby versions as it simplifies obtaining the correct versions and updating them when new releases are available. Since rbenv needs to be installed for an individual Linux user, we must first create the user account under which Mastodon will run:

`adduser --disabled-login mastodon`

We can then switch to the user:

`su - mastodon`

And proceed to install rbenv and rbenv-build:

```
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec bash
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

Once this is done, we can install the correct Ruby version:

```
RUBY_CONFIGURE_OPTS=--with-jemalloc rbenv install 3.2.3
rbenv global 3.2.3
```

We’ll also need to install the bundler:

`gem install bundler --no-document`

Return to the root user:

`exit`

#### Setup
##### Setting up PostgreSQL
###### Performance configuration (optional)

For optimal performance, you may use [pgTune](https://pgtune.leopard.in.ua/#/) to generate an appropriate configuration and edit values in `/etc/postgresql/16/main/postgresql.conf` before restarting PostgreSQL with `systemctl restart postgresql`

Creating a user

You will need to create a PostgreSQL user that Mastodon could use. It is easiest to go with “ident” authentication in a simple setup, i.e. the PostgreSQL user does not have a separate password and can be used by the Linux user with the same username.

Open the prompt:

`sudo -u postgres psql`

In the prompt, execute:

```
CREATE USER mastodon CREATEDB;
\q
```

Done!
#### Setting up Mastodon

It is time to download the Mastodon code. Switch to the mastodon user:

`su - mastodon`

##### Checking out the code

Use `git` to download the latest stable release of Mastodon:

```
git clone https://github.com/VantaInteractive/Social.git live && cd live
git checkout $(git tag -l | grep '^v[0-9.]*$' | sort -V | tail -n 1)
```

##### Installing the last dependencies

Now to install Ruby and JavaScript dependencies:

```
bundle config deployment 'true'
bundle config without 'development test'
bundle install -j$(getconf _NPROCESSORS_ONLN)
yarn install --pure-lockfile
```

The two bundle config commands are only needed the first time you’re installing dependencies. If you’re going to be updating or re-installing dependencies later, just bundle install will be enough.

#### Generating a configuration

Run the interactive setup wizard:

`RAILS_ENV=production bundle exec rake mastodon:setup`

This will:
- Create a configuration file
- Run asset precompilation
- Create the database schema

The configuration file is saved as `.env.production`. You can review and edit it to your liking. Refer to the Mastodon [documentation on configuration](https://docs.joinmastodon.org/admin/config/).

You’re done with the mastodon user for now, so switch back to root:

`exit`

#### Acquiring an SSL certificate

We’ll use Let’s Encrypt to get a free SSL certificate:

`certbot certonly --nginx -d example.com`

This will obtain the certificate, and save it in the directory `/etc/letsencrypt/live/example.com/`.

#### Setting up nginx

Copy the configuration template for nginx from the Mastodon directory:

```
cp /home/mastodon/live/dist/nginx.conf /etc/nginx/sites-available/mastodon
ln -s /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon
rm /etc/nginx/sites-enabled/default
```

Then edit `/etc/nginx/sites-available/mastodon` to

1. Replace `example.com` with your own domain name
2. Uncomment the ssl_certificate and ssl_certificate_key lines and replace the two lines with (ignore this step if you are bringing your own certificate)

```
ssl_certificate     /etc/ssl/certs/ssl-cert-snakeoil.pem;
ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
```

3. Make any other adjustments you might need.

Un-comment the lines starting with `ssl_certificate` and `ssl_certificate_key`, updating the path with the correct domain name.

Reload nginx for the changes to take effect:

`systemctl reload nginx`

At this point, you should be able to visit your domain in the browser and see the elephant hitting the computer screen error page. This is because we haven’t started the Mastodon process yet.

#### Setting up systemd services

Copy the systemd service templates from the Mastodon directory:

`cp /home/mastodon/live/dist/mastodon-*.service /etc/systemd/system/`

If you deviated from the defaults at any point, check that the username and paths are correct:

`$EDITOR /etc/systemd/system/mastodon-*.service`

Finally, start and enable the new systemd services:

```
systemctl daemon-reload
systemctl enable --now mastodon-web mastodon-sidekiq mastodon-streaming
```

They will now automatically start at boot.

> [!NOTE]
> Note that you can also start the server manually by running from anywhere, the following commands, but is **not generally recommended** unless you know what you're doing:

###### mastodon-sidekiq
`RAILS_ENV=production DB_POOL=25 MALLOC_ARENA_MAX=2 LD_PRELOAD=libjemalloc.so /home/{user}/.rbenv/shims/bundle exec sidekiq -c 25`

###### mastodon-streaming
`NODE_ENV=production PORT=%i /usr/bin/node /home/{user}/live/streaming`

###### mastodon-web
`RAILS_ENV=production PORT=3000 LD_PRELOAD=libjemalloc.so /home/mastodon/.rbenv/shims/bundle exec puma -C config/puma.rb`

### Additional pages
Here are some additional pages from the Mastodon Docs for quick reference:
- [Configuring your environment](https://docs.joinmastodon.org/admin/config/)
- [Configuring full-text search](https://docs.joinmastodon.org/admin/elasticsearch/)
- [Installing optional features](https://docs.joinmastodon.org/admin/optional/)
- [Setting up your new instance](https://docs.joinmastodon.org/admin/setup/)
- [Using the admin CLI](https://docs.joinmastodon.org/admin/tootctl/)
- [Upgrading to a new release](https://docs.joinmastodon.org/admin/upgrading/)
- [Backing up your server](https://docs.joinmastodon.org/admin/backups/)
- [Migrating to a new machine](https://docs.joinmastodon.org/admin/migrating/)
- [Scaling up your server](https://docs.joinmastodon.org/admin/scaling/)
- [Moderation actions](https://docs.joinmastodon.org/admin/moderation/)
- [Troubleshooting errors](https://docs.joinmastodon.org/admin/troubleshooting/)
- [Roles](https://docs.joinmastodon.org/admin/roles/)

## Contributing

Mastodon is **free, open-source software** licensed under **AGPLv3**.

You can open issues for bugs you've found or features you think are missing. You
can also submit pull requests to this repository or translations via Crowdin. To
get started, look at the [CONTRIBUTING] and [DEVELOPMENT] guides. For changes
accepted into Mastodon, you can request to be paid through our [OpenCollective].

**IRC channel**: #mastodon on [`irc.libera.chat`](https://libera.chat)

## License

Copyright (c) 2016-2024 Eugen Rochko (+ [`mastodon authors`](AUTHORS.md))

Licensed under GNU Affero General Public License as stated in the [LICENSE](LICENSE):

```
Copyright (c) 2016-2024 Eugen Rochko & other Mastodon contributors

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see https://www.gnu.org/licenses/
```

[CONTRIBUTING]: CONTRIBUTING.md
[DEVELOPMENT]: docs/DEVELOPMENT.md
[OpenCollective]: https://opencollective.com/mastodon
