var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://charles:kwonyuri125@ds229549.mlab.com:29549/tutorial', ['tasks']);

router.get('/', function(req, res, next) {
  res.send('This is api.')
})

//Get all tasks
router.get('/tasks/', function(req, res, next){
  db.tasks.find(function(err, tasks){
    if(err){
      res.send(err);
    }
    res.json(tasks);
  });
});

// Dynamic just one task stuff
router.get('/task/:id', function(req, res, next){
  db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, task){
    if(err){
      res.send(err);
    }
    res.json(task);
  });
});

// handling post req
router.post('/task', function(req, res, next){
  var task = req.body;
  if (!task.title || !(task.isDone + '')){
    res.status(400);
    res.json({
      "error" : "Bad Data"
    });
  }else {
    db.tasks.save(task, function(err, task){
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  }
});

//Deleting a task
router.delete('/task/:id', function(req, res, next){
  db.tasks.remove({_id: mongojs.ObjectId(req.params.id)},function(err, task){
    if(err){
      res.send(err);
    }
    res.json(task);
  });
});

//Update
router.put('/task/:id', function(req, res, next){
  var task = req.body;

  var updTask = {};

  if(task.isDone){
    updTask.isDone = task.isDone;
  }

  if(task.title){
    updTask.title = task.title;
  }

  if(!updTask){
    res.status(400);
    res.json({ "error": "Bad Data"});
  }
  else{
    db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, function(err, task){
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  }
});
module.exports = router;
