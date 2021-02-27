# Twapp

This is a simple express application that interacts with the [Twitch API](https://dev.twitch.tv/docs/api/) in order to fetch basic data about live videos and streamers. It can also ask for eventsub [web-hooks](https://dev.twitch.tv/docs/api/webhooks-guide) in order to get Twitch notifications when a streamers goes online (starts streaming) or offline (stops streaming).\
When Twapp asks to receive the notifications of a streamer, then this particular streamer will be consisdered *monitored*. In fact, this application works in strict relation with a [monitoring app](https://github.com/g1nus/Twonitor) which will start/stop monitoring a stream activity when the streamer goes online/offline.

## Features

Here are the main features of Twapp (when working together with [Twonitor](https://github.com/g1nus/Twonitor)):

* Search for a streamer
* Get basic details about a streamer (number of followers, description, profile picture, etc.)
* Start monitoring a new streamer
* Get details about the monitored streams of a streamer
* Get the events of a monitored stream (raids, subscriptions, most used chat words)
* List all of Twitch active web-hook subscriptions
* You can also fetch Twitch emotes

## Installation and setup

First of all clone the repo and then run:```npm install```

And then you must set up the ENV variables (you can take a look at an example [here](https://github.com/g1nus/Twapp/blob/main/.env.example)).\
A running MongoDB instance is also necessary in order to retrieve the data of the monitored streamers, which are being saved inside the database by the Twonitor app. It is necessary for the Twonitor app to have its own *WEBHOOK_SECRET* (this is available from your Twitch Dev [console](https://dev.twitch.tv/console)) and to listen for notifications at the *WEBHOOK_CALLBACK* URL.\
In fact, Twapp will ask Twitch to send the notifications at the *WEBHOOK_CALLBACK* URL.

## API Documentation

You can find the full API documentation [here](https://alphamangolytica.docs.apiary.io).
