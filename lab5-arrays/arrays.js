function checkVector(vector){
    function func(item, index, array){
        return index + 1 === array.length || item <= array[index + 1];
    }

    return vector.every(func);
}