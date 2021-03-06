const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>{
  if (!req.user) {  // user yoksa index sayfasını render etsin
    res.render('index', { title: 'ChatApp' });
  } else { // user varsa chat router'ına yönlendirsin.
    res.redirect('/chat'); 
  }  
});


router.get('/getUser', (req, res, next) =>{
  res.json(req.user);
});



module.exports = router;
