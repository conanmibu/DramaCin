import { useState, useEffect } from 'react';
import type { Drama, ContentGroup } from '../types/drama';
import { fetchTheaters } from '../services/api';

interface UseDramasResult {
  contentGroups: ContentGroup[];
  allDramas: Drama[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDramas(): UseDramasResult {
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTheaters();
      setContentGroups(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allDramas = contentGroups.flatMap((group) => group.contentInfos || []);

  return {
    contentGroups,
    allDramas,
    isLoading,
    error,
    refetch: fetchData,
  };
}
