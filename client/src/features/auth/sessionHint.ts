const SESSION_HINT_KEY = 'jcst_has_session';

const canUseStorage = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.localStorage !== 'undefined';

export const hasSessionHint = (): boolean => {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
};

export const markSessionPresent = (): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_HINT_KEY, '1');
};

export const clearSessionHint = (): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_HINT_KEY);
};