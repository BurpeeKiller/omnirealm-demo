import type { PostgrestError } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { getClient } from '../utils/client';

interface QueryState<T> {
  data: T | null;
  error: PostgrestError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook générique pour les requêtes Supabase
 * Gère le loading, les erreurs et le refetch automatique
 */
export function useSupabaseQuery<T = any>(
  table: string,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    single?: boolean;
  },
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    loading: true,
    refetch: async () => {},
  });

  const supabase = getClient();

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      let query = supabase.from(table).select(options?.select || '*');

      // Appliquer les filtres
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Appliquer l'ordre
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // Appliquer la limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      // Récupérer un seul élément si demandé
      if (options?.single) {
        const { data, error } = await query.single();
        setState({
          data: data as T,
          error,
          loading: false,
          refetch: fetchData,
        });
      } else {
        const { data, error } = await query;
        setState({
          data: data as T,
          error,
          loading: false,
          refetch: fetchData,
        });
      }
    } catch (err) {
      setState({
        data: null,
        error: err as PostgrestError,
        loading: false,
        refetch: fetchData,
      });
    }
  }, [table, options, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

/**
 * Hook pour les mutations Supabase (insert, update, delete)
 */
export function useSupabaseMutation<T = any>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const supabase = getClient();

  const insert = async (data: Partial<T> | Partial<T>[]) => {
    setLoading(true);
    setError(null);

    const { data: result, error } = await supabase.from(table).insert(data).select();

    setLoading(false);

    if (error) {
      setError(error);
      return { data: null, error };
    }

    return { data: result, error: null };
  };

  const update = async (id: string | number, data: Partial<T>, idColumn = 'id') => {
    setLoading(true);
    setError(null);

    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq(idColumn, id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error);
      return { data: null, error };
    }

    return { data: result, error: null };
  };

  const remove = async (id: string | number, idColumn = 'id') => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from(table).delete().eq(idColumn, id);

    setLoading(false);

    if (error) {
      setError(error);
      return { error };
    }

    return { error: null };
  };

  const upsert = async (data: Partial<T> | Partial<T>[]) => {
    setLoading(true);
    setError(null);

    const { data: result, error } = await supabase.from(table).upsert(data).select();

    setLoading(false);

    if (error) {
      setError(error);
      return { data: null, error };
    }

    return { data: result, error: null };
  };

  return {
    insert,
    update,
    remove,
    upsert,
    loading,
    error,
  };
}
