export async function POST(req) {
    const body = await req.json();
  
    const { username, password, email } = body;
  
    // Basic validation
    if (!username || !password || !email) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Simulate saving the user (in production, save to a database)
    console.log('New user registered:', { username, email });
  
    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }