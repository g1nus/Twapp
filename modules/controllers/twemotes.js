const axios = require('axios');

const parseEmotes = async function (streamerId, words) {
  console.log(`[EM] streamer ID: ${streamerId} \n[EM]words are: ${words}`);
  console.log(`[EM] fetching cached emotes`);

  let parsedEmotes = [];

  if(!streamerId || words.length === 0){
    let err = new Error(`the fields are not properly defined`);
    err.name = 404;
    throw err; 
  }

  try{
    const [respBttv, respFfz, respTem, respDefault] = await axios.all([
      axios.get(`https://api.betterttv.net/3/cached/users/twitch/${streamerId}`),
      axios.get(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${streamerId}`),
      axios.get(`https://api.twitchemotes.com/api/v4/channels/${streamerId}`),
      axios.get(`https://api.twitchemotes.com/api/v4/channels/0`)
    ])


    const foundBttv = respBttv.data.sharedEmotes.filter((emote) => words.includes(emote.code)).map((emote) => ({url: `https://cdn.betterttv.net/emote/${emote.id}/3x`, code: emote.code}));
    parsedEmotes.push(...foundBttv);

    const foundBttv2 = respBttv.data.channelEmotes.filter((emote) => words.includes(emote.code)).map((emote) => ({url: `https://cdn.betterttv.net/emote/${emote.id}/3x`, code: emote.code}));
    parsedEmotes.push(...foundBttv2);

    const foundFfz = respFfz.data.filter((emote) => words.includes(emote.code)).map((emote) => ({url:emote.images['4x'], code: emote.code}));
    parsedEmotes.push(...foundFfz);

    const foundTem = respTem.data.emotes.filter((emote) => words.includes(emote.code)).map((emote) => ({url:`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0`, code: emote.code}));
    parsedEmotes.push(...foundTem);

    const foundDefault = respDefault.data.emotes.filter((emote) => words.includes(emote.code)).map((emote) => ({url:`http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0`, code: emote.code}));
    parsedEmotes.push(...foundDefault);

    console.log({data: {parsedEmotes}});
    return {data: {parsedEmotes}};

  }catch (err){
    err.name = 400;
    throw err;
  }
  
}

//parseEmotes(59308271, ["Shrug", "BladeZoom", "WideHard", "tfbHmm", "Kappa", "__900"]);

exports.parseEmotes = parseEmotes;