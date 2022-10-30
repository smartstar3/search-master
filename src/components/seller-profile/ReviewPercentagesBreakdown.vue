<template>
  <div class="review-percentages-breakdown">
    <div v-for="starPercentage in starPercentages" class="star-percentage-line">
      <div class="star-percentage-star-number">{{ starPercentage.stars }} STAR</div>
      <div class="star-percentage-bar-container">
        <div class="star-percentage-whole-bar">
          <div class="star-percentage-filled-bar"
               :style="{ width: starPercentage.percentage + '%' }"></div>
        </div>
      </div>
      <div class="star-percentage-percentage">{{ Math.round(starPercentage.percentage) }}%</div>
    </div>
  </div>

</template>

<script>
import SellerAPI from '../../services/seller-api'

export default {
    name: 'ReviewPercentagesBreakdown',

    props: {
        seller: {
            required: true
        }
    },

    data() {
        return {
            starPercentages: [
                { 'stars': 5, 'percentage': 0 },
                { 'stars': 4, 'percentage': 0 },
                { 'stars': 3, 'percentage': 0 },
                { 'stars': 2, 'percentage': 0 },
                { 'stars': 1, 'percentage': 0 }
            ]
        }
    },

    created() {
        this.loadReviewSummary()
    },

    computed: {
        roundedAverageRating() {
            return Math.round(this.averageRating * 10) / 10
        }
    },

    methods: {
        loadReviewSummary() {
            SellerAPI.getReviewsSummary(this.seller.id)
                .then(data => {
                    for (var i = 0; i < this.starPercentages.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (this.starPercentages[i].stars === data[j].stars) {
                                this.starPercentages[i].percentage = data[j].percentage
                            }
                        }
                    }
                })
        }
    }
}
</script>
