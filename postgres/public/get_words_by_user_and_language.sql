create function get_words_by_user_and_language(_user_email character varying, _language_name character varying)
    returns TABLE(word character varying, translation character varying, proficiency integer, last_reviewed timestamp without time zone)
    language plpgsql
as
$$
DECLARE
    _lang_id INTEGER;
    _user_id INTEGER;
BEGIN
    -- Get the language ID
    SELECT language_id INTO _lang_id
    FROM languages
    WHERE LOWER(language_name) = LOWER(TRIM(_language_name));

    IF _lang_id IS NULL THEN
        RAISE EXCEPTION 'Nie znaleziono języka';
    END IF;

    SELECT user_id INTO _user_id
    FROM users
    WHERE LOWER(email) = LOWER(TRIM(_user_email));

    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Nie znaleziono użytkownika';
    END IF;

    RETURN QUERY
        SELECT
            w.word,
            w.translation,
            wul.proficiency_id AS proficiency,
            wul.last_reviewed_at AS last_reviewed
        FROM word_user_language wul
                 JOIN words w ON wul.word_id = w.word_id
        WHERE wul.user_id = _user_id
          AND wul.language_id = _lang_id;

    -- If no rows are returned by the above query, handle the "no words" case
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Brak słówek';
    END IF;
END;
$$;

alter function get_words_by_user_and_language(varchar, varchar) owner to postgres;

