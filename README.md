# 💻 PROGRAMACIONCRUZ

Este repositorio contiene un proyecto base desarrollado con **Next.js 14 (App Router)** como parte de la materia **Programación III - Semestre 2025B**.  

El objetivo principal es aplicar conceptos clave de **desarrollo web moderno**, buenas prácticas y la personalización de layouts y componentes.  

El proyecto está configurado para mostrar cómo estructurar una aplicación con diferentes secciones que tienen sus propios diseños y tipografías, una necesidad común en aplicaciones reales que cuentan con una parte pública y otra privada (como un dashboard).  

---

## ✨ Características Principales  

- 🚀 **Next.js App Router** → Enrutamiento basado en directorios para una organización intuitiva y potente.  
- 🧩 **Layouts Anidados (Nested Layouts)** → Diferentes diseños y tipografías por sección.  
- 📂 **Grupos de Rutas (Route Groups)** → Organización de rutas con `(general)` sin afectar la URL.  
- 🔠 **Optimización de Fuentes con next/font** → Fuentes de Google Fonts cargadas de forma eficiente.  
- 🛡️ **TypeScript** → Código tipado, robusto y escalable.  
- 🎨 **Tailwind CSS** → Estilos modernos, rápidos y responsivos.  
- 🔗 **@primer/octicons-react** → Librería de íconos lista para usar.  

---

## 🛠️ Tecnologías Utilizadas  

- ⚛️ **React 18** → Librería para interfaces de usuario.  
- 🔷 **Next.js 14** → Framework de React para producción.  
- 📘 **TypeScript** → JavaScript con superpoderes.  
- 🎨 **Tailwind CSS** → Framework de estilos utilitarios.  
- 🔠 **next/font** → Optimización automática de fuentes.  
- 🖼️ **@primer/octicons-react** → Íconos modernos para la UI.  

---

## 🚀 Cómo Empezar  

### 🔹 Prerrequisitos  
- Tener instalado **Node.js** (v18.17 o superior).  
- Un gestor de paquetes como **npm**, **yarn** o **pnpm**.  

### 🔹 Instalación  

📥 **Clona el repositorio:**  
**bash**
git clone https://github.com/Carol-20-Cruz/PROGRAMACIONCRUZ.git
📂 **Navega al directorio del proyecto:**
**bash**
cd PROGRAMACIONCRUZ

⚙️ **Instala las dependencias:**
**bash**
npm install

▶️ **Ejecuta el servidor de desarrollo:**
**bash**
npm run dev Abre 👉 http://localhost:3000
 en tu navegador.

---

## 📂 Estructura del Proyecto

La estructura de carpetas está diseñada para ser escalable y fácil de entender, separando las rutas principales en un grupo para mayor claridad.

```bash
.
├── app/
│   ├── (general)/              # Grupo de rutas para organizar sin afectar la URL
│   │   ├── contact/            # Página de contacto (/contact)
│   │   ├── pricing/            # Página de precios (/pricing)
│   │   └── layout.tsx          # Layout del grupo (general)
│   │
│   ├── layout.tsx              # Layout raíz <html> y <body>
│   └── page.tsx                # Página de inicio (/)
│
├── components/                 # Componentes reutilizables
├── public/                     # Archivos estáticos
├── package.json
└── ... (otros archivos de configuración)

---

## 👩‍💻 Autora
Carol Liceth Cruz Roa
📚 Estudiante de Programación III - 2025B
🌐 GitHub: @Carol-20-Cruz
