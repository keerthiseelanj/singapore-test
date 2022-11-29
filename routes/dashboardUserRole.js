// Import express framework
const express = require('express');
// calling an router
const router = express.Router();

router.post("/dashboard-user-role",(req,res) => {
   
    connection.query("call dashboard_user_role_action (?,?,?,?,?,?)",[req.body.ID,req.body.Role_Name,req.body.Role_Type,
   req.body.Module_Access, req.body.Status,req.body.Created_By],(error,results,fields)=>{
     
       if(error){
        console.log(error)
           res.status(400).json({msg: "Something went wrong", status_code: 400 });
       }
       else{
           res.status(200).json(results[0]);
       }
   });
});
//pagination by prakash
router.get("/dashboard-user-role-get/:ID/:page/:pageSize",(req,res) => {
  
    connection.query("call dashboard_user_role_get (?,?,?)",[req.params.ID,req.params.page,req.params.pageSize],(error,results,fields)=>{
      
       if(error){
           res.status(400).json({msg: "Something went wrong", status_code: 400 });
       }
       else{
           res.status(200).json(results);
       }
   });
});
///*******************************end****************** */
router.post("/dashboard-user-role-delete",(req,res) => {
  
    connection.query("call dashboard_user_role_delete (?,?)",[req.body.ID,req.body.Updated_By],(error,results,fields)=>{
      
       if(error){
           res.status(400).json({msg: "Something went wrong", status_code: 400 });
       }
       else{
           res.status(200).json(results[0]);
       }
   });
});









module.exports = router;