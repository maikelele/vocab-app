create function update_last_reviewed(_word character varying, _email character varying, _language character varying, succeeded boolean) returns text
    language plpgsql
as
$$
DECLARE
    _word_id INTEGER;
    _user_id INTEGER;
    _language_id INTEGER;
    _current_proficiency INTEGER;
BEGIN
    -- Get the word ID
    SELECT w.word_id INTO _word_id
    FROM words w
    WHERE LOWER(w.word) = LOWER(TRIM(_word));

    IF _word_id IS NULL THEN
        RETURN 'Word not found: ' || _word;
    END IF;

    -- Get the user ID
    SELECT u.user_id INTO _user_id
    FROM users u
    WHERE LOWER(u.email) = LOWER(TRIM(_email));

    IF _user_id IS NULL THEN
        RETURN 'User not found: ' || _email;
    END IF;

    -- Get the language ID
    SELECT l.language_id INTO _language_id
    FROM languages l
    WHERE LOWER(l.language_name) = LOWER(TRIM(_language));

    IF _language_id IS NULL THEN
        RETURN 'Language not found: ' || _language;
    END IF;

    -- Get the current proficiency level
    SELECT proficiency_id INTO _current_proficiency
    FROM word_user_language
    WHERE word_id = _word_id
      AND user_id = _user_id
      AND language_id = _language_id;

    IF _current_proficiency IS NULL THEN
        RETURN 'No matching record found for proficiency adjustment.';
    END IF;

    -- Update proficiency based on succeeded argument
    IF succeeded THEN
        UPDATE word_user_language
        SET proficiency_id = LEAST(_current_proficiency + 1, 5) -- Maximum level is 5
        WHERE word_id = _word_id
          AND user_id = _user_id
          AND language_id = _language_id;
    ELSE
        UPDATE word_user_language
        SET proficiency_id = GREATEST(_current_proficiency - 1, 0) -- Minimum level is 0
        WHERE word_id = _word_id
          AND user_id = _user_id
          AND language_id = _language_id;
    END IF;

    -- Update the last_reviewed_at timestamp
    UPDATE word_user_language
    SET last_reviewed_at = CURRENT_TIMESTAMP
    WHERE word_id = _word_id
      AND user_id = _user_id
      AND language_id = _language_id;

    RETURN 'Proficiency level and last reviewed timestamp updated successfully.';
END;
$$;

alter function update_last_reviewed(varchar, varchar, varchar, boolean) owner to postgres;

