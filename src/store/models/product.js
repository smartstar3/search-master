export function makeProduct({
                                id,
                                name,
                                slug,
                                isFree,
                                isMusic,
                                isKickAss,
                                isRequested,
                                isDownloadedByUser,
                                placeholder,
                                previewFiles,
                                url,
                                categorySlug,
                                description,
                                displayOrder,
                                isNew,
                            }) {

    previewFiles = previewFiles
        .map(({ label, mimeType, url }) => {
            return {
                label,
                mimeType,
                url
            }
        })

    return {
        id: parseInt(id, 10),
        slug,
        name,
        isFree,
        isMusic,
        isKickAss,
        isRequested,
        isDownloadedByUser,
        isNew,
        placeholder,
        previewFiles,
        url,
        categorySlug,
        description,
        displayOrder: parseInt(displayOrder, 10)
    }
}

export function makeProductFromApi({
                                       id,
                                       name,
                                       slug,
                                       free,
                                       is_music,
                                       is_kick_ass,
                                       is_downloaded_by_user,
                                       requested,
                                       placeholder,
                                       previews_files,
                                       url,
                                       category,
                                       description,
                                       is_new
                                   }, displayOrder) {

    let previewFiles = previews_files
        .map(({ label, mime_type, url }) => {
            return {
                label,
                mimeType: mime_type,
                url
            }
        })

    return makeProduct({
        id,
        slug,
        name,
        isFree: free,
        isMusic: is_music,
        isKickAss: is_kick_ass,
        isRequested: requested,
        isDownloadedByUser: is_downloaded_by_user,
        placeholder,
        previewFiles,
        url,
        categorySlug: category.slug,
        description,
        displayOrder,
        isNew: is_new,
    })
}

