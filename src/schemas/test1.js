import Test2 from './test2.js'
import Test3Schema from './test3.js'
import Test5Schema from './test5.js'
import Test6Schema from './test6.js'

export default {
  name: String,
  '?test': Test2,
  'test3?': Test3Schema,
  'test4?': 'string|number',
  '?test5': Test5Schema,
  '?test6': Test6Schema,
  'obj?': Object
}
