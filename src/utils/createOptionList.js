import text2Camel from "./text2Camel"

const createOptionList = (valuesList) => {
    return valuesList.map(value => ({"value": text2Camel(value), "label": value}))
}
export default createOptionList;