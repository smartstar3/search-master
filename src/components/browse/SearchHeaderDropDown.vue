<template>
    <div :class="['top-filter-dropdown', {'is-open': isOpen}]">
        <div class="top-filter-dropdown__title" @click="toggle">{{selectedLabel}}</div>
        <div class="top-filter-dropdown__results">
            <ul class="top-filter-dropdown__options">
                <li v-for="(item, key) in options" :key="key" class="top-filter-dropdown__option"
                    @click="select(key)"
                >{{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

export default {
    name: 'search-header-drop-down',
    props: {
        selectedValue: null,
        options: null,
    },
    data() {
        return {
            isOpen: false,
        }
    },
    computed: {
        selectedLabel() {
            let item = this.options[this.selectedValue]
            if (item) {
                return item.label
            }
        }
    },
    methods: {
        toggle() {
            if (this.isOpen) {
                this.close()
            } else {
                this.open()
            }

        },
        open() {
            this.$emit('opened')
            this.isOpen = true
        },
        close() {
            this.isOpen = false
        },
        select(value) {
            this.$emit('select', value)
            this.close()
        }
    },
}
</script>
<style lang="scss">

</style>
