create view monthly_registration_summary(registration_day, registration_count) as
WITH days_in_month AS (SELECT generate_series(date_trunc('month'::text, CURRENT_DATE::timestamp with time zone),
                                              date_trunc('month'::text, CURRENT_DATE::timestamp with time zone) +
                                              '1 mon'::interval - '1 day'::interval, '1 day'::interval) AS day)
SELECT d.day::date      AS registration_day,
       count(r.user_id) AS registration_count
FROM days_in_month d
         LEFT JOIN registration_dates r ON d.day::date = r.registered_at::date
GROUP BY d.day
ORDER BY d.day;

alter table monthly_registration_summary
    owner to postgres;

