import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_KEY || ""
);

// Middleware
app.use(cors());
app.use(express.json());

// Create a complaint
app.post("/complaints", async (req, res) => {
    const { name, email, complaint } = req.body;
    if (!name || !email || !complaint) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const { data, error } = await supabase.from("complaints").insert([{ name, email, complaint }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get all complaints
app.get("/complaints", async (_req, res) => {
    const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Toggle status
app.patch("/complaints/:id", async (req, res) => {
    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabase
        .from("complaints")
        .select("status")
        .eq("id", id)
        .single();

    if (fetchError || !existing) return res.status(500).json({ error: fetchError?.message || "Complaint not found" });

    const newStatus = existing.status === "Pending" ? "Resolved" : "Pending";
    const { data, error } = await supabase
        .from("complaints")
        .update({ status: newStatus })
        .eq("id", id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete
app.delete("/complaints/:id", async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from("complaints").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Complaint deleted" });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
