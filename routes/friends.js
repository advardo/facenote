var express = require('express');
var router = express.Router();
var path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');
const checkIfAuth = auth.checkIfAuthenticated;

// 3. Добавить друга, отменить, удалить, посмотреть своих друзей
//Просмотр друзей
router.get('/', async function (req, res, next) {
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const friends = await db.query(
    `
    select Users.id, Users.name, Users.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user1_id = ${userId}
    and status = 1
    UNION
    select u.id, u.name, u.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user2_id = ${userId}
    and status = 1;
    `
  );


  // console.log('friends', friends);

  res.json(friends).status(200);
});

router.get('/incoming', async function (req, res, next) {
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const incoming = await db.query(
    `
    select u.id, u.name, u.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user2_id = ${userId}
    and status = 0
    ;
    `
  );

  res.json(incoming).status(200);
});

router.get('/outgoing', async function (req, res, next) {
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const outcoming = await db.query(
    `
    select Users.id, Users.name, Users.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user1_id = ${userId}
    and status = 0
    ;
    `
  );

  res.json(outcoming).status(200);
});


//принять заявку
router.put('/accept/:id', async function (req, res, next) {
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const other = req.body.id;
  const accept = await db.query(`
    update Friend
    set status = 1
    where user1_id = ${other}
    and user2_id = ${userId}
  ;
  `);

  res.json(accept).status(200);
});
//удалить друга
router.delete('/delete/id', async function (req, res, next) {
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const other = req.body.id;
  const del = await db.query(`
  delete from Friend
  where (user1_id = ${userId}
  and user2_id = ${other})
  or
  (user1_id = ${other}
  and user2_id = ${userId})
  ;
  
  `);

  res.json(del).status(200);

});


module.exports = router;