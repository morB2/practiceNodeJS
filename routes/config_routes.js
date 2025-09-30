const siteRouter = require('../routes/site');  
const userRouter = require('../routes/users');  
const countryRouter = require('../routes/countries');

exports.routesInit = (app) => {
    app.use('/sites', siteRouter);
    app.use('/users', userRouter);
    app.use('/countries', countryRouter);
}