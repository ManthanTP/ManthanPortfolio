import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: posts, error: fetchError } = await supabase.from('posts').select('id, likes').limit(1);
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }
  
  if (!posts || posts.length === 0) {
    console.log('No posts found to test with.');
    return;
  }

  const post = posts[0];
  console.log('Found post:', post);

  const newLikes = (post.likes || 0) + 1;
  const { data, error } = await supabase.from('posts').update({ likes: newLikes }).eq('id', post.id).select().single();
  
  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('Update success:', data);
  }
}

test();
