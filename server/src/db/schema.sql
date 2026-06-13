-- DROP TABLES

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS ticket_assignments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS ticket_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;

-- ENUMS

CREATE TYPE ticket_status AS ENUM (
    'UNASSIGNED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);

CREATE TYPE ticket_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);

-- ROLES

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- DEPARTMENTS

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- USERS

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role_id INTEGER NOT NULL,
    department_id INTEGER,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_users_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);

-- TICKET CATEGORIES

CREATE TABLE ticket_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_category_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);

-- TICKETS

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    description TEXT NOT NULL,

    status ticket_status NOT NULL DEFAULT 'UNASSIGNED',
    priority ticket_priority NOT NULL DEFAULT 'MEDIUM',

    category_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,

    assigned_to INTEGER,
    created_by INTEGER NOT NULL,

    ai_predicted_category INTEGER,
    ai_confidence_score NUMERIC(5,2),
    ai_analysis_status TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    sla_deadline TIMESTAMP,

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
        REFERENCES ticket_categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ticket_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ticket_assignee
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_ticket_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ticket_ai_category
        FOREIGN KEY (ai_predicted_category)
        REFERENCES ticket_categories(id)
        ON DELETE SET NULL
);

-- TICKET ASSIGNMENTS

CREATE TABLE ticket_assignments (
    id SERIAL PRIMARY KEY,

    ticket_id INTEGER NOT NULL,
    assigned_to INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,

    assigned_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_assignment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_assignment_assigned_by
        FOREIGN KEY (assigned_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

-- COMMENTS

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,

    content TEXT NOT NULL,

    ticket_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_comment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- REFRESH TOKENS

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- AUDIT LOGS

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,

    ticket_id INTEGER NOT NULL,
    action TEXT NOT NULL,

    performed_by INTEGER,
    metadata JSONB,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_audit_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (performed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- INDEXES

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_tickets_status
ON tickets(status);

CREATE INDEX idx_tickets_priority
ON tickets(priority);

CREATE INDEX idx_tickets_assigned_to
ON tickets(assigned_to);

CREATE INDEX idx_tickets_created_by
ON tickets(created_by);

CREATE INDEX idx_comments_ticket
ON comments(ticket_id);

CREATE INDEX idx_audit_ticket
ON audit_logs(ticket_id);

CREATE INDEX idx_refresh_tokens_user
ON refresh_tokens(user_id);

CREATE INDEX idx_ticket_assignments_ticket
ON ticket_assignments(ticket_id);