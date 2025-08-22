import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://sorteio-caaam.vercel.app/" 

export const metadata: Metadata = {
  // --- METADADOS BÁSICOS E SEO ---
  title: {
    default: "Sistema de Sorteio OAB/CAAAM", // Título padrão
    template: "%s | Sorteio OAB/CAAAM", // Template para títulos de outras páginas
  },
  description: "Sistema de sorteio online justo e transparente para eventos. Realize sorteios de forma fácil, moderna e auditável com a plataforma da OAB/CAAAM.",
  keywords: ["sorteio", "OAB", "CAAAM", "evento", "prêmios", "sistema online", "sorteio justo", "plataforma de sorteio"],
  
  // --- AUTORIA E PUBLISHER ---
  authors: [{ name: "CAAAM - Caixa de Assistência dos Advogados do Amazonas" }],
  creator: "CAAAM",
  
  // --- FAVICON ---
  icons: {
    icon: "https://caaam.org.br/wp-content/uploads/2022/09/cropped-favicon-32x32.jpg",
    shortcut: "https://caaam.org.br/wp-content/uploads/2022/09/cropped-favicon-32x32.jpg",
    apple: "https://caaam.org.br/wp-content/uploads/2022/09/cropped-favicon-32x32.jpg", // Ícone para dispositivos Apple
  },

  // --- OPEN GRAPH (para compartilhamento em redes sociais ) ---
  openGraph: {
    title: "Sistema de Sorteio OAB/CAAAM",
    description: "Realize sorteios justos e transparentes para seus eventos de forma moderna e auditável.",
    url: siteUrl,
    siteName: "Sistema de Sorteio OAB/CAAAM",
    // Adicione uma imagem de compartilhamento (1200x630px é o ideal)
    // images: [
    //   {
    //     url: `${siteUrl}/og-image.png`, 
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "pt_BR",
    type: "website",
  },

  // --- TWITTER CARD (para compartilhamento no Twitter) ---
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Sorteio OAB/CAAAM",
    description: "Realize sorteios justos e transparentes para seus eventos de forma moderna e auditável.",
    // images: [`${siteUrl}/og-image.png`], // A mesma imagem do Open Graph
  },

  // --- ROBOTS E INDEXAÇÃO ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false} // Mantido conforme seu código original
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
