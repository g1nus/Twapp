const axios = require('axios');

function Emote(url, code) {
  this[code] = url;
}


const parseEmotes = async function (streamerId, words) {
  console.log(`[EM] streamer ID: ${streamerId} \n[EM]words are: ${words} | ${words.length}`);
  console.log(`[EM] fetching cached emotes`);

  let parsedEmotes = [];

  if(!streamerId || words.length === 0){
    let err = new Error(`the fields are not properly defined`);
    err.name = 404;
    throw err; 
  }

  try{
    const [respBttv, respFfz, respTem, respDefault] = await axios.all([
      axios.get(`https://api.betterttv.net/3/cached/users/twitch/${streamerId}`).catch(err => ({data: null})),
      axios.get(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${streamerId}`).catch(err => ({data: null})),
      axios.get(`https://api.twitchemotes.com/api/v4/channels/${streamerId}`).catch(err => ({data: null})),
      axios.get(`https://api.twitchemotes.com/api/v4/channels/0`).catch(err => ({data: null}))
    ])

    console.log(`[EM] fetched the emotes`, respBttv);
    if(respBttv.data){
      const foundBttv = respBttv.data.sharedEmotes.filter((emote) => words.includes(emote.code)).map((emote) => new Emote(`https://cdn.betterttv.net/emote/${emote.id}/3x`, emote.code));
      parsedEmotes.push(...foundBttv);
      const foundBttv2 = respBttv.data.channelEmotes.filter((emote) => words.includes(emote.code)).map((emote) => new Emote(`https://cdn.betterttv.net/emote/${emote.id}/3x`, emote.code));
      parsedEmotes.push(...foundBttv2);
    }
    if(respFfz.data){
      const foundFfz = respFfz.data.filter((emote) => words.includes(emote.code)).map((emote) => new Emote(emote.images['4x'], emote.code));
      parsedEmotes.push(...foundFfz);
    }
    if(respTem.data){
      const foundTem = respTem.data.emotes.filter((emote) => words.includes(emote.code)).map((emote) => new Emote(`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0`, emote.code));
      parsedEmotes.push(...foundTem);
    }
    if(respDefault.data){
      const foundDefault = respDefault.data.emotes.filter((emote) => words.includes(emote.code)).map((emote) => new Emote(`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0`, emote.code));
      parsedEmotes.push(...foundDefault);
    }

    console.log({data: {parsedEmotes}});
    return {data: {parsedEmotes}};

  }catch (err){
    console.log(err);
    err.name = 400;
    throw err;
  }
  
}

//parseEmotes(59308271, ["Shrug", "BladeZoom", "WideHard", "tfbHmm", "Kappa", "__900"]);

exports.parseEmotes = parseEmotes;