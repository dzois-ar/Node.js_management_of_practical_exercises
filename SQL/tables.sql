create table users(
	user_id SERIAL primary key, 
	pwd VARCHAR (255), 
	email VARCHAR(255),
	user_name VARCHAR(255),
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	create_at TIMESTAMP default current_timestamp
);


create table students(
	student_id SERIAL primary key, 
	"location" VARCHAR (255), 
	date_of_birth TIMESTAMP,
	user_id INT,
	foreign key (user_id) references users(user_id),
	photo TEXT
);

create table supervisors (
	supervisor_id SERIAL primary key, 
	user_id INT,
	foreign key (user_id) references users(user_id),
	"position" VARCHAR(200)
);

create table applications (
	application_id SERIAL primary key, 
	student_id INT,
	foreign key (student_id) references students(student_id),
	supervisor_id INT,
	foreign key (supervisor_id) references supervisors(supervisor_id),
	finalized BOOLEAN,
	company_name text,
	duration VARCHAR (200),
	employment VARCHAR (200),
	start_date TIMESTAMP,
	expiry_date  TIMESTAMP,
	execution_certificate text,
	completion_report text,
	progress_report text,
	create_date_ap TIMESTAMP default current_timestamp
);

create table reviews (
	review_id SERIAL primary key, 
	 grade INT,
	 "comments" text,
	 approval BOOLEAN,
	 application_id INT,
	 foreign key (application_id) references applications(application_id),
	 create_date_review TIMESTAMP default current_timestamp
);
create table questions (
	question_id SERIAL primary key, 
	 question TEXT	
);