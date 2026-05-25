-- =========================
-- ROLES
-- =========================

INSERT INTO roles (name)
VALUES
('admin'),
('staff'),
('user');

-- =========================
-- DEPARTMENTS
-- =========================

INSERT INTO departments (name)
VALUES
('IT'),
('Finance'),
('Hostel'),
('Academic'),
('Security'),
('Student Welfare');

-- =========================
-- TICKET CATEGORIES
-- =========================

INSERT INTO ticket_categories (name, department_id)
VALUES
(
    'Wifi Issue',
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Portal Login Problem',
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Fee Payment',
    (SELECT id FROM departments WHERE name = 'Finance')
),
(
    'Hostel Cleaning',
    (SELECT id FROM departments WHERE name = 'Hostel')
),
(
    'Attendance Issue',
    (SELECT id FROM departments WHERE name = 'Academic')
),
(
    'Security Complaint',
    (SELECT id FROM departments WHERE name = 'Security')
),
(
    'Scholarship Issue',
    (SELECT id FROM departments WHERE name = 'Student Welfare')
);

-- =========================
-- USERS
-- =========================

-- Admin Users

INSERT INTO users (
    name,
    email,
    role_id,
    department_id
)
VALUES
(
    'Admin IT',
    'adminit@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Admin Academic',
    'adminacademic@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'Academic')
),
(
    'Admin Finance',
    'adminfinance@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'Finance')
);

-- =========================
-- STAFF USERS
-- =========================

INSERT INTO users (
    name,
    email,
    role_id,
    department_id
)
VALUES
(
    'IT Staff 1',
    'itstaff1@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'IT Staff 2',
    'itstaff2@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Finance Staff 1',
    'financestaff1@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'Finance')
),
(
    'Hostel Staff 1',
    'hostelstaff1@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'Hostel')
),
(
    'Academic Staff 1',
    'academicstaff1@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'Academic')
);

-- =========================
-- NORMAL USERS / STUDENTS
-- =========================

INSERT INTO users (
    name,
    email,
    role_id,
    department_id
)
VALUES
(
    'Student 1',
    'student1@gmail.com',
    (SELECT id FROM roles WHERE name = 'user'),
    NULL
),
(
    'Student 2',
    'student2@gmail.com',
    (SELECT id FROM roles WHERE name = 'user'),
    NULL
),
(
    'Student 3',
    'student3@gmail.com',
    (SELECT id FROM roles WHERE name = 'user'),
    NULL
);

-- =========================
-- SAMPLE TICKETS
-- =========================

INSERT INTO tickets (
    title,
    description,
    status,
    priority,
    category_id,
    department_id,
    assigned_to,
    created_by,
    ai_predicted_category_id,
    ai_confidence_score,
    ai_analysis_status
)
VALUES
(
    'Wifi not working in hostel',
    'Unable to connect to institute wifi since morning',
    'ASSIGNED',
    'HIGH',
    (SELECT id FROM ticket_categories WHERE name = 'Wifi Issue'),
    (SELECT id FROM departments WHERE name = 'IT'),
    (
        SELECT id FROM users
        WHERE email = 'itstaff1@gmail.com'
    ),
    (
        SELECT id FROM users
        WHERE email = 'student1@gmail.com'
    ),
    (SELECT id FROM ticket_categories WHERE name = 'Wifi Issue'),
    96.50,
    'COMPLETED'
),
(
    'Fee receipt not generated',
    'Payment completed but receipt missing',
    'UNASSIGNED',
    'MEDIUM',
    (SELECT id FROM ticket_categories WHERE name = 'Fee Payment'),
    (SELECT id FROM departments WHERE name = 'Finance'),
    NULL,
    (
        SELECT id FROM users
        WHERE email = 'student2@gmail.com'
    ),
    (SELECT id FROM ticket_categories WHERE name = 'Fee Payment'),
    89.20,
    'COMPLETED'
);

-- =========================
-- ASSIGNMENT HISTORY
-- =========================

INSERT INTO ticket_assignments (
    ticket_id,
    assigned_to,
    assigned_by
)
VALUES
(
    1,
    (
        SELECT id FROM users
        WHERE email = 'itstaff1@gmail.com'
    ),
    (
        SELECT id FROM users
        WHERE email = 'adminit@gmail.com'
    )
);

-- =========================
-- AUDIT LOGS
-- =========================

INSERT INTO audit_logs (
    ticket_id,
    action,
    performed_by,
    metadata
)
VALUES
(
    1,
    'TICKET_CREATED',
    (
        SELECT id FROM users
        WHERE email = 'student1@gmail.com'
    ),
    jsonb_build_object(
        'priority', 'HIGH',
        'status', 'ASSIGNED'
    )
),
(
    1,
    'TICKET_ASSIGNED',
    (
        SELECT id FROM users
        WHERE email = 'adminit@gmail.com'
    ),
    jsonb_build_object(
        'assigned_to', 'IT Staff 1'
    )
),
(
    2,
    'TICKET_CREATED',
    (
        SELECT id FROM users
        WHERE email = 'student2@gmail.com'
    ),
    jsonb_build_object(
        'priority', 'MEDIUM',
        'status', 'UNASSIGNED'
    )
);