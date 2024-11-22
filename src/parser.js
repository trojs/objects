/**
 * Object parser, that converts data to the given schema.
 */
export default class Parser {
    /**
     * Constructor that receive the value,
     * and set the schema to a local variable.
     * @param {object} params
     * @param {object} params.schema
     */
    constructor({ schema }) {
        this.schema = schema
    }

    /**
     * Loop through the object, parse every field, and return an object.
     * @param {object} data
     * @returns {object}
     */
    parseObject(data) {
        return Object.fromEntries(
            Object.entries(data).map(this.parse.bind(this))
        )
    }

    /**
     * Get the field type for a key, also check optional keys.
     * @param {object} params
     * @param {string} params.key
     * @returns {Function}
     */
    getFieldType({ key }) {
        if (this.schema[key]) {
            return this.schema[key]
        }

        if (this.schema[`${key}?`]) {
            return this.schema[`${key}?`]
        }

        if (this.schema[`?${key}`]) {
            return this.schema[`?${key}`]
        }

        return null
    }

    /**
     * Parse a single field, and check for nested schemas.
     * @param {[string, any]} param
     * @returns {any[]}
     */
    parse([key, value]) {
        const Type = this.getFieldType({ key })

        if (value === undefined || value === null) {
            return [key, value]
        }

        if (Type?.constructor === Object) {
            const subParser = new Parser({ schema: Type })
            return [key, subParser.parseObject(value)]
        }

        if (Type?.constructor === Boolean || Type?.name === 'Boolean') {
            return [key, this.parseBoolean(value)]
        }

        return Type ? [key, new Type(value).valueOf()] : [key, value]
    }

    /**
     * Parse a boolean value.
     * @param {*} value
     * @returns {boolean}
     */
    parseBoolean(value) {
        if (value.constructor === String) {
            return ['true', 't', 'yes', 'y', 'on', '1'].includes(
                value.trim().toLowerCase()
            )
        }

        if (value.constructor === Number) {
            return value.valueOf() === 1
        }

        if (value.constructor === Boolean) {
            return value.valueOf()
        }

        return false
    }
}
