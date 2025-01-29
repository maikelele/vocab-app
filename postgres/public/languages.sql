create table languages
(
    language_id   serial
        primary key,
    language_name varchar(100) not null
        unique
);

alter table languages
    owner to postgres;

