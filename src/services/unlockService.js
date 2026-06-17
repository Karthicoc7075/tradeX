import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";

export const SECRETS_COLLECTION = "secrets";

export const SECRET_DOCS = {
  MAIN_ACCESS: "main_access",
  KONAMI_MULTIPLE: "konami_multiple",
  KONAMI_ONE_TIME: "konami_one_time",
};

export const UNLOCK_METHODS = {
  ACCESS_CODE: "access_code",
  KONAMI_KARTHI: "konami_karthi",
  KONAMI_UP_FIVE: "konami_up_five",
};

const DEFAULT_ACCESS_CODES = ["THARUN2026", "jgdsaiud81j31328d"];

const EMPTY_STATE = {
  mainAccess: { codes: [], history: [] },
  konamiMultiple: { code: "", usedCount: 0, history: [] },
  konamiOneTime: { code: "", used: false, usedAt: null, history: [] },
  loading: true,
  configured: false,
};

function secretsCollectionRef() {
  return collection(db, SECRETS_COLLECTION);
}

function secretDocRef(docId) {
  return doc(db, SECRETS_COLLECTION, docId);
}

function normalizeKey(value) {
  return String(value ?? "").trim();
}

function normalizeHistory(raw) {
  return Array.isArray(raw) ? raw : [];
}

function normalizeCodeEntry(raw = {}) {
  return {
    code: normalizeKey(raw.code),
    used: raw.used === true,
    usedAt: raw.used_at ?? null,
  };
}

function normalizeMainAccess(raw = {}) {
  let codes = [];

  if (Array.isArray(raw.codes)) {
    codes = raw.codes.map(normalizeCodeEntry).filter((entry) => entry.code);
  } else if (normalizeKey(raw.code)) {
    codes = [
      normalizeCodeEntry({
        code: raw.code,
        used: raw.used,
        used_at: raw.used_at,
      }),
    ];
  }

  return {
    codes,
    history: normalizeHistory(raw.history),
  };
}

function getSeedAccessCodes() {
  const envValue =
    import.meta.env.VITE_UNLOCK_KEYS ||
    import.meta.env.VITE_MAIN_ACCESS_CODES ||
    import.meta.env.VITE_MAIN_ACCESS_CODE ||
    import.meta.env.VITE_UNLOCK_KEY;

  const fromEnv = envValue
    ? String(envValue)
        .split(",")
        .map(normalizeKey)
        .filter(Boolean)
    : [];

  const merged = [...fromEnv];
  for (const code of DEFAULT_ACCESS_CODES) {
    if (!merged.includes(code)) merged.push(code);
  }

  return merged.length ? merged : [...DEFAULT_ACCESS_CODES];
}

function mergeSeedCodes(existingCodes = []) {
  const map = new Map();

  for (const entry of existingCodes) {
    if (entry.code) map.set(entry.code, entry);
  }

  for (const seed of getSeedAccessCodes()) {
    if (!map.has(seed)) {
      map.set(seed, { code: seed, used: false, usedAt: null });
    }
  }

  return Array.from(map.values());
}

function buildMainAccessFirestoreCodes(codes = []) {
  return codes.map((entry) => ({
    code: entry.code,
    used: entry.used === true,
    used_at: entry.usedAt ?? null,
  }));
}

function codesNeedSync(existingCodes = [], mergedCodes = []) {
  if (existingCodes.length !== mergedCodes.length) return true;

  const existingMap = new Map(existingCodes.map((entry) => [entry.code, entry]));

  return mergedCodes.some((entry) => {
    const current = existingMap.get(entry.code);
    if (!current) return true;
    return current.used !== entry.used || current.usedAt !== entry.usedAt;
  });
}

function normalizeKonamiMultiple(raw = {}) {
  return {
    code: normalizeKey(raw.code),
    usedCount: Number(raw.used_count) || 0,
    history: normalizeHistory(raw.history),
  };
}

function normalizeKonamiOneTime(raw = {}) {
  return {
    code: normalizeKey(raw.code),
    used: raw.used === true,
    usedAt: raw.used_at ?? null,
    history: normalizeHistory(raw.history),
  };
}

const SECRETS_INIT_STORAGE_KEY = "tradex_secrets_init_v3";

const KONAMI_MULTIPLE_CODE = "↑↓←→karthi";
const KONAMI_ONE_TIME_CODE = "↑↑↑↑↑";

function buildDefaultSecrets() {
  return [
    {
      id: SECRET_DOCS.MAIN_ACCESS,
      data: {
        codes: getSeedAccessCodes().map((code) => ({
          code,
          used: false,
          used_at: null,
        })),
        history: [],
      },
    },
    {
      id: SECRET_DOCS.KONAMI_MULTIPLE,
      data: {
        code: KONAMI_MULTIPLE_CODE,
        used_count: 0,
        history: [],
      },
    },
    {
      id: SECRET_DOCS.KONAMI_ONE_TIME,
      data: {
        code: KONAMI_ONE_TIME_CODE,
        used: false,
        used_at: null,
        history: [],
      },
    },
  ];
}

function buildRepairPatch(docId, existing = {}) {
  const patch = {};

  if (docId === SECRET_DOCS.MAIN_ACCESS) {
    const normalized = normalizeMainAccess(existing);
    const merged = mergeSeedCodes(normalized.codes);

    if (codesNeedSync(normalized.codes, merged)) {
      patch.codes = buildMainAccessFirestoreCodes(merged);
    }

    if (!Array.isArray(existing.history)) patch.history = [];
  }

  if (docId === SECRET_DOCS.KONAMI_MULTIPLE) {
    if (!normalizeKey(existing.code)) patch.code = KONAMI_MULTIPLE_CODE;
    if (existing.used_count === undefined) patch.used_count = 0;
    if (!Array.isArray(existing.history)) patch.history = [];
  }

  if (docId === SECRET_DOCS.KONAMI_ONE_TIME) {
    if (!normalizeKey(existing.code)) patch.code = KONAMI_ONE_TIME_CODE;
    if (existing.used !== true) patch.used = false;
    if (existing.used_at === undefined) patch.used_at = null;
    if (!Array.isArray(existing.history)) patch.history = [];
  }

  return patch;
}

function isSecretDocValid(docId, data = {}) {
  if (docId === SECRET_DOCS.MAIN_ACCESS) {
    return mergeSeedCodes(normalizeMainAccess(data).codes).some((entry) => entry.code);
  }
  if (docId === SECRET_DOCS.KONAMI_MULTIPLE) {
    return Boolean(normalizeKey(data.code));
  }
  if (docId === SECRET_DOCS.KONAMI_ONE_TIME) {
    return Boolean(normalizeKey(data.code));
  }
  return false;
}

async function areAllSecretsValid() {
  const checks = await Promise.all(
    buildDefaultSecrets().map(async (secret) => {
      const snap = await getDoc(secretDocRef(secret.id));
      return snap.exists() && isSecretDocValid(secret.id, snap.data());
    }),
  );

  return checks.every(Boolean);
}

export function withMergedAccessCodes(mainAccess = {}) {
  const normalized = normalizeMainAccess(mainAccess);
  return {
    ...normalized,
    codes: mergeSeedCodes(normalized.codes),
  };
}

export function getMainAccessStatus(mainAccess = {}) {
  const codes = mergeSeedCodes(mainAccess.codes ?? []);
  const hasCode = codes.some((entry) => entry.code);
  const hasUnused = codes.some((entry) => entry.code && !entry.used);
  const anyUsed = codes.some((entry) => entry.code && entry.used);
  const allUsed = hasCode && codes.every((entry) => !entry.code || entry.used);

  return { hasCode, hasUnused, anyUsed, allUsed, codes };
}

function parseSecretsSnapshot(snapshot) {
  const docs = {};

  snapshot.forEach((entry) => {
    docs[entry.id] = entry.data();
  });

  return {
    mainAccess: withMergedAccessCodes(docs[SECRET_DOCS.MAIN_ACCESS]),
    konamiMultiple: normalizeKonamiMultiple(docs[SECRET_DOCS.KONAMI_MULTIPLE]),
    konamiOneTime: normalizeKonamiOneTime(docs[SECRET_DOCS.KONAMI_ONE_TIME]),
    loading: false,
    configured: true,
  };
}

async function syncMainAccessCodes() {
  const docRef = secretDocRef(SECRET_DOCS.MAIN_ACCESS);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return false;

  const patch = buildRepairPatch(SECRET_DOCS.MAIN_ACCESS, docSnap.data());
  if (Object.keys(patch).length === 0) return false;

  await setDoc(docRef, patch, { merge: true });
  return true;
}

/**
 * Bootstrap secrets in Firestore.
 * - Creates missing docs
 * - Repairs docs that exist but are missing `code` (does not overwrite an existing code)
 * - Marks browser init done only when all secrets are valid
 */
export async function initializeSecrets() {
  if (!isFirebaseConfigured()) {
    return { ok: false, reason: "firebase_not_configured" };
  }

  const alreadyValid =
    typeof window !== "undefined" &&
    localStorage.getItem(SECRETS_INIT_STORAGE_KEY) === "done" &&
    (await areAllSecretsValid());

  try {
    await syncMainAccessCodes();
  } catch (error) {
    console.error("syncMainAccessCodes failed:", error);
  }

  if (alreadyValid) {
    return { ok: true, skipped: true, reason: "already_initialized" };
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(SECRETS_INIT_STORAGE_KEY);
  }

  const created = [];
  const repaired = [];

  try {
    for (const secret of buildDefaultSecrets()) {
      const docRef = secretDocRef(secret.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, secret.data);
        created.push(secret.id);
        continue;
      }

      const patch = buildRepairPatch(secret.id, docSnap.data());
      if (Object.keys(patch).length > 0) {
        await setDoc(docRef, patch, { merge: true });
        repaired.push(secret.id);
      }
    }

    const valid = await areAllSecretsValid();

    if (valid && typeof window !== "undefined") {
      localStorage.setItem(SECRETS_INIT_STORAGE_KEY, "done");
    }

    return {
      ok: valid,
      created,
      repaired,
      reason: valid ? "ready" : "missing_keys_config",
    };
  } catch (error) {
    console.error("initializeSecrets failed:", error);
    return { ok: false, reason: "init_failed", error: error.message };
  }
}

export function subscribeUnlockStatus(onStatus) {
  if (!isFirebaseConfigured()) {
    onStatus({ ...EMPTY_STATE, loading: false, configured: false });
    return () => {};
  }

  onStatus({ ...EMPTY_STATE, loading: true, configured: true });

  return onSnapshot(
    secretsCollectionRef(),
    (snapshot) => onStatus(parseSecretsSnapshot(snapshot)),
    (error) => {
      console.error("Unlock status listener failed:", error);
      onStatus({ ...EMPTY_STATE, loading: false, configured: true, error: error.message });
    },
  );
}

/**
 * Logo 5 clicks + access code popup.
 * Uses secrets/main_access — each code is one-time.
 */
export async function claimAccessCode(enteredKey) {
  const submittedKey = normalizeKey(enteredKey);

  if (!submittedKey) {
    return { ok: false, reason: "wrong_key", session: false };
  }

  if (!isFirebaseConfigured()) {
    return { ok: false, reason: "firebase_not_configured", session: false };
  }

  try {
    const result = await runTransaction(db, async (transaction) => {
      const docRef = secretDocRef(SECRET_DOCS.MAIN_ACCESS);
      const snapshot = await transaction.get(docRef);
      const data = snapshot.exists() ? snapshot.data() : {};
      const codes = mergeSeedCodes(normalizeMainAccess(data).codes);

      if (!codes.length) {
        return { ok: false, reason: "missing_keys_config", session: false };
      }

      const matchIndex = codes.findIndex((entry) => entry.code === submittedKey);

      if (matchIndex === -1) {
        transaction.set(
          docRef,
          {
            codes: buildMainAccessFirestoreCodes(codes),
            history: normalizeHistory(data.history),
          },
          { merge: true },
        );
        return { ok: false, reason: "wrong_key", session: false };
      }

      const matched = codes[matchIndex];

      if (matched.used) {
        return {
          ok: false,
          reason: "key_already_used",
          session: false,
          method: UNLOCK_METHODS.ACCESS_CODE,
          claimedCode: submittedKey,
        };
      }

      const nextCodes = codes.map((entry, index) => {
        if (index !== matchIndex) {
          return {
            code: entry.code,
            used: entry.used === true,
            used_at: entry.usedAt ?? null,
          };
        }

        return {
          code: entry.code,
          used: true,
          used_at: serverTimestamp(),
        };
      });

      transaction.set(
        docRef,
        {
          codes: nextCodes,
          history: arrayUnion(Timestamp.now()),
        },
        { merge: true },
      );

      return {
        ok: true,
        reason: "claimed",
        session: true,
        method: UNLOCK_METHODS.ACCESS_CODE,
        claimedCode: submittedKey,
      };
    });

    return result;
  } catch (error) {
    console.error("Access code claim failed:", error);
    return {
      ok: false,
      reason: "transaction_failed",
      session: false,
      error: error.message,
      code: error.code,
      method: UNLOCK_METHODS.ACCESS_CODE,
    };
  }
}

/** Konami ↑↓←→karthi — multiple uses via secrets/konami_multiple. */
export async function attemptKonamiKarthiUnlock() {
  if (!isFirebaseConfigured()) {
    return { ok: false, reason: "firebase_not_configured", session: false };
  }

  try {
    const result = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(secretDocRef(SECRET_DOCS.KONAMI_MULTIPLE));
      const data = snapshot.exists() ? snapshot.data() : {};
      const nextCount = (Number(data.used_count) || 0) + 1;
      const code = normalizeKey(data.code) || KONAMI_MULTIPLE_CODE;

      transaction.set(
        secretDocRef(SECRET_DOCS.KONAMI_MULTIPLE),
        {
          code,
          used_count: nextCount,
          history: arrayUnion(Timestamp.now()),
        },
        { merge: true },
      );

      return {
        ok: true,
        reason: "unlocked",
        session: true,
        method: UNLOCK_METHODS.KONAMI_KARTHI,
        useCount: nextCount,
      };
    });

    return result;
  } catch (error) {
    console.error("Konami Karthi unlock failed:", error);
    return {
      ok: false,
      reason: "transaction_failed",
      session: false,
      error: error.message,
      code: error.code,
      method: UNLOCK_METHODS.KONAMI_KARTHI,
    };
  }
}

/** Konami ↑↑↑↑↑ — one-time via secrets/konami_one_time. */
export async function attemptKonamiUpFiveUnlock() {
  if (!isFirebaseConfigured()) {
    return { ok: false, reason: "firebase_not_configured", session: false };
  }

  try {
    const result = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(secretDocRef(SECRET_DOCS.KONAMI_ONE_TIME));
      const data = snapshot.exists() ? snapshot.data() : {};
      const oneTime = normalizeKonamiOneTime(data);

      if (oneTime.used) {
        return {
          ok: false,
          reason: "already_used",
          session: false,
          method: UNLOCK_METHODS.KONAMI_UP_FIVE,
        };
      }

      transaction.set(
        secretDocRef(SECRET_DOCS.KONAMI_ONE_TIME),
        {
          code: oneTime.code || KONAMI_ONE_TIME_CODE,
          used: true,
          used_at: serverTimestamp(),
          history: arrayUnion(Timestamp.now()),
        },
        { merge: true },
      );

      return {
        ok: true,
        reason: "unlocked",
        session: true,
        method: UNLOCK_METHODS.KONAMI_UP_FIVE,
      };
    });

    return result;
  } catch (error) {
    console.error("Konami Up-Five unlock failed:", error);
    return {
      ok: false,
      reason: "transaction_failed",
      session: false,
      error: error.message,
      code: error.code,
      method: UNLOCK_METHODS.KONAMI_UP_FIVE,
    };
  }
}

/** Optional helper for admin/setup verification in dev tools. */
export async function readSecretDocuments() {
  if (!isFirebaseConfigured()) return null;

  const [mainSnap, multiSnap, oneSnap] = await Promise.all([
    getDoc(secretDocRef(SECRET_DOCS.MAIN_ACCESS)),
    getDoc(secretDocRef(SECRET_DOCS.KONAMI_MULTIPLE)),
    getDoc(secretDocRef(SECRET_DOCS.KONAMI_ONE_TIME)),
  ]);

  return {
    main_access: mainSnap.exists() ? mainSnap.data() : null,
    konami_multiple: multiSnap.exists() ? multiSnap.data() : null,
    konami_one_time: oneSnap.exists() ? oneSnap.data() : null,
  };
}