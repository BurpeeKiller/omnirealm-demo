# API Documentation - OmniScan v2.0

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

L'authentification se fait via Supabase. Les tokens doivent être inclus dans le header :

```
Authorization: Bearer <access_token>
```

## Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-22T10:00:00Z",
  "version": "2.0.0",
  "environment": "development"
}
```

### Authentication

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Document Upload

```http
POST /upload
Content-Type: multipart/form-data

file: <binary>
user_id: <uuid> (optional)
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "status": "processing",
  "message": "Document en cours de traitement"
}
```

### Get Document

```http
GET /documents/{document_id}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "status": "completed",
  "extracted_text": "...",
  "ai_analysis": {
    "summary": "...",
    "key_points": ["..."],
    "entities": ["..."],
    "language": "fr"
  },
  "created_at": "2024-01-22T10:00:00Z",
  "processed_at": "2024-01-22T10:01:00Z"
}
```

## Status Codes

- `200` : Succès
- `400` : Requête invalide
- `401` : Non authentifié
- `404` : Ressource non trouvée
- `500` : Erreur serveur