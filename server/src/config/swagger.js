import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDirectory = path.resolve(__dirname, "../routes");

const getRouteFiles = (directoryPath) => {
    const entries = fs.readdirSync(directoryPath, {
        withFileTypes: true
    });

    return entries.flatMap((entry) => {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
            return getRouteFiles(fullPath);
        }

        return fullPath.endsWith(".js")
            ? [fullPath]
            : [];
    });
};

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Ticketing Workflow API",
            version: "1.0.0",
            description:
                "Backend API documentation"
        },

        servers: [
            {
                url: "https://ticketing-and-workflow-management-system.onrender.com/"
            }
        ],

        tags: [
            {
                name: "Authentication",
                description: "Authentication and token management endpoints"
            },
            {
                name: "Tickets",
                description: "Ticket lifecycle, assignment, status, and SLA operations"
            },
            {
                name: "Comments",
                description: "Ticket comment management endpoints"
            },
            {
                name: "Users",
                description: "Staff administration and workload endpoints"
            },
            {
                name: "Departments",
                description: "Department administration and analytics endpoints"
            },
            {
                name: "Categories",
                description: "Ticket category administration endpoints"
            },
            {
                name: "Audit Logs",
                description: "Ticket history and audit trail endpoints"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                RegisterRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email"
                        },
                        password: {
                            type: "string",
                            minLength: 6
                        }
                    }
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email"
                        },
                        password: {
                            type: "string"
                        }
                    }
                },
                RefreshTokenRequest: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: {
                            type: "string"
                        }
                    }
                },
                AuthUser: {
                    type: "object",
                    required: ["id", "email", "role"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        role: {
                            type: "string",
                            enum: ["user", "staff", "admin"]
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Department: {
                    type: "object",
                    required: ["id", "name", "created_at", "updated_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        name: {
                            type: "string"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                CreateDepartmentRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string"
                        }
                    }
                },
                Category: {
                    type: "object",
                    required: ["id", "name", "department_id", "created_at", "updated_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        name: {
                            type: "string"
                        },
                        department_id: {
                            type: "integer"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                CategoryWithDepartment: {
                    allOf: [
                        {
                            $ref: "#/components/schemas/Category"
                        },
                        {
                            type: "object",
                            required: ["department_name"],
                            properties: {
                                department_name: {
                                    type: "string"
                                }
                            }
                        }
                    ]
                },
                CreateCategoryRequest: {
                    type: "object",
                    required: ["name", "departmentId"],
                    properties: {
                        name: {
                            type: "string"
                        },
                        departmentId: {
                            type: "integer"
                        }
                    }
                },
                CreatedStaff: {
                    type: "object",
                    required: ["id", "name", "email", "role_id", "department_id", "created_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        name: {
                            type: "string"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        role_id: {
                            type: "integer"
                        },
                        department_id: {
                            type: "integer"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                StaffSummary: {
                    type: "object",
                    required: ["id", "name", "email", "department", "created_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        name: {
                            type: "string"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        department: {
                            type: "string",
                            nullable: true
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                CreateStaffRequest: {
                    type: "object",
                    required: ["name", "email", "password", "departmentId"],
                    properties: {
                        name: {
                            type: "string"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        password: {
                            type: "string"
                        },
                        departmentId: {
                            type: "integer"
                        }
                    }
                },
                StaffDeleteResult: {
                    type: "object",
                    required: ["success"],
                    properties: {
                        success: {
                            type: "boolean"
                        }
                    }
                },
                Ticket: {
                    type: "object",
                    required: [
                        "id",
                        "title",
                        "description",
                        "status",
                        "priority",
                        "category_id",
                        "department_id",
                        "created_by",
                        "created_at",
                        "updated_at"
                    ],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        status: {
                            type: "string",
                            enum: ["UNASSIGNED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"]
                        },
                        priority: {
                            type: "string",
                            enum: ["LOW", "MEDIUM", "HIGH", "URGENT"]
                        },
                        category_id: {
                            type: "integer"
                        },
                        department_id: {
                            type: "integer"
                        },
                        assigned_to: {
                            type: "integer",
                            nullable: true
                        },
                        created_by: {
                            type: "integer"
                        },
                        ai_predicted_category: {
                            type: "integer",
                            nullable: true
                        },
                        ai_confidence_score: {
                            type: "number",
                            nullable: true
                        },
                        ai_analysis_status: {
                            type: "string",
                            nullable: true
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time"
                        },
                        sla_deadline: {
                            type: "string",
                            format: "date-time",
                            nullable: true
                        }
                    }
                },
                CreateTicketRequest: {
                    type: "object",
                    required: ["title", "description", "categoryId"],
                    properties: {
                        title: {
                            type: "string",
                            description: "Must be a non-empty string."
                        },
                        description: {
                            type: "string"
                        },
                        priority: {
                            type: "string",
                            enum: ["LOW", "MEDIUM", "HIGH", "URGENT"]
                        },
                        categoryId: {
                            type: "integer"
                        }
                    }
                },
                UpdateTicketStatusRequest: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["UNASSIGNED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"],
                            description: "Transition validity depends on the ticket's current status."
                        }
                    }
                },
                AssignTicketRequest: {
                    type: "object",
                    required: ["assignedTo"],
                    properties: {
                        assignedTo: {
                            type: "integer"
                        }
                    }
                },
                Comment: {
                    type: "object",
                    required: ["id", "content", "ticket_id", "created_by", "created_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        content: {
                            type: "string"
                        },
                        ticket_id: {
                            type: "integer"
                        },
                        created_by: {
                            type: "integer"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                CommentWithAuthor: {
                    allOf: [
                        {
                            $ref: "#/components/schemas/Comment"
                        },
                        {
                            type: "object",
                            required: ["created_by_name"],
                            properties: {
                                created_by_name: {
                                    type: "string"
                                }
                            }
                        }
                    ]
                },
                CreateCommentRequest: {
                    type: "object",
                    required: ["content"],
                    properties: {
                        content: {
                            type: "string"
                        }
                    }
                },
                AuditLog: {
                    type: "object",
                    required: ["id", "ticket_id", "action", "created_at"],
                    properties: {
                        id: {
                            type: "integer"
                        },
                        ticket_id: {
                            type: "integer"
                        },
                        action: {
                            type: "string",
                            enum: [
                                "TICKET_CREATED",
                                "TICKET_ASSIGNED",
                                "TICKET_REASSIGNED",
                                "STATUS_UPDATED",
                                "COMMENT_ADDED",
                                "SLA_ESCALATED",
                                "CRITICAL_SLA_BREACH"
                            ]
                        },
                        performed_by: {
                            type: "integer",
                            nullable: true
                        },
                        metadata: {
                            type: "object",
                            nullable: true,
                            additionalProperties: true,
                            description: "TODO: Metadata shape varies by audit action because it is stored as raw JSONB."
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                TicketAnalytics: {
                    type: "object",
                    required: [
                        "total_tickets",
                        "open_tickets",
                        "assigned_tickets",
                        "in_progress_tickets",
                        "resolved_tickets",
                        "closed_tickets"
                    ],
                    properties: {
                        total_tickets: {
                            type: "string"
                        },
                        open_tickets: {
                            type: "string"
                        },
                        assigned_tickets: {
                            type: "string"
                        },
                        in_progress_tickets: {
                            type: "string"
                        },
                        resolved_tickets: {
                            type: "string"
                        },
                        closed_tickets: {
                            type: "string"
                        }
                    }
                },
                DepartmentAnalyticsItem: {
                    type: "object",
                    required: ["department", "ticket_count"],
                    properties: {
                        department: {
                            type: "string"
                        },
                        ticket_count: {
                            type: "integer"
                        }
                    }
                },
                StaffWorkloadItem: {
                    type: "object",
                    required: ["staff_id", "staff_name", "active_tickets", "department"],
                    properties: {
                        staff_id: {
                            type: "integer"
                        },
                        staff_name: {
                            type: "string"
                        },
                        active_tickets: {
                            type: "integer"
                        },
                        department: {
                            type: "string",
                            nullable: true
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string"
                        }
                    }
                },
                ValidationErrorResponse: {
                    type: "object",
                    properties: {
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: {
                                        type: "string"
                                    },
                                    value: {},
                                    msg: {
                                        type: "string"
                                    },
                                    path: {
                                        type: "string"
                                    },
                                    location: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    apis: [
        ...getRouteFiles(routesDirectory)
    ]
};

const swaggerSpec =
    swaggerJsdoc(options);

export default swaggerSpec;
