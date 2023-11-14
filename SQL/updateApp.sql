create or replace procedure updateApp(
  student_id_input int,
  supervisor_id_input int,
  company_name_input text,
  duration_input varchar(200),
  employment_input varchar(200),
  start_date_input timestamp,
  expiry_date_input timestamp,
  finalized_input bool,
  execution_certificate_input text,
  completion_report_input text,
  progress_report_input text,
  application_id_input int
)
language plpgsql
as $$
begin 

update applications set
    student_id = student_id_input,
    supervisor_id = supervisor_id_input,
    company_name = company_name_input,
    duration = duration_input,
    employment = employment_input,
    start_date = start_date_input,
    expiry_date = expiry_date_input,
    finalized = finalized_input,
    execution_certificate = case when execution_certificate_input is not null then execution_certificate_input else execution_certificate end,
    completion_report = case when completion_report_input is not null then completion_report_input else completion_report end,
    progress_report = case when progress_report_input is not null then progress_report_input else progress_report end
where application_id = application_id_input;

insert into reviews (application_id) values (application_id_input);

   commit;
end;$$

