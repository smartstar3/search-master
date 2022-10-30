<template>
    <div v-if="userLoggedIn" class="collection-widget">
        <template v-if="collectionsContainingProduct.length">
            <button class="collection-widget__open btn btn--white added js-added"
                    @click.prevent="open"
                    aria-label="Added to collection">
                <span class="icon--tick icon" title="Added to collection" data-toggle="tooltip"></span>
            </button>
        </template>
        <template v-else>
            <button class="collection-widget__open btn btn--white"
                    @click.prevent="open"
                    aria-label="Add to collection">
                <span class="icon--add-to icon" title="Add to collection" data-toggle="tooltip"></span>
            </button>
        </template>

        <div v-if="isOpen" class="collection-widget__form active"
             id="collection-widget__form">
            <div class="collection-widget__header">
                <button class="collection-widget__close btn btn--white"
                        type="button"
                        aria-label="Close Widget"
                        @click.prevent="close">
                    <span class="icon--close icon--16"></span>
                </button>
                <legend>Add to your collection</legend>
            </div>

            <v-select
                v-model="selectedCollection"
                label="title"
                :options="[createNewOption, ...availableCollections]"
                style="margin-bottom: 30px"
            />

            <input type="text" name="new-collection" class="js-collection-new" id="collection-form-add-name"
                   placeholder="Create a new collection"
                   maxlength="70"
                   v-model="newCollectionTitle"
                   :disabled="existingCollectionSelected">

            <button class="collection-widget__submit"
                    @click.prevent="clickAddToCollection"
                    :disabled="!validCollectionSelected">
                Add to collection
            </button>

            <template v-if="collectionsContainingProduct.length">

                <h3 class="collection-widget__label">Current Collections</h3>
                <ul class="collection-widget__current">
                    <li v-for="item in collectionsContainingProduct" :key="item.id">
                        <a :href="'/account/collections/' + item.slug">{{item.title}}</a>
                        <button class="btn btn--white btn--dimmed js-collection-remove collection-widget__remove"
                                aria-label="Remove from collection"
                                @click="removeFromCollection(item.id)">
                                        <span class="icon--close" data-toggle="tooltip"
                                              title="Remove from collection"></span>
                        </button>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { arrayContains } from '../../utilities/array'
import VSelect from '../../utilities/v-select'

export default {
    name: 'product-grid-item-collections',

    props: {
        productId: null,
    },

    components: {
        VSelect
    },

    data() {
        return {
            isOpen: false,
            newCollectionTitle: '',
            selectedCollection: null
        }
    },

    computed: {
        ...mapGetters([
            'userLoggedIn',
            'getProductCollections',
            'collections',
        ]),
        createNewOption() {
            return {
                id: 'create-new',
                title: 'Create New'
            }
        },
        availableCollections() {
            let currentCollectionIds = this.collectionsContainingProduct.map(item => item.id)
            return Object.values(this.collections).filter(collection => {
                return !arrayContains(currentCollectionIds, collection.id)
            }).reverse() // do reverse to show the latest collection on the top
        },
        collectionsContainingProduct() {
            return this.getProductCollections(this.productId)
        },
        existingCollectionSelected() {
            return this.selectedCollection.id !== 'create-new'
        },
        validCollectionSelected() {
            if (this.existingCollectionSelected) {
                return true
            }
            return this.newCollectionTitle.length > 0
        }
    },

    created() {
        // Computed property is not available on data()
        // so we set it here.
        this.selectedCollection = this.createNewOption
    },

    watch: {
        selectedCollection() {
            if (this.existingCollectionSelected) {
                this.addToCollection(this.selectedCollection.id)
                this.close()
            }
        }
    },

    methods: {
        addToCollection(collectionId) {
            this.$store.dispatch('addProductToCollection', {
                productId: this.productId,
                collectionId
            })
        },
        removeFromCollection(collectionId) {
            this.$store.dispatch('removeProductFromCollection', {
                productId: this.productId,
                collectionId
            })
            this.close()
        },
        open() {
            this.isOpen = true
        },
        close() {
            this.newCollectionTitle = ''
            this.selectedCollection = this.createNewOption
            this.isOpen = false
        },
        clickAddToCollection() {
            if (this.newCollectionTitle.length < 1) {
                return
            }

            this.$store.dispatch('createNewCollectionWithProduct', {
                productId: this.productId,
                collectionTitle: this.newCollectionTitle
            })
            this.close()
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ {
        .vs__selected-options {
            min-width: 0;
        }

        .vs__selected {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .vs--single.vs--open .vs__selected {
            position: relative;
        }

        // we dont need this element in this use-case
        // but making it display:none would not close dropdown on outside click
        // Issue: https://github.com/sagalbot/vue-select/issues/294
        .vs__search {
            position: absolute;
            opacity: 0;
        }
    }
</style>
