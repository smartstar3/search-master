jest.mock('@/services/get-injected-json')

import urlToState from '@/store/url-to-state'

import {
    CATEGORY_VERSION_BY_SLUG,
    freshCategoryFilters,
    RESOLUTION_BY_SLUG,
    setLegacyCategorySlugs,
    setLegacySubCategorySlugs
} from '../../../src/store/category-repo'
import { ADDED_LAST_YEAR, SORT_BY_MOST_POPULAR } from '../../../src/store/filter-meta'

const case1Obj = {
    dateAdded: 'foo',
    sortBy: 'bar',
    categoryFilters: {
        '11': {
            id: 11,
            slug: 'test-cat-11',
            subCategories: {},
            hasVersions: true,
            version: {
                id: 22,
                slug: 'version-22'
            },
            hasResolutions: true,
            resolution: {
                id: 33,
                slug: 'resolution-33'
            },
            hasBpms: true,
            bpms: ['4', '5', '6'],
            hasDurations: true,
            durations: ['7', '8', '9']
        }
    }
}

const case1Url = '?date_added=foo' +
    '&sort_by=bar' +
    '&categories=' +
    'test-cat-11' +
    '&specs=' +
    'test-cat-11.version:version-22,' +
    'test-cat-11.resolution:resolution-33,' +
    'test-cat-11.bpms:4|5|6,' +
    'test-cat-11.durations:7|8|9'

const case2Obj = {
    dateAdded: 'foo',
    sortBy: 'bar',
    categoryFilters: {
        '11': {
            id: 11,
            slug: 'test-cat-11',
            subCategories: {},
            hasVersions: true,
            version: {
                id: 22,
                slug: 'version-22'
            },
            hasResolutions: true,
            resolution: {
                id: 33,
                slug: 'resolution-33'
            },
            hasBpms: true,
            bpms: ['4', '5', '6'],
            hasDurations: true,
            durations: ['7', '8', '9']
        },
        '22': {
            id: 22,
            slug: 'test-cat-22',
            subCategories: {},
            hasVersions: true,
            version: {
                id: 333,
                slug: 'version-333'
            },
            hasResolutions: true,
            resolution: {
                id: 444,
                slug: 'resolution-444'
            },
            hasBpms: true,
            bpms: ['1', '2', '3'],
            hasDurations: true,
            durations: ['9', '4', '1']
        }
    }
}

const case2Url = '?date_added=foo' +
    '&sort_by=bar' +
    '&categories=' +
    'test-cat-11,' +
    'test-cat-22' +
    '&specs=' +
    'test-cat-11.version:version-22,' +
    'test-cat-11.resolution:resolution-33,' +
    'test-cat-11.bpms:4|5|6,' +
    'test-cat-11.durations:7|8|9,' +
    'test-cat-22.version:version-333,' +
    'test-cat-22.resolution:resolution-444,' +
    'test-cat-22.bpms:1|2|3,' +
    'test-cat-22.durations:9|4|1'

describe('urlToState', () => {

    it('de-serializes stock-motion-graphics category', () => {

        const catSlug = 'after-effects-templates'
        const resolution = '4096x2304-4k'
        const version = 'after-effects-cs4'

        const case1Url = '?date_added=' + ADDED_LAST_YEAR +
            '&sort_by=' + SORT_BY_MOST_POPULAR +
            '&categories=' +
            catSlug + ':' +
            'logos|transitions' +
            '&specs=' +
            catSlug + '.resolution:' + resolution + ',' +
            catSlug + '.version:' + version +
            '&page=3'

        let actual = urlToState(case1Url)

        expect(actual.dateAdded).toMatch(ADDED_LAST_YEAR)
        expect(actual.sortBy).toMatch(SORT_BY_MOST_POPULAR)
        expect(actual.productsCurrentPage).toEqual(3)

        let expected = freshCategoryFilters()

        expected[catSlug].selected = true
        expected[catSlug].subCategories['logos'].selected = true
        expected[catSlug].subCategories['transitions'].selected = true
        expected[catSlug].resolution = RESOLUTION_BY_SLUG[resolution]
        expected[catSlug].version = CATEGORY_VERSION_BY_SLUG[catSlug][version]
    })

    it('de-serializes multiple categories', () => {

        const catSlug1 = 'after-effects-templates'
        const resolution1 = '4096x2304-4k'
        const version1 = 'after-effects-cs4'

        const catSlug2 = 'stock-music'

        const case1Url = '?date_added=' + ADDED_LAST_YEAR +
            '&sort_by=' + SORT_BY_MOST_POPULAR +
            '&categories=' +
            catSlug1 + ':' +
            'logos|transitions' +
            ',' +
            catSlug2 + ':' +
            'heavy|fun|invalid' +

            '&specs=' +
            catSlug1 + '.resolution:' + resolution1 + ',' +
            catSlug1 + '.version:' + version1 + ',' +
            catSlug2 + '.bpms:3|4|5' + ',' +
            catSlug2 + '.durations:6|7|8'

        let actual = urlToState(case1Url)

        expect(actual.dateAdded).toMatch(ADDED_LAST_YEAR)
        expect(actual.sortBy).toMatch(SORT_BY_MOST_POPULAR)

        let expected = freshCategoryFilters()

        expected[catSlug1].selected = true
        expected[catSlug1].subCategories['logos'].selected = true
        expected[catSlug1].subCategories['transitions'].selected = true
        expected[catSlug1].resolution = RESOLUTION_BY_SLUG[resolution1]
        expected[catSlug1].version = CATEGORY_VERSION_BY_SLUG[catSlug1][version1]

        expected[catSlug2].selected = true
        expected[catSlug2].subCategories['heavy'].selected = true
        expected[catSlug2].subCategories['fun'].selected = true
        expected[catSlug2].bpms = ['3', '4', '5']
        expected[catSlug2].durations = ['6', '7', '8']
        expect(actual.productsCurrentPage).toEqual(1)
        expect(actual.categoryFilters).toMatchObject(expected)
    })

    it('normalizes legacy slugs', () => {
        setLegacyCategorySlugs({
            'old-test-stock-music': 'stock-music'
        });

        setLegacySubCategorySlugs({
            'stock-music': {
                'old-test-easy-listening': 'easy-listening'
            }
        });

        const catSlug = 'old-test-stock-music'
        const case1Url = '?date_added=' + ADDED_LAST_YEAR +
            '&sort_by=' + SORT_BY_MOST_POPULAR +
            '&categories=' +
            catSlug + ':' +
            'old-test-easy-listening'

        let actual = urlToState(case1Url)
        expect(actual.categoryFilters['stock-music'].selected).toEqual(true)
        expect(actual.categoryFilters['stock-music'].subCategories['easy-listening'].selected).toEqual(true)
    })
})
