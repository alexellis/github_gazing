Github Gazing
=====================

Get your star and fork notifications as they happen.

**Why?**

Github does not send notifications for repositories being starred or forked unless you add separate webhooks for every one you own. This project aims to poll the Github API on a regular basis. The intermediate results will be stored and then used for notifications such as emails, Telegram or HTTP(s) webhooks.

**How it works:**

HTTPS connections are made to the Github API to query event such as repositories being starred or forked.

* Get your access token from [Github tokens](https://github.com/settings/tokens)
* Add your token to *key.json*
* Set your username in *config.json*
* Install redis or run redis-server. Alter *config.json* if the instance is not on localhost.
* Type in `node app.js`

For email notifications enable send_grid in *config.json* and enter your SendGrid key.

**Can I run this on my Raspberry Pi?**

Absolutely. When you build the image use the `Dockerfile.arm` file. 

```
docker build -t notifier . -f Dockerfile.arm
```

**TODO:**

Right now data is stored in redis and printed on the terminal.
```
[x] Compare results since last run
    - done
[x] Notifier: Email notifications through Azure e-mail
    - completed through use of SendGrid
[ ] HTML formatted emails
[*] Notifier: Post to HTTP endpoint
[ ] Notifier: Telegram
[ ] Cron template.
```

**Installation and requirements**

* Node.js 4.x
* `npm install`

**Example run**

```
$ node app.js

2 days ago	KarlNewark starred alexellis/async-example
2 days ago	DrewDrinkwater starred alexellis/async-example
2 days ago	nikolay starred alexellis/async-example
2 days ago	cchitsiang starred alexellis/async-example
2 days ago	patgmac starred alexellis/HandsOnDocker
2 days ago	onurozkan starred alexellis/async-example
2 days ago	aroc starred alexellis/async-example
2 days ago	matheusportela starred alexellis/async-example
2 days ago	Beyondem starred alexellis/async-example
2 days ago	mjhea0 starred alexellis/async-example
2 days ago	iwaldman starred alexellis/docker-arm
2 days ago	jamiewilson starred alexellis/async-example
a day ago	5um1th starred alexellis/async-example
a day ago	michael-wolfenden starred alexellis/HandsOnDocker
a day ago	resnizkyf starred alexellis/HandsOnDocker
a day ago	klihelp starred alexellis/async-example
a day ago	mjhea0 starred alexellis/express-middleware-sinon
21 hours ago	montanaflynn starred alexellis/async-example
21 hours ago	montanaflynn starred alexellis/async-example
21 hours ago	montanaflynn starred alexellis/async-example
21 hours ago	montanaflynn starred alexellis/async-example
12 hours ago	orakle starred alexellis/async-example
12 hours ago	orakle starred alexellis/HandsOnDocker
7 hours ago	oktapodi starred alexellis/async-example
2 hours ago	jonovate starred alexellis/docker-arm
an hour ago	jbaker10 starred alexellis/HandsOnDocker

a day ago	chrisneave fork'd alexellis/xservedbyfinder
```

**Contributing**

Help is welcome, but my time is limited so if you have a suggestion, enhancement or bug fix then please raise an issue to begin a conversation.

Once an issue is open we can can talk about the proposed change in the open. Once we've figured out what needs to be done then you can go ahead and raise a PR and it's very likely to get merged.
