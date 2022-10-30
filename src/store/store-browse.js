import store from '@/store/store'
import stateToUrl from '@/store/state-to-url'
import router from '@/router/browse/router'

// should only be triggered directly from methods in this store
store.actions.filterChange = ({ state, commit, dispatch }, newCurrentPage = 1) => {
    // when filter state changes always reset current page to 1
    // unless given a newCurrentPage arg indicating that the only change is the current page number
    if (state.productsCurrentPage !== newCurrentPage) {
        commit('setProductsCurrentPage', newCurrentPage)
    }

    let url = stateToUrl(state)
    // triggers setStateFromUrl
    router.push({
        path: '/browse' + url
    })

    return Promise.resolve()
}

export default store
