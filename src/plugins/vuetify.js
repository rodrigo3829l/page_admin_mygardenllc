// Styles
import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'

// // Vuetify
// import { createVuetify } from 'vuetify'

// export default createVuetify(
//   // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// )

import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'
// import { VDateInput } from 'vuetify/labs/VDateInput'
import 'vuetify/styles' // Asegúrate de importar los estilos

export default createVuetify({
  components: {
    VCalendar
    // VDateInput
  },
})
