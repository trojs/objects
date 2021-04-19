import Test2 from './test2';
import Test3Schema from './test3';

export default {
    name: String,
    '?test': Test2,
    'test3?': Test3Schema,
    'obj?': Object
};
