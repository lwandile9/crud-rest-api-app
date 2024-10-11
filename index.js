const http = require('http');
const url = require('url');
const fs = require('fs').promises;

const itemsFile = './items.json';
const PORT = 10111;
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const CONTENT_TYPE_HTML = { "Content-Type": "text/html" };

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
   

    if (req.method === 'GET' && (parsedUrl.path === '/' || parsedUrl.path === '/items')) {
        await handleGetRequest(res, parsedUrl);
    } else if (req.method === 'POST' && parsedUrl.path === '/items') {
        await handlePostRequest(req, res);
    } else if (req.method === 'PUT' && parsedUrl.path.startsWith('/items/')) {
        await handlePutRequest(req, res, parsedUrl);
    } else if (req.method === 'DELETE' && parsedUrl.path.startsWith('/items/')) {
        await handleDeleteRequest(res, parsedUrl);
    } else {
        sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Method not allowed' });
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const sendResponse = (res, statusCode, contentType, data) => {
    res.writeHead(statusCode, contentType);
    res.end(JSON.stringify(data));
};

// Handle GET request
const handleGetRequest = async (res, parsedUrl) => {
    try {
        const data = await fs.readFile(itemsFile, 'utf-8');
        const items = JSON.parse(data);

        if (parsedUrl.path === '/') {
            sendResponse(res, 200, CONTENT_TYPE_HTML, `<b>Welcome to the Items API. Go to <a href='/items'>items</a> to view all items.</b>`);
        } else {
            sendResponse(res, 200, CONTENT_TYPE_JSON, items);
        }
    } catch (error) {
        sendResponse(res, 500, CONTENT_TYPE_JSON, { error: 'Error reading items' });
    }
};

// Handle POST request
const handlePostRequest = async (req, res) => {
    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk;
    });

    req.on('end', async () => {
        try {
            const newItem = JSON.parse(requestBody);
            const data = await fs.readFile(itemsFile, 'utf-8');
            const items = JSON.parse(data);

            newItem.id = items.length + 1; // Assign a new ID
            items.push(newItem);

            await fs.writeFile(itemsFile, JSON.stringify(items, null, 2)); // Save the updated items list
            sendResponse(res, 201, CONTENT_TYPE_JSON, newItem);
        } catch (error) {
            sendResponse(res, 500, CONTENT_TYPE_JSON, { error: 'Error saving item' });
        }
    });
};

// Handle PUT request
const handlePutRequest = async (req, res, parsedUrl) => {
    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk;
    });

    req.on('end', async () => {
        const itemId = parseInt(parsedUrl.path.split('/').pop());
        try {
            const updatedItem = JSON.parse(requestBody);
            const data = await fs.readFile(itemsFile, 'utf-8');
            const items = JSON.parse(data);

            const itemIndex = items.findIndex(i => i.id === itemId);
            if (itemIndex !== -1) {
                items[itemIndex] = { ...items[itemIndex], ...updatedItem, id: itemId };
                await fs.writeFile(itemsFile, JSON.stringify(items, null, 2));
                sendResponse(res, 200, CONTENT_TYPE_JSON, items[itemIndex]);
            } else {
                sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Item not found' });
            }
        } catch (error) {
            sendResponse(res, 500, CONTENT_TYPE_JSON, { error: 'Error updating item' });
        }
    });
};

// Handle DELETE request
const handleDeleteRequest = async (res, parsedUrl) => {
    const itemId = parseInt(parsedUrl.path.split('/').pop());
    try {
        const data = await fs.readFile(itemsFile, 'utf-8');
        let items = JSON.parse(data);

        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            items = items.filter(i => i.id !== itemId);
            await fs.writeFile(itemsFile, JSON.stringify(items, null, 2));
            sendResponse(res, 200, CONTENT_TYPE_JSON, { message: `Item with id ${itemId} deleted successfully` });
        } else {
            sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Item not found' });
        }
    } catch (error) {
        sendResponse(res, 500, CONTENT_TYPE_JSON, { error: 'Error deleting item' });
    }
};
