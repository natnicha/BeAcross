import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.config.config_utils import env_config
from azure.storage.blob import BlobServiceClient
import json
from owlready2 import *

res_container_name = "results"
res_blob_name = "result.json"
owl_blob_name = "modules.owl"

def init_conn():
    return BlobServiceClient.from_connection_string(env_config.AZURE)

def read_res_file():
    conn = init_conn()

    blob_client = conn.get_blob_client(container=res_container_name, blob=res_blob_name)
    # List the blobs in the container
    blob_content = blob_client.download_blob().readall()
    etag = blob_client.get_blob_properties().etag
    res = json.loads(blob_content)
    return res,etag

def write_res_file(data):
    conn = init_conn()

    blob_client = conn.get_blob_client(container=res_container_name, blob=res_blob_name)
    content = json.dumps(data, indent=2) # Serialize dictionary into JSON string
    print(content)
    blob_client.upload_blob(content, overwrite=True)  # Upload updated content back to blob


def download_owl_file():

    # Initialize BlobServiceClient using your connection string
    conn = init_conn()

    # Get a BlobClient for the blob you want to download
    blob_client = conn.get_blob_client(container=res_container_name, blob=owl_blob_name)
    blob_data = blob_client.download_blob()
    etag = blob_client.get_blob_properties().etag

    return blob_data,etag

def write_owl_file(path):
    conn = init_conn()
    blob_client = conn.get_blob_client(container=res_container_name, blob=owl_blob_name)
    # Upload the local file to the blob, overwriting the existing blob
    with open(path, "rb") as local_file:
        blob_client.upload_blob(local_file, overwrite=True)

def check_etag(before, during):
    if before == during:
        return True
    else:
        return False
    
def get_etag(blob_name):
    conn = init_conn()

    blob_client = conn.get_blob_client(container=res_container_name, blob=blob_name)
    etag = blob_client.get_blob_properties().etag
    return etag