const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth")
dotenv.config();

router.get("/", async (req, res) => {
    const {limit,offset,salary,name} = req.query;
   //-get me jobs with salary btw 10000 and 120000
   // const jobs=await Job.find({salary:{$gte:2000,$lte:10000}}).skip(offset).limit(limit);

   //-get me jos with salary=salary
   // const jobs = await Job.find({salary}).skip(offset).limit(limit);

    // -get me jobs which includes company name with name and salary = salary
    // const jobs = await Job.find({ companyName: name, salary }).skip(offset).limit(limit);  // will exactly match the name

    // -jobs company name should contain name   // Book book BOOK bOOK
    //$regex - for string searching and parsing , $option-case sensitive search
    // const jobs = await Job.find({ companyName: { $regex: name, $options: "i" }, salary }).skip(offset).limit(limit);

    // -Search by jobPosition, salary range, and jobType
    // const jobs = await Job.find({
    //     salary: { $gte: 10000, $lte: 50000 },
    //     jobPosition: { $regex: position, $options: "i" },
    //     jobType: type, // Exact match for jobType
    // })
    // .skip(offset)
    // .limit(limit);

    //-search by company name and job position and  salary and job type
    //  const jobs = await Job.find({ companyName: { $regex: name, $options: "i" }, salary,jobPosition: { $regex: position, $options: "i" },
    //  jobType: { $regex: type, $options: "i" } }).skip(offset).limit(limit);
    // const jobs = await Job.find().skip(offset).limit(limit);

    
    res.status(200).json(jobs);
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
})



router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the user is authorized
        const userId = req.user.id;
        if (job.user.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this job" });
        }

        // Delete the job
        await Job.findByIdAndDelete(id);
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting job" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    const { companyName, jobPosition, salary, jobType } = req.body;
    if (!companyName ||!jobPosition ||!salary ||!jobType) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try{
    const user = req.user;
    const job = await Job.create({
        companyName,
        jobPosition,
        salary,
        jobType,
        user: user.id,
    });
    res.status(200).json(job);
} catch (err) {
    console.error(err);
     res.status(500).json({ message: "Error in creating jobs" });
}
   

})

router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { companyName, jobPosition, salary, jobType } = req.body;
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.user.toString()!== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this job" });
    }
    try{
        await Job.findByIdAndUpdate(id, {
            companyName,
            jobPosition,
            salary,
            jobType,
        });
        res.status(200).json({ message: "Job updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in updating job" });
    }
});
module.exports = router;