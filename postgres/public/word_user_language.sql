create table word_user_language
(
    association_id   integer   default nextval('word_associations_association_id_seq'::regclass) not null
        constraint word_associations_pkey
            primary key,
    word_id          integer                                                                     not null
        constraint word_associations_word_id_fkey
            references words
            on delete cascade,
    user_id          integer                                                                     not null
        constraint word_associations_user_id_fkey
            references users
            on delete cascade,
    language_id      integer                                                                     not null
        constraint word_associations_language_id_fkey
            references languages
            on delete cascade,
    proficiency_id   integer   default 0                                                         not null,
    created_at       timestamp default CURRENT_TIMESTAMP,
    last_reviewed_at timestamp default CURRENT_TIMESTAMP
);

alter table word_user_language
    owner to postgres;

