Read me
=======

crockfordfacts.org is a website containing many facts about [Douglas Crockford](http://crockford.com). I made this because I was sad about the demise of crockfordfacts*.com*, and luckily I could recover many of its facts from the tweets of the [@CrockfordFacts](http://twitter.com/CrockfordFacts) bot someone had made for that site.

Written in JavaScript using node.js. ![JSLint](http://www.jslint.com/jslintpill.gif) compliant, of course: [jslint.com](http://www.JSLint.com/)

The website proper is in `src`. There's a tool for collecting facts from that old Twitter bot in `collector`.

Website setup works like so:

1. `npm install` (installs dependencies)
2. `cp config.example.json config.json && vim config.json` (set the port)
3. One of:
   * `curl http://crockfordfacts.org/.json > facts.json`
   * `cp facts.example.json facts.json && vim facts.json`
   * `cp ../collector/facts.json facts.json`
4. `node site.js` (runs the site)

You may want to reverse-proxy it. See the example nginx config file in `config/nginx/crockfordfacts.org`.

