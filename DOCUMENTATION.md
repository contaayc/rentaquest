# 📘 Documentación Técnica y Guía de Desarrollo: Renta Quest 2026

> **Sistema de Diagnóstico Tributario Gamificado para Personas Naturales en Colombia**  
> **Año Gravable 2025 (Declaración en 2026) — Desarrollado para Contabilidad A&C**

---

## 📑 Tabla de Contenidos
1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura y Stack Tecnológico](#2-arquitectura-y-stack-tecnológico)
3. [Estructura del Proyecto y Archivos](#3-estructura-del-proyecto-y-archivos)
4. [Motor de Reglas y Normativa Tributaria (DIAN)](#4-motor-de-reglas-y-normativa-tributaria-dian)
5. [Componentes y Flujo de Navegación](#5-componentes-y-flujo-de-navegación)
6. [Generador de Reportes en PDF y Notificaciones](#6-generador-de-reportes-en-pdf-y-notificaciones)
7. [Guía de Despliegue en Organización de GitHub y GitHub Pages](#7-guía-de-despliegue-en-organización-de-github-y-github-pages)
8. [Mantenimiento y Actualizaciones Futuras](#8-mantenimiento-y-actualizaciones-futuras)

---

## 1. Visión General del Proyecto

**Renta Quest 2026** es una Single Page Application (SPA) interactiva y gamificada diseñada para que cualquier contribuyente (o asesor tributario) determine en menos de 3 minutos:
1. Si está **obligado a declarar renta** por el año gravable 2025.
2. Qué **formulario oficial de la DIAN** le corresponde (Formulario 210 para residentes, Formulario 110 para no residentes, o Formulario 260 para Régimen Simple).
3. Su **fecha límite exacta de vencimiento** según los dos últimos dígitos de su Cédula o NIT (Calendario Tributario DIAN 2026: 12 de agosto al 23 de octubre de 2026).
4. Su **Checklist de documentos soporte** personalizados según su perfil y operaciones.
5. Los **beneficios fiscales aplicables** (1% por facturación electrónica, deducciones y bancarización).
6. Generación de un **informe PDF oficial descargable** y conexión directa con los asesores de **Contabilidad A&C** vía WhatsApp y correo.

---

## 2. Arquitectura y Stack Tecnológico

| Capa / Módulo | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework Core** | React | 19.0.1 | Renderizado de interfaz basado en componentes funcionales y hooks |
| **Tipado Estático** | TypeScript | ~5.8.2 | Seguridad de tipos, interfaces para datos tributarios y validación en compilación |
| **Bundler / Build** | Vite | 6.2.3 | Empaquetado ultrarrápido y soporte para rutas relativas (`base: './'`) |
| **Estilos y Diseño** | Tailwind CSS | v4.1.14 | Motor moderno de estilos utilitarios `@import "tailwindcss";` mobile-first |
| **Generación de PDF** | jsPDF | 4.2.1 | Generación de reportes PDF vectoriales en el navegador del cliente |
| **Efectos Visuales** | Canvas-Confetti | 1.9.4 | Celebraciones interactivas al completar niveles o diagnósticos |
| **Efectos de Sonido** | Web Audio API | Nativo | Síntesis de sonido procedural (sin descargar archivos MP3/WAV pesados) |
| **Iconografía** | Lucide React | 0.546.0 | Iconos vectoriales optimizados |
| **Despliegue** | GitHub Pages + gh-pages | 6.3.0 | Hosting estático y CD automatizado |

---

## 3. Estructura del Proyecto y Archivos

```tree
renta-quest-2026/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline CI/CD para GitHub Actions
├── public/                       # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── Level1Regime.tsx      # Nivel 1: Régimen Simple y Sucesiones Ilíquidas
│   │   ├── Level2Residency.tsx   # Nivel 2: Algoritmo de Residencia Fiscal (Art. 10 E.T.)
│   │   ├── Level3Thresholds.tsx  # Nivel 3: Sliders y cálculo de topes UVT
│   │   ├── Level4Benefits.tsx    # Nivel 4: Facturación 1%, mejoras vivienda, cuentas
│   │   └── OracleResults.tsx     # Nivel 5: Veredicto final, calendario, PDF y contacto
│   ├── data/
│   │   └── taxRules2025.ts       # Constantes UVT 2025, topes en COP y calendario DIAN
│   ├── types/
│   │   └── tax.ts                # Tipos TypeScript (UserData, TaxRules, etc.)
│   ├── utils/
│   │   ├── audio.ts              # Motor de sonido sintético Web Audio API
│   │   └── pdfGenerator.ts       # Motor de exportación PDF estructurado
│   ├── App.tsx                   # Componente principal, barra de salud y progreso
│   ├── index.css                 # Importación global de Tailwind CSS
│   └── main.tsx                  # Punto de entrada React
├── .gitignore                    # Archivos ignorados en Git (node_modules, dist, etc.)
├── DOCUMENTATION.md              # Documentación técnica completa
├── package.json                  # Dependencias y scripts (`dev`, `build`, `deploy`)
├── README.md                     # Resumen público del proyecto
├── tsconfig.json                 # Configuración de compilador TypeScript
└── vite.config.ts                # Configuración de Vite con `base: './'`
```

---

## 4. Motor de Reglas y Normativa Tributaria (DIAN)

Todos los cálculos están centralizados en `src/data/taxRules2025.ts` y siguen el **Estatuto Tributario de Colombia**:

### 📊 Unidad de Valor Tributario (UVT) 2025
- **Valor UVT 2025:** `$49.799 COP`

### 🛡️ Topes que obligan a declarar (Año Gravable 2025)

| Concepto | Tope en UVT | Valor en Pesos COP (2025) | Artículo E.T. |
| :--- | :--- | :--- | :--- |
| **Patrimonio Bruto** al 31 de dic de 2025 | 4.500 UVT | **$224.095.500 COP** | Art. 592 y 594-3 |
| **Ingresos Brutos** totales en 2025 | 1.400 UVT | **$69.718.600 COP** | Art. 592 y 594-3 |
| **Consumos con Tarjeta de Crédito** | 1.400 UVT | **$69.718.600 COP** | Art. 594-3 |
| **Compras y Consumos Totales** | 1.400 UVT | **$69.718.600 COP** | Art. 594-3 |
| **Consignaciones Bancarias / Depósitos** | 1.400 UVT | **$69.718.600 COP** | Art. 594-3 |

### 🗓️ Calendario de Vencimientos 2026 (DIAN)
El aplicativo incluye una tabla indexada con los 50 pares de dígitos (del `01-02` hasta el `99-00`), que asigna la fecha exacta de vencimiento:
- **Agosto de 2026:** Dígitos `01-02` (12 de agosto) a `25-26` (28 de agosto).
- **Septiembre de 2026:** Dígitos `27-28` (1 de septiembre) a `73-74` (30 de septiembre).
- **Octubre de 2026:** Dígitos `75-76` (1 de octubre) a `99-00` (23 de octubre).

---

## 5. Componentes y Flujo de Navegación

### `src/App.tsx`
- **Gestión del Estado Global:** Administra `userData`, `currentLevel` (1 a 5), `soundEnabled`, y el porcentaje de salud tributaria `taxHealth`.
- **Barra de Progreso Superior:** Muestra el nivel actual, las insignias desbloqueadas y el botón de reinicio.
- **Selector de Perfil Inicial:** Permite ingresar nombre libre, categoría de actividad económica (Empleado, Independiente, Comerciante, etc.) y número de cédula con cálculo dinámico del vencimiento.

### `src/components/Level1Regime.tsx`
- Evalúa si el contribuyente pertenece al **Régimen Simple de Tributación (RST)** o si se trata de una **Sucesión Ilíquida**.
- Si pertenece al RST, el oráculo asigna directamente el **Formulario 260**.

### `src/components/Level2Residency.tsx`
- Ejecuta las 5 preguntas del **Artículo 10 del Estatuto Tributario**:
  1. Permanencia continua o discontinua en Colombia por más de 183 días en un periodo de 365 días.
  2. Vínculos de servicio exterior con el Estado colombiano.
  3. Cónyuge o hijos dependientes residiendo en Colombia.
  4. Más del 50% de los ingresos o patrimonio localizados en Colombia.
  5. Residencia en paraísos fiscales / jurisdicciones no cooperantes.
- Determina si declara en **Formulario 210** (Residente) o **Formulario 110** (No Residente).

### `src/components/Level3Thresholds.tsx`
- Cinco sliders táctiles con entrada numérica manual y botones de incremento rápido (+10M, +50M, Reset).
- Indicadores visuales en verde (dentro del límite) y ámbar/rojo (tope superado con advertencia de obligación).

### `src/components/Level4Benefits.tsx`
- **Facturación Electrónica:** Deducción del 1% del valor de las compras con factura electrónica que no tengan relación de causalidad, con tope de 240 UVT ($11.951.760 COP).
- **Mejoras en Vivienda:** Ajuste al costo fiscal según Art. 70 E.T.
- **Alerta de Cuentas Prestadas:** Advierte el riesgo de superar el tope de consignaciones de 1.400 UVT por recibir dinero de terceros.

### `src/components/OracleResults.tsx`
- Pantalla final con 4 pestañas interactivas:
  - **Veredicto:** Estado de obligación, formulario asignado y tarjeta de resumen.
  - **Calendario:** Fecha límite oficial, días restantes y recordatorio.
  - **Checklist:** Lista interactiva de documentos requeridos (RUT actualizado, certificados de ingresos y retenciones, extractos bancarios, etc.).
  - **Asesoría:** Integración directa con **Contabilidad A&C** vía WhatsApp y correo electrónico con resumen preformateado.

---

## 6. Generador de Reportes en PDF y Notificaciones

El módulo `src/utils/pdfGenerator.ts` utiliza **jsPDF** para construir un documento vectorizado con diseño profesional:
- **Cabecera Institucional:** Encabezado con los datos de **Contabilidad A&C** (NIT, Teléfono, Correo).
- **Ficha del Contribuyente:** Nombre, Cédula, Perfil/Categoría, Residencia fiscal y Formulario asignado.
- **Tabla Comparativa de Topes:** Valores informados vs Topes de Ley UVT 2025 con estado (*Cumple* / *Supera tope*).
- **Fecha Límite Oficial DIAN 2026.**
- **Inventario de Documentos Soporte:** Lista de verificación de documentos requeridos.
- **Firma y Pie de Página:** Disclaimer tributario y contacto de asesoría.

---

## 7. Guía de Despliegue en Organización de GitHub y GitHub Pages

Tienes a tu disposición dos métodos de despliegue:

### 🌟 Método 1: Despliegue en 1 Solo Comando (`npm run deploy`) — **Recomendado**

Este método utiliza el paquete `gh-pages` preinstalado y funciona **sin importar las restricciones de permisos de la organización de GitHub**:

#### 1. Preparar la carpeta local
Descarga o clona el proyecto y abre tu terminal en la carpeta raíz:

```bash
# 1. Instalar dependencias
npm install

# 2. Conectar tu repositorio de la organización (contaayc)
git init
git branch -M main
git remote add origin https://github.com/contaayc/renta_quest.github.io.git

# 3. Compilar y publicar a GitHub Pages en 1 comando
npm run deploy
```

#### 2. Configurar la rama en GitHub (Solo una vez)
1. Entra a tu repositorio: `https://github.com/contaayc/renta_quest.github.io`
2. Ve a **Settings** > **Pages**.
3. En **Build and deployment**:
   - **Source:** Selecciona **Deploy from a branch**.
   - **Branch:** Selecciona **`gh-pages`** y carpeta **`/(root)`**.
   - Haz clic en **Save**.
4. Tu sitio web estará disponible en:
   👉 `https://contaayc.github.io/renta_quest.github.io/`

---

### 🤖 Método 2: Despliegue Automático con GitHub Actions (CI/CD)

Si deseas que GitHub compile y publique automáticamente el sitio con cada `git push`:

#### 1. Desbloquear los permisos en la Organización `contaayc`
1. Ingresa a `https://github.com/organizations/contaayc/settings/actions`.
2. En **Actions permissions**, selecciona **"Allow all actions and reusable workflows"**.
3. En **Workflow permissions**, selecciona **"Read and write permissions"** y marca **"Allow GitHub Actions to create and approve pull requests"**.
4. Haz clic en **Save**.

#### 2. Configurar Pages en el Repositorio
1. En el repositorio (`renta_quest.github.io`), ve a **Settings** > **Pages**.
2. En **Source**, selecciona **GitHub Actions**.

#### 3. Subir los cambios a `main`
```bash
git add .
git commit -m "feat: release renta quest 2026"
git push -u origin main
```
El archivo `.github/workflows/deploy.yml` ejecutará la compilación y el despliegue automático.

---

## 8. Mantenimiento y Actualizaciones Futuras

### Para actualizar la UVT para un nuevo año gravable (Ej. Año Gravable 2026 / Presentación 2027):
1. Abrir `src/data/taxRules2025.ts`.
2. Actualizar la constante `UVT_VALUE` con el nuevo valor fijado por la resolución de la DIAN.
3. Los topes de patrimonio (4.500 UVT), ingresos (1.400 UVT) y deducciones (240 UVT) se recalcularán automáticamente en toda la aplicación.
4. Actualizar el array `DIAN_CALENDAR_2026` con las fechas de la nueva resolución de plazos.

---

*Desarrollado para **Contabilidad A&C** — Todos los derechos reservados.*
