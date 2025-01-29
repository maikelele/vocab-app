create function count_reviews(_user_email text, _review_date date, _language_name text DEFAULT NULL::text) returns integer
    language plpgsql
as
$$
BEGIN
    RETURN COALESCE (
            (SELECT SUM(proficiency_id)
             FROM word_user_language AS wul
                      INNER JOIN users AS u ON wul.user_id = u.user_id
                      INNER JOIN languages AS l ON wul.language_id = l.language_id
             WHERE u.email = _user_email
               AND (_language_name IS NULL OR lower(l.language_name) = lower(_language_name))
               AND DATE(wul.last_reviewed_at) = _review_date),
           0
    );
END;
$$;

alter function count_reviews(text, date, text) owner to postgres;

