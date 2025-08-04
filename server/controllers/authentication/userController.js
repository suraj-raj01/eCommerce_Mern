const UserModel = require("../../models/authenticationModel/userModel")

const createUser = async (req, res) => {
    const { ...data } = req.body;
    try {
        const users = await UserModel.create(data)
        res.status(200).json({ message: "User created successfully" }, { status: 200 })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" }, { status: 500 })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate('roleId')
        res.status(200).json({ data: users, message: "user data fetched successfull" }, { status: 200 })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message }, { status: 500 })
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { ...data } = req.body;
    try {
        const users = await UserModel.findByIdAndUpdate(id, data, { new: true })
        res.status(200).json({ data: users, message: "user updated successfully" }, { status: 200 })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message }, { status: 500 })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfulyy!" }, { status: 200 })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message }, { status: 500 })
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({message:"both field are reqired!!"})
    }

    const isUser = await UserModel.findOne({email}).populate("roleId")
    if(!isUser){
        res.status(400).json({message:"user not found"})
    }

    const matchPassword = password==isUser.password;
    if(!matchPassword){
        res.status(400).json({message:"Incorrect Password!!"})
    }

    res.status(200).json({data:isUser,message:"User login successfull!"},{status:200})

    try {

    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message }, { status: 500 })
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    userLogin
}