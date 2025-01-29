create view user_summary(user_id, username, user_email, registration_date, total_word_count) as
SELECT u.user_id,
       u.username,
       u.email                        AS user_email,
       r.registered_at::character(10) AS registration_date,
       count(wul.word_id)             AS total_word_count
FROM users u
         LEFT JOIN registration_dates r ON u.user_id = r.user_id
         LEFT JOIN word_user_language wul ON u.user_id = wul.user_id
GROUP BY u.user_id, u.username, u.email, r.registered_at
ORDER BY u.username;

alter table user_summary
    owner to postgres;

