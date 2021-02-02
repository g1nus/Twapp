require('module-alias/register');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const security = require('@utils/security');
const {startMonitor} = require('@controllers/monitor');
const {search, streamerInfo} = require('@controllers/twapi');
const {subList, delSubList} = require('@controllers/dev');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

//first, of all I run the startup
security.initialLogin().then(

  function (config) {

    //axios token setup
    axios.defaults.headers.common['client-id'] = config.clientId;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.authorization.access_token;

    //middleware for checking permissions of all requests
    router.use((req, res, next) => {
      console.log(req.url);

      res.header("Access-Control-Allow-Origin", req.headers.origin);
      //enable the cookie sending
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Cache-Control, Content-Type, Authorization');

      if (req.method === "OPTIONS") {
          res.sendStatus(200);
      }
      else {
        if(security.passCheck(req, config.adapterSecret)){
          next();
        }else{
          res.status(403).json({error: `you're not authorized`});
        }
      }
    });

    //search for a streamer
    router.get('/search', async (req, res, next) => {
      try{
        let resp = await search(req.query.query);
        res.json(resp.data);

      }catch (err){
        return next(err);
      }
    })

    //get info about a streamer
    router.get('/streamer', async (req, res, next) => {
      try{
        let resp = await streamerInfo(req.query.id);
        res.json(resp.data);

      }catch (err){
        return next(err);
      }
    })

    //start monitor
    router.get('/monitor', async (req, res, next) => {
      try{
        let resp = await startMonitor(req.query.id, config.webhookCallback, config.webhookSecret);
        res.json(resp.data);

      }catch (err){
        err.name = 400;
        return next(err);
      }
    });

    //get list of Twitch web-hooks
    router.get('/dev/subscriptions', async (req, res, next) => {
      try{
        let resp = await subList();
        res.json(resp.data);

      }catch (err){
        return next(err);
      }
    })
    
    //delete (all) Twitch web-hooks
    router.delete('/dev/subscriptions', async (req, res, next) => {
      try{
        let resp = await delSubList(req.query.id);
        res.json(resp.data);

      }catch (err){
        return next(err);
      }
    })

    app.use('/', router)

    //last middleware for sending error
    app.use((err, req, res, next) => {
      //console.error('[Error]', err);
      if(err.response?.data?.message){
        res.status(err.name).json({error: err.response.data.message});
      }else{
        res.status(err.name).json({error: err.message});
      }
    });

    app.listen(config.port, () => {
      console.log(`Example app listening at http://localhost:${config.port}`)
    })
  }
)