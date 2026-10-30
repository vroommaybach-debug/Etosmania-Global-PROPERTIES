export const DEFAULT_ADMIN_GATE_SECRET = 'Etosmania@2026';
export const ADMIN_SESSION_STORAGE_KEY = 'etosmania_global_admin_unlocked_v1';
export const ADMIN_CUSTOM_PASSWORD_STORAGE_KEY = 'etosmania_global_admin_gate_custom_v1';

/**
 * Returns the currently active gate password (custom password if set in storage, otherwise the default).
 */
export function getActiveAdminGatePassword(customOverride?: string | null): string {
  if (typeof customOverride === 'string' && customOverride.trim().length >= 6) {
    return customOverride.trim();
  }
  try {
    const stored = localStorage.getItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY);
    if (stored && stored.trim().length >= 6) {
      return stored.trim();
    }
  } catch {
    // ignore storage errors in non-browser environments
  }
  return DEFAULT_ADMIN_GATE_SECRET;
}

/**
 * Persists a custom gate password locally so it is available immediately on load.
 */
export function setLocalCustomAdminGatePassword(newPassword: string | null): void {
  try {
    if (newPassword && newPassword.trim().length >= 6) {
      localStorage.setItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY, newPassword.trim());
    } else {
      localStorage.removeItem(ADMIN_CUSTOM_PASSWORD_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Validates the candidate password against the active Etosmania Global Properties executive gate password.
 * Never exposes or logs the password.
 */
export function verifyAdminGatePassword(
  input: string,
  customPassword?: string | null
): boolean {
  if (typeof input !== 'string') return false;
  const trimmedInput = input.trim();
  if (!trimmedInput) return false;

  const activeSecret = getActiveAdminGatePassword(customPassword);
  return input === activeSecret || trimmedInput === activeSecret;
}

export function verifyAdminPasscode(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  return (
    trimmed === 'ETOSMANIA2025' ||
    trimmed === DEFAULT_ADMIN_GATE_SECRET ||
    verifyAdminGatePassword(trimmed)
  );
}


/**
 * Validates a password change request from inside the Admin Panel.
 */
export function validateAdminPasswordChange(params: {
  currentInput: string;
  newPassword: string;
  confirmPassword: string;
  activeCustomPassword?: string | null;
}): { valid: boolean; error?: string; sanitizedPassword?: string } {
  const { currentInput, newPassword, confirmPassword, activeCustomPassword } = params;

  if (!verifyAdminGatePassword(currentInput, activeCustomPassword)) {
    return {
      valid: false,
      error: 'Current gate password is incorrect.',
    };
  }

  const trimmedNew = (newPassword || '').trim();
  const trimmedConfirm = (confirmPassword || '').trim();

  if (trimmedNew.length < 6) {
    return {
      valid: false,
      error: 'New gate password must be at least 6 characters long.',
    };
  }

  if (trimmedNew.length > 128) {
    return {
      valid: false,
      error: 'New gate password must not exceed 128 characters.',
    };
  }

  if (trimmedNew !== trimmedConfirm) {
    return {
      valid: false,
      error: 'New password and confirmation do not match.',
    };
  }

  return {
    valid: true,
    sanitizedPassword: trimmedNew,
  };
}

/**
 * Checks whether the current browser session has already unlocked the /admin gate.
 */
export function isAdminSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'unlocked_true';
  } catch {
    return false;
  }
}

/**
 * Persists or clears the unlocked state in sessionStorage.
 */
export function setAdminSessionUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'unlocked_true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Resolves fallback query or hash parameters (e.g., `/?admin=1`, `/?route=/admin`, or `/#/admin`)
 * into a clean React Router path so static hosts without server rewrites can still open `/admin`
 * or any sub-route without triggering a 404.
 */
export function resolveSpaFallbackRoute(search: string, hash: string): string | null {
  try {
    if (search) {
      const params = new URLSearchParams(search);
      const adminParam = params.get('admin');
      if (adminParam === '1' || adminParam === 'true' || adminParam === '') {
        return '/admin';
      }
      const routeParam = params.get('route') || params.get('redirect') || params.get('p');
      if (routeParam && routeParam.startsWith('/')) {
        return routeParam;
      }
    }

    if (hash && hash.startsWith('#/')) {
      const hashPath = hash.slice(1);
      if (hashPath.length > 1) {
        return hashPath;
      }
    }
  } catch {
    // ignore malformed URL params
  }
  return null;
}
