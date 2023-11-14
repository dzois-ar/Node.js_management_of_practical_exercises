const express = require('express')
const router = express.Router()
const pool = require('../config/database.js')
const ui = require('../modules/uiModule')
const sqlMod = require('../modules/sqlModule')
const fileMod = require('../modules/fileModule.js')
const handlerMod = require('../modules/handlerModule')
const multer = require('multer')
const upload = multer({ storage: fileMod.storageSettings });
const uploadImage = multer({ storage: fileMod.storageSettingsImg });
const fs = require("fs");
const path= require("path");
const directoryPath = path.join(__dirname, 'img');
const bcrypt= require('bcryptjs');
const flash = require("express-flash");
const {
    selectApplications,
    selectReview, selectComment
} = require('../modules/sqlModule.js')


router.get('/Supervisors', async (req, res) => {
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(`select position, email, user_name from supervisors join 
        users on supervisors.user_id = users.user_id`,
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                res.json(Sqlres.rows)
            })
    }
})

router.get('/GetSavedApplication', async (req, res) => {
    console.log('GetSavedApplication ', new Date)
    res.json(await sqlMod.getSavedApplication(req.query.application_id))
})

router.post('/CreateApplication', upload.fields(fileMod.fileFields), async (req, res) => {
    handlerMod.createApplication(req, res)
})

router.post('/UpdateApplication', upload.fields(fileMod.fileFields), async (req, res) => {
    handlerMod.updateApplication(req, res)
})

router.get('/CreateApplication', async (req, res) =>{
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        req.query?.user
        let supervisors = await sqlMod.getSupervisors()
        let savedApplications = await sqlMod.getSavedApplications(await sqlMod.getStudentId(req.user.user_id))
        let supervisorIds = supervisors.map(supervisor => supervisor.supervisor_id)
        console.log(savedApplications)
        res.render('pages/createApplication', {
            message: req.locals?.message,
            title: 'Create Applidation',
            supervisors: supervisors,
            supervisorIds: supervisorIds,
            loggedin : 1,
            savedApplications: savedApplications,
            role: 'student'
        })
    }
})


router.get('/uploadImg', (req, res) => {
    res.render('/uploadImg');
})

router.get('/uploadPassword', (req, res) => {
    res.render('/uploadPassword');
})

router.post('/uploadImg', uploadImage.single('image'), async (req, res) => {
    let {student_id} = req.body;
    let sqlPar = [student_id, "/"+ req.file.path];
    let updateImg = await sqlMod.updateImage(sqlPar);
    res.redirect('/student/editProfileStudent');
})

router.post('/uploadPassword', async (req, res) => {
    let {password, student_id, newPassword, confirmPassword} = req.body;
    let errors = [];
    
    if (!password || !newPassword || !confirmPassword) {
        errors.push({ message: "Please enter all fields" });
    }
    
    
  if (newPassword  !== confirmPassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("pages/EditProfileStudent.ejs", {errors});
    }else{
        let passwordUser = await sqlMod.password(student_id);
        bcrypt.compare(password, passwordUser.pwd, async (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              
              hashedPassword = await bcrypt.hash(newPassword, 10);
              let sqlPar = [passwordUser.user_id, hashedPassword ];
              let updateNewPassword = await sqlMod.updatePassword(sqlPar);
              res.redirect('/logout');  
            } else {
              //password is incorrect
              return done(null, false, { message: "Password is incorrect" })
            }      
          } 
        );     
    }
    
     
})

router.get('/StudentProfile', async (req, res) => {
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {   
        ui.sendToRestrictedPage(req, res)
        return
    } 
    else {
        let  info = await sqlMod.getStudentInfo(req.user.user_id);
        console.log(info);
        res.render(`pages/studentProfile`, {
            title: 'Profile',
            loggedin : 1,
            info : info,
            role: 'student',
            applications: await sqlMod.getApplications(info.student_id)  
        })
    }
})


router.get('/EditProfileStudent', async (req, res) => {
    if (req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        let  info = await sqlMod.getStudentInfo(req.user.user_id)
        res.render(`pages/editProfileStudent`, {
            title: 'Profile',
            message: undefined,
            loggedin : 1,
            role: 'student',
            info : info,
        })    
    } 
    else {
        ui.sendToRestrictedPage(req, res)
        return
    }
})

router.post('/deleteApplicacion', async (req, res) => {
    if (req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        let {student_id, application_id} = req.body;
       
        let  student = await sqlMod.getStudentIdForApplication(application_id);
        
        if(student_id == student){
            console.log(application_id);
            let deleteApplicacion = await sqlMod.deleteThisApplication(application_id);
            console.log("readict");
            res.redirect('/student/StudentProfile');
        }
    } 
    else {
        ui.sendToRestrictedPage(req, res)
        return
    }
})

router.post('/deleteReview', async (req, res) => {
    if (req.isAuthenticated()) {
        let {student_id, application_id, review_id} = req.body;
        let  student = await sqlMod.getStudentIdForApplication(application_id);
        if(student_id == student){
            
            let sqlPar = [review_id, application_id ];
            let deleteReview = await sqlMod.deleteThisReview(sqlPar);
            res.redirect('/student/StudentProfile');

        }
    } 
    else {
        ui.sendToLogin(req, res)
        return
    }
})

router.get('/GetReviews', async function (req, res) {
    const role = await sqlMod.getRole(req.user.user_id)
    if (!req.isAuthenticated()) {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(selectApplications(
            `where reviews.application_id = ${req.query.application_id}`
        ),
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                
                res.json(Sqlres.rows[0])
            })
    }
})

router.get('/GetApplication', async function (req, res) {
    const role = await sqlMod.getRole(req.user.user_id)
    if (!req.isAuthenticated()) {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(selectReview(
            `where applications.application_id = ${req.query.application_id}`
        ),
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                
                res.json(Sqlres.rows[0])
            })
    }
})


router.get('/GetComment', async function (req, res) {
    const role = await sqlMod.getRole(req.user.user_id)
    if (!req.isAuthenticated()) {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(selectComment(
            `where reviews.review_id = ${req.query.review_id}`
        ),
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                
                res.json(Sqlres.rows[0])
            })
    }
})

module.exports = router;