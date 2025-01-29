create view pg_stat_statements
            (userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time,
             mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time,
             stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written,
             local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written,
             blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes,
             jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count,
             jit_optimization_time, jit_emission_count, jit_emission_time)
as
SELECT userid,
       dbid,
       toplevel,
       queryid,
       query,
       plans,
       total_plan_time,
       min_plan_time,
       max_plan_time,
       mean_plan_time,
       stddev_plan_time,
       calls,
       total_exec_time,
       min_exec_time,
       max_exec_time,
       mean_exec_time,
       stddev_exec_time,
       rows,
       shared_blks_hit,
       shared_blks_read,
       shared_blks_dirtied,
       shared_blks_written,
       local_blks_hit,
       local_blks_read,
       local_blks_dirtied,
       local_blks_written,
       temp_blks_read,
       temp_blks_written,
       blk_read_time,
       blk_write_time,
       temp_blk_read_time,
       temp_blk_write_time,
       wal_records,
       wal_fpi,
       wal_bytes,
       jit_functions,
       jit_generation_time,
       jit_inlining_count,
       jit_inlining_time,
       jit_optimization_count,
       jit_optimization_time,
       jit_emission_count,
       jit_emission_time
FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time,
                                                 min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls,
                                                 total_exec_time, min_exec_time, max_exec_time, mean_exec_time,
                                                 stddev_exec_time, rows, shared_blks_hit, shared_blks_read,
                                                 shared_blks_dirtied, shared_blks_written, local_blks_hit,
                                                 local_blks_read, local_blks_dirtied, local_blks_written,
                                                 temp_blks_read, temp_blks_written, blk_read_time, blk_write_time,
                                                 temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi,
                                                 wal_bytes, jit_functions, jit_generation_time, jit_inlining_count,
                                                 jit_inlining_time, jit_optimization_count, jit_optimization_time,
                                                 jit_emission_count, jit_emission_time);

alter table pg_stat_statements
    owner to postgres;

grant select on pg_stat_statements to public;

create function pg_stat_statements(showtext boolean, out userid oid, out dbid oid, out toplevel boolean, out queryid bigint, out query text, out plans bigint, out total_plan_time double precision, out min_plan_time double precision, out max_plan_time double precision, out mean_plan_time double precision, out stddev_plan_time double precision, out calls bigint, out total_exec_time double precision, out min_exec_time double precision, out max_exec_time double precision, out mean_exec_time double precision, out stddev_exec_time double precision, out rows bigint, out shared_blks_hit bigint, out shared_blks_read bigint, out shared_blks_dirtied bigint, out shared_blks_written bigint, out local_blks_hit bigint, out local_blks_read bigint, out local_blks_dirtied bigint, out local_blks_written bigint, out temp_blks_read bigint, out temp_blks_written bigint, out blk_read_time double precision, out blk_write_time double precision, out temp_blk_read_time double precision, out temp_blk_write_time double precision, out wal_records bigint, out wal_fpi bigint, out wal_bytes numeric, out jit_functions bigint, out jit_generation_time double precision, out jit_inlining_count bigint, out jit_inlining_time double precision, out jit_optimization_count bigint, out jit_optimization_time double precision, out jit_emission_count bigint, out jit_emission_time double precision) returns setof setof record
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;

$$;

alter function pg_stat_statements(boolean, out oid, out oid, out boolean, out bigint, out text, out bigint, out double precision, out double precision, out double precision, out double precision, out double precision, out bigint, out double precision, out double precision, out double precision, out double precision, out double precision, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out bigint, out double precision, out double precision, out double precision, out double precision, out bigint, out bigint, out numeric, out bigint, out double precision, out bigint, out double precision, out bigint, out double precision, out bigint, out double precision) owner to postgres;

