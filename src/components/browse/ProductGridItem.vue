<template>
    <div :class="itemClasses">
        <div class="product-details__preview-placeholder">
            <template v-if="isMusic">
                <div class="product__audio player audio-player js-ready" data-theme="minimal"
                     style="background:#8cdbac">
                    <audio class="audio-player__media player__media js-hidden" preload="none" autobuffer="none">
                        <template v-for="previewFile in previewFiles">
                            <source :src="previewFile.url" :type="previewFile.mimeType"/>
                        </template>
                    </audio>
                    <img class="audio-player__placeholder" :src="placeholder" :alt="name"/>
                </div>
            </template>
            <template v-else>
                <div class="product__video player video-player js-ready" data-theme="minimal">
                    <video class="video-player__media player__media" width="100%" height="auto" preload="none"
                           autobuffer="none">
                        <template v-for="previewFile in previewFiles">
                            <source :src="previewFile.url" :type="previewFile.mimeType"/>
                        </template>
                    </video>
                    <img class="video-player__poster player__poster" :src="placeholder" :alt="name"/>
                </div>
            </template>
        </div>

        <header class="product__header">
            <h2 class="product__title">
                <a :href="url">
                    {{name}}
                </a>
            </h2>

            <!--googleoff: index-->
            <h3 class="product__category">
                {{category.shortName}}
                <i v-if="isKickAss" class="kick_ass_icon fa fa-star" data-toggle="tooltip" title="Kick-Ass Product"></i>
                <i v-if="isRequested" class="icon--megaphone-fill" data-toggle="tooltip" title="Requested Product"></i>
            </h3>
            <!--googleon: index-->

            <div class="product__options">
                <div v-if="isDownloadedByUser" class="product__badge product__badge--downloaded"><span
                    class="icon  icon--check"></span>
                </div>
                <div v-if="isNew" class="product__badge">New</div>
                <div v-if="isFree" class="product__badge product__badge__free">Free</div>

                <a :href="url" class="product__download product__option">
                    <span class="icon icon--download" title="Download" data-toggle="tooltip"></span>
                </a>
                <product-grid-item-collections
                    :product-id="id"
                />
            </div>
        </header>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductGridItemCollections from './ProductGridItemCollections'

export default {
    name: 'product-grid-item',
    components: { ProductGridItemCollections },
    props: {
        id: null,
        slug: null,
        name: null,
        url: null,
        categorySlug: null,
        placeholder: null,
        previewFiles: null,
        isMusic: null,
        isKickAss: null,
        isNew: null,
        isFree: null,
        isRequested: null,
        isDownloadedByUser: null,
    },
    computed: {
        ...mapGetters([
            'userLoggedIn',
            'getProductCollections',
            'collections',
            'categoryFilters'
        ]),
        itemClasses() {
            return [
                'product--cat-' + this.category.id,
                {
                    'product--new': this.isNew,
                    'product--free': this.isFree,
                    'product--collection': this.userLoggedIn
                }
            ]
        },
        category() {
            let category = this.categoryFilters[this.categorySlug]
            return category || {}
        }
    }
}
</script>
