import Joi from "joi";

// Define the schema for an item
const itemSchema = Joi.object({

    name: Joi.string().required(),
    otherNamesList: Joi.array().items(Joi.string()).optional(),
    tagsList: Joi.array().items(Joi.string()).optional(),
    location: Joi.string().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    isLent: Joi.string().allow(null).optional(),

    // Date handled in backend
    // createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    // updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});

export default itemSchema;

// const Item = {
//     name: "",
//     otherNamesList: [],
//     tagList: [],
//     location: "",
//     description: "",
//     image: null,
//     isLent: null,
//     lentHistory: null
// }
// export default Item;