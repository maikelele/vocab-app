create view monthly_revision_summary(revision_day, revision_count) as
WITH days_in_month AS (SELECT generate_series(date_trunc('month'::text, CURRENT_DATE::timestamp with time zone),
                                              date_trunc('month'::text, CURRENT_DATE::timestamp with time zone) +
                                              '1 mon'::interval - '1 day'::interval, '1 day'::interval) AS day)
SELECT d.day::date               AS revision_day,
       count(r.revision_date_id) AS revision_count
FROM days_in_month d
         LEFT JOIN revision_dates r ON d.day::date = r.revised_at::date
GROUP BY d.day
ORDER BY d.day;

alter table monthly_revision_summary
    owner to postgres;

