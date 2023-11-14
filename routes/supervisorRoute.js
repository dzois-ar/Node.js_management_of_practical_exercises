
const express = require('express')
const router = express.Router()
const pool = require('../config/database.js')
const ui = require('../modules/uiModule.js')
const sqlMod = require('../modules/sqlModule.js')
const {
    selectApplications,
    selectApplicationAbbreviated
} = require('../modules/sqlModule.js')



router.get('/GetAbbreviatedApplications', async function (req, res) {
    console.log('GetAbbreviatedApplications ', new Date, ' ', req.query.supervisor_id)
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'supervisor') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(selectApplicationAbbreviated(req.query.supervisor_id),
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                res.json(Sqlres.rows)
            })
    }
})

router.get('/GetApplications', async function (req, res) {
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'supervisor') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        pool.query(selectApplications(
            `where applications.supervisor_id = ${req.query.supervisor_id}`
        ),
            (err, Sqlres) => {
                if (err) {
                    console.error(err)
                    return
                }
                res.json(Sqlres.rows)
            })
    }
})

router.get('/GetApplication', async function (req, res) {
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'supervisor') {
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

router.post('/ReviewApplication', async function (req, res) {
    console.log('ReviewApplication')
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'supervisor') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        const errorJson = {errors:{}}
        if (req.body.approval === false && req.body.comment === '') {
            errorJson.errors['comment'] = 'Reviews for rejected applications must have a comment'
        }
        if(req.body.grade > 10){
            errorJson.errors['grade'] = 'Grade must be equal or less than 10'
        }
        if(req.body.approval === false && req.body.grade >= 5){
            errorJson.errors['grade'] = 'Grade for rejected applications must be less than 5'
        }
        if(req.body.approval === true && req.body.grade < 5){
            errorJson.errors['grade'] = 'Grade for approved applications must be 5 or more'
        }
        if (Object.keys(errorJson.errors).length !== 0) {
            res.status(400)
            res.json(errorJson)
            return
        }
        pool.query(`update reviews set grade = $1, comments = $2, approval = $3 where application_id = $4`,
            [req.body.grade, req.body.comment, req.body.approval, req.body.application_id],
            (err) => {
                if (err) {
                    console.error('Query Error:', err)
                    res.send('Query Error')
                } else {
                    res.status(200)
                    res.json({ message: 'reviewed app' })
                }
            })
    }
})



router.get('/applications', async function (req, res) {
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'supervisor') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        const supervisor_id = await sqlMod.getSupervisorId(req.user.user_id)
        res.render(`pages/applications`, {
            title: 'Applications',
            loggedin: 1,
            message: undefined,
            supervisor_id: supervisor_id,
            role: 'supervisor'
        })
    }
})


module.exports = router;
