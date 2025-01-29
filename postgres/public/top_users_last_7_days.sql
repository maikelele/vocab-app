create view top_users_last_7_days(username, total_proficiency) as
SELECT u.username,
       sum(wul.proficiency_id) AS total_proficiency
FROM word_user_language wul
         JOIN users u ON wul.user_id = u.user_id
WHERE wul.last_reviewed_at >= (CURRENT_DATE - '7 days'::interval)
GROUP BY u.user_id, u.email
ORDER BY (sum(wul.proficiency_id)) DESC
LIMIT 5;

alter table top_users_last_7_days
    owner to postgres;

