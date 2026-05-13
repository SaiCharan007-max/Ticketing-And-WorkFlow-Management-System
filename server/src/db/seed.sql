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
('Hostel'),
('Academic'),
('Security'),
('Student Welfare');

-- =========================
-- USERS
-- =========================

-- Admin Users

INSERT INTO users (name, email, role_id, department_id)
VALUES
(
    'Mr. PadmaBhushan',
    'padma@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Dr. HimaBindu',
    'himabindu@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'Student Welfare')
),
(
    'Dr. Chenna Sai Charan',
    'saicharan@gmail.com',
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM departments WHERE name = 'Academic')
);

-- Staff Users

INSERT INTO users (name, email, role_id, department_id)
VALUES
(
    'IT Staff 1',
    'itstaff1@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'IT')
),
(
    'Hostel Staff 1',
    'hostelstaff@gmail.com',
    (SELECT id FROM roles WHERE name = 'staff'),
    (SELECT id FROM departments WHERE name = 'Hostel')
);

-- Normal Users (Students)

INSERT INTO users (name, email, role_id, department_id)
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
);