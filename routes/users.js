var express = require('express');
var router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkIfAuth = auth.checkIfAuthenticated;


router.get('/', async function (req, res, next) {
  let { searchValue } = req.query;
  let updSerch = searchValue.split(" ");
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
    and
    (Users.name similar to '${updSerch[0].substring(0, 2)}%'
    or Users.name similar to '${updSerch[0].substring(0, 1)}(.)')
    and Users.surname='${updSerch[1]}'
    and status = 1
    UNION
    select u.id, u.name, u.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user2_id = ${userId}
    and
    (u.name similar to '${updSerch[0].substring(0, 2)}%'
    or u.name similar to '${updSerch[0].substring(0, 1)}(.)')
    and u.surname='${updSerch[1]}'
    and status = 1;
    `
  );

  console.log(friends);
  res.json(friends).status(200);
});

router.get('/incoming', async function (req, res, next) {
  let { searchValue } = req.query;
  let updSerch = searchValue.split(" ");
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const incom = await db.query(`
    select u.id, u.name, u.surname
    from Friend 
    left join Users 
    on user2_id = Users.id 
    left join Users u 
    on user1_id = u.id 
    where user2_id = ${userId}
    and
    (u.name similar to '${updSerch[0].substring(0, 2)}%'
    or u.name similar to '${updSerch[0].substring(0, 1)}(.)')
    and u.surname='${updSerch[1]}'
    and status = 0
    ;
  `);
  res.json(incom).status(200);
});

router.get('/outgoing', async function (req, res, next) {
  let { searchValue } = req.query;
  let updSerch = searchValue.split(" ");
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const outgoing = await db.query(
    `
      select Users.id, Users.name, Users.surname
      from Friend 
      left join Users 
      on user2_id = Users.id 
      left join Users u 
      on user1_id = u.id 
      where user1_id = ${userId}
      and
      (Users.name similar to '${updSerch[0].substring(0, 2)}%'
      or Users.name similar to '${updSerch[0].substring(0, 1)}(.)')
      and Users.surname='${updSerch[1]}'
      and status = 0
      ;
      `
  );
  res.json(outgoing).status(200);
});



router.get('/other', async function (req, res, next) {
  let { searchValue } = req.query;
  let updSerch = searchValue.split(" ");
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);

  const a1 = await db.query(
    `
      select * from Users
      left join Friend
      on Friend.user2_id = Users.id
      where Friend.user1_id = ${userId}
      or Friend.user2_id =${userId}
;
      `
  );
  let a = [];
  for (key in a1) {
    a[key] = a1[key].id;
  }

  const other = await db.query(
    `
    select * from Users
    where id not in (${a})
    and
      (Users.name similar to '${updSerch[0].substring(0, 2)}%'
      or Users.name similar to '${updSerch[0].substring(0, 1)}(.)')
      and Users.surname='${updSerch[1]}';

    `
  );
  console.log(other);
  res.json(other).status(200);
});


router.put('/accept/id', async function (req, res, next) {
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

router.post('/add/id', async function (req, res, next) {
  const other = req.body.id;
  let userId = auth.getUserIdFromRequestHeaderAuth(req.headers.authorization);
  const addUser = await db.query(`
  INSERT INTO Friend VALUES (${userId},${other},0) ON CONFLICT DO NOTHING
    ;
  `);
  res.json(addUser).status(200);
});


module.exports = router;
