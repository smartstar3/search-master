<template>
    <div>
        <search-header/>
        <section id="algolia-search__results" class="section">
            <div class="gr">
                <sidebar/>
                <div id="right-column" class="three_products_grid">

                    <div class="gr al-loading" v-if="loading">
                        <div class="loading-icon">
                            <img src="/assets/images/site/loader.gif" style="width: auto; margin: auto">
                        </div>
                    </div>

                    <product-grid :products="sortedProducts">
                        <template v-slot:before-grid>
                            <div v-if="!productsCount && !loading" id="no-results-message" class="section no-search-results">
                                <p v-if="sortByRecentlyViewed">You have not viewed any products recently.</p>
                                <p v-else-if="sortByPeopleIFollow">You're not following anyone.</p>
                                <p v-else>Sorry, we didn’t find any results. You can try submitting a
                                    <a href="https://staging.motionarray.com/requests" target="_blank">Request</a>.
                                </p>
                            </div>
                        </template>

                    </product-grid>

                    <pagination/>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

import ProductGrid from '@/components/browse/ProductGrid'
import SearchHeader from '@/components/browse/SearchHeader'
import Sidebar from '@/components/browse/Sidebar'
import Pagination from '@/components/browse/Pagination'
import { mapGetters } from 'vuex'
import { SORT_BY_PEOPLE_I_FOLLOW, SORT_BY_RECENTLY_VIEWED } from '@/store/filter-meta'

export default {
    name: 'browse',
    components: {
        Pagination,
        Sidebar,
        SearchHeader,
        ProductGrid,
    },
    computed: {
        ...mapGetters([
            'loading',
            'sortedProducts',
            'productsCount',
            'sortBy',
        ]),
        sortByRecentlyViewed() {
            return this.sortBy == SORT_BY_RECENTLY_VIEWED
        },
        sortByPeopleIFollow() {
            return this.sortBy == SORT_BY_PEOPLE_I_FOLLOW
        }
    },
    watch: {
        '$route'(to, from) {

        }
    }
}
</script>
