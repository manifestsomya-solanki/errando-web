# Complete System Fix Plan - User Request Flow

## 🎯 Objective
Fix all issues in the user registration → service request → projects page flow to ensure:
- Correct user ID is used after login/registration
- Projects show correct requests (not 0)
- Token management works correctly
- No stale data after logout

---

## 📋 Issues Identified

### Critical Issues:
1. **Stale User ID in Project Context** - ID read once, doesn't update
2. **Token Management** - Old token used instead of new token
3. **Mutate Call** - Wrong key, doesn't refresh data
4. **Race Condition** - localStorage update vs navigation timing
5. **CommentsModal Redirect** - Hard redirect before request completes

---

## 🔧 Fix Plan

### Phase 1: Token Management Fixes

#### Fix 1.1: Clear old token before sendOtp
**File:** `auth-context.tsx` (sendOtp function)
**Issue:** Old token might still exist in localStorage
**Fix:** Clear token before calling sendOtp when registration flow starts

```typescript
const sendOtp = async (formData: FormData, key?: string, requestFormData?: FormData) => {
  // If registration flow, clear old token first
  if (key === "registration") {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
  }
  
  // ... rest of code
}
```

#### Fix 1.2: Ensure addRequest uses tokenFromApi
**File:** `auth-context.tsx` (addRequest function, line 549)
**Issue:** `localStorage.getItem("token") ?? tokenFromApi` - might use old token
**Fix:** Prioritize tokenFromApi when provided

```typescript
const addRequest = async (formData: FormData, tokenFromApi?: string) => {
  // Use tokenFromApi if provided, otherwise use localStorage token
  const token = tokenFromApi || localStorage.getItem("token");
  
  if (!token) {
    setError("No authentication token available");
    setIsLoading(false);
    return;
  }
  
  // ... rest of code
}
```

#### Fix 1.3: Use token from addRequest response
**File:** `auth-context.tsx` (addRequest function, line 570-571)
**Issue:** Already correct, but ensure it's used properly
**Fix:** Already correct - `responseData.data.token` is used

---

### Phase 2: Project Context Reactive ID Reading

#### Fix 2.1: Make user ID reactive
**File:** `project-context.tsx` (line 53)
**Issue:** ID read once during initialization
**Fix:** Use useState and useEffect to read ID reactively

```typescript
const ProjectContextProvider = (props: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [completePage, setCompletePage] = useState(1);

  // Read user ID reactively
  useEffect(() => {
    try {
      const userData = localStorage.getItem("data");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed?.id) {
          setUserId(parsed.id);
        }
      }
    } catch (error) {
      console.error("Error reading user data:", error);
      setUserId(null);
    }
  }, []);

  // Update URLs when userId changes
  const [url, setUrl] = useState<string | null>(null);
  const [completeurl, setCompleteUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${userId}`)
      );
      setCompleteUrl(
        buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?page=${completePage}&per_page=${perPage}&status=COMPLETED&user_id=${userId}`)
      );
    }
  }, [userId, currentPage, completePage]);

  // Only fetch if userId and URLs are available
  const { data: currentData, isLoading: iCurrentLoading, mutate: isCurrentMutate } = useSWR(
    url ? url : null,
    fetcher
  );
  
  const { data: completeData, isLoading: iCompleteLoading, mutate: isCompleteMutate } = useSWR(
    completeurl ? completeurl : null,
    fetcher
  );
  
  // ... rest of code
}
```

---

### Phase 3: Fix Mutate Call

#### Fix 3.1: Use correct SWR keys for mutate
**File:** `auth-context.tsx` (addRequest function, line 581)
**Issue:** `mutate("project_contect_api")` - wrong key
**Fix:** Need to pass actual mutate functions or use global mutate

**Option A:** Pass mutate functions through context
**Option B:** Use SWR global mutate with URL pattern

```typescript
// In addRequest, after successful request creation:
import { mutate as globalMutate } from 'swr';

// After navigation
await globalMutate(
  (key) => typeof key === 'string' && key.includes(API_ENDPOINTS.USER_REQUESTS),
  undefined,
  { revalidate: true }
);
```

**Better Option:** Pass mutate functions from project-context through auth-context

---

### Phase 4: Fix CommentsModal Redirect

#### Fix 4.1: Remove hard redirect
**File:** `CommentsModal.tsx` (line 75-77)
**Issue:** Hard redirect before request completes
**Fix:** Remove hard redirect, let addRequest handle navigation

```typescript
onSubmit: async (values) => {
  if (isLoggedIn) {
    // ... formData setup ...
    await addRequest(formData);
    // Don't redirect here - addRequest will handle it
  } else {
    // ... editRequest logic ...
    await editRequest(formData, props.requestId?.toString() ?? "");
    // editRequest also handles navigation
  }
  props.onCancelAll();
},
```

---

### Phase 5: Fix Logout Cleanup

#### Fix 5.1: Complete cleanup on logout
**File:** `auth-context.tsx` (logoutHandler function, line 419-456)
**Issue:** Not all localStorage items cleared
**Fix:** Clear all relevant items

```typescript
const logoutHandler = async () => {
  // ... API call ...
  
  if (data.status === "1") {
    setTimeout(() => {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("data");
      localStorage.removeItem("isLoggedIn");
      
      // Clear service flow data
      localStorage.removeItem("service");
      localStorage.removeItem("post_code");
      localStorage.removeItem("question");
      
      // Clear registration data
      localStorage.removeItem("email");
      localStorage.removeItem("mobile_number");
      
      setIsLoggedIn(false);
      setIsLoading(false);
      navigate("/sign-in");
    }, 1000);
  }
}
```

---

### Phase 6: Ensure Proper Sequencing

#### Fix 6.1: Wait for localStorage update before navigation
**File:** `auth-context.tsx` (addRequest function, line 571-580)
**Issue:** Navigation might happen before localStorage updates
**Fix:** Ensure localStorage is updated before navigation

```typescript
if (responseData.data?.token) {
  // Update localStorage first
  localStorage.setItem("token", responseData.data.token);
  localStorage.setItem("data", JSON.stringify(responseData.data.user));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", "customer");
  
  // Clear service flow data
  localStorage.removeItem("service");
  localStorage.removeItem("post_code");
  localStorage.removeItem("question");
  
  // Update state
  setIsLoggedIn(true);
  setData(responseData.data.user);
  
  // Small delay to ensure localStorage is written
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Then navigate
  navigate("/projects");
  
  // Then refresh project data
  await globalMutate(
    (key) => typeof key === 'string' && key.includes(API_ENDPOINTS.USER_REQUESTS),
    undefined,
    { revalidate: true }
  );
}
```

---

## 📝 Implementation Order

1. **Fix 1.1 & 1.2** - Token management (Critical)
2. **Fix 2.1** - Project context reactive ID (Critical)
3. **Fix 3.1** - Mutate call (Important)
4. **Fix 4.1** - CommentsModal redirect (Important)
5. **Fix 5.1** - Logout cleanup (Nice to have)
6. **Fix 6.1** - Sequencing (Critical)

---

## ✅ Testing Checklist

After fixes:
- [ ] Logout → Select service → Complete flow → Projects page shows 1 request
- [ ] Old user logs out → New user registers → Projects shows new user's requests
- [ ] Token is correctly updated after addRequest
- [ ] Project context updates when user ID changes
- [ ] No stale data after logout
- [ ] No race conditions in navigation

---

## 🚨 Critical Notes

1. **Token Priority:** Always use `tokenFromApi` when provided in `addRequest`
2. **User ID:** Must be reactive - read from localStorage when it changes
3. **Navigation:** Only navigate after localStorage is fully updated
4. **Mutate:** Use actual SWR keys, not arbitrary strings
5. **Cleanup:** Clear all related localStorage items on logout

