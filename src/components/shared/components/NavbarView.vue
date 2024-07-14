<template>
  <v-navigation-drawer
      v-model="drawer"
      temporary
    >
    <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        :title="userStore.name"
        :subtitle="userStore.email"
      ></v-list-item>

      <v-divider></v-divider>
      <v-list-item
        v-for="(link, index) in links"
        :key="index"
        :prepend-icon="link.icon"
        :title="link.name"
        @click="$router.push({ name: link.to })"
        :value="link.to"
      ></v-list-item>

      
      <div v-if="userStore.rol === 'admin'">
        <!-- <v-list-item prepend-icon="mdi-lightbulb-outline" @click="$router.push({ name: 'predictions' })" title="Predicciones"></v-list-item> -->
        <v-list-item prepend-icon="mdi-currency-usd" @click="$router.push({ name: 'quote' })" title="Cotizar"></v-list-item>
        <v-list-item prepend-icon="mdi-help-circle" @click="$router.push({ name: 'questions' })" title="Preguntas frecuentes"></v-list-item>
        <v-list-item prepend-icon="mdi-comment" @click="$router.push({ name: 'comments' })" title="Comentarios"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" @click="$router.push({ name: 'services' })" title="Servicios"></v-list-item>
        <v-list-item prepend-icon="mdi-calendar" @click="$router.push({ name: 'calendar' })" title="Calendario"></v-list-item>
        <v-list-item prepend-icon="mdi-ruler" @click="$router.push({ name: 'unit' })" title="Unidades"></v-list-item>
        <v-list-item prepend-icon="mdi-truck" @click="$router.push({ name: 'provider' })" title="Proveedores"></v-list-item>
        <v-list-item prepend-icon="mdi-package-variant" @click="$router.push({ name: 'products' })" title="Productos"></v-list-item>
        <!-- <v-list-item prepend-icon="mdi-calendar-remove" @click="$router.push({ name: 'dates' })" title="Fechas no disponibles"></v-list-item> -->
      </div>
      <v-list-item v-if="theme.global.name.value === 'dark'" prepend-icon="mdi-white-balance-sunny" title="Light" @click="toggleTheme"></v-list-item>
      <v-list-item v-if="theme.global.name.value === 'light'" prepend-icon="mdi-weather-night" title="Dark" @click="toggleTheme"></v-list-item>
      
      <template v-slot:append v-if="userStore.token"> 
        <div class="pa-2">
          <v-btn block @click="logout">
            Cerrar sesion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <nav class="navbar navbar-expand-lg navbar-light bg-green-darken-3 navbar-transition" clipped-left>
      <v-container>
        <div class="container">
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <router-link to="/" class="navbar-brand">
                <div class="d-flex align-items-center">
                  <img src="https://res.cloudinary.com/dui4i9f4e/image/upload/v1697989916/logos/jgkamjqwy97zkb0hfsye.png" alt="Logo" class="logo">
                </div>
              </router-link>
            </v-col>
            <v-col cols="auto" class="d-md-none d-lg-block">
              <p class="company-name">
                My Garden LLC
              </p>
              <p class="subtitle">
                Servicios de jardineria y mas
              </p>
            </v-col>
            <v-col v-if="width > pixels" cols="auto">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                  <v-btn 
                  v-if="userStore.token"
                  variant="text"
                  @click="logout">
                    Cerrar sesion
                  </v-btn>
                </ul>
              </div>
            </v-col>

            <v-col cols="auto" class="d-flex align-items-center">

              <v-app-bar-nav-icon v-if="userStore.token" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </v-col>
  
          </v-row>
        </div>
      </v-container>
    </nav>
  </template>
  
  <script>
    import { useUserStore } from '@/store/userStore';
    import { useDisplay } from 'vuetify'
    import { useTheme } from 'vuetify'
    const userStore = useUserStore();
    
    export default {
      setup() {
          const { width, mobile } = useDisplay()
          const theme = useTheme()
          const toggleTheme = () => {
            theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
          }
          return {
            theme,
            toggleTheme,
            width,
            mobile
          };
        },
      
      data() {
        return {
          links : [
            // { name: 'Home', to: 'home-home', icon: 'mdi-home' },
            // { name: 'Services', to: 'services-services', icon: 'mdi-hammer-screwdriver' },
            // { name: 'Projects', to: 'proyects-view', icon: 'mdi-briefcase' },
            // { name: 'Contact', to: 'home-contact', icon: 'mdi-email' },
            // { name: 'FaQS', to: 'home-answers', icon: 'mdi-help-circle' },
          ],
          drawer: false,
          userStore,
          pixels : 750
        }
      },
      
      methods: {
        
        speak (text) {
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        },
        profile () {
          this.$router.push({ name: 'profile-profile' });
        },
        services () {
          this.$router.push({ name: 'profile-myservices' });
        },
        async logout() {
          await userStore.logout();
          this.$router.push('/');
        },
        changeLanguage(lang) {
          console.log(lang)
        },
        hideNavbar() {
          const navbar = document.querySelector('.navbar-transition');
          if (navbar) navbar.style.opacity = '0';
        },
        showNavbar() {
          const navbar = document.querySelector('.navbar-transition');
          if (navbar) navbar.style.opacity = '1';
        }
      },
      mounted() {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.userStore.refreshToken();
        }
        console.log(this.$vuetify)
        let lastScrollTop = 0; 
  
        window.addEventListener('scroll', () => {
          let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
          if (currentScroll > lastScrollTop) {
            this.hideNavbar();
          } else {
            this.showNavbar();
          }
          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Evita valores negativos
        }, false);
      },
    };
  </script>
  
  <style scoped>
    .logo {
      width: 120px;
      margin-right: 10px;
    }
  
    .company-name {
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      color: #efe9e9;
    }
  
    .subtitle {
      font-size: 14px;
      margin: 0;
      color: #efe9e9;
    }
  
    .nav-link {
      color: #c6c5c5;
      padding: 0.5rem 1rem;
    }
  
    .is-active {
      color: #ffffff;
    }
  
    .navbar-transition {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      transition: opacity 0.5s ease-in-out;
      opacity: 1;
    }
  
  </style>