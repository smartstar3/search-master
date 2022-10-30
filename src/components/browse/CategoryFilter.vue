<template>
    <li :class="{'has-children': hasSubCategories, open: open}">
        <div class="al-list-item clearfix">
            <div class="clearfix">

                <checkbox
                    :label="name"
                    :checked="selected"
                    @change="setCategory"
                ></checkbox>

                <div class="checked-children-count" v-if="subCategoryCount && !open">{{subCategoryCount}}</div>
                <a class="al-list-expand" @click.prevent="toggleOpen"></a>
            </div>
        </div>
        <div class="al-list-children" ref="subCategoriesContainer">
            <ul ref="subCategoriesList">
                <li v-for="subCategory in subCategories" :key="subCategory.slug">
                    <div class="al-list-item clearfix">
                        <checkbox
                            :label="subCategory.name"
                            :checked="subCategory.selected"
                            :is-switch="true"
                            @change="setSubCategory(subCategory.slug, $event)"
                        ></checkbox>
                    </div>
                </li>
            </ul>

            <a v-if="showMoreVisible" class="show-more" @click="showMore">
                <i class="fa fa-plus"></i> Show more
            </a>
        </div>
        <div class="spec-filters">
            <template v-if="hasResolutions">
                <select ref="selectResolution" :value="resolution.slug" @change="setResolution" class="lazy">
                    <option v-for="item in resolutions" :value="item.slug" :key="item.slug">{{item.name}}</option>
                </select>
                <br>
            </template>

            <template v-if="hasVersions">
                <select ref="selectVersion" :value="version.slug" @change="setVersion" class="lazy">
                    <option v-for="item in versions" :value="item.slug" :key="item.slug">{{item.name}}</option>
                </select>
                <br>
            </template>

            <template v-if="hasBpms">
                <select-multiple
                    label="BPM"
                    :values="bpms"
                    @add="addBPM"
                    @remove="removeBPM"
                ></select-multiple>
                <select-multiple
                    label="Durations"
                    :values="durations"
                    @add="addDuration"
                    @remove="removeDuration"
                ></select-multiple>
            </template>
        </div>
    </li>
</template>
<script>
import { mapGetters } from 'vuex'
import SelectMultiple from '@/components/browse/SelectMultiple'
import Checkbox from '@/components/browse/Checkbox'

export default {
    name: 'category-filter',
    components: {
        SelectMultiple,
        Checkbox
    },
    props: {
        slug: {
            required: true,
        },
        name: {
            required: true,
        },
        subCategories: {
            required: true,
        },
        hasResolutions: {
            required: true,
        },
        resolution: {
            required: true
        },
        hasVersions: {
            required: true
        },
        version: {
            required: true
        },
        hasBpms: {
            required: true
        },
        bpms: {
            required: true
        },
        hasDurations: {
            required: true
        },
        durations: {
            required: true
        },
    },
    data() {
        return {
            open: false,
            showMoreVisible: false,
        }
    },
    mounted: function () {
        if (this.hasSelectedSubCategories) {
            this.open = true
        }

        this.$nextTick(function () {
            this.updateShowMoreVisible()

            let ref = this.$refs.selectResolution
            if (ref) {
                this.jqueryResolutionSelect = bindSelect(ref, () => {
                    let value = this.jqueryResolutionSelect.val()
                    this.setResolution(value)
                })
            }

            ref = this.$refs.selectVersion
            if (ref) {
                this.jqueryVersionSelect = bindSelect(ref, () => {
                    let value = this.jqueryVersionSelect.val()
                    this.setVersion(value)
                })
            }

        })

        let bindSelect = (ref, onChange) => {
            let $select = $(ref)
            $select.selectOrDie({
                onChange
            })
            return $select
        }
    },
    created() {
        // stored as non-reactive property
        this.jqueryResolutionSelect = false
        this.jqueryVersionsSelect = false
    },
    beforeDestroy() {
        if (this.jqueryResolutionSelect) {
            this.jqueryResolutionSelect.selectOrDie('destroy')
        }

        if (this.jqueryVersionsSelect) {
            this.jqueryVersionsSelect.selectOrDie('destroy')
        }
    },
    computed: {
        ...mapGetters([
            'categoryFilters',
            'resolutions',
            'getCategoryVersionOptions',
            'getSubCategoryCount'
        ]),
        hasSubCategories() {
            return !!Object.values(this.subCategories).length
        },
        hasSelectedSubCategories() {
            let subCategories = Object.values(this.subCategories)
                .filter(subCategory => subCategory.selected)

            return !!subCategories.length
        },
        subCategoryCount() {
            return this.getSubCategoryCount(this.slug)
        },
        selected() {
            return this.categoryFilters[this.slug].selected
        },
        versions() {
            return this.getCategoryVersionOptions(this.slug)
        },
    },
    methods: {
        toggleOpen() {
            if (!this.open) {
                this.updateShowMoreVisible()
            }

            this.open = !this.open
        },
        setCategory(value) {
            this.$store.dispatch('setCategory', {
                categorySlug: this.slug,
                value
            })
        },
        setSubCategory(subCategorySlug, value) {
            this.$store.dispatch('setSubCategory', {
                categorySlug: this.slug,
                subCategorySlug,
                value
            })
        },
        setResolution(value) {
            this.$store.dispatch('setCategoryResolution', {
                categorySlug: this.slug,
                resolutionSlug: value,
                selectCategory: true
            })
        },
        setVersion(value) {
            this.$store.dispatch('setCategoryVersion', {
                categorySlug: this.slug,
                versionSlug: value,
                selectCategory: true
            })
        },
        addBPM(value) {
            this.$store.dispatch('addCategoryBpm', {
                categorySlug: this.slug,
                value,
                selectCategory: true
            })
        },
        removeBPM(value) {
            this.$store.dispatch('removeCategoryBpm', {
                categorySlug: this.slug,
                value
            })
        },
        addDuration(value) {
            this.$store.dispatch('addCategoryDuration', {
                categorySlug: this.slug,
                value,
                selectCategory: true
            })
        },
        removeDuration(value) {
            this.$store.dispatch('removeCategoryDuration', {
                categorySlug: this.slug,
                value
            })
        },
        updateShowMoreVisible: function () {
            if (!this.hasSubCategories) {
                this.showMoreVisible = false
                return
            }
            let container = $(this.$refs.subCategoriesContainer)
            let list = $(this.$refs.subCategoriesList)

            container.css('max-height', '')

            let containerHeight = container.height()
            let height = list.height()
            if (containerHeight < 450) {
                containerHeight = 450
            }

            this.showMoreVisible = ((height - containerHeight) > 10)
        },
        showMore: function () {
            let container = $(this.$refs.subCategoriesContainer)
            let list = $(this.$refs.subCategoriesList)
            let height = list.height()

            container.animate({ 'max-height': height }, 200, 'linear', () => {
                this.$nextTick(() => {
                    this.showMoreVisible = false
                })
            })
        },
    },
}
</script>
<style lang="scss">

</style>
