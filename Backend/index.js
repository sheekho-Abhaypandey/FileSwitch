const express=require('express');
const app=express();
const multer=require('multer');
const path=require('path');
const cors=require('cors');
const axios=require('axios');
const  cleanFolder=require('./utils/CleanUploadFolder');
const archiver = require('archiver');
const CloudConvert =require('cloudconvert');

const router = express.Router();
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjQ2NzI2MjQwOGQ1NThjNDI5OWVjZjZmM2NkYzIzM2FhOTMxNjlmNWZhYmM5OTY5NmEwMzA0NWFkNTUzOWNkNDJhZjM2NTdhOGJkZGVhZDgiLCJpYXQiOjE3NDY5NDY1MjUuNTE5ODA5LCJuYmYiOjE3NDY5NDY1MjUuNTE5ODEyLCJleHAiOjQ5MDI2MjAxMjUuNTE2MDc2LCJzdWIiOiI2ODIyNjM1MSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.pQYXRy7-5Nl_qZ_CnKyAMupdvCLoRyIzv8QQHcq-8nUXXxUXXDrXkaO-bj-1WKmYzLrFTb7TR6oVHBBt57cGdZJ0MplYgptzu116MFMQYmMrfSyNYibKHGWTKRHndBaOP3ag7fs_au5vQtZJLcnzixN2fDHPGCMq8lIeX-0iPDabhEqrx2JioUPORAdYLYaFTdIhCU2aWjznjTisUeB0rFGfNZzJKM92nWuFeHu61oYifPDZUxrLPeDqpO7URncuC_9uZfD-BrmIsirvKYdPg-htKaPDc0h5F1_6e7L1FhCRxlgJ0pl3EVk0s2vgDDgjLIo_VeD7mduhtGaHeCQaRubr1YfKWeRV6ZQ5LoiHVVMyeACaEfiLM4BvLRGYT34uB7TQPcXtM-_pt-9m4M4zQ8a65YjeW-kWZeqZLHdkWNhpK3WpZ--5qTBLhm9I0aw8oKT-vlIOvbiPc-cLitX150-pkSix-WJv7M9mGCqzMMSFa52-VRk9onptOgZeZWlKc5JofKZS28JBqgQaAUtPHBhKJXidvB7on_8EJb7U0fXFm4geAFsB1CqPjjtFMmk1DYcbiQ0N-Xr-hvs7KIjM8qU8OJkijp98r-kZXtp5X2vDfguTU7oc2lG_GHP_nGvZFlbSifEaWGP7OfQWFTu59UUvqZtWBiRWBq0SiPq6MPw');


// const CLOUD_CONVERT_APIKEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjQ2NzI2MjQwOGQ1NThjNDI5OWVjZjZmM2NkYzIzM2FhOTMxNjlmNWZhYmM5OTY5NmEwMzA0NWFkNTUzOWNkNDJhZjM2NTdhOGJkZGVhZDgiLCJpYXQiOjE3NDY5NDY1MjUuNTE5ODA5LCJuYmYiOjE3NDY5NDY1MjUuNTE5ODEyLCJleHAiOjQ5MDI2MjAxMjUuNTE2MDc2LCJzdWIiOiI2ODIyNjM1MSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.pQYXRy7-5Nl_qZ_CnKyAMupdvCLoRyIzv8QQHcq-8nUXXxUXXDrXkaO-bj-1WKmYzLrFTb7TR6oVHBBt57cGdZJ0MplYgptzu116MFMQYmMrfSyNYibKHGWTKRHndBaOP3ag7fs_au5vQtZJLcnzixN2fDHPGCMq8lIeX-0iPDabhEqrx2JioUPORAdYLYaFTdIhCU2aWjznjTisUeB0rFGfNZzJKM92nWuFeHu61oYifPDZUxrLPeDqpO7URncuC_9uZfD-BrmIsirvKYdPg-htKaPDc0h5F1_6e7L1FhCRxlgJ0pl3EVk0s2vgDDgjLIo_VeD7mduhtGaHeCQaRubr1YfKWeRV6ZQ5LoiHVVMyeACaEfiLM4BvLRGYT34uB7TQPcXtM-_pt-9m4M4zQ8a65YjeW-kWZeqZLHdkWNhpK3WpZ--5qTBLhm9I0aw8oKT-vlIOvbiPc-cLitX150-pkSix-WJv7M9mGCqzMMSFa52-VRk9onptOgZeZWlKc5JofKZS28JBqgQaAUtPHBhKJXidvB7on_8EJb7U0fXFm4geAFsB1CqPjjtFMmk1DYcbiQ0N-Xr-hvs7KIjM8qU8OJkijp98r-kZXtp5X2vDfguTU7oc2lG_GHP_nGvZFlbSifEaWGP7OfQWFTu59UUvqZtWBiRWBq0SiPq6MPw";

app.use(cors({origin: 'https://file-switch-gamma.vercel.app'}));
const port= process.env.PORT||3001;
const fs = require('fs');
require('dotenv').config();

const convertapi = require('convertapi')(process.env.CONVERT_API_SECRET);


const { Document, Packer, Paragraph, ImageRun } = require("docx");

const FormData = require("form-data");



   
    const storage = multer.diskStorage({
        limits: { fileSize: 2 * 1024 * 1024 },
        destination: "uploads",
        filename: (req, file, cb) => {
          cb(null, file.originalname);  // Keep the original filename
        }
      });
      

      const uploads=multer({storage:storage});

     

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




app.post("/convertFile/png-to-docx", uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const pngPath = req.file.path; // Path to uploaded PNG
        const outputDir = path.join(__dirname, "converted");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        //   const { name } = path.parse(pngPath);  // finding name using destructuring the 'path' object
         const name=path.parse(pngPath).name;  // finding name by extracting name from path object 
        const outputDocxPath = path.join(outputDir, `${name}.docx`);
       

        // Read the image into a buffer
        const imageBuffer = fs.readFileSync(pngPath);

        // Create a new Aspose.Words Document
        const doc = new aw.Document();
        const builder = new aw.DocumentBuilder(doc);

        // 🔹 Fix: Insert image **directly** from buffer (No Base64 conversion needed)
        builder.insertImage(imageBuffer);

        // Save the document as DOCX
        await doc.save(outputDocxPath);

        // Send the converted file as a response
        res.download(outputDocxPath, "converted.docx", (err) => {
            if (err) console.error("Error sending file:", err);
        });

        // Cleanup: Delete files **after response is sent**
        res.on("finish",   () => {
             fs.unlinkSync(pngPath);
             fs.unlinkSync(outputDocxPath);
            console.log("Temporary files deleted.");
        });


        // await cleanupFiles([pngPath, outputDocxPath]); //  Another way Cleanup temp files

    } catch (error) {
        console.error("Error converting PNG to DOCX:", error);
        res.status(500).json({ error: "Internal Server Error" });
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