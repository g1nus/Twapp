const axios = require('axios');

const streamerInfo = async function (id) {

  if(!id){
    let err = new Error(`the id is not defined`);
    err.name = 404;
    throw err; 
  }

  try{
    let streamerInfo = {};

    const [resp1, resp2, resp3, resp4] = await axios.all([
      axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`),
      axios.get(`https://api.twitch.tv/helix/users?id=${id}`),
      axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${id}`),
      axios.get(`https://api.twitch.tv/helix/streams?user_id=${id}`)
    ])

    streamerInfo.name = resp1.data.data[0].broadcaster_name;
    streamerInfo.language = resp1.data.data[0].broadcaster_language;
    streamerInfo.description = resp2.data.data[0].description;
    streamerInfo.proPic = resp2.data.data[0].profile_image_url;
    streamerInfo.views = resp2.data.data[0].view_count;
    streamerInfo.followers = resp3.data.total;
    if(resp4.data.data[0]){
      streamerInfo.stream = {};
      streamerInfo.stream.gameName = resp4.data.data[0].game_name;
      streamerInfo.stream.gameId = resp4.data.data[0].game_id;
      streamerInfo.stream.title = resp4.data.data[0].title;
      streamerInfo.stream.viewers = resp4.data.data[0].viewer_count;
      streamerInfo.stream.startedAt = resp4.data.data[0].started_at;
    }else{
      streamerInfo.stream = false;
    }

    return {data: streamerInfo};
  }catch (err){
    err.name = 400;
    throw err;
  }
}

const search = async function (keyword) {

  if(!keyword){
    let err = new Error(`the keyword is not defined`);
    err.name = 404;
    throw err; 
  }

  try{
    let resp = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${keyword}`);

    //for each streamer I get additional data: (description and followers)
    resp.data.data = await Promise.all(resp.data.data.map(async (streamer) =>{
      try{
        const [resp2, resp3] = await axios.all([
          axios.get(`https://api.twitch.tv/helix/users?id=${streamer.id}`),
          axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${streamer.id}`)
        ]);

        //fields fix cleanup
        streamer.streamerId = streamer.id;
        streamer.loginName = streamer.broadcaster_login;
        streamer.displayName = streamer.display_name;
        streamer.profilePicture = streamer.thumbnail_url;
        streamer.description = resp2.data.data[0].description;
        streamer.followers = resp3.data.total;
        streamer.broadcasterLanguage = streamer.broadcaster_language;

        streamer.isLive = streamer.is_live;
        if(streamer.is_live){
          streamer.stream = {
            gameId: streamer.game_id,
            title: streamer.title,
            startedAt: streamer.started_at
          }
        }

        //delete old default fields
        streamer.broadcaster_language = undefined;
        streamer.id = undefined;
        streamer.broadcaster_login = undefined;
        streamer.display_name = undefined;
        streamer.thumbnail_url = undefined;
        streamer.is_live = undefined;
        streamer.game_id = undefined;
        streamer.title = undefined;
        streamer.started_at = undefined;
        streamer.tag_ids = undefined;

      }catch (err){
        console.log(err);
      }
      return streamer;
    }))

    //I sort the streamers by number of followers
    resp.data.data.sort((s1, s2) => s2.followers - s1.followers);
    return {results: resp.data.data};
    
  }catch (err){
    err.name = 400;
    throw err;
  }
}

exports.search = search;
exports.streamerInfo = streamerInfo;