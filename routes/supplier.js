// Import express framework
const express = require('express');
// calling an router
const router = express.Router();
const bcrypt = require('bcryptjs');

// getting supplier data ,pagination by prakash
router.get("/user_get/:User_ID/:page/:pageSize", (req, res) => {

    connection.query("call user_detail (?,?,?)", [req.params.User_ID,req.params.page,req.params.pageSize], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
});
///****************************end*************************** */
// add and edit supplier
router.post("/supplier-users", async (req, res) => {
    // const myPlaintextPassword = req.body.user_password;
  
    // await bcrypt.hash(myPlaintextPassword, 0, function (err, hash) {
     
    //     // Store hash in your password DB.

    //     connection.query(
    //         "call supplier_user(?,?,?,?,?,?,?,?,?)",
    //         [req.body.user_name, req.body.company_name, hash,req.body.address, req.body.telephone_number,req.body.email,
    //              req.body.remarks,req.body.user_id,req.body.ID],
    //         (error, results, fields) => {
    //             if (!error) {
    //                 res.status(200).json(results[0]);
    //             } else {
    //                 res.status(400).json("Failed To Get An Data" + error);
    //             }
    //         }
    //     );
    // });
    connection.query(
        "call supplier_user(?,?,?,?,?,?,?)",
        [req.body.company_name, req.body.address, req.body.telephone_number,req.body.email,
             req.body.remarks,req.body.user_id,req.body.ID],
        (error, results, fields) => {
            if (!error) {
                res.status(200).json(results[0]);
            } else {
                res.status(400).json("Failed To Get An Data" + error);
            }
        }
    );
});

router.post('/supplier-get', (req, res) => {
      connection.query("call supplier_get (?)", [req.body.ID], (error, results, fields) => {
          if (error) {
              res.status(400).json(error);
          }
          else {
              res.status(200).json(results[0]);
          }
      });
    });

    router.post('/supplier-delete', (req, res) => {
          connection.query("call supplier_delete (?,?)", [req.body.ID, req.body.user_id],
          (error, results, fields) => {
              if (error) {
                  res.status(400).json(error);
              }
              else {
                  res.status(200).json(results[0]);
              }
          });
        });
        
    router.post("/supplier-search", (req, res) => {
            connection.query("call supplier_search (?)", [req.body.company_name], (error, results, fields) => {
             if (error) {
                res.status(400).json(error);
                } else {
                res.status(200).json(results[0]);

                }

            });

        });


// exporting the module
module.exports = router;