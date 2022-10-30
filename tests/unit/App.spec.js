import App from '@/components/App'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

describe('App', () => {
    it('should dispatch setUserMeta with value from APP_DATA', () => {
        const localVue = createLocalVue()

        localVue.use(Vuex)

        let userLoggedIn = false

        const store = new Vuex.Store({
            actions: {
                setUserMeta(state, params) {
                    userLoggedIn = params.userLoggedIn
                }
            }
        })

        global.APP_DATA = {
            'user_logged_in': true
        }

        shallowMount(App, {
            localVue,
            store
        })

        expect(userLoggedIn).toBe(true)
    })
})
