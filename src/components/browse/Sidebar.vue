<template>
    <div id="left-column">
        <search-tags/>
        <div id="categories" class="facet">
            <h5>Filter results</h5>
            <div class="al-hirearchy-widget">
                <ul v-for="category in categoryFilters" :key="category.slug">
                    <category-filter
                        :slug="category.slug"
                        :name="category.name"
                        :subCategories="category.subCategories"
                        :hasResolutions="category.hasResolutions"
                        :resolution="category.resolution"
                        :hasVersions="category.hasVersions"
                        :version="category.version"
                        :hasBpms="category.hasBpms"
                        :bpms="category.bpms"
                        :hasDurations="category.hasDurations"
                        :durations="category.durations"
                    ></category-filter>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CategoryFilter from '@/components/browse/CategoryFilter'
import SearchTags from '@/components/browse/SearchTags'

export default {
    name: 'sidebar',
    components: { SearchTags, CategoryFilter },
    computed: {
        ...mapGetters([
            'categoryFilters',
        ]),
    }
}
</script>
<style lang="scss">

</style>
