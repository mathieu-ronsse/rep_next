export async function POST(req) {
    const body = await req.json();
  
    try {
      console.log("Using token:", process.env.REPLICATE_API_KEY);

      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.REPLICATE_API_KEY ,  // Replace with your actual token
        },
        body: JSON.stringify(body), // Forward the request body from the client
      });
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in API Proxy:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  
  