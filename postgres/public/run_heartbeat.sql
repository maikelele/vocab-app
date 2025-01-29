create function run_heartbeat() returns void
    language plpgsql
as
$$
DECLARE
    schema_exists BOOLEAN;
    table_exists BOOLEAN;
BEGIN
    -- Check if schema exists
    SELECT EXISTS(
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name = 'tembo'
    ) INTO schema_exists;

    -- Create schema if it doesn't exist
    IF NOT schema_exists THEN
        EXECUTE 'CREATE SCHEMA tembo;';
    END IF;

    -- Check if table exists within tembo schema
    SELECT EXISTS(
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'tembo' AND table_name = 'heartbeat_table'
    ) INTO table_exists;

    -- Create table and index if they don't exist
    IF NOT table_exists THEN
        EXECUTE 'CREATE TABLE tembo.heartbeat_table (
            latest_heartbeat TIMESTAMP NOT NULL
        );';
        EXECUTE 'CREATE INDEX idx_heartbeat ON tembo.heartbeat_table (latest_heartbeat);';
    END IF;

    -- Insert current UTC timestamp into heartbeat_table
    EXECUTE 'INSERT INTO tembo.heartbeat_table (latest_heartbeat)
        VALUES (CURRENT_TIMESTAMP AT TIME ZONE ''UTC'');';

    -- Delete entries older than 7 days
    EXECUTE 'DELETE FROM tembo.heartbeat_table
        WHERE latest_heartbeat < (CURRENT_TIMESTAMP AT TIME ZONE ''UTC'' - INTERVAL ''7 days'');';

END;
$$;

alter function run_heartbeat() owner to postgres;

