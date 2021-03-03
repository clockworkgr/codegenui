import 'regenerator-runtime/runtime'
import { createLocalVue } from '@vue/test-utils'
import store from '../../src/store'
const localVue = createLocalVue()
localVue.use(store)
console.log(localVue)
