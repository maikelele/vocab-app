create function delete_word_by_user_and_language(_user_email character varying, _word character varying, _language character varying) returns text
    language plpgsql
as
$$
DECLARE
    _user_id INTEGER;
    _word_id INTEGER;
    _language_id INTEGER;
BEGIN
    -- Get the user ID based on email
    SELECT user_id INTO _user_id
    FROM users
    WHERE LOWER(email) = LOWER(TRIM(_user_email));

    IF _user_id IS NULL THEN
        RETURN 'Error: User not found';
    END IF;

    -- Get the word ID based on the word
    SELECT word_id INTO _word_id
    FROM words
    WHERE LOWER(word) = LOWER(TRIM(_word));

    IF _word_id IS NULL THEN
        RETURN 'Error: Word not found';
    END IF;

    SELECT language_id into _language_id
    from languages
        where lower(language_name) = lower(trim(_language));

    if _word_id is null then
        return 'Error: Word not found';
    end if;

    -- Delete the association for the given user and word
    DELETE FROM word_user_language
    WHERE user_id = _user_id
      AND word_id = _word_id
        And language_id = _language_id ;

    IF NOT FOUND THEN
        RETURN 'Error: Word not associated with the user';
    END IF;

    RETURN 'Success: Word deleted for the user';
END;
$$;

alter function delete_word_by_user_and_language(varchar, varchar, varchar) owner to postgres;

