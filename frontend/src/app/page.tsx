import { AuthProvider } from '@/contexts/AuthContext'
import HomePage from '@/components/HomePage'
import DevFileInfo from '@/components/DevFileInfo'

export default function Page() {
    return (
        <AuthProvider>
            <DevFileInfo filePath="frontend/src/app/page.tsx" />
            <HomePage />
        </AuthProvider>
    )
}
