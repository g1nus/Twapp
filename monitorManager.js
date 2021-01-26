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

async function startMonitor(id){
  try{
    let streamerInfo = {};

    console.log("Getting STREAMER");
    //get broadcaster name, language
    const [resp1, resp2, resp3] = await axios.all([
      axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`),
      axios.get(`https://api.twitch.tv/helix/users?id=${id}`),
      axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${id}`)
    ])

    streamerInfo.name = resp1.data.data[0].broadcaster_name;
    streamerInfo.language = resp1.data.data[0].broadcaster_language;
    streamerInfo.description = resp2.data.data[0].description;
    streamerInfo.proPic = resp2.data.data[0].profile_image_url;
    streamerInfo.views = resp2.data.data[0].view_count;
    streamerInfo.followers = resp3.data.total;

    console.log(`INFO\n`, streamerInfo);
    
    /*
    //if stream is active, get broadcaster stream: id, game, title, viewer count
    let resp4 = await axios.get("https://api.twitch.tv/helix/streams?user_id=536083731");
    console.log(resp4.data);
    */


  }catch(err){
    console.error(err);
  }
  
}

ipc.serve(
  function(){
    /*
    ipc.server.on(
      'search',
      function(query){
        console.log("got a search", query);
      }
    );
    */
    ipc.server.on(
      'monitor',
      function(id, flag){
        console.log("got a monitor request", id);
        if(flag){
          startMonitor(id);
        }
      }
    );
  }
);

ipc.server.start();