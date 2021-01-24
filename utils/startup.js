require('dotenv').config();
const axios = require("axios");

var initialLogin = async function () {
  try{
    if(process.env.ACCESS_TOKEN){

      console.log("ACCESS TOKEN is present");

      return {
        port: process.env.PORT,
        clientId: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        adapterSecret: process.env.ADAPTER_SECRET,
        authorization: {
          access_token: process.env.ACCESS_TOKEN,
          token_type: "bearer"
        }
      };
    }

    console.log("NO ACCESS TOKEN, requiring new one");

    const resp = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.SECRET}&grant_type=client_credentials`);

    return {
      port: process.env.PORT,
      clientId: process.env.CLIENT_ID,
      secret: process.env.SECRET,
      adapterSecret: process.env.ADAPTER_SECRET,
      authorization: resp.data
    };

  }catch (err){
    console.error(err);

    return {
      port: process.env.PORT,
      clientId: process.env.CLIENT_ID,
      secret: process.env.SECRET,
      adapterSecret: process.env.ADAPTER_SECRET,
      authorization: "invalid_token"
    };
  }
}

exports.initialLogin = initialLogin;
