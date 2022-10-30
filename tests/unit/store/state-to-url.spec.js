jest.mock('@/services/get-injected-json')

import stateToUrl from '@/store/state-to-url'

const case1Obj = {
    productsCurrentPage: 3,
    dateAdded: 'last-year',
    sortBy: 'most-popular',
    categoryFilters: {
        'premiere-pro-presets': {
            'name': 'Premiere Pro Presets',
            'slug': 'premiere-pro-presets',
            'selected': true,
            'version': {
                'slug': 'premiere-cc-2017',
                'name': 'Premiere CC 2017'
            },
            'resolution': {
                'slug': '1920x1080-hd',
                'name': '1920x1080 (HD)'
            },
            'subCategories': {
                'overlays': {
                    'name': 'Overlays',
                    'slug': 'overlays',
                    'selected': true,
                },
                'text': {
                    'name': 'Text',
                    'slug': 'text',
                    'selected': true,

                }
            },
        },
    }
}

const case1Url = '?date_added=last-year' +
    '&sort_by=most-popular' +
    '&categories=' +
    'premiere-pro-presets:overlays|text' +
    '&specs=' +
    'premiere-pro-presets.version:premiere-cc-2017,' +
    'premiere-pro-presets.resolution:1920x1080-hd' +
    '&page=3'

const case2Obj = {
    dateAdded: 'last-year',
    sortBy: 'most-popular',
    categoryFilters: {
        'premiere-pro-presets': {
            'name': 'Premiere Pro Presets',
            'slug': 'premiere-pro-presets',
            'selected': true,
            'version': {
                'slug': 'premiere-cc-2017',
                'name': 'Premiere CC 2017'
            },
            'resolution': {
                'slug': '1920x1080-hd',
                'name': '1920x1080 (HD)'
            },
            'subCategories': {
                'overlays': {
                    'name': 'Overlays',
                    'slug': 'overlays',
                    'selected': true,
                },
                'text': {
                    'name': 'Text',
                    'slug': 'text',
                    'selected': true,
                }
            },
        },
        'stock-music': {
            'name': 'Royalty Free Music',
            'slug': 'stock-music',
            'selected': true,
            'subCategories': {
                'rock': {
                    'name': 'Rock',
                    'slug': 'rock',
                    'selected': true,
                }
            },
            'bpms': [1, 2, 3],
            'durations': [4, 5, 6]
        }
    }
}

const case2Url = '?date_added=last-year' +
    '&sort_by=most-popular' +
    '&categories=' +
    'premiere-pro-presets:overlays|text,' +
    'stock-music:rock' +
    '&specs=' +
    'premiere-pro-presets.version:premiere-cc-2017,' +
    'premiere-pro-presets.resolution:1920x1080-hd'

describe('stateToUrl', () => {

    it('serializes single category', () => {

        let actual = stateToUrl(case1Obj)
        let expected = case1Url

        expect(actual).toMatch(expected)
    })
    //
    it('serializes multiple categories', () => {

        let actual = stateToUrl(case2Obj)
        let expected = case2Url

        expect(actual).toMatch(expected)
    })
})
