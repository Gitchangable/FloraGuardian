import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
import time


cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


doc = db.collection("profiles").document("7fX6EwQfdvgp20IDMeJeYFiEXgl2").collection("plants").document("1744783350637")



import time

# Initial sensor values
light = 583
soilMoisture = 34
temp = 20

# Direction variables (1 for increasing, -1 for decreasing)
light_direction = 1
soilMoisture_direction = 1
temp_direction = 1

# Set boundaries for each sensor
light_min, light_max = 0, 1000
soilMoisture_min, soilMoisture_max = 0, 100
temp_min, temp_max = 15, 37

while True:
    # Update sensor values using their respective directions
    light += light_direction
    soilMoisture += soilMoisture_direction
    temp += temp_direction

    # Reverse direction if a sensor value hits a boundary
    if light >= light_max or light <= light_min:
        light_direction *= -1
    if soilMoisture >= soilMoisture_max or soilMoisture <= soilMoisture_min:
        soilMoisture_direction *= -1
    if temp >= temp_max or temp <= temp_min:
        temp_direction *= -1

    # Update the document (assuming doc is defined and connected appropriately)
    doc.update({
        "sensors": {
            "light": light,
            "soilMoisture": soilMoisture,
            "temp": temp
        }
    })
    
    # Wait 1 second before the next update
    time.sleep(1)

