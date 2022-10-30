<template>
    <div class="pagination" v-if="haveProducts">
        <ul class="pagination-items">
            <li :class="['page-item is-prev', {disabled: isFirst}]">
                <a class="page-link" @click="clickPrev">
                    previous
                </a>
            </li>
            <li :class="['page-item is-first', {'is-active': isFirst }]">
                <a class="page-link" @click="clickFirst">
                    1
                </a>
            </li>
            <li class="page-item disabled" v-if="hasClippedPrevPages">
                <a class="page-link">
                    ...
                </a>
            </li>
            <li
                v-for="pageNumber in pageNumbers"
                :key="pageNumber"
                :class="['page-item', {'is-active': pageNumber === currentPage}]"
            >
                <a class="page-link" @click="changePage(pageNumber)">
                    {{pageNumber}}
                </a>
            </li>
            <li class="page-item disabled" v-if="hasClippedNextPages">
                <a class="page-link">
                    ...
                </a>
            </li>
            <li :class="['page-item is-last', {'is-active': isLast }]" v-if="lastPage !== 1">
                <a class="page-link" @click="clickLast">
                    {{lastPage}}
                </a>
            </li>
            <li :class="['page-item is-next', {disabled: isLast}]">
                <a class="page-link" @click="clickNext">
                    next
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'pagination',
    computed: {
        ...mapGetters({
            currentPage: 'productsCurrentPage',
            lastPage: 'productsLastPage',
            productsCount: 'productsCount'
        }),
        haveProducts() {
            return !!this.productsCount
        },
        hasClippedPrevPages() {
            return this.pageNumbers.length > 0 && this.pageNumbers[0] > 2
        },
        hasClippedNextPages() {
            return this.pageNumbers.length > 0 && this.pageNumbers[this.pageNumbers.length - 1] < this.lastPage - 1
        },
        pageNumbers() {
            let { startPage, endPage } = getPages({
                currentPage: this.currentPage,
                lastPage: this.lastPage
            })

            let pageNumbers = []

            for (let i = startPage + 1; i < endPage; i++) {
                pageNumbers.push(i)
            }

            return pageNumbers
        },
        isFirst() {
            return this.currentPage === 1
        },
        isLast() {
            return this.currentPage === this.lastPage
        },
    },
    methods: {
        clickPrev() {
            if (!this.isFirst) {
                this.changePage(this.currentPage - 1)
            }
        },
        clickNext() {
            if (!this.isLast) {
                this.changePage(this.currentPage + 1)
            }
        },
        clickFirst() {
            if (!this.isFirst) {
                this.changePage(1)
            }
        },
        clickLast() {
            if (!this.isLast) {
                this.changePage(this.lastPage)
            }
        },
        changePage(page) {
            let $target = $('#search-top-filters')
            scrollTo($target);

            let $this = this;
            setTimeout(function(){
                $this.$store.dispatch('setProductsCurrentPage', page);
            },500);
        },
    },
}

function scrollTo($target) {
    $('html, body').animate({
        scrollTop: $target.offset().top
    }, 500)
}

function getPages({ currentPage, lastPage }) {
    const linkLimit = 7
    let linkCount = linkLimit
    let startPage = 1

    if (lastPage <= linkLimit) {
        linkCount = lastPage
    } else if (lastPage - currentPage + 2 < linkLimit) {
        startPage = lastPage - linkCount + 1
    } else {
        startPage = currentPage - Math.floor(linkCount / 2)
    }

    // Sanity checks
    if (startPage < 1) {
        startPage = 1
    } else if (startPage > lastPage - linkCount) {
        startPage = lastPage - linkCount + 1
    }

    let endPage = Math.min(startPage + linkCount - 1, lastPage)

    return { startPage, endPage }
}
</script>
<style lang="scss">

</style>
