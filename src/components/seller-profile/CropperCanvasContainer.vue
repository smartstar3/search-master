<template>
  <div class="cropper" style="display: flex; cursor: move;">
    <div ref="cropper"/>
  </div>

</template>

<script>
import Croppie from 'croppie'

export default {
    name: 'CropperCanvasContainer',

    props: {
        value: {
            required: true
        }
    },

    mounted() {
        const opts = {
            viewport: { width: 360, height: 360, type: 'circle' },
            boundary: { width: 360, height: 360 },
            url: this.value
        }

        const cropper = new Croppie(this.$refs.cropper, opts)

        this.$refs.cropper.addEventListener('update', () => {
            cropper.result({
                type: 'base64',
                size: 'viewport',
                format: 'png',
                circle: false
            }).then((result) => {
                this.$emit('input', result)
            })
        })
    }
}
</script>
