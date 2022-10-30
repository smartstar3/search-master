import AppSellerProfile from '@/components/AppSellerProfile'
import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'

describe('AppSellerProfile', () => {
    beforeEach(() => {
        global.APP_DATA = {
            browse_seller_products: []
        }
    })

    it('should dispatch `setUserMeta` from `auth_user`', () => {
        global.APP_DATA.auth_user = {
            id: 1
        }

        const localVue = createLocalVue()

        localVue.use(Vuex)

        let distpatchedPayload = null

        const actions = {
            setUserMeta(state, payload) {
                distpatchedPayload = payload
            },
            setProductsFromApi: jest.fn()
        }

        const store = new Vuex.Store({
            actions
        })

        shallowMount(AppSellerProfile, {
            localVue,
            store
        })

        expect(distpatchedPayload).toEqual({
            userLoggedIn: true
        })
    })

    it('should distpatch `setProductsFromApi` from `browse_seller_products`', () => {
        global.APP_DATA.browse_seller_products = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ]

        const localVue = createLocalVue()

        localVue.use(Vuex)

        let distpatchedPayload = null

        const actions = {
            setProductsFromApi(state, payload) {
                distpatchedPayload = payload
            },
            setUserMeta: jest.fn()
        }

        const store = new Vuex.Store({
            actions
        })

        shallowMount(AppSellerProfile, {
            localVue,
            store
        })

        expect(distpatchedPayload.products).toHaveLength(3)
    })
})
