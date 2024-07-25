import { Validator } from '@trojs/validator';
import { ValidationError } from '@trojs/error';
import Parser from './parser.js';
import Int from './int.js';
import ParseOptionsSchema from './schemas/parse-options.js';

const getFieldName = (field) => {
    if (!field) {
        return field;
    }

    if (field.substr(0, 1) === '?') {
        return field.substr(1);
    }

    if (field.substr(-1, 1) === '?') {
        return field.slice(0, -1);
    }

    return field;
};

const getValue = ({ data, parentData, field, parentField }) => {
    const value = data?.[field];
    const parentValue = parentData?.[parentField];
    if (!value && parentValue?.constructor === Array) {
        return parentValue[0]?.[field];
    }

    return value;
};

/**
 * Transform data to string.
 * @param {object} params
 * @param {object} params.data
 * @param {object=} params.parentData
 * @param {object} params.field
 * @param {object=} params.parentField
 * @returns {string}
 */
const dataToString = ({ data, parentData, field, parentField }) => {
    const fieldName = getFieldName(field);
    const parentFieldName = getFieldName(parentField);
    const value = getValue({
        data,
        parentData,
        field: fieldName,
        parentField: parentFieldName,
    });

    return JSON.stringify(value);
};

/**
 * Object helper
 * @param {object} params
 * @param {object=} params.schema
 * @returns {Obj}
 */
const ObjectGenerator = ({ schema } = {}) =>
    class Obj {
        /**
         * Set the original and prefix.
         * @param {object} original
         * @param {string=} prefix
         */
        constructor(original, prefix) {
            this.original = original;
            this.prefix = prefix;
            this.flatObject = {};
            if (schema) {
                this.validate();
            }
            this.parseObject();
        }

        /**
         * Get the sub schema, look e.g. for optional fields.
         * @returns {object}
         */
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

        /**
         * Setup the validator with the subschema.
         * @returns {object|null}
         */
        get validator() {
            return this.subSchema && this.subSchema.constructor === Object
                ? new Validator(this.subSchema)
                : null;
        }

        /**
         * Get the original data as array.
         * @returns {Array}
         */
        get originalData() {
            return this.original?.constructor === Array
                ? this.original
                : [this.original];
        }

        subValidator({ field, type, data, parent = '' }) {
            const path = [parent, field].filter((item) => item).join('.');
            const subData = data[field];
            const subValidator = new Validator(type);
            subValidator.validate(subData);
            const [subField, subType] = subValidator.errors[0];
            const invalidData = dataToString({
                data: subData,
                parentData: data,
                field: subField,
                parentField: field,
            });

            if (subType?.constructor === Object) {
                this.subValidator({
                    field: subField,
                    type: subType,
                    data: subData,
                    parent: path,
                });
            }

            const subTypeName =
                subType?.constructor === String ? subType : subType.name;

            throw new ValidationError({
                message: `The field ${path}.${subField} should be a ${subTypeName} (${invalidData})`,
                value: {
                    field: `${path}.${subField}`,
                    type: subTypeName,
                    invalidData,
                    data: this.original,
                },
                me: this.constructor,
            });
        }

        /**
         * Validate the original data.
         */
        validate() {
            const { validator } = this;

            if (!validator) {
                return;
            }

            this.originalData.forEach((data) => {
                if (!validator.validate(data)) {
                    const [field, type] = validator.errors[0];
                    const invalidData = dataToString({ data, field });

                    if (type?.constructor === String) {
                        throw new ValidationError({
                            message: `The field ${field} should be a ${type} (${invalidData})`,
                            value: {
                                field,
                                type,
                                invalidData,
                                data: this.original,
                            },
                            me: this.constructor,
                        });
                    } else if (type?.constructor === Object) {
                        this.subValidator({ field, type, data });
                    } else {
                        throw new ValidationError({
                            message: `The field ${field} should be a ${type.name} (${invalidData})`,
                            value: {
                                field,
                                type: type.name,
                                invalidData,
                                data: this.original,
                            },
                            me: this.constructor,
                        });
                    }
                }
            });
        }

        /**
         * flatten the object 1 level per time.
         */
        parseObject() {
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
         * @returns {object}
         */
        get flat() {
            return this.flatObject;
        }

        /**
         * Get the object entries.
         * @returns {Array}
         */
        entries() {
            return Object.entries(this.flatObject);
        }

        /**
         * Get the object keys.
         * @returns {Array}
         */
        keys() {
            return Object.keys(this.flatObject);
        }

        /**
         * Get the object values.
         * @returns {Array}
         */
        values() {
            return Object.values(this.flatObject);
        }

        /**
         * Get the object length.
         * @returns {number}
         */
        get length() {
            return Object.keys(this.flatObject).length;
        }

        /**
         * Get an item by key.
         * @param {string} key
         * @param {object|null} defaultValue
         * @returns {object|null}
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
         * @param {Array} keys
         * @param {object|null} defaultValue
         * @returns {object|null}
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
         * @param {Array} keys
         * @param {object|null} defaultValue
         * @returns {object|null}
         */
        getKeys(keys, defaultValue) {
            const result = keys.reduce((accumulator, currentKey) => {
                const key = currentKey.toString();
                const value = this.getByKey(key);

                if (value !== undefined && value !== null) {
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
         * @param {string} key
         * @returns {boolean}
         */
        originalHas(key) {
            return key in this.original;
        }

        /**
         * Check if the object has a key.
         * @param {string} key
         * @returns {boolean}
         */
        has(key) {
            return key in this.flatObject;
        }

        /**
         * Check if the object has a key that includes.
         * @param {string} key
         * @returns {boolean}
         */
        includes(key) {
            return (
                this.keys().filter((item) => item.startsWith(key)).length > 0
            );
        }

        /**
         * The map() method creates a new object populated with the results of
         * calling a provided function on every element in the original object.
         * @param {Function} callbackFunction
         * @returns {object}
         */
        map(callbackFunction) {
            return Object.fromEntries(
                Object.entries(this.original).map(([key, value]) => [
                    key,
                    callbackFunction(value, key, this.original),
                ])
            );
        }

        /**
         * The filter() method creates a new object with all elements
         * that pass the test implemented by the provided function.
         * @param {Function} callbackFunction
         * @returns {object}
         */
        filter(callbackFunction) {
            return Object.fromEntries(
                Object.entries(this.original).filter(
                    ([key, value]) =>
                        key && callbackFunction(value, key, this.original)
                )
            );
        }

        /**
         * The every() method tests whether all elements in the object pass the
         * test implemented by the provided function.
         * It returns a Boolean value.
         * @param {Function} callbackFunction
         * @returns {boolean}
         */
        every(callbackFunction) {
            return Object.values(this.original).every((value) =>
                callbackFunction(value)
            );
        }

        /**
         * The some() method tests whether at least one element in the object
         * passes the test implemented by the provided function.
         * It returns true if, in the object, it finds an element for which the
         * provided function returns true; otherwise it returns false.
         * It doesn't modify the object.
         * @param {Function} callbackFunction
         * @returns {boolean}
         */
        some(callbackFunction) {
            return Object.values(this.original).some((value) =>
                callbackFunction(value)
            );
        }

        /**
         * The flatMap() method creates a new object populated with the results
         * of calling a provided function on every element in the flat object.
         * @param {Function} callbackFunction
         * @returns {object}
         */
        flatMap(callbackFunction) {
            return Object.fromEntries(
                this.entries().map(([entryKey, entryValue]) => [
                    entryKey,
                    callbackFunction(entryValue),
                ])
            );
        }

        /**
         * The flatFilter() method creates a new object with all elements
         * that pass the test implemented by the provided function.
         * @param {Function} callbackFunction
         * @returns {object}
         */
        flatFilter(callbackFunction) {
            return Object.fromEntries(
                this.entries().filter(
                    ([key, value]) => key && callbackFunction(value)
                )
            );
        }

        /**
         * The every() method tests whether all elements in the object pass the
         * test implemented by the provided function.
         * It returns a Boolean value.
         * @param {Function} callbackFunction
         * @returns {boolean}
         */
        flatEvery(callbackFunction) {
            return this.values().every((value) => callbackFunction(value));
        }

        /**
         * The some() method tests whether at least one element in the object
         * passes the test implemented by the provided function.
         * It returns true if, in the object, it finds an element for which the
         * provided function returns true; otherwise it returns false.
         * It doesn't modify the object.
         * @param {Function} callbackFunction
         * @returns {boolean}
         */
        flatSome(callbackFunction) {
            return this.values().some((value) => callbackFunction(value));
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
                every: (callbackFunction) => obj.every(callbackFunction),
                flatEvery: (callbackFunction) =>
                    obj.flatEvery(callbackFunction),
                some: (callbackFunction) => obj.some(callbackFunction),
                flatSome: (callbackFunction) => obj.flatSome(callbackFunction),
            });
        }

        /**
         * Create for every item in the array an anvancd object.
         * @param {Array} data
         * @returns {Array}
         */
        static createAll(data) {
            return data.map((item) => Obj.create(item));
        }

        /**
         * Parse the data, so it converts all values to the given schema.
         * @param {object} data
         * @param {object} options
         * @returns {object}
         */
        static parse(data, options = {}) {
            const ParseOptions = ObjectGenerator({
                schema: ParseOptionsSchema,
            });
            const parseOptions = ParseOptions.create(options);
            const parser = new Parser({ schema });
            const parsed = parser.parseObject(data);

            if (parseOptions?.validate) {
                return Obj.create(parsed);
            }

            return parsed;
        }

        /**
         * Parse every item in the array.
         * @param {Array} data
         * @returns {Array}
         */
        static parseAll(data) {
            return data.map((item) => Obj.parse(item));
        }
    };

export { ObjectGenerator as Obj, Parser, Int };
