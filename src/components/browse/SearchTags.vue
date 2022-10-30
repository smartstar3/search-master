<template>
    <div id="tags" class="facet">
        <div id="search-tags__title" class="clearfix">
            <h5>Search Tags</h5>
            <a href="" @click.prevent="clearSearchTags" v-if="searchTags.length">Clear all</a>
        </div>
        <div id="search-tags">
            <transition-group name="list" tag="ul">
                <li v-for="tag in searchTags" :key="tag" class="list-item">
                    <div class="tag">
                        <span class="tag-text">{{tag}}</span>
                        <a href="" @click.prevent="removeSearchTag(tag)"><i class="icon--close"></i></a>
                    </div>
                </li>
            </transition-group>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'search-tags',
    components: {},
    data() {
        return {}
    },
    computed: {
        ...mapGetters([
            'searchTags'
        ]),
    },
    methods: {
        removeSearchTag(tag) {
            this.$store.dispatch('removeSearchTag', tag)
        },
        clearSearchTags() {
            this.$store.dispatch('clearSearchTags')
        }
    },
}
</script>
<style lang="scss">
    // extra stuff to override existing css
    // this should be cleaned up
    #algolia-search #search-tags {

        li.list-enter-active,
        li.list-leave-active {
            .tag-text {
                transition: all 1.6s;
            }
        }

        li.list-enter,
        li.list-leave-to {
            .tag-text {

                opacity: 0;
                transform: translate(40px, 0);
            }
        }
    }
</style>
