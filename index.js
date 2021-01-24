const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const su = require('./utils/startup');
const {passCheck} = require('./utils/keyCheck');
const {search} = require('./modules/controllers/search');


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

//first, of all I run the startup
su.initialLogin().then(

  function (config) {

    //axios token setup
    axios.defaults.headers.common['client-id'] = config.clientId;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.authorization.access_token;

    //middleware for checking permissions of all requests
    router.use((req, res, next) => {
      console.log(req.url);

      if(passCheck(req, config.adapterSecret)){
        next();
      }else{
        res.json({error: `you're not authorized`});
      }
    });

    router.get('/search', async (req, res, next) => {
      try{
        let resp = await search(req.query.query);
        res.json(resp.data)
      }catch (err){
        return next(err);
      }
    })
    
    app.use('/', router)

    //last middleware for sending error
    app.use((err, req, res, next) => {
      //console.error('[Error]', err);
      res.status(err.name).json({text: err.message});
    });

    app.listen(config.port, () => {
      console.log(`Example app listening at http://localhost:${config.port}`)
    })
  }
)