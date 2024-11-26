'use client';

import { TravelMember } from '@withbee/types';
import { create } from 'zustand';
import { useEffect } from 'react';

interface TravelStore {
  travelMembers: TravelMember[] | undefined;
  setTravelMembers: (members: TravelMember[]) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  travelMembers: undefined,
  setTravelMembers: (members: TravelMember[]) =>
    set({ travelMembers: members }),
}));

export function TravelStoreInitializer({
  travelMembers,
}: {
  travelMembers: TravelMember[] | undefined;
}) {
  const { setTravelMembers } = useTravelStore();

  useEffect(() => {
    if (travelMembers) {
      setTravelMembers(travelMembers);
    }
  }, [travelMembers, setTravelMembers]);

  return null;
}
