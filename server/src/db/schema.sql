-- =========================
-- DROP OLD TABLES
-- =========================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS ticket_assignments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS ticket_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;

-- =========================
-- ENUM TYPES
-- =========================

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

-- =========================
-- ROLES
-- =========================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- =========================
-- DEPARTMENTS
-- =========================

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- =========================
-- TICKET CATEGORIES
-- =========================

CREATE TABLE ticket_categories (
    id SERIAL PRIMARY KEY,

    name TEXT UNIQUE NOT NULL,

    department_id INT NOT NULL
    REFERENCES departments(id)
    ON DELETE CASCADE
);

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,

    role_id INT NOT NULL
    REFERENCES roles(id),

    department_id INT
    REFERENCES departments(id),

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- TICKETS
-- =========================

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    description TEXT,

    status ticket_status NOT NULL DEFAULT 'UNASSIGNED',

    priority ticket_priority NOT NULL DEFAULT 'MEDIUM',

    category_id INT NOT NULL
    REFERENCES ticket_categories(id),

    department_id INT NOT NULL
    REFERENCES departments(id),

    assigned_to INT
    REFERENCES users(id),

    created_by INT NOT NULL
    REFERENCES users(id),

    -- AI/NLP fields

    ai_predicted_category_id INT
    REFERENCES ticket_categories(id),

    ai_confidence_score NUMERIC(5,2),

    ai_analysis_status TEXT DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK (
        ai_confidence_score IS NULL
        OR (
            ai_confidence_score >= 0
            AND ai_confidence_score <= 100
        )
    )
);

-- =========================
-- TICKET ASSIGNMENT HISTORY
-- =========================

CREATE TABLE ticket_assignments (
    id SERIAL PRIMARY KEY,

    ticket_id INT NOT NULL
    REFERENCES tickets(id)
    ON DELETE CASCADE,

    assigned_to INT NOT NULL
    REFERENCES users(id),

    assigned_by INT
    REFERENCES users(id),

    assigned_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- AUDIT LOGS
-- =========================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,

    ticket_id INT NOT NULL
    REFERENCES tickets(id)
    ON DELETE CASCADE,

    action TEXT NOT NULL,

    performed_by INT
    REFERENCES users(id),

    metadata JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_tickets_status
ON tickets(status);

CREATE INDEX idx_tickets_department
ON tickets(department_id);

CREATE INDEX idx_tickets_assigned_to
ON tickets(assigned_to);

CREATE INDEX idx_tickets_category
ON tickets(category_id);

CREATE INDEX idx_ticket_assignments_ticket
ON ticket_assignments(ticket_id);

CREATE INDEX idx_ticket_assignments_user
ON ticket_assignments(assigned_to);

CREATE INDEX idx_audit_logs_ticket
ON audit_logs(ticket_id);