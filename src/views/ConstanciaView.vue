<template>
  <div class="pagina">

    <div v-if="cargando" class="estado-msg">Cargando constancia...</div>

    <div v-else-if="errorRed" class="estado-msg error">{{ errorRed }}</div>

    <div v-else-if="sinResultados" class="estado-msg">
      No se encontraron matrículas registradas para el CUI: {{ cui }}
    </div>

    <div v-else class="constancia">
      <div class="encabezado">
        <h1 class="titulo-principal">CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>
        <h2 class="subtitulo-inst">Escuela Profesional de Ingeniería de Sistemas EPIS</h2>
        <p class="fecha-emision">Emitido el: {{ fechaEmision }}</p>
      </div>

      <hr class="divisor" />

      <div class="seccion">
        <div class="seccion-header">DATOS DEL ALUMNO</div>
        <div class="datos-alumno">
          <div class="fila-dato">
            <span class="campo">C.U.I.:</span>
            <span class="valor">{{ alumno.cui }}</span>
          </div>
          <div class="fila-dato">
            <span class="campo">Nombre completo:</span>
            <span class="valor">{{ alumno.full_name }}</span>
          </div>
          <div class="fila-dato">
            <span class="campo">Email:</span>
            <span class="valor">{{ alumno.email }}</span>
          </div>
        </div>
      </div>

      <div class="seccion">
        <div class="seccion-header">ASIGNATURAS MATRICULADAS</div>
        <table class="tabla-cursos">
          <thead>
            <tr>
              <th>N°</th>
              <th>Código</th>
              <th>Curso</th>
              <th>Año</th>
              <th>Grupo</th>
              <th>Laboratorio</th>
              <th>Docente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(enrollment, i) in matriculas" :key="enrollment.id">
              <td>{{ i + 1 }}</td>
              <td>{{ enrollment.workload.course.code }}</td>
              <td>
                <strong>{{ enrollment.workload.course.name }}</strong><br>
                ({{ enrollment.workload.course.acronym }})
              </td>
              <td>{{ enrollment.workload.course.year_display }}</td>
              <td>{{ enrollment.workload.group }}</td>
              <td>{{ enrollment.workload.laboratory }}</td>
              <td>{{ enrollment.workload.teacher.full_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="total-cursos">
        <strong>Total de cursos matriculados: {{ matriculas.length }}</strong>
      </p>

      <p class="pie-doc">
        Sebastian Colen Bernal Neyra.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/index.js'

const route = useRoute()
const cui = route.params.cui

const cargando = ref(true)
const errorRed = ref(null)
const sinResultados = ref(false)
const matriculas = ref([])
const alumno = ref({})
const fechaEmision = ref('')

onMounted(async () => {
  const hoy = new Date()
  fechaEmision.value = hoy.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  try {
    const res = await api.get(`/enrollment-certificate/?cui=${cui}`)
    if (res.data.count === 0) {
      sinResultados.value = true
    } else {
      matriculas.value = res.data.results
      alumno.value = res.data.results[0].student
    }
  } catch (err) {
    errorRed.value = 'Error al conectar con el servidor. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
* { box-sizing: border-box; }

.pagina {
  min-height: 100vh;
  background: #e8ecf0;
  padding: 32px 16px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.estado-msg {
  max-width: 860px;
  margin: 60px auto;
  text-align: center;
  font-size: 1rem;
  color: #555;
}
.estado-msg.error { color: #c0392b; }

.constancia {
  max-width: 860px;
  margin: 0 auto;
  background: white;
  padding: 40px 48px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.encabezado { text-align: center; margin-bottom: 20px; }

.titulo-principal {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a3a6b;
  margin: 0 0 6px;
}

.subtitulo-inst {
  font-size: 0.98rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px;
}

.fecha-emision {
  font-size: 0.88rem;
  color: #555;
  margin: 0;
}

.divisor {
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
}

.seccion { margin-bottom: 24px; }

.seccion-header {
  background: #dde3ea;
  color: #1a3a6b;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 7px 12px;
  border-left: 4px solid #1a3a6b;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.datos-alumno { padding: 0 8px; }

.fila-dato {
  display: flex;
  padding: 5px 0;
  font-size: 0.93rem;
}

.campo {
  font-weight: 700;
  width: 180px;
  flex-shrink: 0;
  color: #222;
}

.valor { color: #333; }

.tabla-cursos {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.tabla-cursos th {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
  font-weight: 700;
  color: #222;
}

.tabla-cursos td {
  border: 1px solid #ccc;
  padding: 8px 10px;
  vertical-align: top;
  color: #333;
}

.tabla-cursos tbody tr:nth-child(even) { background: #fafafa; }

.total-cursos {
  font-size: 0.93rem;
  margin: 20px 0 0;
  color: #222;
}

.pie-doc {
  text-align: center;
  font-style: italic;
  font-size: 0.82rem;
  color: #777;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>