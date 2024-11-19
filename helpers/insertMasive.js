export function placerholders(array) {
    const placeholder = array.map((item, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(", ");
    return placeholder

} // Returns dinamic placerholder to VALUES 

export function insertArray(array,value) {
    const arrayContainer = []
    array.forEach((item) => { arrayContainer.push(value, item); });
    return arrayContainer
} // returns an array that places a value in front of each value in the array => value = 2 [1,4,3] => [2,1,2,4,2,3]

