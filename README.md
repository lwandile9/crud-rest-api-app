# Node.js REST API

## Overview

This is a simple REST API built with pure Node.js. It uses the HTTP and FS (File System) modules to perform CRUD (Create, Read, Update, Delete) operations. Instead of a database, data is stored in a JSON file.

## Features

- **POST /items**: Create a new item.
- **GET /items**: Retrieve all items.
- **GET /items/id**: Retrieve a single item by ID.
- **PUT /items/id**: Update an existing item by ID.
- **DELETE /items/id**: Delete an item by ID.

## Getting Started

### Prerequisites

- Node.js installed
- npm (Node package manager)

### Installation

1. Clone the repository:

   Run the following comand in cm or any terminal of your choice: (VS code terminal recomended)
   
   git clone https://github.com/lwandile9/crud-rest-api-app.git

2. open thw folder using VS code and Run the following comands

    npm install   - this will install dependencies ( not required in this project though  )
   to start the server   run this  comand : node index.js ( this will provoke node to run the file )

   The API will be available at http://localhost:10111.

### API Endpoints

Create Item
Method: POST
Endpoint: /items

Get All Items
Method: GET
Endpoint: /items

Get Item by ID
Method: GET
Endpoint: /items/id


Update Item
Method: PUT
Endpoint: /items/id

Delete Item
Method: DELETE
Endpoint: /items/id



   

