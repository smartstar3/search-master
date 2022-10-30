<template>
    <div class="spec-filters__group">
        <label for="spec-filters__input-bpm">{{label}}</label>
        <div class="spec-filters__bages clearfix">
            <span v-for="val in values" :key="val" class="spec-filters__bage">
                {{val}}
                <i class="icon icon--close" @click="removeValue(val)" ></i>
            </span>
        </div>
        <div>
            <input type="text" v-model="inputValue" @keyup.enter="addValue"/>
            <button @click="addValue" class="btn btn--primary">Add</button>
        </div>
    </div>
</template>
<script>

export default {
    name: 'select-multiple',
    props: {
        label: null,
        categoryId: null,
        values: null,
    },
    data() {
        return {
            inputValue: '',
        }
    },
    methods: {
        removeValue(value) {
            this.$emit('remove', value)
        },
        addValue() {
            if (this.inputValue === '') {
                return
            }
            this.$emit('add', this.inputValue)

            this.inputValue = ''
        }
    },
}
</script>
<style lang="scss">
    
</style>
