import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.config.config_utils import env_config
from azure.storage.blob import BlobServiceClient
import json

def init():
    blob_service_client = BlobServiceClient.from_connection_string(env_config.AZURE)
    print("\nListing blobs...")
    container_name = "results"
    blob_name = "result.json"

    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    # List the blobs in the container
    blob_content = blob_client.download_blob().readall()

    json_data = json.loads(blob_content)

    # Now json_data is a dictionary containing the contents of the JSON blob
    print(json_data)
    