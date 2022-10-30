<script>
import ProductGrid from './browse/ProductGrid'
import ProfileHeader from './seller-profile/ProfileHeader'
import { getInjectedJson, getInjectedJsonOrFail } from '../services/get-injected-json'
import { mapGetters } from 'vuex'

export default {
    name: 'AppSellerProfile',

    components: {
        ProductGrid,
        ProfileHeader
    },

    data() {
        return {
            seller: getInjectedJson('seller'),
            authUser: getInjectedJson('auth_user')
        }
    },

    created() {
        this.$store.dispatch('setUserMeta', {
            userLoggedIn: this.authUser !== null
        })

        this.$store.dispatch('setProductsFromApi', {
            products: getInjectedJsonOrFail('browse_seller_products')
        })
    },

    computed: {
        ...mapGetters([
            'sortedProducts'
        ])
    }
}
</script>
