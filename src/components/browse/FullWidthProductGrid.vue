<template>
    <div>
        <section id="algolia-search__results" class="section">
            <div class="gr">
                <div class="four_products_grid">
                    <div class="gr al-loading" v-if="loading">
                        <div class="loading-icon">
                            <img src="/assets/images/site/loader.gif" style="width: auto; margin: auto">
                        </div>
                    </div>

                    <product-grid :products="products"/>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import ProductGrid from './ProductGrid'
export default {
    name: 'full-width-product-grid',
    components: { ProductGrid },
    props: {
        products: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        }
    }
}
</script>
