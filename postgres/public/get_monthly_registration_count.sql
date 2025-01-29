create function get_monthly_registration_count() returns integer
    language plpgsql
as
$$
DECLARE
    registration_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO registration_count
    FROM registration_dates
    WHERE EXTRACT(YEAR FROM registered_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM registered_at) = EXTRACT(MONTH FROM CURRENT_DATE);

    RETURN registration_count;
END;
$$;

alter function get_monthly_registration_count() owner to postgres;

