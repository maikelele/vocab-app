create table login_dates
(
    login_date_id serial
        primary key,
    user_id       integer                             not null
        references users
            on delete cascade,
    logged_in_at  timestamp default CURRENT_TIMESTAMP not null
);

alter table login_dates
    owner to postgres;

