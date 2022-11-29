// Import express framework
const express = require('express');
// calling an router
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
// need to upload the file or not
const fileFilter = (req, file, cb) => {
    if (true) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// const uploads = multer({dest:'uploads/'})
const uploads = multer({ storage: storage, fileFilter: fileFilter })


// router.post("/products", uploads.single('imgname'), (req, res) => {
router.post("/products", (req, res) => {
    connection.query("call Product_Action (?,?,?,?,?,?,?,?)", [req.body.ProductID, req.body.ProductName, req.body.Description,
    req.body.Price, req.body.StockQuantity, req.body.CreatedBy, req.body.Image, req.body.ImageName],
        (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
            }
            else {
                console.log(results)
                res.status(200).json(results[0]);
            }
        });

});

//pagination by prakash
router.get("/products_get/:id/:page_no/:page_size", (req, res) => {
    connection.query("call product_get (?,?,?)", [req.params.id,req.params.page_no,req.params.page_size],
        (error, results, fields) => {
            if (error) {
                res.status(400).json(error);
            }
            else {
                res.status(200).json(results);
            }
        });

});
//product get for ecommerce
router.get("/products_get/:id", (req, res) => {
    connection.query("call product_gets (?)", [req.params.id],
        (error, results, fields) => {
            if (error) {
                res.status(400).json(error);
            }
            else {
                res.status(200).json(results);
                console.log(results[0]);
            }
        });

});
//******************************************** */
router.post("/products_delete", (req, res) => {

    connection.query("call product_delete (?,?)", [req.body.Product_ID, req.body.User_ID],
        (error, results, fields) => {
            if (error) {
                res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
            }
            else {
                res.status(200).json(results[0]);
            }
        });

});

router.post("/product-search", (req, res) => {
    connection.query("call product_search (?)", [req.body.ProductName], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
});

router.post("/ecommerce-product-search", (req, res) => {

    connection.query("call ecommerce_products_search (?)", [req.body.ProductName], (error, results, fields) => {

        if (error) {

            res.status(400).json(error);

        } else {

            res.status(200).json(results[0]);

        }

    });

});
module.exports = router;