function add(a, b) {
    let a = a;
    
    return function(b) {
        return a + b;
    }
}