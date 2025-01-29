create function insert_user(_username character varying, _email character varying, _password character varying) returns text
    language plpgsql
as
$$
DECLARE
    email_exists BOOLEAN;
    username_exists BOOLEAN;
    new_user_id INTEGER;
BEGIN
    -- Check if the email already exists
    SELECT EXISTS (
        SELECT 1 FROM users WHERE email = _email
    ) INTO email_exists;

    IF email_exists THEN
        RAISE EXCEPTION 'Użytkownik o tym adresie email już istnieje.';
    END IF;

    -- Check if the username already exists
    SELECT EXISTS (
        SELECT 1 FROM users WHERE username = _username
    ) INTO username_exists;

    IF username_exists THEN
        RAISE EXCEPTION 'Użytkownik o tej nazwie już istnieje.';
    END IF;

    -- Insert the new user into the users table
    INSERT INTO users (username, email, password)
    VALUES (_username, _email, _password)
    RETURNING user_id INTO new_user_id;

    -- Insert the registration date into the registration_dates table
    INSERT INTO registration_dates (user_id, registered_at)
    VALUES (new_user_id, CURRENT_TIMESTAMP);

    RETURN 'Użytkownik został pomyślnie dodany.';
END;
$$;

alter function insert_user(varchar, varchar, varchar) owner to postgres;

