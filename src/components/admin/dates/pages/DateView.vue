<template>
<div class="d-flex justify-center">
    <v-date-input v-model="model" label="Select a date" max-width="368"></v-date-input>
</div>
</template>

  
<script>
export default {
    data: () => ({
        model: null,
    }),
}
</script>
