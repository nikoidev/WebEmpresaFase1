import { redirect } from 'next/navigation'

// Redirigir a la página principal cuando alguien acceda a /footer
export default function FooterPage() {
    redirect('/')
}
