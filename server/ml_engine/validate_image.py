import sys
import json
import os
import cv2
import numpy as np

def validate_crop_image(img_path):
    """
    Validation is now bypassed to allow ALL images for the demo/user experience.
    We will let the ML model handle the actual classification.
    """
    try:
        # Read image just to verify it's a valid file
        img = cv2.imread(img_path)
        if img is None:
            return False, "Unable to read image file. Please upload a valid JPG or PNG."
        
        # We perform NO heuristic checks (color, edges, etc.)
        # This ensures the user is never blocked by "Invalid Paddy Crop" errors.
        
        return True, "✅ Image accepted for analysis"
        
    except Exception as e:
        # Even if something crashes, we allow it to proceed
        return True, f"⚠️ Validation skipped: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    img_path = sys.argv[1]
    is_valid, reason = validate_crop_image(img_path)
    
    result = {
        "is_valid": is_valid,
        "reason": reason
    }
    
    # Ensure JSON output is clean
    print(json.dumps(result))
