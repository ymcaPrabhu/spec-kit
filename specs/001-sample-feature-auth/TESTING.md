# Testing Guide

## Overview

This document describes the testing strategy for the authentication feature.

## Test Structure

### Unit Tests
Located in `server/src/__tests__/`:
- `password.test.ts` - Password hashing and verification
- `validation.test.ts` - Email and password validation
- `logger.test.ts` - Logging and sanitization

### Integration Tests
Located in `server/src/__tests__/`:
- `auth.integration.test.ts` - API endpoint testing

## Running Tests

```bash
cd server
npm test
```

### Run with coverage:
```bash
npm test -- --coverage
```

## Test Requirements

- Minimum 80% code coverage
- All critical paths tested
- Performance tests for 2-second login requirement
- Load tests for 1000 concurrent users

## Manual Testing

### 1. Registration Flow
1. Open http://localhost:3000
2. Click "Register"
3. Enter valid email and password (min 8 chars)
4. Submit form
5. Verify success message
6. Check password is hashed in database

### 2. Login Flow
1. Click "Login"
2. Enter registered email and password
3. Submit form
4. Verify user is logged in
5. Verify session cookie is set
6. Measure login time (should be < 2 seconds)

### 3. Logout Flow
1. While logged in, click "Logout"
2. Verify redirect to login page
3. Verify session is destroyed
4. Try accessing protected routes - should fail

### 4. Password Reset Flow
1. Click "Reset Password"
2. Enter registered email
3. Check server logs for reset token
4. Enter token and new password
5. Verify password is updated
6. Login with new password

### 5. Security Checks
- [ ] Passwords are hashed with bcrypt (10+ rounds)
- [ ] No plaintext passwords in logs
- [ ] Session cookies are HTTP-only
- [ ] Session cookies use SameSite=strict
- [ ] Sessions expire after 24 hours
- [ ] Reset tokens expire after 1 hour
- [ ] Email validation works correctly
- [ ] Duplicate emails are rejected

### 6. Performance Testing

For load testing with 1000 concurrent users, use tools like:
- Apache JMeter
- Artillery
- k6

Example with Artillery:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 1000
scenarios:
  - flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
```

## Debugging Tests

Enable debug mode:
```bash
DEBUG=* npm test
```

## Continuous Integration

Tests should run automatically on:
- Pull requests
- Main branch commits
- Before deployments

Ensure all tests pass before merging code.
