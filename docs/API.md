# API Reference — Kaamao

All API routes are under `/api`. Server-side only — do not call directly from external clients without proper authentication.

---

## Authentication

Protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <supabase_access_token>
```

The token is the JWT from the active Supabase session (`session.access_token`).

---

## Endpoints

### POST `/api/auth/signup`

Register a new user account.

**Rate limit:** 5 requests / 15 minutes per IP

**Request body:**

```json
{
  "fullName": "Jane Doe",
  "phoneNo": "9876543210",
  "password": "securepassword",
  "email": "jane@example.com", // optional
  "dob": "1995-06-15", // optional, YYYY-MM-DD
  "location": "Mumbai" // optional
}
```

**Response `200`:**

```json
{ "success": true, "message": "Account created successfully! Please login." }
```

**Response `400`:**

```json
{
  "error": "This phone number or email is already registered. Please login instead."
}
```

**Response `429`:**

```json
{ "error": "Too many signup attempts. Please wait before trying again." }
```

---

### GET `/api/likes?serviceId=<uuid>`

Check whether the authenticated user has liked a service.

**Auth:** Optional — returns `{ liked: false }` for unauthenticated requests.

**Response `200`:**

```json
{ "liked": true }
```

---

### POST `/api/likes`

Like or unlike a service.

**Auth:** Required

**Rate limit:** 30 requests / minute per IP

**Request body:**

```json
{
  "serviceId": "00000000-0000-0000-0000-000000000001",
  "action": "like" // or "unlike"
}
```

**Response `200`:**

```json
{
  "success": true,
  "liked": true,
  "likesCount": 42
}
```

**Response `400`:**

```json
{ "error": "You cannot like your own service listing." }
```

**Response `429`:**

```json
{ "error": "Too many requests. Please slow down." }
```

---

### GET `/api/reviews?serviceId=<uuid>`

Fetch all reviews for a service. Self-reviews (service owner reviewing themselves) are filtered out.

**Auth:** Not required

**Response `200`:**

```json
{
  "success": true,
  "reviews": [
    {
      "id": "review-uuid",
      "service_id": "service-uuid",
      "user_id": "user-uuid",
      "rating": 5,
      "review": "Excellent tutor!",
      "created_at": "2025-01-01T00:00:00Z",
      "users": {
        "full_name": "Jane Doe",
        "about": "Software Engineer"
      }
    }
  ]
}
```

---

### POST `/api/reviews`

Submit a review for a service.

**Auth:** Required

**Rate limit:** 10 requests / minute per IP

**Request body:**

```json
{
  "serviceId": "00000000-0000-0000-0000-000000000001",
  "rating": 5,
  "comment": "Excellent service!" // optional, max 2000 chars
}
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Review posted successfully",
  "averageRating": 4.8,
  "totalReviews": 23
}
```

**Response `400`:**

```json
{ "error": "You have already submitted a review for this tutor/service." }
```

**Response `404`:**

```json
{ "error": "Service listing not found." }
```

---

## Error Response Format

All errors follow the same shape:

```json
{ "error": "Human-readable error message" }
```

HTTP status codes used:

| Status | Meaning                                               |
| ------ | ----------------------------------------------------- |
| `200`  | Success                                               |
| `400`  | Bad request / validation error / business logic error |
| `401`  | Unauthorized (missing or invalid token)               |
| `404`  | Resource not found                                    |
| `429`  | Rate limit exceeded                                   |
| `500`  | Internal server error                                 |
| `503`  | Service unavailable (misconfigured env)               |
