<template>
    <div>
    <coral-toast id="errorToast" autodismiss="5000" variant="error">{{ toastMsg }}</coral-toast>
    <coral-toast id="successToast" autodismiss="5000" variant="success">{{ toastMsg }}</coral-toast>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name:"FeedbackToast",

    computed:{
      ...mapState(['toastMsg'])
    }
}
</script>

<style>

</style>