# Azure B2C Tenant Migration Specification

## Overview
Migrate the corporate website authentication from the Client_Proj Azure B2C tenant to the product tenant, enabling any user with a DQ product account to access the corporate site using their existing credentials.

---

## Current State

### Authentication Configuration
- **Current Tenant**: `dqproj.onmicrosoft.com` (Client_Proj tenant)
- **Client ID**: `f996140d-d79b-419d-a64c-f211d23a38ad`
- **Login Host**: `dqproj.ciamlogin.com`
- **Policy**: `F1_CustomerSUSILocal_KF`
- **Authentication Library**: MSAL (Microsoft Authentication Library)
- **Implementation**: `src/services/auth/msal.ts`

### Current User Flow
1. User clicks "My DQ" or any sign-in button
2. Redirected to Azure B2C login page (Client_Proj tenant)
3. User authenticates with Client_Proj credentials
4. Redirected back to corporate site with access token
5. User profile stored in localStorage

---

## Requirements

### Functional Requirements

#### FR-1: Product Tenant Authentication
- Users must authenticate against the product tenant instead of Client_Proj tenant
- All existing DQ product users should be able to log in with their current credentials
- No user re-registration or password reset required

#### FR-2: Seamless User Experience
- Login flow should remain unchanged from user perspective
- Existing authenticated sessions should be handled gracefully during migration
- Post-login experience should remain identical

#### FR-3: Session Management
- Maintain existing session handling (localStorage)
- Support refresh tokens for persistent sessions
- Implement proper logout functionality

#### FR-4: Backward Compatibility
- Ensure existing protected routes continue to work
- Maintain current authorization context and hooks
- Preserve user profile structure

### Non-Functional Requirements

#### NFR-1: Security
- Use HTTPS for all authentication flows
- Implement PKCE (Proof Key for Code Exchange) flow
- Store tokens securely in browser storage
- Validate tokens on each protected route access

#### NFR-2: Performance
- Authentication should complete within 3 seconds
- Token refresh should be transparent to users
- Minimize authentication-related network calls

#### NFR-3: Reliability
- Handle network failures gracefully
- Implement retry logic for token refresh
- Provide clear error messages for authentication failures

---

## Technical Design

### Architecture Changes

#### Configuration Updates Required

**Environment Variables** (`.env`)
```env
# Product Tenant Configuration
VITE_AZURE_CLIENT_ID=<new-product-tenant-client-id>
VITE_B2C_TENANT_NAME=<product-tenant-name>
VITE_AZURE_SUBDOMAIN=<product-subdomain>
VITE_B2C_POLICY_SIGNUP_SIGNIN=<product-policy-name>
VITE_IDENTITY_HOST=<product-tenant-host>

# Optional: Separate signup policy
VITE_B2C_POLICY_SIGNUP=<product-signup-policy>

# Optional: Graph API fallback
VITE_MSAL_ENABLE_GRAPH_FALLBACK=true
```

**Example Values**
```env
VITE_AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_B2C_TENANT_NAME=dqproduct
VITE_AZURE_SUBDOMAIN=dqproduct
VITE_B2C_POLICY_SIGNUP_SIGNIN=B2C_1_SignUpSignIn
VITE_IDENTITY_HOST=dqproduct.ciamlogin.com
```

#### Azure B2C Configuration

**Product Tenant Setup**
1. Register new application in product tenant Azure B2C
2. Configure redirect URIs:
   - Development: `http://localhost:3000`
   - Staging: `https://staging.dq.com`
   - Production: `https://www.dq.com`
3. Enable implicit grant flow (if needed)
4. Configure API permissions:
   - `openid`
   - `profile`
   - `email`
   - `offline_access`
5. Set up user flows:
   - Sign-up and sign-in flow
   - Password reset flow
   - Profile editing flow

**Application Registration Settings**
- **Name**: DQ Corporate Website
- **Supported account types**: Accounts in this organizational directory only
- **Platform**: Single-page application (SPA)
- **Token configuration**: Include email claim

### Implementation Plan

#### Phase 1: Azure Configuration (Azure Portal)

**Tasks:**
1. Create new app registration in product tenant
2. Configure redirect URIs for all environments
3. Set up user flows and policies
4. Configure token claims (email, name, objectId)
5. Test authentication flow in Azure B2C test environment
6. Document new Client ID and tenant details

**Deliverables:**
- New Client ID
- Tenant name and subdomain
- Policy names
- Redirect URIs configured

#### Phase 2: Code Configuration (Development)

**Tasks:**
1. Update `.env` files for all environments
2. Update `.env.example` with new variable structure
3. Test MSAL configuration with new tenant locally
4. Verify token structure and claims
5. Update documentation

**Files to Modify:**
- `.env` (all environments)
- `.env.example`
- `docs/MSAL_SETUP_GUIDE.md`

**No Code Changes Required:**
The existing `src/services/auth/msal.ts` is already designed to read from environment variables, so no code modifications are needed.

#### Phase 3: Testing

**Test Scenarios:**

1. **New User Login**
   - User with product account logs in for first time
   - Verify profile data is captured correctly
   - Verify session persists across page refreshes

2. **Existing User Migration**
   - Clear localStorage to simulate new session
   - Login with product credentials
   - Verify all protected routes accessible

3. **Token Refresh**
   - Wait for token expiration
   - Verify automatic token refresh
   - Verify no user interruption

4. **Logout Flow**
   - User logs out
   - Verify tokens cleared from storage
   - Verify redirect to logout page
   - Verify cannot access protected routes

5. **Error Scenarios**
   - Invalid credentials
   - Network failure during auth
   - Token refresh failure
   - Expired session

**Test Environments:**
- Local development
- Staging environment
- Production (limited rollout)

#### Phase 4: Deployment

**Deployment Strategy: Blue-Green Deployment**

1. **Preparation**
   - Deploy to staging with new configuration
   - Run full test suite
   - Verify all authentication flows

2. **Production Rollout**
   - Deploy to production during low-traffic window
   - Monitor authentication success rates
   - Keep rollback plan ready

3. **Monitoring**
   - Track authentication failures
   - Monitor token refresh rates
   - Watch for error spikes

4. **Rollback Plan**
   - Revert environment variables to Client_Proj tenant
   - Clear user sessions (if needed)
   - Communicate to affected users

---

## Data Migration

### User Data Considerations

**No User Data Migration Required:**
- Users authenticate directly with product tenant
- No user data stored in corporate website database
- Profile information fetched from Azure B2C on each login

**Session Handling:**
- Existing sessions will expire naturally
- Users will be prompted to re-authenticate with product credentials
- No data loss or corruption risk

---

## Security Considerations

### Authentication Security

1. **Token Storage**
   - Tokens stored in localStorage (current implementation)
   - Consider httpOnly cookies for enhanced security (future enhancement)

2. **PKCE Flow**
   - MSAL automatically implements PKCE for SPA
   - No additional configuration needed

3. **Token Validation**
   - MSAL validates token signatures automatically
   - Verify issuer matches product tenant

4. **Scope Management**
   - Request minimal required scopes
   - Current scopes: `openid`, `profile`, `email`, `offline_access`

### Compliance

1. **GDPR Compliance**
   - User consent handled by Azure B2C
   - Privacy policy link in authentication flow
   - User data deletion handled by product tenant

2. **Data Residency**
   - Verify product tenant data residency requirements
   - Ensure compliance with regional regulations

---

## Monitoring & Observability

### Metrics to Track

1. **Authentication Metrics**
   - Login success rate
   - Login failure rate (by error type)
   - Average authentication time
   - Token refresh success rate

2. **User Metrics**
   - Daily active users
   - New user registrations
   - Session duration
   - Logout rate

3. **Error Metrics**
   - Authentication errors by type
   - Network failures
   - Token expiration events
   - MSAL errors

### Logging

**Log Events:**
- Authentication attempts (success/failure)
- Token refresh events
- Logout events
- MSAL errors and warnings

**Log Level Configuration:**
Current: `LogLevel.Warning`
Consider: `LogLevel.Info` during migration period

---

## Rollback Plan

### Rollback Triggers
- Authentication success rate drops below 95%
- Critical errors affecting user access
- Token refresh failures exceed 10%
- User complaints exceed threshold

### Rollback Steps

1. **Immediate Actions**
   - Revert environment variables to Client_Proj tenant values
   - Deploy configuration change
   - Clear CDN cache (if applicable)

2. **User Communication**
   - Notify users of temporary authentication issues
   - Provide alternative access methods (if available)
   - Set expectations for resolution timeline

3. **Post-Rollback**
   - Analyze failure root cause
   - Fix issues in staging environment
   - Re-test before next deployment attempt

---

## Documentation Updates

### Documents to Update

1. **MSAL Setup Guide** (`docs/MSAL_SETUP_GUIDE.md`)
   - Update tenant information
   - Update Client ID
   - Update policy names
   - Add troubleshooting for product tenant

2. **Environment Configuration** (`.env.example`)
   - Update with product tenant variables
   - Add comments explaining each variable
   - Provide example values

3. **README** (`README.md`)
   - Update authentication section
   - Add product tenant setup instructions
   - Update environment setup steps

4. **Developer Onboarding**
   - Update local development setup
   - Add product tenant access instructions
   - Update testing procedures

---

## Timeline & Milestones

### Estimated Timeline: 2-3 weeks

**Week 1: Azure Configuration & Development**
- Days 1-2: Azure B2C setup in product tenant
- Days 3-4: Update environment configuration
- Day 5: Local testing and validation

**Week 2: Testing & Staging**
- Days 1-2: Comprehensive testing in staging
- Days 3-4: User acceptance testing
- Day 5: Performance and security testing

**Week 3: Production Deployment**
- Day 1: Final staging validation
- Day 2: Production deployment (off-peak hours)
- Days 3-5: Monitoring and issue resolution

---

## Success Criteria

### Deployment Success
- ✅ Authentication success rate > 99%
- ✅ Zero critical errors in first 24 hours
- ✅ Token refresh working correctly
- ✅ All protected routes accessible
- ✅ User profile data loading correctly

### User Experience Success
- ✅ Login time < 3 seconds
- ✅ No user complaints about authentication
- ✅ Seamless transition for existing users
- ✅ New product users can access corporate site

### Technical Success
- ✅ All tests passing
- ✅ No MSAL errors in logs
- ✅ Proper token validation
- ✅ Session management working correctly

---

## Risks & Mitigation

### Risk 1: User Confusion
**Risk**: Users may not understand they need product credentials
**Impact**: Medium
**Mitigation**: 
- Clear messaging on login page
- Email communication before migration
- Help documentation with FAQs

### Risk 2: Token Compatibility
**Risk**: Token structure may differ between tenants
**Impact**: High
**Mitigation**:
- Test token claims in staging
- Verify profile data extraction
- Update claim mapping if needed

### Risk 3: Session Disruption
**Risk**: Active sessions may break during migration
**Impact**: Medium
**Mitigation**:
- Deploy during low-traffic window
- Communicate maintenance window
- Provide clear re-login instructions

### Risk 4: Azure B2C Configuration Error
**Risk**: Misconfiguration in product tenant
**Impact**: High
**Mitigation**:
- Thorough testing in staging
- Peer review of Azure configuration
- Maintain rollback plan

---

## Support & Maintenance

### Post-Deployment Support

**Week 1 Post-Deployment:**
- Daily monitoring of authentication metrics
- Rapid response to user issues
- Daily status reports to stakeholders

**Week 2-4 Post-Deployment:**
- Continued monitoring with reduced frequency
- Address any edge cases discovered
- Optimize based on usage patterns

### Ongoing Maintenance

1. **Regular Reviews**
   - Monthly authentication metrics review
   - Quarterly security audit
   - Annual Azure B2C configuration review

2. **Updates**
   - Keep MSAL library updated
   - Monitor Azure B2C feature releases
   - Update policies as needed

---

## Appendix

### A. Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AZURE_CLIENT_ID` | Application (client) ID from Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_B2C_TENANT_NAME` | Azure B2C tenant name | `dqproduct` |
| `VITE_AZURE_SUBDOMAIN` | Subdomain for CIAM login | `dqproduct` |
| `VITE_B2C_POLICY_SIGNUP_SIGNIN` | Sign-up/sign-in policy name | `B2C_1_SignUpSignIn` |
| `VITE_IDENTITY_HOST` | Login host URL | `dqproduct.ciamlogin.com` |

### B. MSAL Configuration Reference

Current configuration in `src/services/auth/msal.ts` supports:
- Multiple environment variable formats (VITE_* and NEXT_PUBLIC_*)
- Automatic authority URL construction
- PKCE flow for SPAs
- Token caching in localStorage
- Automatic token refresh

### C. Testing Checklist

- [ ] New user can sign up with product credentials
- [ ] Existing product user can log in
- [ ] Profile data displays correctly
- [ ] Protected routes are accessible after login
- [ ] Token refresh works automatically
- [ ] Logout clears session properly
- [ ] Error messages are user-friendly
- [ ] Mobile authentication works
- [ ] Multiple browser support verified
- [ ] Incognito mode works correctly

### D. Contact Information

**Azure B2C Admin**: [Contact for product tenant access]
**Development Team**: [Development team contact]
**Support Team**: [Support team contact]

---

## Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| Security Lead | | | |
| DevOps Lead | | | |

---

**Document Version**: 1.0
**Last Updated**: February 20, 2026
**Next Review**: Post-deployment + 30 days
