<template>
    <div class="gr">
        <h1 class="browse-header__title">
            <template v-if="categoryName">
                <template v-if="subCategoryName">
                    {{subCategoryName}} -
                </template>
                {{categoryName}}
                {{dateAddedLabel}}
            </template>
            <template v-else>
                Browse Our Collection
            </template>
        </h1>
        <h3 id="stats">
            <div class="ais-root ais-stats">
                <div class="ais-body ais-stats--body">
                    {{siteTotalProductsCount}} Unlimited Downloads Available
                </div>
            </div>
        </h3>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'header',
    components: {},
    computed: {
        ...mapGetters([
            'categoryFilters',
            'singleCategory',
            'singleSubCategory',
            'dateAdded',
            'sortBy',
            'siteTotalProductsCount',
            'dateAddedLabel'
        ]),
        subCategoryName() {
            if (this.singleSubCategory) {
                return this.singleSubCategory.name
            }
        },
        categoryName() {
            if (this.singleCategory) {
                return this.singleCategory.name
            }
        },
    }
}
</script>
<style lang="scss">

</style>
