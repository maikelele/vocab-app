create table revision_dates
(
    revision_date_id serial
        primary key,
    user_id          integer                             not null
        references users
            on delete cascade,
    language_id      integer                             not null
        references languages
            on delete cascade,
    revised_at       timestamp default CURRENT_TIMESTAMP not null
);

alter table revision_dates
    owner to postgres;

