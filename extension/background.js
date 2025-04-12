async function fetchProductsFromAPI(keywords, topK = 5) {
    try {
        // Ensure keywords is an array (if not, wrap it in an array)
        if (!Array.isArray(keywords)) {
            keywords = [keywords];
        }
        
        const response = await fetch('http://localhost:8000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords: keywords,  // Correct property name as expected by the API
                top_k: topK
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}
// Function to find matching products using the API
async function findMatchingProducts(keywords) {
    if (!keywords || !Array.isArray(keywords)) return null;
    
    try {
        // Fetch products from the API
        const products = await fetchProductsFromAPI(keywords);
        
        if (!products || products.length === 0) {
            console.log('No matching products found');
            return null;
        }
        
        // Return the first product (most similar)
        return products[0];
    } catch (error) {
        console.error('Error in findMatchingProducts:', error);
        return null;
    }
}

// Function to send a POST request
async function parseUrl(url) {
    try {
        const response = await fetch("http://localhost:3000/parse_url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();
        console.log("Response from API and keywords is:", data);
        console.log("Keywords in the current URL are:", data.keywords);

        // Find matching product based on keywords using the API
        const matchingProduct = await findMatchingProducts(data.keywords);

        // Send keywords and matching product to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "check_keywords", 
                    keywords: data.keywords,
                    matchingProduct: matchingProduct
                });
            }
        });
    } catch (error) {
        console.error("Error making request:", error);
    }
}

// Trigger API request when a tab is updated and fully loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("URL that we are currently on is:", tab.url);
        parseUrl(tab.url);
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "searchProducts") {
    // First, send URL to parse_url endpoint
    fetch('http://localhost:3000/parse_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: request.url })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`URL parsing error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Parsed keywords from URL parser:", data.keywords);
      
      // Now send the parsed keywords to the FastAPI backend
      return fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: data.keywords,
          top_k: 5  // You can make this configurable if needed
        })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`FastAPI error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      sendResponse({ data: data });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ error: error.message });
    });
    
    return true; // Required for async response
  }
});

// Update the getProduct message listener to use the API
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "getProduct") {
        console.log("Getting product details");
        if (request.keywords) {
            const matchingProduct = await findMatchingProducts(request.keywords);
            console.log("Matching product found:", matchingProduct);
            sendResponse({ product: matchingProduct });
        } else {
            sendResponse({ product: null });
        }
    }
    return true;
});

// Function to get cookies
const getCookies = async () => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({}, (cookies) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(cookies);
            }
        });
    });
};

// Function to parse cookies
const parseCookies = async () => {
    try {
        const cookies = await getCookies();
        if (!cookies.length) {
            console.warn("No cookies found");
            return;
        }

        // Convert cookies to key-value pairs
        const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");

        console.log("Sending cookies:", cookieHeader);

        const response = await fetch("http://localhost:3001/parse_cookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response from API:", data);
    } catch (err) {
        console.error("Error making request:", err);
    }
};
