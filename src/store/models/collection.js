export function makeCollection({
                                   id,
                                   slug,
                                   title,
                                   productIds = [],
                               }) {
    return {
        id: parseInt(id, 10),
        slug,
        title,
        productIds: productIds.map(id => parseInt(id, 10))
    }
}

export function makeCollectionFromApi({
                                          id,
                                          product_ids,
                                          slug,
                                          title,
                                      }) {
    return makeCollection({
        id,
        slug,
        title,
        productIds: product_ids
    })
}
