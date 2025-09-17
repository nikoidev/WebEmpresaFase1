'use client'

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
    is_active?: boolean // Solo para edición
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
        role: 'viewer',
        is_staff: false,
        is_superuser: false
    })

    useEffect(() => {
        fetchUsers()
    }, [currentPage, searchTerm])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await adminApi.getUsers({
                page: currentPage,
                search: searchTerm
            })
            
            if (response.data.users) {
                setUsers(response.data.users)
                setTotalPages(Math.ceil(response.data.total / response.data.per_page))
            } else {
                setUsers(response.data || [])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            if (editingUser) {
                // Para actualizaciones, omitir password si está vacío
                const submitData = !formData.password 
                    ? { 
                        email: formData.email,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        role: formData.role,
                        is_staff: formData.is_staff,
                        is_superuser: formData.is_superuser,
                        username: formData.email
                      }
                    : {
                        ...formData,
                        username: formData.email
                      }
                await adminApi.updateUser(editingUser.id, submitData)
            } else {
                const submitData = {
                    ...formData,
                    username: formData.email
                }
                await adminApi.createUser(submitData)
            }
            
            setIsModalOpen(false)
            setEditingUser(null)
            resetForm()
            fetchUsers()
        } catch (error) {
            console.error('Error saving user:', error)
            alert('Error al guardar el usuario. Revisa los datos e intenta nuevamente.')
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            password: '', // No mostrar password existente
            role: user.role,
            is_staff: user.is_staff,
            is_superuser: user.is_superuser,
            is_active: user.is_active
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (userId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await adminApi.deleteUser(userId)
                fetchUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
                alert('Error al eliminar el usuario.')
            }
        }
    }

    const handleToggleActive = async (userId: number, currentStatus: boolean) => {
        try {
            await adminApi.updateUser(userId, { is_active: !currentStatus })
            fetchUsers()
        } catch (error) {
            console.error('Error updating user status:', error)
            alert('Error al actualizar el estado del usuario.')
        }
    }

    const resetForm = () => {
        setFormData({
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            role: 'viewer',
            is_staff: false,
            is_superuser: false
        })
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return <Crown className="h-4 w-4 text-yellow-600" />
            case 'editor':
                return <Edit className="h-4 w-4 text-blue-600" />
            case 'viewer':
                return <Eye className="h-4 w-4 text-green-600" />
            default:
                return <UsersIcon className="h-4 w-4 text-gray-600" />
        }
    }

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-yellow-100 text-yellow-800'
            case 'editor':
                return 'bg-blue-100 text-blue-800'
            case 'viewer':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getRoleName = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'Administrador'
            case 'editor':
                return 'Editor'
            case 'viewer':
                return 'Visualizador'
            default:
                return 'Usuario'
        }
    }

    if (loading && users.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="h-full space-y-8">
            <DevFileInfo filePath="frontend/src/app/admin/users/page.tsx" />
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="mt-2 text-gray-600">
                        Administra usuarios, roles y permisos del sistema
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null)
                        resetForm()
                        setIsModalOpen(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <UsersIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Crown className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Administradores</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'admin' || u.is_superuser).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100">
                            <UserX className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Inactivos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => !u.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-8 text-center">
                        <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                        <p className="text-gray-600">
                            {searchTerm 
                                ? 'No se encontraron usuarios con ese término de búsqueda.'
                                : 'Comienza creando tu primer usuario.'
                            }
                        </p>
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
                                        Permisos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <UsersIcon className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.first_name && user.last_name 
                                                            ? `${user.first_name} ${user.last_name}`
                                                            : user.username
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRoleIcon(user.role)}
                                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {getRoleName(user.role)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                {user.is_superuser && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <Crown className="h-3 w-3 mr-1" />
                                                        Superusuario
                                                    </span>
                                                )}
                                                {user.is_staff && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <Shield className="h-3 w-3 mr-1" />
                                                        Staff
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    user.is_active
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {user.is_active ? (
                                                    <>
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Activo
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-3 w-3 mr-1" />
                                                        Inactivo
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Editar usuario"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false)
                                            setEditingUser(null)
                                            resetForm()
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="usuario@ejemplo.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contraseña {editingUser ? '(dejar vacío para mantener actual)' : '*'}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rol
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="user">Usuario</option>
                                            <option value="viewer">Visualizador</option>
                                            <option value="editor">Editor</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_staff"
                                                checked={formData.is_staff}
                                                onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <label htmlFor="is_staff" className="text-sm text-gray-700">
                                                Miembro del staff (acceso al admin)
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_superuser"
                                                checked={formData.is_superuser}
                                                onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <label htmlFor="is_superuser" className="text-sm text-gray-700">
                                                Superusuario (todos los permisos)
                                            </label>
                                        </div>

                                        {editingUser && (
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_active"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                <label htmlFor="is_active" className="text-sm text-gray-700">
                                                    Usuario activo
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 p-6">
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false)
                                            setEditingUser(null)
                                            resetForm()
                                        }}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {editingUser ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}