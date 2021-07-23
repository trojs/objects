import { Validator } from '@hckrnews/validator';

/**
 * Object helper
 *
 * @param {object} schema
 *
 * @return {class}
 */
const ObjectGenerator = ({ schema } = {}) =>
    class Obj {
        /**
         * Set the original and prefix.
         *
         * @param {object} original
         * @param {string} prefix
         */
        constructor(original, prefix) {
            this.original = original;
            this.prefix = prefix;
            this.flatObject = {};
            if (schema) {
                this.validate();
            }
            this.parse();
        }

        get subSchema() {
            if (!this.prefix) {
                return schema;
            }

            const prefixParts = this.prefix.split('.');
            let part = 0;

            let subSchema = schema;
            while (part < prefixParts.length) {
                const currentPart = prefixParts[part];

                if (subSchema[currentPart]) {
                    subSchema = subSchema[currentPart];

                    part += 1;
                } else if (subSchema[`${currentPart}?`]) {
                    subSchema = subSchema[`${currentPart}?`];

                    part += 1;
                } else if (subSchema[`?${currentPart}`]) {
                    subSchema = subSchema[`?${currentPart}`];

                    part += 1;
                } else {
                    subSchema = null;
                    break;
                }
            }

            return subSchema;
        }

        get validator() {
            return this.subSchema && this.subSchema.constructor === Object
                ? new Validator(this.subSchema)
                : null;
        }

        get originalData() {
            return this.original?.constructor === Array
                ? this.original
                : [this.original];
        }

        validate() {
            const { validator } = this;

            if (!validator) {
                return;
            }

            this.originalData.forEach((data) => {
                if (!validator.validate(data)) {
                    const [field, type] = validator.errors[0];
                    if (type?.constructor === String) {
                        throw new Error(
                            `The field ${field} should be a ${type}`
                        );
                    } else if (type?.constructor === Object) {
                        const subTypes = Object.entries(type);
                        const [subField, subType] = subTypes[0];
                        const subTypeName =
                            subType?.constructor === String
                                ? subType
                                : subType.name;
                        throw new Error(
                            `The field ${field}.${subField} should be a ${subTypeName}`
                        );
                    } else {
                        throw new Error(
                            `The field ${field} should be a ${type.name}`
                        );
                    }
                }
            });
        }

        /**
         * flatten the object 1 level per time.
         */
        parse() {
            Object.entries(this.original).forEach(
                ([originalRowIndex, originalRow]) => {
                    let index = originalRowIndex;

                    if (this.prefix) {
                        index = [this.prefix, originalRowIndex].join('.');
                    }

                    if (
                        originalRow?.constructor === Object ||
                        originalRow?.constructor === Array
                    ) {
                        const childRows = new Obj(originalRow, index).flat;

                        this.flatObject = Object.assign(
                            this.flatObject,
                            childRows
                        );

                        return;
                    }

                    this.flatObject[index] = originalRow;
                }
            );
        }

        /**
         * Get the flat object.
         *
         * @return {object}
         */
        get flat() {
            return this.flatObject;
        }

        /**
         * Get the object entries.
         *
         * @return {array}
         */
        entries() {
            return Object.entries(this.flatObject);
        }

        /**
         * Get the object keys.
         *
         * @return {array}
         */
        keys() {
            return Object.keys(this.flatObject);
        }

        /**
         * Get the object values.
         *
         * @return {array}
         */
        values() {
            return Object.values(this.flatObject);
        }

        /**
         * Get the object length.
         *
         * @return {number}
         */
        get length() {
            return Object.keys(this.flatObject).length;
        }

        /**
         * Get an item by key.
         *
         * @param {string} key
         * @param {object|null} defaultValue
         *
         * @return {object|null}
         */
        getByKey(key, defaultValue) {
            if (this.originalHas(key)) {
                return Object.getOwnPropertyDescriptor(this.original, key)
                    .value;
            }

            if (this.has(key)) {
                return this.flatObject[key];
            }

            if (this.includes(key)) {
                return this.entries()
                    .filter(([currentKey]) => currentKey.startsWith(key))
                    .reduce((accumulator, [currentKey, currentValue]) => {
                        const subKey = currentKey.substring(key.length + 1);
                        accumulator[subKey] = currentValue;
                        return accumulator;
                    }, {});
            }

            return defaultValue;
        }

        /**
         * Get keys of an item.
         *
         * @param {array} keys
         * @param {object|null} defaultValue
         *
         * @return {object|null}
         */
        getFlatKeys(keys, defaultValue) {
            const result = this.entries().filter(([currentKey]) =>
                keys.some((key) => currentKey.startsWith(key))
            );

            if (result.length < 1) {
                return defaultValue;
            }

            return Object.fromEntries(result);
        }

        /**
         * Get keys of an item.
         *
         * @param {array} keys
         * @param {object|null} defaultValue
         *
         * @return {object|null}
         */
        getKeys(keys, defaultValue) {
            const result = keys.reduce((accumulator, currentKey) => {
                const key = currentKey.toString();
                const value = this.getByKey(key);

                if (value) {
                    accumulator[key] = value;
                }

                return accumulator;
            }, {});

            if (Object.keys(result).length < 1) {
                return defaultValue;
            }

            return result;
        }

        /**
         * Check if the original object has a key.
         *
         * @param {string} key
         *
         * @return {boolean}
         */
        originalHas(key) {
            return key in this.original;
        }

        /**
         * Check if the object has a key.
         *
         * @param {string} key
         *
         * @return {boolean}
         */
        has(key) {
            return key in this.flatObject;
        }

        /**
         * Check if the object has a key that includes.
         *
         * @param {string} key
         *
         * @return {boolean}
         */
        includes(key) {
            return (
                this.keys().filter((item) => item.startsWith(key)).length > 0
            );
        }

        /**
         * The map() method creates a new object populated with the results of
         * calling a provided function on every element in the original object.
         *
         * @param {Function} callbackFunction
         *
         * @return {object}
         */
        map(callbackFunction) {
            return Object.fromEntries(
                Object.entries(this.original).map(([key, value]) => [
                    key,
                    callbackFunction(value),
                ])
            );
        }

        /**
         * The filter() method creates a new object with all elements
         * that pass the test implemented by the provided function.
         *
         * @param {Function} callbackFunction
         *
         * @return {object}
         */
        filter(callbackFunction) {
            return Object.fromEntries(
                Object.entries(this.original).filter(([key, value]) => [
                    key,
                    callbackFunction(value),
                ])
            );
        }

        /**
         * The flatMap() method creates a new object populated with the results
         * of calling a provided function on every element in the flat object.
         *
         * @param {Function} callbackFunction
         *
         * @return {object}
         */
        flatMap(callbackFunction) {
            return Object.fromEntries(
                this.entries().map(([key, value]) => [
                    key,
                    callbackFunction(value),
                ])
            );
        }

        /**
         * The flatFilter() method creates a new object with all elements
         * that pass the test implemented by the provided function.
         *
         * @param {Function} callbackFunction
         *
         * @return {object}
         */
        flatFilter(callbackFunction) {
            return Object.fromEntries(
                this.entries().filter(([key, value]) => [
                    key,
                    callbackFunction(value),
                ])
            );
        }

        static create(data) {
            const obj = new Obj(data);

            return Object.setPrototypeOf(data, {
                ...Object.getPrototypeOf(data),
                __obj__: obj,
                length: obj.length,
                flat: obj.flat,
                entries: () => obj.entries(),
                keys: () => obj.keys(),
                values: () => obj.values(),
                getByKey: (key, defaultValue) =>
                    obj.getByKey(key, defaultValue),
                has: (key) => obj.has(key),
                originalHas: (key) => obj.originalHas(key),
                getKeys: (keys, defaultValue) =>
                    obj.getKeys(keys, defaultValue),
                getFlatKeys: (keys, defaultValue) =>
                    obj.getFlatKeys(keys, defaultValue),
                includes: (key) => obj.includes(key),
                map: (callbackFunction) => obj.map(callbackFunction),
                flatMap: (callbackFunction) => obj.flatMap(callbackFunction),
                filter: (callbackFunction) => obj.filter(callbackFunction),
                flatFilter: (callbackFunction) =>
                    obj.flatFilter(callbackFunction),
            });
        }
    };
export default ObjectGenerator;
