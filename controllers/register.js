
const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			db('users')
			.returning('*')
			.insert({
				email: loginEmail[0].email,
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]); //returns array of objects but we only want a object hence user[0]
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};