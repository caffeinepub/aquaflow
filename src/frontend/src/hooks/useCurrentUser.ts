import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, AppRole, UserRole } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Enhanced state reporting for deterministic bootstrap routing
  const isActorReady = !!actor && !actorFetching;
  const isProfileFetchInProgress = isActorReady && query.isLoading;
  const isProfileFetched = isActorReady && query.isFetched;
  const hasProfile = isProfileFetched && query.data !== null;
  const hasNoProfile = isProfileFetched && query.data === null;
  const hasFetchError = isProfileFetched && !!query.error;

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: isActorReady && query.isFetched,
    // Enhanced state flags for bootstrap decision-making
    isActorReady,
    isProfileFetchInProgress,
    isProfileFetched,
    hasProfile,
    hasNoProfile,
    hasFetchError,
  };
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
