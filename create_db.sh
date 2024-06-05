#!/bin/bash

# Define the database name
DB_NAME="sqlite.db"

# Create the database file
sqlite3 $DB_NAME <<EOF

-- Create the users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create the bookmarks table
CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the sessions table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY NOT NULL,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

EOF

echo "Database $DB_NAME created with schema."
