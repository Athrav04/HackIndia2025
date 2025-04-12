// Function to extract product information from Amazon page
function extractProductInfo() {
    const productInfo = {
        name: document.getElementById('productTitle')?.textContent.trim(),
        price: document.querySelector('.a-price-whole')?.textContent.trim(),
        currency: document.querySelector('.a-price-symbol')?.textContent.trim(),
        description: document.getElementById('productDescription')?.textContent.trim() ||
                    document.getElementById('feature-bullets')?.textContent.trim(),
        url: window.location.href
    };

    // Extract ASIN from URL
    const asinMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
    if (asinMatch) {
        productInfo.asin = asinMatch[1];
    }

    // Extract rating
    const ratingElement = document.querySelector('.a-icon-alt');
    if (ratingElement) {
        productInfo.rating = ratingElement.textContent.trim();
    }

    // Extract review count
    const reviewCountElement = document.getElementById('acrCustomerReviewText');
    if (reviewCountElement) {
        productInfo.reviewCount = reviewCountElement.textContent.trim();
    }

    // Extract sustainability features
    const sustainabilitySection = Array.from(document.querySelectorAll('*')).find(
        element => element.textContent.toLowerCase().includes('sustainability features')
    );
    if (sustainabilitySection) {
        const features = [];
        const parent = sustainabilitySection.closest('div');
        if (parent) {
            const listItems = parent.querySelectorAll('li, p');
            listItems.forEach(item => {
                const text = item.textContent.trim();
                if (text) features.push(text);
            });
        }
        productInfo.sustainabilityFeatures = features;
        productInfo.sustainabilityCertified = true;
    }

    return productInfo;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getProductInfo") {
        const productInfo = extractProductInfo();
        sendResponse({productInfo: productInfo});
    }
    return true;
}); 