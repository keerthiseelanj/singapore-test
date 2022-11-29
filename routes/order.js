// Import express framework
const express = require('express');
// calling an router
const router = express.Router();
const multer = require('multer');




router.post('/order-items/:orderID/:userID', (req, res) => {
    for (let i = 0; i < req.body.length; i++) {
        connection.query("call action_order_items (?,?,?,?,?,?,?)", [req.body[i].ID,
        req.body[i].Quantity,
        req.body[i].Price,
        req.params.orderID,
        req.body[i].productID,
        req.body[i].supplierID,
        req.params.userID], (error, results, fields) => {
            if (error) {
                res.status(400).json([{ msg: 'Something went wrong', status_code: 400, err: error }]);
            } else {
                if (i == req.body.length - 1) {
                    res.status(200).json([{ msg: 'success', status_code: 200, re: results }]);
                }

            }
        });
    }

});

// getting supplier data
router.post("/order-action", (req, res) => {
    // console.log(req.body)
    connection.query("call orders_action (?,?,?)", [req.body.ID, req.body.userID, req.body.customer_ID], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
// const uploads = multer({dest:'uploads/'})
const uploads = multer({ storage: storage })

// getting supplier data
router.post("/file/:orderID/:userID", uploads.array("files"), (req, res) => {
    const files = req.files;

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            connection.query("call orders_file (?,?,?)", [files[i].filename, req.params.userID, req.params.orderID], (error, results, fields) => {
                if (error) {
                    res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
                } else {
                    if (i == files.length - 1) {
                        res.status(200).json([{ msg: 'Success', status_code: 200 }]);
                    }

                }
            });
        }
    } else {
        res.status(400).json([{ msg: 'Please select files', status_code: 400 }]);
    }

});
//pagination code by prakash
router.get("/order-get/:Page_No/:Page_Size", (req, res) => {
    connection.query("call orders_get (?,?)", [req.params.Page_No,req.params.Page_Size], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
});
//*******end****** */
router.post("/order-details", (req, res) => {

    connection.query("call order_details (?)", [req.body.ID], (error, results, fields) => {

        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
});
router.delete("/orders-items-delete/:ID", (req, res) => {

    connection.query("call orders_items_delete (?)", [req.params.ID], (error, results, fields) => {

        if (error) {
            res.status(400).json([{ msg: 'Something went wrong', status_code: 400 }]);
        } else {
            res.status(200).json([{ msg: 'Items deleted successfully', status_code: 200 }]);
        }
    });
});

router.post("/orders-files-delete", (req, res) => {
    // console.log(req.body)
    connection.query("call orders_files_delete (?,?)", [req.body.ID, req.body.orderID], (error, results, fields) => {

        if (error) {
            res.status(400).json([{ msg: 'Something went wrong', status_code: 400 }]);
        } else {
            res.status(200).json([{ data: results[0], msg: 'File deleted successfully', status_code: 200 }]);
        }
    });
});

router.post("/order-items-updates/:userID", (req, res) => {
    for (let i = 0; i < req.body.length; i++) {
        connection.query("call orders_items_update (?,?,?)", [req.body[i].ID,
        req.params.userID, req.body[i].supplierID], (error, results, fields) => {
            if (error) {
                res.status(400).json(error);
            } else {
                if (i == req.body.length - 1) {
                    res.status(200).json(results[0]);
                }
            }
        });
    }
});

router.post("/outgoing-order/:userID", (req, res) => {
    for (let i = 0; i < req.body.length; i++) {
        connection.query("call outgoingOrder (?,?,?)", [req.body[i].orderID,
        req.params.userID, req.body[i].supplierID], (error, results, fields) => {
            if (error) {
                res.status(400).json(error);
            } else {
                if (i == req.body.length - 1) {
                    res.status(200).json(results[0]);
                }
            }
        });
    }
});

router.post("/outgoing-order/:page/:pageSize", (req, res) => {
    connection.query("call get_outgoing_order (?,?,?,?)", [req.body.userID,
    req.body.userType,req.params.page,req.params.pageSize], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {

            res.status(200).json(results);

        }
    });

});
router.post("/outgoing-order-details", (req, res) => {

    connection.query("call outgoing_order_details (?,?)", [req.body.outgoing_orderID, req.body.outgoing_supplier_ID], (error, results, fields) => {

        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
});

router.post("/orders-status", (req, res) => {

    connection.query("call orders_status_update (?,?,?)", [req.body.status, req.body.outgoing_orderID, req.body.outgoing_supplier_ID], (error, results, fields) => {
        if (error) {
            res.status(400).json({ msg: "Something went wrong", sttus_code: 400 });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

router.post("/orders-delete", (req, res) => {

    connection.query("call orders_delete (?)", [req.body.ID], (error, results, fields) => {

        if (error) {
            res.status(400).json([{ msg: 'Something went wrong', status_code: 400 }]);
        } else {
            res.status(200).json([{ msg: 'Order deleted successfully', status_code: 200 }]);
        }
    });
});

// for report
//for order report details
router.post("/getallorder", (req, res) => {
    connection.query("call getallorder(?,?,?)", [req.body.ordercode, req.body.fromdate, req.body.todate], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    })
})
//get all order code 
router.post("/getordercode", (req, res) => {
    connection.query("call getordercode(?)", [req.body.name], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    })
})
//for out  order report details code by prakash
router.post("/getalloutorder", (req, res) => {
    connection.query("call getalloutorder(?,?,?)", [req.body.out_ordercode, req.body.out_fromdate, req.body.out_todate], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    })
})
//get all out order code by prakash
router.post("/getoutordercode", (req, res) => {
    // console.log(req.body.name)
    connection.query("call getoutordercode(?)", [req.body.name], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    })
})

router.post('/checkout-items/:orderID/:userID', (req, res) => {
    //    console.log(req.params.userID)
    for (let i = 0; i < req.body.length; i++) {

        connection.query("call action_order_items (?,?,?,?,?,?,?)", [
            0,
            req.body[i].Quantity,
            req.body[i].Price,
            req.params.orderID,
            req.body[i].ProductID,
            0,
            req.params.userID], (error, results, fields) => {
                if (error) {
                    res.status(400).json([{ msg: 'Something went wrong', status_code: 400, err: error }]);
                } else {
                    if (i == req.body.length - 1) {
                        res.status(200).json([{ msg: 'success', status_code: 200, re: results }]);
                    }

                }
            });
    }

});

router.post("/ecommerce-order-get", (req, res) => {
    // console.log(req.body)
    connection.query("call ecommerce_orders_get (?)", [req.body.customer_ID], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
});
router.post("/ecommerce-order-detail", (req, res) => {



    connection.query("call ecommerce_order_details (?)", [req.body.orderID], (error, results, fields) => {



        if (error) {

            res.status(400).json(error);

        } else {

            res.status(200).json(results[0]);

        }

    });

});


router.post("/logestic-action", (req, res) => {
    connection.query("call logestic_action (?,?,?,?,?,?,?)", [req.body.ID, req.body.dispatch_from, req.body.estimate_arrival,
    req.body.status, req.body.incoming_ID, req.body.outgoing_ID, req.body.userID], (error, results, fields) => {
        if (error) {
            console.log(error)
            res.status(400).json({ msg: "Something went wrong", sttus_code: 400 });
        } else {
            res.status(200).json(results[0]);
        }
    });

});

router.post("/logistics-get/:page/:pageSize", (req, res) => {
    connection.query("call Logestic_get (?,?,?,?)", [req.body.userID,
    req.body.userType,req.params.page,req.params.pageSize], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {

            res.status(200).json(results);

        }
    });

});

// getting supplier data
router.post("/logistics-file/:logisticsID/:userID", uploads.array("files"), (req, res) => {
    const files = req.files;

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            connection.query("call logestic_file (?,?,?)", [files[i].filename, req.params.logisticsID, req.params.userID], (error, results, fields) => {
                if (error) {
                    res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
                } else {
                    if (i == files.length - 1) {
                        res.status(200).json([{ msg: 'Success', status_code: 200 }]);
                    }

                }
            });
        }
    } else {
        res.status(400).json([{ msg: 'Please select files', status_code: 400 }]);
    }
});

router.get("/logistics-file-get/:id/:isdelete", (req, res) => {
    connection.query("call getLogisticsFile (?,?)", [req.params.id,
    req.params.isdelete], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {

            res.status(200).json(results[0]);

        }
    });

});
router.post("/ecommerce-shipment-get", (req, res) => {

    connection.query("call ecommerce_shipment_get (?)", [req.body.outgoing_ID], (error, results, fields) => {

        if (error) {

            res.status(400).json(error);

        } else {

            res.status(200).json(results[0]);

        }

    });

});

router.post("/ecommerce-get-invoicefile", (req, res) => {
    connection.query("call ecommerce_get_invoicefile (?)", [req.body.ID], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results[0]);
        }
    });

});

const Storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, './invoice')

    },

    filename: function (req, file, cb) {

        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)

    }

});

const Upload = multer({ storage: Storage })

router.post("/invoice-file/:ID", Upload.single("file"), (req, res) => {
  
    const file = req.file;
    if (file) {

        connection.query("call orders_invoice_file (?,?)", [req.params.ID, file.filename], (error, results, fields) => {
            if (error) {
                res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
            } else {
                res.status(200).json([{ msg: 'Success', status_code: 200 }]);
            }
        });
    } else {
        res.status(400).json([{ msg: 'Please select files', status_code: 400 }]);
    }



});

module.exports = router;