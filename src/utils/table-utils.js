export function getGroupingColum(columns) {
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].grouping === true) {
            return columns[i].field;
        }
    }
    return null;
}
