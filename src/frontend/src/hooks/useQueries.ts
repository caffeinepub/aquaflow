import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Failed to save profile';
      
      // Extract user-friendly message from backend trap
      let displayMessage = errorMessage;
      if (errorMessage.includes('Unauthorized')) {
        if (errorMessage.includes('admin role')) {
          displayMessage = 'You are not authorized to register as an admin. Please choose Customer or Salesman.';
        } else if (errorMessage.includes('Anonymous')) {
          displayMessage = 'Please log in to create a profile.';
        } else {
          displayMessage = 'You do not have permission to perform this action.';
        }
      }
      
      toast.error(displayMessage);
      
      // Re-throw so the component can handle it
      throw error;
    },
  });
}
