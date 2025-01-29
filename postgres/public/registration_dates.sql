create table registration_dates
(
    user_id       integer                             not null
        primary key
        references users
            on delete cascade,
    registered_at timestamp default CURRENT_TIMESTAMP not null
);

alter table registration_dates
    owner to postgres;

