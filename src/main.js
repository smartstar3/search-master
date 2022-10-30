import Vue from 'vue'
import './design/main.scss'
import { getInjectedJson } from '@/services/get-injected-json'
import { enableCache, purgeOldCacheKeys } from '@/services/local-storage'

import initBrowse from '@/init-browse'
import initLatest from '@/init-latest'
import initRelated from '@/init-related'
import initSeller from '@/init-seller'
import { arrayFirstSuccessOnly } from '@/utilities/array'

Vue.config.productionTip = false

arrayFirstSuccessOnly([
    initBrowse,
    initRelated,
    initLatest,
    initSeller
])

purgeOldCacheKeys()

let cacheEnabled = getInjectedJson('browse_cache_enabled')

if (cacheEnabled === false) {
    enableCache(false)
}

window.MA_browseCacheEnabled = enableCache
