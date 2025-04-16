export async function POST(req) {
    const body = await req.json();
  
    const { username, password } = body;
  
    // Hardcoded credentials for demonstration
    const validUsername = 'admin';
    const validPassword = 'password';
  
    if (username === validUsername && password === validPassword) {
      // Generate a simple token (in production, use JWT or similar)
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }