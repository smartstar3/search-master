<template>
    <div></div>
</template>

<script>
import { getInjectedJsonOrFail } from '../services/get-injected-json'

export default {
    created() {
        this.$store.dispatch('setUserMeta', {
            userLoggedIn: getInjectedJsonOrFail('user_logged_in')
        })
    }
}
</script>
