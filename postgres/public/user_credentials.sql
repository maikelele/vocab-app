create table user_credentials
(
    id         serial
        primary key,
    email      varchar(255)                                           not null
        unique,
    password   varchar(255)                                           not null,
    created_at timestamp    default CURRENT_TIMESTAMP,
    updated_at timestamp    default CURRENT_TIMESTAMP,
    username   varchar(255) default 'default_user'::character varying not null
);

alter table user_credentials
    owner to postgres;

