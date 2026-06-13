-- ROLES

INSERT INTO roles(id, name)
VALUES
(1, 'admin'),
(2, 'staff'),
(3, 'user');

-- DEPARTMENTS

INSERT INTO departments (id, name)
VALUES
(1, 'IT'),
(2, 'HR'),
(3, 'FINANCE'),
(4, 'OPERATIONS'),
(5, 'CUSTOMER_SUPPORT');

-- TICKET CATEGORIES

INSERT INTO ticket_categories (
    id,
    name,
    department_id
)
VALUES
(1, 'Software Bug', 1),
(2, 'Network Issue', 1),
(3, 'Access Request', 1),

(4, 'Leave Request', 2),
(5, 'Payroll Issue', 2),

(6, 'Invoice Issue', 3),
(7, 'Expense Claim', 3),

(8, 'Asset Request', 4),
(9, 'Maintenance', 4),

(10, 'Customer Complaint', 5),
(11, 'Customer Query', 5);