function toDate(data) {
    const string = data.split('.');
    let date = string[2];
    date += '-';
    date += string[1];
    date += '-';
    date += string[0];
    return date;
}

function sortNews(first, second) {
    const dateComparison = toDate(second.date).localeCompare(toDate(first.date));
    if (dateComparison !== 0) {
        return dateComparison;
    }
    return second.time.localeCompare(first.time);
}

function sortMessages(first, second) {
    const dateComparison = toDate(first.date).localeCompare(toDate(second.date));
    if (dateComparison !== 0) {
        return dateComparison;
    }
    return first.time.localeCompare(second.time);
}