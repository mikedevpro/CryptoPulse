import { useEffect, useState } from "react";

export const PROFILE_CHANGED_EVENT = "cryptopulse:profile-changed";
const PROFILES_STORAGE_KEY = "crypto-pulse-profiles";
const ACTIVE_PROFILE_STORAGE_KEY = "crypto-pulse-active-profile";

export type LocalProfile = {
  id: string;
  name: string;
};

const DEFAULT_PROFILE: LocalProfile = {
  id: "guest",
  name: "Guest",
};

function readProfilesFromStorage(): LocalProfile[] {
  if (typeof window === "undefined") return [DEFAULT_PROFILE];

  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return [DEFAULT_PROFILE];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [DEFAULT_PROFILE];

    const profiles = parsed
      .map((profile) => {
        if (
          typeof profile === "object" &&
          profile !== null &&
          "id" in profile &&
          "name" in profile &&
          typeof profile.id === "string" &&
          typeof profile.name === "string"
        ) {
          return { id: profile.id, name: profile.name } satisfies LocalProfile;
        }
        return null;
      })
      .filter((profile): profile is LocalProfile => Boolean(profile));

    if (profiles.length === 0) return [DEFAULT_PROFILE];

    if (!profiles.some((profile) => profile.id === DEFAULT_PROFILE.id)) {
      return [DEFAULT_PROFILE, ...profiles];
    }

    return profiles;
  } catch (error) {
    console.error("Failed to parse profiles from localStorage:", error);
    return [DEFAULT_PROFILE];
  }
}

function readActiveProfileId(profiles: LocalProfile[]): string {
  if (typeof window === "undefined") return DEFAULT_PROFILE.id;

  const saved = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
  if (!saved) return DEFAULT_PROFILE.id;

  return profiles.some((profile) => profile.id === saved)
    ? saved
    : DEFAULT_PROFILE.id;
}

function emitProfileChangedEvent() {
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}

export function useLocalProfile() {
  const [profiles, setProfiles] = useState<LocalProfile[]>(readProfilesFromStorage);
  const [currentProfileId, setCurrentProfileId] = useState<string>(() =>
    readActiveProfileId(readProfilesFromStorage())
  );

  useEffect(() => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, currentProfileId);
  }, [currentProfileId]);

  useEffect(() => {
    const syncFromStorage = () => {
      const latestProfiles = readProfilesFromStorage();
      const latestActive = readActiveProfileId(latestProfiles);
      setProfiles(latestProfiles);
      setCurrentProfileId(latestActive);
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== PROFILES_STORAGE_KEY &&
        event.key !== ACTIVE_PROFILE_STORAGE_KEY
      ) {
        return;
      }
      syncFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PROFILE_CHANGED_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PROFILE_CHANGED_EVENT, syncFromStorage);
    };
  }, []);

  const currentProfile =
    profiles.find((profile) => profile.id === currentProfileId) || DEFAULT_PROFILE;

  function switchProfile(nextProfileId: string) {
    if (!profiles.some((profile) => profile.id === nextProfileId)) {
      return;
    }

    setCurrentProfileId(nextProfileId);
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, nextProfileId);
    emitProfileChangedEvent();
  }

  function createProfile(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const nextProfile: LocalProfile = {
      id: `profile-${Date.now()}`,
      name: trimmedName,
    };

    const nextProfiles = [...profiles, nextProfile];
    setProfiles(nextProfiles);
    setCurrentProfileId(nextProfile.id);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, nextProfile.id);
    emitProfileChangedEvent();
  }

  return {
    profiles,
    currentProfile,
    currentProfileId,
    switchProfile,
    createProfile,
  };
}
