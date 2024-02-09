const asyncHandler= require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get COntacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
})

//@desc Get Contact
//@route GET /api/contacts/id
//@access public
const getContact= asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
})

//@desc Get Contact
//@route GET /api/contacts/id
//@access public
const postContact= asyncHandler(async(req,res)=>{
    console.log("the request body is:",req.body);
    const {name, email, phone}=req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    })
    res.status(201).json(contact)
})

//@desc Update Contact
//@route PUT /api/contacts/id
//@access public
const updateContact= asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User dont have permission to update other user contacts")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(200).json(updatedContact)
})

//@desc Delete Contact
//@route PUT /api/contacts/id
//@access public
const deleteContact= asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User dont have permission to delete other user contacts")
    }

    await Contact.deleteOne({_id: req.params.id})

    res.status(200).json(contact)
})

module.exports = {getContacts,
                getContact,
                postContact,
                updateContact,
                deleteContact};