# 🛡️ Renta Quest 2026

> **Diagnóstico Tributario Gamificado e Interactivo para Personas Naturales en Colombia (Año Gravable 2025 - Presentación 2026)**.

Desarrollado para **Contabilidad A&C** con base en la normativa oficial de la **DIAN** (Estatuto Tributario Nacional).

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![DIAN](https://img.shields.io/badge/DIAN-Año_Gravable_2025-0d9488.svg)](https://www.dian.gov.co/)

---

## 📋 Descripción del Proyecto

**Renta Quest 2026** es una aplicación web interactiva, responsive (diseño mobile-first) y gamificada que guía a cualquier persona natural residente o no residente a través de 5 niveles para determinar con precisión su obligación tributaria, fechas límites de la DIAN, formularios aplicables y beneficios fiscales.

> 📖 **Para la documentación técnica completa del código y arquitectura, consulta [DOCUMENTATION.md](./DOCUMENTATION.md).**

---

1. **Régimen y Casos Especiales (Nivel 1):** Régimen Simple de Tributación (Formulario 260) y Sucesiones Ilíquidas.
2. **Residencia Fiscal (Nivel 2):** Test algorítmico del Artículo 10 del Estatuto Tributario (+183 días, nacionalidad, patrimonio/ingresos en Colombia, paraísos fiscales).
3. **Escudo de Topes Monetarios (Nivel 3):** Sliders y cálculo de topes basados en la UVT 2025 ($49.799 COP):
   - Patrimonio Bruto: **$224.095.500 COP** (4.500 UVT)
   - Ingresos Brutos: **$69.718.600 COP** (1.400 UVT)
   - Consumos con Tarjeta de Crédito: **$69.718.600 COP** (1.400 UVT)
   - Compras Totales: **$69.718.600 COP** (1.400 UVT)
   - Consignaciones e Inversiones: **$69.718.600 COP** (1.400 UVT)
4. **Beneficios y Mejoras (Nivel 4):** Deducción del 1% por Facturación Electrónica (hasta 240 UVT = $11.951.760 COP), mejoras en vivienda (Art. 70 E.T.) y riesgo de cuentas bancarias prestadas.
5. **El Oráculo & Veredicto Oficial (Nivel 5):**
   - Veredicto de obligación (Formularios 210, 110 o 260).
   - Calendario tributario DIAN exacto según los 2 últimos dígitos de la cédula o NIT (Agosto a Octubre de 2026).
   - Checklist de documentos requeridos (RUT, Formulario 220, certificados bancarios, etc.).
   - Generación y descarga directa de **Informe Tributario en PDF** estructurado.
   - Contacto directo e instantáneo a través de **WhatsApp** y **Correo Electrónico** con **Contabilidad A&C**.

---

## 🚀 Cómo Subir este Proyecto a GitHub

Sigue estos sencillos pasos desde tu terminal para subir tu código a tu cuenta u organización de GitHub:

### Paso 1: Inicializar el repositorio local
```bash
# Inicializa el repositorio git (si no lo has hecho)
git init

# Configura tu rama principal en main
git branch -M main
```

### Paso 2: Agregar los archivos y hacer el primer commit
```bash
# Agrega todos los archivos al seguimiento de Git
git add .

# Realiza el commit inicial
git commit -m "feat: initial release of Renta Quest 2026"
```

### Paso 3: Crear el repositorio en GitHub
1. Ve a [GitHub](https://github.com/new).
2. Crea un nuevo repositorio (por ejemplo: `renta-quest-2026`).
3. No marques la opción de inicializar con README (ya tenemos este).

### Paso 4: Conectar y subir el repositorio
```bash
# Reemplaza 'tu-usuario-u-organizacion' por tu usuario u org de GitHub:
git remote add origin https://github.com/tu-usuario-u-organizacion/renta-quest-2026.git

# Empuja el código a GitHub
git push -u origin main
```

---

## 🛠️ Instalación y Ejecución Local

Para correr el proyecto localmente en tu computadora:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario-u-organizacion/renta-quest-2026.git
cd renta-quest-2026

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000` o `http://localhost:5173`.

---

## 📦 Construcción para Producción

Para generar los archivos estáticos listos para desplegar en cualquier hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

```bash
npm run build
```

Los archivos compilados y optimizados se generarán en la carpeta `dist/`.

---

## 🌐 Despliegue en GitHub Pages (Organización de GitHub)

El proyecto incluye el flujo automatizado de **GitHub Actions** en `.github/workflows/deploy.yml` y la configuración `base: './'` en `vite.config.ts`.

### Paso a Paso para Desplegar:

1. **Crear la Organización en GitHub (Gratis)**:
   - Ve a [github.com/organizations/plan](https://github.com/organizations/plan).
   - Selecciona el plan **Free** (Gratuito).
   - Escribe el nombre de tu organización (por ejemplo: `contabilidad-ayc`).

2. **Crear el Repositorio dentro de la Organización**:
   - Dentro de la organización, haz clic en **New repository**.
   - Asigna un nombre (por ejemplo: `renta-quest-2026`).
   - Elige **Público** (GitHub Pages es gratuito para repositorios públicos en organizaciones).

3. **Subir el Código**:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: setup Renta Quest 2026 with GitHub Pages"
   git remote add origin https://github.com/NOMBRE_ORGANIZACION/renta-quest-2026.git
   git push -u origin main
   ```

4. **Activar GitHub Pages con GitHub Actions**:
   - En tu repositorio de GitHub, ve a **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
   - En **Build and deployment** > **Source**, selecciona: **GitHub Actions**.
   - ¡Listo! En 1 minuto tu aplicación estará en vivo en:  
     `https://NOMBRE_ORGANIZACION.github.io/renta-quest-2026/`

---

## 📱 Tecnologías Utilizadas

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Estilos:** Tailwind CSS v4 (Modern CSS Engine)
- **Generador de PDF:** jsPDF (Client-side vector generation)
- **Efectos y Gamificación:** Web Audio API sintético + Canvas-Confetti
- **Iconos:** Lucide React

---

## 📞 Contacto y Asesoría Tributaria

**Contabilidad A&C**  
- 📱 **WhatsApp:** [+57 316 628 1699](https://wa.me/573166281699)  
- ✉️ **Correo Electrónico:** [info@contabilidadayc.com.co](mailto:info@contabilidadayc.com.co)  
- 🇨🇴 Especialistas en Declaración de Renta Persona Natural y Asesoría Contable.

---

*Desarrollado con base en las resoluciones y decretos oficiales de la DIAN para el año gravable 2025.*
