const versionList = require(`./versions`)

module.exports = (versions) => {
    let count = 0;

    let mainArr = []
    let tempArr = []

    let parsedName = "";

    for(const version of versionList) {
        if(versions.includes(version)) {
            count++;
            tempArr.push(version)
        } else {
            if(tempArr.length > 0) {
                mainArr.push(tempArr)
                tempArr = []
            }

            count = 0;
        }

        if(versionList.indexOf(version) == versionList.length - 1 && tempArr.length > 0) mainArr.push(tempArr);
    }


    for(const arr of mainArr) {
        const first = arr[0];
        const last = arr[arr.length - 1];

        if(arr.length == 1) {
            parsedName += `${first}`;
        } else if(mainArr.indexOf(arr) == mainArr.length - 1) {
            parsedName += `${first} - ${last}`;
        } else {
            parsedName += `${first} - ${last}, `;
        }
    }

    return parsedName;
}