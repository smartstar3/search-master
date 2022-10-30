<template>
    <div id="hits" class="products">
        <div class="ais-hits">
            <slot name="before-grid"></slot>

            <div v-for="item in products" :key="item.id" class="ais-hits--item product">
                <product-grid-item
                    :id="item.id"
                    :slug="item.slug"
                    :name="item.name"
                    :isFree="item.isFree"
                    :isMusic="item.isMusic"
                    :isKickAss="item.isKickAss"
                    :isRequested="item.isRequested"
                    :isDownloadedByUser="item.isDownloadedByUser"
                    :isNew="item.isNew"
                    :placeholder="item.placeholder"
                    :previewFiles="item.previewFiles"
                    :url="item.url"
                    :categorySlug="item.categorySlug"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ProductGridItem from './ProductGridItem'

export default {
    name: 'product-grid',
    components: { ProductGridItem },
    props: {
        products: {
            type: Array,
            required: true,
        },
    }
}
</script>
