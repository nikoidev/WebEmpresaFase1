'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import DevFileInfo from '@/components/DevFileInfo'
import { adminApi } from '@/lib/api'
import { User, UserRole, Permission } from '@/types'
import { 
    Edit, 
    Plus, 
    Search, 
    Trash2, 
    Users as UsersIcon,
    Shield,
    Eye,
    Check,
    X,
    UserCheck,
    UserX,
    Crown
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserListResponse {
    users: User[]
    total: number
    page: number
    per_page: number
}

interface UserFormData {
    email: string  // Email es lo principal
    first_name: string
    last_name: string
    password: string
    role: UserRole
    is_staff: boolean
    is_superuser: boolean
    // username se establece automáticamente como email
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'viewer' as UserRole,
        is_staff: false,
        is_superuser: false
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadUsers()
    }, [currentPage])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const response = await adminApi.getUsers(currentPage, 10)
            const data: UserListResponse = response.data
            setUsers(data.users)
            setTotalPages(Math.ceil(data.total / data.per_page))
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            role: 'viewer' as UserRole,
            is_staff: false,
            is_superuser: false
        })
        setIsModalOpen(true)
        setError('')
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setFormData({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            password: '', // No pre-cargar password
            role: user.role,
            is_staff: user.is_staff,
            is_superuser: user.is_superuser
        })
        setIsModalOpen(true)
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            if (editingUser) {
                // Actualizar usuario
                const updateData = { ...formData }
                delete updateData.password // No enviar password vacío en updates
                await adminApi.updateUser(editingUser.id, updateData)
            } else {
                // Crear nuevo usuario
                await adminApi.createUser(formData)
            }
            
            setIsModalOpen(false)
            loadUsers()
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Error al guardar usuario')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.username}"?`)) {
            return
        }

        try {
            await adminApi.deleteUser(user.id)
            loadUsers()
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Error al eliminar usuario')
        }
    }

    const getRoleColor = (role: UserRole) => {
        const colors = {
            'super_admin': 'bg-purple-100 text-purple-800',
            'admin': 'bg-red-100 text-red-800',
            'editor': 'bg-blue-100 text-blue-800',
            'moderator': 'bg-yellow-100 text-yellow-800',
            'viewer': 'bg-gray-100 text-gray-800'
        }
        return colors[role] || colors.viewer
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'super_admin': return <Crown className="h-4 w-4" />
            case 'admin': return <Shield className="h-4 w-4" />
            case 'editor': return <Edit className="h-4 w-4" />
            case 'moderator': return <UserCheck className="h-4 w-4" />
            default: return <Eye className="h-4 w-4" />
        }
    }

    const getRoleName = (role: UserRole) => {
        const names = {
            'super_admin': 'Super Admin',
            'admin': 'Administrador',
            'editor': 'Editor',
            'moderator': 'Moderador',
            'viewer': 'Visualizador'
        }
        return names[role] || 'Desconocido'
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="h-full space-y-8">
                <DevFileInfo filePath="frontend/src/app/admin/users/page.tsx" />
                
                {/* Header */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                                <p className="text-gray-600">Administra usuarios, roles y permisos del sistema</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateUser}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <UsersIcon className="h-5 w-5 mr-2" />
                            Usuarios ({filteredUsers.length})
                        </h3>
                    </div>
                    
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'Comienza creando tu primer usuario.'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleCreateUser}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Nuevo Usuario
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permisos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha Registro
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-800">
                                                                {user.full_name.charAt(0) || user.username.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.full_name || user.username}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    <span className="ml-1">{getRoleName(user.role)}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <X className="h-3 w-3 mr-1" />
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.permissions?.length || 0} permisos
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {user.is_superuser && 'Super Usuario'}
                                                    {user.is_staff && !user.is_superuser && 'Staff'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(user.date_joined).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Editar usuario"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Eliminar usuario"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Página <span className="font-medium">{currentPage}</span> de{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Create/Edit User */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
                            </h3>
                            
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="text-sm text-red-800">{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email (usado como nombre de usuario)
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={!!editingUser} // No permitir cambiar email en edición
                                        placeholder="ejemplo@empresa.com"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Este email se usará para iniciar sesión
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={!editingUser}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Rol
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="viewer">Visualizador</option>
                                        <option value="moderator">Moderador</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Administrador</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_staff}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_staff: e.target.checked }))}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Es staff</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_superuser}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_superuser: e.target.checked }))}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Es superusuario</span>
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
