require('module-alias/register');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const security = require('@utils/security');
const {startMonitor} = require('@controllers/monitor');
const {search} = require('@controllers/twapi');
const {subList, delSubList} = require('@controllers/dev');
const {parseEmotes} = require('@controllers/twemotes');
const streamerDbController = require('@controllers/streamer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public/thumbnails'));

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
        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //get list of monitored streamers or search one
    router.get('/streamers', async (req, res, next) => {
      try{
        let resp = await streamerDbController.getMonitoredStreamers(req.query.query);
        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //get list details of a particular streamer
    router.get('/streamers/:id', async (req, res, next) => {
      try{
        let resp = await streamerDbController.getStreamer(req.params.id);

        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //get list of streams of a monitored streamer
    router.get('/streamers/:id/streams', async (req, res, next) => {
      try{
        let resp = await streamerDbController.getStreamsOfStreamer(req.params.id);

        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //get list of streams of a monitored streamer
    router.get('/streamers/:streamer_id/streams/:stream_id', async (req, res, next) => {
      try{
        let resp = await streamerDbController.getStreamOfStreamerById(req.params.streamer_id, req.params.stream_id);

        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //get events of a stream
    router.get('/streamers/:streamer_id/streams/:stream_id/events', async (req, res, next) => {
      try{
        let resp = await streamerDbController.getEventsOfStream(req.params.streamer_id, req.params.stream_id);

        res.json(resp);

      }catch (err){
        return next(err);
      }
    })

    //start monitor
    router.post('/streamers', async (req, res, next) => {
      try{
        let resp = await startMonitor(req.body.streamerId, config.webhookCallback, config.webhookSecret);
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
        err.name = 400;
        return next(err);
      }
    })
    
    //delete (all) Twitch web-hooks
    router.delete('/dev/subscriptions', async (req, res, next) => {
      try{
        let resp = await delSubList(req.query.id);
        res.json(resp.data);

      }catch (err){
        err.name = 400;
        return next(err);
      }
    })

    router.get('/emotes', async (req, res, next) => {
      try{
        console.log(req.query);
        let resp = await parseEmotes(req.query.id, req.query.emotes.split(','));
        res.json(resp.data);

      }catch (err){
        err.name = 400;
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