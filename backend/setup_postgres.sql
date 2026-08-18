-- PostgreSQL setup script for Jimi project
-- Run this with: psql -U postgres -f setup_postgres.sql

-- Create the database
CREATE DATABASE jimi_db;

-- Set password for postgres user
ALTER USER postgres WITH PASSWORD 'yassine';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE jimi_db TO postgres;

\c jimi_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;
