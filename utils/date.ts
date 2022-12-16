const convertStringIntoDate = (dateString: String) => {
    let date = new Date(String(dateString));
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

export {
    convertStringIntoDate
}