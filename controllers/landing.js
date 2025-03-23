const { renderDashboard } = require("./admin");




const renderHomeDashboard = async (req, res) => {
	try {
		res.render('landingpage/home', { workers: notVerifyWorkers, clients, errMsg: '', totalWorkers: workers.length });
	} catch (err) {
		res.render('landingpage/home', { workers: [], clients: [], errMsg: err.message, totalWorkers: 0 });
	}
};


module.exports ={
    renderHomeDashboard
}