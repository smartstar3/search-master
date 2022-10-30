<template>
    <div id="search-top-filters" class="search-top-filters">
        <div class="gr">
            <div id="search-input">
                <div class="ais-search-box">
                    <i class="icon--search" @click="addSearchTag"></i>
                    <input autocapitalize="off" autocomplete="off" autocorrect="off" name="search-products"
                           placeholder="Search for products" role="textbox" spellcheck="false" type="search" value=""
                           class="ais-search-box--input"
                           ref="searchInput"
                           v-model="searchInput"
                           @keyup.enter="addSearchTag"
                    >
                </div>
            </div>
            <div id="top-filters" style="">
                <div id="sort-by" class="top-filter">
                    <span class="top-filter__label"><i class="icon--sort"></i> Sort by:</span>

                    <search-header-drop-down
                        ref="sortByDropDown"
                        :options="sortByOptions"
                        :selected-value="sortBy"
                        @select="setSortBy"
                        @opened="sortByOpened"
                    />

                    <i class="fa fa-sort"></i>
                </div>
                <div id="added" class="top-filter">
                    <span class="top-filter__label"><i class="icon--calendar2"></i> Added:</span>

                    <search-header-drop-down
                        ref="dateAddedDropDown"
                        :options="dateAddedOptions"
                        :selected-value="dateAdded"
                        @select="setDateAdded"
                        @opened="dateAddedOpened"
                    />

                    <i class="fa fa-sort"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchHeaderDropDown from '@/components/browse/SearchHeaderDropDown'

export default {
    name: 'search-header',
    components: { SearchHeaderDropDown },
    data() {
        return {
            searchInput: ''
        }
    },
    computed: {
        ...mapGetters([
            'dateAddedOptions',
            'dateAdded',
            'sortByOptions',
            'sortBy',
        ]),
    },
    methods: {
        setSortBy(value) {
            this.$store.dispatch('setSortBy', value)
        },
        sortByOpened(){
            this.$refs.dateAddedDropDown.close();
        },
        setDateAdded(value) {
            this.$store.dispatch('setDateAdded', value)
        },
        dateAddedOpened(){
            this.$refs.sortByDropDown.close();
        },
        addSearchTag() {
            if (!this.searchInput) {
                return
            }
            let searchTag = this.searchInput
            this.searchInput = ''
            this.$store.dispatch('addSearchTag', searchTag)
        }
    },
}
</script>
<style lang="scss">

</style>
