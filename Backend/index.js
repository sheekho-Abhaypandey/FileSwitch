const express=require('express');
const app=express();
const multer=require('multer');
const path=require('path');
const cors=require('cors');
const axios=require('axios');
const  cleanFolder=require('./utils/CleanUploadFolder');

const router = express.Router();



app.use(cors({origin: 'https://file-switch-gamma.vercel.app'}));



const port= process.env.PORT||3001;
const fs = require('fs');
require('dotenv').config();

const convertapi = require('convertapi')(process.env.CONVERT_API_SECRET);


const { Document, Packer, Paragraph, ImageRun } = require("docx");

const FormData = require("form-data");



   
    const storage = multer.diskStorage({
      
        destination: "uploads",
        filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
        }
      });
      

      const uploads=multer({storage:storage,  limits: { fileSize: 25 * 1024 * 1024 }  });

     
 app.post('/convertFile/docx-to-pdf', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const docxfile=req.file.path;
        console.log(docxfile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(docxfile,".docx")}.pdf`);
        console.log(outputfile);

        const result= await convertapi.convert('pdf', {File:docxfile}, 'docx');
         await result.saveFiles(outputfile);
        

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
            cleanFolder("uploads"); 
            
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 });

 
  app.post('/convertFile/docx-to-jpg', uploads.single("file"), async (req, res,next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log(req.file);
        const docxPath = req.file.path;
        const outputDir = "downloads";
        const outputFile = path.join(outputDir, `${path.basename(docxPath, ".docx")}.jpg`); 

         const result=await convertapi.convert("jpg", {File:docxPath}, "docx");
            await result.saveFiles(outputFile);

        // Download the first converted image (modify if multiple pages)
        res.download(outputFile, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            } else {
                console.log("File downloaded successfully");
                cleanFolder("uploads");
            }
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.post('/convertFile/docx-to-png', uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const docxPath = req.file.path;
        const outputDir = "downloads";
        const {name}=path.parse(docxPath);
        // const outputFile = path.join(outputDir, `${path.basename(docxPath, ".docx")}.png`); //for lowercase
          const outputFile=path.join(outputDir,`${name}.png`)
         const result=await convertapi.convert("png", {File:docxPath}, "docx");
            await result.saveFiles(outputFile);

        // Download the first converted image (modify if multiple pages)
        res.download(outputFile, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            } else {
                console.log("File downloaded successfully");
                cleanFolder("uploads");
            }
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

 app.post('/convertFile/pdf-to-docx', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.docx`);
        console.log(outputfile);

        const result= await convertapi.convert('docx', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
        // await result.saveFiles(outputfile);

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
            cleanFolder("uploads");
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })

 app.post('/convertFile/pdf-to-jpg', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.jpg`);
        console.log(outputfile);

        const result= await convertapi.convert('jpg', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
        

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
            cleanFolder("uploads"); 
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })

 app.post('/convertFile/pdf-to-png', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.png`);
        console.log(outputfile);

        const result= await convertapi.convert('png', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
       

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
            cleanFolder("uploads"); 
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })




app.post("/convertFile/jpg-to-docx", uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imagePath = req.file.path; // Path to the uploaded image
        console.log("Received image:", imagePath);
        const imageBuffer = fs.readFileSync(imagePath); // Read image as buffer
       
        console.log("Image buffer:", imageBuffer);

        // Create a DOCX document with the image
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: { width: 500, height: 500 },
                                type:"jpeg",
                            }),
                        ],
                    }),
                ],
            }],
        });
    console.log(req.file);
        // Generate DOCX as a buffer
        const buffer = await Packer.toBuffer(doc);

        // Set response headers for file download
        res.setHeader("Content-Disposition", 'attachment; filename="output.docx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send DOCX file as response
        res.send(buffer);

        // Clean up uploaded file
        // fs.unlinkSync(imagePath);
        res.on("finish", () => {
            fs.unlinkSync(imagePath);
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/convertFile/jpg-to-pdf', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
    res.status(400).send('Please upload a file');
    }
    const jpgfile=req.file.path;
    console.log(jpgfile);
    const outputdir="downloads";
    const { name } = path.parse(jpgfile); 


    //Another way to extract extension from filename and work with extension
    // const extension = path.extname(jpgfile).toLowerCase().replace('.', ''); // Extract correct extension
    // const result = await convertapi.convert('png', { File: jpgfile }, extension);
    

    const outputfile=path.join(outputdir, `${name}.pdf`);
    console.log(outputfile);


   
      const result= await convertapi.convert('pdf', {File:jpgfile}, 'jpg');
      console.log(result);
        await result.saveFiles(outputfile);
        res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
            cleanFolder("uploads"); 
        })
    }catch(err){
        console.log("error occurred",err);
    }
})

app.post('/convertFile/jpg-to-png', uploads.single('file'), async(req,res,next)=>{


    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }

    const jpgfile=req.file.path;
    console.log(jpgfile);
    const outputdir="downloads";

    const { name } = path.parse(jpgfile);  //desructuring the 'path' object
    // const outputfile=path.join(outputdir, `${path.basename(jpgfile,".jpg")}.png`);  //work only for lowercase extension
    const outputfile = path.join(outputdir, `${name}.png`);  //work for both lowercase and uppercase extension

    console.log(outputfile);
    const result= await convertapi.convert('png', {File:jpgfile}, 'jpg');
    await result.saveFiles(outputfile);
    res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
        cleanFolder("uploads"); 
    })
}catch(err){
    console.log("error occurred",err);
}
});

// app.post("/convertFile/png-to-docx", uploads.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const pngPath = req.file.path; // Path to uploaded PNG
//         const outputDir = path.join(__dirname, "converted");

//         if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir);
//         }
//         //   const { name } = path.parse(pngPath);  // finding name using destructuring the 'path' object
//          const name=path.parse(pngPath).name;  // finding name by extracting name from path object 
//         const outputDocxPath = path.join(outputDir, `${name}.docx`);
       

//         // Read the image into a buffer
//         const imageBuffer = fs.readFileSync(pngPath);

//         // Create a new Aspose.Words Document
//         const doc = new aw.Document();
//         const builder = new aw.DocumentBuilder(doc);

//         // 🔹 Fix: Insert image **directly** from buffer (No Base64 conversion needed)
//         builder.insertImage(imageBuffer);

//         // Save the document as DOCX
//         await doc.save(outputDocxPath);

//         // Send the converted file as a response
//         res.download(outputDocxPath, "converted.docx", (err) => {
//             if (err) console.error("Error sending file:", err);
//         });

//         // Cleanup: Delete files **after response is sent**
//         res.on("finish",   () => {
//              fs.unlinkSync(pngPath);
//              fs.unlinkSync(outputDocxPath);
//             console.log("Temporary files deleted.");
//         });


//         // await cleanupFiles([pngPath, outputDocxPath]); //  Another way Cleanup temp files

//     } catch (error) {
//         console.error("Error converting PNG to DOCX:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


app.post("/convertFile/png-to-docx", uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imagePath = req.file.path;
        console.log("Received PNG:", imagePath);
        
        // Read the image as buffer
        const imageBuffer = fs.readFileSync(imagePath);
        
        // Create a DOCX document with the image
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: { 
                                    width: 600,  // Set your desired width
                                    height: 450  // Set your desired height or use proportion calculation
                                },
                                type: "png",
                            }),
                        ],
                    }),
                ],
            }],
        });

        // Generate DOCX as a buffer
        const buffer = await Packer.toBuffer(doc);

        // Set filename based on original file
        const { name } = path.parse(req.file.path);
        const filename = `${name}.docx`;

        // Set response headers for file download
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send DOCX file as response
        res.send(buffer);

        // Clean up uploaded file when response is finished
        res.on("finish", () => {
            fs.unlinkSync(imagePath);
            console.log("Temporary files deleted");
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});



app.post('/convertFile/png-to-pdf', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }
    const pngfile=req.file.path;
    console.log(pngfile);
    const outputdir="downloads";
    const outputfile=path.join(outputdir, `${path.basename(pngfile,".png")}.pdf`);
    console.log(outputfile);

    const result= await convertapi.convert('pdf', {File:pngfile}, 'png');
     await result.saveFiles(outputfile);
    // await result.saveFiles(outputfile);

     res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
        cleanFolder("uploads"); 
     })
   }catch(err){
    console.log("error occurred",err);
}  
})

app.post('/convertFile/png-to-jpg', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }
    const pngfile=req.file.path;
    console.log(pngfile);
    const outputdir="downloads";
    const outputfile=path.join(outputdir, `${path.basename(pngfile,".png")}.jpg`);
    console.log(outputfile);

    const result= await convertapi.convert('jpg', {File:pngfile}, 'png');
     await result.saveFiles(outputfile);
    // await result.saveFiles(outputfile);

     res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
        cleanFolder("uploads"); 
        fs.unlink(outputfile, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Error deleting file:", unlinkErr);
            } else {
                // console.log("File deleted after download");
            }
     })
     
});
}catch(err){
    console.log("error occurred",err);
}
})


 app.listen(port,()=>{
 console.log(`Server is  listening on port ${port}`);
});