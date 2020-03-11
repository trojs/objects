/**
 * Object helper
 */
module.exports = class Obj {
    /**
     * Set the original and prefix.
     *
     * @param {object} original
     * @param {string} prefix
     *
     * @return {object}
     */
    constructor(original, prefix) {
        this.original = original;
        this.prefix = prefix;
        this.flatObject = {};
        this.parse();

        return this;
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

                if (typeof originalRow === 'object') {
                    const childRows = new Obj(originalRow, index).flat;

                    this.flatObject = Object.assign(this.flatObject, childRows);

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
        if (!Object.prototype.hasOwnProperty.call(this.flatObject, key)) {
            return defaultValue;
        }

        return this.flatObject[key];
    }
};
