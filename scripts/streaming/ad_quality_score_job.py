"""
Vottery Ad Quality Score – real-time stream job (PyFlink).
Consumes ad_events from Kafka, computes quality_delta (hooks vs hides/reports),
and sinks to ad_quality_metrics (Redis/Postgres) for the auction engine.

Weights: HOOK +1, HIDE -10, REPORT -50 (configurable).
Run: pyflink run ad_quality_score_job.py
"""

from pyflink.table import StreamTableEnvironment, EnvironmentSettings


def main():
    settings = EnvironmentSettings.new_instance().in_streaming_mode().build()
    t_env = StreamTableEnvironment.create(settings)

    # Input: ad events stream (Kafka)
    t_env.execute_sql("""
        CREATE TABLE ad_events (
            event_id STRING,
            ad_id STRING,
            user_id STRING,
            event_type STRING,
            slot_id STRING,
            ts TIMESTAMP(3),
            metadata STRING,
            WATERMARK FOR ts AS ts - INTERVAL '5' SECOND
        ) WITH (
            'connector' = 'kafka',
            'topic' = 'ad-event-stream',
            'properties.bootstrap.servers' = 'localhost:9092',
            'properties.group.id' = 'vottery-ad-quality',
            'format' = 'json',
            'scan.startup.mode' = 'latest-offset'
        )
    """)

    # Quality delta per ad per 1-minute window
    # Formula: (Hooks * 1) - (Hides * 10) - (Reports * 50)
    t_env.execute_sql("""
        CREATE VIEW ad_quality_calc AS
        SELECT
            ad_id,
            TUMBLE_START(ts, INTERVAL '1' MINUTE) AS window_start,
            COUNT(CASE WHEN event_type = 'VIEW_2S' OR event_type = 'HOOK' THEN 1 END) AS total_hooks,
            COUNT(CASE WHEN event_type = 'HIDE' THEN 1 END) AS total_hides,
            COUNT(CASE WHEN event_type = 'REPORT' THEN 1 END) AS total_reports,
            (COUNT(CASE WHEN event_type = 'VIEW_2S' OR event_type = 'HOOK' THEN 1 END) * 1.0)
                - (COUNT(CASE WHEN event_type = 'HIDE' THEN 1 END) * 10.0)
                - (COUNT(CASE WHEN event_type = 'REPORT' THEN 1 END) * 50.0) AS quality_delta
        FROM ad_events
        GROUP BY ad_id, TUMBLE(ts, INTERVAL '1' MINUTE)
    """)

    # Sink: JDBC to Postgres ad_quality_metrics (upsert by ad_id)
    # In production use upsert connector or Redis for low-latency reads
    t_env.execute_sql("""
        CREATE TABLE ad_quality_metrics_sink (
            ad_id STRING,
            window_start TIMESTAMP(3),
            quality_delta DOUBLE,
            PRIMARY KEY (ad_id) NOT ENFORCED
        ) WITH (
            'connector' = 'jdbc',
            'url' = 'jdbc:postgresql://localhost:5432/postgres',
            'table-name' = 'ad_quality_metrics',
            'username' = 'postgres',
            'password' = 'your_password',
            'sink.buffer-flush.max-rows' = '100',
            'sink.buffer-flush.interval' = '60s'
        )
    """)

    # For Redis sink you would use a custom UDF or another connector
    # Here we emit to a table that a separate job or API can read and merge into ad_quality_metrics
    t_env.execute_sql("""
        INSERT INTO ad_quality_metrics_sink
        SELECT ad_id, window_start, quality_delta FROM ad_quality_calc
    """)


if __name__ == "__main__":
    main()
