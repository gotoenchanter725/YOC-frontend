export const convertStringIntoDate = (dateString: String) => {
    let date = new Date(String(dateString));
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

export const convertDateToFullString = (date: Date) => {
    let formattedDateTime = date.toISOString();
    let formattedDate = formattedDateTime.substring(0, 19).replace('T', ' ');
    return formattedDate;
}