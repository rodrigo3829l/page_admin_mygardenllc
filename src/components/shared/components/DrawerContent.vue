<template>
    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg" title="John Leider"
        subtitle="ejemplo de correo"></v-list-item>

    <v-divider></v-divider>
    <v-list-item v-for="(link, index) in links" :key="index" :prepend-icon="link.icon" :title="link.name"
        @click="$router.push({ name: link.to })" :value="link.to"></v-list-item>

    <v-list-item v-if="!userStore.token" prepend-icon="mdi-login" :title="$t('navbar.loginString')"></v-list-item>

    <div v-if="userStore.token">
        <v-list-item prepend-icon="mdi-account" @click="$router.push({ name: 'profile-profile' })"
            :title="$t('navbar.yourAccountString')"></v-list-item>
        <v-list-item prepend-icon="mdi-cogs" @click="$router.push({ name: 'profile-myservices' })"
            :title="$t('navbar.yourServices')"></v-list-item>
    </div>

    <v-list-item v-if="theme.global.name.value === 'dark'" prepend-icon="mdi-white-balance-sunny" title="Light"
        @click="toggleTheme"></v-list-item>
    <v-list-item v-if="theme.global.name.value === 'light'" prepend-icon="mdi-weather-night" title="Dark"
        @click="toggleTheme"></v-list-item>
    <v-list-item v-if="this.$i18n.locale === 'en'" prepend-icon="mdi-translate" title="Español"
        @click="changeLanguage('es')"></v-list-item>
    <v-list-item v-if="this.$i18n.locale === 'es'" prepend-icon="mdi-translate" title="Inglish"
        @click="changeLanguage('en')"></v-list-item>

        <div v-if="userStore.token" class="pa-2">
            <v-btn block @click="logout">
                {{ $t('navbar.logoutString') }}
            </v-btn>
        </div>
</template>