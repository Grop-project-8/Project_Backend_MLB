import YOGA from '../Models/yoga.js'

export const createYoga = async (req,res)=>{
    try {
        const { youtube_embed_link, title, equipment, thumbnail } = req.body;
          // check link
          const yoga = await YOGA.findOne({title:title})
          if(yoga){
            return res.status(400).send("title already exists");
          }
          const newYoga = new YOGA({
            youtube_embed_link,
            title,
            equipment,
            thumbnail,
      });
      await newYoga.save();
      res.send("สร้างเสร็แล้ว")
    } catch (error) {
        console.log(error);
    }
}


