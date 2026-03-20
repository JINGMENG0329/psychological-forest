import { useEffect, useState } from 'react';
import { UserProfile } from '../types';

const STORAGE_KEY = 'forest-user-profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const saveProfile = (newProfile: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  return { profile, saveProfile };
}
