import axios from 'axios'

const instance = axios.create()

async function getReviews(sellerId, querySettings) {
    try {
        const response = await instance.get(`/api/sellers/${sellerId}/reviews`, {
            params: querySettings
        })

        return response.data
    } catch (e) {
        console.error('Failed to load review list.', e)
        throw e
    }
}

async function getReviewTotals(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/review-totals`)).data
    } catch (e) {
        console.error('Failed to load review totals.', e)
        throw e
    }
}

async function getReviewsSummary(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/reviews-summary`)).data
    } catch (e) {
        console.error('Failed to load reviews summary.', e)
        throw e
    }
}

async function getPaidDownloads(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/my-paid-downloads`)).data
    } catch (e) {
        console.error('Failed to load downloads.', e)
        throw e
    }
}

async function getMyReview(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/my-review`)).data
    } catch (e) {
        if (e.response && e.response.status === 404) {
            return undefined
        }

        console.error('Failed to load review.', e)
        throw e
    }
}

async function updateMyReview(sellerId, review) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}/my-review`, review)).data
    } catch (e) {
        console.error('Failed to update review.', e)
        throw e
    }
}

async function updateProfile(sellerId, profile) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}`, profile)).data
    } catch (e) {
        console.error('Failed to update profile.', e)
        throw e
    }
}

async function updateProfileImage(sellerId, image) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}/profile-image`, image)).data
    } catch (e) {
        console.error('Failed to update profile image.', e)
        throw e
    }
}

async function updateHeaderImage(sellerId, image) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}/header-image`, image)).data
    } catch (e) {
        console.error('Failed to update header image.', e)
        throw e
    }
}

async function follow(sellerId) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}/follow`)).data
    } catch (e) {
        console.error('Failed to follow seller.', e)
        throw e
    }
}

async function unfollow(sellerId) {
    try {
        return (await instance.put(`/api/sellers/${sellerId}/unfollow`)).data
    } catch (e) {
        console.error('Failed to unfollow seller.', e)
        throw e
    }
}

async function amIFollowing(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/am-i-following`)).data
    } catch (e) {
        console.error('Failed to check following status.', e)
        throw e
    }
}

async function getFollowerCount(sellerId) {
    try {
        return (await instance.get(`/api/sellers/${sellerId}/follower-count`)).data
    } catch (e) {
        console.error('Failed to get seller follower count.', e)
        throw e
    }
}

async function sendMessage(sellerId, message) {
    try {
        return (await instance.post(`/api/sellers/${sellerId}/message`, message)).data
    } catch (e) {
        console.error('Failed to seller a message.', e)
        throw e
    }
}

let SellerAPI = {
    getReviews,
    getReviewTotals,
    getReviewsSummary,
    getPaidDownloads,
    getMyReview,
    updateMyReview,
    updateProfile,
    updateProfileImage,
    updateHeaderImage,
    follow,
    unfollow,
    amIFollowing,
    getFollowerCount,
    sendMessage
}

export function setHeaders(headers) {
    instance.defaults.headers.common = headers
}

export function mock(mocks) {
    SellerAPI = Object.assign(SellerAPI, mocks)
}

export function mockReset() {
    SellerAPI = {
        getReviews,
        getReviewTotals,
        getReviewsSummary,
        getPaidDownloads,
        getMyReview,
        updateMyReview,
        updateProfile,
        updateProfileImage,
        updateHeaderImage,
        follow,
        unfollow,
        amIFollowing,
        getFollowerCount,
        sendMessage
    }
}

export default SellerAPI
