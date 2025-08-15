import { createClient } from '@supabase/supabase-js'
import { publicConfig } from '@/lib/config'

export const supabase = createClient(publicConfig.supabaseUrl, publicConfig.supabaseAnonKey)