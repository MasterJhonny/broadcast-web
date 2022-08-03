const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
    res.redirect('index.html');
})

module.exports = router;