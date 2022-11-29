// Import express framework
const express = require('express');
// calling an router
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
//pagination code by prakash
router.get("/customer-get/:id/:page/:pageSize", (req, res) => {
    connection.query("call customer_get (?,?,?)", [req.params.id,req.params.page,req.params.pageSize], (error, results, fields) => {
        if (error) {
            res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
        }
        else {
            res.status(200).json(results);
        }
    })
});
//*************end********************* */
router.post("/customer-create", (req, res) => {

    const customerName = req.body.customer_name;
    const myPlaintextPassword = (Math.random() + 1).toString(36).substring(7);
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: "sgpolymerabitech@gmail.com",
            pass: "qbmsgzeggckhxluc"
        }
    });
    bcrypt.hash(myPlaintextPassword, 0, function (err, hash) {
        connection.query("call customer_create (?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.ID, req.body.email, req.body.user_name,
            hash, req.body.address_line1, req.body.address_line2, req.body.city,
        req.body.country, req.body.postal_code, req.body.telephone_number,
        req.body.customer_name, req.body.user_Id], (error, results, fields) => {

            if (!error) {
                if (results[0][0].status_code == 200) {
                    if (req.body.ID == 0) {
                        const mailData = {
                            from: 'jagadeeshwaran@gmail.com',  // sender address
                            to: req.body.email,   // list of receivers
                            subject: 'User name and Password',
                            html: `<b>Dear Sir/Madam,</b>
                             <br>
                             <p> Please Use This User name and Password<p/>
                             <h4>User Name: ${customerName} </h4>
                             <h4>Password: ${myPlaintextPassword} </h4>`
                        }; transporter.sendMail(mailData, function (err, info) {
                            if (err) {
                                res.status(400).json([{ msg: err, status_code: 400 }]);
                            } else {
                                res.status(200).json([{ msg: results[0][0].msg, status_code: 200, other: 'mail sent' }]);
                            }
                        })
                    }
                    else {
                        res.status(200).json([{ msg: results[0][0].msg, status_code: 200, other: 'mail sent' }]);
                    }
                }
                else {
                    res.status(200).json([{ msg: results[0][0].msg, status_code: 400 }]);
                }
            }
            else {
                res.status(400).json([{ msg: 'Something Went Wrong', status_code: 400 }]);
            }

        })
    })
})

router.post("/customer-delete", (req, res) => {
    connection.query("call customer_delete (?,?)", [req.body.ID, req.body.User_ID],
        (error, results, fields) => {
            if (error) {
                res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
            }
            else {
                res.status(200).json(results[0]);
            }
        });
});

router.post("/customer-search", (req, res) => {
    connection.query("call customer_search (?)", [req.body.name], (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
          
            res.status(200).json(results[0]);
        }
    });
});

router.post("/customer-address-get", (req, res) => {
connection.query("call customer_address_get (?)", [req.body.customerID], (error, results, fields) => {
if (error) {
res.status(400).json(error);
} else {
  res.status(200).json(results[0]);
   }
  });
});

router.post("/customer-address-create", (req, res) => {



    connection.query("call customer_address_create (?,?,?,?,?,?,?,?)", [req.body.address_line1,req.body.address_line2,

        req.body.city,req.body.country,req.body.postal_code,req.body.customerID,req.body.telephone_number

        ,req.body.customer_name], (error, results, fields) => {

        if (error) {

            res.status(400).json(error);

        } else {

            res.status(200).json(results[0]);

        }

    });

  });

module.exports = router;
