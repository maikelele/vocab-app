create view monthly_login_summary(login_day, login_count) as
WITH days_in_month AS (SELECT generate_series(date_trunc('month'::text, CURRENT_DATE::timestamp with time zone),
                                              date_trunc('month'::text, CURRENT_DATE::timestamp with time zone) +
                                              '1 mon'::interval - '1 day'::interval, '1 day'::interval) AS day)
SELECT d.day::date      AS login_day,
       count(l.user_id) AS login_count
FROM days_in_month d
         LEFT JOIN login_dates l ON d.day::date = l.logged_in_at::date
GROUP BY d.day
ORDER BY d.day;

alter table monthly_login_summary
    owner to postgres;

