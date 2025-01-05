const text2Camel = (input) => {
    return input
    .split(" ") // Split the string into words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase() // Lowercase the first word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter and lowercase the rest
    )
    .join(""); // Join them without spaces
}
export default text2Camel;