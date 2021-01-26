require('dotenv').config();
const axios = require("axios");
var ipc=require('node-ipc');

ipc.config.id   = 'channel';
ipc.config.retry= 2;
ipc.config.maxRetries = 0;
ipc.config.silent = true;

let config = {
  streamerId: process.argv[2],
  clientId: process.env.CLIENT_ID,
  authorization: {
    access_token: process.env.ACCESS_TOKEN,
    token_type: "bearer"
  }
}

//axios token setup
axios.defaults.headers.common['client-id'] = config.clientId;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.authorization.access_token;

async function monitor(){
  try{
    console.log("ONLINE STREAMER");
    //get broadcaster name, language
    let resp1 = await axios.get("https://api.twitch.tv/helix/channels?broadcaster_id=536083731");
    console.log(resp1.data);

    //get broadcaster description, image, total view count
    let resp2 = await axios.get("https://api.twitch.tv/helix/users?id=536083731");
    console.log(resp2.data);
    
    //get total number of followers
    let resp3 = await axios.get("https://api.twitch.tv/helix/users/follows?to_id=536083731");
    console.log(resp3.data);

    //if stream is active, get broadcaster stream: id, game, title, viewer count
    let resp4 = await axios.get("https://api.twitch.tv/helix/streams?user_id=536083731");
    console.log(resp4.data);

    console.log("OFFLINE STREAMER");

    resp1 = await axios.get("https://api.twitch.tv/helix/channels?broadcaster_id=159498717");
    console.log(resp1.data);

    resp2 = await axios.get("https://api.twitch.tv/helix/users?id=159498717");
    console.log(resp2.data);

    resp3 = await axios.get("https://api.twitch.tv/helix/users/follows?to_id=159498717");
    console.log(resp3.data);

    resp4 = await axios.get("https://api.twitch.tv/helix/streams?user_id=159498717");
    console.log(resp4.data);
    
    resp4 = await axios.get("https://api.twitch.tv/helix/streams?user_id=453951609");
    console.log(resp4.data);

  }catch(err){
    console.error(err);
  }

  
}

ipc.serve(
  function(){
    ipc.server.on(
      'search',
      function(query){
        console.log("got a search", query);
      }
    );
    ipc.server.on(
      'monitor',
      function(id){
        console.log("got a monitor request", id);
      }
    );
  }
);

ipc.server.start();