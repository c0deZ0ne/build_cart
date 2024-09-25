
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/login-with-sso": {
        "post": {
          "operationId": "AuthController_loginWithSSO",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginWithSSODto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/user/register": {
        "post": {
          "operationId": "UserController_createUser",
          "summary": "Create a new user email",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/register-user-with-sso": {
        "post": {
          "operationId": "UserController_createUserWithSSO",
          "summary": "Create a new user email",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/verify-email": {
        "patch": {
          "operationId": "UserController_verifyEmail",
          "summary": "Verify email with otp",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VerifyEmailDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/verify-email-and-create-builder": {
        "patch": {
          "operationId": "UserController_verifyEmailAndCreateBuilder",
          "summary": "Verify email with otp",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VerifyEmailDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/account-details": {
        "get": {
          "operationId": "UserController_accountDetails",
          "summary": "Get User Account details",
          "parameters": [
            {
              "name": "email",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/request-email-otp/{email}": {
        "post": {
          "operationId": "UserController_requestOtp",
          "summary": "Request email otp",
          "parameters": [
            {
              "name": "email",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              },
              "example": "joshua@abc.com"
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/reset-password": {
        "patch": {
          "operationId": "UserController_resetPassword",
          "summary": "Reset password with otp",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResetPasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/request-reset-password/{email}": {
        "post": {
          "operationId": "UserController_requestResetPassword",
          "summary": "Request password reset otp",
          "parameters": [
            {
              "name": "email",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              },
              "example": "joshua@abc.com"
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/activate-user": {
        "patch": {
          "operationId": "UserController_activateUser",
          "summary": "Activate team member with otp",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ActivateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ]
        }
      },
      "/user/password": {
        "patch": {
          "operationId": "UserController_updatePassword",
          "summary": "Change user password",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user/profile": {
        "patch": {
          "operationId": "UserController_updateProfile",
          "summary": "Update user profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin": {
        "get": {
          "operationId": "AdminController_getAdminStatistics",
          "summary": "Get all Admin Dashboard Statistics",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/role": {
        "post": {
          "operationId": "AdminRolesController_createRole",
          "summary": "create a system role",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRoleDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Role"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/roles": {
        "get": {
          "operationId": "AdminRolesController_getAllSystemRoles",
          "summary": "get all system roles",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Role"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/payment/{vend_token}/approve": {
        "get": {
          "operationId": "AdminControllerPayment_confirmPayment",
          "summary": "admin approve payment for a contract",
          "parameters": [
            {
              "name": "vend_token",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/blog/create": {
        "post": {
          "operationId": "BlogController_CreateBlog",
          "summary": "Create Blog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/blog/{id}": {
        "patch": {
          "operationId": "BlogController_updateSingleBlog",
          "summary": "Update Blog by Id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBlogDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BlogController_deleteSingleBlog",
          "summary": "Delete Blog by Id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/projects": {
        "get": {
          "operationId": "AdminProjectController_createRole",
          "summary": "get all projects ",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Project"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/project/{projectId}": {
        "get": {
          "operationId": "AdminProjectController_adminGetProjectDetails",
          "summary": "get details of projects ",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/contract": {
        "get": {
          "operationId": "ContractController_getContracts",
          "summary": "Retrieve contracts",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/contract/{id}": {
        "get": {
          "operationId": "ContractController_getContractById",
          "summary": "Retrieve details of a contract",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Contract"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/contract/{id}/disburse": {
        "patch": {
          "operationId": "ContractController_disburseContractPayment",
          "summary": "Disburse payment for a contract",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/disputes": {
        "get": {
          "operationId": "DisputeController_getAllDisputes",
          "summary": "Retrieve all disputes",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Dispute"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/dispute/{id}": {
        "get": {
          "operationId": "DisputeController_getDisputeById",
          "summary": "Retrieve disputes by Id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dispute"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/dispute/{id}/resolve": {
        "patch": {
          "operationId": "DisputeController_resolveDispute",
          "summary": "Resolve Dispute",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/dispute/{id}/refund": {
        "patch": {
          "operationId": "DisputeController_refund",
          "summary": "Refund Dispute",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/all/invites": {
        "get": {
          "operationId": "InvitationController_getAllInvitations",
          "summary": "Get all system invitations",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Invitation"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/pricelist": {
        "get": {
          "operationId": "PriceController_getPriceLists",
          "summary": "Retrieve contracts",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/PriceList"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ]
        }
      },
      "/admin/pricelist/update": {
        "patch": {
          "operationId": "PriceController_priceList",
          "summary": "Update Price List",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/UpdatePriceListDto"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/rfq": {
        "get": {
          "operationId": "RfqController_getAllRfq",
          "summary": "Get all RFQs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/rfq/{id}": {
        "get": {
          "operationId": "RfqController_getRequestDetails",
          "summary": "Get RFQ details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/rfq/{id}/bid": {
        "get": {
          "operationId": "RfqController_getBidsForRequest",
          "summary": "Retrieve bids for RFQ",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/bid/{id}": {
        "get": {
          "operationId": "RfqController_getRfqQuoteByIdForUser",
          "summary": "Get Bid details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqQuote"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/fundManager": {
        "get": {
          "operationId": "SponsorController_getAllUsers",
          "summary": "Return all fundManagers",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/FundManager"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "SponsorController_registerSponsor",
          "summary": "Register a fundManager",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterFundManagerDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/fundManager/invite/builder": {
        "post": {
          "operationId": "SponsorController_createInvite",
          "summary": "Invite a Builder to the platform",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateInvitationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/fundManager/invites/{FundManagerId}": {
        "get": {
          "operationId": "SponsorController_getAllInvitationsByFundManagerId",
          "summary": "Get all fundManager invitations",
          "parameters": [
            {
              "name": "FundManagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Invitation"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/projects/{projectId}": {
        "get": {
          "operationId": "SponsorController_getProjectById",
          "summary": "get project details from admin panel",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "SponsorController_updateProject",
          "summary": "update project from admin panel",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/fundManager/{email}/customers": {
        "get": {
          "operationId": "SponsorController_getSponsorCustomers",
          "summary": "admin get fundManager customers",
          "parameters": [
            {
              "name": "email",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/projects/share": {
        "post": {
          "operationId": "SponsorController_shareProjectForUser",
          "summary": "share a project with anyone from admin panel",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/adminShareProjectDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SharedProject"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/projects/create": {
        "post": {
          "operationId": "SponsorController_createSponsorProject",
          "summary": "create a project for fundManager or a builder admin panel",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminCreateProject"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/projects/{fundManagerId}/{builderId}": {
        "get": {
          "operationId": "SponsorController_projectsDetails",
          "summary": "admin fundManager-builder project list",
          "parameters": [
            {
              "name": "fundManagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/buyers": {
        "get": {
          "operationId": "AdminBuilderController_getAllUsers",
          "summary": "Return all buyers",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/builder": {
        "post": {
          "operationId": "AdminBuilderController_registerBuilder",
          "summary": "Register a Builder",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminCreateBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/builder/{builderId}/enable": {
        "patch": {
          "operationId": "AdminBuilderController_approveCredit",
          "summary": "approve a Builder for credit ",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Builder"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/builder/{builderId}/disable": {
        "patch": {
          "operationId": "AdminBuilderController_disableCredit",
          "summary": "disable a Builder for credit ",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Builder"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/builder/{userId}/activate": {
        "patch": {
          "operationId": "AdminBuilderController_adminActivateUser",
          "summary": "activate user account ",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/builder/{userId}/deactivate": {
        "patch": {
          "operationId": "AdminBuilderController_adminDeactivateUser",
          "summary": "deactivate user account ",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/vendors": {
        "get": {
          "operationId": "AdminVendorController_getAllUsers",
          "summary": "Return all vendors",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/vendor": {
        "post": {
          "operationId": "AdminVendorController_registerBuilder",
          "summary": "Register a new vendor",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminRegisterVendorDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/vendor/{vendorId}": {
        "patch": {
          "operationId": "AdminVendorController_updateVendorDetails",
          "summary": "Update vendor details",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUpdateVendorProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "AdminVendorController_getVendorDetails",
          "summary": "get vendor details",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/vendor/{userId}/activate": {
        "patch": {
          "operationId": "AdminVendorController_adminActivateUser",
          "summary": "activate vendor account ",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/vendor/{userId}/deactivate": {
        "patch": {
          "operationId": "AdminVendorController_adminDeactivateUser",
          "summary": "deactivate vendor account ",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/ticket": {
        "get": {
          "operationId": "TicketController_getTickets",
          "summary": "Retrieve tickets",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Ticket"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/ticket/{id}": {
        "get": {
          "operationId": "TicketController_getTicketById",
          "summary": "Retrieve details of a ticket",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Ticket"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/ticket/{id}/process": {
        "patch": {
          "operationId": "TicketController_processTicket",
          "summary": "Process a ticket",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/ticket/{id}/resolve": {
        "patch": {
          "operationId": "TicketController_resolveTicket",
          "summary": "Resolve a ticket",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/transaction/refunds": {
        "get": {
          "operationId": "TransactionController_getAllRefunds",
          "summary": "Retrieve all refunds",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Dispute"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user": {
        "get": {
          "operationId": "UserController_getAllUsers",
          "summary": "Retrieve all users",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/{userId}/delete": {
        "delete": {
          "operationId": "UserController_deleteUser",
          "summary": "delete a user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/{id}": {
        "get": {
          "operationId": "UserController_getUserById",
          "summary": "Retrieve user details by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/{id}/password": {
        "patch": {
          "operationId": "UserController_updateUserPassword",
          "summary": "Change user password",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUpdatePasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/builder/{builderId}": {
        "patch": {
          "operationId": "UserController_updateBuilderDetails",
          "summary": "Update builder details",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUpdateBuilderProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/{id}/activate": {
        "patch": {
          "operationId": "UserController_adminactivateUser",
          "summary": "activate user account ",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/user/{id}/deactivate": {
        "patch": {
          "operationId": "UserController_adminDeactivateUser",
          "summary": "deactivate user account ",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "admin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/register": {
        "post": {
          "operationId": "BuilderController_register",
          "summary": "Register builder",
          "parameters": [
            {
              "name": "invitationId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/register-builder-with-sso": {
        "post": {
          "operationId": "BuilderController_registerBuilderWithSSO",
          "summary": "Register builder with sso",
          "parameters": [
            {
              "name": "sso_user",
              "required": true,
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendors": {
        "get": {
          "operationId": "BuilderController_fetchAllVendors",
          "summary": "Retrieves all vendors",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for vendors. Searches in fields: businessName, location, VendorType.",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendors/{vendorId}/vendor-products": {
        "get": {
          "operationId": "BuilderController_getVendorProductsByID",
          "summary": "Get vendor products by vendor Id",
          "parameters": [
            {
              "name": "searchParam",
              "required": false,
              "in": "query",
              "example": "cement",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/send-invite": {
        "post": {
          "operationId": "BuilderController_sendPlatformInviite",
          "summary": "Send invite to a vendor",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InvitationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/bank": {
        "post": {
          "operationId": "BuilderController_createBankAccount",
          "summary": "Add Bank details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBankAccountDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            },
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/overview": {
        "get": {
          "operationId": "BuilderController_overview",
          "summary": "Get builder overview",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            },
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/balance-summary": {
        "get": {
          "operationId": "BuilderController_balanceSummary",
          "summary": "Get builder balance summary",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            },
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/overview/project/cost": {
        "get": {
          "operationId": "BuilderController_projectCostOverview",
          "summary": "Get builder project cost",
          "parameters": [
            {
              "name": "dateFilter",
              "required": false,
              "in": "query",
              "example": 7,
              "description": "total amount of days you want to fetch by",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            },
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project": {
        "post": {
          "operationId": "BuilderProjectController_createProject",
          "summary": "Create a project",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BuilderCreateProjectDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/projects": {
        "get": {
          "operationId": "BuilderProjectController_getAllProjects",
          "summary": "company projects",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for Project. Searches in fields: Project title, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{id}": {
        "patch": {
          "operationId": "BuilderProjectController_updateProjectTitle",
          "summary": "Update project title",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{id}/update": {
        "patch": {
          "operationId": "BuilderProjectController_updateProject",
          "summary": "Update project details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{projectId}/details": {
        "get": {
          "operationId": "BuilderProjectController_getProjectDetails",
          "summary": "get project details",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{projectId}/complete": {
        "get": {
          "operationId": "BuilderProjectController_moveToCompletedProject",
          "summary": "move project to completed if no ongoing or pending activities",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/statistics": {
        "get": {
          "operationId": "BuilderProjectController_getCompanyProjectStatistics",
          "summary": "get project statistics",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/invitation-listing": {
        "get": {
          "operationId": "BuilderProjectController_getProjectInvitations",
          "summary": "All Project Invitations listing",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/doc-tender": {
        "post": {
          "operationId": "BuilderProjectController_bid",
          "summary": "Bid on a project",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenderBidDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Tender response for project bid by builder",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Promise"
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TenderBidDto"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/submitted-tenders": {
        "get": {
          "operationId": "BuilderProjectController_builderSubmitted",
          "summary": "Get all project bids submitted",
          "parameters": [],
          "responses": {
            "200": {
              "description": "get submitted bids by user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Promise"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/accepted-tenders": {
        "get": {
          "operationId": "BuilderProjectController_builderAcceptedBid",
          "summary": "Get accepted project bids ",
          "parameters": [],
          "responses": {
            "200": {
              "description": "get accepted tenders ",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Promise"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{bidId}/tender-view": {
        "get": {
          "operationId": "BuilderProjectController_tenderDetails",
          "summary": "view bid details invitations-listings",
          "parameters": [
            {
              "name": "bidId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "get accepted tenders ",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Promise"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project-invitation/{tenderId}/remove": {
        "delete": {
          "operationId": "BuilderProjectController_deleteProjectInvitation",
          "summary": "Remove Project Invitations",
          "parameters": [
            {
              "name": "tenderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/{projectId}/rfq": {
        "get": {
          "operationId": "BuilderProjectController_getRequestsForProject",
          "summary": "Retrieve RFQs for project",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for rfq. Searches in fields:  title ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqRequest"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/material-schedule-upload": {
        "post": {
          "operationId": "BuilderMaterialController_uploadFile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "CSV or Excel file to upload from downloaded material schedule template",
            "content": {
              "multipart/form-data": {
                "schema": {
                  "$ref": "#/components/schemas/UploadFileDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/material-schedule/{projectId}": {
        "get": {
          "operationId": "BuilderMaterialController_getProjectMaterialSchedule",
          "summary": "projects material schedule",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for Project. Searches in fields: Project title, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/MaterialSchedule"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/tenders": {
        "get": {
          "operationId": "BuilderTenderController_getTenders",
          "summary": "get all ongoing tenders",
          "description": "this Api get ongoing tenders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Get tenders  by fund managers and status ongoing",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Promise"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/project/media": {
        "post": {
          "operationId": "ProjectMediaController_createRfqRequest",
          "summary": "add media to project ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddProjectMediaDTO"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "ProjectMediaController_getProjectMediaType",
          "summary": "Retrieve project media by userType (FILE,VIDEO, IMAGE) for project ef24e74c-2303-469c-a296-ee5be9624fd2",
          "parameters": [
            {
              "name": "VIDEO",
              "required": false,
              "in": "query",
              "example": "VIDEO",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "FILE",
              "required": false,
              "in": "query",
              "example": "FILE",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "IMAGE",
              "required": false,
              "in": "query",
              "example": "IMAGE",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "projectId",
              "required": true,
              "in": "query",
              "example": "bb2b959d-b3f8-4818-8e49-85d6b3179ccd",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProjectMedia"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/item": {
        "get": {
          "operationId": "BuilderRfqController_fetchItems",
          "summary": "Retrieves all rfq items",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqItem"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq": {
        "post": {
          "operationId": "BuilderRfqController_createRfqRequest",
          "summary": "Request for Quote",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRfqRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/{rfqRequestId}/add-schedule": {
        "patch": {
          "operationId": "BuilderRfqController_addScheduleToRequest",
          "summary": "Request for Quote",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RfqRequestDeliveryScheduleDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/{rfqRequestId}": {
        "get": {
          "operationId": "BuilderRfqController_getBidsForRequest",
          "summary": "Retrieve bids for request",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/{rfqRequestId}/viewbid": {
        "get": {
          "operationId": "BuilderRfqController_getRequestMaterials",
          "summary": "Retrieve all bids for request",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Rfq view Details",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RFQMaterialDetailsDto"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/{rfqQuoteId}/accept-bid": {
        "patch": {
          "operationId": "BuilderRfqController_acceptBid",
          "summary": "Accept rfq bid and create order ",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Contract"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/{orderId}/decline": {
        "patch": {
          "operationId": "BuilderRfqController_declineBid",
          "summary": "Decline rfq bid and reopen rfq  ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/rfq/bargain": {
        "post": {
          "operationId": "BuilderRfqController_BargainRfqForBuilder",
          "summary": "Bargain for quote",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRfqBargainDTO"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqBargain"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/supplier/all": {
        "get": {
          "operationId": "BuilderRfqController_async",
          "summary": "all vendors and grouped categories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/fund-account": {
        "post": {
          "operationId": "BuilderWalletController_fundWallet",
          "summary": "fund account",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FundWalletDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/transaction/history": {
        "get": {
          "operationId": "BuilderTransactionController_createProject",
          "summary": "get account transactions history",
          "parameters": [
            {
              "name": "transaction_type",
              "required": true,
              "in": "query",
              "example": "inflow",
              "examples": {
                "INFLOW": {
                  "summary": "Paused status example",
                  "value": "inflow"
                },
                "OUTFLOW": {
                  "summary": "Active status example",
                  "value": "outflow"
                }
              },
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "start_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "end_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "search_param",
              "required": false,
              "in": "query",
              "example": "10000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 10,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/UserTransaction"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/order/{rfqRequestId}": {
        "get": {
          "operationId": "BuilderOrderController_getOrder",
          "summary": "get orders for rfq request",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Sample response on success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BuilderRfqOrderDto"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/orders": {
        "get": {
          "operationId": "BuilderOrderController_getAllOrders",
          "summary": "get all builder orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/orders/dashboard": {
        "get": {
          "operationId": "BuilderOrderController_getOrdersDashboard",
          "summary": "get order Dashboard for ongoing and completed orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/order/{orderId}/pay": {
        "patch": {
          "operationId": "BuilderOrderController_payWithWalletFund",
          "summary": "pay with account wallet fund ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/order/{orderId}/otp": {
        "get": {
          "operationId": "BuilderOrderController_generateOrderOtp",
          "summary": "generate OTP to confirming delivery ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/order/confirm-delivery": {
        "post": {
          "operationId": "BuilderOrderController_confirmOrderDelivery",
          "summary": "confirm delivery with generated otp ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmDeliveryDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Order"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/order/{contractId}/rate-order": {
        "post": {
          "operationId": "BuilderOrderController_rateandReviewVendor",
          "summary": "rate and review vendor order ",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RateReviewVendorDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/{contractId}/open-dispute": {
        "post": {
          "operationId": "BuilderOrderController_openDisputedOnOrder",
          "summary": "opens a  dispute on order",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateDisputeDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/disputed-orders": {
        "get": {
          "operationId": "BuilderOrderController_disputedOrders",
          "summary": "Retrieves all disputed orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/profile": {
        "get": {
          "operationId": "ProfileController_getBuilderById",
          "summary": "Get builder profile details",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "ProfileController_updateProfile",
          "summary": "Update builder profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBuilderProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/account/security-update": {
        "patch": {
          "operationId": "ProfileController_securityUpdate",
          "summary": "update your security details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SecurityUpdateDTO"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/account/security": {
        "get": {
          "operationId": "ProfileController_getUserDetails",
          "summary": "Get user details",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/{provider}/paytoken/{contractId}": {
        "get": {
          "operationId": "BuilderPaymentController_getPayToken",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "provider",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/bani/payment-confirm": {
        "post": {
          "operationId": "BuilderPaymentController_confirmPayment",
          "summary": "confrim payment by bani",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BaniVerifyPaymentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/paystack/{reference}": {
        "post": {
          "operationId": "BuilderPaymentController_PayforContractWithPaystackReference",
          "summary": "confirm paystack payment",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaystackVerifyPaymentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/wallet/{fundManagerId}": {
        "post": {
          "operationId": "BuilderPaymentController_paywithSponsorWallet",
          "summary": "Pay for rfq with allocated fund",
          "parameters": [
            {
              "name": "fundManagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PayforContratcwithWalletDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/cutstruct/payment-request": {
        "post": {
          "operationId": "BuilderPaymentController_CutstructConfirmPaymentRquest",
          "summary": "request for aprove payment for cutstruct payment",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CutstructPayDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendor/my": {
        "get": {
          "operationId": "BuilderVendorController_getMyVendors",
          "summary": "Retrieve my vendors",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for vendors. Searches in fields: businessName, location, VendorType.",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendor/{id}": {
        "get": {
          "operationId": "BuilderVendorController_getVendorById",
          "summary": "Retrieve vendor details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "BuilderVendorController_addVendorToMyVendors",
          "summary": "Add vendor to my vendors",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendor/my/{id}": {
        "get": {
          "operationId": "BuilderVendorController_getmyVendorById",
          "summary": "Retrieve my vendor details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/vendor/category/{category}": {
        "get": {
          "operationId": "BuilderVendorController_fetchVendorsForCategory",
          "summary": "Retrieve vendors by category",
          "parameters": [
            {
              "name": "category",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/VendorRfqCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/my/fundmanagers": {
        "get": {
          "operationId": "BuilderFundManagerController_fetchAllMyFundManagers",
          "summary": "Retrieves all builder fundmanagers",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for fundmanagers. Searches in fields: businessName, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "BuilderFundManagerController_addToMyFundManagers",
          "summary": "Add fundmanagers to builder profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddFundManagersToBuilderDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/BuilderFundManager"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/fundmanagers/send-invite": {
        "post": {
          "operationId": "BuilderFundManagerController_sendPlatformInviite",
          "summary": "Send invite to a fundmanager",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FundmanagerPlatformInvitation"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/fundmanager-projects": {
        "get": {
          "operationId": "BuilderFundManagerController_getFundManagersProjects",
          "summary": "get all fundmanager projects",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "query",
              "description": "Search query for fundmanagers projects ",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for fundmanagers. Searches in fields: project title, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/fundmanager-profile": {
        "get": {
          "operationId": "BuilderFundManagerController_getFundManagersDetails",
          "summary": "get fundmanager details",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "query",
              "description": "Search query for fundmanagers projects ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/builder/fundmanager/project": {
        "get": {
          "operationId": "BuilderFundManagerController_getProjectDetails",
          "summary": "gets fundmanager project details",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "query",
              "description": "unique identifier for the project",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-group/create": {
        "post": {
          "operationId": "ProjectGroupController_createProjectGroup",
          "summary": "Create a new project group",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateGroupNameDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GroupName"
                  }
                }
              }
            }
          },
          "tags": [
            "project-group"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-group": {
        "get": {
          "operationId": "ProjectGroupController_getProjectGroups",
          "summary": "Get project groups of a users",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/GroupName"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "project-group"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares": {
        "post": {
          "operationId": "ProjectSharesController_create",
          "summary": "Create Project Shares",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProjectSharesDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Project Shares created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectShares"
                  }
                }
              }
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares/me": {
        "get": {
          "operationId": "ProjectSharesController_getMySharedProjects",
          "summary": "get Project Shared with me",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "201": {
              "description": "Project Shares  successfully gotten",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectShares"
                  }
                }
              }
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares/invites/me": {
        "get": {
          "operationId": "ProjectSharesController_getInvites",
          "summary": "get Project Shared with me",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "201": {
              "description": "Project Shares  successfully gotten",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseProjectInviteDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares/{sharedId}/accept": {
        "patch": {
          "operationId": "ProjectSharesController_update",
          "summary": "Accept Project Shares",
          "parameters": [
            {
              "name": "sharedId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Project Shares updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectShares"
                  }
                }
              }
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares/{id}": {
        "get": {
          "operationId": "ProjectSharesController_findOne",
          "summary": "Get Project Shares by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Project Shares retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectShares"
                  }
                }
              }
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/project-shares/{sharedId}": {
        "delete": {
          "operationId": "ProjectSharesController_remove",
          "summary": "decline Project Shares by ID",
          "parameters": [
            {
              "name": "sharedId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "204": {
              "description": "Project Shares declined successfully"
            }
          },
          "tags": [
            "Project Shares"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/rfq/category": {
        "get": {
          "operationId": "RfqController_fetchCategories",
          "summary": "Retrieves all rfq categories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "rfq"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/rfq/item": {
        "get": {
          "operationId": "RfqController_fetchItems",
          "summary": "Retrieves all rfq items",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqItem"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "rfq"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/materials/upload-file": {
        "post": {
          "operationId": "MaterialController_uploadFile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "CSV or Excel file to upload",
            "content": {
              "multipart/form-data": {
                "schema": {
                  "$ref": "#/components/schemas/UploadFileDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/vendor": {
        "post": {
          "operationId": "VendorController_register",
          "summary": "Register a vendor",
          "parameters": [
            {
              "name": "invitationId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterVendorDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Vendor"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ]
        }
      },
      "/vendor/create-vendor": {
        "post": {
          "operationId": "VendorController_createVendor",
          "summary": "Register Vendor from Retail Market Place",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterVendorFromMarketDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ]
        }
      },
      "/vendor/bank": {
        "post": {
          "operationId": "VendorController_createBankAccount",
          "summary": "Add Bank details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBankAccountDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/documents": {
        "post": {
          "operationId": "VendorController_uploadDocuments",
          "summary": "Upload required documents",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UploadDocumentsDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/rfq/request": {
        "get": {
          "operationId": "RfqController_getRfqs",
          "summary": "get rfq material requests",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for vendors. Searches in fields: builder name, item name, paymentType.",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqRequest"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/rfq/{rfqMaterialRequestId}": {
        "get": {
          "operationId": "RfqController_viewMaterialRequest",
          "summary": "view material request details",
          "parameters": [
            {
              "name": "rfqMaterialRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequestMaterial"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/submitted": {
        "get": {
          "operationId": "RfqController_getSubmittedRfq",
          "summary": "bidboard submitted RFQ requests",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for vendors. Searches in fields: builder name, item name, paymentType.",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/rfq-bargain/{rfqQuoteId}/enable": {
        "patch": {
          "operationId": "RfqController_BargainRfqForBuilder",
          "summary": " enable Bargain for quote",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqQuote"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/rfq-bargain/{rfqQuoteId}/disable": {
        "patch": {
          "operationId": "RfqController_disableBuilderBargain",
          "summary": "Disable Builder bargaining",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqQuote"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/rfq/close": {
        "post": {
          "operationId": "RfqController_blackListRfq",
          "summary": "close/blacklist RFQ requests",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateVendorRfqBlacklistDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VendorRfqBlacklist"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/saved": {
        "get": {
          "operationId": "RfqController_getSavedRfqForVendor",
          "summary": "Retrieve saved RFQ requests",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqRequest"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/{id}": {
        "get": {
          "operationId": "RfqController_getRequestDetails",
          "summary": "Get details and all materials of an RFQ request",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/{id}/save": {
        "post": {
          "operationId": "RfqController_saveRfqRequestForVendor",
          "summary": "Save an RFQ request",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/{rfqQuoteId}/cancel": {
        "post": {
          "operationId": "RfqController_cancelBid",
          "summary": "Cancel Quote",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/bargain": {
        "post": {
          "operationId": "RfqController_BargainRfqForVendor",
          "summary": "Vendor Bargain for rfqMaterial",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VendorAcceptRfqOrBargainDTO"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqBargain"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/rfq/{rfqQuoteId}": {
        "get": {
          "operationId": "RfqController_getQuote",
          "summary": "fetches a Quote details",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqQuote"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract": {
        "get": {
          "operationId": "ContractController_getContracts",
          "summary": "Retrieve contracts",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/ongoing-transaction": {
        "get": {
          "operationId": "VendorOrderController_ongoingTransaction",
          "summary": "bidboard ongoing transaction",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/completed-orders": {
        "get": {
          "operationId": "VendorOrderController_completedOrders",
          "summary": "Retrieves all completed orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract/{contractId}/comfirm-delivery/{deliveryScheduleId}": {
        "post": {
          "operationId": "VendorOrderController_confirmOrderDelivery",
          "summary": "Confirms order delivery",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "deliveryScheduleId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeliveryConfirmationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/purchase-orders": {
        "get": {
          "operationId": "VendorOrderController_purchaseOrders",
          "summary": "Retrieves all purchase orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/unfulfilled-orders": {
        "get": {
          "operationId": "VendorOrderController_unFulfilledOrders",
          "summary": "Retrieves all unfulfilled orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/active-orders": {
        "get": {
          "operationId": "VendorOrderController_activeOrders",
          "summary": "Retrieves all active orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/disputed-orders": {
        "get": {
          "operationId": "VendorOrderController_disputedOrders",
          "summary": "Retrieves all disputed orders",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/{contractId}/open-dispute": {
        "post": {
          "operationId": "VendorOrderController_openDisputedOnOrder",
          "summary": "opens a  dispute on order",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateDisputeDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/bidboard/{contractId}/rate-order": {
        "post": {
          "operationId": "VendorOrderController_rateOrder",
          "summary": "vendor rates a order",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RateReviewBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract/{id}": {
        "get": {
          "operationId": "ContractController_getContractDetailsByIdForUser",
          "summary": "Retrieve contract details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Contract"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract/{id}/cancel": {
        "patch": {
          "operationId": "ContractController_cancelContract",
          "summary": "Cancel contract",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract/{contractId}/dispatch/{deliveryScheduleId}": {
        "patch": {
          "operationId": "ContractController_dispatchContract",
          "summary": "Dispatch contract",
          "parameters": [
            {
              "name": "contractId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "deliveryScheduleId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DispatchDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/DeliverySchedule"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/contract/{id}/accept-contract": {
        "patch": {
          "operationId": "ContractController_acceptContract",
          "summary": "Accept Contract",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/transaction/history": {
        "get": {
          "operationId": "VendorTransactionController_getTransactions",
          "summary": "get account transactions history",
          "parameters": [
            {
              "name": "transaction_type",
              "required": true,
              "in": "query",
              "example": "inflow, outflow, all",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "start_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "end_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "search_param",
              "required": false,
              "in": "query",
              "example": "10000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 10,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/transaction/account-details": {
        "get": {
          "operationId": "VendorTransactionController_walletDetails",
          "summary": "get account transaction details",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/transaction/fund-withdrawal": {
        "patch": {
          "operationId": "VendorTransactionController_withdrawFromWallet",
          "summary": "Please request funds less than or equal to your account balance  account ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RequestPayment"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/account/profile": {
        "get": {
          "operationId": "AccountController_getVendorProfile",
          "summary": "Get vendor profile details",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "AccountController_updateVendorProfile",
          "summary": "Update vendor profile details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateVendorProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/dashboard/overview": {
        "get": {
          "operationId": "AccountController_getVendorDashboardOverview",
          "summary": "Get dashboard profile overview",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/security-update": {
        "patch": {
          "operationId": "AccountController_securityUpdate",
          "summary": "update your security details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SecurityUpdateDTO"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/account/security": {
        "get": {
          "operationId": "AccountController_getUserDetails",
          "summary": "Get user details",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/account/bank": {
        "get": {
          "operationId": "AccountController_getBankDetails",
          "summary": "Get bank details",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Bank"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "AccountController_updateBankAccount",
          "summary": "Update bank details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBankAccountDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/account/document": {
        "patch": {
          "operationId": "AccountController_updateDocument",
          "summary": "Update vendor document details",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateVendorDocuments"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/category/add": {
        "post": {
          "operationId": "AccountController_updateCategory",
          "summary": "bulk add category list to your account",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateVendorCategoryDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/{categoryId}/add": {
        "put": {
          "operationId": "AccountController_addSingleCategory",
          "summary": "add single category to vendor list of categories",
          "parameters": [
            {
              "name": "categoryId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VendorRfqCategory"
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/category/delete": {
        "delete": {
          "operationId": "AccountController_bulkRemoveCategory",
          "summary": "bulk remove category from a vendor list of categories",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateVendorCategoryDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/VendorRfqCategory"
                    }
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/{categoryId}/delete": {
        "delete": {
          "operationId": "AccountController_removeCategory",
          "summary": "remove category from a vendor list of categories",
          "parameters": [
            {
              "name": "categoryId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VendorRfqCategory"
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/earning": {
        "get": {
          "operationId": "EarningController_getEarnings",
          "summary": "Retrieve earnings",
          "parameters": [
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "example": "2023-05-01",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "example": "2023-05-01",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/confirmations": {
        "get": {
          "operationId": "KycConfirmationsController_getDocumentConfirmed",
          "summary": "Retrieve KYC confirmations",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/dashboard-summary": {
        "get": {
          "operationId": "DashboardController_getDashboardSummary",
          "summary": "get dashboard summary",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor/dashboard-summary/earnings": {
        "get": {
          "operationId": "DashboardController_getVendorEarnings",
          "summary": "get vendor earnings and withdrawals",
          "parameters": [
            {
              "name": "number_of_previous_days",
              "required": false,
              "in": "query",
              "example": "7",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/bank": {
        "get": {
          "operationId": "BankController_getAllBanks",
          "summary": "Retrieves all supported banks",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "bank"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/bank/resolve": {
        "post": {
          "operationId": "BankController_resolveBank",
          "summary": "Resolve an account",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResolveAccountDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "bank"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/temporary-vendor/create-vendor": {
        "post": {
          "operationId": "TemporaryVendorController_createVendor",
          "summary": "Create a new temporary vendor",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTemporaryVendorDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "temporary-vendors"
          ]
        }
      },
      "/product/create-product": {
        "post": {
          "operationId": "ProductController_createProduct",
          "summary": "Create a new product",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProductDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/{id}": {
        "get": {
          "operationId": "ProductController_getProductById",
          "summary": "find a product by its ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "af618e4e-4be4-44a3-8470-ffe765368428",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        },
        "patch": {
          "operationId": "ProductController_updateProductById",
          "summary": "update a product",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "649bb8cb-0fa4-4c85-a59f-b428d32ac945",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateProductDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        },
        "delete": {
          "operationId": "ProductController_deleteProductById",
          "summary": "delete a product by its ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "af618e4e-4be4-44a3-8470-ffe765368428",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product": {
        "get": {
          "operationId": "ProductController_getAllProducts",
          "summary": "find all products",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Product"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/search/product": {
        "get": {
          "operationId": "ProductController_search",
          "summary": "search for products by name",
          "parameters": [
            {
              "name": "name",
              "required": true,
              "in": "query",
              "example": "Coated",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Product"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/category/{id}": {
        "get": {
          "operationId": "ProductController_getProductsByCategory",
          "summary": "Get products by category",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "a365ede1-6df4-4afd-914a-810eacac7a9c",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Product"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/filter/{filter}": {
        "get": {
          "operationId": "ProductController_getProductsByFilter",
          "summary": "Get products by either featured/price-tracker/retail",
          "parameters": [
            {
              "name": "filter",
              "required": true,
              "in": "path",
              "example": "feature_product",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Product"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/create-specification/{id}": {
        "patch": {
          "operationId": "ProductController_createProductSpecification",
          "summary": "Add specification and prices to a product",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "649bb8cb-0fa4-4c85-a59f-b428d32ac945",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddSpecificationAndPriceToProductDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/update-price/{id}": {
        "patch": {
          "operationId": "ProductController_updatePriceOfProductSpecification",
          "summary": "Update the price of an existing product's specification",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "649bb8cb-0fa4-4c85-a59f-b428d32ac945",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddSpecificationAndPriceToProductDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "product"
          ]
        }
      },
      "/product/categories/create-category": {
        "post": {
          "operationId": "CategoryController_createCategory",
          "summary": "Create a new product category",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCategoryDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "product-categories"
          ]
        }
      },
      "/product/categories/get-categories": {
        "get": {
          "operationId": "CategoryController_getAllCategory",
          "summary": "Get all Categories",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-categories"
          ]
        }
      },
      "/product/categories/get-category/{id}": {
        "get": {
          "operationId": "CategoryController_getCategoryById",
          "summary": "Find a category by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "283cb63f-710f-46f7-a27b-9b678f33622f",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductCategory"
                  }
                }
              }
            }
          },
          "tags": [
            "product-categories"
          ]
        }
      },
      "/product/categories/update-category/{id}": {
        "patch": {
          "operationId": "CategoryController_updateCategory",
          "summary": "Update a category",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "e43c2fd9-20c0-4ec3-aa67-608ea0219a10",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCategoryDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-categories"
          ]
        }
      },
      "/product/categories/delete-category/{id}": {
        "delete": {
          "operationId": "CategoryController_deleteCategoryById",
          "summary": "Delete a category",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "e43c2fd9-20c0-4ec3-aa67-608ea0219a10",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "product-categories"
          ]
        }
      },
      "/product/metrics/create-metric": {
        "post": {
          "operationId": "MetricController_createMetric",
          "summary": "Create a new product metric",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateMetricDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductMetric"
                  }
                }
              }
            }
          },
          "tags": [
            "product-metrics"
          ]
        }
      },
      "/product/metrics/get-metrics": {
        "get": {
          "operationId": "MetricController_getAllCategory",
          "summary": "Get all Metrics",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductMetric"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-metrics"
          ]
        }
      },
      "/product/metrics/get-metric/{id}": {
        "get": {
          "operationId": "MetricController_getMetric",
          "summary": "Get a particular metric by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "65df572d-7201-4f4e-a3d2-902e8e6b86ca",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductMetric"
                  }
                }
              }
            }
          },
          "tags": [
            "product-metrics"
          ]
        }
      },
      "/product/metrics/update-metric/{id}": {
        "patch": {
          "operationId": "MetricController_updateMetric",
          "summary": "Update a metric",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "302c7816-029f-49ef-b428-5b4ea3e76bac",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateMetricDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductMetric"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-metrics"
          ]
        }
      },
      "/product/metrics/delete-metric/{id}": {
        "delete": {
          "operationId": "MetricController_deleteMetric",
          "summary": "Delete a metric",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "65df572d-7201-4f4e-a3d2-902e8e6b86ca",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "product-metrics"
          ]
        }
      },
      "/product/specification/create-specification": {
        "post": {
          "operationId": "SpecificationController_createSpecification",
          "summary": "Create a new specifications for products",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSpecificationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductSpecification"
                  }
                }
              }
            }
          },
          "tags": [
            "product-specification"
          ]
        }
      },
      "/product/specification/get-specifications": {
        "get": {
          "operationId": "SpecificationController_getAllSpecification",
          "summary": "Get all specifications",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductSpecification"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-specification"
          ]
        }
      },
      "/product/specification/get-specification/{id}": {
        "get": {
          "operationId": "SpecificationController_getSpecification",
          "summary": "Get a particular specification by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "b82407ed-318f-4d8f-93be-bf05d3652a86",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductSpecification"
                  }
                }
              }
            }
          },
          "tags": [
            "product-specification"
          ]
        }
      },
      "/product/specification/update-specification/{id}": {
        "patch": {
          "operationId": "SpecificationController_updateSpecification",
          "summary": "Update a specification",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "ca3fccbc-8a75-41f1-9015-a1275d169ae6",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateSpecificationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProductSpecification"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "product-specification"
          ]
        }
      },
      "/product/specification/delete-specification/{id}": {
        "delete": {
          "operationId": "SpecificationController_deleteSpecification",
          "summary": "Delete a specification",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "ca3fccbc-8a75-41f1-9015-a1275d169ae6",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "product-specification"
          ]
        }
      },
      "/team": {
        "post": {
          "operationId": "TeamController_addTeamMember",
          "summary": "Add a team member",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddTeamMemberDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "team"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/team/{teamId}": {
        "get": {
          "operationId": "TeamController_getTeamMembers",
          "summary": "Retrieve team members",
          "parameters": [
            {
              "name": "teamId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search_param",
              "required": false,
              "in": "query",
              "example": "johndoe@gmail.com",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": "100",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "team"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/team/{teamMemberUserId}/{teamId}": {
        "patch": {
          "operationId": "TeamController_updateTeamMember",
          "summary": "update a team member's details",
          "parameters": [
            {
              "name": "teamMemberUserId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "teamId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateTeamMemberDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "team"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/team/update-member-status/{teamId}/{teamMemberUserId}": {
        "patch": {
          "operationId": "TeamController_pauseOrUnpauseTeamMemberOperation",
          "summary": "Pause or unpause a team member's operation",
          "parameters": [
            {
              "name": "teamId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "status",
              "required": true,
              "in": "query",
              "example": "PAUSED",
              "examples": {
                "PAUSED": {
                  "summary": "Paused status example",
                  "value": "PAUSED"
                },
                "ACTIVE": {
                  "summary": "Active status example",
                  "value": "ACTIVE"
                }
              },
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "teamMemberUserId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "team"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/team/delete-team-member/{teamMemberUserId}/{teamId}": {
        "delete": {
          "operationId": "TeamController_deleteTeamMember",
          "summary": "Remove a Team member",
          "parameters": [
            {
              "name": "teamMemberUserId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "teamId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "team"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product": {
        "get": {
          "operationId": "VendorAndProductController_getVendorProducts",
          "summary": "Get vendor products",
          "parameters": [
            {
              "name": "searchParam",
              "required": false,
              "in": "query",
              "example": "cement",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/get-store": {
        "get": {
          "operationId": "VendorAndProductController_getVendorProductsForStore",
          "summary": "Get vendor products",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/add-products": {
        "patch": {
          "operationId": "VendorAndProductController_addProductToVendor",
          "summary": "Add product(s) to a vendor",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddProductsToVendorWithSpecsAndPricesDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/get-vendor-products-by-category/{categoryId}": {
        "get": {
          "operationId": "VendorAndProductController_getVendorProductsByCategory",
          "summary": "Get vendor products by category",
          "parameters": [
            {
              "name": "categoryId",
              "required": true,
              "in": "path",
              "example": "a365ede1-6df4-4afd-914a-810eacac7a9c",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/remove-products": {
        "patch": {
          "operationId": "VendorAndProductController_removeProductFromVendor",
          "summary": "Remove product(s) from a vendor",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddProductsToVendorDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/create-specification/{id}": {
        "patch": {
          "operationId": "VendorAndProductController_addSpecificationToVendorProduct",
          "summary": "Create specification(s) for a vendor product",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddSpecificationAndPriceToVendorProductDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VendorProduct"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/update-specification/{id}": {
        "patch": {
          "operationId": "VendorAndProductController_updateSpecificationPrice",
          "summary": "Update specification(s) for a vendor product",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddSpecificationAndPriceToVendorProductDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VendorProduct"
                  }
                }
              }
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/delete-vendor-product-specification/{id}": {
        "delete": {
          "operationId": "VendorAndProductController_deleteVendorProductSpecification",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/update-product-visibility/{id}": {
        "patch": {
          "operationId": "VendorAndProductController_updateProductVisibility",
          "summary": "Update the visibility of a vendor product",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/vendor-product/{storeNumber}": {
        "get": {
          "operationId": "VendorStoreController_getVendorStoreProducts",
          "summary": "Get vendor store products",
          "parameters": [
            {
              "name": "storeNumber",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ]
        }
      },
      "/vendor-product/search/product/{storeNumber}": {
        "get": {
          "operationId": "VendorStoreController_searchForProducts",
          "summary": "Search for vendor products",
          "parameters": [
            {
              "name": "name",
              "required": true,
              "in": "query",
              "example": "Coated",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "storeNumber",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "vendor-product"
          ]
        }
      },
      "/ticket": {
        "post": {
          "operationId": "TicketController_createTicket",
          "summary": "Create a ticket",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTicketDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "ticket"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "TicketController_getAllTickets",
          "summary": "Retrieve all tickets",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Ticket"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "ticket"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/ticket/{id}": {
        "get": {
          "operationId": "TicketController_getTicket",
          "summary": "Get ticket details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Ticket"
                  }
                }
              }
            }
          },
          "tags": [
            "ticket"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/ticket/{id}/close": {
        "patch": {
          "operationId": "TicketController_closeTicket",
          "summary": "Close a ticket",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "ticket"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/register": {
        "post": {
          "operationId": "SponsorController_registerFundManage",
          "summary": "register fundManager",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewFundManager"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ]
        }
      },
      "/fundManager/project/{projectId}/details": {
        "get": {
          "operationId": "SponsorController_getSponsorProjectDetails",
          "summary": "get order details for a project ",
          "description": "this Api get project order details",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "description": "ID of the project",
              "example": "0966236f-8bb9-4775-a440-93a8a8e36e49",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get project orders details"
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/change-password": {
        "patch": {
          "operationId": "SponsorController_changePassword",
          "summary": "change password from dashboard",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangePasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project": {
        "post": {
          "operationId": "ProjectController_createProject",
          "summary": "Create a project",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/fundManagerCreateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/fundManagerCreateProjectDto"
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/all-projects": {
        "get": {
          "operationId": "ProjectController_myProject",
          "summary": "get user projects",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project/contractor": {
        "post": {
          "operationId": "ProjectController_addContractor",
          "summary": "add a contractor to a project",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserProjectDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project/{projectId}/complete": {
        "get": {
          "operationId": "ProjectController_completeAProject",
          "summary": "move project to  completed",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project/completed": {
        "get": {
          "operationId": "ProjectController_allCompletedProjects",
          "summary": "get all project completed",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project/{projectId}/invite": {
        "post": {
          "operationId": "ProjectController_inviteABuilder",
          "summary": "invite a builder",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InviteBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/projects/invite": {
        "get": {
          "operationId": "ProjectController_getAllFundManagerProjectsInvitations",
          "summary": "get all fund manager project invitations",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Invitation"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/projects/invite/{invitationId}": {
        "get": {
          "operationId": "ProjectController_getFundManagerProjectInvitationById",
          "summary": "get a fund manager project invitation",
          "parameters": [
            {
              "name": "invitationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project-media": {
        "post": {
          "operationId": "SponsorProjectMediaController_createRfqRequest",
          "summary": "add media to project ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddProjectMediaDTO"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/get-project-media": {
        "get": {
          "operationId": "SponsorProjectMediaController_getProjectMediaType",
          "summary": "Retrieve project media by userType (FILE,VIDEO, IMAGE) for project 737d9641-450d-482b-9228-e228316a5bdd",
          "parameters": [
            {
              "name": "VIDEO",
              "required": false,
              "in": "query",
              "example": "VIDEO",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "FILE",
              "required": false,
              "in": "query",
              "example": "FILE",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "IMAGE",
              "required": false,
              "in": "query",
              "example": "IMAGE",
              "schema": {
                "enum": [
                  "VIDEO",
                  "IMAGE",
                  "FILE"
                ],
                "type": "string"
              }
            },
            {
              "name": "projectId",
              "required": true,
              "in": "query",
              "example": "bb2b959d-b3f8-4818-8e49-85d6b3179ccd",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ProjectMedia"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/item": {
        "get": {
          "operationId": "SponsorRfqController_fetchItems",
          "summary": "Retrieves all rfq items",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqItem"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq": {
        "post": {
          "operationId": "SponsorRfqController_createRfqRequest",
          "summary": "Request for Quote",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRfqRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/project/{projectId}/all-rfqrequest": {
        "get": {
          "operationId": "SponsorRfqController_getRequestsForProject",
          "summary": "Retrieve RFQs for project",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqRequest"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/{rfqRequestId}": {
        "get": {
          "operationId": "SponsorRfqController_getBidsForRequest",
          "summary": "Retrieve bids for request",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ProjectId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/{rfqRequestIdMaterialId}/viewbid": {
        "get": {
          "operationId": "SponsorRfqController_getRequestMaterials",
          "summary": "Retrieve all bids for in rfqrequest material",
          "parameters": [
            {
              "name": "rfqRequestIdMaterialId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequestMaterial"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/{rfqQuoteId}/accept-bid": {
        "patch": {
          "operationId": "SponsorRfqController_acceptBid",
          "summary": "Accept rfq bid and create order ",
          "parameters": [
            {
              "name": "rfqQuoteId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Contract"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/{orderId}/decline": {
        "patch": {
          "operationId": "SponsorRfqController_declineBid",
          "summary": "Decline rfq bid and reopen rfq  ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/rfq/bargain": {
        "post": {
          "operationId": "SponsorRfqController_BargainRfqForBuilder",
          "summary": "Bargain for qoute",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRfqBargainDTO"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqBargain"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/supplier/all": {
        "get": {
          "operationId": "SponsorRfqController_async",
          "summary": "all vendors and grouped categories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/orders/{projectId}/pending-orders": {
        "get": {
          "operationId": "OrderController_getGroupedOrdersByVendorAndStatusPending",
          "summary": "get all pending orders and grouped according to vendors",
          "description": "this Api create an orde in the orders table",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "description": "ID of the project",
              "example": "ad10eb87-3fe9-49c6-a78d-776316d1f2e6",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get grouped orders by vendor and status pending"
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/orders/{projectId}/paid-orders": {
        "get": {
          "operationId": "OrderController_getGroupedOrdersByVendorAndStatusPaid",
          "summary": "get all paid orders and grouped according to vendors",
          "description": "this Api get Paid order in the orders table",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "description": "ID of the project",
              "example": "38055313-b119-4e05-8f28-727147ed656d",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get grouped orders by vendor and status pending",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/GroupedOrdersByVendorDto"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/order/{orderId}/pay": {
        "patch": {
          "operationId": "OrderController_payWithWalletFund",
          "summary": "pay with account wallet fund ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/order/{orderId}/otp": {
        "get": {
          "operationId": "OrderController_generateOrderOtp",
          "summary": "generate OTP to confirming delivery ",
          "parameters": [
            {
              "name": "orderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/vendor": {
        "get": {
          "operationId": "SponsorVendorController_fetchVendors",
          "summary": "Retrieve all vendors",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Vendor"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/vendor/invite": {
        "post": {
          "operationId": "SponsorVendorController_invitevendor",
          "summary": "invite vendor to platform",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlatformInvitation"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/vendor/{id}": {
        "get": {
          "operationId": "SponsorVendorController_getVendorById",
          "summary": "Retrieve vendor details",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/vendor/{rfqCategoryId}/all-vendor": {
        "get": {
          "operationId": "SponsorVendorController_fetchVendorsForCategory",
          "summary": "Retrieve vendors by category",
          "parameters": [
            {
              "name": "rfqCategoryId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/VendorRfqCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/team/{id}": {
        "post": {
          "operationId": "SponsorTeamController_registerNewTeamMember",
          "summary": "Register user/add member into this team",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateNewTeamMember"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateNewTeamMember"
                  }
                }
              }
            },
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/teams": {
        "get": {
          "operationId": "SponsorTeamController_findAll",
          "summary": "Get all FundManager Teams",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Team"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/team/{teamId}/memebers": {
        "get": {
          "operationId": "SponsorTeamController_getAllTeamMember",
          "summary": "get all team members ",
          "parameters": [
            {
              "name": "teamId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CreateNewTeamMember"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/roles": {
        "get": {
          "operationId": "SponsorRolesController_getAllRoles",
          "summary": "view all existing roles",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Role"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/create-role": {
        "post": {
          "operationId": "SponsorRolesController_createRole",
          "summary": "create a role to assign to your team or a user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRoleDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Role"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/assign-role": {
        "post": {
          "operationId": "SponsorRolesController_asignRolesToUsers",
          "summary": "Assign a defined role to a user-team member",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createUserRoleDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserRole"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/remove-role": {
        "post": {
          "operationId": "SponsorRolesController_removeRolesToUsers",
          "summary": "remove a defined role from a user-team member",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DesignUserRoleDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/create-permission": {
        "post": {
          "operationId": "SponsorRolesController_createPermission",
          "summary": "create dynamic permissions to give to roles",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePermissionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Permission"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/roles-permission": {
        "post": {
          "operationId": "SponsorRolesController_crateRolesPermission",
          "summary": "give permissions existing roles",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createRolePermissionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RolePermission"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "SponsorRolesController_getAllRolesPermision",
          "summary": "view all existing roles with their given permissions",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RolePermission"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/decline-permission": {
        "post": {
          "operationId": "SponsorRolesController_removeRolesPermission",
          "summary": "remove permissions from existing role",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteRolePermissionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/permission": {
        "get": {
          "operationId": "SponsorRolesController_getAllPermissions",
          "summary": "view all existing permissions with their given roles ",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Permission"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/create-resource-access": {
        "post": {
          "operationId": "SponsorRolesController_shareAccessToResources",
          "summary": "create a resource access point to roles ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateResourcesAccessDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Resource"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/grantPermisionToRecourse": {
        "post": {
          "operationId": "SponsorRolesController_grantPermisionToResources",
          "summary": "grant permission to a resource ",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createPermissionResourcesAccess"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PermissionResource"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/fund-account": {
        "post": {
          "operationId": "SponsorWalletController_fundWallet",
          "summary": "fund account",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FundWalletDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/transaction/history": {
        "get": {
          "operationId": "SponsorTransactionController_createProject",
          "summary": "get account transactions history",
          "parameters": [
            {
              "name": "transaction_type",
              "required": true,
              "in": "query",
              "example": "inflow",
              "examples": {
                "INFLOW": {
                  "summary": "Paused status example",
                  "value": "inflow"
                },
                "OUTFLOW": {
                  "summary": "Active status example",
                  "value": "outflow"
                }
              },
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "start_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "end_date",
              "required": false,
              "in": "query",
              "example": "2023-01-01T00:00:00.000Z",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "search_param",
              "required": false,
              "in": "query",
              "example": "10000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 10,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/UserTransaction"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/builders": {
        "get": {
          "operationId": "FundManagerBuilderController_fetchAllBuilders",
          "summary": "Retrieves all builders",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for builder. Searches in fields: businessName, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AllBuildersResponseData"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/my/builders": {
        "get": {
          "operationId": "FundManagerBuilderController_fetchAllMyBuilders",
          "summary": "Retrieves all fundmanager builders",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for builder. Searches in fields: businessName, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AllBuildersResponseData"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "FundManagerBuilderController_addToMyBuilders",
          "summary": "Add builders to fundmanager profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddBuilderToFundManagersDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/BuilderFundManager"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/my/builder/send-invite": {
        "post": {
          "operationId": "FundManagerBuilderController_sendPlatformInviite",
          "summary": "Send invite to a builder",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BuilderPlatformInvitation"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/builder-projects": {
        "get": {
          "operationId": "FundManagerBuilderController_getBuilderProjects",
          "summary": "get all builder projects",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "query",
              "description": "Search query for fundmanagers projects ",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for fundmanagers. Searches in fields: project title, location, ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/fundManager/builder-details": {
        "get": {
          "operationId": "FundManagerBuilderController_getBuilderDetails",
          "summary": "Get a builder details",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "query",
              "description": "Search query for a builder details ",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for project. Searches in fields: project title, location, ",
              "schema": {}
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/brand": {
        "get": {
          "operationId": "BrandController_findAll",
          "summary": "Retrieves all brands",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "brand"
          ]
        }
      },
      "/brand/premium": {
        "get": {
          "operationId": "BrandController_findPremium",
          "summary": "Retrieves premium brands",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "brand"
          ]
        }
      },
      "/brand/{id}": {
        "get": {
          "operationId": "BrandController_getDetails",
          "summary": "Get details of a brand",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Brand"
                  }
                }
              }
            }
          },
          "tags": [
            "brand"
          ]
        }
      },
      "/category": {
        "get": {
          "operationId": "CategoryController_retrieveCategories",
          "summary": "Retrieves all company categories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "category"
          ]
        }
      },
      "/chat": {
        "get": {
          "operationId": "ChatController_getMyChats",
          "summary": "Get my chats",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "chat"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/chat/{userId}": {
        "get": {
          "operationId": "ChatController_getChatBetweenBuilderAndVendor",
          "summary": "Get chat between builder and vendor or fund manager",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Chat"
                  }
                }
              }
            }
          },
          "tags": [
            "chat"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/chat/{chatId}": {
        "post": {
          "operationId": "ChatController_sendConversation",
          "summary": "send conversation",
          "parameters": [
            {
              "name": "chatId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SendConversationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "chat"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/chat/{chatId}/conversation": {
        "get": {
          "operationId": "ChatController_getConversations",
          "summary": "Update chat with conversations",
          "parameters": [
            {
              "name": "chatId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "chat"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/chat/{userId}/start": {
        "post": {
          "operationId": "ChatController_postChart",
          "summary": "start a chart with user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/startChartDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "chat"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/notifications/me": {
        "get": {
          "operationId": "NotificationController_getAllNotifications",
          "summary": "get  user notifications",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search notification messages",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 10,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get notifications by user ID",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CreateNotificationDto"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "notifications"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/notifications/me/{notificationId}/read": {
        "patch": {
          "operationId": "NotificationController_readNotification",
          "summary": "mark notification as read",
          "parameters": [
            {
              "name": "notificationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Notification"
                  }
                }
              }
            }
          },
          "tags": [
            "notifications"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/notifications/me/{notificationId}/delete": {
        "delete": {
          "operationId": "NotificationController_deleteNotification",
          "summary": "delete notification",
          "parameters": [
            {
              "name": "notificationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "notifications"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/notifications/{userId}": {
        "post": {
          "operationId": "NotificationController_createNotificationWithCtas",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "description": "User ID",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for creating notification",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateNotificationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Create notification with CTAs",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateNotificationDto"
                  }
                }
              }
            }
          },
          "tags": [
            "notifications"
          ]
        }
      },
      "/open-api/statistics": {
        "get": {
          "operationId": "OpenApiController_fetchStat",
          "summary": "Retrieves CutStruct statistics/open api",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "open-api"
          ]
        }
      },
      "/open-api/blog/all": {
        "get": {
          "operationId": "OpenApiController_getAllBlogs",
          "summary": "Retrieves all Blogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Blog"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "open-api"
          ]
        }
      },
      "/open-api/blog/{id}": {
        "get": {
          "operationId": "OpenApiController_getSingleBlog",
          "summary": "get single Blog by Id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Blog"
                  }
                }
              }
            }
          },
          "tags": [
            "open-api"
          ]
        }
      },
      "/open-api/sample/material/download-csv": {
        "get": {
          "operationId": "OpenApiController_downloadCsv",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "open-api"
          ]
        }
      },
      "/open-api/sample/material/download-excel": {
        "get": {
          "operationId": "OpenApiController_downloadExcel",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "open-api"
          ]
        }
      },
      "/migration": {
        "get": {
          "operationId": "MigrationController_migrate",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "migration"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/migration/passwords": {
        "get": {
          "operationId": "MigrationController_migratePasswords",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "migration"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/retail/create-user": {
        "post": {
          "operationId": "RetailController_createUser",
          "summary": "Create a new retail user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRetailUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RetailUser"
                  }
                }
              }
            }
          },
          "tags": [
            "retail"
          ]
        }
      },
      "/retail/get-users": {
        "get": {
          "operationId": "RetailController_getUsers",
          "summary": "Gets all users",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RetailUser"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "retail"
          ]
        }
      },
      "/retail/get-users/{id}": {
        "get": {
          "operationId": "RetailController_getUserById",
          "summary": "Gets a retail user by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "af618e4e-4be4-44a3-8470-ffe765368428",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RetailUser"
                  }
                }
              }
            }
          },
          "tags": [
            "retail"
          ]
        }
      },
      "/retail/get-users/{filter}": {
        "get": {
          "operationId": "RetailController_getUserByFilter",
          "summary": "Gets a retail user by filter.",
          "parameters": [
            {
              "name": "filter",
              "required": true,
              "in": "path",
              "example": "feature_product",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RetailUser"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "retail"
          ]
        }
      },
      "/retail/transaction": {
        "post": {
          "operationId": "RetailTransactionController_createTransaction",
          "summary": "Create a new retail transaction",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRetailTransactionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RetailTransaction"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "retail-transaction"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "RetailTransactionController_getTransactions",
          "summary": "Gets all builders transactions",
          "parameters": [
            {
              "name": "status",
              "required": false,
              "in": "query",
              "example": "PENDING",
              "schema": {
                "enum": [
                  "PENDING",
                  "COMPLETE",
                  "FAILED"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RetailTransaction"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "retail-transaction"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/labour-hack/create-labour-userType": {
        "post": {
          "operationId": "LabourHackController_createLabourType",
          "summary": "Create a new labour userType",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateLabourHackDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LabourHack"
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/labour-hack/get-labour-types": {
        "get": {
          "operationId": "LabourHackController_getAllLabourHack",
          "summary": "Get all labour types",
          "parameters": [
            {
              "name": "page_size",
              "required": false,
              "in": "query",
              "example": 100,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/LabourHack"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/labour-hack/get-labour-userType/{id}": {
        "get": {
          "operationId": "LabourHackController_getLabourHackById",
          "summary": "Find a labour userType by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "283cb63f-710f-46f7-a27b-9b678f33622f",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LabourHack"
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/labour-hack/get-labour-userType-transactions/{id}": {
        "get": {
          "operationId": "LabourHackController_getLabourHackTransactions",
          "summary": "Get all labour userType's transactions",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "e43c2fd9-20c0-4ec3-aa67-608ea0219a10",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RetailTransaction"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/labour-hack/update-labour-userType/{id}": {
        "patch": {
          "operationId": "LabourHackController_updateLabourHack",
          "summary": "Update a labour userType",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "e43c2fd9-20c0-4ec3-aa67-608ea0219a10",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateLabourHackDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/LabourHack"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/labour-hack/delete-labour-userType/{id}": {
        "delete": {
          "operationId": "LabourHackController_deleteLabourHackById",
          "summary": "Delete a labour userType",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "example": "e43c2fd9-20c0-4ec3-aa67-608ea0219a10",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "tags": [
            "labour-hack"
          ]
        }
      },
      "/superAdmin/dashboard": {
        "get": {
          "operationId": "superAdminController_getDashboard",
          "summary": "Get SuperAdmin Dashboard",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/roles": {
        "get": {
          "operationId": "superAdminController_getRoles",
          "summary": "get all admin Roles",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Role"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/procurementManagers/{roleId}": {
        "get": {
          "operationId": "superAdminController_getProcurementManagers",
          "summary": "get all Procurement Managers profile",
          "parameters": [
            {
              "name": "roleId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/UserRole"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/fundManagers": {
        "post": {
          "operationId": "superAdminFundManagerController_createFundManager",
          "summary": "Create Fund Managers",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/superAdminCreateFundManagerDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "superAdminFundManagerController_getFundManagers",
          "summary": "Get all Fund Managers",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/FundManager"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/fundManagers/{fundmanagerId}/projects": {
        "post": {
          "operationId": "superAdminFundManagerController_createFundManagerProject",
          "summary": "Create FundManager Project",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/superAdminCreateFundManageProjectDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/fundManagers/{fundmanagerId}": {
        "get": {
          "operationId": "superAdminFundManagerController_getFundManagerById",
          "summary": "Get a Fund Managers by fundmanagerId",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "superAdminFundManagerController_completeFundManagerProfile",
          "summary": "Update a Fund Manager profile",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateFundManagerDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/FundManager"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/projects": {
        "get": {
          "operationId": "SuperAdminTransactionController_getFundManagerProjectsSearch",
          "summary": "search for projects by date filter",
          "parameters": [
            {
              "name": "startDate",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Project"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-transactions"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/projects/fundmanagers": {
        "get": {
          "operationId": "superAdminFundManagerController_getFundManagerProjectsSearch",
          "summary": "Get Fund Managers Projects by search",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for fundmanager projects. Searches by fund manager businessName ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/FundManager"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/fundManagers/projects/{projectId}": {
        "get": {
          "operationId": "superAdminFundManagerController_getFundManagerProjectByProjectId",
          "summary": "Get Fund Managers Project by ProjectId",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "superAdminFundManagerController_acceptProjectStatus",
          "summary": "Update projectstatus to accepted",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Project"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/procurementManagers/fundManagers/{fundmanagerId}": {
        "patch": {
          "operationId": "superAdminFundManagerController_assignProcurementManagersToFundManagers",
          "summary": "assign a ProcurementManagers to a Fund Manager profile",
          "parameters": [
            {
              "name": "fundmanagerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "procurementManagerUserId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/projects/{projectId}/all-rfqrequest": {
        "get": {
          "operationId": "superAdminFundManagerController_getProjectRFQs",
          "summary": "get all Project Rfqs",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqRequest"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/rfq/{rfqRequestId}/bids": {
        "get": {
          "operationId": "superAdminFundManagerController_getProjectBids",
          "summary": "get all Rfqs bids",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-fundManager"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders": {
        "post": {
          "operationId": "superAdminBuilderController_createBuilder",
          "summary": "Create Builders",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/superAdminCreateBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "superAdminBuilderController_getbuilders",
          "summary": "Get all Builders",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for Builders. Searches by builders businessName ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}/projects": {
        "post": {
          "operationId": "superAdminBuilderController_createBuilderProject",
          "summary": "Create Builder Project",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/superAdminCreateBuilderProjectDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}/rfqs": {
        "post": {
          "operationId": "superAdminBuilderController_createBuilderProjectRfq",
          "summary": "Create Builder Project rfq by builderId",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRfqRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RfqRequest"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builder/material-schedule-upload": {
        "post": {
          "operationId": "superAdminBuilderController_uploadFile",
          "summary": "Upload builder material schedule document",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "CSV or Excel file to upload from downloaded material schedule template",
            "content": {
              "multipart/form-data": {
                "schema": {
                  "$ref": "#/components/schemas/UploadFileDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/projects": {
        "get": {
          "operationId": "superAdminBuilderController_getbuilderProjects",
          "summary": "Get all Builders Projects",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Project"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/projects/{projectId}": {
        "get": {
          "operationId": "superAdminBuilderController_getbuilderProjectByProjectId",
          "summary": "Get Builders Project by projectId",
          "parameters": [
            {
              "name": "projectId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}/profile": {
        "patch": {
          "operationId": "superAdminBuilderController_updateBuilderProfile",
          "summary": "Update a Builder profile",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBuilderDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Builder"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}": {
        "get": {
          "operationId": "superAdminBuilderController_getBuilderById",
          "summary": "Get a Builders by builderId",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}/procurementManagers": {
        "patch": {
          "operationId": "superAdminBuilderController_assignProcurementManagersTobuilders",
          "summary": "assign a ProcurementManagers to a Builder profile",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "procurementManagerUserId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Builder"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/builders/{builderId}/document": {
        "patch": {
          "operationId": "superAdminBuilderController_updateBuilderDocs",
          "summary": "Upload a Bulder documents",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UploadDocumentsDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/rfqs/{rfqRequestId}/bids": {
        "get": {
          "operationId": "superAdminBuilderController_getBidsForRequest",
          "summary": "get all RFQs Bids",
          "parameters": [
            {
              "name": "rfqRequestId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/orders/{builderId}": {
        "get": {
          "operationId": "superAdminBuilderController_getOrders",
          "summary": "get RFQs order",
          "parameters": [
            {
              "name": "builderId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Order"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-builder"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors/invite": {
        "post": {
          "operationId": "superAdminVendorController_inviteBuilder",
          "summary": "Invite Vendors",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/superAdminCreateBuilderDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Invitation"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors": {
        "get": {
          "operationId": "superAdminVendorController_getvendors",
          "summary": "Get all Vendors",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search query for vendors. Searches by vendors businessName ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors/{vendorId}/category": {
        "post": {
          "operationId": "superAdminVendorController_addVendorCategory",
          "summary": "add category to vendor account",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateVendorCategoryDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/RfqCategory"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors/{vendorId}/profile": {
        "patch": {
          "operationId": "superAdminVendorController_updateBuilderProfile",
          "summary": "Update a Vendor profile",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUpdateVendorProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Vendor"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors/{vendorId}": {
        "get": {
          "operationId": "superAdminVendorController_getBuilderById",
          "summary": "Get a Vendor by vendorId",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Vendor"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/vendors/{vendorId}/document": {
        "patch": {
          "operationId": "superAdminVendorController_updateBuilderDocs",
          "summary": "Upload a Vendor documents",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UploadDocumentsDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/procurementManagers/builders/{builderId}": {
        "patch": {
          "operationId": "superAdminVendorController_assignProcurementManagersTobuilders",
          "summary": "assign a ProcurementManagers to a Vendor profile",
          "parameters": [
            {
              "name": "vendorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "procurementManagerId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-vendor"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/transactions": {
        "get": {
          "operationId": "SuperAdminTransactionController_getFundManagers",
          "summary": "Get all Transactions",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-transactions"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/revenue": {
        "get": {
          "operationId": "SuperAdminTransactionController_getRevenues",
          "summary": "Get all Revenues",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "superAdmin-transactions"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/products/category": {
        "get": {
          "operationId": "superAdminProductController_getProductCategories",
          "summary": "fetch all Product Categories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Vendor"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-product-category"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/superAdmin/products/category/{categoryId}": {
        "get": {
          "operationId": "superAdminProductController_getProductCategory",
          "summary": "fetch a product category",
          "parameters": [
            {
              "name": "categoryId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "superAdmin-product-category"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "cutstruct-backend-v2",
      "description": "cutstruct-backend-v2",
      "version": "2.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            },
            "password": {
              "type": "string",
              "example": "password123456"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "LoginWithSSODto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            }
          },
          "required": [
            "email"
          ]
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "businessName": {
              "type": "string",
              "description": "enter Business name",
              "example": "Eco Hotel"
            },
            "name": {
              "type": "string",
              "description": "User name",
              "example": "Dogubo Joshua"
            },
            "email": {
              "type": "string",
              "description": "User email",
              "example": "joshua@user.com"
            },
            "password": {
              "type": "string",
              "description": "User password",
              "example": "password123456"
            },
            "phoneNumber": {
              "type": "string",
              "description": "User name",
              "example": "+2348123445678"
            },
            "acceptTerms": {
              "type": "boolean",
              "description": "User name",
              "example": true
            },
            "userType": {
              "nullable": true,
              "enum": [
                "ADMIN",
                "SUPER_ADMIN",
                "BUILDER",
                "VENDOR",
                "FUND_MANAGER"
              ],
              "type": "string",
              "example": "BUILDER"
            },
            "logo": {
              "type": "string",
              "example": "http://res..."
            }
          },
          "required": [
            "businessName",
            "name",
            "email",
            "password",
            "phoneNumber",
            "acceptTerms"
          ]
        },
        "VerifyEmailDto": {
          "type": "object",
          "properties": {
            "emailOtp": {
              "type": "number",
              "example": 123456
            },
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            }
          },
          "required": [
            "emailOtp",
            "email"
          ]
        },
        "User": {
          "type": "object",
          "properties": {}
        },
        "ResetPasswordDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            },
            "resetPasswordOtp": {
              "type": "number",
              "example": 123456
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password123456"
            }
          },
          "required": [
            "email",
            "resetPasswordOtp",
            "password"
          ]
        },
        "ActivateUserDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            },
            "emailOtp": {
              "type": "number",
              "example": 123456
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password123456"
            }
          },
          "required": [
            "email",
            "emailOtp",
            "password"
          ]
        },
        "UpdatePasswordDto": {
          "type": "object",
          "properties": {
            "oldPassword": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password123456"
            },
            "newPassword": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password12345654321"
            }
          },
          "required": [
            "oldPassword",
            "newPassword"
          ]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {
            "businessName": {
              "type": "string",
              "description": "enter Business name",
              "example": "Eco Hotel"
            },
            "phoneNumber": {
              "type": "string",
              "description": "Phone Number",
              "example": "+2348123445678"
            },
            "location": {
              "type": "string",
              "description": "User location"
            },
            "name": {
              "type": "string",
              "description": "User name"
            }
          },
          "required": [
            "businessName",
            "phoneNumber",
            "location",
            "name"
          ]
        },
        "CreateRoleDto": {
          "type": "object",
          "properties": {
            "name": {
              "enum": [
                "ADMIN",
                "MANAGER",
                "SUPER_ADMIN",
                "MEMBER",
                "OWNER",
                "CONTRACTOR"
              ],
              "type": "string",
              "example": "name must be one of these ADMIN,MANAGER,SUPER_ADMIN,MEMBER,OWNER,CONTRACTOR"
            },
            "description": {
              "type": "string",
              "example": "Please provide a dscription of this role"
            }
          },
          "required": [
            "name",
            "description"
          ]
        },
        "Role": {
          "type": "object",
          "properties": {}
        },
        "SubBlogDto": {
          "type": "object",
          "properties": {
            "subTitle": {
              "type": "string",
              "maxLength": 200000,
              "example": "Reinforced Steel"
            },
            "subContent": {
              "type": "string",
              "maxLength": 200000,
              "example": "Reinforced steel, also known as rebar..."
            }
          },
          "required": [
            "subTitle",
            "subContent"
          ]
        },
        "BlogDto": {
          "type": "object",
          "properties": {
            "blogTitle": {
              "type": "string",
              "maxLength": 200000,
              "example": "The Significance of High-Quality Construction Materials in Building Projects"
            },
            "blogContent": {
              "type": "string",
              "maxLength": 200000,
              "example": "When it comes to construction projects..."
            },
            "image": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "subBlogs": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SubBlogDto"
              }
            }
          },
          "required": [
            "blogTitle",
            "blogContent",
            "image"
          ]
        },
        "UpdateSubBlogDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            },
            "subTitle": {
              "type": "string",
              "maxLength": 200000,
              "example": "Reinforced Steel"
            },
            "subContent": {
              "type": "string",
              "maxLength": 200000,
              "example": "Reinforced steel, also known as rebar..."
            }
          },
          "required": [
            "id",
            "subTitle",
            "subContent"
          ]
        },
        "UpdateBlogDto": {
          "type": "object",
          "properties": {
            "blogTitle": {
              "type": "string",
              "maxLength": 200000,
              "example": "The Significance of High-Quality Construction Materials in Building Projects"
            },
            "blogContent": {
              "type": "string",
              "maxLength": 200000,
              "example": "When it comes to construction projects..."
            },
            "image": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "subBlogs": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UpdateSubBlogDto"
              }
            }
          },
          "required": [
            "blogTitle",
            "blogContent",
            "image"
          ]
        },
        "Project": {
          "type": "object",
          "properties": {}
        },
        "Contract": {
          "type": "object",
          "properties": {}
        },
        "Dispute": {
          "type": "object",
          "properties": {}
        },
        "Invitation": {
          "type": "object",
          "properties": {}
        },
        "PriceList": {
          "type": "object",
          "properties": {}
        },
        "UpdatePriceListDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            },
            "label": {
              "type": "string",
              "example": "Lafarge Cement"
            },
            "price": {
              "type": "number",
              "example": 3000
            },
            "metric": {
              "type": "string",
              "example": "bag"
            }
          },
          "required": [
            "id",
            "label",
            "price",
            "metric"
          ]
        },
        "RfqRequest": {
          "type": "object",
          "properties": {}
        },
        "RfqQuote": {
          "type": "object",
          "properties": {}
        },
        "FundManager": {
          "type": "object",
          "properties": {}
        },
        "RegisterFundManagerDto": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "example": "99f46bff-4dc2-480e-aeac-c448276ea632"
            },
            "businessName": {
              "type": "string",
              "example": "Dogubo Joshua"
            },
            "email": {
              "type": "string",
              "example": "joshua@fundManager.com"
            },
            "businessRegNo": {
              "type": "string",
              "example": "abc_1234"
            },
            "password": {
              "type": "string",
              "example": "password123456"
            },
            "about": {
              "type": "string",
              "nullable": true,
              "example": "Best FundManager 2023"
            },
            "phoneNumber": {
              "type": "string",
              "nullable": true,
              "example": "+234 000 000 0000"
            },
            "businessAddress": {
              "type": "string",
              "example": "13b oginigba trans-Amad "
            },
            "logo": {
              "type": "string",
              "nullable": true,
              "example": "https://res.cloudinary.com/dzobanav8/image/upload/v1689088952/logo_mvt3z0.png"
            },
            "acceptTerms": {
              "type": "boolean",
              "description": "User name",
              "example": true
            },
            "userType": {
              "nullable": true,
              "enum": [
                "ADMIN",
                "SUPER_ADMIN",
                "BUILDER",
                "VENDOR",
                "FUND_MANAGER"
              ],
              "type": "string",
              "example": "FUND_MANAGER"
            }
          },
          "required": [
            "UserId",
            "businessName",
            "email",
            "businessRegNo",
            "password",
            "about",
            "phoneNumber",
            "businessAddress",
            "logo",
            "acceptTerms"
          ]
        },
        "CreateInvitationDto": {
          "type": "object",
          "properties": {
            "buyerName": {
              "type": "string",
              "nullable": true,
              "example": "Splenzert Technology"
            },
            "fundManagerName": {
              "type": "string",
              "nullable": true,
              "example": "Splenzert Technology"
            },
            "buyerEmail": {
              "type": "string",
              "example": "fundManagermail@splenzert.com"
            },
            "FundManagerId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            }
          },
          "required": [
            "buyerEmail",
            "FundManagerId"
          ]
        },
        "adminShareProjectDto": {
          "type": "object",
          "properties": {
            "fromEmail": {
              "type": "string",
              "example": "fundManager@cutstruct.com"
            },
            "toEmail": {
              "type": "string",
              "example": "builder@cutruct.com"
            },
            "ProjectId": {
              "type": "string",
              "example": "178282d8-8e28-4935-84aa-803bbcf4d273"
            }
          },
          "required": [
            "fromEmail",
            "toEmail",
            "ProjectId"
          ]
        },
        "SharedProject": {
          "type": "object",
          "properties": {}
        },
        "AdminCreateProject": {
          "type": "object",
          "properties": {
            "fundManagerEmail": {
              "type": "string",
              "example": "fundManager@cutstruct.com"
            },
            "customerEmail": {
              "type": "string",
              "example": "builder@cutstruct.com"
            },
            "title": {
              "type": "string",
              "example": "admin shared this project "
            },
            "budgetAmount": {
              "type": "number",
              "example": 200000
            }
          },
          "required": [
            "fundManagerEmail",
            "customerEmail",
            "title",
            "budgetAmount"
          ]
        },
        "CreateProjectDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "Third mainland bridge construction"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:27.920Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:27.920Z"
            },
            "location": {
              "type": "string",
              "example": "12 azumini lagos Nigeria"
            }
          },
          "required": [
            "title",
            "startDate",
            "endDate",
            "location"
          ]
        },
        "AdminCreateBuilderDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "John Doe"
            },
            "email": {
              "type": "string",
              "example": "builder@example.com"
            },
            "isIndividual": {
              "type": "boolean",
              "example": true
            },
            "phoneNumber": {
              "type": "string",
              "nullable": true,
              "example": "+1234567890"
            },
            "category": {
              "type": "string",
              "nullable": true,
              "example": "cement"
            },
            "about": {
              "type": "string",
              "nullable": true,
              "example": "About the builder"
            },
            "address": {
              "type": "string",
              "nullable": true,
              "example": "123 Main St"
            },
            "location": {
              "type": "string",
              "example": "New York"
            },
            "companySize": {
              "nullable": true,
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "SMALL"
            },
            "companyName": {
              "type": "string",
              "nullable": true,
              "example": "Splenzert International"
            },
            "companyLocation": {
              "type": "string",
              "nullable": true,
              "example": "lagos nigeria"
            },
            "RC_Number": {
              "type": "string",
              "nullable": true,
              "example": "cac_12678905"
            },
            "PIN": {
              "type": "string",
              "nullable": true,
              "example": "123457678"
            },
            "PIN_DocumentURl": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "CertificateOfLocation": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "BusinessNameDoc": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "BankStatement": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "UtilityBill": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "logo": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "country": {
              "type": "string",
              "nullable": true,
              "example": "United States"
            },
            "state": {
              "type": "string",
              "nullable": true,
              "example": "California"
            },
            "categories": {
              "type": "string",
              "nullable": true,
              "example": "Finance"
            },
            "contactName": {
              "type": "string",
              "nullable": true,
              "example": "John Doe"
            },
            "contactPhone": {
              "type": "string",
              "nullable": true,
              "example": "9876543210"
            },
            "contactEmail": {
              "type": "string",
              "nullable": true,
              "example": "john.doe@example.com"
            },
            "legalInfo": {
              "type": "boolean",
              "example": false
            },
            "taxCompliance": {
              "type": "boolean",
              "example": true
            },
            "racialEquity": {
              "type": "boolean",
              "example": true
            }
          },
          "required": [
            "name",
            "email",
            "isIndividual"
          ]
        },
        "Builder": {
          "type": "object",
          "properties": {}
        },
        "AdminRegisterVendorDto": {
          "type": "object",
          "properties": {
            "businessSize": {
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "LARGE"
            },
            "businessName": {
              "type": "string",
              "example": "Splenzert International"
            },
            "businessRegNo": {
              "type": "string",
              "example": "cac_12678905"
            },
            "businessAddress": {
              "type": "string",
              "example": "off white house "
            },
            "VendorType": {
              "enum": [
                "MANUFACTURER",
                "DISTRIBUTOR"
              ],
              "type": "string",
              "example": "MANUFACTURER,DISTRIBUTOR"
            },
            "certificateOfLocation": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "BankStatement": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "UtilityBill": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "logo": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "about": {
              "type": "string",
              "nullable": true,
              "example": "About the vendor..."
            }
          },
          "required": [
            "businessSize"
          ]
        },
        "AdminUpdateVendorProfileDto": {
          "type": "object",
          "properties": {
            "businessAddress": {
              "type": "string",
              "example": "B Adewale Kolawole Crescent, Lekki - Lagos"
            },
            "phone": {
              "type": "string",
              "example": "+23440404040"
            },
            "name": {
              "type": "string",
              "example": "Joshua Dogubo"
            },
            "about": {
              "type": "string",
              "example": "Dealers of quality plumbing pipes"
            },
            "email": {
              "type": "string",
              "example": "business email"
            },
            "location": {
              "type": "string",
              "example": "Lagos Abuja"
            },
            "logo": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "certificateOfLocation": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "certificateOfIncorporation": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "UtilityBill": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "twoFactorAuthEnabled": {
              "type": "boolean",
              "example": true
            },
            "smsNotificationEnabled": {
              "type": "boolean",
              "example": true
            },
            "emailNotificationEnabled": {
              "type": "boolean",
              "example": true
            },
            "signatures": {
              "example": [
                "https://example.com/sign.png",
                "https://example.com/sign.png"
              ],
              "nullable": true,
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "businessName": {
              "type": "string",
              "example": "praise company"
            },
            "businessRegNo": {
              "type": "string",
              "example": "3440404040"
            },
            "vendorType": {
              "enum": [
                "MANUFACTURER",
                "DISTRIBUTOR"
              ],
              "type": "string"
            },
            "businessSize": {
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string"
            },
            "businessContactId": {
              "type": "string"
            }
          }
        },
        "Ticket": {
          "type": "object",
          "properties": {}
        },
        "AdminUpdatePasswordDto": {
          "type": "object",
          "properties": {
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password123456"
            }
          },
          "required": [
            "password"
          ]
        },
        "AdminUpdateBuilderProfileDto": {
          "type": "object",
          "properties": {
            "about": {
              "type": "string",
              "example": "Dealers of quality plumbing pipes"
            },
            "businessName": {
              "type": "string",
              "example": "Makintosh Plastics"
            },
            "businessAddress": {
              "type": "string",
              "example": "3440404040"
            },
            "businessSize": {
              "nullable": true,
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "MEDIUM"
            },
            "BankStatement": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "businessRegNo": {
              "type": "string",
              "example": "3440404040"
            },
            "UtilityBill": {
              "type": "string",
              "example": "https://example.com/utility.png"
            },
            "isIndividual": {
              "type": "boolean",
              "example": true
            },
            "certificateOfLocation": {
              "type": "string",
              "example": "https://example.com/certi.png"
            },
            "certificateOfIncorporation": {
              "type": "string",
              "example": "certificateOfIncorpaoration.pdf"
            },
            "BusinessContactId": {
              "type": "string",
              "example": "BusinessContactId.pdf"
            },
            "BusinessContactSignature": {
              "type": "string",
              "example": "BusinessContactSignature.pdf"
            },
            "logo": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "name": {
              "type": "string",
              "example": "praise name"
            }
          }
        },
        "NewBuilderDto": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "example": "f01a0ef8-3169-4c36-8225-1b396975756d"
            },
            "businessAddress": {
              "type": "string",
              "nullable": true,
              "example": "123 Main St, City vile"
            },
            "businessSize": {
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "LARGE"
            },
            "businessRegNo": {
              "type": "string",
              "example": "123-456-789"
            },
            "isIndividual": {
              "type": "boolean",
              "example": true
            },
            "logo": {
              "type": "string",
              "example": "company_logo.png"
            },
            "about": {
              "type": "string",
              "example": "We build dreams!"
            }
          },
          "required": [
            "UserId"
          ]
        },
        "InvitationDto": {
          "type": "object",
          "properties": {
            "toName": {
              "type": "string",
              "example": "vendor damy"
            },
            "toEmail": {
              "type": "string",
              "example": "joshua@vendor.com"
            },
            "Location": {
              "type": "string",
              "example": "Lagos Nigeria"
            },
            "message": {
              "type": "string",
              "example": "Hi ade, Im inviting you to ...."
            }
          },
          "required": [
            "toName",
            "toEmail",
            "message"
          ]
        },
        "CreateBankAccountDto": {
          "type": "object",
          "properties": {
            "accountName": {
              "type": "string",
              "example": "Praise Praise"
            },
            "accountNumber": {
              "type": "string",
              "minLength": 10,
              "example": "0022728151"
            },
            "bankName": {
              "type": "string",
              "example": "First Bank"
            },
            "bankCode": {
              "type": "string",
              "example": "063"
            },
            "bankSlug": {
              "type": "string",
              "example": "FBN"
            }
          },
          "required": [
            "accountName",
            "accountNumber",
            "bankName",
            "bankCode",
            "bankSlug"
          ]
        },
        "BaseProjectMediaUploadDto": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "URL of the media",
              "example": "https://example.com/media.jpg"
            },
            "title": {
              "type": "string",
              "description": "Title of the media",
              "example": "Project Image"
            },
            "mediaType": {
              "enum": [
                "VIDEO",
                "IMAGE",
                "FILE"
              ],
              "type": "string",
              "description": "Media userType",
              "example": "IMAGE"
            },
            "description": {
              "type": "string",
              "description": "Description (optional)",
              "example": "This is a media description."
            }
          },
          "required": [
            "mediaType"
          ]
        },
        "BuilderCreateProjectDto": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "example": "Project Location"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-01-01T12:00:00.000Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-12-31T12:00:00.000Z"
            },
            "title": {
              "type": "string",
              "example": "Project Title"
            },
            "budgetAmount": {
              "type": "number",
              "example": 50000
            },
            "description": {
              "type": "string",
              "example": "Project description"
            },
            "newFundmanagers": {
              "example": [
                "d1f2c3d5-b720-4e11-b678-678d876e3456",
                "a2b1c3d4-e123-4c67-8a90-098b765c43ef"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "projectMedia": {
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BaseProjectMediaUploadDto"
              }
            }
          },
          "required": [
            "location",
            "startDate",
            "endDate",
            "title"
          ]
        },
        "updateProjectDto": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "example": "Project Location"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-01-01T12:00:00.000Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-12-31T12:00:00.000Z"
            },
            "title": {
              "type": "string",
              "example": "Project Title"
            },
            "newFundManagers": {
              "example": [
                "52cefa55-5371-4e61-a501-4d7ccf67c8f2",
                "f508db8b-5b86-4042-9a88-837df442f70d"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "projectMedia": {
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BaseProjectMediaUploadDto"
              }
            }
          },
          "required": [
            "location",
            "startDate",
            "endDate",
            "title"
          ]
        },
        "TenderBidDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "example": "Description of the bid"
            },
            "documents": {
              "nullable": true,
              "type": "array",
              "items": {
                "type": "object"
              },
              "example": [
                {
                  "title": "Document Title",
                  "url": "https://example.com",
                  "type": "FILE"
                },
                {
                  "title": "Document Title",
                  "url": "https://example.com",
                  "type": "VIDEO"
                },
                {
                  "title": "Document Title",
                  "url": "https://example.com",
                  "type": "IMAGE"
                }
              ]
            },
            "ProjectId": {
              "type": "string",
              "example": "123e4567-e89b-12d3-a456-426614174001"
            },
            "ProjectTenderId": {
              "type": "string",
              "example": "123e4567-e89b-12d3-a456-426614174002"
            }
          },
          "required": [
            "documents",
            "ProjectId",
            "ProjectTenderId"
          ]
        },
        "Promise": {
          "type": "object",
          "properties": {}
        },
        "UploadFileDto": {
          "type": "object",
          "properties": {
            "materialSchedule": {
              "type": "string",
              "format": "binary",
              "example": "csv file"
            },
            "title": {
              "type": "string",
              "example": "Material Schedule Title"
            },
            "csvUrl": {
              "type": "string",
              "example": "https://example.com/csvfile.csv"
            },
            "ownerId": {
              "type": "string",
              "example": "123e4567-e89b-12d3-a456-426614174001"
            },
            "ProjectId": {
              "type": "string",
              "example": "123e4567-e89b-12d3-a456-426614174002"
            }
          },
          "required": [
            "materialSchedule",
            "title",
            "ownerId",
            "ProjectId"
          ]
        },
        "MaterialSchedule": {
          "type": "object",
          "properties": {}
        },
        "AddProjectMediaDTO": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "URL of the media",
              "example": "https://example.com/media.jpg"
            },
            "title": {
              "type": "string",
              "description": "Title of the media",
              "example": "Project Image"
            },
            "mediaType": {
              "enum": [
                "VIDEO",
                "IMAGE",
                "FILE"
              ],
              "type": "string",
              "description": "Media userType",
              "example": "IMAGE"
            },
            "description": {
              "type": "string",
              "description": "Description (optional)",
              "example": "This is a media description."
            },
            "ProjectId": {
              "type": "string",
              "description": "Unique identifier of the project",
              "example": "d82686fd-ee9e-4c47-a823-380534e23f73"
            }
          },
          "required": [
            "mediaType",
            "ProjectId"
          ]
        },
        "ProjectMedia": {
          "type": "object",
          "properties": {}
        },
        "RfqItem": {
          "type": "object",
          "properties": {}
        },
        "RfqRequestMaterialDto": {
          "type": "object",
          "properties": {
            "itemName": {
              "type": "string",
              "example": "Cement"
            },
            "rfqCategoryId": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            },
            "description": {
              "type": "string",
              "example": "Dangote Cement"
            },
            "specification": {
              "type": "string",
              "example": "Blocmaster (50kg)"
            },
            "metric": {
              "type": "string",
              "example": "Bags"
            },
            "quantity": {
              "type": "number",
              "maxLength": 10,
              "example": 50
            },
            "budget": {
              "type": "number",
              "maxLength": 10,
              "example": 1000
            }
          },
          "required": [
            "itemName",
            "rfqCategoryId",
            "description",
            "specification",
            "metric",
            "quantity",
            "budget"
          ]
        },
        "CreateRfqRequestDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "Request for quotation for construction materials"
            },
            "canRecieveQuotes": {
              "type": "boolean",
              "example": true
            },
            "budgetVisibility": {
              "type": "boolean",
              "example": false
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-05-01"
            },
            "deliveryAddress": {
              "type": "string",
              "example": "5B Adewale Kolawole Crescent, Lekki - Lagos"
            },
            "deliveryInstructions": {
              "type": "string",
              "example": "Delivery instructions go here"
            },
            "requestType": {
              "enum": [
                "PUBLIC",
                "INVITATION"
              ],
              "type": "string"
            },
            "paymentTerns": {
              "enum": [
                "ESCROW",
                "CREDIT",
                "BNPL",
                "PAY_ON_DELIVERY"
              ],
              "type": "string"
            },
            "tax": {
              "type": "boolean",
              "example": true
            },
            "taxPercentage": {
              "type": "number",
              "nullable": true,
              "example": 5
            },
            "lpo": {
              "type": "string",
              "nullable": true,
              "example": "https://cloudinary.com"
            },
            "projectId": {
              "type": "string",
              "example": "8f2d2e11-9129-44e1-a6f8-6cecf25b3e3b"
            },
            "deliverySchedule": {
              "type": "array",
              "items": {
                "type": "object"
              },
              "example": [
                {
                  "dueDate": "2023-05-01",
                  "quantity": 20,
                  "description": "some description"
                },
                {
                  "dueDate": "2023-05-05",
                  "quantity": 30,
                  "description": "some description"
                }
              ]
            },
            "materials": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/RfqRequestMaterialDto"
              }
            }
          },
          "required": [
            "title",
            "canRecieveQuotes",
            "budgetVisibility",
            "deliveryDate",
            "deliveryAddress",
            "requestType",
            "paymentTerns",
            "tax",
            "projectId",
            "deliverySchedule",
            "materials"
          ]
        },
        "RfqRequestDeliveryScheduleDto": {
          "type": "object",
          "properties": {
            "deliverySchedule": {
              "type": "array",
              "items": {
                "type": "object"
              },
              "example": [
                {
                  "dueDate": "2023-05-01",
                  "quantity": 20,
                  "description": "some description"
                },
                {
                  "dueDate": "2023-05-05",
                  "quantity": 30,
                  "description": "some description"
                }
              ]
            }
          },
          "required": [
            "deliverySchedule"
          ]
        },
        "VendorBidDto": {
          "type": "object",
          "properties": {
            "quoteId": {
              "type": "string"
            },
            "vendorName": {
              "type": "string"
            },
            "quantity": {
              "type": "number"
            },
            "amount": {
              "type": "number"
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "quoteId",
            "vendorName",
            "quantity",
            "amount",
            "deliveryDate"
          ]
        },
        "RFQMaterialDetailsDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "rfq title"
            },
            "id": {
              "type": "string",
              "example": "ff6aa27b-45ec-440f-8bc9-9da7ae3c9e62"
            },
            "category": {
              "type": "string",
              "example": "Cement"
            },
            "budget": {
              "type": "number"
            },
            "deliveryAddress": {
              "type": "string",
              "example": "2024-02-01T09:13:28.025Z"
            },
            "estimatedDeliveryDate": {
              "format": "date-time",
              "type": "string"
            },
            "ongoing": {
              "type": "number"
            },
            "completed": {
              "type": "number"
            },
            "paymentType": {
              "enum": [
                "ESCROW",
                "CREDIT",
                "BNPL",
                "PAY_ON_DELIVERY"
              ],
              "type": "string"
            },
            "bids": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/VendorBidDto"
              }
            }
          },
          "required": [
            "title",
            "id",
            "category",
            "budget",
            "deliveryAddress",
            "estimatedDeliveryDate",
            "ongoing",
            "completed",
            "paymentType",
            "bids"
          ]
        },
        "CreateRfqBargainDTO": {
          "type": "object",
          "properties": {
            "ProjectId": {
              "type": "string",
              "description": "Unique identifier of the project",
              "example": "8539cce5-8bea-49f7-858a-c15ce35fccb1"
            },
            "RfqQuoteId": {
              "type": "string",
              "description": "Unique identifier of the RFQ quote",
              "example": "f695b2aa-6486-451a-a9a3-2d79288691cf"
            },
            "price": {
              "type": "number",
              "description": "Price in DECIMAL(15, 2)",
              "example": 100
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string",
              "description": "Delivery date in ISO 8601 format",
              "example": "2023-10-26T10:00:00.000Z"
            },
            "description": {
              "type": "string",
              "nullable": true,
              "description": "Description (optional)",
              "example": "This is a description."
            }
          },
          "required": [
            "ProjectId",
            "RfqQuoteId",
            "price"
          ]
        },
        "RfqBargain": {
          "type": "object",
          "properties": {}
        },
        "FundWalletDto": {
          "type": "object",
          "properties": {
            "amount": {
              "type": "number",
              "example": 60000
            },
            "description": {
              "type": "string"
            },
            "ref": {
              "type": "string"
            }
          },
          "required": [
            "amount",
            "description"
          ]
        },
        "UserTransaction": {
          "type": "object",
          "properties": {}
        },
        "DeliveryScheduleOrderDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "1deaebc9-7900-49e2-8151-752ce121b220"
            },
            "status": {
              "type": "string",
              "example": "PENDING"
            },
            "quantity": {
              "type": "number",
              "example": 2000
            },
            "description": {
              "type": "string",
              "example": "2000 bags of cement to site 2"
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:27.998Z"
            }
          },
          "required": [
            "id",
            "status",
            "quantity",
            "description",
            "deliveryDate"
          ]
        },
        "BuilderRfqOrderDto": {
          "type": "object",
          "properties": {
            "rfqMaterialName": {
              "type": "string",
              "example": "Cement"
            },
            "id": {
              "type": "string",
              "example": "63816092-8a8f-4f46-86a8-f7a5aa4babe8"
            },
            "category": {
              "type": "string",
              "example": "Accessory"
            },
            "totalQuantity": {
              "type": "number",
              "example": 2000
            },
            "metric": {
              "type": "string",
              "example": "Bags"
            },
            "budget": {
              "type": "number",
              "example": 20000
            },
            "deliveryAddress": {
              "type": "string",
              "example": "B12 Unilever estate "
            },
            "estimatedDeliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:27.998Z"
            },
            "ongoing": {
              "type": "number",
              "example": 10
            },
            "completed": {
              "type": "number",
              "example": 2
            },
            "paymentType": {
              "enum": [
                "ESCROW",
                "CREDIT",
                "BNPL",
                "PAY_ON_DELIVERY"
              ],
              "type": "string",
              "example": "ESCROW"
            },
            "totalCost": {
              "type": "number",
              "example": 19000
            },
            "deliverySchedule_Orders": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DeliveryScheduleOrderDto"
              }
            }
          },
          "required": [
            "rfqMaterialName",
            "id",
            "category",
            "totalQuantity",
            "metric",
            "budget",
            "deliveryAddress",
            "estimatedDeliveryDate",
            "ongoing",
            "completed",
            "paymentType",
            "totalCost",
            "deliverySchedule_Orders"
          ]
        },
        "Order": {
          "type": "object",
          "properties": {}
        },
        "ConfirmDeliveryDto": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "string",
              "example": "063f2945-eff8-4d11-a025-e1b7b2b2d943"
            }
          },
          "required": [
            "orderId"
          ]
        },
        "RateReviewVendorDto": {
          "type": "object",
          "properties": {
            "onTimeDelivery": {
              "type": "number",
              "minimum": 0,
              "maximum": 5,
              "example": 5
            },
            "defectControl": {
              "type": "number",
              "minimum": 0,
              "maximum": 5,
              "example": 5
            },
            "effectiveCommunication": {
              "type": "number",
              "minimum": 0,
              "maximum": 5,
              "example": 5
            },
            "specificationAccuracy": {
              "type": "number",
              "minimum": 0,
              "maximum": 5,
              "example": 5
            },
            "review": {
              "type": "string",
              "example": "Great vendor! Highly recommended."
            },
            "deliveryPictures": {
              "example": [
                "https://picsum.photos/200/300",
                "https://picsum.photos/200/300"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "onTimeDelivery",
            "defectControl",
            "effectiveCommunication",
            "specificationAccuracy",
            "review",
            "deliveryPictures"
          ]
        },
        "CreateDisputeDto": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "example": "Defect"
            },
            "message": {
              "type": "string",
              "example": "Defected wood."
            },
            "proofs": {
              "example": [
                "https://picsum.photos/200/300",
                "https://picsum.photos/200/300"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "reason",
            "message"
          ]
        },
        "SecurityUpdateDTO": {
          "type": "object",
          "properties": {
            "twoFactorAuthEnabled": {
              "type": "boolean",
              "example": true,
              "description": "Enable or disable two-factor authentication."
            },
            "signatures": {
              "example": [
                {
                  "date": "2024-02-01T09:13:27.137Z",
                  "link": "https://example.com/signature1"
                },
                {
                  "date": "2024-02-01T09:13:27.137Z",
                  "link": "https://example.com/signature2"
                }
              ],
              "description": "Array of signature links.",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "emailNotificationEnabled": {
              "type": "boolean",
              "example": true,
              "description": "Enable or disable email notifications."
            },
            "smsNotificationEnabled": {
              "type": "boolean",
              "example": true,
              "description": "Enable or disable SMS notifications."
            }
          },
          "required": [
            "twoFactorAuthEnabled",
            "signatures",
            "emailNotificationEnabled",
            "smsNotificationEnabled"
          ]
        },
        "UpdateBuilderProfileDto": {
          "type": "object",
          "properties": {
            "about": {
              "type": "string",
              "example": "Dealers of quality plumbing pipes"
            },
            "businessName": {
              "type": "string",
              "example": "Makintosh Plastics"
            },
            "businessAddress": {
              "type": "string",
              "example": "B Adewale Kolawole Crescent, Lekki - Lagos"
            },
            "businessSize": {
              "nullable": true,
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "MEDIUM"
            },
            "BankStatement": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "businessRegNo": {
              "type": "string",
              "example": "4MNJ4000AGHZMJ9"
            },
            "UtilityBill": {
              "type": "string",
              "example": "https://example.com/utility.png"
            },
            "isIndividual": {
              "type": "boolean",
              "example": true
            },
            "certificateOfLocation": {
              "type": "string",
              "example": "https://example.com/certi.png"
            },
            "certificateOfIncorporation": {
              "type": "string",
              "example": "certificateOfIncorpaoration.pdf"
            },
            "BusinessContactId": {
              "type": "string",
              "example": "BusinessContactId.pdf"
            },
            "BusinessContactSignature": {
              "type": "string",
              "example": "BusinessContactSignature.pdf"
            },
            "logo": {
              "type": "string",
              "example": "https://example.com/logo.png"
            }
          }
        },
        "BaniVerifyPaymentDto": {
          "type": "object",
          "properties": {
            "BuilderId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6"
            },
            "vend_token": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "pay_ref": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "ContractId": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "pay_amount_collected": {
              "type": "string",
              "example": "200022"
            }
          },
          "required": [
            "vend_token",
            "pay_ref",
            "ContractId"
          ]
        },
        "PaystackVerifyPaymentDto": {
          "type": "object",
          "properties": {
            "BuilderId": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6"
            },
            "title": {
              "type": "string",
              "example": "testing "
            },
            "vend_token": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "pay_ref": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "ContractId": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "pay_amount_collected": {
              "type": "string",
              "example": "200022"
            }
          },
          "required": [
            "BuilderId",
            "title",
            "vend_token",
            "pay_ref",
            "ContractId",
            "pay_amount_collected"
          ]
        },
        "PayforContratcwithWalletDto": {
          "type": "object",
          "properties": {
            "contractId": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6"
            },
            "FundManagerId": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            }
          },
          "required": [
            "contractId",
            "FundManagerId"
          ]
        },
        "CutstructPayDto": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6"
            },
            "VendorEmail": {
              "type": "string",
              "nullable": true,
              "example": "vendor@cutstruct.com"
            },
            "pay_amount_collected": {
              "type": "number",
              "nullable": true,
              "example": 2000000
            },
            "buyerEmail": {
              "type": "string",
              "nullable": true,
              "example": "vendor@cutstruct.com"
            },
            "VendorName": {
              "type": "string",
              "nullable": true,
              "example": "vendor@cutstruct.com"
            },
            "buyerName": {
              "type": "string",
              "nullable": true,
              "example": "vendor@cutstruct.com"
            },
            "reciept_url": {
              "type": "string",
              "example": "reciept link"
            },
            "CreatedById": {
              "type": "string",
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "title": {
              "type": "string",
              "example": "payed for a contract"
            },
            "BuilderId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "VendorId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "vend_token": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "ContractId": {
              "type": "string",
              "nullable": true,
              "example": "83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 "
            },
            "paymentProvider": {
              "enum": [
                "BANI",
                "PAYSTACK",
                "BANKTRANSER",
                "CUTSTRUCT_PAY"
              ],
              "type": "string",
              "example": "BANI, PAYSTACK or BANK"
            },
            "pay_status": {
              "type": "string",
              "enum": [
                "SUCCESS",
                "FAILED",
                "PENDING"
              ]
            }
          },
          "required": [
            "pay_amount_collected",
            "ContractId",
            "pay_status"
          ]
        },
        "VendorRfqCategory": {
          "type": "object",
          "properties": {}
        },
        "AddFundManagersToBuilderDto": {
          "type": "object",
          "properties": {
            "fundmanagersId": {
              "example": [
                "c9f304e1-889e-456a-b6cc-783f97b1387c",
                "4e77cfe7-81a9-4609-a04c-74d90c9e66bb"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "fundmanagersId"
          ]
        },
        "BuilderFundManager": {
          "type": "object",
          "properties": {}
        },
        "FundmanagerPlatformInvitation": {
          "type": "object",
          "properties": {
            "toName": {
              "type": "string",
              "example": "vendor damy"
            },
            "toEmail": {
              "type": "string",
              "example": "joshua@vendor.com"
            },
            "Location": {
              "type": "string",
              "example": "Lagos Nigeria"
            },
            "message": {
              "type": "string",
              "example": "Hi ade, Im inviting you to ...."
            },
            "inviteeName": {
              "type": "string",
              "example": "fundManager brian"
            },
            "invitationId": {
              "type": "string",
              "example": "fundManager brian"
            },
            "projectId": {
              "type": "string",
              "example": "52cefa55-5371-4e61-a501-4d7ccf67c8f2"
            },
            "phoneNumber": {
              "type": "string",
              "nullable": true,
              "example": "+234 000 000 0000"
            }
          },
          "required": [
            "toName",
            "toEmail",
            "message",
            "inviteeName",
            "phoneNumber"
          ]
        },
        "CreateGroupNameDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "example": "A sample group name",
              "description": "The description of the group name"
            },
            "name": {
              "type": "string",
              "example": "Sample Group",
              "description": "The name of the group"
            }
          }
        },
        "GroupName": {
          "type": "object",
          "properties": {}
        },
        "CreateProjectSharesDto": {
          "type": "object",
          "properties": {
            "ProjectId": {
              "type": "string"
            },
            "FundManagerId": {
              "type": "string"
            },
            "BuilderId": {
              "type": "string"
            }
          },
          "required": [
            "ProjectId"
          ]
        },
        "ProjectShares": {
          "type": "object",
          "properties": {}
        },
        "Owner": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Eco Hotel"
            },
            "phone": {
              "type": "string",
              "example": "+2348123445678"
            },
            "email": {
              "type": "string",
              "example": "joshua@builder.com"
            }
          },
          "required": [
            "name",
            "phone",
            "email"
          ]
        },
        "ResponseProjectInviteDto": {
          "type": "object",
          "properties": {
            "dateCreated": {
              "format": "date-time",
              "type": "string",
              "example": "2024-01-26T11:51:27.792Z"
            },
            "location": {
              "type": "string",
              "example": "Project Location share test"
            },
            "title": {
              "type": "string",
              "example": "Project Title"
            },
            "sharedId": {
              "type": "string",
              "example": "237d43ec-8f54-40ed-8a74-706badcdb63c"
            },
            "owner": {
              "$ref": "#/components/schemas/Owner"
            },
            "projectId": {
              "type": "string",
              "example": "84ac580d-7323-43ba-b651-635cbb4dffd8"
            },
            "duration": {
              "type": "string",
              "example": "52 weeks, 11 months, 364 days"
            }
          },
          "required": [
            "dateCreated",
            "location",
            "title",
            "sharedId",
            "owner",
            "projectId",
            "duration"
          ]
        },
        "RfqCategory": {
          "type": "object",
          "properties": {}
        },
        "RegisterVendorDto": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "example": "17078009-33f9-4291-9eec-f26fed7da8bc"
            },
            "businessSize": {
              "nullable": true,
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "LARGE"
            },
            "businessName": {
              "type": "string",
              "example": "Splenzert International"
            },
            "businessContactSignature": {
              "type": "string",
              "nullable": true,
              "example": " https://example.com/document.png"
            },
            "businessAddress": {
              "type": "string",
              "nullable": true,
              "example": "avior VI"
            },
            "businessContactId": {
              "type": "string",
              "nullable": true,
              "example": "bid"
            },
            "businessRegNo": {
              "type": "string",
              "nullable": true,
              "example": "cac_12678905"
            },
            "VendorType": {
              "enum": [
                "MANUFACTURER",
                "DISTRIBUTOR"
              ],
              "type": "string",
              "example": "MANUFACTURER,DISTRIBUTOR"
            },
            "certificateOfIncorporation": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "other": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "UtilityBill": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "logo": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/document.png"
            },
            "categories": {
              "example": [
                "3ff7832c-fd1c-4a85-a3af-16f995b51007",
                "2d8ba111-a07b-4750-8d53-69c0181fd8b6"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "about": {
              "type": "string",
              "nullable": true,
              "example": "About the vendor..."
            }
          },
          "required": [
            "UserId",
            "businessRegNo"
          ]
        },
        "Vendor": {
          "type": "object",
          "properties": {}
        },
        "RegisterVendorFromMarketDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "john_doe@mailer.com"
            },
            "businessName": {
              "type": "string",
              "example": "Johnson and Sons"
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20,
              "example": "password123456"
            }
          }
        },
        "UploadDocumentsDto": {
          "type": "object",
          "properties": {
            "businessCertificate": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "vatCertificate": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "insuranceCertificate": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "proofOfIdentity": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "confirmationOfAddress": {
              "type": "string",
              "example": "https://cloudinary.com"
            }
          },
          "required": [
            "businessCertificate",
            "vatCertificate",
            "insuranceCertificate",
            "proofOfIdentity",
            "confirmationOfAddress"
          ]
        },
        "RfqRequestMaterial": {
          "type": "object",
          "properties": {}
        },
        "CreateVendorRfqBlacklistDto": {
          "type": "object",
          "properties": {
            "RfqRequestId": {
              "type": "string"
            }
          },
          "required": [
            "RfqRequestId"
          ]
        },
        "VendorRfqBlacklist": {
          "type": "object",
          "properties": {}
        },
        "RfqQuoteMaterialDto": {
          "type": "object",
          "properties": {
            "rfqRequestMaterialId": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            },
            "price": {
              "type": "number",
              "example": 1000
            },
            "quantity": {
              "type": "number",
              "example": 50
            },
            "description": {
              "type": "string",
              "example": "Concrete"
            }
          },
          "required": [
            "rfqRequestMaterialId",
            "price",
            "quantity",
            "description"
          ]
        },
        "VendorAcceptRfqOrBargainDTO": {
          "type": "object",
          "properties": {
            "rfqRequestId": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            },
            "canBargain": {
              "type": "boolean",
              "example": true
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-05-01"
            },
            "tax": {
              "type": "number",
              "example": 10
            },
            "logisticCost": {
              "type": "number",
              "example": 1000
            },
            "lpo": {
              "type": "string",
              "example": "https://cloudinary.com"
            },
            "additionalNote": {
              "type": "string",
              "nullable": true,
              "example": "Dangote cement not available but Adenuga cement is what we have"
            },
            "materials": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/RfqQuoteMaterialDto"
              }
            },
            "ProjectId": {
              "type": "string",
              "description": "Unique identifier of the project",
              "example": "8e6b9722-5df7-4df0-aecb-9c1105280f42"
            }
          },
          "required": [
            "rfqRequestId",
            "canBargain",
            "deliveryDate",
            "tax",
            "logisticCost",
            "materials",
            "ProjectId"
          ]
        },
        "DeliveryConfirmationDto": {
          "type": "object",
          "properties": {
            "vendorName": {
              "type": "string",
              "example": "poor communication"
            },
            "buyerName": {
              "type": "string",
              "example": "Defected wood."
            },
            "constructionMaterial": {
              "type": "string",
              "example": "poor communication"
            },
            "buyerEmail": {
              "type": "string",
              "example": "poor communication"
            },
            "orderNumber": {
              "type": "number"
            },
            "deliveryDate": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "vendorName",
            "buyerName",
            "constructionMaterial",
            "buyerEmail",
            "orderNumber",
            "deliveryDate"
          ]
        },
        "RateReviewBuilderDto": {
          "type": "object",
          "properties": {
            "rateScore": {
              "type": "number",
              "minimum": 0,
              "maximum": 5,
              "example": 5
            },
            "review": {
              "type": "string",
              "example": "Great builder! Highly recommended."
            }
          },
          "required": [
            "rateScore",
            "review"
          ]
        },
        "DispatchDto": {
          "type": "object",
          "properties": {
            "startDeliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-05-01"
            },
            "endDeliveryDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-05-01"
            }
          },
          "required": [
            "startDeliveryDate",
            "endDeliveryDate"
          ]
        },
        "DeliverySchedule": {
          "type": "object",
          "properties": {}
        },
        "RequestPayment": {
          "type": "object",
          "properties": {
            "Amount": {
              "type": "number",
              "example": 23456.45
            },
            "description": {
              "type": "string",
              "nullable": true,
              "example": "request for payout for contract completed transaction(s)"
            },
            "proof_docs": {
              "example": [
                "https://www.upload.com/upload.png",
                "https://www.upload.com/upload.png"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "Amount"
          ]
        },
        "Bank": {
          "type": "object",
          "properties": {}
        },
        "UpdateVendorProfileDto": {
          "type": "object",
          "properties": {
            "businessAddress": {
              "type": "string",
              "example": "B Adewale Kolawole Crescent, Lekki - Lagos"
            },
            "phone": {
              "type": "string",
              "example": "+23440404040"
            },
            "name": {
              "type": "string",
              "example": "Joshua Dogubo"
            },
            "about": {
              "type": "string",
              "example": "Dealers of quality plumbing pipes"
            },
            "email": {
              "type": "string",
              "example": "business email"
            },
            "location": {
              "type": "string",
              "example": "Lagos Abuja"
            },
            "logo": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "certificateOfLocation": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "certificateOfIncorporation": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "UtilityBill": {
              "type": "string",
              "example": "https://example.com/logo.png"
            },
            "twoFactorAuthEnabled": {
              "type": "boolean",
              "example": true
            },
            "smsNotificationEnabled": {
              "type": "boolean",
              "example": true
            },
            "emailNotificationEnabled": {
              "type": "boolean",
              "example": true
            },
            "signatures": {
              "example": [
                "https://example.com/sign.png",
                "https://example.com/sign.png"
              ],
              "nullable": true,
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "businessSize": {
              "type": "string",
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ]
            },
            "businessContactId": {
              "type": "string"
            }
          }
        },
        "UpdateVendorDocuments": {
          "type": "object",
          "properties": {
            "PIN_DocumentURl": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/pin_document.pdf",
              "description": "NIN Document URL."
            },
            "CertificateOfLocation": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/certificate_location.pdf",
              "description": "Certificate of Location document."
            },
            "BusinessNameDoc": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/business_name_doc.pdf",
              "description": "Business Name document."
            },
            "BankStatement": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/bank_statement.pdf",
              "description": "Bank Statement document."
            },
            "UtilityBill": {
              "type": "string",
              "nullable": true,
              "example": "https://example.com/utility_bill.pdf",
              "description": "Utility Bill document."
            }
          }
        },
        "UpdateVendorCategoryDto": {
          "type": "object",
          "properties": {
            "RfqCategories": {
              "example": [
                "93e676cd-547d-45a3-8e55-e47aefc73164",
                "6cb58784-6802-40c9-9202-e9faaf921f10"
              ],
              "nullable": false,
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "ResolveAccountDto": {
          "type": "object",
          "properties": {
            "accountNumber": {
              "type": "string",
              "minLength": 10,
              "example": "0022728151"
            },
            "bankCode": {
              "type": "string",
              "example": "063"
            }
          },
          "required": [
            "accountNumber",
            "bankCode"
          ]
        },
        "CreateTemporaryVendorDto": {
          "type": "object",
          "properties": {
            "companyName": {
              "type": "string",
              "example": "John Doe"
            },
            "email": {
              "type": "string",
              "example": "john_doe@mailer.com"
            },
            "phone": {
              "type": "string",
              "example": "+2349123456789"
            },
            "country": {
              "type": "string",
              "example": "Nigeria"
            },
            "categories": {
              "example": [
                "Cement"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "companyName",
            "email",
            "phone",
            "country",
            "categories"
          ]
        },
        "SpecificationDto": {
          "type": "object",
          "properties": {
            "specification": {
              "type": "string",
              "example": "0.16mm"
            },
            "price": {
              "type": "number",
              "example": 400
            }
          },
          "required": [
            "specification",
            "price"
          ]
        },
        "CreateProductDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Coated Binding Wires"
            },
            "image_url": {
              "type": "string",
              "example": "https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png"
            },
            "categoryID": {
              "type": "string",
              "example": "230df39a-4f61-4f7a-a52c-d393297211c9"
            },
            "metricID": {
              "type": "string",
              "example": "29cf3d98-84dc-40f4-b641-eef44b681d56"
            },
            "description": {
              "type": "string",
              "example": "This is a coated binding wire"
            },
            "show_on_retail": {
              "type": "boolean",
              "example": true
            },
            "feature_product": {
              "type": "boolean",
              "example": false
            },
            "show_on_tracker": {
              "type": "boolean",
              "example": false
            },
            "is_todays_pick": {
              "type": "boolean",
              "example": false
            },
            "top_selling_item": {
              "type": "boolean",
              "example": false
            },
            "specsAndPrices": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SpecificationDto"
              }
            }
          },
          "required": [
            "name",
            "image_url",
            "categoryID",
            "metricID",
            "description",
            "show_on_retail",
            "feature_product",
            "show_on_tracker",
            "is_todays_pick",
            "top_selling_item",
            "specsAndPrices"
          ]
        },
        "Product": {
          "type": "object",
          "properties": {}
        },
        "UpdateProductDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "testing 123"
            },
            "categoryID": {
              "type": "string",
              "example": "b21bdf58-bf09-4b53-b43c-22e1eb86caf5"
            },
            "metricID": {
              "type": "string",
              "example": "4da8a201-348c-48cb-974b-b023bb142c09"
            },
            "description": {
              "type": "string",
              "example": "Explore our top-quality construction binding wire, designed for durability and reliability in reinforcing concrete structures. Crafted from high-grade steel with exceptional tensile strength, our binding wires ensure secure connections for your projects. Resistant to corrosion and available in various gauges and lengths, these wires offer long-lasting stability in demanding environments."
            },
            "show_on_retail": {
              "type": "boolean",
              "example": true
            },
            "feature_product": {
              "type": "boolean",
              "example": true
            },
            "is_todays_pick": {
              "type": "boolean",
              "example": true
            },
            "top_selling_item": {
              "type": "boolean",
              "example": true
            },
            "show_on_tracker": {
              "type": "boolean",
              "example": true
            }
          },
          "required": [
            "name",
            "categoryID",
            "metricID",
            "description",
            "show_on_retail",
            "feature_product",
            "is_todays_pick",
            "top_selling_item",
            "show_on_tracker"
          ]
        },
        "AddSpecificationAndPriceToProductDto": {
          "type": "object",
          "properties": {
            "specsAndPrices": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SpecificationDto"
              }
            }
          },
          "required": [
            "specsAndPrices"
          ]
        },
        "CreateCategoryDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Test Category"
            },
            "image_url": {
              "type": "string",
              "example": "https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png"
            }
          },
          "required": [
            "name",
            "image_url"
          ]
        },
        "ProductCategory": {
          "type": "object",
          "properties": {}
        },
        "UpdateCategoryDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "testing 123"
            },
            "image_url": {
              "type": "string",
              "example": "https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png"
            }
          },
          "required": [
            "name",
            "image_url"
          ]
        },
        "CreateMetricDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Test Metric"
            }
          },
          "required": [
            "name"
          ]
        },
        "ProductMetric": {
          "type": "object",
          "properties": {}
        },
        "UpdateMetricDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "testing 123"
            }
          },
          "required": [
            "name"
          ]
        },
        "CreateSpecificationDto": {
          "type": "object",
          "properties": {
            "value": {
              "type": "string",
              "example": "0.16mm"
            }
          },
          "required": [
            "value"
          ]
        },
        "ProductSpecification": {
          "type": "object",
          "properties": {}
        },
        "UpdateSpecificationDto": {
          "type": "object",
          "properties": {
            "value": {
              "type": "string",
              "example": "Testing Specs"
            }
          },
          "required": [
            "value"
          ]
        },
        "AddTeamMemberDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "praise name"
            },
            "email": {
              "type": "string",
              "example": "joshua@abc.com"
            },
            "phoneNumber": {
              "type": "string",
              "description": "User Phone Number",
              "example": "+2348123445678"
            },
            "role": {
              "type": "string",
              "description": "Team Member Role",
              "example": "ADMIN"
            }
          },
          "required": [
            "name",
            "email",
            "phoneNumber",
            "role"
          ]
        },
        "UpdateTeamMemberDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "John Doe"
            },
            "phoneNumber": {
              "type": "string",
              "description": "User Phone Number",
              "example": "+2348123445678"
            },
            "role": {
              "type": "string",
              "description": "Team Member Role",
              "example": "ADMIN"
            }
          },
          "required": [
            "name",
            "phoneNumber",
            "role"
          ]
        },
        "ProductDTO": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "example": "290c11b9-95d6-4307-83b1-756d8b11fb01"
            },
            "specsAndPrices": {
              "type": "string",
              "example": [
                {
                  "specification": "0.16mm",
                  "price": 400
                }
              ]
            }
          },
          "required": [
            "productId",
            "specsAndPrices"
          ]
        },
        "AddProductsToVendorWithSpecsAndPricesDto": {
          "type": "object",
          "properties": {
            "products": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ProductDTO"
              }
            }
          },
          "required": [
            "products"
          ]
        },
        "AddProductsToVendorDto": {
          "type": "object",
          "properties": {
            "productsIDs": {
              "example": [
                "290c11b9-95d6-4307-83b1-756d8b11fb01"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "productsIDs"
          ]
        },
        "AddSpecificationAndPriceToVendorProductDto": {
          "type": "object",
          "properties": {
            "specsAndPrices": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SpecificationDto"
              }
            }
          },
          "required": [
            "specsAndPrices"
          ]
        },
        "VendorProduct": {
          "type": "object",
          "properties": {}
        },
        "CreateTicketDto": {
          "type": "object",
          "properties": {
            "subject": {
              "type": "string",
              "example": "Unable to see vendors"
            },
            "message": {
              "type": "string",
              "example": "I am unable to request for quote on the platform"
            }
          },
          "required": [
            "subject",
            "message"
          ]
        },
        "NewFundManager": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "example": "ca1cb378-901b-4278-a864-b1fdd2e502dd"
            },
            "businessAddress": {
              "type": "string",
              "nullable": true,
              "example": "123 Main St, City vile"
            },
            "businessSize": {
              "enum": [
                "MICRO",
                "SMALL",
                "MEDIUM",
                "LARGE"
              ],
              "type": "string",
              "example": "LARGE"
            },
            "businessRegNo": {
              "type": "string",
              "example": "123-456-789"
            },
            "logo": {
              "type": "string",
              "example": "company_logo.png"
            },
            "about": {
              "type": "string",
              "example": "We FundManager dreams!"
            }
          },
          "required": [
            "UserId"
          ]
        },
        "ChangePasswordDto": {
          "type": "object",
          "properties": {
            "oldPassword": {
              "type": "string"
            },
            "newPassword": {
              "type": "string"
            }
          },
          "required": [
            "oldPassword",
            "newPassword"
          ]
        },
        "fundManagerCreateProjectDto": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "example": "Project Location"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-01-01T12:00:00.000Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2023-12-31T12:00:00.000Z"
            },
            "title": {
              "type": "string",
              "example": "Project Title"
            },
            "budgetAmount": {
              "type": "number",
              "example": 50000
            },
            "description": {
              "type": "string",
              "example": "Project description"
            },
            "newDevelopers": {
              "example": [
                "d1f2c3d5-b720-4e11-b678-678d876e3456",
                "a2b1c3d4-e123-4c67-8a90-098b765c43ef"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "groupIds": {
              "example": [
                "d1f2c3d5-b720-4e11-b678-678d876e3456",
                "a2b1c3d4-e123-4c67-8a90-098b765c43ef"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "projectMedia": {
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BaseProjectMediaUploadDto"
              }
            }
          },
          "required": [
            "location",
            "startDate",
            "endDate",
            "title"
          ]
        },
        "CreateUserProjectDto": {
          "type": "object",
          "properties": {
            "UserId": {
              "type": "string",
              "description": "User ID",
              "example": "123e4567-e89b-12d3-a456-426614174001"
            },
            "ProjectId": {
              "type": "string",
              "description": "Project ID",
              "example": "ec36d84f-4fa3-4c19-843b-5ffcadfc0764"
            }
          },
          "required": [
            "UserId",
            "ProjectId"
          ]
        },
        "InviteBuilderDto": {
          "type": "object",
          "properties": {
            "buyerName": {
              "type": "string",
              "description": "Builder name",
              "example": "Adewale Johnson"
            },
            "buyerEmail": {
              "type": "string",
              "description": "Builder email",
              "example": "donald@gmail.com"
            },
            "buyerPhone": {
              "type": "string",
              "description": "Builder phone",
              "example": "+2345505049303"
            }
          },
          "required": [
            "buyerName",
            "buyerEmail",
            "buyerPhone"
          ]
        },
        "GroupedOrdersByVendorDto": {
          "type": "object",
          "properties": {
            "rfqRequestMaterialId": {
              "type": "string",
              "description": "ID of the related RFQ request material",
              "example": "63b8a39c-4291-4876-87f6-ecc111f4a519"
            },
            "VendorId": {
              "type": "string",
              "description": "ID of the vendor",
              "example": "fa4e6b9d-4b30-4471-a9e1-c8e6d2eb18a8"
            },
            "RfqQuoteId": {
              "type": "string",
              "description": "ID of the related RFQ quote",
              "example": "8bb01051-c812-409d-8f16-4dd6730b95a0"
            },
            "RfqRequestId": {
              "type": "string",
              "description": "ID of the related RFQ request",
              "example": "493565b3-489d-41a3-9d7d-ae6db3734459"
            },
            "ProjectId": {
              "type": "string",
              "description": "ID of the related project",
              "example": "b3178bdf-9439-4e2b-a121-a6fd7d88dca1"
            },
            "PendingOrderCount": {
              "type": "number"
            },
            "status": {
              "type": "string",
              "enum": [
                "PENDING",
                "PAID",
                "COMPLETED",
                "ONGOING",
                "UPCOMING"
              ]
            }
          },
          "required": [
            "rfqRequestMaterialId",
            "VendorId",
            "RfqQuoteId",
            "RfqRequestId",
            "ProjectId",
            "PendingOrderCount",
            "status"
          ]
        },
        "PlatformInvitation": {
          "type": "object",
          "properties": {
            "toName": {
              "type": "string",
              "example": "vendor damy"
            },
            "toEmail": {
              "type": "string",
              "example": "joshua@vendor.com"
            },
            "Location": {
              "type": "string",
              "example": "Lagos Nigeria"
            },
            "message": {
              "type": "string",
              "example": "Hi ade, Im inviting you to ...."
            },
            "inviteeName": {
              "type": "string",
              "example": "fundManager brian"
            },
            "invitationId": {
              "type": "string",
              "example": "fundManager brian"
            },
            "projectId": {
              "type": "string",
              "example": "fundManager brian"
            }
          },
          "required": [
            "toName",
            "toEmail",
            "message",
            "inviteeName"
          ]
        },
        "CreateNewTeamMember": {
          "type": "object",
          "properties": {
            "teamId": {
              "type": "string",
              "description": "Team ID"
            },
            "position": {
              "enum": [
                "ADMIN",
                "OWNER",
                "SUPER_ADMIN",
                "MEMBER"
              ],
              "type": "string",
              "description": "Position within the team (ADMIN, OWNER, SUPER_ADMIN, MEMBER)"
            },
            "name": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "phoneNumber": {
              "type": "string"
            },
            "RoleId": {
              "type": "string"
            }
          },
          "required": [
            "teamId",
            "position",
            "name",
            "email",
            "phoneNumber",
            "RoleId"
          ]
        },
        "Team": {
          "type": "object",
          "properties": {}
        },
        "createUserRoleDto": {
          "type": "object",
          "properties": {
            "RoleId": {
              "type": "string",
              "example": "RoleId"
            },
            "UserId": {
              "type": "string",
              "example": "UserId to assign this role"
            }
          },
          "required": [
            "RoleId",
            "UserId"
          ]
        },
        "UserRole": {
          "type": "object",
          "properties": {}
        },
        "DesignUserRoleDto": {
          "type": "object",
          "properties": {
            "userRoleId": {
              "type": "string",
              "example": "RoleId"
            }
          },
          "required": [
            "userRoleId"
          ]
        },
        "CreatePermissionDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "create"
            },
            "description": {
              "type": "string",
              "example": "This permision grant the ability to create a record in any Resouce it is given to "
            }
          },
          "required": [
            "name",
            "description"
          ]
        },
        "Permission": {
          "type": "object",
          "properties": {}
        },
        "createRolePermissionDto": {
          "type": "object",
          "properties": {
            "RoleId": {
              "type": "string",
              "example": "RoleId"
            },
            "PermissionId": {
              "type": "string",
              "example": "PermissionId"
            }
          },
          "required": [
            "RoleId",
            "PermissionId"
          ]
        },
        "RolePermission": {
          "type": "object",
          "properties": {}
        },
        "DeleteRolePermissionDto": {
          "type": "object",
          "properties": {
            "rolePermissionId": {
              "type": "string",
              "example": "8e3dd546-57c7-490b-baa7-3096313eaa25"
            }
          },
          "required": [
            "rolePermissionId"
          ]
        },
        "CreateResourcesAccessDto": {
          "type": "object",
          "properties": {
            "name": {
              "enum": [
                "Users",
                "Projects",
                "ProjectMedias",
                "Payments",
                "RfqRequests",
                "Contracts",
                "TeamMember",
                "SharedProjects"
              ],
              "type": "string",
              "example": "the resources name must be one of the following eg Users,Projects,ProjectMedias,Payments,RfqRequests,Contracts,TeamMember,SharedProjects"
            }
          },
          "required": [
            "name"
          ]
        },
        "Resource": {
          "type": "object",
          "properties": {}
        },
        "createPermissionResourcesAccess": {
          "type": "object",
          "properties": {
            "PermissionId": {
              "type": "string",
              "example": "ddbb8d43-0d75-4342-9fe8-de678b85bf6d"
            },
            "ResourceId": {
              "type": "string",
              "example": "515c37f2-d4ff-4095-a801-81ab8f1b86c9"
            }
          },
          "required": [
            "PermissionId",
            "ResourceId"
          ]
        },
        "PermissionResource": {
          "type": "object",
          "properties": {}
        },
        "AllBuildersResponseData": {
          "type": "object",
          "properties": {}
        },
        "AddBuilderToFundManagersDto": {
          "type": "object",
          "properties": {
            "buildersId": {
              "example": [
                "5e7ea993-d695-4323-bffc-7e8500962647",
                "5e5892d6-c9c1-4e9b-969d-9ffc8d91eccb"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "buildersId"
          ]
        },
        "BuilderPlatformInvitation": {
          "type": "object",
          "properties": {
            "toName": {
              "type": "string",
              "example": "vendor damy"
            },
            "toEmail": {
              "type": "string",
              "example": "joshua@vendor.com"
            },
            "Location": {
              "type": "string",
              "example": "Lagos Nigeria"
            },
            "message": {
              "type": "string",
              "example": "Hi ade, Im inviting you to ...."
            },
            "inviteeName": {
              "type": "string",
              "example": "fundManager brian"
            },
            "invitationId": {
              "type": "string",
              "example": "fundManager brian"
            },
            "projectId": {
              "type": "string",
              "example": "52cefa55-5371-4e61-a501-4d7ccf67c8f2"
            },
            "phoneNumber": {
              "type": "string",
              "nullable": true,
              "example": "+234 000 000 0000"
            }
          },
          "required": [
            "toName",
            "toEmail",
            "message",
            "inviteeName",
            "phoneNumber"
          ]
        },
        "Brand": {
          "type": "object",
          "properties": {}
        },
        "Chat": {
          "type": "object",
          "properties": {}
        },
        "SendConversationDto": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string",
              "example": "Good Evening"
            },
            "images": {
              "example": [
                "https://picsum.photos/200/300",
                "https://picsum.photos/200/300"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "repliedConversationId": {
              "type": "string",
              "example": "6d0493bd-0d15-40d6-931b-6036f18474e1"
            }
          },
          "required": [
            "text"
          ]
        },
        "startChartDto": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string",
              "example": "Good Evening"
            },
            "images": {
              "example": [
                "https://picsum.photos/200/300",
                "https://picsum.photos/200/300"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "text"
          ]
        },
        "CreateNotificationDto": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Message for the notification",
              "example": "New message with CTAs"
            },
            "logo": {
              "type": "string",
              "description": "notification logo",
              "example": "https://logo.png"
            },
            "ctas": {
              "description": "Array of CTAs for the notification",
              "example": [
                {
                  "label": "Click Me!",
                  "url": "/dashboard"
                }
              ],
              "type": "array",
              "items": {
                "type": "object"
              }
            }
          },
          "required": [
            "message"
          ]
        },
        "Notification": {
          "type": "object",
          "properties": {}
        },
        "Blog": {
          "type": "object",
          "properties": {}
        },
        "CreateRetailUserDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "John Doe"
            },
            "email": {
              "type": "string",
              "example": "john_doe@mailer.com"
            },
            "phone": {
              "type": "string",
              "example": "+2349123456789"
            },
            "enquiry": {
              "type": "string",
              "example": "Cement"
            },
            "is_phone_number_on_whatsapp": {
              "type": "boolean",
              "example": true
            },
            "can_receive_marketing_info": {
              "type": "boolean",
              "example": true
            }
          },
          "required": [
            "name",
            "email",
            "phone",
            "enquiry",
            "is_phone_number_on_whatsapp",
            "can_receive_marketing_info"
          ]
        },
        "RetailUser": {
          "type": "object",
          "properties": {}
        },
        "ProductDto": {
          "type": "object",
          "properties": {
            "item_description": {
              "type": "string",
              "example": "Cement"
            },
            "budget": {
              "type": "number",
              "example": 15000
            },
            "quantity": {
              "type": "number",
              "example": 10
            },
            "productSpecificationProductID": {
              "type": "string",
              "example": "1ef8bfe8-f5b6-4e78-b088-08fc43aac34f"
            },
            "vendorProductSpecificationProductID": {
              "type": "string",
              "example": "1ef8bfe8-f5b6-4e78-b088-08fc43aac34f"
            },
            "description": {
              "type": "string",
              "example": "Testing"
            },
            "transaction_type": {
              "enum": [
                "SERVICE",
                "PRODUCT"
              ],
              "type": "string",
              "example": "PRODUCT"
            },
            "specification": {
              "type": "string",
              "example": "0.16mm"
            },
            "quantity_unit": {
              "type": "string",
              "example": "Nos"
            }
          },
          "required": [
            "item_description",
            "budget",
            "quantity",
            "productSpecificationProductID",
            "vendorProductSpecificationProductID",
            "description",
            "transaction_type",
            "specification",
            "quantity_unit"
          ]
        },
        "ServiceDto": {
          "type": "object",
          "properties": {
            "item_description": {
              "type": "string",
              "example": "DSTV Technician"
            },
            "budget": {
              "type": "number",
              "example": 30000
            },
            "specification": {
              "type": "string",
              "example": "Commercial"
            },
            "duration": {
              "type": "number",
              "example": 5
            },
            "quantity": {
              "type": "number",
              "example": 10
            },
            "labourHackID": {
              "type": "string",
              "example": "2f34ff1c-2d20-4950-9c68-3405f421388f"
            },
            "transaction_type": {
              "enum": [
                "SERVICE",
                "PRODUCT"
              ],
              "type": "string",
              "example": "SERVICE"
            },
            "duration_unit": {
              "enum": [
                "DAYS",
                "WEEKS",
                "MONTHS"
              ],
              "type": "string",
              "example": "DAYS"
            },
            "description": {
              "type": "string",
              "example": "tt"
            }
          },
          "required": [
            "item_description",
            "budget",
            "specification",
            "duration",
            "quantity",
            "labourHackID",
            "transaction_type",
            "duration_unit",
            "description"
          ]
        },
        "UserDetailsDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "imeh.usoro@cutstruct.com"
            },
            "delivery_address": {
              "type": "string",
              "example": "256 Chapman Road STE 105-4"
            }
          },
          "required": [
            "email",
            "delivery_address"
          ]
        },
        "CreateRetailTransactionDto": {
          "type": "object",
          "properties": {
            "products": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ProductDto"
              }
            },
            "services": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ServiceDto"
              }
            },
            "retail_user_details": {
              "$ref": "#/components/schemas/UserDetailsDto"
            }
          },
          "required": [
            "products",
            "services",
            "retail_user_details"
          ]
        },
        "RetailTransaction": {
          "type": "object",
          "properties": {}
        },
        "CreateLabourHackDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Test Labour"
            },
            "specification": {
              "type": "string",
              "enum": [
                "DOMESTIC",
                "COMMERCIAL",
                "INDUSTRIAL"
              ],
              "example": "DOMESTIC"
            }
          },
          "required": [
            "name",
            "specification"
          ]
        },
        "LabourHack": {
          "type": "object",
          "properties": {}
        },
        "superAdminCreateFundManagerDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "fundManager@cutstruct.com"
            },
            "businessName": {
              "type": "string",
              "example": "Gath Enterprise"
            },
            "name": {
              "type": "string",
              "example": "Andrew Allison"
            },
            "phone": {
              "type": "string",
              "example": "+2348000000000"
            }
          },
          "required": [
            "email",
            "businessName",
            "name",
            "phone"
          ]
        },
        "superAdminCreateFundManageProjectDto": {
          "type": "object",
          "properties": {
            "builderId": {
              "type": "string",
              "example": "1a450751-bb39-4b00-9c39-e508a6a23e46"
            },
            "description": {
              "type": "string",
              "example": "project description"
            },
            "title": {
              "type": "string",
              "example": "2024-02-01T09:13:28.254Z"
            },
            "image": {
              "type": "string",
              "example": "project image url"
            },
            "fileName": {
              "type": "string",
              "example": "project image file name"
            },
            "location": {
              "type": "string",
              "example": "project location"
            },
            "message": {
              "type": "string",
              "example": "message for the invitee"
            },
            "inviteeEmail": {
              "type": "string",
              "example": "invitee email address"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:28.255Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-02-01T09:13:28.257Z"
            }
          },
          "required": [
            "builderId",
            "description",
            "title",
            "image",
            "fileName",
            "location",
            "message",
            "inviteeEmail",
            "startDate",
            "endDate"
          ]
        },
        "UpdateFundManagerDto": {
          "type": "object",
          "properties": {
            "businessRegNo": {
              "type": "string",
              "example": "A1-234566"
            },
            "businessSize": {
              "type": "string",
              "example": "MICRO"
            },
            "businessAddress": {
              "type": "string",
              "example": "2 waka street makurdi"
            }
          },
          "required": [
            "businessRegNo",
            "businessSize",
            "businessAddress"
          ]
        },
        "superAdminCreateBuilderDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "builder@cutstruct.com"
            },
            "businessName": {
              "type": "string",
              "example": "Eazy concept"
            },
            "name": {
              "type": "string",
              "example": "Andrew Allison"
            },
            "phone": {
              "type": "string",
              "example": "+2348000000000"
            }
          },
          "required": [
            "email",
            "businessName",
            "name",
            "phone"
          ]
        },
        "superAdminCreateBuilderProjectDto": {
          "type": "object",
          "properties": {
            "fundManagerId": {
              "type": "string",
              "example": "1a450751-bb39-4b00-9c39-e508a6a23e46"
            },
            "description": {
              "type": "string",
              "example": "project description"
            },
            "title": {
              "type": "string",
              "example": "project title"
            },
            "image": {
              "type": "string",
              "example": "project title"
            },
            "fileName": {
              "type": "string",
              "example": "project title"
            },
            "location": {
              "type": "string",
              "example": "project lovation"
            },
            "message": {
              "type": "string",
              "example": "message for the invitee"
            },
            "inviteeEmail": {
              "type": "string",
              "example": "invitee email address"
            },
            "startDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-01-28T20:07:22.602Z"
            },
            "endDate": {
              "format": "date-time",
              "type": "string",
              "example": "2024-01-28T20:07:22.602Z"
            }
          },
          "required": [
            "fundManagerId",
            "description",
            "title",
            "image",
            "fileName",
            "location",
            "message",
            "inviteeEmail",
            "startDate",
            "endDate"
          ]
        },
        "UpdateBuilderDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "fundManager@cutstruct.com"
            },
            "businessName": {
              "type": "string",
              "example": "dele@gmail.com"
            },
            "name": {
              "type": "string",
              "example": "Andrew Allison"
            },
            "phone": {
              "type": "string",
              "example": "+2348000000000"
            }
          },
          "required": [
            "email",
            "businessName",
            "name",
            "phone"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
