<template>
    <div>
        <modal :active.sync="active">
            <div slot="body">
                <div class="center">
                    <p id="login-prompt-modal-message">Please log in or sign up.</p>
                    <a href="/account/login" class="btn btn--cta">Log In</a>
                    <a href="/pricing" class="btn btn--secondary">Sign Up</a>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
import Modal from './Modal'

export default {
    name: 'login-register-modal',
    components: { Modal },
    computed: {
        active: {
            get() {
                return this.$store.getters.loginRegisterModalActive
            },
            set(newVal) {
                this.$store.dispatch('setLoginRegisterModalActive', newVal)
            }
        }
    }
}
</script>
