/*jslint node: true */
'use strict';

var TwitterAPI = require('node-twitter-api'),
    fs = require('fs'),
    config = require('./config.json');

var twitter = new TwitterAPI({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret
});

var accessToken = config.accessToken,
    accessTokenSecret = config.accessTokenSecret;

var uniqueFacts = {},
    consecutiveLackOfFacts = 0;

function finish() {
    fs.writeFile(
        'facts.json',
        JSON.stringify(Object.keys(uniqueFacts), null, 4),
        function (error) {
            if (error) {
                console.log('Saving failed! :(');
            }
        }
    );
}

function fetch(since_id) {
    console.log('Fetching facts.');
    twitter.getTimeline(
        'user_timeline',
        (function () {
            var params = {
                screen_name: 'CrockfordFacts',
                count: 200
            };
            if (since_id) {
                params.since_id = since_id;
            }
            return params;
        }()),
        accessToken,
        accessTokenSecret,
        function (error, data) {
            if (error) {
                console.log(error);
                console.log('Error. We are done.');
                return finish();
            }
            if (!data.length) {
                console.log('No more tweets. We are done.');
                return finish();
            }

            var follow, learned = 0;
            data.forEach(function (tweet) {
                if (!uniqueFacts.hasOwnProperty(tweet.text)) {
                    uniqueFacts[tweet.text] = null;
                    learned += 1;
                }
                follow = tweet.id_str;
            });

            console.log('Learned ' + learned + ' facts');
            if (!learned) {
                consecutiveLackOfFacts += 1;
            } else {
                consecutiveLackOfFacts = 0;
            }

            if (consecutiveLackOfFacts >= 3) {
                console.log('Three consecutive fetches, and no new facts. We are done.');
                return finish();
            }

            fetch(follow);
        }
    );
}

fetch();
