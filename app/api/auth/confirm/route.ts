import { type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/facilitator/setup'

    if (code) {
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.user) {
            const { createSupabaseServiceClient } = await import('@/lib/supabase')
            const serviceClient = await createSupabaseServiceClient()

            const { error: insertError } = await serviceClient
                .from('facilitators')
                .upsert({
                    id: data.user.id,
                    email: data.user.email
                }, { onConflict: 'id' })

            if (insertError) {
                console.error("Error creating facilitator record:", insertError)
            }

            // successful auth, redirect
            redirect(next)
        }
    }

    // return the user to an error page with some instructions
    redirect('/facilitator/login?error=true')
}
