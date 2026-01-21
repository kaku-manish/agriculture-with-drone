// Simple Rule-Based Recommendation Engine

function generateRecommendation(farm, iot, drone, kbCrops, kbDiseases) {
    let recommendation = {
        crop_suggestion: "Keep monitoring",
        water_advice: "Check water levels",
        disease_detected: "None",
        medicine_suggestion: "None",
        medicine_secondary: "None",
        dosage: "N/A",
        preventive_measures: "None",
        timeline: "None"
    };

    // 1. Crop Suggestion (if no crop or early stage)
    if (farm.current_crop === 'None' || farm.current_crop === '') {
        const soilRec = kbCrops.find(c => c.soil_type === farm.soil_type);
        if (soilRec) {
            recommendation.crop_suggestion = `Recommended: ${soilRec.recommended_crop}`;
        }
    } else {
        recommendation.crop_suggestion = `Current Crop: ${farm.current_crop}`;
    }

    // 2. Water Advice
    if (iot) {
        if (iot.water_level < 5.0) {
            recommendation.water_advice = "water_low";
        } else if (iot.water_level > 10.0) {
            recommendation.water_advice = "water_high";
        } else {
            recommendation.water_advice = "water_optimal";
        }
    }

    // 3. Disease & Medicine
    if (drone) {
        recommendation.disease_detected = drone.disease_type;

        // Normalize for lookup (lowercase, replace underscores with spaces if needed for fuzzy, or keep simple)
        // We will try exact match, then case-insensitive, then snake_case fallback
        const normalize = (str) => str.toLowerCase().replace(/_/g, ' ').trim();
        const target = normalize(drone.disease_type);

        const diseaseRule = kbDiseases.find(d =>
            normalize(d.disease_name) === target ||
            normalize(d.disease_name).includes(target) ||
            target.includes(normalize(d.disease_name))
        );

        if (diseaseRule) {
            recommendation.medicine_suggestion = diseaseRule.medicine;
            recommendation.medicine_secondary = diseaseRule.medicine_secondary;
            recommendation.dosage = diseaseRule.dosage;
            recommendation.preventive_measures = diseaseRule.preventive_measures;
            recommendation.timeline = diseaseRule.timeline;
        } else if (drone.disease_type !== 'Healthy') {
            recommendation.medicine_suggestion = "Consult local expert";
            recommendation.dosage = "N/A";
        }
    }

    return recommendation;
}

module.exports = { generateRecommendation };
