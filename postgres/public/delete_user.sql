create function delete_user(_email character varying) returns text
    language plpgsql
as
$$
BEGIN
    DELETE FROM users
    WHERE email = _email;

    IF NOT FOUND THEN
        RETURN 'Nie znaleziono użytkownika';
    END IF;

    RETURN 'Usunięto użytkownika';
END;
$$;

alter function delete_user(varchar) owner to postgres;

