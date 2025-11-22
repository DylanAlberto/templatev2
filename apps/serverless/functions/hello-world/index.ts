// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Type definitions for dashboard_tasks
interface DashboardTask {
  id: string
  created_at: string
  user_id: string
  title: string
  completed: boolean
}

Deno.serve(async (req) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? ""

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Get authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Initialize Supabase client with the authorization header
    // This ensures the client uses the user's authentication context
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: userError?.message }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Query dashboard_tasks table (RLS will automatically filter by user_id)
    const { data: tasks, error: queryError } = await supabaseClient
      .from("dashboard_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (queryError) {
      return new Response(
        JSON.stringify({
          error: "Failed to query database",
          details: queryError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Return tasks as JSON
    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
        },
        tasks: (tasks as DashboardTask[]) ?? [],
        count: tasks?.length ?? 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Get your access token from a logged-in session
  3. Make an HTTP request:

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
    --header 'Content-Type: application/json'

  Note: Replace YOUR_ACCESS_TOKEN with a valid JWT token from an authenticated session.
  You can get this from the browser's localStorage after logging in, or by using:
  
  supabase.auth.getSession() in your frontend code

*/
