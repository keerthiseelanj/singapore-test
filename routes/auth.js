// Import express framework
const express = require('express');
// calling an router
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");


router.post("/register", async (req, res) => {

  const myPlaintextPassword = req.body.password;
  await bcrypt.hash(myPlaintextPassword, 0, function (err, hash) {

    // Store hash in your password DB.

    connection.query("call create_dashboard_user(?,?,?)", [req.body.username, req.body.companyname, hash], (error, results, fields) => {
      if (!error) {
        res.status(200).json(results[0])
      } else {
        res.status(400).json("Failed To Get An Data" + error)
      }
    }
    )
  });



}
)

router.post("/login-validate", async (req, res) => {

  connection.query("call user_login(?)", [req.body.username], async (error, results, fields) => {
    if (!error) {

      if (results[0][0].status_code == 200) {
        if (await bcrypt.compare(req.body.password, results[0][0].Password)) {
          res.status(200).json([{ msg: 'Successs', status_code: 200, access: results[0][0].Module_Access, User_ID: results[0][0].User_ID,User_Type: results[0][0].User_Type }])
        } else {
          res.status(200).json([{ msg: 'Invalid Password', status_code: 404 }])
        }
      } else {
        res.status(200).json([{ msg: 'Invalid Username', status_code: 404 }])
      }



    } else {
      res.status(400).json("Failed To Get An Data" + error)
    }
  }
  )
  // connection.query("call user_login(?,?)",

  //   [req.body.username, req.body.password],

  //   async (error, results, fields) => {

  //     console.log(results)

  //     if (!error) {

  //       res.status(200).json(results[0]);

  //     } else {

  //       res.status(400).json("Failed To Get An Data" + error);

  //     }

  //   }

  // );
}
)

// for ecommerce register
router.post("/ecommerce-register", async (req, res) => {



  const myPlaintextPassword = req.body.password;

  console.log(myPlaintextPassword);

  await bcrypt.hash(myPlaintextPassword, 0, function (err, hash) {


    // Store hash in your password DB.



    connection.query("call create_ecommerce_user(?,?,?)", [req.body.user_name, hash, req.body.email], (error, results, fields) => {

      if (!error) {

        res.status(200).json(results[0])

      } else {

        res.status(400).json("Failed To Get An Data" + error)

      }

    }

    )

  });
}

)

// for users pagination
router.get('/users-get/:page/:pageSize', (req, res) => {
  connection.query("call users_get (?,?)", [req.params.page,req.params.pageSize], (error, results, fields) => {
    if (error) {

      res.status(400).json(error);
    }
    else {
      res.status(200).json(results);
    }
  });
});
//**************end******************************** */
router.post("/ecommerce-login", async (req, res) => {

  connection.query("call ecommerce_login(?)", [req.body.user_name], async (error, results, fields) => {

    if (!error) {
      if (results[0][0].status_code == 200) {
        console.log(results[0][0].user_password);
        if (await bcrypt.compare(req.body.password, results[0][0].user_password)) {

          res.status(200).json(results[0])
        }

        else {

          res.status(200).json([{ msg: 'Invalid Password', status_code: 404 }])
        }
      }
      else {
        res.status(200).json([{ msg: 'Invalid Username', status_code: 404 }])
      }

    }
    else {
      res.status(400).json("Failed to get an error", error)
    }
  })
})


// user creation
router.post("/dashboard-users-create", async (req, res) => {
  const userName = req.body.UserName
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
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.ethereal.email",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //         user: "kennedy.bosco61@ethereal.email",
  //         pass: "TXfmv6vaCqQhVWZnPb"
  //     }
  // });
  await bcrypt.hash(myPlaintextPassword, 0, function (err, hash) {
    connection.query("call dashboard_users_create (?,?,?,?,?,?,?)", [req.body.User_ID, req.body.UserName, hash, req.body.Email
      , req.body.Roll_ID, req.body.User_Type, req.body.Supplier_ID], (error, results, fields) => {
        if (!error) {
          if (results[0][0].status_code == 200) {
            if (req.body.User_ID == 0) {
              const mailData = {
                from: 'kennedy.bosco61@ethereal.email',  // sender address
                to: req.body.Email,   // list of receivers
                subject: 'User name and Password',
                html: `<b>Dear Sir/Madam,</b>
                   <br>
                   <p> Please Use This User name and Password<p/>
                   <h4>User Name: ${userName} </h4>
                   <h4>Password: ${myPlaintextPassword} </h4>`
              }; transporter.sendMail(mailData, function (err, info) {
                if (err) {
                  res.status(400).json([{ msg: err }]);

                } else {

                  res.status(200).json([{ msg: 'User added successfully', status_code: 200, other: 'mail send' }]);
                }
              })
            } else {
              res.status(200).json([{ msg: 'User Updated successfully', status_code: 200 }]);
            }
          } else {
            res.status(200).json([{ msg: 'UserName already exits', status_code: 404 }]);
          }
        } else {
          console.log(error)
          res.status(400).json([{ msg: 'Something Went Wrong', status_code: 404 }]);
        }
      })
  })
})

router.post("/users-delete", (req, res) => {
  connection.query("call Users_delete (?)", [req.body.User_ID],
    (error, results, fields) => {
      if (error) {
        res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
      } else {
        res.status(200).json(results[0]);
      }
    });
});

router.post("/ecommerce-user-forget-password", (req, res) => {
  const newPassword = req.body.password;
  bcrypt.hash(newPassword, 0, function (err, hash) {
    connection.query("call ecommerce_user_forget_password (?,?)", [req.body.user_name, hash], (error, results, fields) => {
      if (error) {
        res.status(400).json({ msg: 'Something went wrong', status_code: 400 });
      }
      else {
        res.status(200).json(results[0]);
      }
    })
  })
})

router.post("/ecommerce-user-forget-otp", (req,res) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
   
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          service: 'gmail',
          auth: {
            user: "sgpolymerabitech@gmail.com",
              pass: "qbmsgzeggckhxluc"
          },
        });
         console.log(req.body.user_name)
        connection.query("call ecommerce_user_forget_otp (?)", [req.body.user_name], (error,results,fields) => {
         
          if(!error){
           
            if(results[0][0].status_code == 200){
              const mailData = {
                from: 'sgpolymerabitech@gmail.com',  // sender address
                  to: results[0][0].email,   // list of receivers
                  subject: 'Your Password',
                  html: `<b>Dear Sir/Madam,</b>
                        <br>
                        <p>This is your new password<p/>
                    <h4>Password: ${otp} </h4>`      
             
                };

        transporter.sendMail(mailData, function (err, info){
                  
                  if(err){
                    
                    res.status(400).json({msg: err});
                  }else{
                    res.status(200).json({msg: "Your OTP Generated Successfully",status_code: 200,otp: otp,userName: req.body.user_name });
                  }
                })
              
            }
            else{
    console.log(results)
              res.status(200).json({msg: 'User name is not existing',status_code: 404});
            }
          }
        
          else{
            res.status(400).json({msg: 'Something Went Wrong'});
          }
        })
      
      } )
  
  router.post("/dashboard-forget-otp", (req, res) => {
   
      const otpNumber = Math.floor(1000 + Math.random() * 9000);
    
      let transporterMail = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
          user: "sgpolymerabitech@gmail.com",
          pass: "qbmsgzeggckhxluc"
        },
      });
    connection.query("call dashboard_forget_otp (?)", [req.body.user_name], (error, results, fields) => {
      
        if (!error) {
    
          if (results[0][0].status_code == 200) {
            const mailDataSend = {
              from: 'sgpolymerabitech@gmail.com', // sender address
              to: results[0][0].Email, // list of receivers
              subject: 'Your Password',
              html: `<b>Dear Sir/Madam,</b>
        <br>
       <p>This is your new password<p/>
      <h4>Password: ${otpNumber} </h4>`
    
            };
    transporterMail.sendMail(mailDataSend, function (err, info) {
    
              if (err) {
                res.status(400).json({ msg: err });
              } else {
                res.status(200).json({ msg: "Your OTP Generated Successfully", status_code: 200, otp: otpNumber, userName: req.body.UserName });
              }
            })
    
          }
          else {
            console.log(results)
            res.status(200).json({ msg: 'User name is not existing', status_code: 404 });
          }
        }
    
        else {
          res.status(400).json({ msg: 'Something Went Wrong' });
        }
      })
    
    })
    
    router.post("/dashboard-forget-password", (req, res) => {
      const Newpassword = req.body.password;
    
      bcrypt.hash(Newpassword, 0, function (err, hash) {
    
        connection.query("call dashboard_forget_password (?,?)", [req.body.user_name, hash], (error, results, fields) => {
    
          if (error) {
    
            res.status(400).json([{ msg: 'Something went wrong', status_code: 400 }]);
    
          }
    
          else {
    
            res.status(200).json(results[0]);
    
          }
    
        })
    
      })
    
    })

// exporting the module
module.exports = router;