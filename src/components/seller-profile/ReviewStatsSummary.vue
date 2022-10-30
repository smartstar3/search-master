<template>
  <div class="review-stats-summary">
    <div class="rating-average">{{ roundedAverageRating }} out of 5 stars</div>
    <div class="number-of-reviews">
      Based on {{ reviewCount }} reviews
    </div>
  </div>

</template>

<script>
import SellerAPI from '../../services/seller-api'

export default {
    name: 'ReviewStatsSummary',

    props: {
        seller: {
            required: true
        }
    },

    data() {
        return {
            averageRating: 0,
            reviewCount: 0,
        }
    },

    created() {
        this.loadReviewTotals()
    },

    computed: {
        roundedAverageRating() {
            return Math.round(this.averageRating * 10) / 10
        }
    },

    methods: {
        loadReviewTotals() {
            SellerAPI.getReviewTotals(this.seller.id)
                .then(data => {
                    this.averageRating = data.average
                    this.reviewCount = data.count
                })
        }
    }
}
</script>
