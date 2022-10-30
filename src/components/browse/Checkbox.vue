<template>
    <label :class="['checkbox', {'checked': checked, 'switch': isSwitch}]">
        <input type="checkbox" :checked="checked" @change="onChange"/>
        <span class="checkbox-icon"></span>
        <span class="checkbox-label" v-html="label"></span>
    </label>
</template>
<script>

export default {
    name: 'checkbox',
    props: {
        label: null,
        checked: {
            type: Boolean,
            default: false
        },
        isSwitch: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        onChange: function (event) {
            this.$emit('change', event.target.checked)
        }
    }
}
</script>
<style lang="scss">

</style>
