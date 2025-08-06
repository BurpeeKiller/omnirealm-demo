import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState, useRef } from 'react';

import { getClient } from '../utils/client';

type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface RealtimeOptions {
  event?: ChangeEvent;
  schema?: string;
  filter?: string;
}

/**
 * Hook pour écouter les changements en temps réel sur une table Supabase
 */
export function useRealtime<T = any>(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
  options?: RealtimeOptions,
) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getClient();

  useEffect(() => {
    // Créer le canal de souscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: options?.event || '*',
          schema: options?.schema || 'public',
          table,
          filter: options?.filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callback(payload);
        },
      )
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, options, callback, supabase]);

  return {
    isSubscribed,
    channel: channelRef.current,
  };
}

/**
 * Hook pour la présence en temps réel (qui est en ligne)
 */
export function usePresence(channelName: string, userData?: any) {
  const [presenceState, setPresenceState] = useState<Record<string, any>>({});
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getClient();

  useEffect(() => {
    const channel = supabase.channel(channelName);

    // Suivre la présence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresenceState(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setPresenceState((prev) => ({ ...prev, [key]: newPresences }));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setPresenceState((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && userData) {
          await channel.track(userData);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, userData, supabase]);

  const updatePresence = async (newData: any) => {
    if (channelRef.current) {
      await channelRef.current.track(newData);
    }
  };

  return {
    presenceState,
    updatePresence,
    onlineCount: Object.keys(presenceState).length,
  };
}

/**
 * Hook pour broadcast de messages en temps réel
 */
export function useBroadcast(channelName: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getClient();

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((prev) => [...prev, payload]);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, supabase]);

  const broadcast = async (message: any) => {
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'message',
        payload: message,
      });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    broadcast,
    clearMessages,
  };
}
