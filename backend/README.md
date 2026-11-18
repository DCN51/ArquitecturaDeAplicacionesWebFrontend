# Integración con feature/jair

El frontend usa http://localhost:8080 y se inicia en http://localhost:4200.

El parche feature-jair-auth.patch agrega únicamente requestMatchers con permitAll
para registrar usuarios y consultar o gestionar sesiones y diagnósticos.
Conserva los permisos originales. No modifica controladores, servicios ni DTO del backend.
La validación del diagn?stico conserva la autenticaci?n existente: el controlador
obtiene al psicólogo desde Authentication. El servicio de diagnósticos env?a el
JWT en esa petición mediante HttpHeaders.

El registro usa los IDs obtenidos de GET /api/roles. Al crear la cuenta se abre
el formulario de inicio de sesión. POST /login valida las credenciales en el
backend; el componente guarda token, username y rol en sessionStorage.
Los menús muestran opciones por rol mediante condiciones en el HTML.
Estas condiciones controlan la interfaz; los endpoints con permitAll son públicos.

Para otra copia limpia de feature/jair, aplicar desde la raíz del backend:

git apply C:/Users/g1010/ArquitecturaDeAplicacionesWebFrontend/backend/feature-jair-auth.patch

El backend requiere Java 21, la base de datos configurada, los roles PACIENTE y
PSICOLOGO y el plan free. No se verificó el flujo con una base de datos real.

El parche simplificado está preparado en este repositorio. No se aplicó a la
copia externa del backend porque no se autorizó la escritura fuera del workspace.
Esa copia conserva la configuración anterior de permisos por rol. El parche
se aplica sobre la versión original de SecurityConfig.java de feature/jair.
