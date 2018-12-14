# Local SSL tutorial

In this tutorial, we will be covering how to setup a server running on localhost with a `https` by creating a self-signed certificate.

## setup

1. clone
2. npm install

## Create self-signed certificate

1. run `cd cert`

2. Generate a rsa private key. This key will be used to sign our CSR and encrypt our traffic.  Remember the passphase for later
- run `openssl genrsa -des3 -out server.key 2048`

3. Generate a CSR using private key:
- run `openssl req -new -key server.key -out server.csr`
- enter passphase from step 2
- set `Common Name (CN)` to `localhost`
- everything else can be anything

4. Create certificate by signing the `.csr`. This step would typically be completed by a CA like [letsencrypt](https://letsencrypt.org/) (thus why we call this a "self-signed" certificate)
- run `openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt -extfile v3.ext`
- The `-extfile v3.ext` is an [extra param we have to do here to get chrome to trust our localhost certificate](https://serverfault.com/questions/880804/can-not-get-rid-of-neterr-cert-common-name-invalid-error-in-chrome-with-self)

You now should have the following files in your `cert` directory:

- server.key: your secret key
- server.csr: the certificate signing request.  Can be deleted
- server.crt: your self-signed public certificate

For a deeper explanation of each command [tutorial](https://www.akadia.com/services/ssh_test_certificate.html).  It's worth nothing that this whole process can be accomplished in a single command, but the individual steps were left in here for learning purposes.

## Running the server

1. back in the project root, create a new file called `.env` with the following content:

```
PASSPHASE=your_key_passphase
```

2. run `npm start`.  You should see the message "server running at 3000"

3. navigate to [https://localhost:3000](https://localhost:3000/)

4. you should be presented with a `ERR_CERT_AUTHORITY_INVALID` error.  This is because our system does NOT TRUST the issuer of our TSL certificate.

# Trusting your self-signed cert

When you get a certificate signed by a CA, you're system knows to trust it because the issuer's signing certificate is already included in your systems trust store.  However, our self-signed certificate will NOT be trusted unless we explicitly tell our system to trust it.

To get osx to trust the certificate:

1. Navigate to `server.crt` in finder
2. double click it. keystore should open and you will be prompted for your os password
3. The certificate is now installed but still not trusted. To make it trusted, double click the certificate in keystore
4. expand the trust section
5. click always
6. close the window and enter password again
7. Reload [https://localhost:3000](https://localhost:3000/) and you should now see the error is gone