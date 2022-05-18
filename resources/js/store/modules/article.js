export const namespaced = true

export const state = {
    article: {
        comments: [],
        tags: [],
        statistic: {
            likes: 0,
            views: 0
        }
    },
    likeIt: true,
    commentSuccess: false,
    errors: [],
}

export const actions = {
    getArticleData(context, payload) {
        axios.get('/api/article-json', {params: {slug: payload}}).then((response) => {
            context.commit('SET_ARTICLE', response.data.data);
        }).catch(() => {
            console.log('Error');
        });
    },
    viewsIncrement(context, payload) {
        setTimeout(() => {
            axios.put('/api/article-views-increment', {slug: payload}).then((response) => {
                context.commit('SET_ARTICLE', response.data.data);
            }).catch(() => {
                console.log('Error addView');
            });
        }, 5000)
    },
    addLike(context, payload) {
        setTimeout(() => {
            axios.put('/api/article-likes-increment', {
                slug: payload.slug,
                increment: payload.increment
            }).then((response) => {
                context.commit('SET_ARTICLE', response.data.data);
                context.commit('SET_LIKE', !context.state.likeIt);
            }).catch(() => {
                console.log('Error addLike');
            });
        })
    },
    addComment(context, payload) {
        axios.post('/api/article-add-comment', {
            subject: payload.subject,
            body: payload.body,
            article_id: payload.article_id
        }).then((response) => {
            context.commit('SET_COMMENT_SUCCESS', !context.state.commentSuccess);
            context.dispatch('getArticleData', context.rootState.slug);
        }).catch((error) => {
            if (error.response.status === 422) {
                context.state.errors = error.response.data.errors;
            }
        });
    },
}

export const getters = {
    articleViews(state) {
        return state.article.statistic.views;
    },
    articleLikes(state) {
        return state.article.statistic.likes;
    },
}

export const mutations = {
    SET_ARTICLE(state, payload) {
        return state.article = payload;
    },
    SET_LIKE(state, payload) {
        return state.likeIt = payload;
    },
    SET_COMMENT_SUCCESS(state, payload) {
        return state.commentSuccess = payload;
    },
}
