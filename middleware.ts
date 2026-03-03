import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria a resposta inicial UMA ÚNICA VEZ
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Apenas ler cookies da requisição
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Setar cookies na resposta (não mexa no request)
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        // Remover cookies da resposta
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Valida a sessão no servidor
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // [OPCIONAL] Redireciona da raiz para o dashboard se logado
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se o usuário está logado e tenta ir para o login, manda para o dashboard
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se NÃO está logado e tenta acessar rotas privadas
  const isPrivateRoute = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/certificados') || 
                         pathname.startsWith('/turmas')

  if (!user && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Retorna a resposta (com os cookies já modificados)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}