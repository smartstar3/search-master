<template>
    <div v-if="active">
        <div class="ma-modal">
            <div class="modal-cover" @click.prevent="close"></div>
            <div ref="modalContainer" :class="['generic-modal', containerClass]">
                <a class="close-button" @click.prevent="close">
                    <i class="icon--cross"></i>
                </a>
                <header>
                    <h4 class="modal-title">
                        <slot name="header"></slot>
                    </h4>
                </header>
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'modal',
    props: {
        containerClass: {
            type: String,
            default: 'modal-width-medium'
        },
        title: {
            type: String,
            default: null
        },
        active: {
            type: Boolean,
            default: false,
        }
    },

    updated() {
        // Position modal in middle of the screen on X axis.
        if (this.active) {
            var top = (window.innerHeight - this.$refs.modalContainer.clientHeight) / 2
            this.$refs.modalContainer.style.top = top + 'px'
        }
    },

    methods: {
        close() {
            this.$emit('update:active', false)
        }
    }
}
</script>

// css for this component can be found in /laravel/resources/assets/site/sass/components/ma-modal.scss
// other places in the codebase use this css
