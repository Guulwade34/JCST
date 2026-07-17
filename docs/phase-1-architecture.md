# Phase 1 Architecture

## Architectural decision

JCST uses an npm-workspace monorepo with three independently buildable packages:

```text
Browser
  -> React/Vite client
     -> Axios API client
        -> Express /api/v1
           -> Zod validation and security middleware
              -> authentication domain service
                 -> Mongoose models
                    -> MongoDB

Shared contracts
  -> @jcst/shared
     -> API response types
     -> authentication schemas
     -> role and permission constants
```

## Security boundaries

1. Access tokens are short-lived and sent only in the `Authorization` header.
2. Refresh tokens are signed JWTs stored in signed, HTTP-only cookies.
3. Only a SHA-256 digest of each refresh token is stored in MongoDB.
4. Every refresh rotates the token and revokes the prior session record.
5. Reuse or concurrent rotation revokes the complete refresh-token family.
6. The authentication middleware reloads the user from MongoDB before authorizing access.
7. Roles and permissions are enforced by reusable backend middleware.
8. Password hashes, refresh tokens, and permission arrays are never included in public user responses.

## Data model indexes

### Users

- Unique normalized email index
- Role and status compound index
- Status index
- Archive timestamp index

### Refresh sessions

- Unique token-hash index
- User index
- Family index
- Active-user compound index
- TTL index on `expiresAt`

## Frontend state

TanStack Query owns request lifecycle and mutation state. Zustand stores only the in-memory access token,
current safe user, and authentication hydration state. Refresh tokens never enter JavaScript-readable storage.

## Branding

The official logo is referenced from `client/public/branding/jcst-logo.png`. The asset must be copied there
without recoloring, cropping, distortion, or recreation. The palette and type tokens are defined in
`client/tailwind.config.ts` and `client/src/styles/index.css`.
