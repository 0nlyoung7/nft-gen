var numbersToWords = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
}

Number.prototype.toWords = function(){
    var result = ''
    var tmp = this.toString();
    for (var i = 0 ; i < tmp.length ; i++) {
        result += numbersToWords[ Number(tmp[i]) ]
    }
    return result;
};

Number.prototype.toEnglish = function(){
    let innerRecurse = (num) => {
        let place;
        let placeValueNum;
        let toBeRecursed;
        let results = "";
        
        if (numbersToWords[num]) {
            results = numbersToWords[num];
        } else if (num < 100) {
            placeValueNum = Math.floor(num / 10) * 10;
            toBeRecursed = num % 10;
            results = numbersToWords(placeValueNum) + "-" + numbersToWorlds[toBeRecursed];
        } else {
            if (num < 1000) {
                place = 100;
            } else {
                place = 1000;
                while (place * 1000 <= num) {
                    place *= 1000;
                }
            }

            placeValueNum = Math.floor(num / place);
            toBeRecursed = num % place;
            results = innerRecurse(placeValueNum) + " " + numbersToPlace(place);
            var restOfNumber;

            restOfNumber = innerRecurse(toBeRecursed);
            if (restOfNumber !== "zero") {
                results += " " + restOfNumber;
            }
        }
        return results;
    };
    return innerRecurse(this);
}

var array = []
for (var i = 1 ; i <= 100; i++) {
    console.log({});
    array.push({id: i, name: i.toWords()})
}

console.log(array);