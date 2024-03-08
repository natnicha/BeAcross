import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.config.config_utils import env_config
from azure.storage.blob import BlobServiceClient
import json

def init_conn():
    return BlobServiceClient.from_connection_string(env_config.AZURE)

def read_res_file():
    conn = init_conn()
    container_name = "results"
    blob_name = "result.json"

    blob_client = conn.get_blob_client(container=container_name, blob=blob_name)
    # List the blobs in the container
    blob_content = blob_client.download_blob().readall()

    res = json.loads(blob_content)
    return res

def write_res_file(data):
    conn = init_conn()
    container_name = "results"
    blob_name = "result.json"

    blob_client = conn.get_blob_client(container=container_name, blob=blob_name)
    content = json.dumps(data)  # Serialize dictionary into JSON string
    blob_client.upload_blob(content, overwrite=True)  # Upload updated content back to blob