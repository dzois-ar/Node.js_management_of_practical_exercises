
const mod = require('./mainModule.js')

const rolePgQuery = `SELECT
user_id,
CASE
  WHEN $1 IN (SELECT user_id FROM students) THEN 'student'
  WHEN $1 IN (SELECT user_id FROM supervisors) THEN 'supervisor'
  ELSE 'Not found'
END AS result
FROM
students`

const supervisorsPgQuery = `select position, email, user_name, supervisor_id from supervisors join 
users on supervisors.user_id = users.user_id`

const studentIdPgQuery = `select student_id from students join 
users on students.user_id = $1 and users.user_id = $1`

const supervisorIdPgQuery = `select supervisor_id from supervisors join 
users on supervisors.user_id = $1 and users.user_id = $1`

const applicationParams = `student_id,
supervisor_id,
company_name,
duration,
employment,
start_date,
expiry_date,
finalized,
execution_certificate,
completion_report,
progress_report`

const savedApplicationsPgQuery = `select application_id, create_date_ap, ${applicationParams}
 from applications where finalized = false and student_id = $1`

const savedApplicationPgQuery = `select create_date_ap, ${applicationParams}
 from applications where finalized = false and application_id=$1`

const applicationUploadPgQuery = `insert into applications (
  ${applicationParams}
)
 values (${mod.pgParamsNumbering(1, 11)})`

 const applicationPlusReviewUploadPgQuery = ` 
 with application_id_result as(
 insert into applications (
   ${applicationParams}
 )
  values (${mod.pgParamsNumbering(1, 11)})
  returning application_id
  )
  insert into reviews (application_id) select application_id from application_id_result`

const savedPhotoPgQuery = `UPDATE students SET photo = $2
 WHERE student_id = $1;`

const applicationUpdatePgQuery = `
call updateApp(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $10,
  $11,
  $12,
  $9)`


const selectApplications = function (where) {
  return `         select 
  approval,
first_name,
last_name,
email,
company_name,
create_date_ap,
duration,
employment,
start_date,
expiry_date,
execution_certificate,
completion_report,
progress_report,
comments,
grade
  from reviews
  join applications on applications.application_id = reviews.application_id     
join students on students.student_id = applications.student_id
join users on students.user_id = users.user_id
${where}`
}

const selectReview = function(where){
  return` select
  first_name,
  last_name,
  email,
  company_name,
  create_date_ap,
  duration,
  employment,
  start_date,
  expiry_date,
  execution_certificate,
  completion_report,
  progress_report
  from applications
  join students on students.student_id = applications.student_id
  join users on students.user_id = users.user_id
  ${where}`

}

const selectComment = function (where){
  return ` select 
  comments,
  grade
  from reviews
  ${where}`
}

const selectApplicationAbbreviated = function (supervisor_id) {
  return `
  select 
      reviews.application_id,
      approval,
      first_name,
      last_name,
      email,
      company_name,
      create_date_ap
  from reviews
  join applications on applications.application_id = reviews.application_id   
  join students on students.student_id = applications.student_id
  join users on students.user_id = users.user_id
  where applications.supervisor_id = ${supervisor_id}`
}

const studentInfoPgQuery = `select students.student_id, students."location", students.date_of_birth, students.photo,  
users.email, users.user_name, users.first_name, users.last_name  from students join 
users on students.user_id = $1 and users.user_id = $1   `

const studentApplications = `SELECT a.application_id , a.student_id, a.supervisor_id, a.finalized,   a.create_date_ap, r.review_id , r.create_date_review , r.approval 
FROM applications a
LEFT JOIN reviews r ON a.application_id = r.application_id
WHERE a.student_id = $1;`

const getPassword = `SELECT u.pwd, u.user_id
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE student_id = $1;`

const savedPasswordPgQuery = `UPDATE users SET pwd = $2
 WHERE user_id = $1;` 

const getStudentIdForApplicationPgQuery  =  `SELECT student_id
FROM applications  
WHERE application_id  = $1;`

const deleteApplicationPgQuery  =  `DELETE FROM applications
 WHERE application_id = $1;`


const deleteReviewPgQuery  =  `DELETE FROM reviews
WHERE review_id = $1;` 

module.exports = {
    savedPhotoPgQuery: savedPhotoPgQuery,
    studentApplications:studentApplications,
    studentInfoPgQuery:studentInfoPgQuery,
    selectApplicationAbbreviated:selectApplicationAbbreviated,
    selectApplications:selectApplications,
    selectReview: selectReview,
    selectComment: selectComment,
    rolePgQuery: rolePgQuery,
    supervisorsPgQuery: supervisorsPgQuery,
    studentIdPgQuery: studentIdPgQuery,
    supervisorIdPgQuery: supervisorIdPgQuery,
    savedApplicationsPgQuery: savedApplicationsPgQuery,
    savedApplicationPgQuery: savedApplicationPgQuery,
    applicationUploadPgQuery: applicationUploadPgQuery,
    applicationUpdatePgQuery: applicationUpdatePgQuery,
    getPassword: getPassword,
    savedPasswordPgQuery: savedPasswordPgQuery,
    applicationPlusReviewUploadPgQuery: applicationPlusReviewUploadPgQuery,
    getStudentIdForApplicationPgQuery: getStudentIdForApplicationPgQuery,
    deleteApplicationPgQuery: deleteApplicationPgQuery,
    deleteReviewPgQuery: deleteReviewPgQuery
    
}