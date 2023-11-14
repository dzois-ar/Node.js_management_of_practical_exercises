
const ui = require('../modules/uiModule')
const sqlMod = require('../modules/sqlModule')
const pool = require('../config/database.js')

// let execution_certificate,completion_report,progress_report

const checkInputs = async function (req, res) {
    if (req.body.finalized == 'true') {
        // if (req.body?.execution_certificateFileChange == `true`) {
        //     if (req?.application_id !== undefined) {
        //         execution_certificate = await pool.query(`select execution_certificate from review join
        //      applications on review.application_id = applications.application_id
        //       where application_id = ${req.application_id}`)
        //     } else {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        //     if (
        //         execution_certificate.rows.length === 0
        //     ) {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        // }
        // if (req.body?.completion_reportFileChange == `true`) {
        //     if (req?.application_id !== undefined) {
        //         completion_report = await pool.query(`select completion_report from review join
        //      applications on review.application_id = applications.application_id
        //       where application_id = ${req.application_id}`)
        //     } else {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        //     if (
        //         completion_report.rows.length === 0
        //     ) {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        // }
        // if (req.body?.progress_reportFileChange == `true`) {
        //     if (req?.application_id !== undefined) {
        //         progress_report = await pool.query(`select progress_report from review join
        //      applications on review.application_id = applications.application_id
        //       where application_id = ${req.application_id}`)
        //     } else {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        //     if (
        //         progress_report.rows.length === 0
        //     ) {
        //         res.redirect('/student/CreateApplication')
        //         return 0
        //     }
        // }

        const errorJson = { errors: {} }

        if (req.body.supervisor_id == undefined || req.body.supervisor_id == "")
            errorJson.errors['supervisor_id'] = 'Please give a supervisor'

        if ((
            req.body?.execution_certificateFileChange == 'false' || req.body?.execution_certificateFileChange == undefined) &&
            req.files?.execution_certificate == undefined
        )
            errorJson.errors['execution_certificate'] = 'Please give a execution certificate'

        if ((
            req.body?.completion_reportFileChange == 'false' || req.body?.completion_reportFileChange == undefined) &&
            req.files?.completion_report == undefined
        )
            errorJson.errors['completion_report'] = 'Please give a execution certificate'

        if ((
            req.body?.progress_reportFileChange == 'false' || req.body?.progress_reportFileChange == undefined) &&
            req.files?.progress_report == undefined
        )
            errorJson.errors['progress_report'] = 'Please give a execution certificate'

        if (req.body?.company_name == undefined || req.body.company_name == '')
            errorJson.errors['company_name'] = 'Please enter the company\'s name'

        if (req.body?.duration == undefined || req.body.duration == '')
            errorJson.errors['duration'] = 'Please enter the duration'

        if (req.body?.employment == undefined || req.body.employment == '')
            errorJson.errors['employment'] = 'Please enter the type of employment'

        if (req.body?.start_date == undefined || req.body.start_date == '')
            errorJson.errors['start_date'] = 'Please give the start date'

        if (req.body?.expiry_date == undefined || req.body.expiry_date == '')
            errorJson.errors['expiry_date'] = 'Please give the expiry date'



        if (Object.keys(errorJson.errors).length) {
            res.status(400)
            res.json(errorJson)
            return 0
        } else {
            return 1
        }
    }
    return 1
}

const cleanParams = function (pgParams, req) {
    pgParams.push(req.files.execution_certificate === undefined ? null : req.files.execution_certificate[0].path)
    pgParams.push(req.files.completion_report === undefined ? null : req.files.completion_report[0].path)
    pgParams.push(req.files.progress_report === undefined ? null : req.files.progress_report[0].path)

    pgParams = pgParams.map(param => (param == 'undefined' || param == undefined || param == '') ? null : param)
    return pgParams
}

const createApplication = async function (req, res) {
    console.log('CreateApplication ', new Date)
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        if (!await checkInputs(req, res))
            return
        const student_id = await sqlMod.getStudentId(req.user.user_id)
        let pgParams = [
            student_id,
            req.body.supervisor_id,
            req.body.company_name,
            req.body.duration,
            req.body.employment,
            req.body.start_date,
            req.body.expiry_date,
            req.body.finalized
        ]
        pgParams = cleanParams(pgParams, req)
        pool.query(
            req.body.finalized == 'true' ? sqlMod.applicationPlusReviewUploadPgQuery : sqlMod.applicationUploadPgQuery,
            pgParams, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json({message:'application saved'})
                    // res.redirect('/student/StudentProfile')
                }
            })
    }
}

const updateApplication = async function (req, res) {
    console.log('UpdateApplication ', new Date)
    if (!req.isAuthenticated() || await sqlMod.getRole(req.user.user_id) !== 'student') {
        ui.sendToRestrictedPage(req, res)
        return
    } else {
        if (!await checkInputs(req, res)) 
            return
        const student_id = await sqlMod.getStudentId(req.user.user_id)
        let pgParams = [
            student_id,
            req.body.supervisor_id,
            req.body.company_name,
            req.body.duration,
            req.body.employment,
            req.body.start_date,
            req.body.expiry_date,
            req.body.finalized,
            req.body.application_id
        ]
        pgParams = cleanParams(pgParams, req)
        pool.query(sqlMod.applicationUpdatePgQuery, pgParams, (err) => {
            if (err) {
                console.log(err)
            }
            res.json({message:'application update'})
            // res.redirect('/student/StudentProfile')
        })
    }
}

module.exports = {
    createApplication: createApplication,
    updateApplication: updateApplication
}