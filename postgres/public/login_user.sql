create function login_user(_email character varying, _password character varying)
    returns TABLE(user_id integer, username character varying, email character varying, is_admin boolean)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
        SELECT u.user_id, u.username, u.email, u.is_admin
        FROM users u
        WHERE u.email = _email AND u.password = _password;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nieprawidłowe dane logowania';
    END IF;

    insert into login_dates(user_id, logged_in_at)
    values (
            (SELECT users.user_id from users where users.email = _email and users.password = _password),
            current_timestamp
           );
END;
$$;

alter function login_user(varchar, varchar) owner to postgres;

