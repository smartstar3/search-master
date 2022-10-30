import AppBrowseLatest from '@/components/AppBrowseLatest'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

describe('AppBrowseLatest', () => {
    beforeEach(() => {
        global.APP_DATA = {
            'user_logged_in': true
        }
    })

    it('should dispatch setProductsFromApi when created', () => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        const router = new VueRouter()

        let dispatchedProducts = null

        const actions = {
            setUserMeta: jest.fn(),
            setProductsFromApi(state, params) {
                dispatchedProducts = params.products
            }
        }

        const store = new Vuex.Store({
            actions,
            getters: {
                sortedProducts: jest.fn()
            }
        })

        Object.assign(global.APP_DATA, {
            'browse_latest': {
                products: [1, 2, 3]
            }
        })

        shallowMount(AppBrowseLatest, {
            localVue,
            router,
            store
        })

        expect(dispatchedProducts).toEqual([1, 2, 3])
    })
})
