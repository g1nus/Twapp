require('module-alias/register');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const su = require('@utils/startup');
const {passCheck} = require('@utils/keyCheck');
const {streamerInfo} = require('@controllers/streamer');
const {monitor} = require('@controllers/monitor');
const {search} = require('@controllers/search');
const {subList, delSubList} = require('@controllers/dev');

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

    router.get('/streamer', async (req, res, next) => {
      try{
        let resp = await streamerInfo(req.query.id);
        res.json(resp.data)
      }catch (err){
        return next(err);
      }
    })

    router.get('/monitor', async (req, res, next) => {
      try{
        await monitor(req.query.id, req.query.start || true);

        res.json({data: "ok"});
      }catch (err){
        return next(err);
      }
    });

    router.get('/dev/subscriptions', async (req, res, next) => {
      try{
        let resp = await subList();
        res.json(resp.data);
      }catch (err){
        return next(err);
      }
    })
    
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
      res.status(err.name).json({text: err.message});
    });

    app.listen(config.port, () => {
      console.log(`Example app listening at http://localhost:${config.port}`)
    })
  }
)