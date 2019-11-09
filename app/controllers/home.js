var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');

exports.loggedIn = function(req, res, next)
{
	if (req.session.user) { // req.session.passport._id

		next();

	} else {

		res.redirect('/login');

	}

}

exports.home = function(req, res) {
	
	
	res.render('home.ejs', {
		error : req.flash("error"),
		success: req.flash("success"),
		session:req.session,
	
	 });
	 
}


exports.signup = function(req, res) {
	console.log("res**********",res);
	return


  //return  res.status(200).send(res);
	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('signup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}
	res.status(200).send(re)

}


exports.login = function(req, res) {


	
	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('login', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});

	}
	
}


exports.register = function(req, res) {
	if(req){

	}else{
		res.status(200).send("success")
	}

	// if (req.session.user) {

	// 	res.redirect('/home');

	// } else {

	// 	res.render('signup', {
	// 		error : req.flash("error"),
	// 		success: req.flash("success"),
	// 		session:req.session
	// 	});
	// }

}


    
