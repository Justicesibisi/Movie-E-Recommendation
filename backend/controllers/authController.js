const loginUser = (req, res) => {
    // Example login logic
    const { email, password } = req.body;

    if (email && password) {
        res.status(200).json({ message: 'User logged in successfully.' });
    } else {
        res.status(400).json({ error: 'Invalid email or password.' });
    }
};

const registerUser = (req, res) => {
    // Example registration logic
    const { email, password } = req.body;

    if (email && password) {
        res.status(201).json({ message: 'User registered successfully.' });
    } else {
        res.status(400).json({ error: 'Email and password are required.' });
    }
};

module.exports = { loginUser, registerUser };
