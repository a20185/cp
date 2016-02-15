var crypto = require('crypto');
var fs = require('fs');

// var data = {
//   "posts": [
//     {
//       "title": "Lorem ipsum",
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     },
//     {
//       "title": "Sed egestas",
//       "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
//     }
//   ]
// };

/**
 * [job description] Assignment model
 * @type {Object}
 */
var jobMode = {
  "jobs" : [
      {
        "index":"0",
        "title" : "Recipe",
        "refer": "http://my.ss.sysu.edu.cn/wiki/display/WEB/Homework+1+-+Recipe",
        // "start": "0",
        // "judge": "1000",
        // "end": "2000",
        "available":"true"
      },
      {
        "index":"1",
        "title" : "Movie Review",
        "refer": "http://my.ss.sysu.edu.cn/wiki/display/WEB/Homework+2+-+Movie+Review",
        // "start": "0",
        // "judge": "1000",
        // "end": "2000",
        "available":"true"
      }
  ]
};

var CommentMode = {
    "comments" : [
        {
          "index" : 0,
          "jobIndex": jobMode.jobs[0].index,
          "title": "Good",
          "body": "It looks really Brilliant!",
          "senderId": "14331219",
          "senderName": "Maxwell Ou",
          "senderGroup": 1,
          "receiverId" : "14331279",
          "receiverName": "God Wen",
          "receiverGroup": 2,
          "score": 100
        },
        {
          "index" : 1,
          "jobIndex": jobMode.jobs[0].index,
          "title":  "Awful!",
          "body": "It looks so stupid!",
          "senderId": "14331239",
          "senderName": "Nobody",
          "senderGroup": 1,
          "receiverId" : "14331279",
          "receiverName": "God Wen",
          "receiverGroup": 2,
          "score": 60
        }
    ]
};


/**
 * [assMode description] Assignment Model
 * @type {Object}
 * Includes Job
 * and Comment Post and review , Rank and Upload File
 * 
 */
var assMode = {
  "assignments" : [
      {
        "index": 0,
        "job" : jobMode.jobs[0],
        "recvComment": [],
        "sendComment": [],
        "assessGroup": -1,
        "taComment": [],
        "rank": 0,
        "position": -1,
        "ended":"false",
        "source": [],
        "github": "",
      },
      {
        "index": 1,
        "job" : jobMode.jobs[1],
        "recvComment": [],
        "sendComment": [],
        "assessGroup": -1,
        "taComment": [],
        "rank": 0,
        "position": -1,
        "ended":"false",
        "source": [],
        "github": "",
      }
  ]
};

var subMode = {
    "index": 0,
    "submissions": [
        {
            "index": 0,
            "icon": '#',
            "fileLoc": '#'
        },
        {
            "index": 1,
            "icon": '#',
            "fileLoc": '#'  
        }
    ]
};

var stuMode = {
  "students": [
      {
        "stuId" : 14331219,
        "stuPasswd": 14331219,
        "stuName": "Maxwell Ou",
        "stuGroup": 1,
        "stuScore": [],
        "stuRank": [],
        "assignments": assMode.assignments
      }
  ]
};




// GET

exports.posts = function (req, res) {
  var posts = [];
  data.posts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.assignments = function(req , res , next) {
    var assignment = [];
    assMode.assignments.forEach(function (ass, i) {
    assignment.push({
      job : jobMode.jobs[i],
      recvComment: ass.recvComment,
      sendComment: ass.sendComment,
      assessGroup: ass.assessGroup,
      taComment: ass.taComment,
      rank: ass.rank,
      position: ass.position,
      ended: ass.ended,
      source: ass.source,
      github: ass.github,
    });
  });
    res.json({
        assignments : assignment,
        status: true,
        why: "Get Data Successfully"
    });
};

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.login = function(req , res , next) {

};

exports.register = function(req , res , next) {

};

exports.loginPost = function(req , res , next) {
  var User = global.dbHandle.getModel('user');
  var myName = req.body.username;
  User.findOne({username:myName},function(err,doc){
        if(err){
            // res.send(500);
            res.json({status: false , why:"NetWork Error!"});
            console.log(err);
            console.log('USERFAILED');
        }else if(!doc){
            req.session.error = '用户名不存在';
            console.log("userName == " + myName);
            console.log(req.session.error);
            // res.writeHead(404, {'Content-Type': 'text/plain'});
            // res.end("" + req.session.error);
            res.json({status: false , why:"用户名不存在"});
        }else{
            var md5 = crypto.createHash('md5');
            var myPasswd = md5.update(req.body.passwd).digest('hex');
            console.log("Encrypted:: " + myPasswd);
            if(myPasswd != doc.password){
                req.session.error = "密码错误";
                console.log("Password Wrong!");
                console.log("The password should be:" + doc.password);
                res.json({status: false , why:"密码错误"});
            }else{
                req.session.user = doc;
                console.log(req.session.user);
                // res.send(200);
                console.log(doc.username);
                res.json({status: true , why:"Success" , user: doc.username});
            }
        }
  });
};

exports.online = function(req , res , next) {
  if (req.session.user) {
    res.json({
      status: true,
      why: "Already Logged In!",
      username: req.session.user.username
    });
  } else {
    res,json({
      status: false,
      why: "Not yet Logged In !"
    })
  }
}

exports.registerPost = function(req , res , next) {

};

exports.upload = function(req, res, next) {
  // console.log(req.body);
  // console.log(req.files);
  // 获得文件的临时路径
    var tmp_path = req.files.thumbnail.path;
    var user = 'guest';
    if (!req.session || !req.session.user) {
        var target_path = './uploads/guest/' + req.files.thumbnail.name;
    } else {
        user = req.session.user.username;
        var target_path = './js/upload/' + user + '/' + req.files.thumbnail.name;
    }
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
    // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) {
            console.log('/** An error Occured! **/');
            res.json({
                status: false,
                why: "Upload Failed!"
            });
            throw err;
         }
         console.log('/** Upload Successfully **/');
         res.json({
            status: true,
            why: "Upload Successfully!"
         });
         // ('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
    });
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};