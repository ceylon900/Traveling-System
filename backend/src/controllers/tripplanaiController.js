const Groq = require("groq-sdk");
const Trip = require("../models/Trip");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateTripPlan = async (req, res) => {
    const { budget, days, transport, members, keywords } = req.body;

    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "Groq API Key missing!" });
        }

        const prompt = `Create a detailed travel itinerary for Sri Lanka.
        Details: Budget ${budget} LKR, Duration ${days} days, Group ${members} people, Transport ${transport}, Interests ${keywords}.
        
        Strictly return ONLY a valid JSON object with this structure:
        {
          "tripTitle": "Catchy Title",
          "totalEstimatedCost": "Total Cost in LKR",
          "itinerary": [
            { "day": 1, "destination": "City Name", "activities": ["activity1", "activity2"], "accommodation": "stay info" }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful Sri Lankan travel assistant that only responds in JSON format."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", 
            response_format: { type: "json_object" } 
        });

        const aiData = JSON.parse(chatCompletion.choices[0].message.content);
        res.status(200).json(aiData);

    } catch (err) {
        console.error("GROQ ERROR:", err.message);
        res.status(500).json({ message: "AI Plan generation failed with Groq", error: err.message });
    }
};


exports.saveTripPlan = async (req, res) => {
  try {
    const { userId, planData, formData } = req.body;

    const newTrip = new Trip({
      userId: userId,
      tripTitle: planData.tripTitle,
      totalEstimatedCost: planData.totalEstimatedCost,
      fullPlanDescription: planData.fullDescription || JSON.stringify(planData.itinerary),
      budget: formData.budget,
      days: formData.days,
      members: formData.members,
      transport: formData.transport
    });

    await newTrip.save();
    res.status(201).json({ message: "Trip saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save the trip" });
  }
};

exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 }); 
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trips", error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting trip" });
  }
};