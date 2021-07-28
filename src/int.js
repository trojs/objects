/**
 * An integer is a custom type based on the default number type.
 * It can only contain integers, and throw an error if it doesnt reveive it.
 */
export default class Int extends Number {
    /**
     * Constructor that receive the value,
     * and pass it to the number constructor.
     *
     * @param {number} value
     */
    constructor(value) {
        super(value);
        this.validate(value);
    }

    /**
     * Validate the value, it should throw an error if it isnt a integer.
     *
     * @param {number} value
     */
    validate(value) {
        if (parseInt(value, 10) !== value) {
            throw new Error(`${value} isnt an integer`);
        }
    }
}
