<template>
    <div>
        <full-width-product-grid :products="sortedProducts" :loading="loading"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import App from './App'
import { getInjectedJsonOrFail } from '../services/get-injected-json'
import FullWidthProductGrid from './browse/FullWidthProductGrid'

export default {
    name: 'app-browse-related',

    extends: App,

    components: { FullWidthProductGrid },

    created() {
        const browseRelated = getInjectedJsonOrFail('browse_related')
        const productId = browseRelated.product_id
        const categorySlug = browseRelated.category_slug
        const optionalWords = browseRelated.optional_words
        const searchTags = browseRelated.search_tags

        this.$store.commit('setProductsPerPage', 8)
        this.$store.commit('addCategorySlug', categorySlug)
        this.$store.commit('setOptionalWords', optionalWords)
        this.$store.commit('setExcludeProductIds', [productId])
        this.$store.commit('setSearchTags', searchTags)

        this.$store.dispatch('fetch')
    },

    computed: {
        ...mapGetters([
            'loading',
            'sortedProducts',
        ])
    }
}
</script>
