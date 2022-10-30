import AppBrowseRelated from '@/components/AppBrowseRelated'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

describe('AppBrowseRelated', () => {
    beforeEach(() => {
        global.APP_DATA = {
            'user_logged_in': true,
            'browse_related': {
                'product_id': 123,
                'category_slug': 'adobe-premiere-slug',
                'optional_words': ['test'],
                'search_tags': ['video']
            }
        }
    })

    it('should commit data from `browse_related` when created', () => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        const router = new VueRouter()

        const actions = {
            setUserMeta: jest.fn(),
            fetch: jest.fn()
        }

        const mutations = {
            setProductsPerPage: jest.fn(),

            addCategorySlug(state, payload) {
                state.categorySlug = payload
            },

            setOptionalWords(state, payload) {
                state.optionalsWords = payload
            },

            setExcludeProductIds(state, payload) {
                state.excluded = payload
            },

            setSearchTags(state, payload) {
                state.tags = payload
            }
        }

        const store = new Vuex.Store({
            actions,
            mutations,
            getters: {
                loading: () => false,
                sortedProducts: () => []
            }
        })

        shallowMount(AppBrowseRelated, {
            localVue,
            router,
            store
        })

        expect(store.state.categorySlug).toBe('adobe-premiere-slug')
        expect(store.state.optionalsWords).toEqual(['test'])
        expect(store.state.excluded).toEqual([123])
        expect(store.state.tags).toEqual(['video'])
    })

    it('should commit setProductsPerPage with value of 8', () => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        const router = new VueRouter()

        const actions = {
            setUserMeta: jest.fn(),
            fetch: jest.fn()
        }

        const mutations = {
            setProductsPerPage(state, payload) {
                state.productsPerPage = payload
            },
            addCategorySlug: jest.fn(),
            setOptionalWords: jest.fn(),
            setExcludeProductIds: jest.fn(),
            setSearchTags: jest.fn()
        }

        const store = new Vuex.Store({
            actions,
            mutations,
            getters: {
                loading: () => false,
                sortedProducts: () => []
            }
        })

        shallowMount(AppBrowseRelated, {
            localVue,
            router,
            store
        })

        expect(store.state.productsPerPage).toBe(8)
    })

    it('should dispatch fetch when created', () => {
        const localVue = createLocalVue()

        localVue.use(VueRouter)
        localVue.use(Vuex)

        const router = new VueRouter()

        const actions = {
            setUserMeta: jest.fn(),
            fetch: jest.fn()
        }

        const mutations = {
            setProductsPerPage: jest.fn(),
            addCategorySlug: jest.fn(),
            setOptionalWords: jest.fn(),
            setExcludeProductIds: jest.fn(),
            setSearchTags: jest.fn()
        }

        const store = new Vuex.Store({
            actions,
            mutations,
            getters: {
                loading: () => false,
                sortedProducts: () => []
            }
        })

        shallowMount(AppBrowseRelated, {
            localVue,
            router,
            store
        })

        expect(actions.fetch).toHaveBeenCalledTimes(1)
    })
})
