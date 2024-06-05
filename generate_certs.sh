#!/bin/bash

# Create the certs directory if it does not exist
mkdir -p ./certs

# Step 1: Create the Root CA Key and Certificate
openssl genrsa -out ./certs/rootCA.key 4096
openssl req -x509 -new -nodes -key ./certs/rootCA.key -sha256 -days 1024 -out ./certs/rootCA.pem -subj "/C=US/ST=California/L=San Francisco/O=Your Organization/CN=Your Root CA"

# Step 2: Generate the Server Key and Certificate Signing Request (CSR)
openssl genrsa -out ./certs/server.key 4096
openssl req -new -key ./certs/server.key -out ./certs/server.csr -config ./certs/server.cnf

# Step 3: Sign the Server Certificate with the Root CA
openssl x509 -req -in ./certs/server.csr -CA ./certs/rootCA.pem -CAkey ./certs/rootCA.key -CAcreateserial -out ./certs/server.crt -days 500 -sha256 -extfile ./certs/server.cnf -extensions req_ext

# Clean up unnecessary files
rm ./certs/rootCA.srl ./certs/server.csr ./certs/rootCA.key

echo "Finished generating certificates. Cleaned up unnecessary files."
