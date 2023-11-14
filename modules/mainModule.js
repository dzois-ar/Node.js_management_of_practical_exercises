
const ExcelDateToJSDate = function (date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
}

const checkIfDate = function (dateStr) {
    if (!isNaN(Date.parse(ExcelDateToJSDate(dateStr))))
        return true
    else
        return false

}

const pgParamsNumbering = function (first, last, options = {}) {
    try {
        let result = []
        for (i = first; i <= last; i++) {
            result.push('$' + i);
        }
        if ((options?.replaceNums !== undefined) && (options?.replaceWith !== undefined)) {
            for (i = 0; i <= replaceNums.length; i++) {
                result[options.replaceNums[i]] = options.replaceWith[i]
            }
        }
        if (options?.prefixes !== undefined) {
            if (options.prefixes.length !== result.length)
                throw `Prefixes is length ${options.prefixes.length} and numbers are ${first} to ${last}`
            for (i = 0; i < result.length; i++)
                result[i] = options.prefixes[i] + result[i]
        }
        return result.join(' , ');
    }
    catch (err) {
        console.error(`Function 'pgParamsNumbering' error: `, err)
        return null
    }
}

const range = function (first, last) {
    let result = {}
    for (i = first; i <= last; i++) {
        result[i] = i;
    }
    return result;
}

const queryErrorFunction = (err) => {
    if (err) {
        console.error('Query Error:', err)
        return
    }
}



module.exports = {
    checkIfDate: checkIfDate,
    range: range,
    pgParamsNumbering: pgParamsNumbering,
    checkIfDate: checkIfDate,
    ExcelDateToJSDate: ExcelDateToJSDate,
    queryErrorFunction: queryErrorFunction
}