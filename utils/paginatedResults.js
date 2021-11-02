const getNextPrevPages = require('./getNextPrevPages')

/**
 * @desc Create a pagination with the model and the options
 * @date 2021-10-28
 * @param {RequestObject} req
 * @param {SequelizeModel} model
 * @param {object} otherOptions 
 * @returns {object}
 */
module.exports = async (req,model,otherOptions = {}) => {
    const limit = 5
    const page = Number(req.query.page ?? 1 ) 
    const results = await model.paginate({
        page,
        paginate:limit,
        ...otherOptions
    })
    
    return {
        ...results,
        ...getNextPrevPages(page,limit,results.total)
    }
}