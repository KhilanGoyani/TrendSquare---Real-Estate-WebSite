import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'Datasets/property_updated_data.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_csv(DATA_PATH)

# Clean Price column (remove currency symbol and convert Cr/L to numbers)
def clean_price(price_str):
    try:
        price_str = str(price_str).replace('₹', '').replace(',', '').strip().lower()
        if 'cr' in price_str:
            return float(price_str.replace('cr', '').strip()) * 1e7
        elif 'l' in price_str or 'lac' in price_str:
            # covers 'l' and 'lacs'
            price_str = price_str.replace('lacs', '').replace('lac', '').replace('l', '').strip()
            return float(price_str) * 1e5
        elif 'k' in price_str:
            return float(price_str.replace('k', '').strip()) * 1e3
        else:
            return float(price_str)
    except Exception as e:
        print(f"Warning: Could not convert price '{price_str}': {e}")
        return np.nan


df['price'] = df['Price'].apply(clean_price)

# Drop rows with NaN in price or important features
df = df.dropna(subset=['price', 'Location', 'Property_Type', 'BHK', 'Baths', 'Balcony', 'Total_Area'])

# Convert Balcony Yes/No to 1/0
df['balcony'] = df['Balcony'].apply(lambda x: 1 if str(x).strip().lower() == 'yes' else 0)

# Lowercase categorical columns for consistency
df['location'] = df['Location'].str.lower()
df['property_type'] = df['Property_Type'].str.lower()

# Encode categorical columns
location_encoder = LabelEncoder()
df['location_encoded'] = location_encoder.fit_transform(df['location'])

property_type_encoder = LabelEncoder()
df['property_type_encoded'] = property_type_encoder.fit_transform(df['property_type'])

# Prepare features and target
X = df[['location_encoded', 'property_type_encoded', 'BHK', 'Baths', 'balcony', 'Total_Area']]
y = df['price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
# Save model and encoders
joblib.dump(model, os.path.join(MODEL_DIR, 'price_model.pkl'))
joblib.dump(location_encoder, os.path.join(MODEL_DIR, 'location_encoder.pkl'))
joblib.dump(property_type_encoder, os.path.join(MODEL_DIR, 'property_type_encoder.pkl'))

print("Model and encoders saved successfully!")
