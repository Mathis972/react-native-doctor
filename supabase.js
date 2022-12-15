import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snqhudcaeyryhpzpmcjb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWh1ZGNhZXlyeWhwenBtY2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjkzNzExMzQsImV4cCI6MTk4NDk0NzEzNH0.5azSS4yzUMsDXKHJFQTv_nraMEo1UHB8ay1rZ2Se0rw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
