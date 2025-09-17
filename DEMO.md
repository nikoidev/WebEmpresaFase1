# 🎬 Demo Rápida - Web Empresa

¡Experimenta **Web Empresa** en acción! Esta guía te llevará paso a paso por las funcionalidades principales.

---

## 🚀 Demo en 10 Minutos

### 📋 Prerrequisitos
- ✅ Proyecto instalado según [README.md](README.md)
- ✅ Backend corriendo en http://localhost:8002
- ✅ Frontend corriendo en http://localhost:3001

---

## 🌐 Parte 1: Sitio Web Público (5 minutos)

### 1️⃣ **Página de Inicio** - http://localhost:3001
- 🏠 Hero dinámico con título y subtítulo
- ✨ Sección de características
- 📞 Llamada a la acción

### 2️⃣ **Página de Precios** - http://localhost:3001/precios
- 💰 Toggle mensual/anual (¡prueba el switch!)
- 📋 Tarjetas de planes con precios dinámicos
- 🎁 Sección de prueba gratuita
- ❓ Preguntas frecuentes

### 3️⃣ **Página Nosotros** - http://localhost:3001/nosotros
- 👥 Información de la empresa
- 🎯 Misión y visión
- 🏆 Valores corporativos

### 4️⃣ **Página Historia** - http://localhost:3001/historia
- 📈 Timeline de la empresa
- 📊 Números de impacto
- 🔮 Visión de futuro

### 5️⃣ **Página Clientes** - http://localhost:3001/clientes
- 🌍 Tipos de clientes
- 💬 Testimonios
- 📈 Métricas de éxito

### 6️⃣ **Página Contacto** - http://localhost:3001/contacto
- 📞 Información de contacto
- 📝 Formulario funcional (¡pruébalo!)
- ❓ FAQs específicas

**🎯 Nota**: Observa el diseño responsive - prueba en móvil, tablet y desktop!

---

## 🔐 Parte 2: Panel de Administración (5 minutos)

### 1️⃣ **Acceso al Admin** - http://localhost:3001/admin/login
```
Usuario: admin
Contraseña: admin123
```

### 2️⃣ **Dashboard** - http://localhost:3001/admin/dashboard
- 📊 Métricas del sistema
- ⚡ Acciones rápidas
- 🔗 Enlaces útiles

### 3️⃣ **Gestión de Contenido** - http://localhost:3001/admin/content

#### 🎨 **Editor Universal de Secciones**
1. **Editar Página de Inicio:**
   - Clic en "Editar" en la tarjeta "Página de Inicio"
   - Clic en "Editar" en la sección "Sección Hero"
   - Cambiar el título a "¡Bienvenido a Tu Empresa!"
   - Guardar y ver cambios en tiempo real
   - ✨ ¡Ve directamente a http://localhost:3001 y observa el cambio!

2. **Editor de Precios (CRUD Completo):**
   - Ir a la tarjeta "Precios" 
   - Clic en "Editar" → "Planes y Precios"
   - **Crear nuevo plan:**
     - Scroll hasta "Gestión de Planes"
     - Clic "Agregar Nuevo Plan"
     - Nombre: "Plan Demo"
     - Descripción: "Plan de demostración"
     - Precio mensual: 19.99
     - Precio anual: 199.99
     - Agregar características con el botón "+"
     - Guardar y ver en la página pública
   - **Editar plan existente:**
     - Cambiar color de un plan
     - Agregar/eliminar características
     - Marcar como "Popular"
     - Ver cambios instantáneos

3. **Editor de Navegación:**
   - Ir a la tarjeta "Menú de Navegación"
   - Clic en el botón de configuración
   - **Editar marca:**
     - Cambiar letra del logo: "MI"
     - Cambiar nombre empresa: "Mi Empresa"
     - Ver preview en tiempo real
   - **Gestionar enlaces:**
     - Agregar nuevo enlace: "Blog" → "/blog"
     - Elegir icono para el enlace
     - Reordenar elementos
     - Guardar y ver en la navegación principal

### 4️⃣ **Gestión de Usuarios** - http://localhost:3001/admin/users
- 👥 Lista de usuarios
- 🔐 Roles y permisos
- ➕ Crear nuevos usuarios

### 5️⃣ **Mensajes de Contacto** - http://localhost:3001/admin/contacts
- 📧 Ver mensajes recibidos
- 🔄 Cambiar estados
- 📋 Gestionar consultas

---

## 🎯 Demo Avanzada (Opcional)

### 🔄 **Sincronización en Tiempo Real**
1. Abre dos ventanas:
   - Ventana A: Panel admin editando contenido
   - Ventana B: Sitio público
2. Hacer cambios en el admin (Ventana A)
3. ¡Ver cambios instantáneos en sitio público (Ventana B)!

### 📱 **Testing Responsive**
1. Abrir DevTools (F12)
2. Alternar entre dispositivos:
   - 📱 Mobile (375px)
   - 📱 Tablet (768px) 
   - 💻 Desktop (1200px+)
3. Verificar que todo funciona perfectamente

### 🎨 **Personalización Visual**
1. **Cambiar colores de planes:**
   - Admin → Gestión de Contenido → Precios
   - Editar un plan existente
   - Cambiar color primario (ej: #10B981 para verde)
   - Ver cambios en tarjetas

2. **Customizar navegación:**
   - Agregar/quitar enlaces del menú
   - Cambiar iconos de navegación
   - Personalizar logo y nombre empresa

### 📝 **Formulario de Contacto**
1. Ir a la página de contacto
2. Llenar y enviar el formulario
3. Ir al admin → Mensajes de Contacto
4. Ver el mensaje recibido
5. Cambiar estado a "En progreso"

---

## 🛠️ Demo Técnica (Para Desarrolladores)

### 🔍 **API Exploration**
1. **Swagger UI**: http://localhost:8002/docs
   - Explorar todos los endpoints
   - Probar autenticación
   - Ejecutar requests en vivo

2. **API Manual Testing:**
```bash
# Health check
curl http://localhost:8002/health

# Get page content
curl http://localhost:8002/api/v1/page-content/homepage

# Login (get token)
curl -X POST http://localhost:8002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 🐳 **Docker Demo**
```bash
# Si usas Docker, mostrar containers
docker-compose -f docker-compose.webempresa.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.webempresa.yml logs -f
```

### 🔧 **VS Code Debug Demo**
1. Abrir VS Code en la carpeta del proyecto
2. Presionar **F5**
3. ¡Ver cómo se lanzan automáticamente frontend y backend!

---

## 🎬 Escenarios de Demo

### 🏢 **Escenario 1: Empresa de Servicios**
1. Cambiar contenido para consultora:
   - Hero: "Consultores Expertos"
   - Planes: "Consultoría Básica", "Consultoría Premium"
   - Nosotros: Equipo de consultores
2. Configurar precios por horas de consulta
3. Personalizar formulario de contacto para consultas

### 🎓 **Escenario 2: Institución Educativa**
1. Adaptar para academia:
   - Hero: "Academia de Programación"
   - Planes: "Curso Básico", "Bootcamp Completo"
   - Historia: Evolución de la academia
2. Testimonios de estudiantes graduados
3. FAQs sobre admisiones y certificaciones

### 💻 **Escenario 3: Empresa Tecnológica**
1. Configurar para startup tech:
   - Hero: "Soluciones SaaS Innovadoras"
   - Planes: "Starter", "Professional", "Enterprise"
   - Clientes: Casos de éxito tecnológicos
2. Métricas técnicas (uptime, performance)
3. Integración con documentación técnica

---

## 🎯 Checklist de Demo

### ✅ **Demo Completa**
- [ ] 🌐 Navegó por todas las páginas públicas
- [ ] 🔐 Accedió al panel de administración
- [ ] ✏️ Editó contenido y vio cambios en tiempo real
- [ ] 💰 Gestionó planes (crear/editar/eliminar)
- [ ] 🧭 Personalizó navegación y marca
- [ ] 📝 Probó formulario de contacto
- [ ] 📱 Verificó diseño responsive
- [ ] 🛠️ Exploró API documentation

### 🚀 **Puntos Destacados Demostrados**
- [ ] ⚡ Sincronización en tiempo real
- [ ] 🎨 Personalización completa sin código
- [ ] 📱 100% responsive design
- [ ] 🔒 Sistema de autenticación robusto
- [ ] 🛠️ Facilidad de uso para administradores
- [ ] ⚡ Performance y velocidad de carga
- [ ] 🔧 Facilidad de desarrollo y debug

---

## 💡 Tips para una Demo Exitosa

### 🎯 **Para Presentaciones**
1. **Prepara el entorno** - Todo funcionando antes de empezar
2. **Ten datos de prueba** - Contenido interesante para mostrar
3. **Enfócate en el valor** - Muestra cómo resuelve problemas reales
4. **Interactividad** - Deja que la audiencia sugiera cambios
5. **Fallbacks** - Ten screenshots por si algo falla

### 📱 **Para Clientes**
1. **Empieza con lo visual** - Sitio público impresiona primero
2. **Muestra facilidad de uso** - Admin intuitivo
3. **Demuestra tiempo real** - Cambios instantáneos
4. **Adaptabilidad** - Diferentes tipos de empresa
5. **Soporte técnico** - Documentación y comunidad

### 👩‍💻 **Para Desarrolladores**
1. **Arquitectura técnica** - Stack moderno y escalable
2. **Calidad del código** - TypeScript, validación, tests
3. **Developer experience** - Hot reload, debug, docs
4. **Extensibilidad** - Fácil agregar funcionalidades
5. **Best practices** - Seguridad, performance, SEO

---

## 🚀 Siguientes Pasos Después de la Demo

### 📈 **Para Usar en Producción**
1. **Configurar dominio propio**
2. **Setup de producción** (ver README.md)
3. **Personalizar contenido** para tu empresa
4. **Configurar SSL** y seguridad
5. **SEO optimization**

### 🛠️ **Para Desarrollar**
1. **Leer [CONTRIBUTING.md](CONTRIBUTING.md)**
2. **Explorar el código** fuente
3. **Ejecutar tests** localmente
4. **Hacer tu primer PR**
5. **Unirse a la comunidad**

### 🎨 **Para Personalizar**
1. **Estudiar [docs/FEATURES.md](docs/FEATURES.md)**
2. **Customizar colores** y estilos
3. **Agregar nuevas secciones**
4. **Integrar con servicios externos**
5. **Crear themes personalizados**

---

## 📞 ¿Preguntas Después de la Demo?

- 📚 **Documentación**: [README.md](README.md)
- 🎯 **Funcionalidades**: [docs/FEATURES.md](docs/FEATURES.md)
- 🐳 **Docker**: [docs/DOCKER.md](docs/DOCKER.md)
- 🤝 **Contribuir**: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/webempresa/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/webempresa)

---

<div align="center">

**🎬 ¡Esperamos que hayas disfrutado la demo de Web Empresa! 🚀**

[🏠 README](README.md) • [🚀 Instalación](README.md#-instalación-rápida) • [🤝 Contribuir](CONTRIBUTING.md)

---

*¿Te gustó el proyecto? ¡Dale una ⭐ en GitHub!*

</div>
