

const { constants } = require('fs/promises')
const pool = require('../config/database.js')
// const mod = require('./mainModule.js')

const {
  studentApplications,
  studentInfoPgQuery,
  selectApplicationAbbreviated,
  selectApplications,
  selectReview,
  selectComment,
  rolePgQuery,
  supervisorsPgQuery,
  studentIdPgQuery,
  supervisorIdPgQuery,
  savedApplicationsPgQuery,
  savedApplicationPgQuery,
  applicationUploadPgQuery,
  applicationUpdatePgQuery,
  savedPhotoPgQuery,
  applicationPlusReviewUploadPgQuery,
  getPassword,
  savedPasswordPgQuery,
  getStudentIdForApplicationPgQuery,
  deleteApplicationPgQuery,
  deleteReviewPgQuery 
} = require('./sqlStringModule.js')

const getRole = async function (user_id) {
  try {
    let result = await pool.query(rolePgQuery, [user_id])
    return result.rows[0].result
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const getStudentId = async function (user_id) {
  try {
    let result = await pool.query(studentIdPgQuery, [user_id])
    return result.rows[0].student_id
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const getSupervisorId = async function (user_id) {
  try {
    let result = await pool.query(supervisorIdPgQuery, [user_id])
    return result.rows[0].supervisor_id
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const getSupervisors = async function () {
  try {
    let result = await pool.query(supervisorsPgQuery)
    return result.rows
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const getStudentInfo = async function (user_id) {
  try{
    let result = await pool.query(studentInfoPgQuery, [user_id])
    return result.rows[0]
  }catch(err){
    console.error('Query error:',err)
    return
  }
}

const getApplications = async function (student_id) {
  try{
    let result = await pool.query(studentApplications, [student_id]);
    return result.rows;
  }catch(err){
    console.error('Query error:',err)
  }
}    

const getSavedApplications = async function (student_id) {
  try {
    let result = await pool.query(savedApplicationsPgQuery, [student_id]);
    return result.rows;
  } catch (err) {
    console.error('Query error:', err);
    return
  }
}

const getSavedApplication = async function (application_id) {
  try {
    let result = await pool.query(savedApplicationPgQuery, [application_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const updateImage = async function (photo) {
  try {
    let result = await pool.query(savedPhotoPgQuery, photo)
    return result.rows[0];
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const password = async function (student_id) {
  try {
    let result = await pool.query(getPassword, [student_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const updatePassword = async function (sqlPar) {
  try {
    let result = await pool.query(savedPasswordPgQuery, sqlPar);
    return result.rows[0];
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const getStudentIdForApplication = async function (application_id) {
  try {
    let result = await pool.query(getStudentIdForApplicationPgQuery, [application_id]);
    return result.rows[0].student_id;
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

const deleteThisApplication = async function (application_id) {
  try {
    let result = await pool.query(deleteApplicationPgQuery, [application_id]);
  } catch (err) {
    console.error('Query error:', err);
    return
  }
}

const deleteThisReview = async function (sqlPar) {
  try {
    console.error(sqlPar[0])
    let resultReviewPgQuery = await pool.query(deleteReviewPgQuery, [sqlPar[0]]);
    let resultApplicationPgQuery = await pool.query(deleteApplicationPgQuery, [sqlPar[1]]);
  } catch (err) {
    console.error('Query error:', err)
    return
  }
}

module.exports = {
  applicationPlusReviewUploadPgQuery:applicationPlusReviewUploadPgQuery,
  selectApplicationAbbreviated:selectApplicationAbbreviated,
  selectApplications: selectApplications,
  selectReview: selectReview,
  selectComment: selectComment,
  getSupervisorId: getSupervisorId,
  applicationUpdatePgQuery: applicationUpdatePgQuery,
  getSavedApplication: getSavedApplication,
  getSavedApplications: getSavedApplications,
  getRole: getRole,
  getSupervisors: getSupervisors,
  getStudentId: getStudentId,
  applicationUploadPgQuery: applicationUploadPgQuery,
  getStudentInfo: getStudentInfo,
  getApplications: getApplications,
  updateImage: updateImage,
  password: password,
  updatePassword: updatePassword,
  getStudentIdForApplication: getStudentIdForApplication,
  deleteThisApplication: deleteThisApplication,
  deleteThisReview: deleteThisReview 
}
