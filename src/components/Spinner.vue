<template>
    <div v-if="isWaiting" class="fixed-center loading-wrapper">
      <div class="absolute-center _coral-Dialog is-open">
        <h3 class="coral-Body--M text-center m-b-15 f-w-600">
          Connecting to AirTable
        </h3>

        <div class="m-auto">
          <coral-wait></coral-wait>
        </div>
        
        <p class="coral-Body--S text-center m-t-15 o-80">
          If it's taking too long, reopen the plugin.
        </p>

      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name:"Spinner",

    computed:{
      ...mapState(['isWaiting'])
    }
}
</script>

<style>

</style>