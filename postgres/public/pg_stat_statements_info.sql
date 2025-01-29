create view pg_stat_statements_info(dealloc, stats_reset) as
SELECT dealloc,
       stats_reset
FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset);

alter table pg_stat_statements_info
    owner to postgres;

grant select on pg_stat_statements_info to public;

create function pg_stat_statements_info(out dealloc bigint, out stats_reset timestamp with time zone) returns record
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function pg_stat_statements_info(out bigint, out timestamp with time zone) owner to postgres;

