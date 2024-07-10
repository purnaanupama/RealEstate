const Listing = require('../models/listing.model.js');
const errorHandler = require('../utils/error.js');

exports.createListing = async(req,res,next)=>{
    try{
     const listing = await Listing.create(req.body);
     return res.status(201).json(listing);
    }catch(error){
     next(error)
    }
}

exports.deleteListing= async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
      return next(errorHandler(404,'Listing not found'))  
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only delete your own listings'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted")
    } catch (error) {
        next(error)
    }

}

exports.updateListing=async(req,res,next)=>{
   const listing = await Listing.findById(req.params.id);
   if(!listing){
    return next(errorHandler(404,'Listing not found'))
   }
   if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'You can only update your own listing'))
   }
   try {
    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedListing)
   } catch (error) {
    next(error)
   }
}
exports.getListing=async(req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id)  
        if(!listing){
            return next(errorHandler(404,'Listing not found'))
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}
exports.getListings=async(req,res,next)=>{
    try {
      //if there is a limit use it and parse it otherwise send 9 listings to the page
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;

      let offers = req.query.offers;
      if(offers === undefined||offers === 'false'){
        offers={$in:[false,true]}
      }

      let furnished = req.query.furnished;
      if(furnished === undefined||furnished === 'false'){
        furnished = {$in:[false,true]}
      }

      let parking = req.query.parking;
      if(parking === undefined){
        parking = {$in:[false,true]}
      }

      let type = req.query.type;
      if(type === undefined||type === 'all'){
        type = {$in:['sale','rent']}
      }

      const searchItem = req.query.searchItem || '';
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc'

      const listings = await Listing.find({
        name:{$regex:searchItem,$options:'i'},
        offers,
        furnished,
        parking,
        type
      }).sort(
        {[sort]:order}
      ).limit(limit).skip(startIndex)
      
      //return the filtered listings to the user
      return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}
