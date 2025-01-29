create table users
(
    user_id  serial
        primary key,
    username varchar(50)  not null,
    email    varchar(100) not null
        unique,
    password varchar(255) not null,
    is_admin boolean default false
);

alter table users
    owner to postgres;

