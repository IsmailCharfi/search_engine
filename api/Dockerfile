# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Install Tesseract and any additional dependencies your script may need
RUN apt-get update && apt-get install -y tesseract-ocr

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run your Python script when the container launches
CMD ["python", "./app.py"]

EXPOSE 5000
