// We create this file to pass this functionality to project to project, because we'll use it again.

// =============================================== HASH PASSWORD  ============================================================ //
// If someone gets access to our database, there is located the data of the user and the password, because most people use the 
// same password for convinience it can be very dangerous to avoid this, we need to hash the password before if gets passed to 
// the database. We'll do this using the library bcryptjs
import bcrypt from 'bcryptjs';

// const salt = await bcrypt.genSalt(10);
// This line generates a random "salt" value that will be used to hash the password. A salt is a random value that is added to 
// the password before hashing, which helps to make the resulting hash more resistant to attacks like dictionary attacks and 
// rainbow table attacks. The genSalt() function in bcrypt generates a random salt value using a specified "cost" value. The
// cost value determines how much CPU time is needed to calculate the hash, and higher cost values result in stronger hashes 
// that are more resistant to attacks.

// In this example, a cost value of 10 is used to generate the salt. This is a good default value that provides a good balance 
// between security and performance. However, you may need to adjust the cost value based on the specific needs of your application.

// const hashedPassword = await bcrypt.hash(password, salt);
// This line uses the generated salt value to hash the password. The hash() function in bcrypt takes two arguments: the password 
// to be hashed, and the salt value to use for the hash. It then calculates the hash value using a one-way hash function and the 
// specified salt value.

// The resulting hash value is a string that represents the hashed password. This string can then be stored in a database or other
// storage mechanism to be compared against the user's password when they log in.

// By using a salt value and a one-way hash function, bcrypt helps to ensure that user passwords are stored securely and are 
// resistant to attacks like password cracking and brute-force attacks.

// =========================================================================================================================== //

export const hashPassword = async (password) => {
    // =============================================== HASH PASSWORD  ======================================================== //

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;

    // ======================================================================================================================= //
};


// CHECK if the password is correct
export const comparePassword = async (password, hashPassword) => {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
};