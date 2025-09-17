# 📚 API Documentation - Web Empresa

Documentación completa de la API REST de **Web Empresa** construida con FastAPI.

---

## 🌐 API Base Information

- **Base URL**: `http://localhost:8002` (desarrollo)
- **API Version**: v1
- **Documentation**: `http://localhost:8002/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8002/redoc` (ReDoc)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

---

## 🔐 Authentication

### 🎯 Login
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true
  }
}
```

### 🔑 Using Authentication
Include the token in all authenticated requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👤 Users API

### 📋 Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "is_active": true,
  "date_joined": "2024-01-01T00:00:00Z",
  "last_login": "2024-01-01T12:00:00Z"
}
```

### 👥 List Users (Admin Only)
```http
GET /api/v1/users/
Authorization: Bearer {token}
```

**Query Parameters:**
- `skip`: int = 0 - Pagination offset
- `limit`: int = 100 - Pagination limit

### ➕ Create User (Admin Only)
```http
POST /api/v1/users/
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "editor"
}
```

---

## 📄 Page Content API

### 📖 Get Page Content
```http
GET /api/v1/page-content/{page_key}
```

**Parameters:**
- `page_key`: string - One of: `homepage`, `about`, `history`, `clients`, `pricing`, `contact`, `footer`, `navigation`

**Response:**
```json
{
  "id": 1,
  "page_key": "homepage",
  "title": "Página de Inicio",
  "content_json": {
    "hero_title": "Bienvenido a Web Empresa",
    "hero_subtitle": "Sistema completo de gestión",
    "features": [
      {
        "title": "Feature 1",
        "description": "Description",
        "icon": "Star"
      }
    ]
  },
  "meta_title": "Inicio - Web Empresa",
  "meta_description": "Sistema de gestión empresarial",
  "meta_keywords": "empresa, gestión, web",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### ✏️ Update Page Content (Auth Required)
```http
PUT /api/v1/page-content/{page_key}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Página de Inicio Actualizada",
  "content_json": {
    "hero_title": "Nuevo título",
    "hero_subtitle": "Nuevo subtítulo"
  },
  "meta_title": "Nuevo meta título",
  "meta_description": "Nueva descripción",
  "is_active": true
}
```

### ➕ Create Page Content (Auth Required)
```http
POST /api/v1/page-content/
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "page_key": "new_page",
  "title": "Nueva Página",
  "content_json": {},
  "meta_title": "Nueva Página",
  "meta_description": "Descripción de nueva página",
  "is_active": true
}
```

---

## 💰 Service Plans API

### 📋 List Plans
```http
GET /api/v1/plans/
```

**Query Parameters:**
- `skip`: int = 0 - Pagination offset
- `limit`: int = 100 - Pagination limit
- `active_only`: bool = false - Only active plans

**Response:**
```json
[
  {
    "id": 1,
    "name": "Plan Básico",
    "slug": "plan-basico",
    "description": "Plan perfecto para empezar",
    "price_monthly": 29.99,
    "price_yearly": 299.99,
    "features": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    "max_users": 5,
    "max_courses": 10,
    "storage_gb": 1,
    "color_primary": "#3B82F6",
    "color_secondary": "#1E40AF",
    "is_active": true,
    "is_popular": false,
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

### 📖 Get Plan Details
```http
GET /api/v1/plans/{plan_id}
```

### ➕ Create Plan (Auth Required)
```http
POST /api/v1/plans/
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Nuevo Plan",
  "description": "Descripción del plan",
  "price_monthly": 49.99,
  "price_yearly": 499.99,
  "features": ["Feature 1", "Feature 2"],
  "max_users": 10,
  "max_courses": 50,
  "storage_gb": 5,
  "color_primary": "#10B981",
  "is_active": true,
  "is_popular": false,
  "display_order": 2
}
```

### ✏️ Update Plan (Auth Required)
```http
PUT /api/v1/plans/{plan_id}
Authorization: Bearer {token}
```

### 🗑️ Delete Plan (Auth Required)
```http
DELETE /api/v1/plans/{plan_id}
Authorization: Bearer {token}
```

---

## 📧 Contact Messages API

### 📋 List Messages (Auth Required)
```http
GET /api/v1/contact/
Authorization: Bearer {token}
```

**Query Parameters:**
- `skip`: int = 0 - Pagination offset
- `limit`: int = 100 - Pagination limit
- `status`: string - Filter by status: `new`, `in_progress`, `resolved`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+1234567890",
    "message": "Mensaje de consulta",
    "status": "new",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### ➕ Create Message (Public)
```http
POST /api/v1/contact/
```

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "message": "Hola, me interesa obtener más información sobre sus servicios."
}
```

### ✏️ Update Message Status (Auth Required)
```http
PUT /api/v1/contact/{message_id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

### 📖 Get Message Details (Auth Required)
```http
GET /api/v1/contact/{message_id}
Authorization: Bearer {token}
```

---

## 🔍 Health Check & Info

### ❤️ Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### ℹ️ API Info
```http
GET /
```

**Response:**
```json
{
  "name": "Web Empresa API",
  "version": "1.0.0",
  "description": "API for Web Empresa CMS",
  "docs_url": "/docs",
  "redoc_url": "/redoc"
}
```

---

## 📊 Response Formats

### ✅ Success Response
```json
{
  "data": {...},
  "message": "Operation completed successfully",
  "status": "success"
}
```

### ❌ Error Response
```json
{
  "detail": "Error description",
  "error_code": "VALIDATION_ERROR",
  "status": "error"
}
```

### 📋 Paginated Response
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 20,
  "pages": 5
}
```

---

## 🚨 HTTP Status Codes

| Code | Description | When |
|------|-------------|------|
| **200** | OK | Successful GET, PUT requests |
| **201** | Created | Successful POST requests |
| **204** | No Content | Successful DELETE requests |
| **400** | Bad Request | Invalid request data |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource not found |
| **422** | Unprocessable Entity | Validation errors |
| **500** | Internal Server Error | Server errors |

---

## 🔧 Error Handling

### 🛡️ Validation Errors (422)
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "price_monthly"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

### 🔐 Authentication Errors (401)
```json
{
  "detail": "Could not validate credentials"
}
```

### 🚫 Permission Errors (403)
```json
{
  "detail": "Not enough permissions"
}
```

---

## 📝 Data Models

### 🏷️ User Model
```typescript
interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: "super_admin" | "admin" | "editor" | "moderator" | "viewer"
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
  last_login?: string
}
```

### 📄 PageContent Model
```typescript
interface PageContent {
  id: number
  page_key: string
  title: string
  content_json: Record<string, any>
  meta_title: string
  meta_description: string
  meta_keywords: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### 💰 ServicePlan Model
```typescript
interface ServicePlan {
  id: number
  name: string
  slug: string
  description: string
  price_monthly: number
  price_yearly?: number
  monthly_savings: number
  max_users: number
  max_courses: number
  storage_gb: number
  api_requests_limit: number
  features: string[]
  color_primary: string
  color_secondary: string
  is_active: boolean
  is_popular: boolean
  display_order: number
  created_at: string
  updated_at: string
}
```

### 📧 ContactMessage Model
```typescript
interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  status: "new" | "in_progress" | "resolved"
  created_at: string
  updated_at: string
}
```

---

## 🧪 Testing the API

### 🔧 Using cURL
```bash
# Login
curl -X POST "http://localhost:8002/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'

# Get page content
curl -X GET "http://localhost:8002/api/v1/page-content/homepage"

# Create contact message
curl -X POST "http://localhost:8002/api/v1/contact/" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

### 📋 Using JavaScript/Axios
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Login
const login = async (username, password) => {
  const response = await api.post('/api/v1/auth/login', {
    username,
    password
  })
  
  // Set token for future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
  
  return response.data
}

// Get page content
const getPageContent = async (pageKey) => {
  const response = await api.get(`/api/v1/page-content/${pageKey}`)
  return response.data
}

// Update page content
const updatePageContent = async (pageKey, data) => {
  const response = await api.put(`/api/v1/page-content/${pageKey}`, data)
  return response.data
}
```

### 🐍 Using Python/Requests
```python
import requests

BASE_URL = "http://localhost:8002"

# Login
def login(username, password):
    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "username": username,
        "password": password
    })
    return response.json()

# Get page content
def get_page_content(page_key):
    response = requests.get(f"{BASE_URL}/api/v1/page-content/{page_key}")
    return response.json()

# Create contact message
def create_contact_message(name, email, message):
    response = requests.post(f"{BASE_URL}/api/v1/contact/", json={
        "name": name,
        "email": email,
        "message": message
    })
    return response.json()
```

---

## 🔒 Security Considerations

### 🛡️ Authentication
- JWT tokens expire in 30 minutes by default
- Tokens should be stored securely (httpOnly cookies recommended for web)
- Use HTTPS in production
- Implement token refresh mechanism

### 🔐 Authorization
- Role-based access control (RBAC)
- Endpoint-level permission checks
- Resource-level authorization when needed

### 🧹 Input Validation
- All inputs validated with Pydantic schemas
- SQL injection protection via SQLAlchemy ORM
- XSS prevention through proper escaping

### 🌐 CORS
- Configured for specific origins in production
- Wildcard (*) only in development

---

## 📈 Rate Limiting & Performance

### ⏱️ Rate Limiting
Currently not implemented but recommended for production:
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute for authenticated users
- Implement with Redis + FastAPI middleware

### 🚀 Performance Tips
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Use async/await for I/O operations
- Monitor with tools like Prometheus

---

## 🔮 Roadmap

### 🎯 Planned API Features
- [ ] **File Upload**: Endpoints for image/document management
- [ ] **WebSocket**: Real-time notifications
- [ ] **GraphQL**: Alternative query interface
- [ ] **API Versioning**: v2 with enhanced features
- [ ] **Webhooks**: Event-driven integrations
- [ ] **Analytics**: Usage metrics and reporting

---

## 📞 Support

- 📚 **Interactive Docs**: http://localhost:8002/docs
- 🔧 **Alternative Docs**: http://localhost:8002/redoc
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tu-usuario/webempresa/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/webempresa)

---

<div align="center">

**🚀 FastAPI powering Web Empresa's backend! ⚡**

[🏠 README](../README.md) • [🎯 Features](FEATURES.md) • [🐳 Docker](DOCKER.md) • [🤝 Contributing](../CONTRIBUTING.md)

</div>
