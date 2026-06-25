exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authHeader = event.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const userToken = authHeader.slice(7);
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Verify the caller's token and resolve their user ID
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      apikey: anonKey,
    },
  });

  if (!userRes.ok) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session — please log in again' }) };
  }

  const { id: userId } = await userRes.json();

  // Delete the user via the Supabase admin API (requires service role key)
  const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });

  if (!deleteRes.ok) {
    const text = await deleteRes.text();
    console.error('Supabase user delete failed:', text);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to delete account. Please try again.' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
