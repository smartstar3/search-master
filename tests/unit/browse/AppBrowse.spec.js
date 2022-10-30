import AppBrowse from '@/components/AppBrowse'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

describe('AppBrowse', () => {
    beforeEach(() => {
        global.APP_DATA = {
            'user_logged_in': true
        }
    })

    it('should dispatch setStateFromRoute when $route changed', () => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        const router = new VueRouter()

        let dispatchedRoute = null

        const actions = {
            setUserMeta: jest.fn(),
            setStateFromRoute(state, route) {
                dispatchedRoute = route
            }
        }

        const mutations = {
            setSiteTotalProductsCount: jest.fn()
        }

        const store = new Vuex.Store({
            actions,
            mutations
        })

        Object.assign(global.APP_DATA, {
            'site_total_products_count': 10
        })

        shallowMount(AppBrowse, {
            localVue,
            router,
            store
        })

        router.push('/browse?categories=premiere,final-cut')

        expect(dispatchedRoute).toBe(router.currentRoute)
    })

    it('should dispatch setProductsFromApi if `browse_custom_gallery` is available when router is ready', done => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        let products = null
        let currentPage = null
        let lastPage = null
        let totalResults = null

        const actions = {
            setUserMeta: jest.fn(),
            setProductsFromApi(state, params) {
                products = params.products
                currentPage = params.currentPage
                lastPage = params.lastPage
                totalResults = params.totalResults
            }
        }

        const store = new Vuex.Store({
            actions
        })

        Object.assign(global.APP_DATA, {
            'browse_custom_gallery': {
                products: []
            },
            meta: {
                'last_page': 1,
                total: 1
            }
        })

        const router = new VueRouter()

        shallowMount(AppBrowse, {
            localVue,
            router,
            store
        })

        router.onReady(() => {
            expect(products).toEqual([])
            expect(currentPage).toBe(1)
            expect(lastPage).toBe(1)
            expect(totalResults).toBe(1)
            done()
        })
    })

    it('should commit setSiteTotalProductsCount if `browse_custom_gallery` is not available when router is ready', done => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        let totalProductsCount = null

        const actions = {
            setUserMeta: jest.fn(),
            setStateFromRoute: jest.fn()
        }

        const mutations = {
            setSiteTotalProductsCount(state, count) {
                totalProductsCount = count
            }
        }

        const store = new Vuex.Store({
            actions,
            mutations
        })

        Object.assign(global.APP_DATA, {
            'site_total_products_count': 10
        })

        const router = new VueRouter()

        shallowMount(AppBrowse, {
            localVue,
            router,
            store
        })

        router.onReady(() => {
            expect(totalProductsCount).toBe(10)
            done()
        })
    })

    it('should dispatch setStateFromRoute when `browse_custom_gallery` is not available when router is ready', done => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        let dispatchedRoute = null

        const actions = {
            setUserMeta: jest.fn(),
            setStateFromRoute(state, route) {
                dispatchedRoute = route
            }
        }

        const mutations = {
            setSiteTotalProductsCount: jest.fn()
        }

        const store = new Vuex.Store({
            actions,
            mutations
        })

        Object.assign(global.APP_DATA, {
            'site_total_products_count': 10
        })

        const router = new VueRouter()

        shallowMount(AppBrowse, {
            localVue,
            router,
            store
        })

        router.onReady(route => {
            expect(dispatchedRoute).toBe(route)
            done()
        })
    })
})
