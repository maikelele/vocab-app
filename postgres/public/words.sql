create table words
(
    word_id     serial
        primary key,
    word        varchar(100) not null
        constraint words_word_check
            check ((word)::text <> ''::text),
    translation varchar(100) not null
        constraint words_translation_check
            check ((translation)::text <> ''::text)
);

alter table words
    owner to postgres;

