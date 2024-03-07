import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.config.config_utils import env_config
from azure.storage.blob import BlobServiceClient

def init():
    blob_service_client = BlobServiceClient.from_connection_string(env_config.AZURE)
