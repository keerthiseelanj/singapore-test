// Import express framework
const express = require('express');
// calling an router
const router = express.Router();

router.post('/cart', (req, res) => {
    connection.query("call cart_action (?,?,?,?)", [req.body.ID, req.body.UserId, req.body.ProductID, req.body.Quantity], (error, results, fields) => {
        if (error) {
            res.status(400).json({ msg: 'Somthing went wrong', status_code: 400 })
        }
        else {
            res.status(200).json(results);
        }
    });

});

router.post('/cart_get', (req, res) => {
    connection.query("call cart_get (?)", [req.body.User_Id], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        }
        else {
            res.status(200).json(results[0]);
        }
    });
});
router.post('/cart_delete', (req, res) => {
  
    connection.query("call cart_delete (?,?)", [req.body.ID, req.body.User_Id], (error, results, fields) => {

        if (error) {
            res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
        } else {
            res.status(200).json(results[0]);
        }
    });
});
module.exports = router;