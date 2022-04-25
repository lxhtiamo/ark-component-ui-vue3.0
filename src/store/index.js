import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import getters from './getters'
import {createStore} from 'vuex'

export default createStore({
    modules: {
        user,
        common,
        tags
    },
    getters,
})


