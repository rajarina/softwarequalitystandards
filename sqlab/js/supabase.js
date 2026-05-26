const SUPABASE_URL = 'https://yaonljjhpftexgvmugve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhb25sampocGZ0ZXhndm11Z3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTYyNzMsImV4cCI6MjA5NTMzMjI3M30.6LSYPyc7BUbHv1INY7tQU2nTFfCxGYq0nzaFN1nYxss';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function saveSubmission(data) {
  const { data: result, error } = await db
    .from('submissions')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return result;
}

async function getAllSubmissions() {
  const { data, error } = await db
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}
