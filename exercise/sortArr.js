Array.prototype.sortArr = function(){
    var len = this.length;
    var middlePos = Math.floor(len/2);
    var leftArr = [];
    var rightArr = [];
    var middleArr = [];
    var middleNum = this[middlePos];
    for(var i=0; i<len; i++){
        var thisVal = this[i];
        if(thisVal<middleNum){
            var leftLen = leftArr.length;
            if(leftLen == 0){
                leftArr.push(thisVal);
            }else if(thisVal>leftArr[leftLen-1]){
                leftArr.push(thisVal)
            }else{
                for(var j=0; j<leftLen;){
                    if(thisVal<=leftArr[j]){
                        leftArr.splice(j,0,thisVal);
                        break;
                    }else{
                        j++
                    }
                }
            }
        }else if(thisVal>middleNum){
            var rightLen = rightArr.length;
            if(rightLen == 0){
                rightArr.push(thisVal);
            }else if(thisVal>rightArr[rightLen-1]){
                rightArr.push(thisVal);
            }else{
                for(var k=0; k<rightLen;){
                    if(thisVal<=rightArr[k]){
                        rightArr.splice(j,0,thisVal);
                        break;
                    }else{
                        k++
                    }
                }
            }
        }else if(thisVal==middleNum){
            middleArr.push(thisVal)
        }
    }
    var sortEnd = leftArr.concat(middleArr).concat(rightArr);
    return sortEnd;
}

var xarr = [6,9,8,3,7,34,4,9,3]
xarr.sortArr();