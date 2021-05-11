import Test2 from './test2';
import Test3Schema from './test3';
import Test5Schema from './test5';

export default {
    name: String,
    '?test': Test2,
    'test3?': Test3Schema,
    'test4?': 'string|number',
    '?test5': Test5Schema,
    'obj?': Object,
};
