# Test cases

## admin

1. POST /signin with basic-auth - 200
2. GET /info with access-token - 200
3. POST /refresh with access-token - 400
4. POST /refresh with refresh-token - 200
4. POST /refresh with refresh-token again - 401

## install

1. GET / with nothing - 404