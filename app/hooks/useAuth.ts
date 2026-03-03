import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase'; // Caminho corrigido
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Tipagem explícita para evitar erros de 'any' implícito
    const setData = (session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setData(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setData(session);
      if (!session) router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return { user, loading };
}