create function get_weakest_word(_email character varying, _language_name character varying)
    returns TABLE(word character varying, translation character varying)
    language plpgsql
as
$$
DECLARE
    _lang_id INTEGER;  -- ID języka
    _user_id INTEGER;  -- ID użytkownika
    not_reviewed_today BOOLEAN;  -- Czy wszystkie słówka (z wyjątkiem proficiency_id = 0) zostały dziś powtórzone
BEGIN
    -- Pobranie ID języka
    SELECT language_id INTO _lang_id
    FROM languages
    WHERE LOWER(language_name) = LOWER(TRIM(_language_name));

    IF _lang_id IS NULL THEN
        RETURN QUERY SELECT 'Brak języka'::CHARACTER VARYING, NULL::CHARACTER VARYING;
        RETURN;
    END IF;

    -- Pobranie ID użytkownika
    SELECT user_id INTO _user_id
    FROM users
    WHERE LOWER(email) = LOWER(TRIM(_email));

    IF _user_id IS NULL THEN
        RETURN QUERY SELECT 'Brak użytkownika'::CHARACTER VARYING, NULL::CHARACTER VARYING;
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM get_words_by_user_and_language(_email, _language_name)) THEN
        RETURN QUERY SELECT 'Brak słówek w danym języku'::CHARACTER VARYING, NULL::CHARACTER VARYING;
        RETURN;
    END IF;

    -- Sprawdzenie, czy wszystkie słówka (z wyjątkiem proficiency_id = 0) zostały powtórzone dzisiaj
    SELECT COUNT(last_reviewed_at) > 0
    INTO not_reviewed_today
    FROM word_user_language
    WHERE user_id = _user_id
      AND language_id = _lang_id
      AND (last_reviewed_at::DATE != CURRENT_DATE
       OR proficiency_id = 0)  -- Wyklucz słówka o zerowym poziomie opanowania
      AND last_reviewed_at IS NOT NULL ;

    -- Jeśli wszystkie istotne słówka zostały powtórzone, zwróć odpowiedni komunikat
    IF NOT not_reviewed_today THEN
        RETURN QUERY
            SELECT
                'Wszystkie słówka zostały już dzisiaj powtórzone'::VARCHAR,
                NULL::VARCHAR;
        RETURN;
    END IF;

    RETURN QUERY
        SELECT
            w.word,
            w.translation
        FROM word_user_language wul
                 JOIN words w ON wul.word_id = w.word_id
        WHERE wul.user_id = _user_id
          AND wul.language_id = _lang_id
          AND wul.proficiency_id = (
            SELECT MIN(proficiency_id)
            FROM word_user_language
            WHERE user_id = _user_id
              AND language_id = _lang_id
              AND last_reviewed_at IS NOT NULL
        )
          AND wul.last_reviewed_at = (
            SELECT MIN(last_reviewed_at)
            FROM word_user_language
            WHERE user_id = _user_id
              AND language_id = _lang_id
              AND proficiency_id = (
                SELECT MIN(proficiency_id)
                FROM word_user_language
                WHERE user_id = _user_id
                  AND language_id = _lang_id
                  AND last_reviewed_at IS NOT NULL
            )
        )
        LIMIT 1;

    -- Obsługa przypadku, gdy nie ma słówek do powtórzenia
    IF NOT FOUND THEN
        RETURN QUERY SELECT 'Brak słówek'::CHARACTER VARYING, NULL::CHARACTER VARYING;
    END IF;

    IF FOUND THEN
        insert into revision_dates(user_id, language_id, revised_at)
        values (_user_id, _lang_id, current_timestamp);
    end if;
END;
$$;

alter function get_weakest_word(varchar, varchar) owner to postgres;

