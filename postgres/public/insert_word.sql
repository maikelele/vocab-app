create function insert_word(_word character varying, _translation character varying, _user_email character varying, _language_name character varying DEFAULT 'Not provided'::character varying) returns text
    language plpgsql
as
$$
DECLARE
    lang_id INTEGER;
    _user_id INTEGER;
    _word_id INTEGER;
    normalized_word VARCHAR;
    normalized_translation VARCHAR;
    word_exists BOOLEAN;
    association_exists BOOLEAN;
BEGIN
    -- Normalize the input data
    normalized_word := LOWER(TRIM(_word));
    normalized_translation := LOWER(TRIM(_translation));

    IF normalized_word = '' OR normalized_translation = '' THEN
        RETURN 'Word or translation cannot be empty';
    END IF;

    -- Get the language ID or create it if it does not exist
    SELECT language_id INTO lang_id
    FROM languages WHERE LOWER(TRIM(language_name)) = LOWER(TRIM(_language_name));

    IF lang_id IS NULL THEN
        INSERT INTO languages (language_name)
        VALUES (TRIM(_language_name))
        RETURNING language_id INTO lang_id;
    END IF;

    -- Get the user ID from email
    SELECT users.user_id INTO _user_id
    FROM users WHERE LOWER(email) = LOWER(_user_email);

    IF _user_id IS NULL THEN
        RETURN 'User not found: ' || _user_email;
    END IF;

    -- Check if the word already exists in the `words` table
    SELECT word_id INTO _word_id
    FROM words
    WHERE LOWER(word) = normalized_word
      AND LOWER(translation) = normalized_translation;

    IF _word_id IS NULL THEN
        -- Insert the word into the `words` table if it does not exist
        INSERT INTO words (word, translation)
        VALUES (normalized_word,normalized_translation)
        RETURNING word_id INTO _word_id;
    END IF;

    -- Check if the relationship already exists in the `word_user_language` table
    SELECT EXISTS (
        SELECT 1
        FROM word_user_language
        WHERE word_id = _word_id
          AND user_id = _user_id
          AND language_id = lang_id
    ) INTO association_exists;

    IF association_exists THEN
        RETURN 'To słówko zostało już wcześniej dodane';
    END IF;

    -- Insert the relationship into the `word_user_language` table
    INSERT INTO word_user_language (word_id, user_id, language_id)
    VALUES (_word_id, _user_id, lang_id);

    RETURN 'Pomyślne dodano słówko';
END;
$$;

alter function insert_word(varchar, varchar, varchar, varchar) owner to postgres;

