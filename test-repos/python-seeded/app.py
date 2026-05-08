import requests  # Unused import
from flask import Flask, request
import json
import os  # Unused import
import sys  # Unused import
from typing import Any

app = Flask(__name__)

# Hardcoded configuration
DATABASE_URL = "postgresql://user:password@localhost:5432/mydb"
SECRET_KEY = "hardcoded-secret-key-12345"
API_KEY = "sk-1234567890abcdef"

# TODO: Move configuration to environment variables
# FIXME: This is a security risk - credentials should not be in code

def process_user_data(user_id, user_data, config, logger, cache, database, auth_token, request_context):
    """
    This is a god function that does way too many things and has 200+ lines.
    It should be split into multiple smaller functions.

    TODO: Refactor this massive function
    HACK: This is a temporary implementation
    XXX: This logic is duplicated in three other places
    """

    # Bare except block - BAD!
    try:
        # Validate user
        if not user_data.get("name"):
            raise ValueError("Name is required")

        if not user_data.get("email"):
            raise ValueError("Email is required")

        # Complex nested logic
        if user_data.get("type") == "premium":
            if user_data.get("age") > 18:
                if user_data.get("country") in ["US", "CA", "UK"]:
                    discount = 0.20
                else:
                    discount = 0.10
            else:
                discount = 0.05
        else:
            discount = 0

        # Process data
        print(f"DEBUG: Processing user {user_id}")  # Debug logging in production code
        print(f"DEBUG: User data: {user_data}")
        print(f"DEBUG: Discount: {discount}")

        # Store in database
        query = f"INSERT INTO users (id, name, email, type) VALUES ({user_id}, '{user_data['name']}', '{user_data['email']}', '{user_data['type']}')"
        # FIXME: SQL injection vulnerability!

        # Update cache
        cache[user_id] = user_data

        # Make API call
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"http://localhost:3000/users/{user_id}",
            json=user_data,
            headers=headers,
            timeout=5
        )

        # Magic numbers without explanation
        if response.status_code == 200:
            return {"success": True, "discount": discount}
        elif response.status_code == 400:
            return {"success": False, "error": "Bad request"}
        elif response.status_code == 401:
            return {"success": False, "error": "Unauthorized"}
        elif response.status_code == 403:
            return {"success": False, "error": "Forbidden"}
        elif response.status_code == 404:
            return {"success": False, "error": "Not found"}
        elif response.status_code == 500:
            return {"success": False, "error": "Server error"}
        else:
            return {"success": False, "error": "Unknown error"}

    except:
        # Bare except - catches everything without logging
        pass

    except Exception as e:
        # FIXME: Silent failure - should log the error
        print(f"Error: {str(e)}")

    return None


def calculate_metrics(data_points):
    """Long method with no tests covering it."""
    total = 0
    count = 0
    min_val = None
    max_val = None

    for point in data_points:
        if isinstance(point, (int, float)):
            total += point
            count += 1

            if min_val is None or point < min_val:
                min_val = point
            if max_val is None or point > max_val:
                max_val = point

    if count == 0:
        return None

    average = total / count

    # HACK: Temporary calculation, needs proper implementation
    variance = 0
    for point in data_points:
        if isinstance(point, (int, float)):
            variance += (point - average) ** 2
    variance = variance / count

    import math
    std_dev = math.sqrt(variance)

    return {
        "count": count,
        "sum": total,
        "average": average,
        "min": min_val,
        "max": max_val,
        "variance": variance,
        "std_dev": std_dev
    }


@app.route("/process", methods=["POST"])
def handle_request():
    """Handle user request - no error handling."""
    try:
        data = request.get_json()
        user_id = data["user_id"]  # Will crash if missing

        # TODO: Add proper validation
        result = process_user_data(
            user_id,
            data,
            app.config,
            None,
            {},
            None,
            None,
            None
        )

        return result, 200

    except:
        # Bare except with no error handling
        return {"error": "Internal server error"}, 500


def deprecated_function():
    """This function is deprecated but still being used."""
    # TODO: Remove this function after migration
    pass


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
